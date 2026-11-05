/**
 * Static profile covers — still illustrations (no animation), drawn as SVG so they stay crisp and load nothing.
 * Each fills its (relative, overflow-hidden) parent at any size: the 1000×240 artboard is cropped like
 * `object-fit: cover` (xMidYMid slice). Raw colours are intentional — illustrations, the same in light and dark themes.
 */

function Art({ children, bg }) {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 1000 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ background: bg }}>
      {children}
    </svg>
  );
}

/** Soft aurora: blurred colour fields over deep navy */
function AuroraArt() {
  return (
    <Art bg="#0b1630">
      <defs>
        <filter id="sc-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
      </defs>
      <g filter="url(#sc-blur)" opacity="0.9">
        <ellipse cx="220" cy="70" rx="260" ry="70" fill="#2bd4b4" opacity="0.55" />
        <ellipse cx="560" cy="40" rx="240" ry="60" fill="#7c5cff" opacity="0.55" />
        <ellipse cx="860" cy="110" rx="220" ry="70" fill="#38bdf8" opacity="0.45" />
        <ellipse cx="420" cy="190" rx="300" ry="50" fill="#1e3a8a" opacity="0.6" />
      </g>
      {[[90, 30], [180, 150], [330, 60], [470, 140], [640, 90], [720, 30], [900, 60], [960, 170], [260, 210], [800, 200]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#fff" opacity="0.7" />
      ))}
    </Art>
  );
}

/** Warm dawn over soft rolling hills */
function DawnArt() {
  return (
    <Art>
      <defs>
        <linearGradient id="sc-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9c2" />
          <stop offset="0.55" stopColor="#ffc6b0" />
          <stop offset="1" stopColor="#f6a99a" />
        </linearGradient>
      </defs>
      <rect width="1000" height="240" fill="url(#sc-dawn)" />
      <circle cx="700" cy="120" r="54" fill="#fff4dc" opacity="0.9" />
      <path d="M0 170 C 160 120 300 130 460 160 S 780 120 1000 150 V240 H0 Z" fill="#f08f86" opacity="0.75" />
      <path d="M0 200 C 200 160 360 175 520 195 S 820 165 1000 190 V240 H0 Z" fill="#d9707a" opacity="0.85" />
      <path d="M0 228 C 240 205 420 215 600 228 S 860 210 1000 222 V240 H0 Z" fill="#b8566b" />
    </Art>
  );
}

/** Layered alpine ridges fading into mist */
function AlpineArt() {
  return (
    <Art>
      <defs>
        <linearGradient id="sc-alp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe9f7" />
          <stop offset="1" stopColor="#b7cde6" />
        </linearGradient>
      </defs>
      <rect width="1000" height="240" fill="url(#sc-alp)" />
      <circle cx="210" cy="70" r="30" fill="#fff" opacity="0.85" />
      <path d="M0 150 L120 90 L210 140 L330 70 L450 135 L560 85 L690 140 L800 80 L920 130 L1000 100 V240 H0 Z" fill="#94b3d6" />
      <path d="M0 180 L140 120 L260 175 L380 115 L520 175 L650 125 L780 180 L900 130 L1000 165 V240 H0 Z" fill="#6f92bf" />
      <path d="M0 215 L160 165 L300 210 L460 160 L600 212 L760 168 L900 212 L1000 190 V240 H0 Z" fill="#3f6497" />
    </Art>
  );
}

/** Topographic contour lines on deep green */
function TopoArt() {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <Art bg="#0f3b34">
      <g fill="none" stroke="#7fd1b9" strokeWidth="1.4" opacity="0.5">
        {rings.map((i) => (
          <ellipse key={`a${i}`} cx="260" cy="130" rx={40 + i * 34} ry={22 + i * 18} transform={`rotate(-8 260 130)`} />
        ))}
        {rings.slice(0, 7).map((i) => (
          <ellipse key={`b${i}`} cx="780" cy="90" rx={30 + i * 32} ry={18 + i * 15} transform={`rotate(10 780 90)`} />
        ))}
      </g>
      <circle cx="260" cy="130" r="4" fill="#c9f2e3" />
      <circle cx="780" cy="90" r="4" fill="#c9f2e3" />
    </Art>
  );
}

/** Low-poly facets in indigo */
function FacetArt() {
  // A fixed triangle mesh (columns of 125 wide), shaded light → dark across the cover
  const cols = 9;
  const tris = [];
  for (let c = 0; c < cols; c++) {
    const x0 = c * 125 - 30;
    const x1 = x0 + 125;
    const yMid = c % 2 ? 90 : 150;
    const shade = (k) => `hsl(${232 + c * 3} ${55 - k * 4}% ${22 + ((c * 7 + k * 11) % 20)}%)`;
    tris.push([`${x0},0 ${x1},0 ${x0},${yMid}`, shade(0)]);
    tris.push([`${x1},0 ${x1},${240 - yMid} ${x0},${yMid}`, shade(1)]);
    tris.push([`${x0},${yMid} ${x1},${240 - yMid} ${x0},240`, shade(2)]);
    tris.push([`${x1},${240 - yMid} ${x1},240 ${x0},240`, shade(3)]);
  }
  return (
    <Art bg="#1e1b4b">
      {tris.map(([points, fill], i) => (
        <polygon key={i} points={points} fill={fill} stroke={fill} strokeWidth="0.6" />
      ))}
    </Art>
  );
}

/** Layered paper waves in soft lavender and peach */
function PaperArt() {
  return (
    <Art bg="#f3eefe">
      <path d="M0 70 C 200 30 380 110 560 70 S 860 30 1000 60 V240 H0 Z" fill="#e4dafc" />
      <path d="M0 115 C 220 80 400 150 600 115 S 880 80 1000 110 V240 H0 Z" fill="#d6c6fa" />
      <path d="M0 160 C 240 130 420 190 640 158 S 880 135 1000 155 V240 H0 Z" fill="#ffd8c9" />
      <path d="M0 200 C 260 178 460 225 680 198 S 900 182 1000 196 V240 H0 Z" fill="#ffc2ae" />
    </Art>
  );
}

/** Golden desert dunes under a low sun */
function DunesArt() {
  return (
    <Art>
      <defs>
        <linearGradient id="sc-dune-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe3c0" />
          <stop offset="1" stopColor="#f7c99a" />
        </linearGradient>
        <linearGradient id="sc-dune-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9a46a" />
          <stop offset="1" stopColor="#d98952" />
        </linearGradient>
        <linearGradient id="sc-dune-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c8733f" />
          <stop offset="1" stopColor="#b5602f" />
        </linearGradient>
      </defs>
      <rect width="1000" height="240" fill="url(#sc-dune-sky)" />
      <circle cx="260" cy="96" r="42" fill="#fff3d9" />
      <path d="M0 170 C 180 110 340 120 520 150 C 680 176 820 120 1000 128 V240 H0 Z" fill="url(#sc-dune-a)" />
      <path d="M520 150 C 600 165 640 190 700 240 H520 Z" fill="#f2b98a" opacity="0.55" />
      <path d="M0 210 C 220 160 420 180 600 205 C 760 226 880 190 1000 196 V240 H0 Z" fill="url(#sc-dune-b)" />
      <path d="M600 205 C 660 214 700 228 730 240 H600 Z" fill="#d98952" opacity="0.6" />
    </Art>
  );
}

/** Soft pastel colour bloom (mesh gradient) */
function BloomArt() {
  return (
    <Art bg="#fdf2f6">
      <defs>
        <filter id="sc-bloom" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
      </defs>
      <g filter="url(#sc-bloom)">
        <circle cx="160" cy="80" r="140" fill="#ffc6dd" />
        <circle cx="430" cy="190" r="150" fill="#c9d8ff" />
        <circle cx="700" cy="60" r="140" fill="#ffe7b0" />
        <circle cx="920" cy="190" r="140" fill="#cdf0e2" />
      </g>
    </Art>
  );
}

/** Moonlit lake with mountains reflected in still water */
function MoonLakeArt() {
  return (
    <Art>
      <defs>
        <linearGradient id="sc-lake-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1a3a" />
          <stop offset="1" stopColor="#2a3f74" />
        </linearGradient>
        <linearGradient id="sc-lake-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24386a" />
          <stop offset="1" stopColor="#0d1733" />
        </linearGradient>
      </defs>
      <rect width="1000" height="240" fill="url(#sc-lake-sky)" />
      {[[80, 30], [190, 70], [300, 25], [420, 55], [560, 20], [880, 40], [950, 85], [640, 75]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#fff" opacity="0.75" />
      ))}
      <circle cx="760" cy="62" r="26" fill="#f5efd2" />
      <path d="M0 150 L110 100 L220 140 L340 90 L470 145 L600 105 L720 145 L850 100 L1000 140 V155 H0 Z" fill="#16264f" />
      <rect y="155" width="1000" height="85" fill="url(#sc-lake-water)" />
      <path d="M0 155 L110 190 L220 165 L340 205 L470 160 L600 195 L720 160 L850 200 L1000 165 V155 Z" fill="#16264f" opacity="0.55" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={740 - i * 6} y={168 + i * 13} width={40 + i * 12} height="2" rx="1" fill="#f5efd2" opacity={0.55 - i * 0.08} />
      ))}
    </Art>
  );
}

/** Terrazzo: scattered stone chips on warm cream */
function TerrazzoArt() {
  const chips = [
    [70, 60, 22, '#e8a598', 20], [190, 150, 14, '#8fb9a8', -30], [300, 70, 18, '#f2c66d', 45], [400, 180, 24, '#9fb4e0', 10],
    [520, 90, 12, '#e8a598', -15], [610, 170, 20, '#f2c66d', 60], [700, 50, 26, '#8fb9a8', 30], [820, 140, 16, '#9fb4e0', -40],
    [930, 70, 20, '#e8a598', 15], [130, 210, 10, '#9fb4e0', 0], [470, 30, 9, '#8fb9a8', 25], [880, 215, 12, '#f2c66d', -20],
    [250, 110, 7, '#c9a0dc', 0], [760, 200, 8, '#c9a0dc', 0], [560, 215, 6, '#e8a598', 0], [960, 165, 7, '#8fb9a8', 0],
    // More chips through the middle, so the small swatch (a centre crop) is as rich as the full cover
    [455, 120, 16, '#f2c66d', 70], [520, 160, 9, '#9fb4e0', 0], [575, 60, 14, '#e8a598', -50], [430, 75, 8, '#8fb9a8', 0],
    [500, 200, 13, '#c9a0dc', 35], [590, 120, 7, '#8fb9a8', 0], [355, 130, 11, '#e8a598', 20], [650, 100, 10, '#9fb4e0', -10],
    [470, 160, 5, '#e8a598', 0], [540, 110, 5, '#f2c66d', 0], [620, 210, 6, '#9fb4e0', 0], [380, 210, 6, '#f2c66d', 0],
  ];
  return (
    <Art bg="#f6efe4">
      {chips.map(([x, y, s, fill, rot]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x - s} ${y} Q${x - s * 0.6} ${y - s * 0.9} ${x} ${y - s * 0.7} Q${x + s} ${y - s * 0.4} ${x + s * 0.8} ${y + s * 0.3} Q${x + s * 0.3} ${y + s} ${x - s * 0.5} ${y + s * 0.6} Z`}
          fill={fill}
          opacity="0.85"
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
    </Art>
  );
}

/** Tropical leaves on a soft mint wall */
function LeavesArt() {
  const leaf = (x, y, s, rot, fill) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C 30 -40 90 -50 140 -20 C 100 10 40 20 0 0 Z" fill={fill} />
      <path d="M0 0 C 45 -14 95 -22 140 -20" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
    </g>
  );
  return (
    <Art bg="#dff1e8">
      {/* Back layer: pale leaves across the whole cover, so every crop has some foliage */}
      <g opacity="0.55">
        {leaf(180, 120, 1.1, -10, '#9fd3b8')}
        {leaf(420, 40, 1, 30, '#9fd3b8')}
        {leaf(470, 230, 1.2, -40, '#9fd3b8')}
        {leaf(640, 110, 1, 15, '#9fd3b8')}
        {leaf(330, 170, 0.9, 200, '#9fd3b8')}
        {leaf(560, 10, 0.9, 120, '#9fd3b8')}
      </g>
      {/* Front layer: deeper greens framing the edges */}
      {leaf(-20, 60, 1.4, 10, '#3f8f6b')}
      {leaf(40, 200, 1.6, -25, '#2f7a5a')}
      {leaf(260, -10, 1.1, 40, '#5fae86')}
      {leaf(380, 250, 1.1, -70, '#4a9c76')}
      {leaf(560, 160, 1, -20, '#5fae86')}
      {leaf(700, 250, 1.2, -60, '#3f8f6b')}
      {leaf(830, 40, 1.5, 160, '#4a9c76')}
      {leaf(1010, 210, 1.7, 200, '#2f7a5a')}
    </Art>
  );
}

/** Golden-hour seascape: sun stripes over a calm sea */
function SeascapeArt() {
  return (
    <Art>
      <defs>
        <linearGradient id="sc-sea-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7b8a1" />
          <stop offset="1" stopColor="#fbd9b5" />
        </linearGradient>
        <linearGradient id="sc-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f9fc4" />
          <stop offset="1" stopColor="#3b6d99" />
        </linearGradient>
      </defs>
      <rect width="1000" height="150" fill="url(#sc-sea-sky)" />
      <circle cx="500" cy="150" r="58" fill="#fff1d6" />
      <rect y="150" width="1000" height="90" fill="url(#sc-sea)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={500 - (70 - i * 9)} y={160 + i * 13} width={(70 - i * 9) * 2} height="3" rx="1.5" fill="#fff1d6" opacity={0.7 - i * 0.1} />
      ))}
      <path d="M0 150 H1000" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
    </Art>
  );
}

export const STATIC_COVERS = [
  { id: 'aurora', label: 'Aurora', description: 'Soft northern lights over a starry navy sky', Scene: AuroraArt },
  { id: 'dawn', label: 'Dawn hills', description: 'Warm peach sky over rolling rose hills', Scene: DawnArt },
  { id: 'alpine', label: 'Alpine', description: 'Layered blue ridges fading into mist', Scene: AlpineArt },
  { id: 'topo', label: 'Topography', description: 'Contour lines on deep forest green', Scene: TopoArt },
  { id: 'facets', label: 'Facets', description: 'Low-poly triangles in shades of indigo', Scene: FacetArt },
  { id: 'paper', label: 'Paper waves', description: 'Layered lavender and peach paper', Scene: PaperArt },
  { id: 'dunes', label: 'Dunes', description: 'Golden desert dunes under a low sun', Scene: DunesArt },
  { id: 'bloom', label: 'Bloom', description: 'Soft pastel colours melting together', Scene: BloomArt },
  { id: 'moonlake', label: 'Moon lake', description: 'Moonlit mountains in still water', Scene: MoonLakeArt },
  { id: 'terrazzo', label: 'Terrazzo', description: 'Scattered stone chips on warm cream', Scene: TerrazzoArt },
  { id: 'leaves', label: 'Leaves', description: 'Tropical leaves on a soft mint wall', Scene: LeavesArt },
  { id: 'seascape', label: 'Seascape', description: 'Golden-hour sun over a calm sea', Scene: SeascapeArt },
].map((c) => ({ ...c, kind: 'static' }));
