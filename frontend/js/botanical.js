/**
 * botanical.js — Injects realistic floating SVG leaves into .right-panel
 * Matches the reference design: dense leaf clusters on edges + floating seeds
 */
(function () {
  const LEAVES = [
    // Large round leaf
    `<svg viewBox="0 0 110 130" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs>
      <path d="M55,5 C80,5 105,28 105,58 C105,92 82,122 55,125 C28,122 5,92 5,58 C5,28 30,5 55,5Z" fill="url(#lg1)"/>
      <path d="M55,125 L55,5" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M55,60 C38,52 18,45 5,40" stroke="#15803d" stroke-width="1" fill="none" opacity="0.3"/>
      <path d="M55,60 C72,52 92,45 105,40" stroke="#15803d" stroke-width="1" fill="none" opacity="0.3"/>
      <path d="M55,85 C42,78 25,70 12,65" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.25"/>
      <path d="M55,85 C68,78 85,70 98,65" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.25"/>
      <path d="M55,125 C52,128 50,132 49,135" stroke="#15803d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`,
    // Elongated pointed leaf
    `<svg viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#15803d"/></linearGradient></defs>
      <path d="M40,3 C60,20 72,50 68,85 C64,110 52,130 40,135 C28,130 16,110 12,85 C8,50 20,20 40,3Z" fill="url(#lg2)"/>
      <path d="M40,3 L40,135" stroke="#15803d" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M40,45 C28,40 15,35 5,32" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M40,45 C52,40 65,35 75,32" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M40,75 C30,70 18,64 8,60" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.25"/>
      <path d="M40,75 C50,70 62,64 72,60" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.25"/>
      <path d="M40,135 C38,138 36,142 35,145" stroke="#15803d" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    // Wide asymmetric leaf
    `<svg viewBox="0 0 130 100" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a7f3d0"/><stop offset="100%" stop-color="#22c55e"/></linearGradient></defs>
      <path d="M10,80 C5,55 15,20 40,8 C60,0 95,5 118,25 C128,45 122,70 100,82 C75,95 30,100 10,80Z" fill="url(#lg3)"/>
      <path d="M10,80 L118,25" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.4"/>
      <path d="M55,48 C45,38 30,25 15,18" stroke="#16a34a" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M55,48 C65,58 80,68 95,72" stroke="#16a34a" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M10,80 C7,85 5,90 5,95" stroke="#16a34a" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    // Small sprig leaf
    `<svg viewBox="0 0 70 110" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6ee7b7"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs>
      <path d="M35,5 C52,10 65,28 62,50 C59,72 46,90 35,95 C24,90 11,72 8,50 C5,28 18,10 35,5Z" fill="url(#lg4)"/>
      <path d="M35,5 L35,95" stroke="#065f46" stroke-width="1.2" fill="none" opacity="0.4"/>
      <path d="M35,38 C24,33 12,28 3,25" stroke="#065f46" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M35,38 C46,33 58,28 67,25" stroke="#065f46" stroke-width="0.8" fill="none" opacity="0.3"/>
      <path d="M35,95 C33,100 32,106 31,110" stroke="#065f46" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    // Heart-shaped leaf
    `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="lg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#bbf7d0"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs>
      <path d="M50,110 C20,90 5,65 5,42 C5,20 18,8 32,8 C40,8 47,12 50,18 C53,12 60,8 68,8 C82,8 95,20 95,42 C95,65 80,90 50,110Z" fill="url(#lg5)"/>
      <path d="M50,110 L50,18" stroke="#15803d" stroke-width="1.2" fill="none" opacity="0.35"/>
      <path d="M50,55 C38,48 22,40 8,36" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.28"/>
      <path d="M50,55 C62,48 78,40 92,36" stroke="#15803d" stroke-width="0.8" fill="none" opacity="0.28"/>
      <path d="M50,110 C48,115 46,118 45,122" stroke="#15803d" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  ];

  const SEED = `<svg viewBox="0 0 28 42" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="14" cy="21" rx="9" ry="18" fill="#a16207" opacity="0.7"/>
    <path d="M14,3 C14,3 18,8 18,14" stroke="#78350f" stroke-width="1" fill="none" opacity="0.5"/>
  </svg>`;

  // [leafIndex, size, top%, left%, rotation, opacity, animDuration, animDelay, flipX]
  const LEAF_CONFIGS = [
    // Top-left cluster
    [2, 110, -2,  -4,  -30, 0.85, 7, 0,   false],
    [0, 90,   2,  -2,   20, 0.75, 6, 0.5, false],
    [3, 70,   8,   1,  -15, 0.65, 8, 1.2, false],
    // Top-right cluster (densest)
    [1, 130,  -5,  78,   40, 0.9,  6, 0,   true],
    [0, 110,   0,  82,  -20, 0.85, 7, 0.4, true],
    [4, 90,    5,  76,   55, 0.75, 8, 0.9, true],
    [2, 100,   3,  88,  -10, 0.7,  7, 1.5, true],
    // Right edge
    [3, 95,   32,  90,   30, 0.6,  9, 0.6, true],
    [1, 85,   50,  88,  -40, 0.55, 6, 1.8, true],
    [0, 100,  65,  85,   15, 0.65, 7, 0.2, true],
    // Bottom-right
    [4, 90,   82,  78,   60, 0.7,  8, 1.1, true],
    [2, 110,  88,  70,  -25, 0.8,  6, 0.7, false],
    // Bottom-left
    [1, 100,  86,  2,    35, 0.75, 7, 1.4, false],
    [3, 80,   80,  -2,  -50, 0.6,  9, 0.3, false],
    // Left edge
    [0, 90,   50,  -3,   20, 0.55, 8, 1.7, false],
    [4, 75,   30,  -2,  -30, 0.5,  6, 0.9, false],
  ];

  // Seed positions [top%, left%, rotation, size, animDuration, animDelay]
  const SEED_CONFIGS = [
    [18, 20, -25, 22, 8,  0  ],
    [35, 72,  40, 18, 10, 1.5],
    [55, 15, -15, 20, 9,  0.8],
    [70, 60,  60, 16, 11, 2.2],
    [25, 55,  20, 24, 7,  0.3],
    [78, 30, -40, 19, 12, 1.0],
  ];

  const animations = `
    @keyframes leafFloat {
      0%,100% { transform: var(--base-t) translateY(0px) rotate(0deg); }
      25%      { transform: var(--base-t) translateY(-14px) rotate(2deg); }
      50%      { transform: var(--base-t) translateY(-6px)  rotate(-1.5deg); }
      75%      { transform: var(--base-t) translateY(-18px) rotate(3deg); }
    }
    @keyframes seedFloat {
      0%,100% { transform: rotate(var(--sr)) translateY(0px); }
      30%     { transform: rotate(var(--sr)) translateY(-12px); }
      60%     { transform: rotate(var(--sr)) translateY(-5px); }
    }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .right-panel { overflow: hidden; }
      .bot-leaf {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        animation: leafFloat var(--dur) ease-in-out infinite var(--delay);
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
      }
      .bot-seed {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        animation: seedFloat var(--sdur) ease-in-out infinite var(--sdelay);
      }
      .form-card { position: relative; z-index: 2; }
      ${animations}
    `;
    document.head.appendChild(style);
  }

  function buildLeaves(panel) {
    LEAF_CONFIGS.forEach(([li, size, top, left, rot, opa, dur, delay, flipX]) => {
      const el = document.createElement('div');
      el.className = 'bot-leaf';
      const flip = flipX ? 'scaleX(-1)' : 'scaleX(1)';
      const baseT = `rotate(${rot}deg) ${flip}`;
      el.style.cssText = `
        width:${size}px; height:auto;
        top:${top}%; left:${left}%;
        opacity:${opa};
        --base-t: ${baseT};
        --dur: ${dur}s;
        --delay: ${delay}s;
        transform-origin: 50% 90%;
      `;
      el.innerHTML = LEAVES[li];
      panel.appendChild(el);
    });

    SEED_CONFIGS.forEach(([top, left, rot, size, dur, delay]) => {
      const el = document.createElement('div');
      el.className = 'bot-seed';
      el.style.cssText = `
        width:${size}px; height:auto;
        top:${top}%; left:${left}%;
        opacity:0.5;
        --sr: ${rot}deg;
        --sdur: ${dur}s;
        --sdelay: ${delay}s;
      `;
      el.innerHTML = SEED;
      panel.appendChild(el);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('.right-panel');
    if (!panel) return;
    injectStyles();
    buildLeaves(panel);
  });
})();
