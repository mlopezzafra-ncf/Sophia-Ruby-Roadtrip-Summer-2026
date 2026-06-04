# AWS Setup Guide: Road Trip Media and Expenses

This guide adds AWS-backed uploads and expense storage to the static site.

Architecture:

- Static website calls one Lambda Function URL.
- Lambda creates presigned S3 upload/download URLs.
- Browser uploads photos/videos directly to S3 using the presigned upload URL.
- Lambda stores photo/video metadata and Budget expenses in DynamoDB.
- Leaflet keeps the existing trip route and adds media markers from DynamoDB metadata.

The code expects these endpoints on the Lambda Function URL:

- `GET /photos`
- `POST /photos/presign`
- `POST /photos/complete`
- `DELETE /photos/{photoId}`
- `GET /expenses`
- `POST /expenses`
- `DELETE /expenses/{expenseId}`

## 1. Root Account Safety

You said this project is only used by about 5 people and you plan to use the root account. These instructions assume that, but do this first:

1. Sign in to the AWS Console as root.
2. Open the account menu in the top-right corner.
3. Choose **Security credentials**.
4. Enable MFA for the root user.
5. Do not create long-lived root access keys.

The website API below is intentionally simple. If the Lambda Function URL uses `Auth type: NONE`, anyone who knows the URL can upload/delete media and expenses. For a small family project, keep the URL out of public repos and only paste it into the static site you control.

## 2. Pick One Region

Use one AWS Region for every service. Recommended:

- `us-east-1` if you are unsure
- Or your closest region

In the AWS Console top-right Region selector, choose the Region and keep it selected for S3, DynamoDB, IAM, and Lambda.

## 3. Create the S3 Bucket

1. Open **S3**.
2. Choose **Create bucket**.
3. Bucket name: use a globally unique name, for example:

   ```text
   sophia-ruby-roadtrip-media-2026-yourinitials
   ```

4. AWS Region: same Region from step 2.
5. Object Ownership: **ACLs disabled**.
6. Block Public Access: leave **Block all public access** enabled.
7. Bucket Versioning: optional, **Disable** is fine.
8. Default encryption: **Amazon S3 managed keys (SSE-S3)**.
9. Choose **Create bucket**.

### Add S3 CORS

1. Open the bucket.
2. Go to **Permissions**.
3. Scroll to **Cross-origin resource sharing (CORS)**.
4. Choose **Edit**.
5. Paste this. Replace the origins with your actual site origin after deployment. Keep `http://localhost:8000` while testing locally.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:8000",
      "https://YOUR_STATIC_SITE_DOMAIN"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

6. Choose **Save changes**.

## 4. Create the DynamoDB Table

1. Open **DynamoDB**.
2. Choose **Tables**.
3. Choose **Create table**.
4. Table name:

   ```text
   RoadTripApp
   ```

5. Partition key:

   ```text
   pk
   ```

   Type: **String**

6. Sort key:

   ```text
   sk
   ```

   Type: **String**

7. Table settings: **Customize settings**.
8. Capacity mode: **On-demand**.
9. Leave the other defaults.
10. Choose **Create table**.

This single table stores:

- Photos with `pk = PHOTO`, `sk = photoId`
- Expenses with `pk = EXPENSE`, `sk = expenseId`

## 5. Create the Lambda Execution Role

1. Open **IAM**.
2. Go to **Roles**.
3. Choose **Create role**.
4. Trusted entity type: **AWS service**.
5. Use case: **Lambda**.
6. Choose **Next**.
7. Add permissions:
   - `AWSLambdaBasicExecutionRole`
8. Choose **Next**.
9. Role name:

   ```text
   RoadTripLambdaRole
   ```

10. Choose **Create role**.

### Add Inline Permissions

1. Open the new `RoadTripLambdaRole`.
2. Choose **Add permissions**.
3. Choose **Create inline policy**.
4. Choose **JSON**.
5. Paste this, replacing:
   - `YOUR_REGION`
   - `YOUR_ACCOUNT_ID`
   - `YOUR_BUCKET_NAME`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:YOUR_REGION:YOUR_ACCOUNT_ID:table/RoadTripApp"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

6. Choose **Next**.
7. Policy name:

   ```text
   RoadTripAppDataAccess
   ```

8. Choose **Create policy**.

To find your account ID, open the account menu in the top-right corner of the AWS Console.

## 6. Package the Lambda in AWS CloudShell

The Lambda uses AWS SDK v3 packages. The easiest Console-only path is AWS CloudShell.

1. In the AWS Console top bar, choose the **CloudShell** icon.
2. Wait for the terminal to open.
3. Create a working folder:

```bash
mkdir roadtrip-api
cd roadtrip-api
```

4. Create `package.json`:

```bash
cat > package.json <<'EOF'
{
  "name": "roadtrip-aws-api",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.600.0",
    "@aws-sdk/client-s3": "^3.600.0",
    "@aws-sdk/lib-dynamodb": "^3.600.0",
    "@aws-sdk/s3-request-presigner": "^3.600.0"
  }
}
EOF
```

5. Create `index.mjs`. Copy the full contents of this repo file:

```text
aws/lambda/index.mjs
```

Paste it into CloudShell:

```bash
cat > index.mjs <<'EOF'
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
EOF
```

6. Install dependencies and zip the function:

```bash
npm install --omit=dev
zip -r roadtrip-api.zip index.mjs package.json node_modules
```

7. From the CloudShell **Actions** menu, choose **Download file**.
8. Download:

```text
roadtrip-api/roadtrip-api.zip
```

## 7. Create the Lambda Function

1. Open **Lambda**.
2. Choose **Create function**.
3. Choose **Author from scratch**.
4. Function name:

   ```text
   RoadTripApi
   ```

5. Runtime: **Node.js 20.x** or newer.
6. Architecture: **x86_64**.
7. Permissions:
   - Expand **Change default execution role**.
   - Choose **Use an existing role**.
   - Select `RoadTripLambdaRole`.
8. Choose **Create function**.

### Upload the Zip

1. In the Lambda function page, open the **Code** tab.
2. Choose **Upload from**.
3. Choose **.zip file**.
4. Upload `roadtrip-api.zip`.
5. Choose **Save**.

### Set the Handler

1. Go to **Runtime settings**.
2. Choose **Edit**.
3. Handler:

   ```text
   index.handler
   ```

4. Choose **Save**.

### Add Environment Variables

1. Go to **Configuration**.
2. Choose **Environment variables**.
3. Choose **Edit**.
4. Add:

| Key | Value |
| --- | --- |
| `TABLE_NAME` | `RoadTripApp` |
| `MEDIA_BUCKET` | Your S3 bucket name |
| `ALLOWED_ORIGIN` | Your static site origin, or `*` while testing |

5. Choose **Save**.

## 8. Create the Lambda Function URL

1. In Lambda, open `RoadTripApi`.
2. Go to **Configuration**.
3. Choose **Function URL**.
4. Choose **Create function URL**.
5. Auth type:
   - Choose **NONE** for the simplest family-only setup.
6. Configure CORS: **enabled**.
7. Allow origin:
   - `http://localhost:8000` while testing
   - Your static site origin when deployed
   - Or `*` temporarily
8. Allow methods:
   - `GET`
   - `POST`
   - `DELETE`
9. Allow headers:
   - `content-type`
10. Choose **Save**.
11. Copy the Function URL. It looks like:

```text
https://abc123.lambda-url.us-east-1.on.aws
```

## 9. Configure the Static Site

Open:

```text
js/aws-config.js
```

Set:

```js
window.ROADTRIP_AWS = {
  apiBaseUrl: 'https://abc123.lambda-url.us-east-1.on.aws'
};
```

Use your actual Function URL. Do not add a trailing slash.

## 10. Test Locally

From the project root, run a local static server:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/map.html
```

Test media:

1. Allow browser location permission when prompted.
2. Select an image or video.
3. Add caption, taken by, and location note.
4. Choose **Upload**.
5. Confirm the item appears under the map and a marker appears on the Leaflet map.
6. Open S3 and confirm the object exists under `media/`.
7. Open DynamoDB and confirm an item exists with `pk = PHOTO`.

Open:

```text
http://localhost:8000/budget.html
```

Test expenses:

1. Add an expense.
2. Fill **Paid by**.
3. Confirm it appears in the expense list.
4. Open DynamoDB and confirm an item exists with `pk = EXPENSE`.
5. Delete it from the site and confirm it is deleted from DynamoDB.

## 11. Deploy Checklist

Before sharing with the 5 users:

1. Replace S3 CORS `AllowedOrigins` with your real static website origin.
2. Replace Lambda Function URL CORS origin with your real static website origin.
3. Set Lambda `ALLOWED_ORIGIN` to the real static website origin.
4. Keep the S3 bucket private.
5. Keep root MFA enabled.
6. Do not publish the Function URL publicly.

## 12. Operational Notes

- Photos/videos are private in S3. The site receives temporary read URLs from Lambda.
- Upload URLs expire after 15 minutes.
- Photo display URLs expire after 1 hour and are refreshed when the map page reloads.
- DynamoDB on-demand is appropriate for a tiny project.
- S3 storage and data transfer will likely be the main cost if large videos are uploaded.
