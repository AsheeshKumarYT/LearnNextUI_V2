// Builds LearnNext-UI-UX-Guidelines.pptx — run: node build.js
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const lucide = require('lucide-react');
const { applyTheme } = require('./apply_theme.js');

const OUT = path.join(__dirname, '..', 'LearnNext-UI-UX-Guidelines.pptx');

// ---------------------------------------------------------------- theme (LearnNext tokens + the new accent orange)
const THEME = {
  name: 'LearnNext',
  headFontFace: 'Segoe UI',
  bodyFontFace: 'Segoe UI',
  colors: {
    dk1: '1C252E', // text
    lt1: 'FFFFFF',
    dk2: '0B1A2E', // navy
    lt2: 'EEF2F7', // canvas
    accent1: '2A69B2', // LearnNext blue
    accent2: 'FF7A00', // accent orange (new)
    accent3: '00B8D9', // cyan
    accent4: '8E33FF', // violet
    accent5: 'FFAB00', // amber
    accent6: '22C55E', // green
    hlink: '2A69B2',
    folHlink: '8E33FF',
  },
};
// Neutrals that aren't theme slots (hex)
const SEC = '46525F';
const MUTED = '5E6B7A';
const SOFTTEXT = 'B4C0CC';
const BORDER = 'E3E8EF';
const SUNKEN = 'F4F6F8';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 × 7.5 in
pres.title = 'LearnNext Admin — UI/UX Guidelines';
pres.author = 'Atul Kumar';
pres.company = 'LearnNext';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const S = pres.shapes;

// ---------------------------------------------------------------- helpers
const shadow = () => ({ type: 'outer', color: '1E3A78', opacity: 0.1, blur: 14, offset: 3, angle: 90 });
const icons = {};
async function icon(name, hex) {
  const key = `${name}-${hex}`;
  if (!icons[key]) {
    const Comp = lucide[name];
    if (!Comp) throw new Error(`Unknown icon ${name}`);
    const svg = renderToStaticMarkup(React.createElement(Comp, { size: 256, color: `#${hex}`, strokeWidth: 2 }));
    const png = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
    icons[key] = `image/png;base64,${png.toString('base64')}`;
  }
  return icons[key];
}
let nameSeq = 0;
const oid = (p) => `${p}-${++nameSeq}`;

function text(slide, t, o) {
  slide.addText(t, { margin: 0, isTextBox: true, color: C.text1, fontSize: 14, valign: 'top', objectName: oid('text'), ...o });
}
function card(slide, x, y, w, h, o = {}) {
  slide.addShape(S.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.14, fill: { color: o.fill ?? 'FFFFFF', transparency: o.transparency ?? 0 },
    line: { color: o.line ?? BORDER, width: o.lineWidth ?? 0.75 }, shadow: o.noShadow ? undefined : shadow(), objectName: oid('card'),
  });
}
// Signature motif: rounded icon tile with a soft tint of its colour (same as the app's card headers)
async function tile(slide, x, y, size, iconName, hex, o = {}) {
  slide.addShape(S.ROUNDED_RECTANGLE, { x, y, w: size, h: size, rectRadius: size * 0.26, fill: { color: o.fill ?? hex, transparency: o.transparency ?? 86 }, line: { type: 'none' }, objectName: oid('tile') });
  const pad = size * 0.25;
  slide.addImage({ data: await icon(iconName, o.iconHex ?? hex), x: x + pad, y: y + pad, w: size - pad * 2, h: size - pad * 2, objectName: oid('icon'), altText: iconName });
}
// Orange numbered marker (navy number on orange keeps 6.7:1 contrast)
function marker(slide, x, y, n, size = 0.34) {
  slide.addShape(S.OVAL, { x, y, w: size, h: size, fill: { color: C.accent2 }, line: { color: 'FFFFFF', width: 1.5 }, objectName: oid('marker') });
  text(slide, String(n), { x, y, w: size, h: size, fontSize: 11, bold: true, color: C.text2, align: 'center', valign: 'middle' });
}
function pill(slide, x, y, w, label, o = {}) {
  const h = o.h ?? 0.36;
  slide.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: h / 2, fill: { color: o.fill, transparency: o.transparency ?? 0 }, line: o.line ? { color: o.line, width: 0.75 } : { type: 'none' }, objectName: oid('pill') });
  text(slide, label, { x, y, w, h, fontSize: o.fontSize ?? 11, bold: o.bold ?? true, color: o.color ?? C.text1, align: 'center', valign: 'middle' });
}
function button(slide, x, y, w, label, kind) {
  const h = 0.42;
  const k = {
    primary: { fill: C.accent1, color: C.background1 },
    secondary: { fill: 'FFFFFF', line: 'CBD3DC', color: C.text1 },
    soft: { fill: C.accent1, transparency: 88, color: C.accent1 },
    ghost: { fill: 'FFFFFF', transparency: 100, color: SEC },
    danger: { fill: 'B71D18', color: C.background1 },
  }[kind];
  slide.addShape(S.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: k.fill, transparency: k.transparency ?? 0 }, line: k.line ? { color: k.line, width: 0.75 } : { type: 'none' }, objectName: oid('button') });
  text(slide, label, { x, y, w, h, fontSize: 12, bold: true, color: k.color, align: 'center', valign: 'middle' });
}

// ---------------------------------------------------------------- layouts
const brandObjects = (dark) => [
  { rect: { x: 11.07, y: 0.36, w: 0.3, h: 0.3, fill: { color: C.accent1 } } },
  { text: { text: 'L', options: { x: 11.07, y: 0.36, w: 0.3, h: 0.3, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0 } } },
  { text: { text: 'LearnNext', options: { x: 11.45, y: 0.36, w: 1.3, h: 0.3, fontSize: 12, bold: true, color: dark ? C.background1 : C.text1, valign: 'middle', margin: 0 } } },
  { text: { text: 'LearnNext Admin · UI/UX Guidelines', options: { x: 0.6, y: 6.92, w: 5, h: 0.28, fontSize: 9, color: dark ? SOFTTEXT : MUTED, margin: 0 } } },
];
// align: 'left' everywhere — PowerPoint centres title placeholders by default
const contentPlaceholders = (dark) => [
  { placeholder: { options: { name: 'eyebrow', type: 'body', x: 0.6, y: 0.36, w: 8, h: 0.3, fontSize: 11, bold: true, color: dark ? C.accent2 : C.accent1, charSpacing: 2, margin: 0, align: 'left', valign: 'middle' }, text: '' } },
  { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.7, w: 10.2, h: 0.75, fontSize: 36, bold: true, color: dark ? C.background1 : C.text2, margin: 0, align: 'left', valign: 'middle' }, text: '' } },
  { placeholder: { options: { name: 'lead', type: 'body', x: 0.6, y: 1.48, w: 10.5, h: 0.45, fontSize: 15, color: dark ? SOFTTEXT : SEC, margin: 0, align: 'left', valign: 'top' }, text: '' } },
];
const slideNumber = (dark) => ({ x: 12.13, y: 7.0, w: 0.6, h: 0.28, fontSize: 9, color: dark ? SOFTTEXT : MUTED, align: 'right', margin: 0 });

pres.defineSlideMaster({ title: 'CONTENT', background: { color: 'FFFFFF' }, objects: [...brandObjects(false), ...contentPlaceholders(false)], slideNumber: slideNumber(false) });
pres.defineSlideMaster({ title: 'CONTENT_SOFT', background: { color: 'EEF2F7' }, objects: [...brandObjects(false), ...contentPlaceholders(false)], slideNumber: slideNumber(false) });
pres.defineSlideMaster({ title: 'CONTENT_DARK', background: { color: '0B1A2E' }, objects: [...brandObjects(true), ...contentPlaceholders(true)], slideNumber: slideNumber(true) });
pres.defineSlideMaster({
  title: 'COVER',
  background: { color: '0B1A2E' },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 2.3, w: 7.2, h: 1.95, fontSize: 54, bold: true, color: C.background1, margin: 0, align: 'left', valign: 'top' }, text: '' } },
    { placeholder: { options: { name: 'subtitle', type: 'body', x: 0.8, y: 4.4, w: 6.6, h: 1.2, fontSize: 18, color: SOFTTEXT, margin: 0, align: 'left', valign: 'top' }, text: '' } },
  ],
});

// ---------------------------------------------------------------- slides
function contentSlide(master, section, eyebrow, title, lead) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  s.addText(eyebrow, { placeholder: 'eyebrow' });
  s.addText(title, { placeholder: 'title' });
  if (lead) s.addText(lead, { placeholder: 'lead' });
  return s;
}

async function build() {
  // ============ 1 · Cover
  pres.addSection({ title: 'Introduction' });
  {
    const s = pres.addSlide({ masterName: 'COVER', sectionTitle: 'Introduction' });
    // Brand
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.8, y: 0.7, w: 0.42, h: 0.42, rectRadius: 0.1, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: 'logo-tile' });
    text(s, 'L', { x: 0.8, y: 0.7, w: 0.42, h: 0.42, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    text(s, 'LearnNext Admin', { x: 1.35, y: 0.7, w: 3, h: 0.42, fontSize: 15, bold: true, color: C.background1, valign: 'middle' });
    pill(s, 0.8, 1.7, 2.1, 'DESIGN SYSTEM', { fill: C.accent2, color: C.text2, fontSize: 11 });
    s.addText('UI/UX Guidelines', { placeholder: 'title' });
    s.addText('How every LearnNext Admin screen looks, feels and behaves — colour, type, layout, components, motion and states.', { placeholder: 'subtitle' });
    text(s, 'October 2026 · Prepared by Atul Kumar', { x: 0.8, y: 6.3, w: 5, h: 0.35, fontSize: 13, color: SOFTTEXT });

    // Visual: soft glows + frosted UI cards (echoes the product's tinted, glassy surfaces)
    s.addShape(S.OVAL, { x: 8.7, y: 0.5, w: 4.3, h: 4.3, fill: { color: C.accent1, transparency: 55 }, line: { type: 'none' }, objectName: 'glow-blue' });
    s.addShape(S.OVAL, { x: 10.6, y: 3.6, w: 2.7, h: 2.7, fill: { color: C.accent4, transparency: 62 }, line: { type: 'none' }, objectName: 'glow-violet' });
    s.addShape(S.OVAL, { x: 8.2, y: 4.6, w: 1.7, h: 1.7, fill: { color: C.accent2, transparency: 25 }, line: { type: 'none' }, objectName: 'glow-orange' });

    s.addShape(S.ROUNDED_RECTANGLE, { x: 8.6, y: 1.55, w: 3.9, h: 1.6, rectRadius: 0.16, fill: { color: 'FFFFFF', transparency: 86 }, line: { color: 'FFFFFF', width: 0.75, transparency: 60 }, objectName: 'glass-card-1' });
    await tile(s, 8.85, 1.8, 0.48, 'Layers', 'FFFFFF', { fill: 'FFFFFF', transparency: 80 });
    text(s, 'Programs', { x: 9.5, y: 1.85, w: 2, h: 0.36, fontSize: 13, bold: true, color: C.background1, valign: 'middle' });
    text(s, '68', { x: 8.85, y: 2.42, w: 1.5, h: 0.6, fontSize: 30, bold: true, color: C.background1 });
    text(s, '57% completed', { x: 10.15, y: 2.6, w: 2.1, h: 0.3, fontSize: 11, color: 'DCE6F2', align: 'right' });

    s.addShape(S.ROUNDED_RECTANGLE, { x: 9.3, y: 3.45, w: 3.6, h: 1.45, rectRadius: 0.16, fill: { color: 'FFFFFF', transparency: 86 }, line: { color: 'FFFFFF', width: 0.75, transparency: 60 }, objectName: 'glass-card-2' });
    await tile(s, 9.55, 3.68, 0.48, 'IndianRupee', 'FFFFFF', { fill: 'FFFFFF', transparency: 80 });
    text(s, 'Billing', { x: 10.2, y: 3.73, w: 2, h: 0.36, fontSize: 13, bold: true, color: C.background1, valign: 'middle' });
    text(s, '₹1.67 Cr', { x: 9.55, y: 4.25, w: 2.2, h: 0.5, fontSize: 24, bold: true, color: C.background1 });
    [1.05, 0.7, 0.45].forEach((w, i) => s.addShape(S.ROUNDED_RECTANGLE, { x: 11.55 + [0, 0, 0][i], y: 4.3 + i * 0.16, w, h: 0.09, rectRadius: 0.045, fill: { color: [C.accent2, 'FFFFFF', 'FFFFFF'][i], transparency: [0, 40, 65][i] }, line: { type: 'none' }, objectName: oid('bar') }));

    s.addNotes('Opening slide. The LearnNext Admin UI/UX guidelines — the single reference for how every screen in the admin console should look and behave.');
  }

  // ============ 2 · Contents
  {
    const s = contentSlide('CONTENT', 'Introduction', 'CONTENTS', 'Inside this guide', 'Ten chapters. Follow them for every new module so the product stays consistent.');
    const items = [
      ['01', 'Principles', 'Five rules behind every decision', 3],
      ['02', 'Colour', 'Tokens, brand blue and the new accent orange', 4],
      ['03', 'Typography', 'Public Sans and the type scale', 6],
      ['04', 'Layout & spacing', '4 px grid, corner radius', 8],
      ['05', 'Responsive', 'From 320 px phones to wide screens', 9],
      ['06', 'App shell', 'Sidebar, header and content', 10],
      ['07', 'Components', 'The shared component library', 11],
      ['08', 'Cards & charts', 'Surfaces, KPI tiles and data', 12],
      ['09', 'Motion & states', 'Movement, feedback, system pages', 14],
      ['10', 'Accessibility & writing', 'Contrast, keyboard and words', 17],
    ];
    items.forEach(([n, t, d, p], i) => {
      const col = i < 5 ? 0 : 1;
      const x = col ? 6.9 : 0.6;
      const y = 2.3 + (i % 5) * 0.9;
      s.addShape(S.ROUNDED_RECTANGLE, { x, y, w: 0.58, h: 0.58, rectRadius: 0.14, fill: { color: i === 1 ? C.accent2 : C.accent1, transparency: i === 1 ? 0 : 88 }, line: { type: 'none' }, objectName: oid('num') });
      text(s, n, { x, y, w: 0.58, h: 0.58, fontSize: 14, bold: true, color: i === 1 ? C.text2 : C.accent1, align: 'center', valign: 'middle' });
      text(s, t, { x: x + 0.8, y: y - 0.02, w: 4.2, h: 0.34, fontSize: 17, bold: true });
      text(s, d, { x: x + 0.8, y: y + 0.32, w: 4.4, h: 0.28, fontSize: 12, color: MUTED });
      text(s, String(p).padStart(2, '0'), { x: x + 5.25, y: y + 0.1, w: 0.55, h: 0.36, fontSize: 13, color: MUTED, align: 'right' });
      if (i % 5 !== 4) s.addShape(S.LINE, { x: x + 0.8, y: y + 0.76, w: 5.0, h: 0, line: { color: BORDER, width: 0.75 }, objectName: oid('divider') });
    });
    s.addNotes('Ten chapters. Colour is highlighted because it now includes the new accent orange, #FF7A00.');
  }

  // ============ 3 · Principles
  pres.addSection({ title: 'Foundations' });
  {
    const s = contentSlide('CONTENT', 'Foundations', '01 · PRINCIPLES', 'Five principles', 'When two options both look fine, the one that serves these better wins.');
    const P = [
      ['Waves', '2A69B2', 'Calm over loud', 'Colour and motion carry meaning, never decoration.', 'Tints at 7–11% only'],
      ['Eye', '00A3C4', 'Clear at a glance', 'The key number or action reads in under three seconds.', 'One big number per KPI tile'],
      ['Layers', '8E33FF', 'Consistent', 'One component per pattern; light and dark look like one product.', 'Extend, never duplicate'],
      ['Route', 'E06A00', 'No dead ends', 'Every state — empty, error, offline — offers a next step.', 'Empty state → an action'],
      ['Accessibility', '16A34A', 'Accessible', 'WCAG 2.1 AA is the minimum, on every screen and size.', '4.5 : 1 text contrast'],
    ];
    const w = 2.226;
    for (const [i, [ic, hex, t, d, eg]] of P.entries()) {
      const x = 0.6 + i * (w + 0.25);
      card(s, x, 2.3, w, 4.35);
      await tile(s, x + 0.3, 2.62, 0.72, ic, hex);
      text(s, `0${i + 1}`, { x: x + w - 0.9, y: 2.66, w: 0.6, h: 0.5, fontSize: 22, bold: true, color: 'CBD3DC', align: 'right' });
      text(s, t, { x: x + 0.3, y: 3.65, w: w - 0.5, h: 0.75, fontSize: 18, bold: true, color: C.text2 });
      text(s, d, { x: x + 0.3, y: 4.45, w: w - 0.5, h: 1.25, fontSize: 14, color: SEC });
      // "In practice" example pinned to the card bottom
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.2, y: 5.83, w: w - 0.4, h: 0.6, rectRadius: 0.1, fill: { color: hex, transparency: 90 }, line: { type: 'none' }, objectName: oid('practice') });
      text(s, eg, { x: x + 0.32, y: 5.83, w: w - 0.64, h: 0.6, fontSize: 11, bold: true, color: C.text1, valign: 'middle' });
    }
    s.addNotes('Five principles. Use them to settle design debates: calm, clear, consistent, no dead ends, accessible.');
  }

  // ============ 4 · Colour — brand & core (with the new orange)
  {
    const s = contentSlide('CONTENT', 'Foundations', '02 · COLOUR', 'Colour', 'Every colour is a named token — never raw hex in screens — so light and dark themes stay in sync.');
    // Brand blue
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.6, y: 2.2, w: 3.05, h: 2.55, rectRadius: 0.16, fill: { color: '2A69B2' }, line: { type: 'none' }, shadow: shadow(), objectName: 'swatch-blue' });
    text(s, 'BRAND', { x: 0.85, y: 2.42, w: 2, h: 0.28, fontSize: 10, bold: true, color: 'DCE6F2', charSpacing: 2 });
    text(s, 'LearnNext Blue', { x: 0.85, y: 4.0, w: 2.7, h: 0.5, fontSize: 20, bold: true, color: 'FFFFFF' });
    text(s, '#2A69B2', { x: 0.6, y: 4.92, w: 3, h: 0.32, fontSize: 15, bold: true });
    text(s, 'Dark theme #3A7BD0', { x: 0.6, y: 5.25, w: 3, h: 0.28, fontSize: 12, color: MUTED });
    text(s, 'Buttons, active menu, links and focus rings.', { x: 0.6, y: 5.6, w: 3.05, h: 0.62, fontSize: 13, color: SEC });

    // New accent orange
    s.addShape(S.ROUNDED_RECTANGLE, { x: 3.9, y: 2.2, w: 3.05, h: 2.55, rectRadius: 0.16, fill: { color: 'FF7A00' }, line: { type: 'none' }, shadow: shadow(), objectName: 'swatch-orange' });
    text(s, 'ACCENT', { x: 4.15, y: 2.42, w: 2, h: 0.28, fontSize: 10, bold: true, color: C.text2, charSpacing: 2 });
    pill(s, 6.0, 2.36, 0.7, 'NEW', { fill: 'FFFFFF', color: C.text2, h: 0.32, fontSize: 10 });
    text(s, 'Accent Orange', { x: 4.15, y: 4.0, w: 2.7, h: 0.5, fontSize: 20, bold: true, color: C.text2 });
    text(s, '#FF7A00', { x: 3.9, y: 4.92, w: 3, h: 0.32, fontSize: 15, bold: true });
    text(s, 'RGB 255 · 122 · 0', { x: 3.9, y: 5.25, w: 3, h: 0.28, fontSize: 12, color: MUTED });
    text(s, 'Highlights, call-outs and brand moments — one per view. Pair with navy text; never text on white.', { x: 3.9, y: 5.6, w: 3.05, h: 1.0, fontSize: 13, color: SEC });

    // Core tokens: light | dark
    text(s, 'Core tokens', { x: 7.45, y: 2.2, w: 3, h: 0.34, fontSize: 15, bold: true });
    text(s, 'light  |  dark', { x: 10.6, y: 2.22, w: 2.13, h: 0.3, fontSize: 11, color: MUTED, align: 'right' });
    const T = [
      ['Primary', '2A69B2', '3A7BD0'],
      ['Background', 'EEF2F7', '11161C'],
      ['Surface', 'FFFFFF', '1C252E'],
      ['Text', '1C252E', 'FFFFFF'],
      ['Text secondary', '46525F', 'B4C0CC'],
      ['Text muted', '5E6B7A', '95A3B2'],
    ];
    T.forEach(([n, l, d], i) => {
      const y = 2.72 + i * 0.64;
      s.addShape(S.ROUNDED_RECTANGLE, { x: 7.45, y, w: 0.5, h: 0.44, rectRadius: 0.08, fill: { color: l }, line: { color: 'D5DCE4', width: 0.75 }, objectName: oid('sw-light') });
      s.addShape(S.ROUNDED_RECTANGLE, { x: 8.0, y, w: 0.5, h: 0.44, rectRadius: 0.08, fill: { color: d }, line: { color: 'D5DCE4', width: 0.75 }, objectName: oid('sw-dark') });
      text(s, n, { x: 8.75, y, w: 2, h: 0.44, fontSize: 14, bold: true, valign: 'middle' });
      text(s, `#${l} · #${d}`, { x: 10.4, y, w: 2.33, h: 0.44, fontSize: 11, color: MUTED, align: 'right', valign: 'middle' });
      if (i < T.length - 1) s.addShape(S.LINE, { x: 7.45, y: y + 0.54, w: 5.28, h: 0, line: { color: BORDER, width: 0.75 }, objectName: oid('divider') });
    });
    s.addNotes('Brand colours and core tokens. New: Accent Orange #FF7A00, for highlights, call-outs and brand moments — at most one per view. Orange on white is only 2.6:1, so never use it for text on white; navy text on orange is 6.7:1. It is not a status colour — warnings keep the Warning token.');
  }

  // ============ 5 · Colour in use
  {
    const s = contentSlide('CONTENT_SOFT', 'Foundations', '02 · COLOUR', 'Colour in use', 'Status colours always come with a word or icon. Charts use one fixed palette.');
    const cw = 3.88;
    // Status
    card(s, 0.6, 2.2, cw, 4.4);
    text(s, 'Status', { x: 0.9, y: 2.45, w: 3, h: 0.34, fontSize: 15, bold: true });
    [['Success', '118D57', 'Completed'], ['Warning', 'B76E00', 'Pending'], ['Danger', 'B71D18', 'Overdue'], ['Info', '006C9C', 'Scheduled']].forEach(([n, hex, w], i) => {
      const y = 3.0 + i * 0.86;
      s.addShape(S.ROUNDED_RECTANGLE, { x: 0.9, y, w: 1.55, h: 0.4, rectRadius: 0.2, fill: { color: hex, transparency: 88 }, line: { type: 'none' }, objectName: oid('badge') });
      s.addShape(S.OVAL, { x: 1.05, y: y + 0.15, w: 0.1, h: 0.1, fill: { color: hex }, line: { type: 'none' }, objectName: oid('dot') });
      text(s, w, { x: 1.22, y, w: 1.2, h: 0.4, fontSize: 12, bold: true, color: hex, valign: 'middle' });
      text(s, n, { x: 2.65, y: y - 0.02, w: 1.6, h: 0.26, fontSize: 13, bold: true, align: 'right' });
      text(s, `#${hex}`, { x: 2.65, y: y + 0.22, w: 1.6, h: 0.22, fontSize: 11, color: MUTED, align: 'right' });
    });

    // Chart palette
    const x2 = 0.6 + cw + 0.25;
    card(s, x2, 2.2, cw, 4.4);
    text(s, 'Chart palette — in this order', { x: x2 + 0.3, y: 2.45, w: 3.4, h: 0.34, fontSize: 15, bold: true });
    [['Blue', '2A69B2'], ['Cyan', '00B8D9'], ['Amber', 'FFAB00'], ['Violet', '8E33FF'], ['Coral', 'FF5630']].forEach(([n, hex], i) => {
      const y = 3.02 + i * 0.68;
      s.addShape(S.ROUNDED_RECTANGLE, { x: x2 + 0.3, y, w: 2.2 - i * 0.32, h: 0.34, rectRadius: 0.17, fill: { color: hex }, line: { type: 'none' }, objectName: oid('chart-swatch') });
      text(s, `${i + 1} · ${n}`, { x: x2 + 2.6 - i * 0.32, y: y - 0.02, w: 1.3, h: 0.22, fontSize: 12, bold: true });
      text(s, `#${hex}`, { x: x2 + 2.6 - i * 0.32, y: y + 0.18, w: 1.3, h: 0.2, fontSize: 10, color: MUTED });
    });

    // Card tints
    const x3 = x2 + cw + 0.25;
    card(s, x3, 2.2, cw + 0.01, 4.4);
    text(s, 'Card tints', { x: x3 + 0.3, y: 2.45, w: 3, h: 0.34, fontSize: 15, bold: true });
    [['Blue', '2A69B2'], ['Cyan', '00B8D9'], ['Green', '22C55E'], ['Amber', 'FFAB00'], ['Violet', '8E33FF'], ['Red', 'FF5630']].forEach(([n, hex], i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = x3 + 0.3 + col * 1.12;
      const y = 3.0 + row * 1.25;
      s.addShape(S.ROUNDED_RECTANGLE, { x, y, w: 0.98, h: 0.8, rectRadius: 0.12, fill: { color: hex, transparency: 86 }, line: { color: hex, width: 0.75, transparency: 70 }, objectName: oid('tint') });
      text(s, n, { x, y: y + 0.86, w: 0.98, h: 0.26, fontSize: 11, bold: true, align: 'center' });
    });
    text(s, 'A soft wash from the top-left (7–11%) ties each card to its header icon colour.', { x: x3 + 0.3, y: 5.65, w: cw - 0.55, h: 0.75, fontSize: 12, color: SEC });
    s.addNotes('Status colours are never used alone — always with a label or icon. Charts take colours in this fixed order. Cards carry a very light wash of their header icon colour.');
  }

  // ============ 6 · Typography
  {
    const s = contentSlide('CONTENT', 'Foundations', '03 · TYPOGRAPHY', 'Typography', 'One typeface for everything: Public Sans, free on Google Fonts.');
    card(s, 0.6, 2.2, 4.4, 4.4, { fill: C.accent1, line: C.accent1 });
    text(s, 'Aa', { x: 0.95, y: 2.35, w: 3.8, h: 2.6, fontSize: 140, bold: true, color: C.background1 });
    text(s, 'Public Sans', { x: 0.95, y: 5.15, w: 3.8, h: 0.5, fontSize: 24, bold: true, color: C.background1 });
    text(s, 'Falls back to Segoe UI · San Francisco · Roboto', { x: 0.95, y: 5.7, w: 3.8, h: 0.6, fontSize: 12, color: 'DCE6F2' });

    card(s, 5.25, 2.2, 7.48, 2.05);
    text(s, [
      { text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', options: { breakLine: true } },
      { text: 'abcdefghijklmnopqrstuvwxyz', options: { breakLine: true } },
      { text: '0123456789  ₹  %  &  @', options: {} },
    ], { x: 5.6, y: 2.45, w: 6.9, h: 1.6, fontSize: 22, color: C.text2, paraSpaceAfter: 4 });

    const Wt = [['Regular', '400', 'Body text', false], ['Medium', '500', 'Labels, captions', false], ['Semibold', '600', 'Card titles', true], ['Bold', '700', 'Page titles, KPIs', true]];
    Wt.forEach(([n, w, u, b], i) => {
      const x = 5.25 + i * 1.92;
      card(s, x, 4.5, 1.72, 2.1);
      text(s, 'Aa', { x: x + 0.25, y: 4.68, w: 1.3, h: 0.75, fontSize: 34, bold: b, color: C.text2 });
      text(s, `${n} ${w}`, { x: x + 0.25, y: 5.5, w: 1.4, h: 0.3, fontSize: 13, bold: true });
      text(s, u, { x: x + 0.25, y: 5.82, w: 1.4, h: 0.55, fontSize: 11, color: MUTED });
    });
    s.addNotes('Public Sans for all text. Four weights only: 400 body, 500 labels, 600 card titles, 700 page titles and KPI values.');
  }

  // ============ 7 · Type scale
  {
    const s = contentSlide('CONTENT_SOFT', 'Foundations', '03 · TYPOGRAPHY', 'Type scale', 'Sentence case everywhere. Numbers use tabular figures so columns line up.');
    card(s, 0.6, 2.2, 12.13, 4.45);
    const R = [
      ['PAGE TITLE', 'Good afternoon, Atul', 24, true, '22–24 px · Bold'],
      ['KPI VALUE', '₹1.67 Cr', 30, true, '28–34 px · Bold'],
      ['CARD TITLE', 'Program schedule', 17, true, '17 px · Semibold'],
      ['BODY', 'Track learner progress and coordinate facilitators from one calm place.', 14, false, '13–14 px · Regular'],
      ['CAPTION', 'Updated 42m ago · 9 upcoming sessions', 11, false, '11–12 px · Medium'],
    ];
    R.forEach(([l, sample, size, b, spec], i) => {
      const y = 2.35 + i * 0.86;
      text(s, l, { x: 0.95, y, w: 2.0, h: 0.72, fontSize: 10, bold: true, color: MUTED, charSpacing: 1.5, valign: 'middle' });
      text(s, sample, { x: 3.0, y, w: 7.2, h: 0.72, fontSize: size, bold: b, color: i === 4 ? MUTED : C.text1, valign: 'middle' });
      text(s, spec, { x: 10.25, y, w: 2.2, h: 0.72, fontSize: 12, color: MUTED, align: 'right', valign: 'middle' });
      if (i < R.length - 1) s.addShape(S.LINE, { x: 0.95, y: y + 0.79, w: 11.5, h: 0, line: { color: BORDER, width: 0.75 }, objectName: oid('divider') });
    });
    s.addNotes('Five text styles cover the whole product. Use rupee compact units for money (₹1.67 Cr) and tabular numerals.');
  }

  // ============ 8 · Layout & spacing
  pres.addSection({ title: 'Layout' });
  {
    const s = contentSlide('CONTENT', 'Layout', '04 · LAYOUT & SPACING', 'Layout & spacing', 'Everything sits on a 4 px grid. Sections are 24 px apart; related items 8–12 px.');
    card(s, 0.6, 2.2, 6.0, 4.4);
    text(s, 'Spacing scale', { x: 0.9, y: 2.45, w: 3, h: 0.34, fontSize: 15, bold: true });
    const sp = [4, 8, 12, 16, 24, 32];
    let x = 0.95;
    sp.forEach((v) => {
      const size = v * 0.032;
      s.addShape(S.ROUNDED_RECTANGLE, { x, y: 4.25 - size, w: size, h: size, rectRadius: Math.min(0.06, size / 4), fill: { color: v === 24 ? C.accent2 : C.accent1, transparency: v === 24 ? 0 : 20 }, line: { type: 'none' }, objectName: oid('space') });
      text(s, `${v}`, { x: x - 0.1, y: 4.35, w: size + 0.2, h: 0.28, fontSize: 12, bold: true, align: 'center' });
      x += size + 0.42;
    });
    text(s, [
      { text: '8–12 px  between related items', options: { bullet: true, breakLine: true } },
      { text: '16 px  card padding on phones', options: { bullet: true, breakLine: true } },
      { text: '24 px  card padding and gaps between sections', options: { bullet: true } },
    ], { x: 0.95, y: 4.95, w: 5.4, h: 1.4, fontSize: 14, color: SEC, paraSpaceAfter: 6 });

    card(s, 6.85, 2.2, 5.88, 4.4);
    text(s, 'Corner radius', { x: 7.15, y: 2.45, w: 3, h: 0.34, fontSize: 15, bold: true });
    [['8 px', 'Buttons, inputs, tabs', 0.06], ['12 px', 'Cards, toggles', 0.15], ['16 px', 'Dialogs, banners', 0.27]].forEach(([r, u, rr], i) => {
      const bx = 7.15 + i * 1.82;
      s.addShape(S.ROUNDED_RECTANGLE, { x: bx, y: 3.0, w: 1.55, h: 1.15, rectRadius: rr, fill: { color: C.accent1, transparency: 88 }, line: { color: C.accent1, width: 1.25 }, objectName: oid('radius') });
      text(s, r, { x: bx, y: 4.28, w: 1.55, h: 0.3, fontSize: 14, bold: true });
      text(s, u, { x: bx, y: 4.58, w: 1.6, h: 0.3, fontSize: 11, color: MUTED });
    });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 7.15, y: 5.2, w: 5.28, h: 1.1, rectRadius: 0.12, fill: { color: C.accent2, transparency: 88 }, line: { type: 'none' }, objectName: 'nested-note' });
    text(s, [
      { text: 'Nested corners are concentric', options: { bold: true, breakLine: true } },
      { text: 'Inner radius = outer radius − padding (a 12 px toggle with 4 px padding holds 8 px tabs).', options: {} },
    ], { x: 7.4, y: 5.32, w: 4.85, h: 0.9, fontSize: 12, color: C.text1 });
    s.addNotes('Spacing in multiples of 4. Three radii only. New rule: nested corners are concentric so selected pills sit evenly inside their track.');
  }

  // ============ 9 · Responsive
  {
    const s = contentSlide('CONTENT_SOFT', 'Layout', '05 · RESPONSIVE', 'Responsive by default', 'Designed from 320 px phones to 1600 px screens. Nothing ever scrolls sideways.');
    const B = [
      ['Smartphone', 'Under 640 px', 'One column · menu in a drawer', 0.42],
      ['Tablet', '640 px and up', 'Two columns · icon-rail sidebar', 0.62],
      ['Laptop', '1024 px and up', 'Full sidebar · paired cards', 0.85],
      ['Monitor', '1440 px and up', '12-column grid · 8 + 4 spans', 1.05],
    ];
    const w = 2.845;
    for (const [i, [ic, h, d]] of B.entries()) {
      const x = 0.6 + i * (w + 0.25);
      card(s, x, 2.2, w, 1.95);
      await tile(s, x + 0.3, 2.45, 0.6, ic, i === 0 ? 'E06A00' : '2A69B2');
      text(s, h, { x: x + 0.3, y: 3.2, w: w - 0.5, h: 0.32, fontSize: 15, bold: true });
      text(s, d, { x: x + 0.3, y: 3.55, w: w - 0.5, h: 0.45, fontSize: 12, color: MUTED });
    }
    card(s, 0.6, 4.4, 12.13, 2.25);
    text(s, 'Phone rules', { x: 0.9, y: 4.6, w: 4, h: 0.34, fontSize: 15, bold: true });
    text(s, [
      { text: 'Columns shrink to fit — no card passes the edge', options: { bullet: true, breakLine: true } },
      { text: 'Long names truncate with “…”; amounts never wrap', options: { bullet: true, breakLine: true } },
      { text: 'Toggles that don’t fit become a dropdown', options: { bullet: true } },
    ], { x: 0.9, y: 5.05, w: 5.75, h: 1.45, fontSize: 14, color: SEC, paraSpaceAfter: 6 });
    text(s, [
      { text: 'Toggles stretch full width with equal options', options: { bullet: true, breakLine: true } },
      { text: 'Secondary detail (e.g. share %) may hide on phones', options: { bullet: true, breakLine: true } },
      { text: 'Test at 320, 375, 768 and 1440 px before shipping', options: { bullet: true } },
    ], { x: 6.85, y: 5.05, w: 5.65, h: 1.45, fontSize: 14, color: SEC, paraSpaceAfter: 6 });
    s.addNotes('Four breakpoints. The phone rules come from fixing the dashboard on mobile: shrinkable grid columns, truncation, dropdowns for toggles that do not fit.');
  }

  // ============ 10 · App shell
  {
    const s = contentSlide('CONTENT', 'Layout', '06 · APP SHELL', 'App shell', 'Every signed-in page uses the same frame: sidebar, header and content.');
    // Frame
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.6, y: 2.2, w: 7.45, h: 4.45, rectRadius: 0.16, fill: { color: 'EEF2F7' }, line: { color: BORDER, width: 0.75 }, shadow: shadow(), objectName: 'shell-frame' });
    // Sidebar
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.72, y: 2.32, w: 1.95, h: 4.21, rectRadius: 0.12, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'shell-sidebar' });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.88, y: 2.48, w: 0.26, h: 0.26, rectRadius: 0.06, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: 'shell-logo' });
    text(s, 'LearnNext', { x: 1.2, y: 2.48, w: 1.3, h: 0.26, fontSize: 11, bold: true, valign: 'middle' });
    ['Dashboard', 'All Clients', 'Projects', 'Finance  ▾', 'Manage Content', 'Facilitators', 'Reports'].forEach((m, i) => {
      const y = 2.95 + i * 0.4;
      if (i === 0) s.addShape(S.ROUNDED_RECTANGLE, { x: 0.82, y: y - 0.04, w: 1.75, h: 0.34, rectRadius: 0.08, fill: { color: C.accent1, transparency: 88 }, line: { type: 'none' }, objectName: 'shell-active' });
      text(s, m, { x: 0.98, y, w: 1.55, h: 0.26, fontSize: 11, bold: i === 0, color: i === 0 ? C.accent1 : SEC, valign: 'middle' });
    });
    // Header
    s.addShape(S.ROUNDED_RECTANGLE, { x: 2.8, y: 2.32, w: 5.13, h: 0.5, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'shell-header' });
    text(s, 'Dashboard', { x: 2.98, y: 2.32, w: 1.5, h: 0.5, fontSize: 12, bold: true, valign: 'middle' });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 4.75, y: 2.42, w: 1.85, h: 0.3, rectRadius: 0.15, fill: { color: SUNKEN }, line: { color: BORDER, width: 0.5 }, objectName: 'shell-search' });
    text(s, 'Search · Ctrl K', { x: 4.9, y: 2.42, w: 1.6, h: 0.3, fontSize: 10, color: MUTED, valign: 'middle' });
    [6.85, 7.17, 7.5].forEach((cx, i) => s.addShape(S.OVAL, { x: cx, y: 2.45, w: 0.24, h: 0.24, fill: { color: i === 2 ? C.accent1 : 'CBD3DC' }, line: { type: 'none' }, objectName: oid('hdr-icon') }));
    // Content
    [0, 1, 2, 3].forEach((i) => s.addShape(S.ROUNDED_RECTANGLE, { x: 2.8 + i * 1.3, y: 2.97, w: 1.2, h: 0.85, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: oid('kpi') }));
    s.addShape(S.ROUNDED_RECTANGLE, { x: 2.8, y: 3.95, w: 3.3, h: 2.58, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'shell-card-a' });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 6.2, y: 3.95, w: 1.73, h: 2.58, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { type: 'none' }, objectName: 'shell-card-b' });
    marker(s, 2.45, 2.15, 1);
    marker(s, 7.75, 2.15, 2);
    marker(s, 5.95, 3.8, 3);

    const N = [
      ['Sidebar', 'One flat menu; Finance is the only sub-menu. Icon rail on desktop, a drawer on phones.'],
      ['Header', 'Page name, search (Ctrl/⌘ K), notifications, theme switch and user menu.'],
      ['Content', 'Up to 1440 px wide. KPI tiles first, then rows of paired cards that end on the same line.'],
    ];
    N.forEach(([t, d], i) => {
      const y = 2.25 + i * 1.18;
      marker(s, 8.45, y + 0.02, i + 1);
      text(s, t, { x: 8.95, y, w: 3.8, h: 0.34, fontSize: 16, bold: true });
      text(s, d, { x: 8.95, y: y + 0.38, w: 3.78, h: 0.72, fontSize: 13, color: SEC });
    });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 8.45, y: 5.85, w: 4.28, h: 0.8, rectRadius: 0.12, fill: { color: C.accent1, transparency: 90 }, line: { type: 'none' }, objectName: 'shell-note' });
    text(s, 'New modules are added through the navigation config, which also sets the breadcrumb and tab title.', { x: 8.65, y: 5.92, w: 3.9, h: 0.66, fontSize: 12, color: C.text1, valign: 'middle' });
    s.addNotes('The shell is shared by every signed-in page. Log out always asks for confirmation.');
  }

  // ============ 11 · Components
  pres.addSection({ title: 'Components' });
  {
    const s = contentSlide('CONTENT_SOFT', 'Components', '07 · COMPONENTS', 'Components', 'Build every screen from the shared library. Missing an option? Extend the component — never create a look-alike.');
    const cw = 5.94;
    const ch = 2.12;
    const pos = [[0.6, 2.2], [0.6 + cw + 0.25, 2.2], [0.6, 2.2 + ch + 0.25], [0.6 + cw + 0.25, 2.2 + ch + 0.25]];
    pos.forEach(([x, y]) => card(s, x, y, cw, ch));
    // Buttons
    {
      const [x, y] = pos[0];
      text(s, 'Buttons — one primary per area', { x: x + 0.3, y: y + 0.22, w: 5, h: 0.32, fontSize: 15, bold: true });
      button(s, x + 0.3, y + 0.75, 1.45, 'Save changes', 'primary');
      button(s, x + 1.85, y + 0.75, 0.95, 'Cancel', 'secondary');
      button(s, x + 2.9, y + 0.75, 0.8, 'Soft', 'soft');
      button(s, x + 3.8, y + 0.75, 0.8, 'Ghost', 'ghost');
      button(s, x + 4.7, y + 0.75, 0.95, 'Delete', 'danger');
      text(s, 'Destructive actions are red and always confirmed. Icon buttons carry a label.', { x: x + 0.3, y: y + 1.4, w: cw - 0.6, h: 0.55, fontSize: 12, color: MUTED });
    }
    // Inputs
    {
      const [x, y] = pos[1];
      text(s, 'Form fields — label on top', { x: x + 0.3, y: y + 0.22, w: 5, h: 0.32, fontSize: 15, bold: true });
      text(s, 'Email address *', { x: x + 0.3, y: y + 0.66, w: 2.5, h: 0.24, fontSize: 11, bold: true });
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 0.93, w: 2.55, h: 0.42, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'CBD3DC', width: 0.75 }, objectName: oid('input') });
      text(s, 'admin@learnnext.io', { x: x + 0.45, y: y + 0.93, w: 2.3, h: 0.42, fontSize: 12, valign: 'middle' });
      text(s, 'Mobile number *', { x: x + 3.1, y: y + 0.66, w: 2.5, h: 0.24, fontSize: 11, bold: true });
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 3.1, y: y + 0.93, w: 2.55, h: 0.42, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'B71D18', width: 1.25 }, objectName: oid('input-error') });
      text(s, '98200', { x: x + 3.25, y: y + 0.93, w: 2.3, h: 0.42, fontSize: 12, valign: 'middle' });
      text(s, 'Enter a valid mobile number', { x: x + 3.1, y: y + 1.42, w: 2.6, h: 0.24, fontSize: 11, color: 'B71D18' });
      text(s, 'Errors show after leaving the field or on submit.', { x: x + 0.3, y: y + 1.72, w: cw - 0.6, h: 0.28, fontSize: 12, color: MUTED });
    }
    // Badges
    {
      const [x, y] = pos[2];
      text(s, 'Badges — one shared status map', { x: x + 0.3, y: y + 0.22, w: 5, h: 0.32, fontSize: 15, bold: true });
      [['Approved', '118D57'], ['Pending', 'B76E00'], ['Rejected', 'B71D18'], ['Draft', '5E6B7A'], ['Live', '2A69B2']].forEach(([l, hex], i) => {
        pill(s, x + 0.3 + i * 1.1, y + 0.8, 1.0, l, { fill: hex, transparency: 88, color: hex, h: 0.36, fontSize: 11 });
      });
      text(s, 'The same word always gets the same colour, everywhere in the product.', { x: x + 0.3, y: y + 1.4, w: cw - 0.6, h: 0.55, fontSize: 12, color: MUTED });
    }
    // Toggles
    {
      const [x, y] = pos[3];
      text(s, 'Toggles — the pill slides', { x: x + 0.3, y: y + 0.22, w: 5, h: 0.32, fontSize: 15, bold: true });
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 0.72, w: 3.75, h: 0.5, rectRadius: 0.12, fill: { color: SUNKEN }, line: { color: 'D5DCE4', width: 0.75 }, objectName: 'toggle-track' });
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 1.55, y: y + 0.77, w: 1.25, h: 0.4, rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'E3E8EF', width: 0.5 }, shadow: shadow(), objectName: 'toggle-pill' });
      ['This month', 'Last month', 'Quarter'].forEach((l, i) => text(s, l, { x: x + 0.35 + i * 1.25, y: y + 0.77, w: 1.2, h: 0.4, fontSize: 12, bold: i === 1, color: i === 1 ? C.text1 : MUTED, align: 'center', valign: 'middle' }));
      s.addShape(S.LINE, { x: x + 4.25, y: y + 0.97, w: 0.9, h: 0, line: { color: C.accent2, width: 2, endArrowType: 'triangle' }, objectName: 'toggle-arrow' });
      text(s, '300 ms', { x: x + 4.25, y: y + 0.65, w: 1.2, h: 0.26, fontSize: 11, bold: true, color: MUTED });
      text(s, 'The selected pill glides between options. On phones, toggles that don’t fit become a dropdown.', { x: x + 0.3, y: y + 1.4, w: cw - 0.6, h: 0.55, fontSize: 12, color: MUTED });
    }
    s.addNotes('Four core component families. The segmented toggle now animates: one pill slides to the selected option in 300 ms, and respects reduce-motion.');
  }

  // ============ 12 · Cards & KPI tiles
  {
    const s = contentSlide('CONTENT', 'Components', '08 · CARDS & CHARTS', 'Cards & KPI tiles', 'Frosted cards on a tinted canvas. A soft colour wash ties each card to its header icon.');
    // KPI anatomy
    card(s, 0.6, 2.25, 5.6, 3.15);
    s.addShape(S.ROUNDED_RECTANGLE, { x: 0.6, y: 2.25, w: 5.6, h: 3.15, rectRadius: 0.14, fill: { color: C.accent4, transparency: 93 }, line: { type: 'none' }, objectName: 'kpi-tint' });
    await tile(s, 0.95, 2.6, 0.62, 'IndianRupee', '8E33FF');
    text(s, 'Billing', { x: 1.75, y: 2.6, w: 2, h: 0.62, fontSize: 16, bold: true, color: SEC, valign: 'middle' });
    text(s, '₹1.67 Cr', { x: 0.95, y: 3.45, w: 3.2, h: 0.85, fontSize: 40, bold: true, color: C.text1 });
    s.addShape(S.OVAL, { x: 0.98, y: 4.53, w: 0.1, h: 0.1, fill: { color: C.accent4 }, line: { type: 'none' }, objectName: 'kpi-dot' });
    text(s, '42% collected', { x: 1.17, y: 4.43, w: 2, h: 0.3, fontSize: 13, color: MUTED, valign: 'middle' });
    s.addChart(pres.charts.AREA, [{ name: 'Invoiced', labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], values: [8, 14, 22, 31, 44, 58, 70, 86, 101, 122, 145, 167] }], {
      x: 3.55, y: 3.85, w: 2.6, h: 1.5, chartColors: ['8E33FF'], chartColorsOpacity: 35, catAxisHidden: true, valAxisHidden: true,
      valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, objectName: 'kpi-trend', altText: 'Running total of invoiced amount rising to ₹1.67 Cr',
    });
    marker(s, 0.73, 2.43, 1);
    marker(s, 2.65, 2.43, 2);
    marker(s, 3.45, 3.4, 3);
    marker(s, 2.55, 4.42, 4);
    marker(s, 5.9, 3.65, 5);
    text(s, 'Glass card: translucent white, soft blur, hairline edge, soft blue-tinted shadow.', { x: 0.6, y: 5.65, w: 5.6, h: 0.6, fontSize: 12, color: MUTED });

    const A = [
      ['Icon tile', 'Tone-matched, 36 px, soft gradient.'],
      ['Label', 'What the number is, in one or two words.'],
      ['Value', '28 px bold with compact units — ₹1.67 Cr, not 16,700,000.'],
      ['Note', 'One short line of context, with a matching dot.'],
      ['Trend', 'Running total for the selected period; hover for exact values.'],
    ];
    A.forEach(([t, d], i) => {
      const y = 2.25 + i * 0.66;
      marker(s, 6.7, y, i + 1);
      text(s, t, { x: 7.2, y: y + 0.02, w: 1.4, h: 0.3, fontSize: 14, bold: true });
      text(s, d, { x: 8.6, y: y + 0.03, w: 4.13, h: 0.55, fontSize: 13, color: SEC });
    });
    s.addShape(S.ROUNDED_RECTANGLE, { x: 6.7, y: 5.65, w: 6.03, h: 0.95, rectRadius: 0.12, fill: { color: C.accent1, transparency: 90 }, line: { type: 'none' }, objectName: 'card-rules' });
    text(s, 'Up to four KPI tiles per row. Card headers: icon, title, description, period chip, action. Cards in a row end on the same line.', { x: 6.95, y: 5.72, w: 5.6, h: 0.8, fontSize: 12, color: C.text1, valign: 'middle' });
    s.addNotes('Anatomy of a KPI tile, numbered. Every chart in a KPI tile means something: it ends at the card number and follows the period switcher.');
  }

  // ============ 13 · Charts
  {
    const s = contentSlide('CONTENT_SOFT', 'Components', '08 · CARDS & CHARTS', 'Charts & dashboards', 'One question per chart, stated in its title. Exact values on hover.');
    const w = 2.845;
    const cards = ['TREND', 'COMPARE', 'PARTS OF A WHOLE', 'SINGLE RATIO'];
    const qs = ['How is billing growing?', 'Who are the top clients?', 'Which entity bills most?', 'Programs completed?'];
    const caps = ['Line or area', 'Horizontal bars, values shown', 'Donut, up to five parts', 'Progress ring'];
    cards.forEach((c, i) => {
      const x = 0.6 + i * (w + 0.25);
      card(s, x, 2.2, w, 3.75);
      text(s, c, { x: x + 0.25, y: 2.4, w: w - 0.5, h: 0.24, fontSize: 10, bold: true, color: MUTED, charSpacing: 1.5 });
      text(s, qs[i], { x: x + 0.25, y: 2.66, w: w - 0.5, h: 0.34, fontSize: 14, bold: true });
      text(s, caps[i], { x: x + 0.25, y: 5.5, w: w - 0.5, h: 0.28, fontSize: 11, color: MUTED });
    });
    const chartBase = { valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt', dataLabelFontFace: '+mn-lt' };
    s.addChart(pres.charts.LINE, [{ name: 'Invoiced (₹ L)', labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], values: [62, 80, 96, 118, 141, 167] }], {
      ...chartBase, x: 0.75, y: 3.1, w: 2.55, h: 2.3, chartColors: ['2A69B2'], lineSize: 2.5, lineDataSymbol: 'none', lineSmooth: true,
      catAxisLabelColor: MUTED, catAxisLabelFontSize: 9, catAxisLabelRotate: 0, valAxisHidden: true, catAxisLineShow: false, objectName: 'chart-trend', altText: 'Billing running total rising from ₹12 L in January to ₹1.67 Cr in October',
    });
    s.addChart(pres.charts.BAR, [{ name: 'Billing (₹ Cr)', labels: ['Hindalco', 'Titan', 'Hero', 'BYLD', 'Crucial'], values: [3.49, 1.87, 1.34, 1.23, 1.13] }], {
      ...chartBase, x: 0.6 + w + 0.35, y: 3.1, w: 2.65, h: 2.3, barDir: 'bar', chartColors: ['2A69B2'], barGapWidthPct: 55, catAxisOrientation: 'maxMin',
      catAxisLabelColor: SEC, catAxisLabelFontSize: 10, valAxisHidden: true, catAxisLineShow: false, showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: '1C252E', dataLabelFontSize: 10, dataLabelFormatCode: '0.00',
      objectName: 'chart-compare', altText: 'Top clients by billing in crore: Hindalco 3.49, Titan 1.87, Hero 1.34, BYLD 1.23, Crucial 1.13',
    });
    s.addChart(pres.charts.DOUGHNUT, [{ name: 'Share', labels: ['Blanchard', 'Leadership', 'DOOR', 'BYLD'], values: [38, 36, 26, 1] }], {
      ...chartBase, x: 0.6 + 2 * (w + 0.25) + 0.3, y: 3.1, w: 2.25, h: 2.3, holeSize: 62, chartColors: ['2A69B2', '00B8D9', 'FFAB00', '8E33FF'], showValue: false, showPercent: false, showLabel: false,
      dataBorder: { pt: 1.5, color: 'FFFFFF' }, objectName: 'chart-parts', altText: 'Billing by entity: Blanchard 38%, Leadership 36%, DOOR 26%, BYLD 1%',
    });
    const rx = 0.6 + 3 * (w + 0.25);
    s.addChart(pres.charts.DOUGHNUT, [{ name: 'Completed', labels: ['Completed', 'Remaining'], values: [57, 43] }], {
      ...chartBase, x: rx + 0.3, y: 3.1, w: 2.25, h: 2.3, holeSize: 72, chartColors: ['22C55E', 'E3E8EF'], showValue: false, showPercent: false, showLabel: false,
      dataBorder: { pt: 0, color: 'FFFFFF' }, objectName: 'chart-ratio', altText: '57% of programs completed',
    });
    text(s, '57%', { x: rx + 0.3, y: 3.95, w: 2.25, h: 0.6, fontSize: 24, bold: true, align: 'center', valign: 'middle' });

    const R = [
      ['CalendarRange', 'One period switch per dashboard; each card shows its period chip.'],
      ['Coins', 'Money in compact rupees — ₹4.8 L, ₹1.67 Cr — exact amount on hover.'],
      ['Palette', 'Series take the chart palette in its fixed order.'],
    ];
    for (const [i, [ic, d]] of R.entries()) {
      const x = 0.6 + i * 4.11;
      await tile(s, x, 6.12, 0.46, ic, '2A69B2');
      text(s, d, { x: x + 0.6, y: 6.08, w: 3.35, h: 0.55, fontSize: 12, color: SEC, valign: 'middle' });
    }
    s.addNotes('Pick the chart by the question: trend, compare, parts of a whole, or a single ratio. These are live PowerPoint charts.');
  }

  // ============ 14 · Motion (dark)
  pres.addSection({ title: 'Behaviour' });
  {
    const s = contentSlide('CONTENT_DARK', 'Behaviour', '09 · MOTION', 'Motion', 'Motion explains what changed. Short, soft, never in the way.');
    const x0 = 4.0;
    const span = 8.6; // 0–1200 ms
    const px = (ms) => x0 + (ms / 1200) * span;
    [0, 300, 600, 900, 1200].forEach((ms) => {
      s.addShape(S.LINE, { x: px(ms), y: 2.45, w: 0, h: 3.85, line: { color: '2C3E57', width: 0.75, dashType: 'dash' }, objectName: oid('grid') });
      text(s, `${ms} ms`, { x: px(ms) - 0.5, y: 2.1, w: 1, h: 0.26, fontSize: 10, color: SOFTTEXT, align: 'center' });
    });
    const M = [
      ['Hover & press', 'Colour change only — no lifting', 0, 150, '2A69B2'],
      ['Tab switch', 'The pill slides to the selection', 0, 300, 'FF7A00'],
      ['Overlays & toasts', 'Fade or slide in', 160, 240, '00B8D9'],
      ['Page entrance', 'Cards rise in, staggered', 0, 700, '8E33FF'],
      ['Data reveal', 'Bars grow, numbers count up once', 0, 900, '22C55E'],
    ];
    M.forEach(([t, d, a, b, hex], i) => {
      const y = 2.55 + i * 0.75;
      text(s, t, { x: 0.6, y, w: 3.2, h: 0.32, fontSize: 15, bold: true, color: C.background1 });
      text(s, d, { x: 0.6, y: y + 0.32, w: 3.3, h: 0.28, fontSize: 11, color: SOFTTEXT });
      s.addShape(S.ROUNDED_RECTANGLE, { x: px(a), y: y + 0.1, w: px(b) - px(a), h: 0.36, rectRadius: 0.18, fill: { color: hex }, line: { type: 'none' }, objectName: oid('motion-bar') });
      const label = a ? `${a}–${b} ms` : `${b} ms`;
      text(s, label, { x: px(b) + 0.12, y: y + 0.1, w: 1.3, h: 0.36, fontSize: 11, bold: true, color: C.background1, valign: 'middle' });
    });
    await tile(s, 0.6, 6.4, 0.42, 'Sparkles', 'FFAB00');
    text(s, 'At most one gentle decorative loop per area — and all decorative motion stops when “reduce motion” is on.', { x: 1.15, y: 6.4, w: 11, h: 0.42, fontSize: 13, color: SOFTTEXT, valign: 'middle' });
    s.addNotes('Durations for every kind of motion. The sliding tab pill is 300 ms with a gentle ease-out.');
  }

  // ============ 15 · States & feedback
  {
    const s = contentSlide('CONTENT_SOFT', 'Behaviour', '09 · STATES & FEEDBACK', 'States & feedback', 'Every view designs loading, empty, error and success up front. Never browser alerts.');
    const w = 3.88;
    const h = 2.12;
    const P = [0, 1, 2, 3, 4, 5].map((i) => [0.6 + (i % 3) * (w + 0.25), 2.2 + Math.floor(i / 3) * (h + 0.25)]);
    const labels = ['LOADING', 'EMPTY', 'ERROR', 'SUCCESS', 'UNSAVED CHANGES', 'RISKY ACTION'];
    P.forEach(([x, y], i) => {
      card(s, x, y, w, h);
      text(s, labels[i], { x: x + 0.28, y: y + 0.2, w: 3, h: 0.24, fontSize: 10, bold: true, color: MUTED, charSpacing: 1.5 });
    });
    // Loading skeleton
    {
      const [x, y] = P[0];
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.28, y: y + 0.6, w: 0.5, h: 0.5, rectRadius: 0.1, fill: { color: 'E3E8EF' }, line: { type: 'none' }, objectName: oid('skel') });
      [2.4, 1.6].forEach((bw, k) => s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.92, y: y + 0.64 + k * 0.26, w: bw, h: 0.16, rectRadius: 0.08, fill: { color: 'E3E8EF' }, line: { type: 'none' }, objectName: oid('skel') }));
      [3.3, 2.7].forEach((bw, k) => s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.28, y: y + 1.3 + k * 0.26, w: bw, h: 0.16, rectRadius: 0.08, fill: { color: 'EEF2F7' }, line: { type: 'none' }, objectName: oid('skel') }));
      text(s, 'Skeleton shaped like the content.', { x: x + 0.28, y: y + 1.78, w: 3.3, h: 0.26, fontSize: 11, color: MUTED });
    }
    // Empty
    {
      const [x, y] = P[1];
      await tile(s, x + 0.28, y + 0.6, 0.55, 'Inbox', '5E6B7A');
      text(s, 'No activity in this view', { x: x + 1.0, y: y + 0.58, w: 2.7, h: 0.3, fontSize: 13, bold: true });
      text(s, 'Try a different date range.', { x: x + 1.0, y: y + 0.88, w: 2.7, h: 0.26, fontSize: 11, color: MUTED });
      button(s, x + 1.0, y + 1.4, 1.75, 'Show all activity', 'secondary');
    }
    // Error
    {
      const [x, y] = P[2];
      await tile(s, x + 0.28, y + 0.6, 0.55, 'TriangleAlert', 'B71D18');
      text(s, 'Couldn’t load the dashboard', { x: x + 1.0, y: y + 0.58, w: 2.75, h: 0.3, fontSize: 13, bold: true });
      text(s, 'Check your connection and try again.', { x: x + 1.0, y: y + 0.88, w: 2.75, h: 0.26, fontSize: 11, color: MUTED });
      button(s, x + 1.0, y + 1.4, 0.9, 'Retry', 'primary');
    }
    // Success toast
    {
      const [x, y] = P[3];
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.28, y: y + 0.65, w: 3.3, h: 0.62, rectRadius: 0.12, fill: { color: 'FFFFFF' }, line: { color: BORDER, width: 0.75 }, shadow: shadow(), objectName: 'toast' });
      await tile(s, x + 0.4, y + 0.74, 0.44, 'CircleCheck', '118D57');
      text(s, 'Profile updated', { x: x + 0.98, y: y + 0.65, w: 2.4, h: 0.62, fontSize: 13, bold: true, valign: 'middle' });
      text(s, 'Closes itself after 4 seconds.', { x: x + 0.28, y: y + 1.6, w: 3.3, h: 0.26, fontSize: 11, color: MUTED });
    }
    // Unsaved
    {
      const [x, y] = P[4];
      s.addShape(S.ROUNDED_RECTANGLE, { x: x + 0.28, y: y + 0.62, w: 3.32, h: 0.95, rectRadius: 0.12, fill: { color: C.accent1, transparency: 88 }, line: { type: 'none' }, objectName: 'unsaved-bar' });
      s.addShape(S.OVAL, { x: x + 0.45, y: y + 0.76, w: 0.1, h: 0.1, fill: { color: C.accent1 }, line: { type: 'none' }, objectName: 'unsaved-dot' });
      text(s, 'You have unsaved changes', { x: x + 0.62, y: y + 0.66, w: 2.8, h: 0.3, fontSize: 12, bold: true, color: C.accent1, valign: 'middle' });
      button(s, x + 1.25, y + 1.05, 0.95, 'Discard', 'ghost');
      button(s, x + 2.3, y + 1.05, 1.15, 'Save', 'primary');
    }
    // Risky
    {
      const [x, y] = P[5];
      text(s, 'Log out of LearnNext?', { x: x + 0.28, y: y + 0.55, w: 3.3, h: 0.32, fontSize: 14, bold: true });
      text(s, 'You’ll need to sign in again.', { x: x + 0.28, y: y + 0.88, w: 3.3, h: 0.26, fontSize: 11, color: MUTED });
      button(s, x + 1.25, y + 1.4, 1.0, 'Cancel', 'secondary');
      button(s, x + 2.35, y + 1.4, 1.2, 'Log out', 'danger');
    }
    s.addNotes('Six states every view must design for. Use toasts and confirm dialogs — never window.alert or confirm.');
  }

  // ============ 16 · System pages
  {
    const s = contentSlide('CONTENT', 'Behaviour', '09 · SYSTEM PAGES', 'System pages', 'One calm style: deep navy, a soft glow, one simple illustration, a short message and a way back.');
    const w = 3.88;
    const h = 2.12;
    const P = [
      ['404', 'Page not found', 'Unknown address', 'Back to dashboard', 'A78BFA', 'Compass'],
      ['Crash', 'Page crash', 'A screen fails to load', 'Reload page', 'FF8A70', 'Bug'],
      ['500', 'Server error', 'Something failed on our side', 'Try again', 'FFC24D', 'ServerCrash'],
      ['503', 'Maintenance', 'Back in about 15 minutes', 'Check again', '4DD4EC', 'Wrench'],
      ['Offline', 'No internet', 'Recovers automatically', 'Try again', '7FB0EE', 'WifiOff'],
      ['Expired', 'Session expired', 'Signed out after inactivity', 'Sign in again', 'FF9F45', 'Hourglass'],
    ];
    for (const [i, [code, t, d, a, hex, ic]] of P.entries()) {
      const x = 0.6 + (i % 3) * (w + 0.25);
      const y = 2.2 + Math.floor(i / 3) * (h + 0.25);
      card(s, x, y, w, h, { fill: '0B1A2E', line: '0B1A2E' });
      // Glow ring + illustration tile in the page's colour
      s.addShape(S.OVAL, { x: x + w - 1.45, y: y + 0.3, w: 1.15, h: 1.15, fill: { color: hex, transparency: 88 }, line: { color: hex, width: 1, transparency: 60 }, objectName: oid('glow') });
      await tile(s, x + w - 1.17, y + 0.58, 0.6, ic, hex, { transparency: 80 });
      text(s, code, { x: x + 0.3, y: y + 0.22, w: 2.4, h: 0.6, fontSize: 28, bold: true, color: C.background1 });
      text(s, t, { x: x + 0.3, y: y + 0.88, w: 3, h: 0.3, fontSize: 14, bold: true, color: C.background1 });
      text(s, d, { x: x + 0.3, y: y + 1.18, w: 3.2, h: 0.26, fontSize: 11, color: SOFTTEXT });
      pill(s, x + 0.3, y + 1.55, 1.75, a, { fill: 'FFFFFF', transparency: 86, color: C.background1, h: 0.34, fontSize: 11, line: undefined });
    }
    s.addNotes('Six full-screen system pages share one calm look and always offer a way back.');
  }

  // ============ 17 · Accessibility & writing
  pres.addSection({ title: 'Quality' });
  {
    const s = contentSlide('CONTENT_SOFT', 'Quality', '10 · ACCESSIBILITY & WRITING', 'Accessibility & writing', 'WCAG 2.1 AA is the minimum. Words are plain, short and specific.');
    card(s, 0.6, 2.2, 5.9, 2.35);
    text(s, 'Contrast — at least 4.5 : 1 for text', { x: 0.9, y: 2.42, w: 5.3, h: 0.32, fontSize: 15, bold: true });
    [['1C252E', '15.6 : 1', 'Text'], ['46525F', '8.0 : 1', 'Secondary'], ['2A69B2', '5.4 : 1', 'Primary'], ['FF7A00', '2.6 : 1', 'Orange']].forEach(([hex, r, n], i) => {
      const x = 0.9 + i * 1.35;
      s.addShape(S.ROUNDED_RECTANGLE, { x, y: 2.95, w: 1.2, h: 0.8, rectRadius: 0.1, fill: { color: 'FFFFFF' }, line: { color: i === 3 ? 'B71D18' : BORDER, width: i === 3 ? 1.25 : 0.75, dashType: i === 3 ? 'dash' : 'solid' }, objectName: oid('contrast') });
      text(s, 'Aa', { x, y: 2.95, w: 1.2, h: 0.8, fontSize: 26, bold: true, color: hex, align: 'center', valign: 'middle' });
      text(s, r, { x, y: 3.82, w: 1.2, h: 0.24, fontSize: 12, bold: true, align: 'center' });
      text(s, n, { x, y: 4.06, w: 1.2, h: 0.24, fontSize: 10, color: i === 3 ? 'B71D18' : MUTED, align: 'center' });
    });

    card(s, 0.6, 4.8, 5.9, 1.85);
    const K = [['Keyboard', 'Everything works by keyboard; Esc closes overlays.'], ['Hand', '32 px minimum tap target; icon buttons carry a label.'], ['Eye', 'Colour never carries meaning on its own.']];
    for (const [i, [ic, d]] of K.entries()) {
      const y = 5.0 + i * 0.52;
      await tile(s, 0.9, y, 0.4, ic, '2A69B2');
      text(s, d, { x: 1.45, y, w: 4.9, h: 0.4, fontSize: 13, color: SEC, valign: 'middle' });
    }

    const head = (t, hex) => ({ text: t, options: { bold: true, color: hex, fill: { color: hex === '118D57' ? 'E7F4EE' : 'FBE9E8' }, fontSize: 13 } });
    const rows = [
      [head('✓  Do', '118D57'), head('✕  Don’t', 'B71D18')],
      ['Save changes', 'Submit'],
      ['Enter a valid mobile number', 'Invalid input'],
      ['Log out of LearnNext?', 'Are you sure?'],
      ['₹4.8 L collected', 'Amount: 480000.00'],
      ['12 Oct 2026 · 4:20 PM', '2026-10-12 16:20'],
      ['42m ago', '2520 seconds ago'],
    ].map((r, i) => (i === 0 ? r : r.map((t, k) => ({ text: t, options: { color: k ? MUTED : '1C252E', fontSize: 13 } }))));
    text(s, 'Writing — plain, short, specific', { x: 6.85, y: 2.2, w: 5.8, h: 0.34, fontSize: 15, bold: true });
    s.addTable(rows, { x: 6.85, y: 2.7, w: 5.88, colW: [2.94, 2.94], rowH: 0.5, fill: { color: 'FFFFFF' }, border: { type: 'solid', pt: 0.75, color: BORDER }, margin: [0.06, 0.15, 0.06, 0.15], valign: 'middle', objectName: 'writing-table' });
    s.addNotes('Contrast ratios against white. Accent orange fails for text on white (2.6 to 1), so it is decoration only. Right: preferred wording.');
  }

  // ============ 18 · Closing
  {
    const s = pres.addSlide({ masterName: 'COVER', sectionTitle: 'Quality' });
    s.addShape(S.OVAL, { x: 9.0, y: 1.0, w: 3.8, h: 3.8, fill: { color: C.accent1, transparency: 55 }, line: { type: 'none' }, objectName: 'glow-blue-end' });
    s.addShape(S.OVAL, { x: 10.7, y: 3.8, w: 2.0, h: 2.0, fill: { color: C.accent2, transparency: 20 }, line: { type: 'none' }, objectName: 'glow-orange-end' });
    s.addShape(S.OVAL, { x: 8.4, y: 4.3, w: 1.4, h: 1.4, fill: { color: C.accent4, transparency: 55 }, line: { type: 'none' }, objectName: 'glow-violet-end' });
    pill(s, 0.8, 1.7, 1.9, 'IN SHORT', { fill: C.accent2, color: C.text2, fontSize: 11 });
    s.addText('Calm. Clear. Consistent.', { placeholder: 'title' });
    s.addText('Build every new module from these guidelines and the shared components — extend a component instead of creating a look-alike.', { placeholder: 'subtitle' });
    text(s, 'LearnNext Admin · UI/UX Guidelines · October 2026', { x: 0.8, y: 6.3, w: 7, h: 0.35, fontSize: 13, color: SOFTTEXT });
    s.addNotes('Close: calm, clear, consistent. Questions and change requests go to the design system owner.');
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('Wrote', OUT);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
