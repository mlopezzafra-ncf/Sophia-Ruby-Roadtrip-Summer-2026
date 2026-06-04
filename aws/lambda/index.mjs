import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from '@aws-sdk/lib-dynamodb';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const s3 = new S3Client({});
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.TABLE_NAME;
const MEDIA_BUCKET = process.env.MEDIA_BUCKET;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'access-control-allow-origin': ALLOWED_ORIGIN,
    'access-control-allow-methods': 'GET,POST,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-type': 'application/json'
  },
  body: body == null ? '' : JSON.stringify(body)
});

const parseBody = event => {
  if (!event.body) return {};
  const text = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  return JSON.parse(text);
};

const cleanFileName = name => String(name || 'upload.bin').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
const now = () => new Date().toISOString();

export const handler = async event => {
  try {
    if (event.requestContext.http.method === 'OPTIONS') return json(204);

    const method = event.requestContext.http.method;
    const path = event.rawPath.replace(/\/$/, '') || '/';

    if (method === 'GET' && path === '/photos') return listPhotos();
    if (method === 'POST' && path === '/photos/presign') return presignPhoto(parseBody(event));
    if (method === 'POST' && path === '/photos/complete') return completePhoto(parseBody(event));
    if (method === 'DELETE' && path.startsWith('/photos/')) return deletePhoto(decodeURIComponent(path.split('/').pop()));

    if (method === 'GET' && path === '/expenses') return listExpenses();
    if (method === 'POST' && path === '/expenses') return saveExpense(parseBody(event));
    if (method === 'DELETE' && path.startsWith('/expenses/')) return deleteExpense(decodeURIComponent(path.split('/').pop()));

    return json(404, {message: 'Not found'});
  } catch (err) {
    console.error(err);
    return json(500, {message: err.message || 'Server error'});
  }
};

async function listPhotos(){
  const result = await ddb.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {':pk': 'PHOTO'}
  }));
  const photos = await Promise.all((result.Items || [])
    .filter(item => item.status === 'uploaded')
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map(async item => ({
      ...item,
      photoId: item.sk,
      url: await getSignedUrl(s3, new GetObjectCommand({Bucket: MEDIA_BUCKET, Key: item.s3Key}), {expiresIn: 3600})
    })));
  return json(200, {photos});
}

async function presignPhoto(input){
  const photoId = crypto.randomUUID();
  const fileName = cleanFileName(input.fileName);
  const contentType = input.contentType || 'application/octet-stream';
  const s3Key = `media/${photoId}/${fileName}`;
  const createdAt = now();
  const photo = {
    pk: 'PHOTO',
    sk: photoId,
    s3Key,
    fileName,
    contentType,
    caption: input.caption || '',
    takenBy: input.takenBy || '',
    locationNote: input.locationNote || '',
    lat: input.lat == null ? null : Number(input.lat),
    lng: input.lng == null ? null : Number(input.lng),
    accuracyMeters: input.accuracyMeters == null ? null : Number(input.accuracyMeters),
    status: 'pending',
    createdAt,
    updatedAt: createdAt
  };
  await ddb.send(new PutCommand({TableName: TABLE_NAME, Item: photo}));
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({Bucket: MEDIA_BUCKET, Key: s3Key, ContentType: contentType}),
    {expiresIn: 900}
  );
  return json(200, {uploadUrl, photo: {...photo, photoId}});
}

async function completePhoto(input){
  if (!input.photoId) return json(400, {message: 'photoId is required'});
  const updatedAt = now();
  await ddb.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {pk: 'PHOTO', sk: input.photoId},
    UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: {'#status': 'status'},
    ExpressionAttributeValues: {':status': 'uploaded', ':updatedAt': updatedAt}
  }));
  return json(200, {photoId: input.photoId, status: 'uploaded'});
}

async function deletePhoto(photoId){
  const existing = await ddb.send(new GetCommand({TableName: TABLE_NAME, Key: {pk: 'PHOTO', sk: photoId}}));
  if (existing.Item && existing.Item.s3Key) {
    await s3.send(new DeleteObjectCommand({Bucket: MEDIA_BUCKET, Key: existing.Item.s3Key}));
  }
  await ddb.send(new DeleteCommand({TableName: TABLE_NAME, Key: {pk: 'PHOTO', sk: photoId}}));
  return json(204);
}

async function listExpenses(){
  const result = await ddb.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {':pk': 'EXPENSE'}
  }));
  const expenses = (result.Items || [])
    .map(item => ({...item, expenseId: item.sk}))
    .sort((a, b) => Number(a.ts || 0) - Number(b.ts || 0));
  return json(200, {expenses});
}

async function saveExpense(input){
  const expenseId = input.expenseId || crypto.randomUUID();
  const expense = {
    pk: 'EXPENSE',
    sk: expenseId,
    expenseId,
    desc: input.desc || '',
    cat: input.cat || 'misc',
    paidBy: input.paidBy || '',
    amt: Number(input.amt || 0),
    ts: Number(input.ts || Date.now()),
    updatedAt: now()
  };
  await ddb.send(new PutCommand({TableName: TABLE_NAME, Item: expense}));
  return json(200, {expense});
}

async function deleteExpense(expenseId){
  await ddb.send(new DeleteCommand({TableName: TABLE_NAME, Key: {pk: 'EXPENSE', sk: expenseId}}));
  return json(204);
}
