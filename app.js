// 사람 46개 염색체 세포분열 (체세포분열 & 감수분열) 정밀 교육용 시뮬레이션 엔진

// -------------------------------------------------------------
// HELPER DRAW FUNCTIONS: X자 복제 염색체 vs I자 단일 염색체
// -------------------------------------------------------------

// X자 모양 복제 염색체 (자매 염색분체 2개 = 팔 4개)
function drawReplicatedChr(x, y, size, color, label = '', angle = 0) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

  const armW = Math.max(3.5, size * 0.22);
  const armH = size * 0.45;
  const strokeW = 2.2;

  // Left Sister Chromatid (Top-left & Bottom-left arm)
  const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p1.setAttribute("d", `M ${-armW} ${-armH} Q ${-armW*0.2} 0 ${-armW} ${armH}`);
  p1.setAttribute("fill", "none"); p1.setAttribute("stroke", color);
  p1.setAttribute("stroke-width", strokeW); p1.setAttribute("stroke-linecap", "round");

  // Right Sister Chromatid (Top-right & Bottom-right arm)
  const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p2.setAttribute("d", `M ${armW} ${-armH} Q ${armW*0.2} 0 ${armW} ${armH}`);
  p2.setAttribute("fill", "none"); p2.setAttribute("stroke", color);
  p2.setAttribute("stroke-width", strokeW); p2.setAttribute("stroke-linecap", "round");

  // Centromere Center Join
  const mid = document.createElementNS("http://www.w3.org/2000/svg", "line");
  mid.setAttribute("x1", `${-armW}`); mid.setAttribute("y1", "0");
  mid.setAttribute("x2", `${armW}`); mid.setAttribute("y2", "0");
  mid.setAttribute("stroke", color); mid.setAttribute("stroke-width", strokeW);

  // Centromere Dot
  const centro = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  centro.setAttribute("cx", "0"); centro.setAttribute("cy", "0");
  centro.setAttribute("r", Math.max(2.2, armW * 0.45)); centro.setAttribute("fill", "#f59e0b");

  g.appendChild(p1); g.appendChild(p2); g.appendChild(mid); g.appendChild(centro);

  if (label) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "0"); text.setAttribute("y", `${armH + 11}`);
    text.setAttribute("text-anchor", "middle"); text.setAttribute("fill", "#94a3b8");
    text.setAttribute("font-size", "8.5"); text.setAttribute("font-weight", "bold");
    text.textContent = label;
    g.appendChild(text);
  }

  return g;
}

// 2가 염색체 1쌍 (부계 X자 + 모계 X자 = 자매염색분체 4개 = 팔 8개)
function drawBivalentChr(x, y, size, label = '') {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y})`);

  const gap = Math.max(7.5, size * 0.33);
  const pat = drawReplicatedChr(-gap, 0, size, "#3b82f6", "", 0);
  const mat = drawReplicatedChr(gap, 0, size, "#ec4899", label, 0);

  // Synapsis Lines (접합선)
  const syn1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  syn1.setAttribute("x1", `${-gap*0.5}`); syn1.setAttribute("y1", `${-size*0.25}`);
  syn1.setAttribute("x2", `${gap*0.5}`); syn1.setAttribute("y2", `${-size*0.25}`);
  syn1.setAttribute("stroke", "#f59e0b"); syn1.setAttribute("stroke-width", "1"); syn1.setAttribute("stroke-dasharray", "2,2");

  const syn2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  syn2.setAttribute("x1", `${-gap*0.5}`); syn2.setAttribute("y1", `${size*0.25}`);
  syn2.setAttribute("x2", `${gap*0.5}`); syn2.setAttribute("y2", `${size*0.25}`);
  syn2.setAttribute("stroke", "#f59e0b"); syn2.setAttribute("stroke-width", "1"); syn2.setAttribute("stroke-dasharray", "2,2");

  g.appendChild(pat); g.appendChild(mat); g.appendChild(syn1); g.appendChild(syn2);
  return g;
}

// I자 모양 단일 염색체 (분리된 1개 염색분체)
function drawSingleChr(x, y, size, color, angle = 0, label = '') {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);

  const armW = Math.max(2.5, size * 0.18);
  const armH = size * 0.45;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M 0 ${-armH} Q ${armW} 0 0 ${armH}`);
  path.setAttribute("fill", "none"); path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "2.2"); path.setAttribute("stroke-linecap", "round");

  const centro = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  centro.setAttribute("cx", "0"); centro.setAttribute("cy", "0");
  centro.setAttribute("r", "2.0"); centro.setAttribute("fill", "#f59e0b");

  g.appendChild(path); g.appendChild(centro);

  if (label) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "0"); text.setAttribute("y", `${armH + 9}`);
    text.setAttribute("text-anchor", "middle"); text.setAttribute("fill", "#94a3b8");
    text.setAttribute("font-size", "8"); text.setAttribute("font-weight", "bold");
    text.textContent = label;
    g.appendChild(text);
  }

  return g;
}

// -------------------------------------------------------------
// DATA DEFINITIONS (MITOSIS vs MEIOSIS)
// -------------------------------------------------------------

const mitosisPhases = [
  {
    id: 0,
    title: "0. 간기 (S기 복제 완료 - 염색사 상태)",
    short: "간기 (염색사 복제)",
    badge: "염색사 46가닥 복제",
    ploidy: "2n = 46",
    chromosomes: "46개 (풀린 염색사)",
    chromatids: "92개 가닥",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong>[간기]</strong> 뚜렷한 핵막 내부에서 <strong>실처럼 풀어진 염색사 상태</strong>로 부계 23가닥 + 모계 23가닥 = 총 46개의 유전 물질이 2배로 복제되어 있습니다.",
    keypoints: [
      { title: "실처럼 풀어진 염색사", text: "전기/중기처럼 X자 모양 염색체가 나타나지 않고 핵막 속에 실타래 형태로 얽혀있습니다.", color: "blue" },
      { title: "DNA 2배 복제 (2 → 4)", text: "부계 23개, 모계 23개 총 46개 유전 물질이 각각 2배로 복제되었습니다.", color: "purple" }
    ],
    renderCanvas: (svg) => renderInterphaseAll(svg)
  },
  {
    id: 1,
    title: "1. 체세포분열 전기 (Prophase - X자 복제 염색체 응축)",
    short: "전기 (X자 46개 응축)",
    badge: "X자 복제 염색체 46개",
    ploidy: "2n = 46",
    chromosomes: "46개 (X자 복제)",
    chromatids: "92개 (분체 2개/개)",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong>[전기]</strong> 핵막이 소실되며 풀려있던 염색사가 <strong>자매 염색분체 2개(팔 4개)를 가진 X자 모양 복제 염색체 46개</strong>로 응축합니다.",
    keypoints: [
      { title: "★ X자 복제 염색체 46개", text: "염색체 1개당 자매 염색분체 2개(팔 4개)로 구성된 X자 염색체 46개(부계 23+모계 23)가 뚜렷이 나타납니다.", color: "emerald" },
      { title: "상동 접합 없음", text: "감수분열과 달리 체세포분열 전기에는 2가 염색체가 형성되지 않고 46개가 독립적으로 존재합니다.", color: "blue" }
    ],
    renderCanvas: (svg) => renderMitosisProphaseAll(svg)
  },
  {
    id: 2,
    title: "2. 체세포분열 중기 (Metaphase - X자 46개 1줄 배열)",
    short: "중기 (X자 46개 1줄 배열)",
    badge: "X자 46개 적도판 1줄",
    ploidy: "2n = 46",
    chromosomes: "46개",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong>[중기] X자 모양 복제 염색체 46개 전체가 적도판 중앙에 정확히 1줄로 나란히 배열</strong>됩니다.",
    keypoints: [
      { title: "★ 핵심: X자 46개 일렬 배열", text: "46개의 X자 복제 염색체 전체가 적도판 중앙에 1줄로 정렬합니다.", color: "amber" }
    ],
    renderCanvas: (svg) => renderMitosisMetaphaseAll(svg)
  },
  {
    id: 3,
    title: "3. 체세포분열 후기 (Anaphase - 자매 염색분체 분리)",
    short: "후기 (I자 46개 양극 이동)",
    badge: "염색분체 분리 (I자)",
    ploidy: "2n = 46 (분리 중)",
    chromosomes: "46개 I자 단일염색체",
    chromatids: "46개씩 양극으로",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong>[후기]</strong> 각 X자 염색체의 동원체가 갈라지면서 <strong>자매 염색분체가 분리되어 단일 염색체(I자 모양) 46개씩</strong> 양 극으로 이동합니다.",
    keypoints: [
      { title: "★ X자 → I자 단일 염색체 분리", text: "자매 염색분체가 분리되어 각 극으로 모세포와 동일한 I자 모양 염색체 46개가 끌려갑니다.", color: "emerald" }
    ],
    renderCanvas: (svg) => renderMitosisAnaphaseAll(svg)
  },
  {
    id: 4,
    title: "4. 체세포분열 말기 & 세포질 분열 (Telophase)",
    short: "말기 (2n=46 딸세포 2개)",
    badge: "2n=46 딸세포 2개",
    ploidy: "2n = 46 (각 세포)",
    chromosomes: "46개 / 세포",
    chromatids: "46개 (단일)",
    dna: "2",
    dnaPct: "50%",
    desc: "<strong>[말기]</strong> 세포질 분열이 끝나고 <strong>모세포(2n=46)와 100% 동일하게 46개의 단일 염색체(이후 염색사로 풀어짐)를 가진 딸세포 2개</strong>가 완성됩니다.",
    keypoints: [
      { title: "★ 딸세포 2개 완성 (2n=46)", text: "각 딸세포는 46개의 염색체를 보유하여 모세포와 유전 정보가 완전히 동일합니다.", color: "emerald" }
    ],
    renderCanvas: (svg) => renderMitosisTelophaseAll(svg)
  }
];

const meiosisPhases = [
  {
    id: 0,
    title: "0. 간기 (S기 복제 완료 - 염색사 상태)",
    short: "간기 (염색사 복제)",
    badge: "염색사 46가닥 복제",
    ploidy: "2n = 46",
    chromosomes: "46개 (풀린 염색사)",
    chromatids: "92개 가닥",
    dna: "4",
    dnaPct: "100%",
    desc: "감수분열 시작 전 간기에는 뚜렷한 핵막 내부에서 <strong>실처럼 풀어진 염색사 형태로 46개 유전 물질이 2배 복제</strong>되어 있습니다.",
    keypoints: [
      { title: "풀어진 염색사 상태", text: "핵막 내부에 실 모양으로 얽혀있는 복제 상태입니다.", color: "blue" }
    ],
    renderCanvas: (svg) => renderInterphaseAll(svg)
  },
  {
    id: 1,
    title: "1. 감수 제1분열 전기 (Prophase I - 2가 염색체 8가닥)",
    short: "전기 I (2가 23쌍)",
    badge: "2가 23쌍 (8가닥/쌍)",
    ploidy: "2n = 46 (2가 23쌍)",
    chromosomes: "46개 (23쌍 접합)",
    chromatids: "92개 (8가닥/쌍)",
    dna: "4",
    dnaPct: "100%",
    desc: "부계 X자 염색체(팔 4개)와 모계 X자 염색체(팔 4개)가 접합하여 <strong class='text-amber-400'>1쌍당 총 8가닥 팔을 가진 2가 염색체 23쌍</strong>을 형성합니다.",
    keypoints: [
      { title: "★ 2가 염색체 23쌍 (8가닥 선명한 표현)", text: "부계 4가닥 + 모계 4가닥 = 총 8가닥 선명한 접합 2가 염색체 23쌍입니다.", color: "amber" },
      { title: "유전자 교차", text: "부계/모계 염색분체 사이 교차가 일어납니다.", color: "purple" }
    ],
    renderCanvas: (svg) => renderMeiosisProphase1All(svg)
  },
  {
    id: 2,
    title: "2. 감수 제1분열 중기 (Metaphase I - 2가 염색체 2줄 배열)",
    short: "중기 I (적도판 23쌍 2줄)",
    badge: "적도판 23쌍 2줄 배열",
    ploidy: "2n = 46",
    chromosomes: "46개",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "23쌍의 2가 염색체가 적도판 중앙에 <strong>상하 2줄로 나란히 배열</strong>됩니다.",
    keypoints: [
      { title: "2가 염색체 2줄 배열", text: "체세포분열(1줄 배열)과 핵심 차이점입니다.", color: "blue" }
    ],
    renderCanvas: (svg) => renderMeiosisMetaphase1All(svg)
  },
  {
    id: 3,
    title: "3. 감수 제1분열 후기 (Anaphase I - 상동염색체 분리)",
    short: "후기 I (상동 23개 분리)",
    badge: "핵상 2n=46 → n=23 반감",
    ploidy: "2n → n (분리 중)",
    chromosomes: "46개 (23개씩 이동)",
    chromatids: "92개",
    dna: "4",
    dnaPct: "100%",
    desc: "<strong class='text-red-400 font-bold'>★ 핵심: 23쌍의 상동염색체(X자)가 양 극으로 갈라집니다!</strong> (왼쪽 X자 23개, 오른쪽 X자 23개)",
    keypoints: [
      { title: "★ 상동염색체 분리 (2n → n)", text: "염색분체는 붙어있는 X자 상태로 상동염색체가 분리되므로 염색체 수가 n=23으로 반감됩니다.", color: "rose" }
    ],
    renderCanvas: (svg) => renderMeiosisAnaphase1All(svg)
  },
  {
    id: 4,
    title: "4. 감수 제1분열 말기 (Telophase I)",
    short: "말기 I (n=23 X자 2개)",
    badge: "1분열 완료 (n=23 X자)",
    ploidy: "n = 23 (각 세포)",
    chromosomes: "23개 X자 / 세포",
    chromatids: "46개 / 세포",
    dna: "2",
    dnaPct: "50%",
    desc: "1분열 결과 각각 <strong class='text-purple-300'>n = 23개의 X자 복제 염색체</strong>를 가진 딸세포 2개가 완성됩니다.",
    keypoints: [
      { title: "n = 23 X자 염색체 딸세포 2개", text: "상동염색체 중 1개씩(X자 형태) 들어있습니다.", color: "purple" }
    ],
    renderCanvas: (svg) => renderMeiosisTelophase1All(svg)
  },
  {
    id: 5,
    title: "5. 감수 제2분열 전기 (Prophase II)",
    short: "전기 II (X자 n=23)",
    badge: "n=23 X자 응축",
    ploidy: "n = 23",
    chromosomes: "23개 / 세포",
    chromatids: "46개 / 세포",
    dna: "2",
    dnaPct: "50%",
    desc: "간기(복제) 없이 2개의 딸세포에서 n=23개의 X자 염색체가 응축됩니다.",
    keypoints: [
      { title: "복제 간기 없음", text: "DNA 추가 복제 없이 제2분열이 시작됩니다.", color: "blue" }
    ],
    renderCanvas: (svg) => renderMeiosisProphase2All(svg)
  },
  {
    id: 6,
    title: "6. 감수 제2분열 중기 (Metaphase II) [수정 완료]",
    short: "중기 II (각 n=23 1줄 정렬)",
    badge: "각 n=23개 X자 1줄 정렬",
    ploidy: "n = 23",
    chromosomes: "23개 / 세포",
    chromatids: "46개 / 세포",
    dna: "2",
    dnaPct: "50%",
    desc: "<strong>[수정 완료]</strong> 1분열 결과 생성된 2개의 딸세포(각 n=23) 내부에서 <strong>상동염색체 없이 n=23개의 X자 염색체가 적도판에 1줄로 나란히 정렬</strong>합니다.",
    keypoints: [
      { title: "★ 수정된 중기 II 모습", text: "2가 염색체가 없으며 각 세포 내 n=23개의 X자 염색체가 적도판에 1줄로 나란히 배열됩니다.", color: "emerald" }
    ],
    renderCanvas: (svg) => renderMeiosisMetaphase2All(svg)
  },
  {
    id: 7,
    title: "7. 감수 제2분열 후기 (Anaphase II)",
    short: "후기 II (I자 분체 분리)",
    badge: "염색분체 분리 (I자)",
    ploidy: "n = 23",
    chromosomes: "23개 I자 분체 이동",
    chromatids: "23개씩 양극으로",
    dna: "2 → 1",
    dnaPct: "25%",
    desc: "각 X자 염색체의 동원체가 split되어 <strong>자매 염색분체(I자 모양)가 23개씩 분리</strong>되어 양 극으로 이동합니다.",
    keypoints: [
      { title: "★ 염색분체 분리 (X자 → I자)", text: "염색체 수(n=23)는 일정하고 DNA 상대량만 2에서 1로 줄어듭니다.", color: "emerald" }
    ],
    renderCanvas: (svg) => renderMeiosisAnaphase2All(svg)
  },
  {
    id: 8,
    title: "8. 감수분열 완료 (생식세포 4개)",
    short: "완료 (n=23 I자 4개)",
    badge: "생식세포 4개 (n=23)",
    ploidy: "n = 23 (각 세포)",
    chromosomes: "23개 / 세포",
    chromatids: "23개 (단일)",
    dna: "1",
    dnaPct: "25%",
    desc: "최종적으로 <strong>n = 23개의 단일 염색체(I자 모양)를 지닌 4개의 생식세포(정자/난자)</strong>가 탄생합니다.",
    keypoints: [
      { title: "n = 23 생식세포 4개 완성", text: "수정 시 정자(23개) + 난자(23개) = 수정란(46개)으로 세대 간 염색체 수가 복원됩니다.", color: "emerald" }
    ],
    renderCanvas: (svg) => renderMeiosisTelophase2All(svg)
  }
];

// STATE MANAGEMENT
let activeTab = 'meiosis';
let currentPhaseIndex = 1;
let isPlaying = false;
let playTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupEventListeners();
  updateStageList();
  updateStageUI();
});

function setupTabs() {
  const btnMitosis = document.getElementById("tab-mitosis");
  const btnMeiosis = document.getElementById("tab-meiosis");

  btnMitosis.addEventListener("click", () => {
    if (activeTab !== 'mitosis') {
      activeTab = 'mitosis';
      currentPhaseIndex = 1;
      stopPlay();
      btnMitosis.className = "px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 tab-active";
      btnMeiosis.className = "px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-400 hover:text-white";
      document.getElementById("mode-indicator").innerText = "분열 방식: 체세포분열 (Mitosis)";
      updateStageList();
      updateStageUI();
    }
  });

  btnMeiosis.addEventListener("click", () => {
    if (activeTab !== 'meiosis') {
      activeTab = 'meiosis';
      currentPhaseIndex = 1;
      stopPlay();
      btnMeiosis.className = "px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 tab-active";
      btnMitosis.className = "px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-400 hover:text-white";
      document.getElementById("mode-indicator").innerText = "분열 방식: 감수분열 (Meiosis)";
      updateStageList();
      updateStageUI();
    }
  });
}

function getCurrentPhases() {
  return activeTab === 'mitosis' ? mitosisPhases : meiosisPhases;
}

function updateStageList() {
  const container = document.getElementById("phase-list-container");
  const phases = getCurrentPhases();
  container.innerHTML = phases.map((p, idx) => `
    <button onclick="selectPhase(${idx})" id="phase-btn-${idx}" 
      class="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 transition flex items-center justify-between text-xs group">
      <span class="font-medium text-slate-300 group-hover:text-white">${p.short}</span>
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
    const phases = getCurrentPhases();
    if (currentPhaseIndex < phases.length - 1) {
      currentPhaseIndex++;
      updateStageUI();
    }
  });

  document.getElementById("play-pause-btn").addEventListener("click", togglePlay);
}

function selectPhase(idx) {
  stopPlay();
  currentPhaseIndex = idx;
  updateStageUI();
}

function togglePlay() {
  const phases = getCurrentPhases();
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
    }, 3400);
  }
}

function stopPlay() {
  isPlaying = false;
  if (playTimer) clearInterval(playTimer);
  document.getElementById("play-text").innerText = "자동 재생";
  document.getElementById("play-pause-btn").classList.replace("bg-amber-600", "bg-indigo-600");
}

function updateStageUI() {
  const phases = getCurrentPhases();
  const p = phases[currentPhaseIndex];

  document.getElementById("stage-badge").innerText = `STEP ${currentPhaseIndex + 1}/${phases.length}`;
  document.getElementById("tracker-ploidy").innerText = p.ploidy;
  document.getElementById("tracker-chromosomes").innerText = p.chromosomes;
  document.getElementById("tracker-chromatids").innerText = p.chromatids;
  document.getElementById("tracker-dna").innerText = p.dna;
  document.getElementById("tracker-dna-bar").style.width = p.dnaPct;

  document.getElementById("stage-title-text").innerHTML = `${p.title} <span class="text-xs ml-2 px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">${p.badge}</span>`;
  document.getElementById("stage-desc-text").innerHTML = p.desc;

  const svgCanvas = document.getElementById("canvas-svg");
  svgCanvas.innerHTML = '';
  p.renderCanvas(svgCanvas);

  const keyContainer = document.getElementById("dynamic-keypoint-container");
  document.getElementById("keypoint-header").innerText = `${p.short} 핵심 정리`;
  keyContainer.innerHTML = p.keypoints.map(k => `
    <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
      <strong class="text-${k.color}-400 font-semibold flex items-center gap-1.5 text-xs">
        <i class="fa-solid fa-circle-check text-[10px]"></i> ${k.title}
      </strong>
      <p class="text-slate-300 text-xs leading-relaxed">${k.text}</p>
    </div>
  `).join("");

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
// STAGE RENDERERS
// -------------------------------------------------------------

function renderInterphaseAll(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("r", "180");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#475569"); cell.setAttribute("stroke-width", "4"); cell.setAttribute("stroke-dasharray", "6,6");
  svg.appendChild(cell);

  const nuc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  nuc.setAttribute("cx", "300"); nuc.setAttribute("cy", "225"); nuc.setAttribute("r", "140");
  nuc.setAttribute("fill", "#020617"); nuc.setAttribute("stroke", "#64748b"); nuc.setAttribute("stroke-width", "2.5");
  svg.appendChild(nuc);

  for (let i = 0; i < 23; i++) {
    const aP = (i / 23) * Math.PI * 2;
    const r1 = 30 + (i % 4) * 22;
    const x1 = 300 + Math.cos(aP) * r1;
    const y1 = 225 + Math.sin(aP) * r1;
    const x2 = x1 + Math.cos(aP + 1.2) * 45;
    const y2 = y1 + Math.sin(aP + 1.2) * 45;

    const pathP = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathP.setAttribute("d", `M ${x1} ${y1} Q ${x1+20} ${y1-20} ${x2} ${y2}`);
    pathP.setAttribute("fill", "none"); pathP.setAttribute("stroke", "#3b82f6");
    pathP.setAttribute("stroke-width", "1.6"); pathP.setAttribute("opacity", "0.85");
    svg.appendChild(pathP);

    const aM = ((i + 0.5) / 23) * Math.PI * 2;
    const r2 = 35 + (i % 3) * 26;
    const mx1 = 300 + Math.cos(aM) * r2;
    const my1 = 225 + Math.sin(aM) * r2;
    const mx2 = mx1 + Math.cos(aM - 1.2) * 45;
    const my2 = my1 + Math.sin(aM - 1.2) * 45;

    const pathM = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathM.setAttribute("d", `M ${mx1} ${my1} Q ${mx1-20} ${my1+20} ${mx2} ${my2}`);
    pathM.setAttribute("fill", "none"); pathM.setAttribute("stroke", "#ec4899");
    pathM.setAttribute("stroke-width", "1.6"); pathM.setAttribute("opacity", "0.85");
    svg.appendChild(pathM);
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "55"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#60a5fa"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "간기: 실처럼 풀린 염색사 상태 (부계 23가닥 + 모계 23가닥 DNA 복제 완료)";
  svg.appendChild(title);
}

function renderMitosisProphaseAll(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("r", "190");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#10b981"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  for (let i = 0; i < 23; i++) {
    const row = Math.floor(i / 6), col = i % 6;
    const xP = 110 + col * 72, yP = 85 + row * 75;
    const xM = xP + 28, yM = yP + 10;
    const sz = Math.max(12, 24 - i * 0.4);

    svg.appendChild(drawReplicatedChr(xP, yP, sz, "#3b82f6", `${i+1}번(부)`, (i*15)%360));
    svg.appendChild(drawReplicatedChr(xM, yM, sz, "#ec4899", `${i+1}번(모)`, (i*25)%360));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#10b981"); title.setAttribute("font-size", "13"); title.setAttribute("font-weight", "bold");
  title.textContent = "체세포분열 전기: X자 복제 염색체 46개(팔 4개/개) 독립 응축!";
  svg.appendChild(title);
}

function renderMitosisMetaphaseAll(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("r", "190");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#10b981"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  const eq = document.createElementNS("http://www.w3.org/2000/svg", "line");
  eq.setAttribute("x1", "300"); eq.setAttribute("y1", "40"); eq.setAttribute("x2", "300"); eq.setAttribute("y2", "410");
  eq.setAttribute("stroke", "#334155"); eq.setAttribute("stroke-width", "2"); eq.setAttribute("stroke-dasharray", "4,4");
  svg.appendChild(eq);

  for (let i = 0; i < 46; i++) {
    const y = 50 + i * 7.8;
    const sz = Math.max(9, 16 - (i % 23) * 0.3);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawReplicatedChr(300, y, sz, color, "", 90));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#f59e0b"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 체세포분열 중기: X자 복제 염색체 46개 전체 적도판 1줄 나란히 정렬!";
  svg.appendChild(title);
}

function renderMitosisAnaphaseAll(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("rx", "210"); cell.setAttribute("ry", "180");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#10b981"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  for (let i = 0; i < 46; i++) {
    const y = 50 + i * 7.8;
    const sz = Math.max(8, 15 - (i % 23) * 0.3);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawSingleChr(180, y, sz, color, -30));
    svg.appendChild(drawSingleChr(420, y, sz, color, 30));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#10b981"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 체세포분열 후기: X자 분리 → I자 단일 염색체 46개씩 양 극 이동";
  svg.appendChild(title);
}

function renderMitosisTelophaseAll(svg) {
  const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g1.setAttribute("transform", "translate(150, 225)");
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("r", "130"); c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#10b981"); c1.setAttribute("stroke-width", "3");
  g1.appendChild(c1); svg.appendChild(g1);

  for (let i = 0; i < 46; i++) {
    const r = Math.floor(i / 7), c = i % 7;
    const x = 50 + c * 28, y = 130 + r * 26;
    const sz = Math.max(8, 14 - (i % 23) * 0.2);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawSingleChr(x, y, sz, color, 0));
  }

  const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g2.setAttribute("transform", "translate(450, 225)");
  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("r", "130"); c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#10b981"); c2.setAttribute("stroke-width", "3");
  g2.appendChild(c2); svg.appendChild(g2);

  for (let i = 0; i < 46; i++) {
    const r = Math.floor(i / 7), c = i % 7;
    const x = 350 + c * 28, y = 130 + r * 26;
    const sz = Math.max(8, 14 - (i % 23) * 0.2);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawSingleChr(x, y, sz, color, 0));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#6ee7b7"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "체세포분열 완료: I자 단일 염색체 46개씩 딸세포 2개 완성! (이후 염색사로 풀림)";
  svg.appendChild(title);
}

function renderMeiosisProphase1All(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("r", "195");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  for (let i = 0; i < 23; i++) {
    const row = Math.floor(i / 6), col = i % 6;
    const cx = 130 + col * 68, cy = 90 + row * 65;
    const sz = Math.max(12, 26 - i * 0.5);
    const lbl = i === 22 ? '23(XY)' : `${i+1}번`;
    svg.appendChild(drawBivalentChr(cx, cy, sz, lbl));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "35"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#f59e0b"); title.setAttribute("font-size", "13"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 감수 1분열 전기: 2가 염색체 23쌍 (부계 4가닥 + 모계 4가닥 = 1쌍당 총 8가닥 선명한 표현!)";
  svg.appendChild(title);
}

function renderMeiosisMetaphase1All(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("r", "195");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  const eq = document.createElementNS("http://www.w3.org/2000/svg", "line");
  eq.setAttribute("x1", "300"); eq.setAttribute("y1", "40"); eq.setAttribute("x2", "300"); eq.setAttribute("y2", "410");
  eq.setAttribute("stroke", "#334155"); eq.setAttribute("stroke-width", "2"); eq.setAttribute("stroke-dasharray", "4,4");
  svg.appendChild(eq);

  for (let i = 0; i < 23; i++) {
    const y = 60 + i * 15;
    const sz = Math.max(9, 20 - i * 0.4);
    const isSwap = (i % 2 === 1);
    svg.appendChild(drawReplicatedChr(275, y, sz, isSwap ? "#ec4899" : "#3b82f6", "", 90));
    svg.appendChild(drawReplicatedChr(325, y, sz, isSwap ? "#3b82f6" : "#ec4899", "", 90));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#60a5fa"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "감수 1분열 중기: 2가 염색체 23쌍 적도판 2줄 나란히 배열";
  svg.appendChild(title);
}

function renderMeiosisAnaphase1All(svg) {
  const cell = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  cell.setAttribute("cx", "300"); cell.setAttribute("cy", "225"); cell.setAttribute("rx", "210"); cell.setAttribute("ry", "180");
  cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#3b82f6"); cell.setAttribute("stroke-width", "3.5");
  svg.appendChild(cell);

  for (let i = 0; i < 23; i++) {
    const y = 65 + i * 14;
    const sz = Math.max(9, 19 - i * 0.4);
    const isSwap = (i % 2 === 1);
    svg.appendChild(drawReplicatedChr(190, y, sz, isSwap ? "#ec4899" : "#3b82f6", "", 75));
    svg.appendChild(drawReplicatedChr(410, y, sz, isSwap ? "#3b82f6" : "#ec4899", "", 105));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#ef4444"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 감수 1분열 후기: X자 상동염색체 23개씩 양극 분리 (2n → n 핵상 반감!)";
  svg.appendChild(title);
}

function renderMeiosisTelophase1All(svg) {
  const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g1.setAttribute("transform", "translate(150, 225)");
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("r", "130"); c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#8b5cf6"); c1.setAttribute("stroke-width", "3");
  g1.appendChild(c1); svg.appendChild(g1);

  for (let i = 0; i < 23; i++) {
    const r = Math.floor(i / 5), c = i % 5;
    const x = 70 + c * 38, y = 135 + r * 35;
    svg.appendChild(drawReplicatedChr(x, y, Math.max(9, 17 - i * 0.4), i % 2 === 0 ? "#3b82f6" : "#ec4899", `${i+1}`, 0));
  }

  const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g2.setAttribute("transform", "translate(450, 225)");
  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("r", "130"); c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#8b5cf6"); c2.setAttribute("stroke-width", "3");
  g2.appendChild(c2); svg.appendChild(g2);

  for (let i = 0; i < 23; i++) {
    const r = Math.floor(i / 5), c = i % 5;
    const x = 370 + c * 38, y = 135 + r * 35;
    svg.appendChild(drawReplicatedChr(x, y, Math.max(9, 17 - i * 0.4), i % 2 === 1 ? "#3b82f6" : "#ec4899", `${i+1}`, 0));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#a78bfa"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "감수 1분열 말기: 각각 n = 23개 X자 염색체를 보유한 딸세포 2개 완성";
  svg.appendChild(title);
}

function renderMeiosisProphase2All(svg) {
  renderMeiosisTelophase1All(svg);
}

function renderMeiosisMetaphase2All(svg) {
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("cx", "150"); c1.setAttribute("cy", "225"); c1.setAttribute("r", "130");
  c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#6366f1"); c1.setAttribute("stroke-width", "3");
  svg.appendChild(c1);

  const eq1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  eq1.setAttribute("x1", "150"); eq1.setAttribute("y1", "100"); eq1.setAttribute("x2", "150"); eq1.setAttribute("y2", "350");
  eq1.setAttribute("stroke", "#334155"); eq1.setAttribute("stroke-width", "1.5"); eq1.setAttribute("stroke-dasharray", "3,3");
  svg.appendChild(eq1);

  for (let i = 0; i < 23; i++) {
    const y = 110 + i * 10;
    const sz = Math.max(8, 15 - i * 0.3);
    const color = (i % 2 === 0) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawReplicatedChr(150, y, sz, color, "", 90));
  }

  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("cx", "450"); c2.setAttribute("cy", "225"); c2.setAttribute("r", "130");
  c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#6366f1"); c2.setAttribute("stroke-width", "3");
  svg.appendChild(c2);

  const eq2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  eq2.setAttribute("x1", "450"); eq2.setAttribute("y1", "100"); eq2.setAttribute("x2", "450"); eq2.setAttribute("y2", "350");
  eq2.setAttribute("stroke", "#334155"); eq2.setAttribute("stroke-width", "1.5"); eq2.setAttribute("stroke-dasharray", "3,3");
  svg.appendChild(eq2);

  for (let i = 0; i < 23; i++) {
    const y = 110 + i * 10;
    const sz = Math.max(8, 15 - i * 0.3);
    const color = (i % 2 === 1) ? "#3b82f6" : "#ec4899";
    svg.appendChild(drawReplicatedChr(450, y, sz, color, "", 90));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#818cf8"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "[수정 완료] 감수 2분열 중기: 2개 딸세포에서 각각 n=23개 X자 염색체가 적도판 1줄 배열!";
  svg.appendChild(title);
}

function renderMeiosisAnaphase2All(svg) {
  const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c1.setAttribute("cx", "150"); c1.setAttribute("cy", "225"); c1.setAttribute("r", "135");
  c1.setAttribute("fill", "#0f172a"); c1.setAttribute("stroke", "#6366f1"); c1.setAttribute("stroke-width", "3");
  svg.appendChild(c1);

  for (let i = 0; i < 23; i++) {
    const y = 115 + i * 9.5;
    const sz = Math.max(8, 14 - i * 0.3);
    svg.appendChild(drawSingleChr(100, y, sz, "#3b82f6", -30));
    svg.appendChild(drawSingleChr(200, y, sz, "#3b82f6", 30));
  }

  const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c2.setAttribute("cx", "450"); c2.setAttribute("cy", "225"); c2.setAttribute("r", "135");
  c2.setAttribute("fill", "#0f172a"); c2.setAttribute("stroke", "#6366f1"); c2.setAttribute("stroke-width", "3");
  svg.appendChild(c2);

  for (let i = 0; i < 23; i++) {
    const y = 115 + i * 9.5;
    const sz = Math.max(8, 14 - i * 0.3);
    svg.appendChild(drawSingleChr(400, y, sz, "#ec4899", -30));
    svg.appendChild(drawSingleChr(500, y, sz, "#ec4899", 30));
  }

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "30"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#10b981"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "★ 감수 2분열 후기: X자 분리 → I자 단일 염색체 23개씩 양극 이동";
  svg.appendChild(title);
}

function renderMeiosisTelophase2All(svg) {
  const pts = [{ x: 150, y: 135 }, { x: 450, y: 135 }, { x: 150, y: 315 }, { x: 450, y: 315 }];
  pts.forEach((c, idx) => {
    const cell = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cell.setAttribute("cx", c.x); cell.setAttribute("cy", c.y); cell.setAttribute("r", "75");
    cell.setAttribute("fill", "#0f172a"); cell.setAttribute("stroke", "#10b981"); cell.setAttribute("stroke-width", "2.5");
    svg.appendChild(cell);

    for (let i = 0; i < 23; i++) {
      const r = Math.floor(i / 5), col = i % 5;
      const x = (c.x - 42) + col * 20, y = (c.y - 45) + r * 18;
      const sz = Math.max(7, 13 - i * 0.3);
      const color = (i + idx) % 2 === 0 ? "#3b82f6" : "#ec4899";
      svg.appendChild(drawSingleChr(x, y, sz, color, 0));
    }

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", c.x); txt.setAttribute("y", c.y + 65); txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", "#6ee7b7"); txt.setAttribute("font-size", "11"); txt.setAttribute("font-weight", "bold");
    txt.textContent = `생식세포 ${idx + 1} (n=23개)`;
    svg.appendChild(txt);
  });

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", "300"); title.setAttribute("y", "25"); title.setAttribute("text-anchor", "middle");
  title.setAttribute("fill", "#6ee7b7"); title.setAttribute("font-size", "14"); title.setAttribute("font-weight", "bold");
  title.textContent = "감수분열 완료: I자 단일 염색체 n = 23개를 가진 생식세포 4개 완성!";
  svg.appendChild(title);
}
