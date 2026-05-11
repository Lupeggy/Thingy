// ─── Prompt structure ─────────────────────────────────────────────────────────
// tier: 'free' | 'paid' | 'pack_city' | 'pack_body' | 'pack_memory'
// timing: null = no timer | { type: 'observe', seconds } | { type: 'speed', seconds }
//   observe = countdown BEFORE drawing (meditative look first)
//   speed   = countdown WHILE drawing (challenge mode)

export const PROMPTS = [

  // ── FREE TIER (15) ──────────────────────────────────────────────────────────
  {
    id: 'f01', tier: 'free', timing: null,
    text: 'Draw the shadow of whatever is closest to you right now.',
    hint: 'look slowly first',
  },
  {
    id: 'f02', tier: 'free', timing: null,
    text: 'Draw what tired feels like. Any line counts.',
    hint: 'no wrong answer',
  },
  {
    id: 'f03', tier: 'free', timing: null,
    text: 'Find a receipt or tissue. Draw one thing you saw today.',
    hint: 'real paper, real feeling',
  },
  {
    id: 'f04', tier: 'free', timing: null,
    text: 'Draw the shape of this moment.',
    hint: "don't think, just draw",
  },
  {
    id: 'f05', tier: 'free', timing: null,
    text: 'Look at the nearest object. Draw only its outline.',
    hint: 'observe before you draw',
  },
  {
    id: 'f06', tier: 'free', timing: null,
    text: 'Draw one thing outside your window. Just one.',
    hint: 'really look at it',
  },
  {
    id: 'f07', tier: 'free', timing: null,
    text: 'Draw something you have been carrying.',
    hint: 'can be invisible',
  },
  {
    id: 'f08', tier: 'free', timing: null,
    text: 'Find a napkin or any scrap. Draw what today smells like.',
    hint: 'use any mark you want',
  },
  {
    id: 'f09', tier: 'free', timing: null,
    text: 'Draw the corner of the room you are in.',
    hint: 'pick a small corner, observe it',
  },
  {
    id: 'f10', tier: 'free', timing: null,
    text: 'Draw something you touched today but never really looked at.',
    hint: 'look at it now',
  },
  {
    id: 'f11', tier: 'free', timing: null,
    text: 'Draw how you felt when you woke up. No words.',
    hint: 'shapes and lines are enough',
  },
  {
    id: 'f12', tier: 'free', timing: null,
    text: 'Draw the silhouette of your hand.',
    hint: 'trace or from memory',
  },
  {
    id: 'f13', tier: 'free', timing: null,
    text: 'Look up. Draw what you see above you.',
    hint: 'ceiling, sky, whatever is there',
  },
  {
    id: 'f14', tier: 'free', timing: null,
    text: 'Draw something tiny you usually ignore.',
    hint: 'the smaller the better',
  },
  {
    id: 'f15', tier: 'free', timing: null,
    text: 'Draw the light in the room right now.',
    hint: 'where is it coming from?',
  },

  // ── PAID TIER (150) — with some timing prompts mixed in ───────────────────
  {
    id: 'p01', tier: 'paid', timing: null,
    text: 'Draw a cup, mug, or bottle near you. Just the shape.',
    hint: 'observe its curves',
  },
  {
    id: 'p02', tier: 'paid', timing: { type: 'observe', seconds: 60 },
    text: 'Look at this object for one full minute. Then draw it.',
    hint: 'pick anything near you — really look first',
  },
  {
    id: 'p03', tier: 'paid', timing: null,
    text: 'Draw what music sounds like right now. Or silence.',
    hint: 'any mark is right',
  },
  {
    id: 'p04', tier: 'paid', timing: { type: 'speed', seconds: 45 },
    text: 'Draw the nearest face you can see. 45 seconds.',
    hint: 'fast and messy is perfect',
  },
  {
    id: 'p05', tier: 'paid', timing: null,
    text: 'Draw what your hands feel like today.',
    hint: 'tired, restless, calm?',
  },
  {
    id: 'p06', tier: 'paid', timing: { type: 'observe', seconds: 30 },
    text: 'Close your eyes for 30 seconds. Picture something you love. Draw it.',
    hint: 'let the image form fully first',
  },
  {
    id: 'p07', tier: 'paid', timing: null,
    text: 'Pick up the nearest small object. Draw it 3 times, each different.',
    hint: 'observe how it changes',
  },
  {
    id: 'p08', tier: 'paid', timing: { type: 'speed', seconds: 30 },
    text: 'Draw your room in 30 seconds. Never lift the pen.',
    hint: 'one continuous line only',
  },
  {
    id: 'p09', tier: 'paid', timing: null,
    text: 'Draw something you are looking forward to.',
    hint: 'even something small counts',
  },
  {
    id: 'p10', tier: 'paid', timing: null,
    text: 'Draw the edge of something. Any edge.',
    hint: 'edges tell stories',
  },
  {
    id: 'p11', tier: 'paid', timing: { type: 'observe', seconds: 90 },
    text: 'Watch the light in your room for 90 seconds. Notice how it moves. Draw it.',
    hint: 'observe before touching the pen',
  },
  {
    id: 'p12', tier: 'paid', timing: null,
    text: 'Draw what comfort looks like to you today.',
    hint: 'it is different every day',
  },
  {
    id: 'p13', tier: 'paid', timing: { type: 'speed', seconds: 60 },
    text: 'Draw your hand without looking at the paper. 60 seconds.',
    hint: 'eyes on hand only',
  },
  {
    id: 'p14', tier: 'paid', timing: null,
    text: 'Draw something broken or worn out near you.',
    hint: 'beauty in imperfection',
  },
  {
    id: 'p15', tier: 'paid', timing: null,
    text: 'Draw the view from where you are sitting right now.',
    hint: 'exactly as it is, not how you wish it looked',
  },
  {
    id: 'p16', tier: 'paid', timing: { type: 'observe', seconds: 45 },
    text: 'Breathe slowly for 45 seconds. Then draw what calm feels like.',
    hint: 'no rush after the timer',
  },
  {
    id: 'p17', tier: 'paid', timing: null,
    text: 'Draw something that has been in the same place for months.',
    hint: 'what has it witnessed?',
  },
  {
    id: 'p18', tier: 'paid', timing: { type: 'speed', seconds: 30 },
    text: 'Draw your coffee or drink right now. 30 seconds.',
    hint: 'impressions only, not detail',
  },
  {
    id: 'p19', tier: 'paid', timing: null,
    text: 'Draw what it felt like to arrive somewhere today.',
    hint: 'movement has a shape',
  },
  {
    id: 'p20', tier: 'paid', timing: null,
    text: 'Find a pattern around you. Draw just a small section of it.',
    hint: 'zoom in close',
  },
  {
    id: 'p21', tier: 'paid', timing: { type: 'observe', seconds: 60 },
    text: 'Look out the window for one minute without drawing. Then draw one thing.',
    hint: 'the waiting makes you see more',
  },
  {
    id: 'p22', tier: 'paid', timing: null,
    text: 'Draw something that represents this week.',
    hint: 'one object or shape is enough',
  },
  {
    id: 'p23', tier: 'paid', timing: { type: 'speed', seconds: 45 },
    text: 'Draw five things on your desk. 45 seconds total.',
    hint: 'tiny sketches, not portraits',
  },
  {
    id: 'p24', tier: 'paid', timing: null,
    text: 'Draw the space between two objects.',
    hint: 'the negative space, not the objects',
  },
  {
    id: 'p25', tier: 'paid', timing: null,
    text: 'Draw something that smells good.',
    hint: 'translate a sense into lines',
  },
  {
    id: 'p26', tier: 'paid', timing: { type: 'observe', seconds: 30 },
    text: 'Hold something in your hand for 30 seconds. Feel its weight. Draw it.',
    hint: 'draw what you felt, not what you saw',
  },
  {
    id: 'p27', tier: 'paid', timing: null,
    text: 'Draw what yesterday felt like as a landscape.',
    hint: 'flat? hilly? stormy?',
  },
  {
    id: 'p28', tier: 'paid', timing: null,
    text: 'Draw a chair. Any chair.',
    hint: 'chairs carry people and stories',
  },
  {
    id: 'p29', tier: 'paid', timing: { type: 'speed', seconds: 60 },
    text: 'Draw your entire day in 60 seconds. Use tiny symbols.',
    hint: 'a timeline of moments',
  },
  {
    id: 'p30', tier: 'paid', timing: null,
    text: 'Draw something that is almost finished.',
    hint: 'a candle, a book, a roll of tape',
  },
  {
    id: 'p31', tier: 'paid', timing: null,
    text: 'Draw a window. What is beyond it?',
    hint: 'real or imagined',
  },
  {
    id: 'p32', tier: 'paid', timing: { type: 'observe', seconds: 60 },
    text: 'Watch your own breathing for one minute. Draw what it looks like.',
    hint: 'rhythm has shape',
  },
  {
    id: 'p33', tier: 'paid', timing: null,
    text: 'Draw something you want to remember about today.',
    hint: 'small things are worth keeping',
  },
  {
    id: 'p34', tier: 'paid', timing: null,
    text: 'Draw something that is waiting.',
    hint: 'a key, a bag, a letter',
  },
  {
    id: 'p35', tier: 'paid', timing: { type: 'speed', seconds: 30 },
    text: 'Draw your feet right now. 30 seconds.',
    hint: 'they carried you here',
  },
  {
    id: 'p36', tier: 'paid', timing: null,
    text: 'Draw the messiest corner near you.',
    hint: 'mess has character',
  },
  {
    id: 'p37', tier: 'paid', timing: null,
    text: 'Draw something that has a hole in it.',
    hint: 'absence is interesting',
  },
  {
    id: 'p38', tier: 'paid', timing: { type: 'observe', seconds: 45 },
    text: 'Look at your hands for 45 seconds. Draw what you see.',
    hint: 'every line on them is a story',
  },
  {
    id: 'p39', tier: 'paid', timing: null,
    text: 'Draw the feeling of being exactly where you are.',
    hint: 'not good or bad, just this',
  },
  {
    id: 'p40', tier: 'paid', timing: null,
    text: 'Draw a door you walked through today.',
    hint: 'doors mark transitions',
  },
  {
    id: 'p41', tier: 'paid', timing: { type: 'speed', seconds: 45 },
    text: 'Draw your face from memory. 45 seconds.',
    hint: 'no mirror allowed',
  },
  {
    id: 'p42', tier: 'paid', timing: null,
    text: 'Draw what afternoon feels like.',
    hint: 'a time of day has a color and weight',
  },
  {
    id: 'p43', tier: 'paid', timing: null,
    text: 'Draw something circular near you.',
    hint: 'circles are everywhere unnoticed',
  },
  {
    id: 'p44', tier: 'paid', timing: { type: 'observe', seconds: 60 },
    text: 'Pick one spot on the wall. Stare at it for 60 seconds. Draw what you noticed.',
    hint: 'stillness reveals texture',
  },
  {
    id: 'p45', tier: 'paid', timing: null,
    text: 'Draw the last thing you ate.',
    hint: 'from memory',
  },
  {
    id: 'p46', tier: 'paid', timing: null,
    text: 'Draw something that is soft.',
    hint: 'softness has a line quality',
  },
  {
    id: 'p47', tier: 'paid', timing: { type: 'speed', seconds: 60 },
    text: 'Draw 10 small things you can see right now. 60 seconds.',
    hint: 'tiny quick marks, keep moving',
  },
  {
    id: 'p48', tier: 'paid', timing: null,
    text: 'Draw something that makes a sound.',
    hint: 'what does sound look like?',
  },
  {
    id: 'p49', tier: 'paid', timing: null,
    text: 'Draw a plant or any living thing near you.',
    hint: 'life is always worth drawing',
  },
  {
    id: 'p50', tier: 'paid', timing: { type: 'observe', seconds: 90 },
    text: 'Go outside or to a window. Watch for 90 seconds. Draw one moving thing.',
    hint: 'movement caught in a still line',
  },
  // p51-p150: additional paid prompts
  {
    id: 'p51', tier: 'paid', timing: null,
    text: 'Draw the shape of a conversation you had today.',
    hint: 'was it round or sharp?',
  },
  {
    id: 'p52', tier: 'paid', timing: { type: 'speed', seconds: 30 },
    text: 'Draw a stranger you saw today. 30 seconds from memory.',
    hint: 'just an impression',
  },
  {
    id: 'p53', tier: 'paid', timing: null,
    text: 'Draw something made of glass.',
    hint: 'transparency has edges',
  },
  {
    id: 'p54', tier: 'paid', timing: null,
    text: 'Draw the feeling of Sunday.',
    hint: 'every day has its own weight',
  },
  {
    id: 'p55', tier: 'paid', timing: { type: 'observe', seconds: 45 },
    text: 'Find the oldest thing near you. Hold it for 45 seconds. Draw it.',
    hint: 'age shows in surfaces',
  },
  {
    id: 'p56', tier: 'paid', timing: null,
    text: 'Draw something that needs fixing.',
    hint: 'broken things are interesting',
  },
  {
    id: 'p57', tier: 'paid', timing: null,
    text: 'Draw the sky right now. Even if it is a ceiling.',
    hint: 'above is always changing',
  },
  {
    id: 'p58', tier: 'paid', timing: { type: 'speed', seconds: 45 },
    text: 'Draw your bag or pocket contents. 45 seconds.',
    hint: 'what we carry says something',
  },
  {
    id: 'p59', tier: 'paid', timing: null,
    text: 'Draw a knot, a tangle, or something twisted.',
    hint: 'complexity made simple',
  },
  {
    id: 'p60', tier: 'paid', timing: null,
    text: 'Draw something you have never drawn before.',
    hint: 'first time seeing means first time drawing',
  },

  // ── PACK: City Observation (future IAP) ────────────────────────────────────
  {
    id: 'c01', tier: 'pack_city', timing: { type: 'observe', seconds: 60 },
    text: 'Find a shop sign. Look at it for 60 seconds. Draw the letters from memory.',
    hint: 'typography holds culture',
  },
  {
    id: 'c02', tier: 'pack_city', timing: null,
    text: 'Draw a street corner you passed today.',
    hint: 'corners are where cities breathe',
  },
  {
    id: 'c03', tier: 'pack_city', timing: { type: 'speed', seconds: 60 },
    text: 'Draw the person sitting or standing nearest to you. 60 seconds.',
    hint: 'posture tells everything',
  },
  {
    id: 'c04', tier: 'pack_city', timing: null,
    text: 'Draw something you saw through a window from outside.',
    hint: 'glimpses are enough',
  },
  {
    id: 'c05', tier: 'pack_city', timing: { type: 'observe', seconds: 90 },
    text: 'Sit in a public place for 90 seconds. Watch. Draw one small scene.',
    hint: 'cities are full of tiny dramas',
  },

  // ── PACK: Body & Senses ────────────────────────────────────────────────────
  {
    id: 'b01', tier: 'pack_body', timing: { type: 'observe', seconds: 30 },
    text: 'Feel where tension is in your body right now. 30 seconds. Draw it.',
    hint: 'the body always knows',
  },
  {
    id: 'b02', tier: 'pack_body', timing: null,
    text: 'Draw what hunger feels like.',
    hint: 'a physical state made visible',
  },
  {
    id: 'b03', tier: 'pack_body', timing: { type: 'speed', seconds: 30 },
    text: 'Draw your spine. 30 seconds. From inside knowledge, not a textbook.',
    hint: 'you know this shape intimately',
  },

  // ── PACK: Memory ──────────────────────────────────────────────────────────
  {
    id: 'm01', tier: 'pack_memory', timing: { type: 'observe', seconds: 60 },
    text: 'Think of the home you grew up in for 60 seconds. Draw one room.',
    hint: 'memory softens the edges',
  },
  {
    id: 'm02', tier: 'pack_memory', timing: null,
    text: 'Draw a person who made you feel safe when you were young.',
    hint: 'feeling first, likeness second',
  },
  {
    id: 'm03', tier: 'pack_memory', timing: null,
    text: 'Draw a meal from childhood.',
    hint: 'food holds time inside it',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const FREE_PROMPTS = PROMPTS.filter(p => p.tier === 'free');
export const PAID_PROMPTS = PROMPTS.filter(p => p.tier === 'paid');
export const PACK_CITY    = PROMPTS.filter(p => p.tier === 'pack_city');
export const PACK_BODY    = PROMPTS.filter(p => p.tier === 'pack_body');
export const PACK_MEMORY  = PROMPTS.filter(p => p.tier === 'pack_memory');

export function getAvailablePrompts(entitlements = {}) {
  let pool = [...FREE_PROMPTS];
  if (entitlements.paid)       pool = [...pool, ...PAID_PROMPTS];
  if (entitlements.pack_city)  pool = [...pool, ...PACK_CITY];
  if (entitlements.pack_body)  pool = [...pool, ...PACK_BODY];
  if (entitlements.pack_memory) pool = [...pool, ...PACK_MEMORY];
  return pool;
}

export function getRandomPrompt(pool, recentIds = []) {
  const fresh = pool.filter(p => !recentIds.includes(p.id));
  const source = fresh.length > 0 ? fresh : pool;
  return source[Math.floor(Math.random() * source.length)];
}
