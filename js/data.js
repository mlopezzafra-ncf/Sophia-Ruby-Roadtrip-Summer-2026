// ================= TRIP DATA =================
const TRIP_START = new Date('2026-05-29T00:00:00');

// Numbered stops on the main map (in chronological order)
const STOPS = [
  {n:1,  day:0,  name:'Hamilton, NY',     lat:42.8270, lng:-75.5446, type:'start', label:'Start'},
  {n:2,  day:1,  name:'Sandusky, OH',     lat:41.4534, lng:-82.7079, type:'sleep', label:'Car camp · 1st night'},
  {n:3,  day:2,  name:'Madison, WI',      lat:43.0731, lng:-89.4012, type:'sleep', label:"Gwen's · 2 nights"},
  {n:4,  day:4,  name:'Chamberlain, SD',  lat:43.8113, lng:-99.3279, type:'sleep', label:'Sanford Med · car camp'},
  {n:5,  day:5,  name:'Badlands NP',      lat:43.8554, lng:-101.9777, type:'park'},
  {n:6,  day:5,  name:'Mt. Rushmore',     lat:43.8791, lng:-103.4591, type:'stop'},
  {n:7,  day:5,  name:'Lusk, WY',         lat:42.7627, lng:-104.4521, type:'sleep', label:'Covered Wagon Motel'},
  {n:8,  day:6,  name:'Moab, UT',         lat:38.5733, lng:-109.5498, type:'sleep', label:'Airbnb · 2 nights'},
  {n:9,  day:7,  name:'Arches NP',        lat:38.7331, lng:-109.5925, type:'park'},
  {n:10, day:8,  name:'Bryce Canyon NP',  lat:37.5930, lng:-112.1871, type:'park', label:"Tipi @ Ruby's Inn · 2 nights"},
  {n:11, day:10, name:'Zion NP',          lat:37.2982, lng:-113.0263, type:'park', label:'Orderville Airbnb · 2 nights'},
  {n:12, day:12, name:'Kernville, CA',    lat:35.7550, lng:-118.4239, type:'sleep', label:'Whispering Pines Lodge'},
  {n:13, day:13, name:'Sequoia NP',       lat:36.4864, lng:-118.5658, type:'park'},
  {n:14, day:14, name:'Yosemite NP',      lat:37.8651, lng:-119.5383, type:'park'},
  {n:15, day:15, name:'Lake Tahoe',       lat:39.0968, lng:-120.0324, type:'sleep', label:'Hipcamp'},
  {n:16, day:16, name:'San Francisco, CA',lat:37.7749, lng:-122.4194, type:'end',   label:"Cousin's home"},
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
  {name:'ARCHES',         state:'Utah',         days:'Day 7',       detail:'Delicate Arch · Windows Section',  onTrip:true,  img:PARK_IMG('Arches.png'),
    info:{
      established:'1971 (Monument since 1929)',
      area:'76,679 acres',
      link:'https://www.nps.gov/arch/',
      history:'Cowboy-turned-prospector Alexander Ringhoffer wrote to the railroad in 1923 begging them to come see the sandstone fins; the next year the area was a national monument. The park has the densest concentration of natural stone arches on Earth — over 2,000 catalogued, formed by 65 million years of salt-bed collapse and freeze-thaw erosion in the Entrada sandstone. <strong>Edward Abbey</strong> wrote <em>Desert Solitaire</em> here as a ranger in the 1950s — the book that started modern American eco-writing.',
      routes:[
        {name:'Arches Scenic Drive', detail:'18 miles, paved, end-to-end. Passes every major feature: Park Avenue, Balanced Rock, Windows, Delicate Arch viewpoint, Fiery Furnace, Devils Garden. <strong>Timed entry reservation required Apr–Oct</strong> — book on recreation.gov months ahead.'},
        {name:'Windows Section Loop', detail:'Short spur off the main road. Park once, walk to North + South Windows, Turret Arch, and Double Arch — four big arches in under a mile.'},
        {name:'Devils Garden Trailhead', detail:'End of the road. 7.2-mi primitive loop past Landscape Arch (the longest in the park) and seven other arches.'}
      ],
      things:[
        {tag:'ICON', text:'<strong>Delicate Arch</strong> — 3 mi RT, 480 ft up slickrock, no shade. The arch on the Utah license plate. <strong>Go at dawn</strong> to beat heat and crowds.'},
        {tag:'EASY', text:'<strong>Windows + Double Arch</strong> — under a mile total, three giant arches you can walk right under.'},
        {tag:'HIKE', text:'<strong>Landscape Arch</strong> — 1.6 mi RT, the longest natural arch in North America at 306 ft. A slab fell off in 1991; it could fall any day.'},
        {tag:'VIEW', text:'<strong>Park Avenue overlook</strong> — sandstone monoliths lined up like skyscrapers. 5-min stop, huge payoff.'},
        {tag:'WATER', text:'<strong>1 gallon per person per day</strong> minimum in summer. The park has no drinking water past the visitor center.'}
      ]
    }},
  {name:'BRYCE CANYON',   state:'Utah',         days:'Days 8–9',    detail:'Hoodoos · Navajo Loop',           onTrip:true,  img:PARK_IMG('Bryce Canyon.png'),
    info:{
      established:'1928',
      area:'35,835 acres',
      link:'https://www.nps.gov/brca/',
      history:'Named for Mormon settler Ebenezer Bryce, who homesteaded below the rim in the 1870s and famously called it "a hell of a place to lose a cow." The amphitheater itself isn\'t a canyon at all — it\'s the eroded edge of a plateau, where ice and rain carve the soft Claron limestone into <strong>hoodoos</strong>, the spires the park is famous for. The Paiute who lived here called them <em>Anka-ku-wass-a-wits</em> — "red painted faces" — and said they were the Legend People turned to stone.',
      routes:[
        {name:'Bryce Canyon Scenic Drive', detail:'18 miles one-way to Rainbow Point (9,115 ft). Drive to the end first, hit overlooks on the way back — the sun is at your back going south.'},
        {name:'Rim Trail', detail:'Up to 11 mi point-to-point along the amphitheater edge. Connects Bryce Point, Inspiration Point, Sunset Point, and Sunrise Point. Walk any chunk.'},
        {name:'Park Shuttle (free)', detail:'Optional. Runs Apr–Oct. Park at the visitor center and ride in — saves parking headaches in summer.'}
      ],
      things:[
        {tag:'HIKE', text:'<strong>Navajo Loop + Queens Garden</strong> combo — 2.9 mi, ~2 hrs. THE Bryce hike. Go clockwise (down Wall Street, up Queens) for the best light.'},
        {tag:'VIEW', text:'<strong>Sunrise at Sunrise Point</strong> or <strong>Bryce Point</strong> — the hoodoos catch fire. Arrive 30 min before.'},
        {tag:'DRIVE', text:'<strong>Rainbow Point</strong> at the end of the 18-mi road — 9,115 ft, views stretch 100+ miles on clear days.'},
        {tag:'STARS', text:'<strong>Dark Sky Park</strong> — among the darkest skies in the lower 48. Ranger astronomy programs nightly in summer.'},
        {tag:'COLD', text:'Bryce rim is ~8,000 ft. Nights drop to the 40s even in June. Wool socks, beanie, hot drinks.'}
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
  {name:'SEQUOIA',        state:'California',   days:'Day 13',      detail:'General Sherman · Giant Forest',   onTrip:true,  img:PARK_IMG('Sequoia.png'),
    info:{
      established:'1890 — second-oldest U.S. national park',
      area:'404,064 acres',
      link:'https://www.nps.gov/seki/',
      history:'Established in 1890 to stop the logging of <strong>giant sequoia groves</strong> that had stood for two thousand years. The trees here are the largest living things on Earth by volume — bigger than any whale, any building. The Yokuts and Western Mono tribes lived in these mountains for thousands of years; rangers still find their grinding stones. Buffalo Soldiers of the 24th Infantry — Black cavalry units — served as the park\'s first rangers in 1903, decades before the National Park Service existed.',
      routes:[
        {name:'Generals Highway (CA-198)', detail:'46 miles of switchbacks from the Foothills entrance up to 7,000 ft. Connects Sequoia to Kings Canyon. <strong>RV/trailer length limits</strong> — check before towing.'},
        {name:'Giant Forest Loop', detail:'Drive (or walk) the loop road through the densest grove of giants in the park. Stop at the Giant Forest Museum.'},
        {name:'Crystal Cave Road', detail:'Spur down to a marble cavern (ticketed tour only, reserve ahead). Closed some years for restoration.'}
      ],
      things:[
        {tag:'TREE', text:'<strong>General Sherman</strong> — the largest tree on Earth by volume. 275 ft tall, 36 ft thick at the base, ~2,200 years old. The reality is bigger than photos.'},
        {tag:'WALK', text:'<strong>Congress Trail</strong> — 2 mi paved loop through the Senate + House groves. The quietest place in the park.'},
        {tag:'CLIMB', text:'<strong>Moro Rock</strong> — 400 stone steps up a granite dome. 20-min round trip, 360° view of the Great Western Divide.'},
        {tag:'DRIVE', text:'<strong>Tunnel Log</strong> — drive your car through a fallen 275-ft sequoia. Required photo.'},
        {tag:'CAVE', text:'<strong>Crystal Cave</strong> — marble cavern with twisting passages. Tickets sell out — reserve weeks ahead at recreation.gov.'}
      ]
    }},
  {name:'YOSEMITE',       state:'California',   days:'Day 14',      detail:'Tunnel View · Mist Trail',        onTrip:true,  img:PARK_IMG('Yosemite.png'),
    info:{
      established:'1890',
      area:'759,620 acres',
      link:'https://www.nps.gov/yose/',
      history:'Abraham Lincoln signed the Yosemite Grant in 1864 — the first time in history a government set aside land specifically to preserve its beauty for the public. <strong>John Muir</strong> arrived in 1868 and never really left; his writing and walks with Teddy Roosevelt here in 1903 led directly to the creation of the National Park Service. The Ahwahneechee (a Southern Sierra Miwok band) lived in the valley for thousands of years and were forced out by California militia in 1851 — their name for the valley was <em>Ahwahnee</em>, "place of a gaping mouth."',
      routes:[
        {name:'Yosemite Valley Loop', detail:'Drive or cycle the 12-mi loop on the valley floor. Hits Tunnel View, Bridalveil Fall, El Capitan Meadow, Yosemite Falls, and the Ahwahnee Hotel.'},
        {name:'Glacier Point Road', detail:'Open late May–Oct. 16-mile spur to the 7,200-ft overlook of Half Dome. Sunset here is unreal.'},
        {name:'Tioga Pass (CA-120)', detail:'9,945 ft. Crosses the Sierra to Tuolumne Meadows + Mono Lake. <strong>Often closed into June by snow</strong> — check caltrans.ca.gov.'}
      ],
      things:[
        {tag:'VIEW', text:'<strong>Tunnel View</strong> — Half Dome, El Capitan, and Bridalveil Fall in one frame. Mandatory stop.'},
        {tag:'HIKE', text:'<strong>Mist Trail to Vernal Falls</strong> — 3 mi RT, granite steps, you WILL get soaked. Pure magic in June.'},
        {tag:'EPIC', text:'<strong>Upper Yosemite Falls</strong> — 7 mi RT, 2,700 ft up. Tallest waterfall in North America. Brutal, beautiful.'},
        {tag:'EASY', text:'<strong>Lower Yosemite Falls</strong> — 1 mi paved loop. Wheelchair-accessible. Closest you get to the bottom of the falls.'},
        {tag:'RESERVE', text:'<strong>Reservation required to enter</strong> in peak season — check nps.gov/yose before you drive in.'}
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

const PLANNED = {food:717, gas:568, lodging:869, activities:100, misc:222};

// Structured packing data from the spreadsheet.
// Each item: { item, buy (need to purchase), pack (need to pack), both (one for both ppl), who, qty, note, link }
const PACKING = {
  'ESSENTIALS':[
    {item:'Premium Planet Fitness Membership', buy:true, both:true, who:'Ruby', note:'Covers showers + workouts coast-to-coast', link:'https://mapstack.io/map/NZGqFZ/map-of-planet-fitness-locations-us'},
    {item:'Speaker',                            pack:true},
    {item:'Portable Chargers'},
    {item:'Big Water Jugs',                     buy:true, both:true, qty:'×5'},
    {item:"Matt's digital camera",              pack:true, both:true, who:'Ruby'},
    {item:'Locker Locks',                       pack:true, both:true, who:'Ruby', qty:'×2'}
  ],
  'FOOD & COOKING':[
    {item:'Cooler (large)',                     buy:true, both:true, note:"Check grandparents' / Goodwill first"},
    {item:'Propane Hot Plate',                  buy:true, both:true, note:'~$30 · backpacking-style single burner', link:'https://www.amazon.com/dp/B01HQRD8EO'},
    {item:'Propane Canisters',                  buy:true, both:true, qty:'×5', note:'16oz canister lasts ~2 hrs on high'},
    {item:'Pan',                                buy:true, both:true},
    {item:'Pot',                                buy:true, both:true},
    {item:'Olive Oil (TJ)',                     buy:true},
    {item:'Salt',                               buy:true},
    {item:'Dish Soap',                          buy:true},
    {item:'Dish Sponge',                        buy:true},
    {item:'Dish Towels'},
    {item:'Traveling Espresso Machine',         pack:true},
    {item:"Paring + Chef's Knife"},
    {item:'Cutting Board'},
    {item:'Tupperware',                         qty:'×10', note:'Rubbermaid TakeAlongs'},
    {item:'Foil + Plastic Bags (gallon)'}
  ],
  'HIKING & WORKOUT':[
    {item:'Hiking Shoes',     pack:true},
    {item:'Hiking Backpack',  pack:true},
    {item:'Workout Shoes',    pack:true},
    {item:'Workout Gear',     pack:true}
  ],
  'FOR THE CAR':[
    {item:'Mesh Window Screens',                pack:true, both:true, who:'Sopez'},
    {item:'Privacy Shields',                    buy:true, both:true, note:'For side windows (not back/front) · ~$20', link:'https://www.ebay.com/itm/357605568460'},
    {item:'Little Battery Lamp',                pack:true},
    {item:'Little Battery Fans',                buy:true,             qty:'×2', note:'~$13 each · long-lasting mini fans', link:'https://www.amazon.com/dp/B0DPLDBZ6H'},
    {item:'Blankets',                           note:"Try grandparents' first"},
    {item:'Fidgets',                            pack:true, who:'Ruby'},
    {item:"Ruby's attachable phone holder",     pack:true}
  ],
  'HYGIENE':[
    {item:'Tide Pods',          pack:true, both:true},
    {item:'Shower Shoes',       pack:true},
    {item:'Towels',             buy:true, pack:true, qty:'×2+', note:'Microfiber especially'},
    {item:'Shampoo + Conditioner', buy:true, both:true},
    {item:'Body Wash',          buy:true, both:true},
    {item:'Baby Wipes',         buy:true, both:true},
    {item:'Laundry Bag',        pack:true},
    {item:'Toilet Paper',       buy:true},
    {item:"Rebecca's Wrath",    pack:true, both:true, who:'Kara!!'}
  ],
  'EXTRAS':[
    {item:'Hammock + Hammock Straps', pack:true}
  ]
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

  {n:1, date:'Sat, May 30', title:'Hamilton → Sandusky, OH', subroute:'I-90 W via PA → Jefferson, OH → Sandusky, OH',
    miles:'464', drive:'~7.5 hrs + family lunch',  sleep:'Car camp · Sandusky, OH',
    // Hamilton → Buffalo → Erie → Jefferson OH → Cleveland → Sandusky
    route:[[42.8270,-75.5446],[42.8864,-78.8784],[42.1292,-80.0851],[41.7384,-80.7681],[41.4993,-81.6944],[41.4534,-82.7079]],
    timeline:['Morning departure from Hamilton','I-90 W across NY into PA — Buffalo, Erie','~5 hrs to Jefferson, OH','LUNCH at Great Aunt & Uncle\'s house (415 Woodside Ave)','~2 hrs Jefferson → Sandusky, OH','Workout + shower at Planet Fitness','DINNER at Mekong Vietnamese (3321 Milan Rd)','Car camp in Sandusky — first night in the rig'],
    lodging:{name:'Car camp · Sandusky, OH', meta:'First night in the rig · Free'},
    food:{name:'Mekong Vietnamese for dinner', meta:'3321 Milan Rd · Family lunch in Jefferson'},
    suggestions:[
      {tag:'Family',text:'<strong>Lunch in Jefferson, OH</strong> with Great Aunt & Uncle — 415 Woodside Ave. Allow time.'},
      {tag:'Shower',text:'<strong>Planet Fitness in Sandusky</strong> for the first night-before-car-camp shower. Premium membership covers both of you.'},
      {tag:'Food',text:'<strong>Mekong Vietnamese</strong> for pho-and-banh-mi dinner before sleep. 3321 Milan Rd.'},
      {tag:'Test',text:"First night in the car is the dress rehearsal. Note what's missing — you can still buy it in Madison."}
    ],
    protip:'Fill water jugs and ice the cooler in Sandusky. Tomorrow morning sets the pattern for the whole trip.'},

  {n:2, date:'Sun, May 31', title:'Sandusky → Madison, WI', subroute:'I-90 W through Indiana & Chicago into WI',
    miles:'437', drive:'~7 hrs', sleep:"Gwen's apartment",
    // Sandusky → Toledo → Chicago → Madison
    route:[[41.4534,-82.7079],[41.6528,-83.5379],[41.8781,-87.6298],[43.0731,-89.4012]],
    timeline:['Breakfast on the road from Sandusky','I-90 W through Toledo into Indiana','Skirt Chicago on I-90/I-94 — aim to be past O\'Hare before 3 PM','Cross into Wisconsin late afternoon','Arrive Madison evening — reunite with Gwen','Dinner with Gwen — Kara joins for the western leg'],
    lodging:{name:"Gwen's apartment", meta:'Madison, WI · Free · Night 1 of 2'},
    food:{name:'Road snacks + dinner with Gwen', meta:'~$40 total'},
    suggestions:[
      {tag:'Route',text:'Stay on <strong>I-90 W</strong> the whole way — Toledo, skirt Chicago, into Madison.'},
      {tag:'Stop',text:"<strong>Lou Malnati's</strong> in Chicago for a deep-dish detour, OR <strong>Portillo's</strong> for a quick Italian beef."},
      {tag:'Reunite',text:'<strong>Kara joins in Madison</strong> for the western leg — full crew of three from here through Zion.'},
      {tag:'Rotate',text:'Switch drivers every 2 hrs. Passenger picks music and snacks.'}
    ],
    protip:'Chicago traffic is real — aim to be past O\'Hare before 3 PM or after 7 PM.'},

  {n:3, date:'Mon, Jun 1', title:'Madison · Rest + Prep Day', subroute:'Hang with Gwen · gear up for SD',
    miles:'<20', drive:'errands + walking', sleep:"Gwen's",
    route:null,
    timeline:['Sleep in — you earned it','Brunch in Madison (Marigold or Short Stack Eats)','Walk State Street to the Capitol','Gear audit + Target/REI run for any last camping supplies','Groceries — 4 days of food in the cooler','Test pitch the car-camp setup in Gwen\'s driveway','Early dinner with Gwen, early bed'],
    lodging:{name:"Gwen's apartment", meta:'Free · Night 2 of 2'},
    food:{name:'Brunch out + grocery dinner', meta:'~$80 groceries split + brunch'},
    suggestions:[
      {tag:'See',text:'The <strong>Wisconsin State Capitol</strong> is free to visit and genuinely beautiful inside.'},
      {tag:'Eat',text:"Get a cheese curd fix at <strong>Graze</strong> or a beer garden — it's Wisconsin, lean in."},
      {tag:'Gear',text:'Full <strong>gear audit</strong> — sleeping bags, headlamps, matches, water jugs, propane canisters, mesh window screens.'},
      {tag:'Food',text:"Buy <strong>4 days of food</strong> — you won't see a real grocery until Moab. Overnight oats, taco fixings, snacks."},
      {tag:'Charge',text:'Power banks to 100%. Download Spotify, podcasts, and offline Google Maps for SD + UT.'}
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
    miles:'272', drive:'~5.5 hrs', sleep:"Tipi @ Ruby's Inn",
    // Moab → Green River → Hanksville → Capitol Reef → Boulder → Escalante → Bryce
    route:[[38.5733,-109.5498],[38.9937,-110.1595],[38.3722,-110.7137],[38.2915,-111.2615],[37.9133,-111.4203],[37.7705,-111.6027],[37.5930,-112.1871]],
    timeline:['Leave Moab mid-morning','I-70 to UT-24 south through Capitol Reef','Scenic Byway 12 — one of the best drives in America','Lunch in Torrey or Boulder, UT','Arrive Bryce mid-afternoon — check into the tipi at Ruby\'s Inn','Sunset at Sunset Point (the name earns it)'],
    lodging:{name:"Tipi @ Ruby's Inn & Campgrounds", meta:'Bryce Canyon · BOOKED · Night 1 of 2'},
    food:{name:'Camp dinner', meta:'Foil-pack dinner over coals, ~$10'},
    suggestions:[
      {tag:'Drive',text:'<strong>Utah Scenic Byway 12</strong> is a designated All-American Road — Hogsback ridge, slickrock, aspens.'},
      {tag:'Stop',text:"<strong>Hell's Backbone Grill</strong> in Boulder UT — famous farm-to-table lunch if open."},
      {tag:'Arrive',text:'Bryce rim is ~8,000 ft — cold at night even in June. Layer up.'},
      {tag:'Sunset',text:'<strong>Sunset Point</strong> or <strong>Bryce Point</strong> — arrive 30 min before.'}
    ],
    protip:"Elevation hits some people hard. Go easy on alcohol, drink extra water, don't sprint up hills."},

  {n:9, date:'Sun, Jun 7', title:'Bryce Canyon Full Day', subroute:'Hike the hoodoos · scenic drive',
    miles:'~40', drive:'in park', sleep:"Tipi @ Ruby's Inn",
    // Camp → Sunrise Point → Navajo Loop → Rainbow Point → back
    route:[[37.5930,-112.1871],[37.6288,-112.1638],[37.6238,-112.1673],[37.4728,-112.2384],[37.5930,-112.1871]],
    timeline:['Sunrise at Sunrise Point','Breakfast at the tipi','Navajo Loop + Queens Garden combo (2.9 mi, ~2 hrs — the classic hike)','Lunch + rest','Afternoon: drive the 18-mi scenic rd to Rainbow Point (9,115 ft)','Sunset + stargazing — Bryce has Dark Sky designation'],
    lodging:{name:"Tipi @ Ruby's Inn & Campgrounds", meta:'BOOKED · Night 2 of 2'},
    food:{name:'Camp meals all day', meta:'~$12 total'},
    suggestions:[
      {tag:'Hike',text:'<strong>Navajo Loop → Queens Garden</strong> down into the hoodoos is THE Bryce hike. Go clockwise (down Wall Street first).'},
      {tag:'Stars',text:'Bryce is one of the <strong>darkest skies in the US</strong>. Check for ranger astronomy programs.'},
      {tag:'Drive',text:'<strong>Rainbow Point</strong> at the end of the 18-mi rd — views stretch 100 miles on clear days.'},
      {tag:'Warm',text:'Nights drop to 40s even in June. Wool socks, beanie, hot drinks.'}
    ],
    protip:'Moonrise at Inspiration Point is other-worldly if your dates line up. Check the moon phase.'},

  {n:10, date:'Mon, Jun 8', title:'Bryce → Zion', subroute:'UT-12 → US-89 S → UT-9 (Mt Carmel Hwy)',
    miles:'86', drive:'~2 hrs', sleep:'Orderville Airbnb',
    // Bryce → Red Canyon → Mt Carmel Junction → Zion east entrance → Springdale → Orderville
    route:[[37.5930,-112.1871],[37.7461,-112.3155],[37.2245,-112.6836],[37.2131,-112.8861],[37.1888,-112.9881],[37.1889,-113.0263]],
    timeline:['Pack up the tipi slowly — short drive today','Drive through Red Canyon (scenic shortcut on UT-12)','South on US-89 then west on UT-9 into Zion','Stop at the Zion-Mt Carmel Tunnel viewpoints','3/4 day in Zion — Canyon Overlook (1 mi) or shuttle in','Check into the Orderville Airbnb after 4 PM','Run a load of laundry — washer + dryer onsite','Dinner in Springdale'],
    lodging:{name:'Orderville Airbnb (Night 1 of 2)', meta:'245 W Pinyon Pine Dr · washer + dryer · BOOKED'},
    food:{name:'Dinner in Springdale', meta:"Oscar's Cafe or King's Landing"},
    suggestions:[
      {tag:'View',text:'<strong>Canyon Overlook Trail</strong> — 1 mi RT, easy, absurd view of Zion Canyon.'},
      {tag:'Tunnel',text:'The <strong>Zion-Mt Carmel Tunnel</strong> is an experience. Windows blast-cut into sandstone.'},
      {tag:'Prep',text:'Decide tomorrow: <strong>Angels Landing</strong> (permit required!) or <strong>The Narrows</strong>.'},
      {tag:'Relax',text:'Short drive day = nap, laundry, reset. Zion tomorrow will crush you in the best way.'}
    ],
    protip:'Angels Landing needs a lottery permit — apply at recreation.gov. No permit = The Narrows instead (no permit needed from the bottom).'},

  {n:11, date:'Tue, Jun 9', title:'Zion Full Day', subroute:'Shuttle into the canyon',
    miles:'~20', drive:'shuttle + short drives', sleep:'Orderville Airbnb',
    // Springdale → Visitor Center → Temple of Sinawava (end of canyon) → back
    route:[[37.1889,-113.0263],[37.2001,-112.9875],[37.2859,-112.9470],[37.1889,-113.0263]],
    timeline:['Shuttle into the canyon (cars not allowed)','Big hike of the day — Narrows (wet, magical) OR Angels Landing (airy, legendary)','Lunch at Zion Lodge','Afternoon: Weeping Rock or Emerald Pools (easier)','Sunset watch from the Airbnb deck in Orderville'],
    lodging:{name:'Orderville Airbnb (Night 2 of 2)', meta:'245 W Pinyon Pine Dr · washer + dryer · BOOKED'},
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

// ================= LODGING (per-night detail from spreadsheet) =================
const LODGING = [
  {night:0, dayNum:0, date:'Fri, May 29', city:'Hamilton, NY',          name:"Grandparents' house",                  type:'bed',       cost:0,      address:'Hamilton, NY',                                              booked:'Family',                  notes:'Welcome Ruby!'},
  {night:1, dayNum:1, date:'Sat, May 30', city:'Sandusky, OH',          name:'Car camp · Sandusky',                  type:'car camp',  cost:0,      address:'Sandusky, OH',                                              booked:'No reservation',          notes:'First night in the rig — the dress rehearsal'},
  {night:2, dayNum:2, date:'Sun, May 31', city:'Madison, WI',           name:"Gwen's Apartment",                     type:'bed',       cost:0,      address:'Madison, WI',                                               booked:'Family · Night 1 of 2',   notes:''},
  {night:3, dayNum:3, date:'Mon, Jun 1',  city:'Madison, WI',           name:"Gwen's Apartment",                     type:'bed',       cost:0,      address:'Madison, WI',                                               booked:'Family · Night 2 of 2',   notes:''},
  {night:4, dayNum:4, date:'Tue, Jun 2',  city:'Chamberlain, SD',       name:'Sanford Chamberlain Med Center lot',   type:'car camp',  cost:0,      address:'Chamberlain, SD',                                           booked:'No reservation needed',   notes:'Hospital parking — safe overnight option'},
  {night:5, dayNum:5, date:'Wed, Jun 3',  city:'Lusk, WY',              name:'Covered Wagon Motel',                  type:'hotel',     cost:0,      address:'730 S Main Street, Lusk, WY 82225',                         booked:"BOOKED · Anne's pts",     confirmation:'Trip ID 1016306395 · Conf #2439839733', link:'http://www.coveredwagonmotel.com/'},
  {night:6, dayNum:6, date:'Thu, Jun 4',  city:'Moab, UT',              name:'Home in Moab (Airbnb)',                type:'airbnb',    cost:288.79, costTotal:577.58, address:'1415 N Main St, Moab, UT 84532',         booked:'BOOKED · Night 1 of 2',   notes:'Total $577.58 split with Vamsi · Vamsi paid his portion ($310.84)'},
  {night:7, dayNum:7, date:'Fri, Jun 5',  city:'Moab, UT',              name:'Home in Moab (Airbnb)',                type:'airbnb',    cost:0,                          address:'1415 N Main St, Moab, UT 84532',         booked:'BOOKED · Night 2 of 2',   notes:'Same place'},
  {night:8, dayNum:8, date:'Sat, Jun 6',  city:'Bryce Canyon, UT',      name:"Tipi @ Ruby's Inn & Campgrounds",      type:'tipi',      cost:140,    address:"Ruby's Inn, Bryce Canyon, UT",                              booked:'BOOKED · Night 1 of 2',   notes:'$140 estimated total for both nights', link:'https://www.rubysinn.com/'},
  {night:9, dayNum:9, date:'Sun, Jun 7',  city:'Bryce Canyon, UT',      name:"Tipi @ Ruby's Inn & Campgrounds",      type:'tipi',      cost:0,                          address:"Ruby's Inn, Bryce Canyon, UT",           booked:'BOOKED · Night 2 of 2'},
  {night:10,dayNum:10,date:'Mon, Jun 8',  city:'Orderville, UT',        name:'Zion Airbnb (Orderville)',             type:'airbnb',    cost:332.89, costTotal:665.77, address:'245 W Pinyon Pine Drive, Orderville, UT 84758', booked:'BOOKED · Night 1 of 2', notes:'Washer + dryer onsite · Vamsi paid his portion'},
  {night:11,dayNum:11,date:'Tue, Jun 9',  city:'Orderville, UT',        name:'Zion Airbnb (Orderville)',             type:'airbnb',    cost:0,                          address:'245 W Pinyon Pine Drive, Orderville, UT 84758', booked:'BOOKED · Night 2 of 2', notes:'Same place'},
  {night:12,dayNum:12,date:'Wed, Jun 10', city:'Kernville, CA',         name:'Whispering Pines Lodge',               type:'hotel',     cost:0,      address:'13745 Sierra Way, Kernville, CA 93238',                     booked:"BOOKED · Anne's pts",     confirmation:'Trip ID 1016306698 · Conf #2439844351', link:'https://www.pineskernville.com/'},
  {night:13,dayNum:13,date:'Thu, Jun 11', city:'Yosemite area, CA',     name:'Car camp near Yosemite',               type:'car camp',  cost:30,     address:'National forest / dispersed',                               booked:'Not yet · book ahead',    notes:'Yosemite area packs early in summer'},
  {night:14,dayNum:14,date:'Fri, Jun 12', city:'Yosemite, CA',          name:'Car camp near Yosemite',               type:'car camp',  cost:30,     address:'National forest / dispersed',                               booked:'Not yet · book ahead'},
  {night:15,dayNum:15,date:'Sat, Jun 13', city:'Lake Tahoe area, CA',   name:'Hipcamp · Foothill Ridge',             type:'hipcamp',   cost:47.70,  address:'~1 hr from Lake Tahoe, CA',                                 booked:'BOOKED',                  link:'https://www.hipcamp.com/en-US/land/california-foothill-ridge-pw1hjnrd'},
  {night:16,dayNum:16,date:'Sun, Jun 14', city:'San Francisco, CA',     name:"Cousins' home",                         type:'bed',       cost:0,      address:'San Francisco, CA',                                         booked:'Family · Night 1 of 2'},
  {night:17,dayNum:17,date:'Mon, Jun 15', city:'San Francisco, CA',     name:"Cousins' home",                         type:'bed',       cost:0,      address:'San Francisco, CA',                                         booked:'Family · Night 2 of 2'}
];

// ================= FLIGHTS (from the Flights tab) =================
const FLIGHTS = [
  {dayNum:0,  date:'Fri, May 29', who:'Ruby',  from:'SRQ', to:'CLT', airline:'AA', flight:'5627', dep:'5:20 PM', arr:'7:35 PM', duration:'2h 10m', cost:'Booked on pts'},
  {dayNum:0,  date:'Fri, May 29', who:'Ruby',  from:'CLT', to:'SYR', airline:'AA', flight:'1976', dep:'9:00 PM', arr:'10:50 PM', duration:'2h 0m', layover:'1h 25m layover in CLT'},
  {dayNum:6,  date:'Thu, Jun 4',  who:'Vamsi', from:'DFW', to:'DEN', airline:'UA', flight:'644',  arr:'10:10 AM',  note:'Pick up at Denver airport'},
  {dayNum:6,  date:'Thu, Jun 4',  who:'Diego', from:'(home)', to:'DEN',                                arr:'10:10 AM',  note:'Pick up at Denver airport'},
  {dayNum:12, date:'Wed, Jun 10', who:'Diego', from:'LAS', to:'(home)', dep:'12:40 PM', note:'Drop off at Las Vegas airport'},
  {dayNum:12, date:'Wed, Jun 10', who:'Kara',  from:'LAS', to:'(home)', dep:'1:00 PM',  note:'Drop off at Las Vegas airport'},
  {dayNum:12, date:'Wed, Jun 10', who:'Vamsi', from:'LAS', to:'DFW', airline:'UA', flight:'2741', dep:'3:30 PM'},
  {dayNum:18, date:'Tue, Jun 16', who:'Ruby',  from:'SFO', to:'BWI', airline:'TP', flight:'869',  dep:'9:00 PM', arr:'5:20 AM (next day · −3h)', duration:'5h 20m', cost:'$210'},
  {dayNum:18, date:'Tue, Jun 16', who:'Ruby',  from:'BWI', to:'SRQ', airline:'TP', flight:'221',  dep:'8:10 AM', arr:'10:45 AM', duration:'2h 35m', layover:'2h 50m layover in BWI'}
];

// ================= DAILY FOOD (from the Food tab) =================
const DAILY_FOOD = [
  {dayNum:0,  location:'Hamilton',                       breakfast:0,  lunch:0,  dinner:0,  snacks:0, total:0,  notes:'Ruby needs late-night snack run after landing'},
  {dayNum:1,  location:'Hamilton → Sandusky',            breakfast:4,  lunch:0,  dinner:50, snacks:8, total:62, notes:'Aunt & Uncle lunch (free) · Mekong Vietnamese dinner'},
  {dayNum:2,  location:'Sandusky → Madison',             breakfast:0,  lunch:10, dinner:30, snacks:8, total:48, notes:'Dinner with Gwen'},
  {dayNum:3,  location:'Madison',                        breakfast:0,  lunch:30, dinner:20, snacks:8, total:58, notes:'Brunch out + grocery dinner'},
  {dayNum:4,  location:'Madison → Sioux Falls → SD',     breakfast:4,  lunch:10, dinner:30, snacks:8, total:52, notes:'Sioux Falls takeout for dinner'},
  {dayNum:5,  location:'Sioux Falls → Badlands → Lusk',  breakfast:4,  lunch:10, dinner:16, snacks:8, total:38, notes:'Wall Drug for lunch'},
  {dayNum:6,  location:'Lusk → Moab',                    breakfast:4,  lunch:10, dinner:15, snacks:8, total:37, notes:'Long drive day — quick meals'},
  {dayNum:7,  location:'Moab',                           breakfast:4,  lunch:14, dinner:18, snacks:8, total:44, notes:'Arches park day'},
  {dayNum:8,  location:'Moab → Bryce Canyon',            breakfast:4,  lunch:14, dinner:20, snacks:8, total:46, notes:'Scenic Byway 12 lunch stop'},
  {dayNum:9,  location:'Bryce Canyon',                   breakfast:4,  lunch:6,  dinner:20, snacks:8, total:38, notes:'Camp meals all day'},
  {dayNum:10, location:'Bryce → Zion',                   breakfast:4,  lunch:6,  dinner:20, snacks:8, total:38, notes:'Dinner in Springdale'},
  {dayNum:11, location:'Zion',                           breakfast:4,  lunch:6,  dinner:20, snacks:8, total:38, notes:'Picnic in the park + dinner out'},
  {dayNum:12, location:'Zion → Sequoia',                 breakfast:4,  lunch:6,  dinner:15, snacks:8, total:33, notes:'Meal-prepped from Airbnb'},
  {dayNum:13, location:'Sequoia → Yosemite',             breakfast:4,  lunch:10, dinner:15, snacks:8, total:37, notes:'Picnic lunch in Giant Forest'},
  {dayNum:14, location:'Yosemite',                       breakfast:4,  lunch:10, dinner:15, snacks:8, total:37, notes:'Lodge lunch + camp dinner'},
  {dayNum:15, location:'Yosemite → Lake Tahoe',          breakfast:4,  lunch:10, dinner:15, snacks:8, total:37, notes:'Lakeside dinner'},
  {dayNum:16, location:'Lake Tahoe → San Francisco',     breakfast:4,  lunch:10, dinner:0,  snacks:8, total:22, notes:'Dinner with cousins (free)'},
  {dayNum:17, location:'San Francisco',                  breakfast:4,  lunch:40, dinner:0,  snacks:8, total:52, notes:'All-day eating in SF'},
  {dayNum:18, location:'San Francisco (departure)',      breakfast:0,  lunch:0,  dinner:0,  snacks:0, total:0,  notes:'Airport coffee'}
];

// ================= BUDGET DETAIL (from the Budget tab) =================
const BUDGET_AUNT_RANGES = {
  food:   {low:400, high:600},
  hotels: {low:800, high:1000},
  gas:    {low:500, high:700},
  total:  {low:1700, high:2300}
};

const BUDGET_TOTALS = {
  food:        717,
  gas:         568.10,
  miscSetup:   221.59,
  lodging:     869.38,
  flights:     210,
  grandTotal:  2586.06
};

const BUDGET_RUBY_PAID = [
  {item:'Paid AirBNBs (Moab + Zion)', amount:621.68},
  {item:'Ruby return flight (SFO → SRQ)', amount:210},
  {item:'TOTAL Ruby has paid', amount:831.68, total:true}
];

const BUDGET_KNOWN_MISC = [
  {item:'Premium PlanetFit Membership', notes:'Covers both ppl · $25/mo + $49 annual',                   cost:29.08},
  {item:'Big Water Jugs (×5)',          notes:'$1.50 each',                                              cost:7.50},
  {item:'Little Battery Fans (×2)',     notes:'$13 each',                                                cost:26.00},
  {item:'Propane Hot Plate',            notes:'Single burner backpacking type',                          cost:30.00},
  {item:'Propane Canisters (×5)',       notes:'16oz canister lasts ~2 hrs on high',                      cost:37.50},
  {item:'Laundromat Stop',              notes:'Half-way · Zion Airbnb has washer/dryer',                 cost:10.00},
  {item:'Daily Ice (×8)',               notes:'For the cooler',                                          cost:16.00},
  {item:'Cooler (large)',               notes:"Try Grandparents'/Goodwill first",                        cost:20.00},
  {item:"Chef's Knife",                                                                                  cost:2.54},
  {item:'Paring Knife',                                                                                  cost:7.97},
  {item:'Cutting Board',                                                                                 cost:9.88},
  {item:'Tupperware (×10)',             notes:'Rubbermaid TakeAlongs',                                   cost:5.22},
  {item:'Foil',                                                                                          cost:1.88},
  {item:'Plastic Bags (gallon)',                                                                         cost:3.52},
  {item:'Dish Soap',                                                                                     cost:3.94},
  {item:'Dish Sponge',                                                                                   cost:3.88}
];

const BUDGET_GAS_BY_DAY = [
  {dayNum:1,  route:'Hamilton → Sandusky',                miles:464, gallons:14.5, pricePerGal:3.50, cost:50.80},
  {dayNum:2,  route:'Sandusky → Madison',                 miles:437, gallons:13.7, pricePerGal:3.40, cost:46.40},
  {dayNum:4,  route:'Madison → Chamberlain (+ stops)',    miles:594, gallons:18.6, pricePerGal:3.40, cost:63.20},
  {dayNum:5,  route:'SD → Badlands → Rushmore → WY',      miles:388, gallons:12.1, pricePerGal:3.40, cost:41.10},
  {dayNum:6,  route:'Lusk → Moab (+ stops)',              miles:604, gallons:18.9, pricePerGal:3.80, cost:71.80},
  {dayNum:7,  route:'Moab / Arches park driving',         miles:80,  gallons:2.5,  pricePerGal:3.80, cost:9.50},
  {dayNum:8,  route:'Moab → Bryce + park driving',        miles:328, gallons:10.3, pricePerGal:3.80, cost:39.10},
  {dayNum:9,  route:'Bryce full day in park',             miles:80,  gallons:2.5,  pricePerGal:3.80, cost:9.50},
  {dayNum:10, route:'Bryce → Zion + exploring',           miles:153, gallons:4.8,  pricePerGal:3.80, cost:18.20},
  {dayNum:11, route:'Zion full day in park',              miles:80,  gallons:2.5,  pricePerGal:3.80, cost:9.50},
  {dayNum:12, route:'Zion → Sequoia (+ Vegas drop)',      miles:544, gallons:17.0, pricePerGal:5.30, cost:90.10},
  {dayNum:13, route:'Sequoia → Yosemite + park',          miles:188, gallons:5.9,  pricePerGal:5.30, cost:31.30},
  {dayNum:14, route:'Yosemite full day in park',          miles:100, gallons:3.1,  pricePerGal:5.30, cost:16.40},
  {dayNum:15, route:'Yosemite → Tahoe',                   miles:236, gallons:7.4,  pricePerGal:5.30, cost:39.20},
  {dayNum:16, route:'Tahoe → San Francisco',              miles:194, gallons:6.1,  pricePerGal:5.30, cost:32.30}
];

// ================= PODCASTS (for the Reading & Listening page) =================
const PODCASTS = {
  nps: [
    {
      title: 'Parkography',
      podcast: 'Parkography',
      note: 'In-depth history, vivid soundscapes, and stories behind landmarks like the Grand Canyon and Yellowstone.'
    },
    {
      title: 'Exploring the National Parks',
      podcast: 'Dirt In My Shoes',
      note: 'Highly recommended for trip planning — detailed episodes on Yellowstone (including Lamar Valley and the Grand Canyon of the Yellowstone), Zion, and scenic drives.'
    },
    {
      title: 'National Park After Dark',
      podcast: 'National Park After Dark',
      note: "Explores the darker, stranger, and historical side of America's national parks. Perfect for evening listening after a day of hiking."
    },
    {
      title: 'My Park Story',
      podcast: 'NPS · My Park Story',
      note: 'Personal, intimate stories from individuals connected to NPS lands — produced by the National Park Service itself.'
    }
  ],
  outside: [
    {
      title: 'A Wild Mission to Visit Every National Park',
      podcast: 'Outside Podcast · 2023',
      note: '63 Parks Traveler writer Emily Pennington discusses her experience visiting every National Park, with insights that map straight onto your trip.'
    },
    {
      title: 'The Dumbest, Greatest Road Trip Ever',
      podcast: 'Outside Podcast · 2021',
      note: 'A perfect, humorous story for a long road trip — exactly the energy you want at hour eight of driving.'
    },
    {
      title: 'Outdoor Adventure and the Art of Self Reliance, with Nick Offerman',
      podcast: 'Outside Podcast · 2025',
      note: 'An entertaining interview that complements the rugged spirit of parks like Lassen and Badlands.'
    },
    {
      title: 'The Joy of the Very Short Adventure',
      podcast: 'Outside Podcast · 2023',
      note: 'Explores "microadventures" — perfect for finding hidden gems inside the bigger parks.'
    }
  ]
};
