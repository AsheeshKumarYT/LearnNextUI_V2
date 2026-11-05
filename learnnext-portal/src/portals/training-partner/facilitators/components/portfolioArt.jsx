/**
 * Flat, friendly illustrations for the facilitator portfolio — soft peach / mint / lavender / sky with navy line work.
 * Decorative only (aria-hidden); loops are motion-safe. Raw colours are illustration art.
 */
import { cn } from '@/utils/cn';

export const ART = { navy: '#1e2a4a', blue: '#5b7fe8', sky: '#cfe0ff', peach: '#ffc3a0', peachDeep: '#f39a6b', mint: '#a8e3c8', mintDeep: '#4fb98b', lav: '#d9cffc', lavDeep: '#8f7be8', sun: '#ffd774', skin: '#f3c7a5', paper: '#ffffff' };
const A = ART;

/** Hero: a presentation board with a rising chart, a lightbulb, a plant and sparkles (sits behind / beside the photo) */
export function BoardScene({ className }) {
  return (
    <svg viewBox="0 0 320 240" className={cn('h-auto w-full', className)} aria-hidden="true">
      {/* board */}
      <rect x="40" y="30" width="200" height="130" rx="14" fill={A.paper} stroke={A.navy} strokeWidth="3" />
      <rect x="40" y="30" width="200" height="22" rx="11" fill={A.sky} />
      <circle cx="56" cy="41" r="4" fill={A.peachDeep} />
      <circle cx="70" cy="41" r="4" fill={A.sun} />
      <circle cx="84" cy="41" r="4" fill={A.mintDeep} />
      {/* bars */}
      {[
        [64, 120, 22, A.lav],
        [96, 104, 38, A.peach],
        [128, 90, 52, A.mint],
        [160, 72, 70, A.blue],
      ].map(([x, y, h, c]) => (
        <rect key={x} x={x} y={y} width="22" height={h} rx="5" fill={c} />
      ))}
      {/* trend line + arrow */}
      <path d="M62 112 L104 96 L138 84 L190 60" fill="none" stroke={A.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M180 56 L192 59 L188 71" fill="none" stroke={A.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* easel legs */}
      <path d="M100 160 L84 210 M180 160 L196 210 M140 160 L140 200" stroke={A.navy} strokeWidth="3" strokeLinecap="round" />
      {/* lightbulb */}
      <g className="motion-safe:animate-[pf-bob_5s_ease-in-out_infinite]">
        <circle cx="272" cy="58" r="22" fill={A.sun} />
        <path d="M262 82 h20 M264 90 h16" stroke={A.navy} strokeWidth="3" strokeLinecap="round" />
        <path d="M265 60 q7 -10 14 0" fill="none" stroke={A.navy} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M272 22 v-8 M244 34 l-6 -6 M300 34 l6 -6" stroke={A.peachDeep} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* plant */}
      <rect x="250" y="176" width="34" height="34" rx="8" fill={A.peachDeep} />
      <path d="M267 176 C 262 156 246 150 240 148 C 252 160 258 166 267 176 Z" fill={A.mintDeep} />
      <path d="M267 176 C 270 152 286 144 294 142 C 286 156 278 166 267 176 Z" fill={A.mint} />
      <path d="M267 176 C 268 160 266 146 268 132" stroke={A.mintDeep} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* sparkles */}
      <Sparkle x={20} y={70} s={10} fill={A.lavDeep} />
      <Sparkle x={222} y={196} s={8} fill={A.blue} />
      <circle cx="26" cy="190" r="6" fill={A.mint} />
    </svg>
  );
}

/** About: a speaker with speech bubbles */
export function SpeakerScene({ className }) {
  return (
    <svg viewBox="0 0 260 220" className={cn('h-auto w-full', className)} aria-hidden="true">
      <circle cx="130" cy="120" r="92" fill={A.lav} opacity="0.55" />
      {/* bubbles */}
      <g className="motion-safe:animate-[pf-bob_6s_ease-in-out_infinite]">
        <rect x="20" y="28" width="86" height="46" rx="16" fill={A.paper} stroke={A.navy} strokeWidth="2.5" />
        <path d="M58 74 l8 12 l6 -12" fill={A.paper} stroke={A.navy} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M36 46 h54 M36 58 h34" stroke={A.lavDeep} strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className="motion-safe:animate-[pf-bob_6s_ease-in-out_infinite] motion-safe:[animation-delay:-3s]">
        <rect x="160" y="16" width="78" height="42" rx="16" fill={A.peach} stroke={A.navy} strokeWidth="2.5" />
        <circle cx="182" cy="37" r="4" fill={A.navy} />
        <circle cx="199" cy="37" r="4" fill={A.navy} />
        <circle cx="216" cy="37" r="4" fill={A.navy} />
      </g>
      {/* person */}
      <path d="M86 212 C 90 160 110 140 130 140 C 150 140 170 160 174 212 Z" fill={A.blue} stroke={A.navy} strokeWidth="3" />
      <path d="M118 140 l12 18 l12 -18" fill={A.paper} stroke={A.navy} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="122" y="118" width="16" height="22" rx="6" fill={A.skin} />
      <circle cx="130" cy="98" r="28" fill={A.skin} stroke={A.navy} strokeWidth="3" />
      <path d="M102 94 C 104 70 156 66 158 94 C 150 82 112 80 102 94 Z" fill={A.navy} />
      <circle cx="120" cy="102" r="3" fill={A.navy} />
      <circle cx="140" cy="102" r="3" fill={A.navy} />
      <path d="M122 114 q8 7 16 0" fill="none" stroke={A.navy} strokeWidth="2.5" strokeLinecap="round" />
      {/* raised hand */}
      <path d="M170 176 C 186 160 194 140 196 124" fill="none" stroke={A.navy} strokeWidth="12" strokeLinecap="round" />
      <path d="M170 176 C 186 160 194 140 196 124" fill="none" stroke={A.blue} strokeWidth="7" strokeLinecap="round" />
      <circle cx="197" cy="118" r="9" fill={A.skin} stroke={A.navy} strokeWidth="2.5" />
      <Sparkle x={222} y={96} s={9} fill={A.sun} />
    </svg>
  );
}

/** Expertise: rising stairs of blocks with a flag on top */
export function GrowthScene({ className }) {
  return (
    <svg viewBox="0 0 220 180" className={cn('h-auto w-full', className)} aria-hidden="true">
      <ellipse cx="110" cy="166" rx="96" ry="10" fill={A.navy} opacity="0.07" />
      {[
        [24, 128, 36, A.peach],
        [64, 104, 60, A.mint],
        [104, 76, 88, A.lav],
        [144, 48, 116, A.sky],
      ].map(([x, y, h, c]) => (
        <rect key={x} x={x} y={y} width="40" height={h} rx="8" fill={c} stroke={A.navy} strokeWidth="2.5" />
      ))}
      <path d="M164 48 V14" stroke={A.navy} strokeWidth="3" strokeLinecap="round" />
      <path d="M164 14 L192 22 L164 32 Z" fill={A.peachDeep} stroke={A.navy} strokeWidth="2.5" strokeLinejoin="round" />
      <Sparkle x={32} y={84} s={9} fill={A.lavDeep} />
      <Sparkle x={196} y={70} s={7} fill={A.mintDeep} />
    </svg>
  );
}

/** Programs: a certificate with a ribbon seal */
export function CertificateScene({ className }) {
  return (
    <svg viewBox="0 0 220 170" className={cn('h-auto w-full', className)} aria-hidden="true">
      <rect x="30" y="34" width="160" height="112" rx="12" fill={A.sky} transform="rotate(-6 110 90)" />
      <rect x="30" y="28" width="160" height="112" rx="12" fill={A.paper} stroke={A.navy} strokeWidth="3" />
      <path d="M56 58 h108 M56 76 h80 M56 94 h92" stroke={A.lav} strokeWidth="7" strokeLinecap="round" />
      <path d="M56 118 h46" stroke={A.navy} strokeWidth="2.5" strokeLinecap="round" />
      <g className="motion-safe:animate-[pf-bob_5s_ease-in-out_infinite]">
        <path d="M156 128 l-8 30 l12 -8 l10 10 l4 -30 Z" fill={A.peachDeep} stroke={A.navy} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="160" cy="118" r="18" fill={A.sun} stroke={A.navy} strokeWidth="3" />
        <path d="M152 118 l6 6 l10 -12" fill="none" stroke={A.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={200} y={30} s={9} fill={A.mintDeep} />
      <Sparkle x={18} y={150} s={7} fill={A.lavDeep} />
    </svg>
  );
}

/** Journey: a winding road with flags along it */
export function RoadScene({ className }) {
  return (
    <svg viewBox="0 0 260 160" className={cn('h-auto w-full', className)} aria-hidden="true">
      <path d="M0 150 C 60 150 60 104 120 104 S 190 60 260 58" fill="none" stroke={A.sky} strokeWidth="26" strokeLinecap="round" />
      <path d="M0 150 C 60 150 60 104 120 104 S 190 60 260 58" fill="none" stroke={A.paper} strokeWidth="3" strokeDasharray="10 10" strokeLinecap="round" />
      {[
        [56, 132, A.mintDeep],
        [128, 100, A.lavDeep],
        [206, 66, A.peachDeep],
      ].map(([x, y, c]) => (
        <g key={x}>
          <path d={`M${x} ${y} V${y - 40}`} stroke={A.navy} strokeWidth="3" strokeLinecap="round" />
          <path d={`M${x} ${y - 40} l24 7 l-24 9 Z`} fill={c} stroke={A.navy} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      ))}
      <circle cx="236" cy="22" r="14" fill={A.sun} />
      <Sparkle x={20} y={40} s={8} fill={A.lavDeep} />
    </svg>
  );
}

/** Voices: two chat bubbles with a heart and stars */
export function ChatScene({ className }) {
  return (
    <svg viewBox="0 0 220 170" className={cn('h-auto w-full', className)} aria-hidden="true">
      <rect x="20" y="22" width="120" height="70" rx="20" fill={A.mint} stroke={A.navy} strokeWidth="3" />
      <path d="M52 92 l-4 20 l20 -20" fill={A.mint} stroke={A.navy} strokeWidth="3" strokeLinejoin="round" />
      {[46, 66, 86, 106].map((x) => (
        <path key={x} d={`M${x} 48 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z`} fill={A.sun} stroke={A.navy} strokeWidth="1.5" strokeLinejoin="round" />
      ))}
      <g className="motion-safe:animate-[pf-bob_6s_ease-in-out_infinite]">
        <rect x="92" y="88" width="108" height="58" rx="20" fill={A.paper} stroke={A.navy} strokeWidth="3" />
        <path d="M172 146 l6 16 l-24 -16" fill={A.paper} stroke={A.navy} strokeWidth="3" strokeLinejoin="round" />
        <path d="M146 128 C 132 118 132 104 142 104 C 147 104 146 110 146 110 C 146 110 145 104 150 104 C 160 104 160 118 146 128 Z" fill={A.peachDeep} />
        <path d="M112 110 h18 M112 124 h12" stroke={A.lav} strokeWidth="6" strokeLinecap="round" />
      </g>
      <Sparkle x={196} y={36} s={10} fill={A.lavDeep} />
    </svg>
  );
}

/** Contact: a paper plane on a dotted trail */
export function PlaneScene({ className }) {
  return (
    <svg viewBox="0 0 220 150" className={cn('h-auto w-full', className)} aria-hidden="true">
      <path d="M10 130 C 60 130 70 70 120 80" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <g className="motion-safe:animate-[pf-bob_5s_ease-in-out_infinite]">
        <path d="M120 80 L206 22 L170 112 L150 92 Z" fill="#ffffff" stroke={A.navy} strokeWidth="3" strokeLinejoin="round" />
        <path d="M150 92 L206 22 L140 98 Z" fill={A.sky} stroke={A.navy} strokeWidth="3" strokeLinejoin="round" />
        <path d="M150 92 L148 116 L162 102" fill={A.lav} stroke={A.navy} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <Sparkle x={40} y={40} s={10} fill={A.sun} />
      <circle cx="196" cy="128" r="7" fill={A.mint} />
    </svg>
  );
}

/** A four-point sparkle */
function Sparkle({ x, y, s, fill }) {
  return <path d={`M${x} ${y - s} C${x + 1} ${y - 2} ${x + 2} ${y - 1} ${x + s} ${y} C${x + 2} ${y + 1} ${x + 1} ${y + 2} ${x} ${y + s} C${x - 1} ${y + 2} ${x - 2} ${y + 1} ${x - s} ${y} C${x - 2} ${y - 1} ${x - 1} ${y - 2} ${x} ${y - s} Z`} fill={fill} />;
}
