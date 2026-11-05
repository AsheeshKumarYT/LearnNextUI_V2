/**
 * Built-in avatars — colourful illustrated people (DiceBear "Micah" style by Micah Lanier, generated locally), each
 * hand-picked rather than random: friendly expressions only, natural hair colours, mostly lighter skin with a few
 * darker tones, in man + woman pairs on soft pastel backdrops. Each one is an SVG data URL that's stored like an
 * uploaded photo, so it looks the same everywhere (header, profile, lists).
 */
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

const SKIN = { light: 'f9c9b6', tan: 'ac6651', deep: '77311d' };
const HAIR = { black: '000000', brown: '77311d', auburn: 'ac6651', blonde: 'f4d150', grey: 'c9ccd6' };
const SHIRT = { violet: '9287ff', cyan: '6bd9e9', pink: 'fc909f', yellow: 'f4d150', white: 'ffffff', ink: '000000' };
const BG = { sky: 'b6e3f4', lilac: 'c0aede', periwinkle: 'd1d4f9', blush: 'ffd5dc', peach: 'ffdfbf', mint: 'c7ecd9' };

// Man + woman pairs, side by side — 22, each a distinct look: no hair style repeats in the same colour, and glasses,
// beards and earrings are spread out. The style has few hair options (women: long, pixie, bob), so fewer avatars reads
// as more variety. Optional: glasses, beard / scruff, earrings
const PRESETS = [
  { label: 'Arjun', man: true, hair: 'fonze', hairColor: 'black', skin: 'light', shirt: 'collared', shirtColor: 'violet', bg: 'sky', mouth: 'smile', eyes: 'eyes' },
  { label: 'Aanya', hair: 'full', hairColor: 'black', skin: 'light', shirt: 'open', shirtColor: 'pink', bg: 'lilac', mouth: 'laughing', eyes: 'smiling', earrings: 'stud' },
  // Replaced on request (was brown hair on tan skin — they ran together): auburn quiff, stubble and round glasses
  { label: 'Kabir', man: true, hair: 'fonze', hairColor: 'auburn', skin: 'light', shirt: 'crew', shirtColor: 'yellow', bg: 'periwinkle', mouth: 'smile', eyes: 'round', glasses: 'round', facialHair: 'scruff' },
  { label: 'Sara', hair: 'pixie', hairColor: 'blonde', skin: 'light', shirt: 'crew', shirtColor: 'violet', bg: 'peach', mouth: 'smile', eyes: 'eyes', earrings: 'hoop' },
  // Older, silver-haired with grey stubble (was a second young man with a black mohawk)
  { label: 'Rohan', man: true, hair: 'fonze', hairColor: 'grey', skin: 'tan', shirt: 'collared', shirtColor: 'cyan', bg: 'blush', mouth: 'smile', eyes: 'eyes', facialHair: 'scruff' },
  { label: 'Meera', hair: 'full', hairColor: 'brown', skin: 'light', shirt: 'collared', shirtColor: 'cyan', bg: 'mint', mouth: 'smile', eyes: 'round', glasses: 'square' },
  { label: 'Harpreet', man: true, hair: 'turban', hairColor: 'violet', skin: 'light', shirt: 'collared', shirtColor: 'ink', bg: 'mint', mouth: 'smile', eyes: 'eyes', facialHair: 'beard' },
  { label: 'Ira', hair: 'dannyPhantom', hairColor: 'brown', skin: 'light', shirt: 'collared', shirtColor: 'pink', bg: 'periwinkle', mouth: 'smirk', eyes: 'eyesShadow', earrings: 'stud' },
  { label: 'Dev', man: true, hair: 'fonze', hairColor: 'blonde', skin: 'light', shirt: 'open', shirtColor: 'violet', bg: 'blush', mouth: 'laughing', eyes: 'smiling' },
  // Replaced on request: a blonde bob with hoops
  { label: 'Zoya', hair: 'dannyPhantom', hairColor: 'blonde', skin: 'light', shirt: 'collared', shirtColor: 'violet', bg: 'sky', mouth: 'smile', eyes: 'eyes', earrings: 'hoop' },
  { label: 'Aditya', man: true, hair: 'mrClean', hairColor: 'grey', skin: 'light', shirt: 'crew', shirtColor: 'cyan', bg: 'lilac', mouth: 'smile', eyes: 'round', facialHair: 'beard', beardColor: 'black', glasses: 'square' },
  { label: 'Kiara', hair: 'pixie', hairColor: 'auburn', skin: 'light', shirt: 'open', shirtColor: 'yellow', bg: 'sky', mouth: 'laughing', eyes: 'smiling' },
  { label: 'Vikram', man: true, hair: 'dannyPhantom', hairColor: 'black', skin: 'light', shirt: 'collared', shirtColor: 'white', bg: 'peach', mouth: 'smirk', eyes: 'eyesShadow', facialHair: 'scruff' },
  { label: 'Tara', hair: 'full', hairColor: 'auburn', skin: 'light', shirt: 'crew', shirtColor: 'white', bg: 'lilac', mouth: 'smile', eyes: 'eyes', earrings: 'hoop' },
  { label: 'Rahul', man: true, hair: 'mrT', hairColor: 'auburn', skin: 'light', shirt: 'crew', shirtColor: 'pink', bg: 'mint', mouth: 'smile', eyes: 'round', glasses: 'round' },
  { label: 'Leela', hair: 'pixie', hairColor: 'black', skin: 'light', shirt: 'crew', shirtColor: 'cyan', bg: 'blush', mouth: 'smile', eyes: 'eyes' },
  // Red hair with a full red beard (brown hair + stubble on tan skin all ran together)
  { label: 'Kunal', man: true, hair: 'dannyPhantom', hairColor: 'auburn', skin: 'light', shirt: 'open', shirtColor: 'yellow', bg: 'periwinkle', mouth: 'laughing', eyes: 'smiling', facialHair: 'beard' },
  { label: 'Nisha', hair: 'full', hairColor: 'grey', skin: 'light', shirt: 'collared', shirtColor: 'violet', bg: 'peach', mouth: 'smile', eyes: 'round', glasses: 'round', earrings: 'stud' },
  // Four more (22 → the picker's grid fills four full rows with the upload tile and your photo); new hair / colour pairs
  // Replaced on request (a blonde crest read nearly bald): a full brown side-swept cut with square glasses and stubble
  { label: 'Sameer', man: true, hair: 'dannyPhantom', hairColor: 'brown', skin: 'light', shirt: 'collared', shirtColor: 'cyan', bg: 'mint', mouth: 'smile', eyes: 'eyes', glasses: 'square', facialHair: 'scruff' },
  { label: 'Priya', hair: 'full', hairColor: 'blonde', skin: 'light', shirt: 'crew', shirtColor: 'pink', bg: 'mint', mouth: 'smile', eyes: 'eyes', earrings: 'hoop' },
  { label: 'Ishaan', man: true, hair: 'fonze', hairColor: 'brown', skin: 'light', shirt: 'crew', shirtColor: 'white', bg: 'lilac', mouth: 'smirk', eyes: 'round', glasses: 'round' },
  { label: 'Fatima', hair: 'pixie', hairColor: 'brown', skin: 'light', shirt: 'open', shirtColor: 'cyan', bg: 'peach', mouth: 'laughing', eyes: 'smiling', glasses: 'square', earrings: 'stud' },
];

const TURBAN = { violet: '9287ff' }; // the turban takes the hair colour
const draw = (p) =>
  createAvatar(micah, {
    seed: p.label,
    size: 320,
    backgroundColor: [BG[p.bg]],
    baseColor: [SKIN[p.skin]],
    hair: [p.hair],
    hairColor: [HAIR[p.hairColor] ?? TURBAN[p.hairColor]],
    shirt: [p.shirt],
    shirtColor: [SHIRT[p.shirtColor]],
    mouth: [p.mouth],
    eyes: [p.eyes],
    eyebrows: p.man ? ['up', 'down'] : ['eyelashesUp', 'eyelashesDown'],
    eyebrowsColor: [HAIR[p.hairColor] ?? HAIR.black],
    facialHair: p.facialHair ? [p.facialHair] : undefined,
    // Beard follows the hair unless set (e.g. a bald, grey-haired man with a black beard)
    facialHairColor: [HAIR[p.beardColor ?? p.hairColor] ?? HAIR.black],
    facialHairProbability: p.facialHair ? 100 : 0,
    glasses: p.glasses ? [p.glasses] : undefined,
    glassesColor: ['000000'],
    glassesProbability: p.glasses ? 100 : 0,
    earrings: p.earrings ? [p.earrings] : undefined,
    earringColor: ['f4d150'],
    earringsProbability: p.earrings ? 100 : 0,
  }).toDataUri();

/** [{ id, label, img (SVG data URL) }] */
export const AVATAR_PRESETS = PRESETS.map((p) => ({ id: p.label.toLowerCase(), label: p.label, img: draw(p) }));

const byDataUrl = new Map(AVATAR_PRESETS.map((a) => [a.img, a])); // data URL → preset

/** The preset's stored picture (kept async so the picker works the same as with remote images) */
export const composeAvatar = (preset) => Promise.resolve(preset.img);

/** Which preset (if any) a stored avatar came from */
export const presetFor = (src) => (src ? (byDataUrl.get(src) ?? null) : null);
