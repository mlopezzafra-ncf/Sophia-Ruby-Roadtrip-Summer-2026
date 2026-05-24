// ================= TRIP DATA =================
const TRIP_START = new Date('2026-05-29T00:00:00');

// Numbered stops on the main map (in chronological order)
const STOPS = [
  {n:1,  day:0,  name:'Hamilton, NY',     lat:42.8270, lng:-75.5446, type:'start', label:'Start'},
  {n:2,  day:1,  name:'Madison, WI',      lat:43.0731, lng:-89.4012, type:'sleep', label:"Gwen's · 3 nights"},
  {n:3,  day:4,  name:'Chamberlain, SD',  lat:43.8113, lng:-99.3279, type:'sleep', label:'Car camp'},
  {n:4,  day:5,  name:'Badlands NP',      lat:43.8554, lng:-101.9777, type:'park'},
  {n:5,  day:5,  name:'Mt. Rushmore',     lat:43.8791, lng:-103.4591, type:'stop'},
  {n:6,  day:5,  name:'Lusk, WY',         lat:42.7627, lng:-104.4521, type:'sleep', label:'Covered Wagon Motel'},
  {n:7,  day:6,  name:'Moab, UT',         lat:38.5733, lng:-109.5498, type:'sleep', label:'Airbnb · 2 nights'},
  {n:8,  day:7,  name:'Arches NP',        lat:38.7331, lng:-109.5925, type:'park'},
  {n:9,  day:8,  name:'Bryce Canyon NP',  lat:37.5930, lng:-112.1871, type:'park', label:'Car camp · 2 nights'},
  {n:10, day:10, name:'Zion NP',          lat:37.2982, lng:-113.0263, type:'park', label:'"THE ONE" Airbnb · 2 nights'},
  {n:11, day:12, name:'Kernville, CA',    lat:35.7550, lng:-118.4239, type:'sleep', label:'Whispering Pines Lodge'},
  {n:12, day:13, name:'Sequoia NP',       lat:36.4864, lng:-118.5658, type:'park'},
  {n:13, day:14, name:'Yosemite NP',      lat:37.8651, lng:-119.5383, type:'park'},
  {n:14, day:15, name:'Lake Tahoe',       lat:39.0968, lng:-120.0324, type:'sleep', label:'Hipcamp'},
  {n:15, day:16, name:'San Francisco, CA',lat:37.7749, lng:-122.4194, type:'end',   label:"Cousin's home"},
];

const DAY_COLORS = ['#C34A2C','#D97A3A','#E8B44C','#C88830','#2D5A3D','#1E4030','#1F4A5E','#1A3A4F','#8B3A3A','#6B4423','#9C4A3C','#A85D4A','#5A7040','#3B5E7E','#724F3F','#8A4B2E','#4A6B3A','#2D5A5E','#1A3A4F','#2A1810'];

// ================= STATES (local poster images) =================
const STATE_IMG = (f) => encodeURI(`State Vintage Posters/${f}`);
const STATES = [
  {code:'NY', name:'NEW YORK',      subtitle:'Where it begins',     detail:'Hamilton · Start',        img:STATE_IMG('New York State.png'),
    album:{title:'The Velvet Underground & Nico', artist:'The Velvet Underground', year:1967, note:'The NYC art-rock foundation. Opens the trip with the right mood.'}},
  {code:'PA', name:'PENNSYLVANIA',  subtitle:'Rolling through',     detail:'Drive-through',           img:STATE_IMG('Pennsylvania.png'),
    album:{title:'Born to Run', artist:'Bruce Springsteen', year:1975, note:'Every mile of I-80 demands "Thunder Road" at full volume.'}},
  {code:'OH', name:'OHIO',          subtitle:'Corn & coffee',       detail:'Drive-through',           img:STATE_IMG('Ohio.png'),
    album:{title:'Brothers', artist:'The Black Keys', year:2010, note:'Akron, Ohio blues-rock. Built for driving through Cleveland.'}},
  {code:'IN', name:'INDIANA',       subtitle:'Hoosier heartland',   detail:'Drive-through',           img:STATE_IMG('Indiana.png'),
    album:{title:'Scarecrow', artist:'John Mellencamp', year:1985, note:"Hoosier-heartland rock — small towns and open fields."}},
  {code:'IL', name:'ILLINOIS',      subtitle:'Cross the Mississippi',detail:'Drive-through',          img:STATE_IMG('Illinois.png'),
    album:{title:'Illinois', artist:'Sufjan Stevens', year:2005, note:'An entire album about the state. On the nose, perfect.'}},
  {code:'WI', name:'WISCONSIN',     subtitle:'Cheese & lakes',      detail:'3 nights · Madison',      img:STATE_IMG('Wisconsin.png'),
    album:{title:'For Emma, Forever Ago', artist:'Bon Iver', year:2007, note:'Recorded in a remote Wisconsin cabin. Listen in the woods.'}},
  {code:'MN', name:'MINNESOTA',     subtitle:'Land of 10,000 lakes',detail:'Drive-through',           img:STATE_IMG('Minnesota.png'),
    album:{title:'Purple Rain', artist:'Prince & The Revolution', year:1984, note:'Minneapolis royalty. Play it driving past the lakes.'}},
  {code:'SD', name:'SOUTH DAKOTA',  subtitle:'Badlands & Rushmore', detail:'1 night',                 img:STATE_IMG('South Dakota.png'),
    album:{title:'Nebraska', artist:'Bruce Springsteen', year:1982, note:'Stripped-down, haunted plains. Soundtrack for the Badlands.'}},
  {code:'WY', name:'WYOMING',       subtitle:'Wide open sky',       detail:'1 night · Lusk',          img:STATE_IMG('Wyoming.png'),
    album:{title:'Harvest', artist:'Neil Young', year:1972, note:'Rural, honest, wide-open. Fits Wyoming like a pair of boots.'}},
  {code:'UT', name:'UTAH',          subtitle:'Red rock country',    detail:'4 nights',                img:STATE_IMG('Utah.png'),
    album:{title:'Fleet Foxes', artist:'Fleet Foxes', year:2008, note:'Mountain folk harmonies. Put it on at sunrise in Zion.'}},
  {code:'AZ', name:'ARIZONA',       subtitle:'Corner clipped',      detail:'Drive-through',           img:STATE_IMG('Arizona.png'),
    album:{title:'Feast of Wire', artist:'Calexico', year:2003, note:'Tucson-born desert rock. Made for the Southwest crossing.'}},
  {code:'NV', name:'NEVADA',        subtitle:'Desert & neon',       detail:'Drive-through',           img:STATE_IMG('Nevada.png'),
    album:{title:"Sam's Town", artist:'The Killers', year:2006, note:"Born in Las Vegas. Pure Nevada swagger."}},
  {code:'CA', name:'CALIFORNIA',    subtitle:'The golden end',      detail:'5 nights',                img:STATE_IMG('California.png'),
    album:{title:'Hotel California', artist:'Eagles', year:1976, note:'The title track is California in six minutes. Obvious and right.'}},
  {code:'SF', name:'SAN FRANCISCO', subtitle:'The finish line',     detail:'Days 16–18 · Final stop', img:STATE_IMG('San Francisco.jpg'),
    album:{title:'American Beauty', artist:'Grateful Dead', year:1970, note:'Bay Area essence. "Ripple" as you cross the Bay Bridge.'}},
];

// ================= PARKS (local poster images) =================
const PARK_IMG = (f) => encodeURI(`National Parks/${f}`);
const NATIONAL_PARKS = [
  {name:'BADLANDS',       state:'South Dakota', days:'Day 5',       detail:'Notch Trail · Loop Road',         onTrip:true,  img:PARK_IMG('Badlands.png'),
    info:{
      established:'1978 (Monument since 1939)',
      area:'244,000 acres',
      link:'https://www.nps.gov/badl/',
      history:'The Lakota called it <em>mako sica</em> — "land bad" — for its labyrinth of spires and dry washes. The terrain is one of the world\'s richest fossil beds, full of saber-toothed cats, ancient horses, and three-toed camels from 35 million years ago. The park protects the largest mixed-grass prairie left in the U.S., where reintroduced bison, bighorn sheep, and black-footed ferrets now roam.',
      routes:[
        {name:'Badlands Loop Road (SD-240)', detail:'39 miles, ~1.5 hrs without stops. Sixteen overlooks — Big Badlands, Pinnacles, Yellow Mounds. Do it at sunrise OR sunset; the rocks change color by the minute.'},
        {name:'Sage Creek Rim Road', detail:'Gravel, often overlooked. Bison herds, prairie dog towns, and dark-sky stargazing at Sage Creek Campground.'}
      ],
      things:[
        {tag:'HIKE', text:'<strong>Notch Trail</strong> — 1.5 mi RT, climb a log ladder, end at a canyon edge with prairie views forever.'},
        {tag:'HIKE', text:'<strong>Door + Window Trails</strong> — both under a mile, easy, slot you straight into the Badlands wall.'},
        {tag:'VIEW', text:'<strong>Pinnacles Overlook at sunset</strong> — the whole formation glows pink then violet.'},
        {tag:'WILD', text:'<strong>Roberts Prairie Dog Town</strong> — a few hundred prairie dogs and the occasional burrowing owl.'},
        {tag:'STARS', text:'Badlands is a designated Dark Sky park — astronomy programs run nightly in summer at the Cedar Pass Amphitheater.'}
      ]
    }},
  {name:'ZION',           state:'Utah',         days:'Days 10–11',  detail:'The Narrows · Angels Landing',     onTrip:true,  img:PARK_IMG('Zion.png'),
    info:{
      established:'1919 (Mukuntuweap Monument, 1909)',
      area:'147,000 acres',
      link:'https://www.nps.gov/zion/',
      history:'The Anasazi farmed the canyon floor a thousand years ago; the Southern Paiute named it <em>Mukuntuweap</em> ("straight canyon"). Mormon pioneer Isaac Behunin homesteaded here in the 1860s and renamed it Zion — "place of peace." The Virgin River, only a foot deep most of the year, carved this 2,000-foot-deep sandstone canyon over millions of years and is still cutting deeper.',
      routes:[
        {name:'Zion Canyon Scenic Drive', detail:'6 miles up the main canyon. <strong>Shuttle only Mar–Nov</strong> — cars not allowed. Hop on/off at nine stops; the Temple of Sinawava is the end of the line.'},
        {name:'Zion–Mt Carmel Highway (UT-9)', detail:'The east entrance. Hairpin switchbacks climb out of the canyon and dive through a 1.1-mile sandstone tunnel blasted in 1930. Pull off at the Canyon Overlook trailhead.'},
        {name:'Kolob Canyons (I-15 exit 40)', detail:'A separate, quieter section in the park\'s northwest corner. Red rock fingers, no crowds.'}
      ],
      things:[
        {tag:'HIKE', text:'<strong>Angels Landing</strong> — 5.4 mi RT, 1,500 ft up, with chains on the final spine. Permit required (lottery). Not for vertigo.'},
        {tag:'HIKE', text:'<strong>The Narrows</strong> — wade upstream in the Virgin River through a 1,000-ft-deep slot. Rent canyoneering boots + dry pants in Springdale.'},
        {tag:'EASY', text:'<strong>Canyon Overlook Trail</strong> — 1 mi RT, mild, ends at a jaw-dropper above Pine Creek Canyon.'},
        {tag:'EASY', text:'<strong>Emerald Pools</strong> — short waterfall hikes, family-friendly, good in afternoon shade.'},
        {tag:'EPIC', text:'<strong>Observation Point</strong> via East Mesa — 7 mi RT, looks straight DOWN onto Angels Landing.'}
      ]
    }},
  {name:'YELLOWSTONE',    state:'Wyoming',      days:'Inspiration', detail:'Old Faithful · The first NP',     onTrip:false, img:PARK_IMG('Yellowstone.png'),
    info:{
      established:'March 1, 1872 — the world\'s first',
      area:'2.2 million acres',
      link:'https://www.nps.gov/yell/',
      history:'Signed into law by Ulysses S. Grant, Yellowstone invented the idea of a national park — every park on Earth is descended from it. The Shoshone, Crow, Bannock, and Blackfeet hunted and gathered here for over 11,000 years. The whole park sits inside the caldera of an active supervolcano; its last major eruption was 631,000 years ago, and the magma chamber still powers half the world\'s geysers.',
      routes:[
        {name:'Grand Loop Road', detail:'A 142-mile figure-eight that connects every major sight. Plan 3–5 days; you cannot do it in one.'},
        {name:'Upper Loop (~70 mi)', detail:'Mammoth Hot Springs, Tower Fall, Lamar Valley — the wildlife half. Wolves at dawn.'},
        {name:'Lower Loop (~96 mi)', detail:'Old Faithful, Grand Prismatic, Yellowstone Lake, the Grand Canyon of the Yellowstone — the geology half.'}
      ],
      things:[
        {tag:'GEYSER', text:'<strong>Old Faithful</strong> — erupts every ~90 min, 100–180 ft. Check the next-eruption board at the visitor center.'},
        {tag:'COLOR', text:'<strong>Grand Prismatic Spring</strong> — the rainbow hot spring. Hike up to the overlook trail for the famous aerial view.'},
        {tag:'WILD', text:'<strong>Lamar Valley at dawn</strong> — wolves, bison herds, grizzlies. Bring binoculars; it\'s called the American Serengeti.'},
        {tag:'CHASM', text:'<strong>Grand Canyon of the Yellowstone</strong> — Artist Point view of the 308-ft Lower Falls. The yellow stone the park was named for.'},
        {tag:'EASY', text:'<strong>Mammoth Hot Springs boardwalks</strong> — terraced travertine that looks like a frozen waterfall.'}
      ]
    }},
  {name:'GRAND CANYON',   state:'Arizona',      days:'Inspiration', detail:'South Rim · A mile deep',         onTrip:false, img:PARK_IMG('Grand Canyon.png'),
    info:{
      established:'1919',
      area:'1.2 million acres',
      link:'https://www.nps.gov/grca/',
      history:'Theodore Roosevelt stood on the South Rim in 1903 and said: "Leave it as it is. The ages have been at work on it, and man can only mar it." Sixteen years later it became a national park. The Colorado River carved the canyon over 5–6 million years; the schist at the bottom is 1.8 billion years old — nearly half the age of the Earth. Eleven tribes — including the Havasupai, who still live within the canyon — consider it sacred ground.',
      routes:[
        {name:'Hermit Road (West Rim Drive)', detail:'7 miles, shuttle-only Mar–Nov. Eight viewpoints including Hopi, Mohave, Pima, and the unbeatable Hermits Rest at sunset.'},
        {name:'Desert View Drive (East)', detail:'25 miles to the Desert View Watchtower. Cars allowed year-round. Stop at Grandview, Moran Point, Lipan Point.'},
        {name:'North Rim', detail:'1,000 ft higher, 220 driving miles from the South Rim, 10° cooler. Closed mid-Oct to mid-May. Quieter, greener, fewer tourists.'}
      ],
      things:[
        {tag:'VIEW', text:'<strong>Mather Point at sunrise</strong> — the classic first-time view. Get there before dawn.'},
        {tag:'WALK', text:'<strong>Rim Trail</strong> — 13 mi total, mostly flat, paved in places. Walk any chunk between shuttle stops.'},
        {tag:'HIKE', text:'<strong>Bright Angel Trail</strong> — down to 1.5-Mile Resthouse or Plateau Point (12 mi RT, serious). Carry water; the canyon is brutal in summer.'},
        {tag:'HIKE', text:'<strong>South Kaibab Trail to Ooh Aah Point</strong> — 1.8 mi RT, the best view-for-effort hike on the South Rim.'},
        {tag:'TOWER', text:'<strong>Desert View Watchtower</strong> — Mary Colter\'s 1932 stone tower at the east end. Painted interior by Hopi artist Fred Kabotie.'}
      ]
    }},
  {name:'LASSEN VOLCANIC',state:'California',   days:'Inspiration', detail:'Lassen Peak · Hot springs',       onTrip:false, img:PARK_IMG('Lassen Volcanic.png'),
    info:{
      established:'1916',
      area:'106,000 acres',
      link:'https://www.nps.gov/lavo/',
      history:'Lassen Peak is one of the largest plug-dome volcanoes on Earth. It erupted spectacularly from 1914 to 1917 — photographed in detail by B.F. Loomis, whose images helped birth modern volcanology. It sits at the southern end of the Cascade Range, where all four types of volcano on the planet (plug dome, shield, cinder cone, composite) appear within a single park. Native Atsugewi, Yana, Yahi, and Maidu people gathered seasonally around the hot springs for thousands of years.',
      routes:[
        {name:'Lassen Volcanic National Park Highway (CA-89)', detail:'30 miles through the heart of the park. Climbs to 8,512 ft at the Lassen Peak trailhead. <strong>Closed by snow Nov–June</strong> — check before you go.'},
        {name:'Butte Lake Road (northeast)', detail:'Unpaved spur to Cinder Cone and the Painted Dunes. Quieter, harder to reach.'},
        {name:'Warner Valley Road (south)', detail:'Backdoor to Boiling Springs Lake and the Devils Kitchen geothermal area.'}
      ],
      things:[
        {tag:'PEAK', text:'<strong>Lassen Peak Trail</strong> — 5 mi RT, 2,000 ft up, summit a volcano. Snow on top into July.'},
        {tag:'WEIRD', text:'<strong>Bumpass Hell</strong> — 3 mi RT boardwalk through bubbling mud pots, fumaroles, and a turquoise sulfur pool. The park\'s loudest, smelliest, best stop.'},
        {tag:'FALLS', text:'<strong>Kings Creek Falls</strong> — 2.5 mi RT, 30-ft cascade through pines.'},
        {tag:'COLOR', text:'<strong>Cinder Cone + Painted Dunes</strong> — climb a 700-ft pile of black scoria, look down on red-and-orange oxidized ash drifts.'},
        {tag:'EASY', text:'<strong>Manzanita Lake</strong> — 1.5 mi loop with a perfect mirror reflection of Lassen Peak.'}
      ]
    }},
];

const PLANNED = {food:682, gas:568, lodging:767.70, activities:100, misc:76};

const PACKING = {
  'CORE ESSENTIALS':["Driver's licenses & ID",'Credit + debit cards','Cash ($200 emergency)','Phone + charger','Power bank (2)','Car charger','AAA card / Roadside number','Printed itinerary','Paper map (backup)','Insurance info'],
  'COOKING KIT':['Camp stove + fuel','Pot + pan','Utensils + spatula','Plates + bowls + mugs','Knife + cutting board','Can opener','Matches + lighter','Dish soap + sponge','Paper towels','Trash bags (lots)'],
  'WATER & FOOD':['2× 1-gal water jugs','Reusable bottles','Cooler + ice packs','Dry goods bin','Coffee + French press','Salt, pepper, olive oil','Snacks (bars, jerky, nuts)'],
  'CAR CAMPING':['Sleeping bags','Sleeping pads','Pillows (real ones)','Blankets','Sun shades (x2)','Window mesh screens','Headlamps (x2)','Lantern','Duct tape'],
  'HIKING':['Hiking shoes','Daypacks','Hiking poles','Rain jackets','Warm layer (fleece)','Sun hats','Sunglasses','Sunscreen SPF 50','Bug spray','Blister pads'],
  'HYGIENE':['Toothbrush + paste','Biodegradable soap','Quick-dry towels','Shampoo','Deodorant','Wet wipes (lots)','Hand sanitizer','Toilet paper','Menstrual supplies'],
  'FIRST AID':['Ibuprofen / Tylenol','Benadryl','Band-aids + gauze','Antiseptic wipes','Tweezers','Moleskin','Ace bandage','Electrolyte packets','Any prescriptions'],
  'DOCUMENTS':['Passports (for ID)','Car registration','Car insurance','Park pass (America the Beautiful)','Emergency contacts (written)','Medical info card']
};

const BOOKS = {
  essentials:[
    {title:'Blue Highways', author:'William Least Heat-Moon', note:'The definitive American back-roads travelogue. A broken marriage, a van called Ghost Dancing, and a route that avoids every interstate. Start here.'},
    {title:'On the Road', author:'Jack Kerouac', note:"The original. A little messy, a little dated, a lot magical. Read when you're driving at night and the engine sounds like jazz."},
    {title:'Travels with Charley', author:'John Steinbeck', note:'Steinbeck crosses America in a camper with a French poodle. Quieter and kinder than Kerouac. Perfect for rest days.'},
    {title:'Leaves of Grass', author:'Walt Whitman', note:'Not for finishing — for opening. Pick a poem at every scenic pullout. "Song of the Open Road" goes first.'}
  ],
  regions:[
    {name:'The Great Plains & Lakota country', days:'Days 4–5 · WI to SD', books:[
      {title:'Black Elk Speaks', author:'John G. Neihardt', note:"Lakota holy man Black Elk tells his life. Essential before Rushmore — the same granite you'll photograph is carved into sacred Lakota land."},
      {title:'My Ántonia', author:'Willa Cather', note:'A quiet novel of Nebraska prairie girlhood. Reads like sun and wind.'},
      {title:'Bury My Heart at Wounded Knee', author:'Dee Brown', note:'Heavy but important. The other history of the American West.'}
    ]},
    {name:'Wyoming & the open range', days:'Day 6 · Lusk, WY', books:[
      {title:'Close Range: Wyoming Stories', author:'Annie Proulx', note:'Lean, devastating stories including "Brokeback Mountain." Proulx\'s Wyoming is not romantic — it\'s beautiful because it\'s hard.'},
      {title:'The Solace of Open Spaces', author:'Gretel Ehrlich', note:'Essays by a filmmaker who came to Wyoming for a project and stayed for a decade. Short, perfect pieces.'}
    ]},
    {name:'Red rock country', days:'Days 6–11 · Utah', books:[
      {title:'Desert Solitaire', author:'Edward Abbey', note:"MANDATORY for Arches. Abbey's season as a park ranger in the 1950s, when you could still have Delicate Arch to yourself. Funny, furious, a little crazy."},
      {title:'Red: Passion and Patience in the Desert', author:'Terry Tempest Williams', note:'Love letter to the canyonlands, written as short prose poems. Read one at sunrise.'},
      {title:'The Secret Knowledge of Water', author:'Craig Childs', note:'A naturalist hunts for water in the driest places on earth. Learn what to look for in the desert around you.'}
    ]},
    {name:'The High Sierra', days:'Days 12–15 · Sequoia to Tahoe', books:[
      {title:'My First Summer in the Sierra', author:'John Muir', note:"Muir's giddy, wide-eyed journal of his first summer in Yosemite. He never really recovered. Read it IN Yosemite."},
      {title:"The Wild Muir: 22 of John Muir's Greatest Adventures", author:'John Muir (ed. Lee Stetson)', note:'Muir hanging off cliffs, riding avalanches, climbing trees in storms. Short chapters, perfect for camp.'}
    ]},
    {name:'San Francisco', days:'Days 16–17 · The end', books:[
      {title:'Tales of the City', author:'Armistead Maupin', note:'The definitive SF novel — a warm, funny, queer-affirming portrait of the city in the 1970s. Light as a postcard.'},
      {title:'Slouching Towards Bethlehem', author:'Joan Didion', note:'Didion on 1960s California. The title essay is about Haight-Ashbury. Sharp, sharp, sharp.'},
      {title:'Howl and Other Poems', author:'Allen Ginsberg', note:'Tiny book. City Lights Bookstore (where it was first published) is a 20-min walk from the Golden Gate — go buy a copy there.'}
    ]}
  ],
  stories:[
    {title:'A Good Man Is Hard to Find', author:"Flannery O'Connor", pages:'~22 pages', note:'A family road trip to Florida goes very wrong. Southern Gothic at its most famous. Read aloud across Pennsylvania.'},
    {title:'The Half-Skinned Steer', author:'Annie Proulx', pages:'~30 pages', note:"An old man drives across Wyoming toward his brother's funeral. The landscape is a character. Read it IN Wyoming."},
    {title:'Brokeback Mountain', author:'Annie Proulx', pages:'~35 pages', note:'Before it was a film. Still devastating. Read it once in your life.'},
    {title:'Where Are You Going, Where Have You Been?', author:'Joyce Carol Oates', pages:'~30 pages', note:'Dread and Americana in one suburban afternoon. Will make you lock the car doors.'},
    {title:'The Things They Carried', author:"Tim O'Brien", pages:'~25 pages', note:'The title story of the collection. Not about a road trip, but about carrying. Read on a hard driving day.'},
    {title:'Signs and Symbols', author:'Vladimir Nabokov', pages:'~8 pages', note:'Tiny, devastating, mysterious. Perfect for a gas station break. Read it twice — the second time everything changes.'}
  ]
};

// ================= DAYS =================
// Each day's "route" defines the actual driving path as [lat,lng] waypoints.
// OSRM will snap these to real roads when rendering the mini-map.
// `miles` and `drive` are the true driving totals.
const DAYS = [
  {n:0, date:'Fri, May 29', title:'Ruby Arrives in Hamilton', subroute:'SRQ → CLT → SYR → Hamilton, NY',
    miles:'0', drive:'— (flights)', sleep:"Grandparents' house",
    route:null,
    timeline:['Ruby departs Sarasota (SRQ)','Connects through Charlotte (CLT)','Lands in Syracuse (SYR) at 10:50 PM','Drive ~1 hr to Hamilton'],
    lodging:{name:"Grandparents' house", meta:'Hamilton, NY · Free'},
    food:{name:'Late-night snack run', meta:"Ruby's probably starving after flights"},
    suggestions:[
      {tag:'Pack',text:'Double-check the <strong>car checklist</strong> one last time — spare tire, jumper cables, first aid.'},
      {tag:'Sleep',text:'Get a real night of sleep — tomorrow is the big 13-hour drive to Wisconsin.'},
      {tag:'Fuel',text:'Fill up the tank tonight so you can hit the road at dawn.'},
      {tag:'Snacks',text:'Stock the cooler with water, fruit, nuts, and jerky for the long drive west.'}
    ],
    protip:'Download offline maps for western routes and Spotify playlists before you lose cell signal in the plains.'},

  {n:1, date:'Sat, May 30', title:'Hamilton → Madison, WI', subroute:'I-90 W via Buffalo, Cleveland, Chicago',
    miles:'885', drive:'~13 hrs',  sleep:"Gwen's apartment",
    // Waypoints: Hamilton → Syracuse → Buffalo → Cleveland → Toledo → Chicago → Madison
    route:[[42.8270,-75.5446],[43.0481,-76.1474],[42.8864,-78.8784],[41.4993,-81.6944],[41.6528,-83.5379],[41.8781,-87.6298],[43.0731,-89.4012]],
    timeline:['Dawn departure from Hamilton','I-90 W across NY — Buffalo, Erie PA','Cleveland for lunch · through Toledo into Indiana','Skirt Chicago on I-90/I-94','Cross into Wisconsin at dusk','Arrive Madison late — Gwen will be waiting'],
    lodging:{name:"Gwen's apartment", meta:'Madison, WI · Free'},
    food:{name:'Gas-station sushi is not an option', meta:'Budget $30 each for road meals'},
    suggestions:[
      {tag:'Route',text:'Stay on <strong>I-90 W</strong> the whole way — it curves through Buffalo, Cleveland, Chicago, Madison.'},
      {tag:'Rotate',text:'Switch drivers every 2 hrs. The passenger picks music and snacks.'},
      {tag:'Scenic',text:'Cuyahoga Valley (OH) is 5 min off I-80 if you want to stretch legs in a real forest.'},
      {tag:'Food',text:"Culver's or Portillo's in Indiana/Illinois for a Midwest fast-food rite of passage."}
    ],
    protip:'Podcast queue: load Radiolab, This American Life, and something trashy for hour 11 when your brain gives up.'},

  {n:2, date:'Sun, May 31', title:'Madison Rest Day', subroute:'Hang with Gwen, see the city',
    miles:'<20', drive:'around town', sleep:"Gwen's",
    route:null,
    timeline:['Sleep in — you earned it','Brunch in Madison (Marigold or Short Stack Eats)','Walk State Street to the Capitol','Afternoon at Lake Mendota or Olbrich Botanical Gardens','Dinner with Gwen'],
    lodging:{name:"Gwen's apartment", meta:'Free'},
    food:{name:'Brunch + dinner in town', meta:'~$40 each'},
    suggestions:[
      {tag:'See',text:'The <strong>Wisconsin State Capitol</strong> is free to visit and genuinely beautiful inside.'},
      {tag:'Eat',text:"Get a cheese curd fix at <strong>Graze</strong> or a beer garden — it's Wisconsin, lean in."},
      {tag:'Walk',text:'Stroll the <strong>Memorial Union Terrace</strong> by Lake Mendota — iconic Madison spot.'},
      {tag:'Chill',text:'No driving today. Let the body recover before the real camping starts.'}
    ],
    protip:'Ask Gwen for her local pick — she knows Madison better than Google ever will.'},

  {n:3, date:'Mon, Jun 1', title:'Madison Prep Day', subroute:'Gear check for car camping',
    miles:'<20', drive:'errands', sleep:"Gwen's",
    route:null,
    timeline:['Buy any last camping gear (Target or REI)','Groceries for the cooler (breakfast bars, fruit, canned beans, tortillas)','Test pitch the sleep setup in the car','Fuel + wash the car','Early dinner, early bed'],
    lodging:{name:"Gwen's", meta:'Free'},
    food:{name:'Grocery run + easy dinner', meta:'~$80 groceries split'},
    suggestions:[
      {tag:'Gear',text:'Do a full <strong>gear audit</strong> — sleeping bags, headlamps, matches, water jugs, camp stove.'},
      {tag:'Food',text:"Buy <strong>4 days of food</strong> — you won't see a real grocery until Moab."},
      {tag:'Car',text:'Oil check, tire pressure, wiper fluid. Tomorrow you enter the empty parts.'},
      {tag:'Charge',text:'Power banks to 100%. Download playlists, podcasts, offline Google Maps for SD + UT.'}
    ],
    protip:'Print a paper copy of the route and reservations. Phones die, signal disappears in South Dakota.'},

  {n:4, date:'Tue, Jun 2', title:'Madison → Chamberlain, SD', subroute:'I-90 W across MN & SD',
    miles:'594', drive:'~8.5 hrs', sleep:'Car camp · Chamberlain',
    // Madison → La Crosse → Rochester MN → Albert Lea → Sioux Falls → Mitchell → Chamberlain
    route:[[43.0731,-89.4012],[43.8014,-91.2396],[44.0121,-92.4802],[43.6480,-93.3686],[43.5446,-96.7311],[43.7094,-98.0298],[43.8113,-99.3279]],
    timeline:['Leave Madison ~8 AM','Cross Minnesota on I-90','Lunch stop in Mitchell, SD (Corn Palace if you\'re feeling it)','Arrive Chamberlain late afternoon','Set up car camp, cook a simple dinner'],
    lodging:{name:'Car camp in Chamberlain, SD', meta:'Chamberlain Medical Center lot · Free'},
    food:{name:'Camp stove dinner', meta:'Pasta + canned sauce, ~$8 total'},
    suggestions:[
      {tag:'Detour',text:'The <strong>Corn Palace</strong> in Mitchell SD is peak Americana kitsch — worth 30 min.'},
      {tag:'View',text:'Chamberlain sits on the Missouri River — <strong>Dignity of Earth & Sky</strong> statue is right off I-90, free, stunning.'},
      {tag:'Camp',text:"Park discreetly, lights out early. Don't look sketchy and nobody will bother you."},
      {tag:'Safety',text:'Pin the car location. Lock valuables out of sight. Wedge sun shades up.'}
    ],
    protip:'You just crossed from Central to Mountain time. Adjust your brain and your Google Calendar.'},

  {n:5, date:'Wed, Jun 3', title:'Badlands → Rushmore → Lusk', subroute:'I-90 W → SD-240 Loop → US-85 S',
    miles:'388', drive:'~7 hrs + stops', sleep:'Covered Wagon Motel, Lusk WY',
    // Chamberlain → Wall → Badlands Loop → Wall → Rapid City → Mt Rushmore → Custer → Lusk
    route:[[43.8113,-99.3279],[43.9939,-102.2409],[43.7540,-101.9411],[43.8554,-101.9777],[43.9939,-102.2409],[44.0805,-103.2310],[43.8791,-103.4591],[43.7660,-103.5980],[42.7627,-104.4521]],
    timeline:['Early start — sunrise is magic in the Badlands','Hike the Notch Trail (1.5 mi, ~1 hr, ladder section)','Drive the Badlands Loop Rd','Lunch in Wall (Wall Drug is required by law)','Mt. Rushmore (1 hr is plenty)','Drive US-85 S to Lusk, WY — check into the Covered Wagon Motel'],
    lodging:{name:'Covered Wagon Motel', meta:'Lusk, WY · BOOKED'},
    food:{name:'Wall Drug for lunch', meta:'5-cent coffee, famous donuts'},
    suggestions:[
      {tag:'Hike',text:'<strong>Notch Trail</strong> at sunrise — ladder climb, canyon view, ~1 hr. Do not skip.'},
      {tag:'Drive',text:'Badlands Loop Rd (SD-240) has pullouts every half mile — stop constantly.'},
      {tag:'Weird',text:'<strong>Wall Drug</strong> is a 76,000 sq ft tourist trap and it rules. Free ice water since 1931.'},
      {tag:'Rushmore',text:"Skip the $10 parking — there's a small pullout a mile before with the same view."}
    ],
    protip:"Bison on Badlands Loop Rd are real and huge. Stay 25 yards back. Don't be the tourist in the news."},

  {n:6, date:'Thu, Jun 4', title:'Lusk → Moab, UT', subroute:'US-85 S → I-80 W → US-191 S',
    miles:'604', drive:'~9 hrs', sleep:'Moab Airbnb',
    // Lusk → Cheyenne → Laramie → Rawlins → Rock Springs → Vernal UT → Moab
    route:[[42.7627,-104.4521],[41.1400,-104.8202],[41.3114,-105.5911],[41.7911,-107.2387],[41.5875,-109.2029],[40.4555,-109.5287],[39.5324,-109.6890],[38.5733,-109.5498]],
    timeline:['Early coffee + pastry from the Triangle Station in Lusk','South on US-85 to Cheyenne','West on I-80 across Wyoming (Laramie → Rock Springs)','Drop south on US-191 into Utah','Cross into the red rock country','Arrive Moab at dusk — Airbnb check-in, takeout dinner'],
    lodging:{name:'Moab Airbnb (Night 1 of 2)', meta:'$365/night · BOOKED'},
    food:{name:"Milt's Stop & Eat or Moab Brewery", meta:'~$25 each'},
    suggestions:[
      {tag:'Detour',text:'If time: <strong>Flaming Gorge</strong> overlook off US-191 — wild blue water in the desert.'},
      {tag:'Fuel',text:'Gas up in Rock Springs — long stretches of nothing ahead.'},
      {tag:'Arrival',text:'Get to Moab before dark to see the red rocks light up at golden hour.'},
      {tag:'Dinner',text:"<strong>Milt's Stop & Eat</strong> — burgers since 1954. Peak road-trip dinner."}
    ],
    protip:"Desert heat is real. Refill every water bottle at the Airbnb. You'll need 1 gallon per person per day hiking."},

  {n:7, date:'Fri, Jun 5', title:'Arches National Park', subroute:'Moab → Arches NP → Moab (loop)',
    miles:'~60', drive:'in park', sleep:'Moab Airbnb',
    // Moab → Arches entrance → Delicate Arch TH → Windows → Moab
    route:[[38.5733,-109.5498],[38.6167,-109.5990],[38.7436,-109.5207],[38.6869,-109.5365],[38.5733,-109.5498]],
    timeline:['Pre-dawn start to beat heat and crowds','Delicate Arch hike (3 mi RT, ~2 hrs) — do this first','Windows Section + Double Arch (easy, short)','Lunch break back in Moab','Afternoon nap (seriously)','Sunset at Delicate Arch viewpoint or Corona Arch'],
    lodging:{name:'Moab Airbnb (Night 2)', meta:'Same as last night'},
    food:{name:'Picnic lunch + dinner out', meta:'~$50 total'},
    suggestions:[
      {tag:'Timed Entry',text:'<strong>Arches requires a timed entry reservation</strong> April–Oct. Book on recreation.gov MONTHS ahead.'},
      {tag:'Hike',text:'<strong>Delicate Arch</strong> at sunrise = fewer people, cooler temps, better photos.'},
      {tag:'Gear',text:'2L water per person minimum. Hat. Electrolytes. Sunscreen every 90 min.'},
      {tag:'Sunset',text:'<strong>Corona Arch</strong> (outside the park, free, 3 mi RT) — same wow, zero crowds at sunset.'}
    ],
    protip:"Desert hiking rule: turn around when you've used 1/3 of your water. The way back is always harder."},

  {n:8, date:'Sat, Jun 6', title:'Moab → Bryce Canyon', subroute:'UT-128 → I-70 W → UT-24 → Scenic Byway 12',
    miles:'272', drive:'~5.5 hrs', sleep:'Car camp near Bryce',
    // Moab → Green River → Hanksville → Capitol Reef → Boulder → Escalante → Bryce
    route:[[38.5733,-109.5498],[38.9937,-110.1595],[38.3722,-110.7137],[38.2915,-111.2615],[37.9133,-111.4203],[37.7705,-111.6027],[37.5930,-112.1871]],
    timeline:['Leave Moab mid-morning','I-70 to UT-24 south through Capitol Reef','Scenic Byway 12 — one of the best drives in America','Lunch in Torrey or Boulder, UT','Arrive Bryce mid-afternoon, set up camp','Sunset at Sunset Point (the name earns it)'],
    lodging:{name:'Car camp near Bryce', meta:'$15 · Dispersed camping'},
    food:{name:'Camp dinner', meta:'Foil-pack dinner over coals, ~$10'},
    suggestions:[
      {tag:'Drive',text:'<strong>Utah Scenic Byway 12</strong> is a designated All-American Road — Hogsback ridge, slickrock, aspens.'},
      {tag:'Stop',text:"<strong>Hell's Backbone Grill</strong> in Boulder UT — famous farm-to-table lunch if open."},
      {tag:'Arrive',text:'Bryce rim is ~8,000 ft — cold at night even in June. Layer up.'},
      {tag:'Sunset',text:'<strong>Sunset Point</strong> or <strong>Bryce Point</strong> — arrive 30 min before.'}
    ],
    protip:"Elevation hits some people hard. Go easy on alcohol, drink extra water, don't sprint up hills."},

  {n:9, date:'Sun, Jun 7', title:'Bryce Canyon Full Day', subroute:'Hike the hoodoos · scenic drive',
    miles:'~40', drive:'in park', sleep:'Car camp',
    // Camp → Sunrise Point → Navajo Loop → Rainbow Point → back
    route:[[37.5930,-112.1871],[37.6288,-112.1638],[37.6238,-112.1673],[37.4728,-112.2384],[37.5930,-112.1871]],
    timeline:['Sunrise at Sunrise Point','Breakfast at camp','Navajo Loop + Queens Garden combo (2.9 mi, ~2 hrs — the classic hike)','Lunch + rest','Afternoon: drive the 18-mi scenic rd to Rainbow Point (9,115 ft)','Sunset + stargazing — Bryce has Dark Sky designation'],
    lodging:{name:'Same car camp', meta:'$15'},
    food:{name:'Camp meals all day', meta:'~$12 total'},
    suggestions:[
      {tag:'Hike',text:'<strong>Navajo Loop → Queens Garden</strong> down into the hoodoos is THE Bryce hike. Go clockwise (down Wall Street first).'},
      {tag:'Stars',text:'Bryce is one of the <strong>darkest skies in the US</strong>. Check for ranger astronomy programs.'},
      {tag:'Drive',text:'<strong>Rainbow Point</strong> at the end of the 18-mi rd — views stretch 100 miles on clear days.'},
      {tag:'Warm',text:'Nights drop to 40s even in June. Wool socks, beanie, hot drinks.'}
    ],
    protip:'Moonrise at Inspiration Point is other-worldly if your dates line up. Check the moon phase.'},

  {n:10, date:'Mon, Jun 8', title:'Bryce → Zion ("THE ONE")', subroute:'UT-12 → US-89 S → UT-9 (Mt Carmel Hwy)',
    miles:'86', drive:'~2 hrs', sleep:'"THE ONE" Airbnb',
    // Bryce → Red Canyon → Mt Carmel Junction → Zion east entrance → Springdale
    route:[[37.5930,-112.1871],[37.7461,-112.3155],[37.2245,-112.6836],[37.2131,-112.8861],[37.1888,-112.9881],[37.1889,-113.0263]],
    timeline:['Pack up camp slowly — short drive today','Drive through Red Canyon (scenic shortcut on UT-12)','South on US-89 then west on UT-9 into Zion','Stop at the Zion-Mt Carmel Tunnel viewpoints','Check into "THE ONE" Airbnb in Springdale','Afternoon: soft hike like Canyon Overlook (1 mi)','Dinner in Springdale'],
    lodging:{name:'"THE ONE" Airbnb (Night 1 of 2)', meta:'$325/night · BOOKED'},
    food:{name:'Dinner in Springdale', meta:"Oscar's Cafe or King's Landing"},
    suggestions:[
      {tag:'View',text:'<strong>Canyon Overlook Trail</strong> — 1 mi RT, easy, absurd view of Zion Canyon.'},
      {tag:'Tunnel',text:'The <strong>Zion-Mt Carmel Tunnel</strong> is an experience. Windows blast-cut into sandstone.'},
      {tag:'Prep',text:'Decide tomorrow: <strong>Angels Landing</strong> (permit required!) or <strong>The Narrows</strong>.'},
      {tag:'Relax',text:'Short drive day = nap, laundry, reset. Zion tomorrow will crush you in the best way.'}
    ],
    protip:'Angels Landing needs a lottery permit — apply at recreation.gov. No permit = The Narrows instead (no permit needed from the bottom).'},

  {n:11, date:'Tue, Jun 9', title:'Zion Full Day', subroute:'Shuttle into the canyon',
    miles:'~20', drive:'shuttle + short drives', sleep:'"THE ONE"',
    // Springdale → Visitor Center → Temple of Sinawava (end of canyon) → back
    route:[[37.1889,-113.0263],[37.2001,-112.9875],[37.2859,-112.9470],[37.1889,-113.0263]],
    timeline:['Shuttle into the canyon (cars not allowed)','Big hike of the day — Narrows (wet, magical) OR Angels Landing (airy, legendary)','Lunch at Zion Lodge','Afternoon: Weeping Rock or Emerald Pools (easier)','Sunset watch from the Airbnb deck'],
    lodging:{name:'"THE ONE" Airbnb (Night 2)', meta:'Same'},
    food:{name:'Picnic in the park + dinner out', meta:'~$50 total'},
    suggestions:[
      {tag:'Narrows',text:"Rent <strong>canyoneering boots + dry pants</strong> from Zion Outfitter ($30). Start early. Go until you're happy, turn back."},
      {tag:'Shuttle',text:'Shuttles run every 7 min. First one leaves ~6 AM. Be on it.'},
      {tag:'Water',text:"The Narrows IS the trail — you're walking up the Virgin River. 3L water + waterproof phone bag."},
      {tag:'Flash',text:"Check flash flood forecast morning-of at the visitor center. If it's bad, rangers close the Narrows."}
    ],
    protip:'The light in The Narrows is best mid-morning (10 AM – noon) when the sun hits the canyon walls.'},

  {n:12, date:'Wed, Jun 10', title:'Zion → Kernville, CA', subroute:'I-15 S → Vegas → Mojave → CA-178',
    miles:'544', drive:'~8.5 hrs', sleep:'Whispering Pines Lodge, Kernville',
    // Springdale → St George → Las Vegas → Baker → Barstow → Bakersfield → Kernville
    route:[[37.1889,-113.0263],[37.1041,-113.5841],[36.1699,-115.1398],[35.2679,-116.0775],[34.8958,-117.0173],[35.3733,-119.0187],[35.7550,-118.4239]],
    timeline:['Breakfast in Springdale, emotional goodbye to Zion','I-15 S through St George, clip Vegas','Lunch somewhere in the Mojave (Baker? Barstow?)','West on CA-58 through Bakersfield','North on CA-178 into the Sierra foothills','Arrive Kernville evening — check into Whispering Pines Lodge'],
    lodging:{name:'Whispering Pines Lodge', meta:'Kernville, CA · BOOKED'},
    food:{name:'Dinner in Kernville', meta:'Ewings on the Kern'},
    suggestions:[
      {tag:'Vegas',text:'Quick Vegas Strip drive-through if you want the photo op — otherwise stay on I-15.'},
      {tag:'Heat',text:"Mojave in June = 105°F+. Gas up before you're low. Water always in reach."},
      {tag:'Detour',text:"If you're ahead of schedule, <strong>Red Rock Canyon NV</strong> is 20 min off the highway."},
      {tag:'Reset',text:'Kernville is small and chill. Walk by the Kern River before dinner.'}
    ],
    protip:"You'll gain an hour crossing into Pacific Time today. Use it well."},

  {n:13, date:'Thu, Jun 11', title:'Sequoia National Park', subroute:'Kernville → Generals Hwy → Yosemite area',
    miles:'230', drive:'~5 hrs + park', sleep:'Car camp near Yosemite',
    // Kernville → Three Rivers → Giant Forest (Sequoia) → back out → Fresno → Oakhurst
    route:[[35.7550,-118.4239],[36.4383,-118.9012],[36.5655,-118.7673],[36.7468,-119.7726],[37.3272,-119.6463]],
    timeline:['Morning drive up from Kernville to Sequoia entrance','Walk among the giants — General Sherman Tree','Congress Trail (2 mi, easy loop)','Lunch picnic in Giant Forest','Descend out, drive north via Fresno to Yosemite area (Oakhurst/Mariposa)','Set up camp at dusk'],
    lodging:{name:'Car camp near Yosemite', meta:'National forest land (free/$15)'},
    food:{name:'Picnic lunch + camp dinner', meta:'~$20 total'},
    suggestions:[
      {tag:'See',text:'<strong>General Sherman</strong> — the largest tree on Earth by volume. The reality is bigger than photos.'},
      {tag:'Walk',text:'<strong>Congress Trail</strong> loops through a grove of giants. 2 mi of pure silence and scale.'},
      {tag:'Drive',text:'Generals Highway is slow and windy. Take it easy — motion sickness is real.'},
      {tag:'Camp',text:'Bear country. ALL food in a bear box or locked in the car. No snacks in the tent.'}
    ],
    protip:'Moro Rock (400 steps up a granite dome) is a 20-min round trip with a panoramic view that earns the climb.'},

  {n:14, date:'Fri, Jun 12', title:'Yosemite National Park', subroute:'Into the valley',
    miles:'~60', drive:'in park', sleep:'Car camp',
    // Camp → Yosemite Valley → Tunnel View → Glacier Point area → back
    route:[[37.3272,-119.6463],[37.7499,-119.6453],[37.7155,-119.6773],[37.8651,-119.5383],[37.3272,-119.6463]],
    timeline:['Dawn drive into Yosemite Valley','Tunnel View pullout (the classic shot)','Mist Trail to Vernal Falls (3 mi RT, wet!)','Lunch at Curry Village / Yosemite Valley Lodge','Lower Yosemite Falls (easy, 1 mi)','Sunset at Glacier Point or Taft Point (if Glacier Rd is open)'],
    lodging:{name:'Same camp', meta:'Free/$15'},
    food:{name:'Lodge lunch + camp dinner', meta:'~$30 total'},
    suggestions:[
      {tag:'Reserve',text:'Yosemite needs a <strong>reservation to enter</strong> in peak season — check nps.gov/yose before the trip.'},
      {tag:'View',text:'<strong>Tunnel View</strong> — Half Dome, El Capitan, Bridalveil Fall in one frame. Must stop.'},
      {tag:'Hike',text:'<strong>Mist Trail</strong> in June = full spray from Vernal Falls. Bring a dry layer.'},
      {tag:'Sunset',text:'<strong>Taft Point</strong> is 2.2 mi RT, fewer people than Glacier Point, terrifying cliff edges (no rails).'}
    ],
    protip:'Tioga Pass (highway 120) may still be closed in early June from winter snow. Check caltrans.ca.gov.'},

  {n:15, date:'Sat, Jun 13', title:'Yosemite → Lake Tahoe', subroute:'CA-49 N → US-50 → Tahoe (around Sierra)',
    miles:'230', drive:'~5 hrs', sleep:'Hipcamp',
    // Camp → Mariposa → Jackson → Placerville → South Lake Tahoe → Sand Harbor area
    route:[[37.3272,-119.6463],[37.4849,-119.9663],[38.3488,-120.7741],[38.7296,-120.7983],[38.9399,-119.9772],[39.0968,-120.0324]],
    timeline:['Morning hike or Valley loop','Pack up camp, drive north via CA-49 through Gold Country','US-50 east over Echo Summit','Drop into South Lake Tahoe — lake views begin','Arrive Tahoe mid-afternoon','Swim/dip in the lake — it\'s cold and perfect'],
    lodging:{name:'Hipcamp Tahoe', meta:'$47.70 · BOOKED'},
    food:{name:'Lakeside dinner', meta:'~$30 each'},
    suggestions:[
      {tag:'Pass',text:'If <strong>Tioga Pass (120)</strong> is open, take it for a shortcut — Tuolumne Meadows is a cathedral. Otherwise go around via 49/50.'},
      {tag:'Swim',text:'<strong>Sand Harbor</strong> on the Nevada side — clearest turquoise water, white sand, granite boulders.'},
      {tag:'Drive',text:'The <strong>East Shore</strong> (Hwy 28) is the prettiest Tahoe drive — pull over often.'},
      {tag:'Stars',text:'Away from town lights, Tahoe nights = full Milky Way.'}
    ],
    protip:"Tahoe is 6,200 ft — if you're still acclimatizing from Yosemite, the altitude is easy. If coming from sea level, go slow."},

  {n:16, date:'Sun, Jun 14', title:'Tahoe → San Francisco', subroute:'US-50 W → I-80 W → Bay Bridge',
    miles:'194', drive:'~3.5 hrs', sleep:"Cousin's home",
    // Tahoe → Placerville → Sacramento → Davis → Vallejo → SF
    route:[[39.0968,-120.0324],[38.7296,-120.7983],[38.5816,-121.4944],[38.5449,-121.7405],[38.1041,-122.2566],[37.7749,-122.4194]],
    timeline:['Lazy morning by the lake','US-50 W down the western Sierra','Stop in Sacramento or Davis for coffee','I-80 W to the Bay','Cross the Bay Bridge — emotional moment','Arrive SF afternoon','Dinner with cousins'],
    lodging:{name:"Cousin's home", meta:'San Francisco · Free'},
    food:{name:'Dinner with family', meta:'Free'},
    suggestions:[
      {tag:'Arrive',text:'Cross the <strong>Bay Bridge</strong> not the GGB — save the Golden Gate for the big reveal tomorrow.'},
      {tag:'Stop',text:'Auburn (CA) has a sweet historic downtown for a 20-min coffee break.'},
      {tag:'Celebrate',text:'You drove across the country. Let that land. Take the photo at the Bay.'},
      {tag:'Rest',text:'Tomorrow is SF exploration day. Sleep in.'}
    ],
    protip:"SF weather is colder than you'd think in June. Mark Twain quote aside — actually pack layers."},

  {n:17, date:'Mon, Jun 15', title:'San Francisco Day', subroute:'Explore the city on foot & bike',
    miles:'walking', drive:'—', sleep:"Cousin's",
    // Ferry Building → North Beach → Golden Gate → Lands End
    route:[[37.7955,-122.3937],[37.8067,-122.4108],[37.8199,-122.4783],[37.7805,-122.5116]],
    timeline:['Ferry Building breakfast','Walk the Embarcadero to North Beach','Lunch in Chinatown or North Beach (get a cannoli at Stella Pastry)','Afternoon: Golden Gate Bridge walk or bike','Sunset at Baker Beach or Lands End','Last-night dinner with family'],
    lodging:{name:"Cousin's", meta:'Free'},
    food:{name:'All day eating in SF', meta:'~$80 each'},
    suggestions:[
      {tag:'Walk',text:'Bike the <strong>Golden Gate Bridge</strong> — rent from Blazing Saddles, ride to Sausalito, ferry back.'},
      {tag:'Eat',text:'<strong>Mission burritos</strong> are non-negotiable. La Taqueria or El Farolito.'},
      {tag:'View',text:'<strong>Lands End</strong> trail at sunset — GGB + Pacific + shipwrecks.'},
      {tag:'Weird',text:'Musée Mécanique at Fisherman\'s Wharf — antique arcade machines, free to enter.'}
    ],
    protip:"Alcatraz tickets sell out weeks ahead. Book BEFORE the trip if it's on the list."},

  {n:18, date:'Tue, Jun 16', title:'Ruby Flies Home', subroute:'SF → SFO · Trip ends',
    miles:'25', drive:'~45 min', sleep:'—',
    route:[[37.7749,-122.4194],[37.6213,-122.3790]],
    timeline:['Last breakfast together','Drive south on US-101 to SFO','Drop Ruby at SFO','One last hug',"Sophia's stretch — figure out what's next"],
    lodging:{name:'—', meta:'Trip ends'},
    food:{name:'Airport coffee', meta:'bittersweet'},
    suggestions:[
      {tag:'Time',text:"Leave for SFO <strong>3 hrs before</strong> Ruby's flight — traffic + security lines."},
      {tag:'Backup',text:"Save Ruby's boarding pass as screenshot + email — TSA lines are long, battery dies."},
      {tag:'Journal',text:'Write down your favorite moment from the trip before you forget. Trust me.'},
      {tag:'Photos',text:'Back up everything to cloud storage before Ruby flies.'}
    ],
    protip:"This trip was 4,454 miles. You crossed a country. Don't let the farewell be small — you made something."}
];
