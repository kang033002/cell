// 사람 염색체 46개(23쌍) 완전 개별 시각화 감수분열 엔진

// 23쌍 염색체 데이터 정의 (크기 비율 및 번호)
const humanChromosomes = [];
for (let i = 1; i <= 22; i++) {
  // 1번 염색체가 가장 크고 22번이 가장 작음
  const height = Math.max(12, 34 - (i * 0.9));
  humanChromosomes.push({
    pair: i,
    name: `${i}번`,
    type: 'autosome',
    height: height,
    width: Math.max(4, height * 0.28)
  });
}
// 23번째 성염색체 (XY 또는 XX - 여기서는 X/Y 기준)
humanChromosomes.push({ pair: 23, name: 'X', type: 'sex', height: 26, width: 7.5 });
humanChromosomes.push({ pair: 23, name: 'Y', type: 'sex', height: 14, width: 4.5 });

// 8단계 정의 (염색체 46개 전체 좌표 계산)
const phases = [
  {
    id: 0,
    title: "0. 간기 (S기 DNA 복제 완료)",
    badge: "2n = 46개 복제",
    ploidy: "2n = 46",
    chromosomes: "46개 (23쌍)",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "모세포 속 <strong>46개(부계 23개 + 모계 23개)</strong>의 염색체가 모두 S기를 지나며 DNA가 2배로 복제되었습니다. 화면의 46개 가닥이 23쌍의 상동염색체 모세포입니다.",
    renderCanvas: (svg, crossing) => renderInterphaseAll46(svg)
  },
  {
    id: 1,
    title: "1. 감수 제1분열 전기 (2가 염색체 23쌍 형성)",
    badge: "2가 염색체 23쌍!",
    ploidy: "2n = 46 (2가 23쌍)",
    chromosomes: "46개 (23쌍 접합)",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "부계 23개와 모계 23개 염색체가 1:1로 짝을 맞추어 <strong class='text-amber-400'>정확히 23개의 2가 염색체(4분체)</strong>를 만듭니다. (1번부터 22번 상염색체 + 성염색체 23쌍 전체 표시)",
    renderCanvas: (svg, crossing) => renderProphase1All46(svg, crossing)
  },
  {
    id: 2,
    title: "2. 감수 제1분열 중기 (2가 염색체 23쌍 적도판 배열)",
    badge: "적도판 23쌍 중앙 정렬",
    ploidy: "2n = 46",
    chromosomes: "46개",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "23쌍의 2가 염색체가 세포 중앙 적도판에 2줄로 늘어섭니다. 부계(파란색)와 모계(분홍색)가 무작위로 왼쪽/오른쪽에 배치되어 독립의 법칙이 이뤄집니다.",
    renderCanvas: (svg, crossing) => renderMetaphase1All46(svg, crossing)
  },
  {
    id: 3,
    title: "3. 감수 제1분열 후기 (★ 상동염색체 23개씩 양극 분리)",
    badge: "핵상 반감! 2n=46 → n=23",
    ploidy: "2n → n (분리 중)",
    chromosomes: "46개 (23개씩 이동)",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong class='text-red-400 text-sm'>★ 핵심: 23쌍의 상동염색체가 갈라집니다!</strong> 부계/모계 염색체 23개는 왼쪽으로, 나머지 23개는 오른쪽으로 이동합니다. (염색체 수가 반으로 감소)",
    renderCanvas: (svg, crossing) => renderAnaphase1All46(svg, crossing)
  },
  {
    id: 4,
    title: "4. 감수 제1분열 말기 (n=23개 딸세포 2개 완성)",
    badge: "1분열 완료 (n=23개)",
    ploidy: "n = 23 (각 세포)",
    chromosomes: "23개 / 세포",
    chromatids: "46개 / 세포",
    dna: "2",
    dnaPct: "50%",
    desc: "1분열 결과 형성된 2개의 딸세포입니다. 각 딸세포에는 상동염색체 쌍 중 1개씩 선택되어 <strong class='text-purple-300'>정확히 23개의 염색체</strong>가 들어있습니다.",
    renderCanvas: (svg, crossing) => renderTelophase1All46(svg)
  },
  {
    id: 5,
    title: "5. 감수 제2분열 중기 (n=23개 일렬 배열)",
    badge: "제2분열 (n→n)",
    ploidy: "n = 23",
    chromosomes: "23개 / 세포",
    chromatids: "46개 / 세포",
    dna: "2",
    dnaPct: "50%",
    desc: "복제 간기 없이 진행됩니다. 2개의 딸세포 내부에서 각각 n=23개의 염색체가 적도판에 1줄로 중앙 정렬합니다.",
    renderCanvas: (svg, crossing) => renderMetaphase2All46(svg)
  },
  {
    id: 6,
    title: "6. 감수 제2분열 후기 (★ 염색분체 23쌍 분리)",
    badge: "염색분체 분리!",
    ploidy: "n = 23",
    chromosomes: "23개 분체 분리",
    chromatids: "23개씩 양극으로",
    dna: "2 → 1",
    dnaPct: "25%",
    desc: "동원체가 split되어 23개 염색체의 <strong>염색분체(sister chromatids)</strong>가 23개씩 양 극으로 갈라집니다. 염색체 수(n=23)는 일정합니다.",
    renderCanvas: (svg, crossing) => renderAnaphase2All46(svg)
  },
  {
    id: 7,
    title: "7. 감수분열 완료 (각 n=23개 염색체를 가진 생식세포 4개)",
    badge: "생식세포 4개 (n=23)",
    ploidy: "n = 23 (각 세포)",
    chromosomes: "23개 / 세포",
    chromatids: "23개 (단일)",
    dna: "1",
    dnaPct: "25%",
    desc: "최종 완료! 1개의 모세포(46개)로부터 <strong>정확히 23개의 단일 염색체를 지닌 4개의 생식세포(정자/난자)</strong>가 탄생합니다.",
    renderCanvas: (svg, crossing) => renderTelophase2All46(svg)
  }
];

let currentPhaseIndex = 1;
let isPlaying = false;
let playTimer = null;
let enableCrossingOver = true;

document.addEventListener("DOMContentLoaded", () => {
  initPhaseList();
  setupEventListeners();
  updateStageUI();
});

function initPhaseList() {
  const container = document.getElementById("phase-list-container");
  container.innerHTML = phases.map((p, idx) => `
    <button onclick="selectPhase(${idx})" id="phase-btn-${idx}" 
      class="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 transition flex items-center justify-between text-xs group">
      <span class="font-medium text-slate-300 group-hover:text-white">${p.title.split('.')[1] || p.title}</span>
      <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-blue-900 group-hover:text-blue-200 font-mono">${p.badge}</span>
    </button>
  `).join("");
}

function setupEventListeners() {
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPhaseIndex > 0) {
      currentPhaseIndex--;
      updateStageUI();
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentPhaseIndex < phases.length - 1) {
      currentPhaseIndex++;
      updateStageUI();
    }
  });

  document.getElementById("play-pause-btn").addEventListener("click", togglePlay);

  document.getElementById("reset-sim-btn").addEventListener("click", () => {
    stopPlay();
    currentPhaseIndex = 1;
    updateStageUI();
  });

  document.getElementById("crossing-over-toggle").addEventListener("click", () => {
    enableCrossingOver = !enableCrossingOver;
    document.getElementById("crossing-status").innerText = enableCrossingOver ? "ON" : "OFF";
    updateStageUI();
  });

  document.getElementById("toggle-quiz-btn").addEventListener("click", openQuizModal);
  document.getElementById("close-quiz-btn").addEventListener("click", closeQuizModal);
}

function selectPhase(idx) {
  stopPlay();
  currentPhaseIndex = idx;
  updateStageUI();
}

function togglePlay() {
  if (isPlaying) {
    stopPlay();
  } else {
    isPlaying = true;
    document.getElementById("play-text").innerText = "일시정지";
    document.getElementById("play-pause-btn").classList.replace("bg-indigo-600", "bg-amber-600");
    playTimer = setInterval(() => {
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
      } else {
        currentPhaseIndex = 0;
      }
      updateStageUI();
    }, 3200);
  }
}

function stopPlay() {
  isPlaying = false;
  if (playTimer) clearInterval(playTimer);
  document.getElementById("play-text").innerText = "자동 재생";
  document.getElementById("play-pause-btn").classList.replace("bg-amber-600", "bg-indigo-600");
}

function updateStageUI() {
  const p = phases[currentPhaseIndex];

  document.getElementById("stage-badge").innerText = `STEP ${currentPhaseIndex + 1}/${phases.length}`;
  document.getElementById("tracker-ploidy").innerText = p.ploidy;
  document.getElementById("tracker-chromosomes").innerText = p.chromosomes;
  document.getElementById("tracker-chromatids").innerText = p.chromatids;
  document.getElementById("tracker-dna").innerText = p.dna;
  document.getElementById("tracker-dna-bar").style.width = p.dnaPct;

  document.getElementById("stage-title-text").innerHTML = `${p.title} <span class="text-xs ml-2 px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">${p.badge}</span>`;
  document.getElementById("stage-desc-text").innerHTML = p.desc;

  const svgCanvas = document.getElementById("meiosis-canvas");
  svgCanvas.innerHTML = '';
  p.renderCanvas(svgCanvas, enableCrossingOver);

  phases.forEach((_, idx) => {
    const btn = document.getElementById(`phase-btn-${idx}`);
    if (btn) {
      if (idx === currentPhaseIndex) {
        btn.className = "w-full text-left p-2.5 rounded-xl border border-blue-500 bg-blue-950/40 text-xs font-bold text-white shadow-md shadow-blue-500/20 flex items-center justify-between";
      } else {
        btn.className = "w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center justify-between group";
      }
    }
  });
}

// -------------------------------------------------------------
// SVG RENDERERS FOR ALL 46 CHROMOSOMES
// -------------------------------------------------------------

function drawChromosome(svg, x, y, size, color, label = '', isReplicated = true, angle = 0) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

  const width = Math.max(3, size * 0.28);
  const halfH = size / 2;

  if (isReplicated) {
    // 2 Sister Chromatids ('X' shape)
    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute("d", `M ${-width} ${-halfH} Q 0 0 ${-width} ${halfH} M 0 ${-halfH} Q ${-width/2} 0 0 ${halfH}`);
    p1.setAttribute("fill", "none");
    p1.setAttribute("stroke", color);
    p1.setAttribute("stroke-width", Math.max(2.5, width * 0.8));
    p1.setAttribute("stroke-linecap", "round");

    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute("d", `M ${width} ${-halfH} Q 0 0 ${width} ${halfH} M 0 ${-halfH} Q ${width/2} 0 0 ${halfH}`);
    p2.setAttribute("fill", "none");
    p2.setAttribute("stroke", color);
    p2.setAttribute("stroke-width", Math.max(2.5, width * 0.8));
    p2.setAttribute("stroke-linecap", "round");

    const centro = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centro.setAttribute("cx", "0");
    centro.setAttribute("cy", "0");
    centro.setAttribute("r", Math.max(2, width * 0.5));
    centro.setAttribute("fill", "#f59e0b");

    g.appendChild(p1);
    g.appendChild(p2);
    g.appendChild(centro);
  } else {
    // Single Chromatid ('I' shape)
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", `M 0 ${-halfH} Q ${width/2} 0 0 ${halfH}`);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", color);
    p.setAttribute("stroke-width", Math.max(2.5, width * 0.9));
    p.setAttribute("stroke-linecap", "round");

    const centro = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centro.setAttribute("cx", "0");
    centro.setAttribute("cy", "0");
    centro.setAttribute("r", Math.max(1.8, width * 0.4));
    centro.setAttribute("fill", "#f59e0b");

    g.appendChild(p);
    g.appendChild(centro);
  }

  if (label) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "0");
    text.setAttribute("y", `${halfH + 10}`);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#94a3b8");
    text.setAttribute("font-size", "9");
    text.setAttribute("font-weight", "bold");
    text.textContent = label;
    g.appendChild(text);
  }

  svg.appendChild(g);
}

// 0. Interphase: All 46 scattered in nucleus
function renderInterphaseAll46(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "220"); cell.setAttribute("r", "180");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#475569"); cell.setAttribute("stroke-width", "4"); cell.setAttribute("stroke-dasharray", "6,6");
  svg.appendChild(cell);

  const nuc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  nuc.setAttribute("cx", "300"); nuc.setAttribute("cy", "220"); nuc.setAttribute("r", "140");
  nuc.setAttribute("fill", "#020617"); nuc.setAttribute("stroke", "#64748b"); nuc.setAttribute("stroke-width", "2");
  svg.appendChild(nuc);

  // Render all 23 pairs (46 total) scattered inside nucleus
  for (let i = 0; i < 23; i++) {
    const angleP = (i / 23) * Math.PI * 2;
    const radP = 50 + (i % 3) * 28;
    const xP = 300 + Math.cos(angleP) * radP;
    const yP = 220 + Math.sin(angleP) * radP;

    const angleM = ((i + 0.5) / 23) * Math.PI * 2;
    const radM = 40 + (i % 4) * 24;
    const xM = 300 + Math.cos(angleM) * radM;
    const yM = 220 + Math.sin(angleM) * radM;

    const size = Math.max(12, 26 - i * 0.6);
    drawChromosome(svg, xP, yP, size, "#3b82f6", "", true, (i * 25) % 360);
    drawChromosome(svg, xM, yM, size, "#ec4899", "", true, (i * 35) % 360);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "60");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#60a5fa"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "모세포 (2n = 46개 복제 완료: 부계 23개 + 모계 23개)";
  svg.appendChild(title);
}

// 1. Prophase I: 23 Bivalents (Pairs 1..23)
function renderProphase1All46(svg, crossing) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "220"); cell.setAttribute("r", "190");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  // Grid layout for 23 bivalents (6 rows x 4 cols)
  for (let i = 0; i < 23; i++) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    const cx = 130 + col * 68;
    const cy = 100 + row * 62;

    const size = Math.max(12, 26 - i * 0.6);
    const label = i === 22 ? '23(XY)' : `${i+1}번`;

    // Draw Paternal & Maternal side by side as Bivalent
    drawChromosome(svg, cx - 7, cy, size, "#3b82f6", "", true, 0);
    drawChromosome(svg, cx + 7, cy, size, "#ec4899", label, true, 0);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "40");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#f59e0b"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 2가 염색체 23쌍 (상동염색체 1~23번 1:1 접합 완료)";
  svg.appendChild(title);
}

// 2. Metaphase I: 23 Pairs aligned along Equator (12 top, 11 bottom or 2 rows along vertical equator)
function renderMetaphase1All46(svg, crossing) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "220"); cell.setAttribute("r", "190");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  // Equator line
  const eq = document.createElementNS("http://www.w3.org/2000/svg", "line");
  eq.setAttribute("x1", "300"); eq.setAttribute("y1", "40"); eq.setAttribute("x2", "300"); eq.setAttribute("y2", "400");
  eq.setAttribute("stroke", "#334155"); eq.setAttribute("stroke-width", "2"); eq.setAttribute("stroke-dasharray", "4,4");
  svg.appendChild(eq);

  // Spindle poles
  const p1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  p1.setAttribute("cx", "70"); p1.setAttribute("cy", "220"); p1.setAttribute("r", "8"); p1.setAttribute("fill", "#64748b");
  const p2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  p2.setAttribute("cx", "530"); p2.setAttribute("cy", "220"); p2.setAttribute("r", "8"); p2.setAttribute("fill", "#64748b");
  svg.appendChild(p1); svg.appendChild(p2);

  // Align 23 pairs along vertical equator (left side Paternal/random, right side Maternal/random)
  for (let i = 0; i < 23; i++) {
    const y = 60 + i * 15;
    const size = Math.max(10, 22 - i * 0.4);
    const isSwap = (i % 2 === 1); // random independent assortment

    const colorLeft = isSwap ? "#ec4899" : "#3b82f6";
    const colorRight = isSwap ? "#3b82f6" : "#ec4899";

    drawChromosome(svg, 275, y, size, colorLeft, "", true, 90);
    drawChromosome(svg, 325, y, size, colorRight, "", true, 90);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#60a5fa"); title.setAttribute("font-size", "13"); title.setAttribute("font-weight", "bold");
  title.textContent = "적도판 배열 (23쌍의 2가 염색체 중앙 2줄 정렬)";
  svg.appendChild(title);
}

// 3. Anaphase I: Homologous separation (23 moving left, 23 moving right)
function renderAnaphase1All46(svg, crossing) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "220"); cell.setAttribute("rx", "210"); cell.setAttribute("ry", "175");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  for (let i = 0; i < 23; i++) {
    const y = 65 + i * 14;
    const size = Math.max(10, 20 - i * 0.4);
    const isSwap = (i % 2 === 1);

    const colorLeft = isSwap ? "#ec4899" : "#3b82f6";
    const colorRight = isSwap ? "#3b82f6" : "#ec4899";

    // Moving to left pole (23 chromosomes)
    drawChromosome(svg, 190, y, size, colorLeft, "", true, 75);
    // Moving to right pole (23 chromosomes)
    drawChromosome(svg, 410, y, size, colorRight, "", true, 105);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#ef4444"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 상동염색체 분리 (왼쪽 23개, 오른쪽 23개 양 극 이동!)";
  svg.appendChild(title);
}

// 4. Telophase I: 2 Daughter cells, each with 23 chromosomes
function renderTelophase1All46(svg) {
  // Daughter Cell 1 (Left: 23 chromosomes)
  const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g1.setAttribute("transform", "translate(150, 220)");
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("r", "125"); c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#8b5cf6"); c1.setAttribute("stroke-width", "3");
  g1.appendChild(c1);
  svg.appendChild(g1);

  for (let i = 0; i < 23; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = 75 + col * 36;
    const y = 130 + row * 34;
    const size = Math.max(10, 18 - i * 0.4);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    drawChromosome(svg, x, y, size, color, `${i+1}`, true, 0);
  }

  // Daughter Cell 2 (Right: 23 chromosomes)
  const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g2.setAttribute("transform", "translate(450, 220)");
  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("r", "125"); c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#8b5cf6"); c2.setAttribute("stroke-width", "3");
  g2.appendChild(c2);
  svg.appendChild(g2);

  for (let i = 0; i < 23; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = 375 + col * 36;
    const y = 130 + row * 34;
    const size = Math.max(10, 18 - i * 0.4);
    const color = (i % 2 === 1) ? "#3b82f6" : "#ec4899";
    drawChromosome(svg, x, y, size, color, `${i+1}`, true, 0);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#a78bfa"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "1분열 완료: 딸세포 2개 각각 n = 23개 염색체 보유";
  svg.appendChild(title);
}

// 5. Metaphase II: 23 aligned single-file in each daughter cell
function renderMetaphase2All46(svg) {
  renderTelophase1All46(svg); // Base layout
}

// 6. Anaphase II: Sister chromatids separate (23 single chromatids moving left & right in each cell)
function renderAnaphase2All46(svg) {
  // Cell 1 Left
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("cx", "150"); c1.setAttribute("cy", "220"); c1.setAttribute("r", "130");
  c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#6366f1"); c1.setAttribute("stroke-width", "3");
  svg.appendChild(c1);

  for (let i = 0; i < 23; i++) {
    const y = 115 + i * 9.5;
    const size = Math.max(8, 15 - i * 0.3);
    drawChromosome(svg, 100, y, size, "#3b82f6", "", false, -30);
    drawChromosome(svg, 200, y, size, "#3b82f6", "", false, 30);
  }

  // Cell 2 Right
  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("cx", "450"); c2.setAttribute("cy", "220"); c2.setAttribute("r", "130");
  c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#6366f1"); c2.setAttribute("stroke-width", "3");
  svg.appendChild(c2);

  for (let i = 0; i < 23; i++) {
    const y = 115 + i * 9.5;
    const size = Math.max(8, 15 - i * 0.3);
    drawChromosome(svg, 400, y, size, "#ec4899", "", false, -30);
    drawChromosome(svg, 500, y, size, "#ec4899", "", false, 30);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#10b981"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 염색분체 분리 (각 세포 내 23개 염색체의 분체 분리)";
  svg.appendChild(title);
}

// 7. Telophase II: 4 Gamete cells, each containing exactly 23 single chromatid chromosomes
function renderTelophase2All46(svg) {
  const centers = [
    { x: 150, y: 130 }, { x: 450, y: 130 },
    { x: 150, y: 310 }, { x: 450, y: 310 }
  ];

  centers.forEach((c, cIdx) => {
    const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cell.setAttribute("cx", c.x); cell.setAttribute("cy", c.y); cell.setAttribute("r", "75");
    cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#10b981"); cell.setAttribute("stroke-width", "2.5");
    svg.appendChild(cell);

    for (let i = 0; i < 23; i++) {
      const row = Math.floor(i / 5);
      const col = i % 5;
      const x = (c.x - 42) + col * 20;
      const y = (c.y - 45) + row * 18;
      const size = Math.max(7, 13 - i * 0.3);
      const color = (i + cIdx) % 2 === 0 ? "#3b82f6" : "#ec4899";
      drawChromosome(svg, x, y, size, color, "", false, 0);
    }

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", c.x); txt.setAttribute("y", c.y + 65);
    txt.setAttribute("text-anchor", "middle"); txt.setAttribute("fill", "#6ee7b7"); txt.setAttribute("font-size", "11"); txt.setAttribute("font-weight", "bold");
    txt.textContent = `생식세포 ${cIdx + 1} (n = 23개)`;
    svg.appendChild(txt);
  });

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "25");
  title.setAttribute("text-anchor", "middle"); title.setAttribute("fill", "#6ee7b7"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "최종 완료: 각 세포당 정확히 23개의 단일 염색체를 가진 생식세포 4개";
  svg.appendChild(title);
}

// -------------------------------------------------------------
// QUIZ SYSTEM
// -------------------------------------------------------------
const quizQuestions = [
  {
    question: "1. 사람의 감수 제1분열 후기(Anaphase I)에 일어나며 염색체 수를 절반(2n=46 → n=23)으로 줄이는 결정적 현상은?",
    options: [
      "염색분체가 분리되어 이동한다.",
      "23쌍의 상동염색체가 분리되어 양 극으로 이동한다.",
      "DNA가 2배로 추가 복제된다.",
      "핵막이 새로 형성된다."
    ],
    answer: 1,
    explain: "제1분열 후기에는 23쌍의 상동염색체가 분리되므로 핵상이 2n=46에서 n=23으로 반감됩니다."
  },
  {
    question: "2. 감수분열 결과 완성된 정자나 난자(생식세포 1개)가 가진 염색체 수는 몇 개인가요?",
    options: ["46개", "23개", "92개", "2개"],
    answer: 1,
    explain: "감수분열을 모두 마치면 모세포(46개)의 절반인 n=23개의 염색체를 가진 생식세포가 생성됩니다."
  },
  {
    question: "3. 감수 제1분열 전기 I에 46개 염색체(부계23 + 모계23)가 짝을 맞춰 이루는 구조는 총 몇 개의 2가 염색체인가요?",
    options: ["46개", "23개", "92개", "4개"],
    answer: 1,
    explain: "상동염색체 2개씩 짝을 이루므로 사람에서는 총 23개의 2가 염색체가 형성됩니다."
  }
];

function openQuizModal() {
  const container = document.getElementById("quiz-content");
  container.innerHTML = quizQuestions.map((q, qIdx) => `
    <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
      <div class="text-xs font-bold text-slate-200">${q.question}</div>
      <div class="space-y-1.5">
        ${q.options.map((opt, oIdx) => `
          <button onclick="checkAnswer(${qIdx}, ${oIdx})" id="quiz-btn-${qIdx}-${oIdx}"
            class="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition">
            ${oIdx + 1}) ${opt}
          </button>
        `).join("")}
      </div>
      <div id="quiz-explain-${qIdx}" class="text-[11px] hidden p-2 rounded bg-slate-900 border text-slate-300 mt-2"></div>
    </div>
  `).join("");

  document.getElementById("quiz-modal").classList.remove("hidden");
}

function closeQuizModal() {
  document.getElementById("quiz-modal").classList.add("hidden");
}

function checkAnswer(qIdx, oIdx) {
  const q = quizQuestions[qIdx];
  const explainEl = document.getElementById(`quiz-explain-${qIdx}`);
  explainEl.classList.remove("hidden");

  if (oIdx === q.answer) {
    explainEl.className = "text-[11px] p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 mt-2";
    explainEl.innerHTML = ` 정답입니다! ${q.explain}`;
  } else {
    explainEl.className = "text-[11px] p-2 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 mt-2";
    explainEl.innerHTML = `❌ 오답입니다. (정답: ${q.answer + 1}번) ${q.explain}`;
  }
}
