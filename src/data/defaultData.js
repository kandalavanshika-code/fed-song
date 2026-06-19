export const defaultTracks = [
  {
    "id": 1440899467,
    "title": "ocean eyes",
    "artist": { "name": "Billie Eilish" },
    "album": { "title": "dont smile at me", "cover_medium": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/02/1d/30/021d3036-5503-3ed3-df00-882f2833a6ae/17UM1IM17026.rgb.jpg/300x300bb.jpg" },
    "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d6/59/2b/d6592b0b-1e7e-4743-b2e4-f2af038fd783/mzaf_7697277787797935735.plus.aac.p.m4a",
    "duration": 200
  },
  {
    "id": 1450695872,
    "title": "when the party's over",
    "artist": { "name": "Billie Eilish" },
    "album": { "title": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "cover_medium": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/300x300bb.jpg" },
    "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2a/ba/44/2aba4410-ba71-89ce-e075-10120409c31c/mzaf_16887001963655152332.plus.aac.p.m4a",
    "duration": 196
  },
  {
    "id": 1441154437,
    "title": "Umbrella (feat. JAŸ-Z)",
    "artist": { "name": "Rihanna" },
    "album": { "title": "Good Girl Gone Bad: Reloaded", "cover_medium": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2b/c0/81/2bc081c8-25f0-ba43-d451-587a54613778/16UMGIM59202.rgb.jpg/300x300bb.jpg" },
    "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7b/45/22/7b452241-882c-409b-3a9b-23306b14286a/mzaf_8588243939716013218.plus.aac.p.m4a",
    "duration": 276
  },
  {
    "id": 1624932774,
    "title": "POP!",
    "artist": { "name": "NAYEON" },
    "album": { "title": "IM NAYEON", "cover_medium": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/49/ec/3f49ecb2-cb91-dd28-45b9-a31326d7e63b/738676859614_Cover.jpg/300x300bb.jpg" },
    "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cc/74/22/cc7422df-1686-77ff-d3b0-2a2eb093fd76/mzaf_17159235851286493668.plus.aac.p.m4a",
    "duration": 168
  },
  {
    "id": 303178994,
    "title": "Pop",
    "artist": { "name": "*NSYNC" },
    "album": { "title": "Celebrity", "cover_medium": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/cc/e7/d1/cce7d167-f80b-4600-1fb8-cb586cf9a861/mzi.siscajhr.jpg/300x300bb.jpg" },
    "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c4/d3/1b/c4d31be9-04a8-649e-18f9-a8e33d368642/mzaf_2388649982457011349.plus.aac.p.m4a",
    "duration": 238
  }
];

export const defaultPlaylists = [
  {
    id: 'p1',
    title: 'Global Top Hits',
    picture_medium: defaultTracks[0].album.cover_medium,
    picture_xl: defaultTracks[0].album.cover_medium,
    description: 'The biggest hits around the world, curated for you.',
    creator: { name: 'NeonBeats' },
    tracks: { data: defaultTracks }
  },
  {
    id: 'p2',
    title: 'Chill Vibes',
    picture_medium: defaultTracks[1].album.cover_medium,
    picture_xl: defaultTracks[1].album.cover_medium,
    description: 'Kick back and relax with these smooth tracks.',
    creator: { name: 'NeonBeats' },
    tracks: { data: [defaultTracks[1], defaultTracks[0], defaultTracks[3]] }
  },
  {
    id: 'p3',
    title: 'Pop Anthems',
    picture_medium: defaultTracks[2].album.cover_medium,
    picture_xl: defaultTracks[2].album.cover_medium,
    description: 'The ultimate pop anthems to get you moving.',
    creator: { name: 'NeonBeats' },
    tracks: { data: [defaultTracks[2], defaultTracks[3], defaultTracks[4]] }
  }
];
