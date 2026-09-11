export interface LibraryImage {
  url: string;
  title: string;
  tags: string[];
}

export const IMAGE_LIBRARY: LibraryImage[] = [
  // Birthday
  { url: 'https://images.pexels.com/photos/30682919/pexels-photo-30682919.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Birthday party with friends', tags: ['birthday', 'party', 'balloons', 'celebration', 'cake', 'friends'] },
  { url: 'https://images.pexels.com/photos/25956380/pexels-photo-25956380.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Birthday candles', tags: ['birthday', 'candles', 'celebration', 'festive'] },
  { url: 'https://images.pexels.com/photos/7180713/pexels-photo-7180713.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Woman celebrating birthday', tags: ['birthday', 'balloons', 'cake', 'celebration', 'woman'] },
  { url: 'https://images.pexels.com/photos/7600420/pexels-photo-7600420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Birthday setup with cake', tags: ['birthday', 'cake', 'candles', 'balloons', 'banner'] },
  { url: 'https://images.pexels.com/photos/30844787/pexels-photo-30844787.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: '30th birthday party', tags: ['birthday', 'golden', 'balloons', 'cake', 'drinks', 'milestone'] },
  { url: 'https://images.pexels.com/photos/27177108/pexels-photo-27177108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: "Child's birthday", tags: ['birthday', 'child', 'balloons', 'cake', 'family'] },
  { url: 'https://images.pexels.com/photos/30682918/pexels-photo-30682918.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Friends celebrating birthday', tags: ['birthday', 'friends', 'balloons', 'cake', 'indoors'] },
  { url: 'https://images.pexels.com/photos/16220888/pexels-photo-16220888.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Birthday dessert table', tags: ['birthday', 'dessert', 'table', 'balloons', 'cake', 'festive'] },
  { url: 'https://images.pexels.com/photos/30692825/pexels-photo-30692825.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Birthday with confetti', tags: ['birthday', 'confetti', 'cake', 'balloons', 'celebration'] },

  // Wedding
  { url: 'https://images.pexels.com/photos/31517332/pexels-photo-31517332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Wedding aisle flowers', tags: ['wedding', 'flowers', 'aisle', 'roses', 'ceremony', 'elegant'] },
  { url: 'https://images.pexels.com/photos/17315417/pexels-photo-17315417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Wedding venue', tags: ['wedding', 'venue', 'aisle', 'chairs', 'floral', 'indoor'] },
  { url: 'https://images.pexels.com/photos/38583659/pexels-photo-38583659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Wedding ceremony space', tags: ['wedding', 'ceremony', 'white', 'flowers', 'wooden', 'chairs'] },
  { url: 'https://images.pexels.com/photos/540522/pexels-photo-540522.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Bridal bouquet', tags: ['wedding', 'bouquet', 'bride', 'roses', 'pink', 'white'] },
  { url: 'https://images.pexels.com/photos/8815291/pexels-photo-8815291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Wedding vows', tags: ['wedding', 'bride', 'groom', 'vows', 'ceremony', 'floral'] },
  { url: 'https://images.pexels.com/photos/8687072/pexels-photo-8687072.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Romantic wedding moment', tags: ['wedding', 'bride', 'groom', 'romantic', 'floral'] },
  { url: 'https://images.pexels.com/photos/17315420/pexels-photo-17315420.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Indoor wedding venue', tags: ['wedding', 'indoor', 'greenery', 'floral', 'elegant'] },
  { url: 'https://images.pexels.com/photos/20199360/pexels-photo-20199360.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Outdoor wedding setup', tags: ['wedding', 'outdoor', 'white', 'flowers', 'elegant'] },

  // Conference / Business
  { url: 'https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Conference presentation', tags: ['conference', 'presentation', 'speaker', 'stage', 'audience', 'business'] },
  { url: 'https://images.pexels.com/photos/8348468/pexels-photo-8348468.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Business conference', tags: ['conference', 'business', 'speaker', 'microphone', 'men'] },
  { url: 'https://images.pexels.com/photos/29708260/pexels-photo-29708260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Corporate event speaker', tags: ['conference', 'corporate', 'speaker', 'stage', 'talk'] },
  { url: 'https://images.pexels.com/photos/1708912/pexels-photo-1708912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Female speaker on stage', tags: ['conference', 'speaker', 'female', 'audience', 'auditorium', 'presentation'] },
  { url: 'https://images.pexels.com/photos/20733081/pexels-photo-20733081.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Large conference audience', tags: ['conference', 'audience', 'speaker', 'large', 'event'] },
  { url: 'https://images.pexels.com/photos/29708258/pexels-photo-29708258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Speaker with slides', tags: ['conference', 'speaker', 'slides', 'presentation', 'stage'] },

  // Business launch / Startup
  { url: 'https://images.pexels.com/photos/25809231/pexels-photo-25809231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Tech exhibit', tags: ['launch', 'tech', 'tablet', 'business', 'innovation', 'product'] },
  { url: 'https://images.pexels.com/photos/6913330/pexels-photo-6913330.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Startup concept', tags: ['startup', 'launch', 'business', 'tablet', 'entrepreneur'] },
  { url: 'https://images.pexels.com/photos/7495604/pexels-photo-7495604.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Startup meeting', tags: ['startup', 'business', 'meeting', 'office', 'team', 'strategy'] },
  { url: 'https://images.pexels.com/photos/586045/pexels-photo-586045.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Rocket launch', tags: ['launch', 'rocket', 'startup', 'sky', 'sunset', 'business'] },

  // Party / Nightclub
  { url: 'https://images.pexels.com/photos/5192503/pexels-photo-5192503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Nightclub dancing', tags: ['party', 'nightclub', 'dancing', 'green', 'lights', 'crowd'] },
  { url: 'https://images.pexels.com/photos/5610120/pexels-photo-5610120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Dance floor lasers', tags: ['party', 'nightclub', 'dance', 'floor', 'laser', 'lights'] },
  { url: 'https://images.pexels.com/photos/5192307/pexels-photo-5192307.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Lively nightclub', tags: ['party', 'nightclub', 'dancing', 'music', 'colorful', 'lights'] },
  { url: 'https://images.pexels.com/photos/8448547/pexels-photo-8448547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Nightclub blue lights', tags: ['party', 'nightclub', 'blue', 'lights', 'dancing'] },
  { url: 'https://images.pexels.com/photos/342520/pexels-photo-342520.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Neon nightclub scene', tags: ['party', 'nightclub', 'neon', 'dancing', 'crowd', 'nightlife'] },
  { url: 'https://images.pexels.com/photos/9005510/pexels-photo-9005510.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'DJ and crowd', tags: ['party', 'dj', 'crowd', 'music', 'nightclub'] },
  { url: 'https://images.pexels.com/photos/5175593/pexels-photo-5175593.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Confetti party', tags: ['party', 'confetti', 'crowd', 'colorful', 'lights', 'nightclub'] },

  // Charity / Gala
  { url: 'https://images.pexels.com/photos/35327677/pexels-photo-35327677.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Black tie event', tags: ['gala', 'charity', 'black', 'tie', 'elegant', 'formal'] },
  { url: 'https://images.pexels.com/photos/16935968/pexels-photo-16935968.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Elegant table setting', tags: ['gala', 'dinner', 'table', 'floral', 'candles', 'elegant', 'charity'] },
  { url: 'https://images.pexels.com/photos/12689009/pexels-photo-12689009.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Ballroom with chandeliers', tags: ['gala', 'ballroom', 'chandeliers', 'crystal', 'elegant', 'luxury'] },
  { url: 'https://images.pexels.com/photos/16935908/pexels-photo-16935908.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Round table setting', tags: ['gala', 'dinner', 'round', 'table', 'floral', 'centerpiece', 'elegant'] },
  { url: 'https://images.pexels.com/photos/35017879/pexels-photo-35017879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Banquet hall', tags: ['gala', 'banquet', 'hall', 'purple', 'lighting', 'tables', 'event'] },

  // Festival / Concert
  { url: 'https://images.pexels.com/photos/7081216/pexels-photo-7081216.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Outdoor concert', tags: ['festival', 'concert', 'outdoor', 'crowd', 'music', 'dusk'] },
  { url: 'https://images.pexels.com/photos/12657546/pexels-photo-12657546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Festival stage', tags: ['festival', 'concert', 'stage', 'colorful', 'crowd', 'music'] },
  { url: 'https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Live music concert', tags: ['concert', 'live', 'music', 'stage', 'performers', 'audience'] },
  { url: 'https://images.pexels.com/photos/13230484/pexels-photo-13230484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Night concert', tags: ['concert', 'night', 'stage', 'colorful', 'lighting', 'audience'] },
  { url: 'https://images.pexels.com/photos/30247038/pexels-photo-30247038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Concert with fireworks', tags: ['concert', 'fireworks', 'crowd', 'stage', 'spectacular'] },

  // Baby shower
  { url: 'https://images.pexels.com/photos/1682459/pexels-photo-1682459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Pastel dessert table', tags: ['baby', 'shower', 'dessert', 'table', 'pastel', 'celebration'] },
  { url: 'https://images.pexels.com/photos/1682462/pexels-photo-1682462.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Baby shower setup', tags: ['baby', 'shower', 'pastel', 'dessert', 'elegant'] },
  { url: 'https://images.pexels.com/photos/17637268/pexels-photo-17637268.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Baby shower balloons', tags: ['baby', 'shower', 'balloons', 'festive', 'colorful'] },
  { url: 'https://images.pexels.com/photos/3593428/pexels-photo-3593428.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Baby shower garden', tags: ['baby', 'shower', 'garden', 'outdoor', 'cake', 'balloons'] },
  { url: 'https://images.pexels.com/photos/9214966/pexels-photo-9214966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Baby shower celebration', tags: ['baby', 'shower', 'gifts', 'women', 'celebration', 'indoors'] },

  // Networking / Corporate
  { url: 'https://images.pexels.com/photos/8761650/pexels-photo-8761650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Business networking', tags: ['networking', 'business', 'seminar', 'professionals', 'indoor'] },
  { url: 'https://images.pexels.com/photos/7648057/pexels-photo-7648057.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Conference registration', tags: ['networking', 'conference', 'registration', 'business', 'desk'] },
  { url: 'https://images.pexels.com/photos/8761782/pexels-photo-8761782.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Conference break', tags: ['networking', 'conference', 'break', 'professionals', 'conversation'] },
  { url: 'https://images.pexels.com/photos/8761308/pexels-photo-8761308.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Stylish networking', tags: ['networking', 'professionals', 'conference', 'room', 'business'] },

  // Dinner party / Table setting
  { url: 'https://images.pexels.com/photos/4451262/pexels-photo-4451262.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Formal table setting', tags: ['dinner', 'party', 'table', 'formal', 'cutlery', 'plates', 'glasses'] },
  { url: 'https://images.pexels.com/photos/16935903/pexels-photo-16935903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Candlelit dinner table', tags: ['dinner', 'candles', 'roses', 'romantic', 'table', 'elegant'] },
  { url: 'https://images.pexels.com/photos/5037369/pexels-photo-5037369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Decorated dining table', tags: ['dinner', 'table', 'floral', 'centerpiece', 'gift', 'elegant'] },
  { url: 'https://images.pexels.com/photos/17294730/pexels-photo-17294730.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Elegant dining setup', tags: ['dinner', 'dining', 'floral', 'candles', 'elegant', 'tableware'] },

  // Graduation
  { url: 'https://images.pexels.com/photos/39192294/pexels-photo-39192294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Graduation celebration', tags: ['graduation', 'caps', 'gowns', 'celebration', 'outdoor'] },
  { url: 'https://images.pexels.com/photos/30562665/pexels-photo-30562665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Throwing graduation caps', tags: ['graduation', 'caps', 'celebration', 'achievement'] },
  { url: 'https://images.pexels.com/photos/8106652/pexels-photo-8106652.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Graduates with confetti', tags: ['graduation', 'confetti', 'celebration', 'graduates', 'joy'] },

  // Award / Red carpet
  { url: 'https://images.pexels.com/photos/33162637/pexels-photo-33162637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Red carpet entrance', tags: ['award', 'red', 'carpet', 'entrance', 'event', 'formal'] },
  { url: 'https://images.pexels.com/photos/17931340/pexels-photo-17931340.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Formal red staircase', tags: ['award', 'formal', 'suits', 'red', 'staircase', 'floral', 'gala'] },
  { url: 'https://images.pexels.com/photos/7594122/pexels-photo-7594122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Couple on red carpet', tags: ['award', 'red', 'carpet', 'couple', 'fashion', 'elegant'] },
  { url: 'https://images.pexels.com/photos/7005636/pexels-photo-7005636.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Gold trophy', tags: ['award', 'trophy', 'gold', 'tuxedo', 'achievement', 'celebration'] },
  { url: 'https://images.pexels.com/photos/39023438/pexels-photo-39023438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Glamorous party', tags: ['award', 'glamorous', 'party', 'formal', 'evening', 'wear', 'elegant'] },
];
