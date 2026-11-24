const KEY = 'ai500-academy-v1';

const defaultState = () => ({
  done: {},
  checks: {},
  notes: {},
  quiz: {},
  lessonQuizAnswers: {},
  mistakes: {},
  bookmarks: {},
  history: [],
  studyMinutes: 0,
  dailyGoal: 90,
  exam: [],
  cert103: false,
  cert500: false,
  theme: 'light',
  start: new Date().toISOString().slice(0, 10)
});

let state = load();
let page = 'home';
let selected = LESSONS.find(x => !state.done[x.id])?.id || LESSONS[0].id;
let filter = '';
let stageFilter = 'all';
let bookmarkedOnly = false;
let lessonQuizGraded = {};

// Pomodoro timer state
let timer = null;
let timerSeconds = 25 * 60;
let timerOn = false;

// Mock Exam & Walkthrough state
let examView = 'hub'; // 'hub' | 'session' | 'review'
let examCertFilter = 'all'; // 'all' | 'AI-103' | 'AI-500' | 'mistakes' | 'history'
let activeExam = null;
let examRunMode = 'timed'; // 'timed' | 'practice'
let examSingleMode = false; // false = scroll all, true = 1 question per screen
let examCurrentIdx = 0;
let examAnswers = {};
let examFlags = {};
let examRevealed = {};
let examTimer = null;
let examSecondsLeft = 0;
let examStartedAt = 0;
let examElapsedSeconds = 0;
let reviewFilter = 'all'; // 'all' | 'wrong' | 'flagged' | 'correct'
let reviewDomain = 'all';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      ...defaultState(),
      ...raw,
      done: raw.done || {},
      checks: raw.checks || {},
      notes: raw.notes || {},
      quiz: raw.quiz || {},
      lessonQuizAnswers: raw.lessonQuizAnswers || {},
      mistakes: raw.mistakes || {},
      bookmarks: raw.bookmarks || {},
      history: Array.isArray(raw.history) ? raw.history : [],
      exam: Array.isArray(raw.exam) ? raw.exam : []
    };
  } catch (e) {
    return defaultState();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Không thể lưu localStorage:', e);
  }
}

function esc(x) {
  return String(x ?? '').replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[s]));
}

function richText(x) {
  return esc(x).replace(
    /`([^`]+)`/g,
    '<code style="background:#edf3fc;color:#194494;padding:1.5px 6px;border-radius:5px;font-family:Consolas,monospace;font-size:0.91em">$1</code>'
  );
}

function fmtBullet(x) {
  const s = String(x ?? '');
  const idx = s.indexOf(':');
  if (idx > 0 && idx < 68) {
    return `<b>${richText(s.slice(0, idx + 1))}</b>${richText(s.slice(idx + 1))}`;
  }
  return richText(s);
}

function pct(a, b) {
  return b ? Math.round((100 * a) / b) : 0;
}

function scaledScore(correct, total) {
  if (!total) return 100;
  return Math.round(100 + 900 * (correct / total));
}

function completed() {
  return LESSONS.filter(x => state.done[x.id]).length;
}

function moduleDone(m) {
  return LESSONS.filter(x => x.module === m.id && state.done[x.id]).length;
}

function current() {
  return LESSONS.find(l => l.id === selected) || LESSONS[0];
}

function eachStage(s) {
  return LESSONS.filter(l => l.stage === s);
}

function dateKey(d) {
  return d.toLocaleDateString('en-CA');
}

function record(type, lesson) {
  state.history.push({ type, lesson: lesson || '', at: new Date().toISOString() });
  save();
}

function studiedDays() {
  return new Set(state.history.map(h => h.at.slice(0, 10))).size;
}

function streak() {
  const set = new Set(state.history.map(h => h.at.slice(0, 10)));
  const d = new Date();
  let count = 0;
  if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1);
  while (set.has(dateKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function progress(p, colorClass = '') {
  return `<div class="progress ${colorClass}"><b style="width:${Math.max(0, Math.min(100, p))}%"></b></div>`;
}

function notice(x, type = 'info') {
  const cls = type === true || type === 'warning' ? 'warning' : type === 'success' ? 'success' : '';
  return `<div class="notice ${cls}">${x}</div>`;
}

function link(label, url) {
  return `<a class="link" target="_blank" rel="noopener noreferrer" href="${esc(url)}">${esc(label)} ↗</a>`;
}

function icon(s) {
  return ({
    home: '▦',
    curriculum: '▤',
    today: '◷',
    quiz: '✦',
    calendar: '▦',
    project: '◈',
    settings: '⚙'
  })[s] || '◉';
}

function timeFmt(s) {
  const sec = Math.max(0, Math.floor(s));
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

function getAllExamSets() {
  const customSets = Array.isArray(window.EXAM_SETS) ? window.EXAM_SETS : [];
  // Build 2 quick foundational warmup sets from QUESTIONS in data.js so all question banks remain accessible
  const mapLegacyQuestion = (q, idx, prefix) => {
    const mod = q[4];
    const modLesson = LESSONS.find(l => l.module === mod) || LESSONS[0];
    const modObj = MODULES.find(m => m.id === mod);
    return {
      id: `${prefix}-${String(idx + 1).padStart(2, '0')}`,
      domain: modObj ? `${modObj.id}. ${modObj.title}` : 'Kiến thức cốt lõi',
      lessonId: modLesson.id,
      difficulty: 'Cơ bản',
      caseStudy: null,
      question: q[0],
      options: q[1],
      answer: q[2],
      walkthrough: {
        keyword: q[0],
        whyCorrect: q[3],
        whyWrong: q[1].map((opt, oi) =>
          oi === q[2]
            ? ''
            : `Phương án "${opt}" không đáp ứng nguyên tắc an toàn, độ tin cậy hoặc kiến trúc chuẩn của Microsoft cho tình huống này.`
        ),
        tip: `Ôn kỹ Học phần ${modObj ? modObj.title : mod} để nắm chắc nguyên lý gốc.`
      }
    };
  };

  const q103 = QUESTIONS.filter(q => ['P', 'A', 'B', 'C'].includes(q[4]));
  const q500 = QUESTIONS.filter(q => ['D', 'E', 'F', 'G', 'H', 'I'].includes(q[4]));

  const warmupSets = [
    {
      id: 'ai103-warmup',
      cert: 'AI-103',
      title: 'Đề Khởi Động AI-103 — Rà soát Khái niệm Cốt lõi',
      subtitle: `${q103.length} câu hỏi nhanh kiểm tra phản xạ nền tảng Python, Azure, Foundry, RAG & Vision/Speech`,
      durationMinutes: 20,
      passingScore: 700,
      isWarmup: true,
      questions: q103.map((q, i) => mapLegacyQuestion(q, i, 'w103'))
    },
    {
      id: 'ai500-warmup',
      cert: 'AI-500',
      title: 'Đề Khởi Động AI-500 — Rà soát Khái niệm Multi-Agent',
      subtitle: `${q500.length} câu hỏi nhanh kiểm tra phản xạ Orchestration, MCP/A2A, RAG nâng cao, Eval & Zero Trust`,
      durationMinutes: 25,
      passingScore: 700,
      isWarmup: true,
      questions: q500.map((q, i) => mapLegacyQuestion(q, i, 'w500'))
    }
  ];

  return [...customSets, ...warmupSets];
}

function findQuestionById(qid) {
  for (const s of getAllExamSets()) {
    const found = s.questions.find(q => q.id === qid);
    if (found) return { question: found, exam: s };
  }
  return null;
}

function getMistakeQuestions() {
  const list = [];
  for (const qid of Object.keys(state.mistakes || {})) {
    const found = findQuestionById(qid);
    if (found) list.push({ ...found.question, _meta: state.mistakes[qid], _examTitle: found.exam.title });
  }
  return list;
}

function getLessonQuestions(l) {
  const d = window.LESSON_DETAILS && window.LESSON_DETAILS[l.id];
  if (d && Array.isArray(d.lessonQuestions) && d.lessonQuestions.length) {
    return d.lessonQuestions;
  }
  const q = QUESTIONS.filter(x => x[4] === l.module);
  const picked = q[l.index % q.length] || QUESTIONS[0];
  return [
    {
      question: picked[0],
      options: picked[1],
      answer: picked[2],
      explanation: picked[3],
      wrongReasons: picked[1].map((_, i) => (i === picked[2] ? '' : 'Chưa phù hợp với thực tiễn thiết kế chuẩn trên Azure.'))
    }
  ];
}

function shell(inner) {
  const mistakeCount = getMistakeQuestions().length;
  document.getElementById('root').innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="logo"><span>AI</span>CertPath</div>
        <div class="sub">AI-103 → AI-500 EXPERT<br>Bài giảng chi tiết · Thi thử & Chữa đề</div>
        <nav class="nav">
          ${[
            ['home', 'Tổng quan', ''],
            ['curriculum', 'Giáo trình 60 bài', ''],
            ['quiz', 'Thi thử & Chữa đề', mistakeCount ? `<span class="nav-badge" title="Câu sai cần ôn">${mistakeCount}</span>` : ''],
            ['today', 'Nhiệm vụ hôm nay', ''],
            ['calendar', 'Lịch học tập', ''],
            ['project', 'Dự án Capstone', ''],
            ['settings', 'Cài đặt & dữ liệu', '']
          ]
            .map(
              ([k, v, badge]) =>
                `<button class="${page === k || (page === 'lesson' && k === 'curriculum') ? 'active' : ''}" data-page="${k}">${icon(k)} &nbsp;${v}${badge}</button>`
            )
            .join('')}
        </nav>
        <div class="side-foot">
          Dữ liệu lưu hoàn toàn offline trên trình duyệt máy này.<br><br>
          Tài liệu giảng dạy độc lập, đối chiếu đề cương Microsoft Learn.
        </div>
      </aside>
      <main class="main">
        ${inner}
        <div class="footer">
          AI CertPath · Giáo trình 60 bài chuyên sâu & Phòng thi thử chữa đề chi tiết (tham chiếu Microsoft Learn AI-103 & AI-500). Chứng chỉ chính thức chỉ do Microsoft cấp.
        </div>
      </main>
    </div>`;
}

function heading(tag, title, extra = '') {
  return `<div class="top"><div><div class="eyebrow">${tag}</div><h1>${title}</h1></div><div class="actions">${extra}</div></div>`;
}

function stopTimers() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    timerOn = false;
  }
  if (examTimer && page !== 'quiz') {
    clearInterval(examTimer);
    examTimer = null;
  }
}

function go(p) {
  if (page === 'quiz' && examView === 'session' && p !== 'quiz') {
    if (!confirm('Em đang trong phòng làm bài thi thử. Rời trang sẽ kết thúc lượt làm hiện tại. Tiếp tục rời đi?')) return;
    if (examTimer) {
      clearInterval(examTimer);
      examTimer = null;
    }
    examView = 'hub';
  }
  page = p;
  render();
  window.scrollTo(0, 0);
}

function openLesson(id) {
  if (page === 'quiz' && examView === 'session') {
    if (examTimer) {
      clearInterval(examTimer);
      examTimer = null;
    }
    examView = 'hub';
  }
  selected = id;
  page = 'lesson';
  render();
  window.scrollTo(0, 0);
}

function nextLesson() {
  return LESSONS.find(l => !state.done[l.id]) || LESSONS[LESSONS.length - 1];
}

function home() {
  const c = completed();
  const l = nextLesson();
  const ld = window.LESSON_DETAILS && window.LESSON_DETAILS[l.id];
  const examSets = getAllExamSets();
  const totalMockQuestions = examSets.reduce((s, e) => s + e.questions.length, 0);
  const bestScore = state.exam.length ? Math.max(...state.exam.map(e => e.score1000 || scaledScore(e.percent, 100))) : null;

  return `
    ${heading('Chứng chỉ Microsoft · Học cùng Thầy hướng dẫn', 'Chinh phục AI-103 & AI-500', `<span class="pill">👨‍🏫 60 Bài giảng chi tiết · ${examSets.length} Đề thi thử có chữa đề</span>`)}
    <div class="hero">
      <div>
        <div class="eyebrow">LỘ TRÌNH TỪ ASSOCIATE LÊN EXPERT</div>
        <h1>Học hiểu bản chất.<br>Thi đỗ thực lực.</h1>
        <p>Mỗi bài học được biên soạn như một buổi đứng lớp trực tiếp: có ví dụ đời thường dễ hiểu, sơ đồ tư duy, bảng so sánh quyết định, code Python thực chiến, bài Lab cầm tay chỉ việc và phòng thi thử chấm chữa chi tiết từng đáp án.</p>
        <div class="actions">
          <button class="btn" data-lesson="${l.id}">▶ ${c ? 'Học tiếp bài ' + l.id : 'Bắt đầu Bài 1 ngay'}</button>
          <button class="btn alt" data-page="quiz">✦ Vào Phòng Thi Thử & Chữa Đề</button>
          <button class="btn alt" data-page="curriculum">Xem 60 bài giảng</button>
        </div>
      </div>
      <div class="hero-stat">
        <div>Tiến độ toàn khóa học</div>
        <div><strong>${pct(c, LESSONS.length)}%</strong> <small style="color:#d3e6ff">· ${c}/${LESSONS.length} bài hoàn thành</small></div>
        ${progress(pct(c, LESSONS.length))}
        <p style="font-size:12.5px;margin-bottom:0">Mục tiêu mỗi ngày: ${state.dailyGoal} phút · ${totalMockQuestions}+ câu hỏi luyện thi có giải thích</p>
      </div>
    </div>

    <div class="metrics">
      <div class="card">
        <div class="metric-label">Bài giảng hoàn thành</div>
        <div class="metric-num">${c}<small> / 60</small></div>
        ${progress(pct(c, 60))}
      </div>
      <div class="card">
        <div class="metric-label">Điểm thi thử cao nhất</div>
        <div class="metric-num">${bestScore !== null ? bestScore : '—'}<small>${bestScore !== null ? ' / 1000' : ''}</small></div>
        <small>${state.exam.length ? `${state.exam.length} lượt thi · Chuẩn đỗ ≥ 700` : 'Chưa làm đề thi thử'}</small>
      </div>
      <div class="card">
        <div class="metric-label">Chuỗi ngày học liên tục</div>
        <div class="metric-num">${streak()} <small>ngày</small></div>
        <small>Tổng ${studiedDays()} ngày có hoạt động</small>
      </div>
      <div class="card">
        <div class="metric-label">Giờ học tập trung</div>
        <div class="metric-num">${Math.round((state.studyMinutes / 60) * 10) / 10} <small>giờ</small></div>
        <small>Qua đồng hồ Pomodoro</small>
      </div>
    </div>

    <div class="two">
      <section class="card">
        <div class="row">
          <h2>Bài học tiếp theo dành cho em</h2>
          <span class="tag orange">Ưu tiên hôm nay</span>
        </div>
        <h3 style="font-size:18px;margin-top:8px">${esc(l.id)} — ${esc(l.title)}</h3>
        <p class="muted">${esc(ld?.teacherIntro ? ld.teacherIntro.slice(0, 190) + '…' : l.lab)}</p>
        <div class="actions">
          <span class="tag">${esc(l.stage)}</span>
          <span class="tag gray">Bài ${l.global + 1}/60 · ${esc(ld?.duration || '45 phút')}</span>
          <button class="btn" data-lesson="${l.id}">Vào lớp học bài này →</button>
        </div>
        <hr class="divider">
        <h3>Lộ trình chinh phục chứng chỉ kép Microsoft</h3>
        <p>
          ✓ <b>Bước 1 — Đạt AI-103 Associate:</b> Nắm vững Foundry, RAG, Azure AI Search, Vision, Language/Speech & Document Intelligence.<br>
          ✓ <b>Bước 2 — Đạt AI-500 Expert:</b> Làm chủ kiến trúc Multi-Agent, Orchestration (Agent Framework / LangGraph), MCP/A2A, Evaluation & Zero Trust Security.
        </p>
        <div class="kpi">
          <span>Nền tảng Python: ${pct(eachStage('Nền tảng').filter(x => state.done[x.id]).length, 6)}%</span>
          <span>AI-103: ${pct(eachStage('AI-103').filter(x => state.done[x.id]).length, 18)}%</span>
          <span>AI-500: ${pct(eachStage('AI-500').filter(x => state.done[x.id]).length, 36)}%</span>
        </div>
      </section>

      <section class="card">
        <h2>Đề cương chính thức & Cấu trúc điểm thi</h2>
        <p>${link('Study Guide chính thức AI-103 (Microsoft Learn)', SOURCES.a103)}</p>
        <p>${link('Study Guide chính thức AI-500 (Microsoft Learn)', SOURCES.a500)}</p>
        <p>${link('Điều kiện cấp chứng chỉ Multi-Agent Expert', SOURCES.cert)}</p>
        <p>${link('Tài liệu Microsoft Foundry', SOURCES.foundry)}</p>
        ${notice('<b>Tỷ trọng đề thi AI-103:</b> Plan & Manage (25–30%), GenAI & Agents (30–35%), Vision (10–15%), Text & Speech (10–15%), Information Extraction (10–15%).<br><b>Tỷ trọng đề thi AI-500:</b> Architect (15–20%), Develop (30–35%), Evaluate & Monitor (20–25%), Secure & Deploy (20–25%).')}
      </section>
    </div>

    <section class="section">
      <div class="row">
        <h2>10 Học phần từ Nền tảng đến Chuyên gia</h2>
        <button class="btn alt" data-page="curriculum">Mở danh sách 60 bài</button>
      </div>
      <div class="module-grid">${MODULES.map(m => moduleCard(m)).join('')}</div>
    </section>
  `;
}

function moduleCard(m) {
  return `
    <div class="card module" data-module="${m.id}" role="button" tabindex="0">
      <div class="row">
        <div class="mark">${esc(m.id)}</div>
        <span class="tag ${m.stage === 'AI-500' ? 'green' : m.stage === 'AI-103' ? '' : 'gray'}">${esc(m.stage)}</span>
      </div>
      <h3 style="margin-top:16px">${esc(m.title)}</h3>
      <p>${esc(m.desc)}</p>
      <div class="row">
        <small>${moduleDone(m)}/6 bài đã hoàn thành</small>
        <strong>${pct(moduleDone(m), 6)}%</strong>
      </div>
      ${progress(pct(moduleDone(m), 6), moduleDone(m) === 6 ? 'green' : '')}
    </div>`;
}

function getFilteredLessons() {
  const q = filter.trim().toLowerCase();
  return LESSONS.filter(l => {
    const d = window.LESSON_DETAILS && window.LESSON_DETAILS[l.id];
    const matchText =
      !q ||
      l.module.toLowerCase() === q ||
      l.id.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      l.concepts.toLowerCase().includes(q) ||
      (d && d.analogy && d.analogy.title.toLowerCase().includes(q));
    const matchStage = stageFilter === 'all' || l.stage === stageFilter;
    const matchBookmark = !bookmarkedOnly || !!state.bookmarks[l.id];
    return matchText && matchStage && matchBookmark;
  });
}

function curriculum() {
  const rows = getFilteredLessons();
  return `
    ${heading('Giáo trình chi tiết của Thầy', 'Lộ trình 60 Bài Giảng Chuyên Sâu', `<span class="pill">60 bài · 10 học phần · 120 câu hỏi cuối bài</span>`)}
    ${notice('Mỗi bài giảng gồm đủ <b>8 phần học thuật thực chiến</b>: Lời mở đầu & Ví dụ đời thường → Sơ đồ luồng → Bài giảng chi tiết → Bảng so sánh ra quyết định → Code Python & Giải thích từng dòng → Bài Lab từng bước → Mẹo thi & Bẫy đề thi → Trắc nghiệm có chữa đáp án.')}
    <div class="section toolbar">
      <input class="field" id="filter" placeholder="Tìm tên bài, khái niệm (VD: RAG, MCP, OAuth, Key Vault) hoặc mã học phần (P, A..I)..." value="${esc(filter)}">
      <select class="field" id="stage">
        <option value="all">Tất cả giai đoạn (60 bài)</option>
        <option value="Nền tảng" ${stageFilter === 'Nền tảng' ? 'selected' : ''}>Nền tảng Python & LLM (6 bài)</option>
        <option value="AI-103" ${stageFilter === 'AI-103' ? 'selected' : ''}>Chứng chỉ AI-103 (18 bài)</option>
        <option value="AI-500" ${stageFilter === 'AI-500' ? 'selected' : ''}>Chứng chỉ AI-500 (36 bài)</option>
      </select>
      <button class="btn ${bookmarkedOnly ? '' : 'alt'}" id="toggle-bookmark-filter">★ Đánh dấu (${Object.keys(state.bookmarks).filter(k => state.bookmarks[k]).length})</button>
      <button class="btn alt" id="reset-filter">Xóa lọc</button>
    </div>
    <div class="card" id="results">${lessonList(rows)}</div>
  `;
}

function lessonList(rows) {
  if (!rows.length) return '<div class="empty">Không tìm thấy bài giảng phù hợp với bộ lọc hiện tại.</div>';
  return rows
    .map(l => {
      const d = window.LESSON_DETAILS && window.LESSON_DETAILS[l.id];
      const starred = state.bookmarks[l.id] ? ' <span title="Đã đánh dấu trọng tâm" style="color:#e59213">★</span>' : '';
      return `
        <div class="lesson-row">
          <div style="max-width:780px">
            <div>
              <span class="tag ${l.stage === 'AI-500' ? 'green' : l.stage === 'Nền tảng' ? 'purple' : ''}">${esc(l.stage)}</span>
              <small> &nbsp;Bài ${l.global + 1}/60 · Mã <b>${esc(l.id)}</b> · ${esc(d?.duration || '45 phút')} · ${esc(d?.difficulty || '')}${starred}</small>
            </div>
            <div style="font-weight:750;font-size:16px;margin:7px 0 4px">${esc(l.title)}</div>
            <small>${esc(l.concepts)}</small>
            ${d?.analogy ? `<div style="font-size:12.8px;color:#52698a;margin-top:4px">💡 <i>${esc(d.analogy.title)}</i></div>` : ''}
          </div>
          <div class="actions">
            <span class="tag ${state.done[l.id] ? 'green' : 'gray'}">${state.done[l.id] ? '✓ Đã hoàn thành' : 'Chưa hoàn thành'}</span>
            <button class="btn ${state.done[l.id] ? 'alt' : ''}" data-lesson="${l.id}">${state.done[l.id] ? 'Ôn lại →' : 'Vào học →'}</button>
          </div>
        </div>`;
    })
    .join('');
}

function lesson() {
  const l = current();
  const m = MODULES.find(x => x.id === l.module);
  const d = (window.LESSON_DETAILS && window.LESSON_DETAILS[l.id]) || null;
  const checks = state.checks[l.id] || [];
  const qList = getLessonQuestions(l);
  const savedAns = state.lessonQuizAnswers[l.id] || {};
  const quizState = state.quiz[l.id];
  const showGraded = !!lessonQuizGraded[l.id] || !!quizState;
  const prevL = LESSONS[l.global - 1] || null;
  const nextL = LESSONS[l.global + 1] || null;
  const starred = !!state.bookmarks[l.id];

  return `
    ${heading(
      `${l.stage} · Học phần ${l.module}: ${esc(m.title)}`,
      `${esc(l.id)}. ${esc(l.title)}`,
      `<button class="btn ${starred ? 'warn' : 'alt'}" id="bookmark-lesson">${starred ? '★ Đã lưu trọng tâm' : '☆ Lưu trọng tâm'}</button>
       <button class="btn alt" id="back-curriculum">← Giáo trình 60 bài</button>`
    )}
    <div class="breadcrumb">
      <span>Học phần ${esc(l.module)} (Bài ${l.index}/6) · Toàn khóa ${l.global + 1}/60 · Thời lượng: <b>${esc(d?.duration || '45 phút')}</b> · Mức độ: <b>${esc(d?.difficulty || l.stage)}</b></span>
      <div class="actions">
        <button class="btn alt sm" id="prev-top" ${prevL ? '' : 'disabled'}>← Bài trước</button>
        <button class="btn alt sm" id="next-top" ${nextL ? '' : 'disabled'}>Bài tiếp →</button>
      </div>
    </div>

    <div class="content-grid">
      <div>
        <section class="card reading">
          ${
            d
              ? `
            <div class="teacher-box">
              <div class="teacher-header">
                <div class="teacher-avatar">👨‍🏫</div>
                <div>Lời dẫn nhập của Thầy · Đặt vấn đề thực chiến</div>
              </div>
              <p style="margin:0">${richText(d.teacherIntro)}</p>
            </div>

            ${
              d.analogy
                ? `
              <div class="analogy-box">
                <div class="analogy-title">💡 Liên hệ đời thường cho dễ hiểu: ${esc(d.analogy.title)}</div>
                <p style="margin:0">${richText(d.analogy.body)}</p>
              </div>`
                : ''
            }

            ${
              d.objectives?.length
                ? `
              <div class="objectives-box">
                <strong style="color:#135438">🎯 Sau bài học này, em sẽ nắm chắc:</strong>
                <ul>
                  ${d.objectives.map(o => `<li>${richText(o)}</li>`).join('')}
                </ul>
              </div>`
                : ''
            }

            ${
              d.flow?.length
                ? `
              <h3>🗺️ Sơ đồ tư duy & Luồng hoạt động cốt lõi</h3>
              <div class="flow-grid">
                ${d.flow
                  .map(
                    f => `
                  <div class="flow-step">
                    <strong>${esc(f.step)}</strong>
                    <span>${richText(f.detail)}</span>
                  </div>`
                  )
                  .join('')}
              </div>`
                : ''
            }

            <div class="row" style="margin-top:22px">
              <h2>📖 Bài giảng chi tiết</h2>
              <span class="tag">${esc(l.concepts)}</span>
            </div>

            ${(d.sections || [])
              .map(
                sec => `
              <div class="lecture-section">
                <h3>${esc(sec.heading)}</h3>
                ${(sec.paragraphs || []).map(p => `<p>${richText(p)}</p>`).join('')}
                ${
                  sec.bullets?.length
                    ? `<ul>${sec.bullets.map(b => `<li>${fmtBullet(b)}</li>`).join('')}</ul>`
                    : ''
                }
              </div>`
              )
              .join('')}

            ${
              d.comparison?.rows?.length
                ? `
              <h3>⚖️ ${esc(d.comparison.title || 'Bảng so sánh & Quy tắc chọn giải pháp')}</h3>
              <div class="table-wrap">
                <table class="comp-table">
                  <thead>
                    <tr>${d.comparison.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${d.comparison.rows
                      .map(r => `<tr>${r.map((cell, ci) => `<td>${ci === 0 ? `<b>${richText(cell)}</b>` : richText(cell)}</td>`).join('')}</tr>`)
                      .join('')}
                  </tbody>
                </table>
              </div>`
                : ''
            }

            <h3>💻 Ví dụ Code / Cấu hình thực chiến</h3>
            <div class="code-header">
              <span>${esc(d.codeTitle || 'Minh họa triển khai thực tế')}</span>
              <button class="btn sm alt" id="copy-code" style="padding:4px 10px;font-size:12px">📋 Sao chép code</button>
            </div>
            <pre class="code">${esc(d.code || l.sample)}</pre>
            ${
              d.codeNotes?.length
                ? `
              <div class="code-notes">
                <strong style="color:#1b3e7a">🔍 Thầy phân tích các dòng code "ăn điểm" ở trên:</strong>
                <ul>${d.codeNotes.map(n => `<li>${fmtBullet(n)}</li>`).join('')}</ul>
              </div>`
                : ''
            }

            <hr class="divider">
            <h2>🧪 Bài Lab thực hành cầm tay chỉ việc</h2>
            <p><b>Mục tiêu bài Lab:</b> ${richText(d.labGuide?.goal || l.lab)}</p>
            ${
              d.labGuide?.steps?.length
                ? `
              <div class="lab-step-list">
                ${d.labGuide.steps.map(st => `<div class="lab-step">${fmtBullet(st)}</div>`).join('')}
              </div>`
                : ''
            }
            ${
              d.labGuide?.expectedOutput
                ? `<div class="expected-box"><b>✓ Kết quả nghiệm thu cần đạt:</b> ${richText(d.labGuide.expectedOutput)}</div>`
                : ''
            }

            <h3>Checklist tự kiểm tra hoàn thành Lab (tích đủ 3 bước)</h3>
            <div class="checklist">
              ${l.steps
                .map(
                  (x, i) => `
                <label class="checkline">
                  <input type="checkbox" data-check="${i}" ${checks.includes(i) ? 'checked' : ''}>
                  <span>${esc(x)}</span>
                </label>`
                )
                .join('')}
            </div>

            <hr class="divider">
            <div class="exam-tip-box">
              <h3>🎯 Góc Luyện Thi Microsoft: Mẹo nhận diện nhanh & Bẫy hay gặp</h3>
              <ul>
                ${(d.examTips || []).map(t => `<li>${fmtBullet(t)}</li>`).join('')}
              </ul>
              ${notice(`<b>⚠️ Bẫy sinh viên rất hay mắc:</b> ${richText(l.caution)}`, 'warning')}
            </div>

            ${
              d.summaryTakeaways?.length
                ? `
              <h3>📌 Tóm tắt cốt lõi nhớ ngay trong 30 giây</h3>
              <div class="takeaway-grid">
                ${d.summaryTakeaways.map(tk => `<div class="takeaway-item"><span>✓</span><span>${richText(tk)}</span></div>`).join('')}
              </div>`
                : ''
            }
          `
              : `
            <p><b>Khái niệm cốt lõi:</b> ${esc(l.concepts)}.</p>
            ${notice(`<b>Điểm dễ sai:</b> ${esc(l.caution)}`, 'warning')}
            <pre class="code standalone">${esc(l.sample)}</pre>
            <h3>Bài Lab</h3>
            <p>${esc(l.lab)}</p>
            <div class="checklist">
              ${l.steps
                .map(
                  (x, i) => `
                <label class="checkline">
                  <input type="checkbox" data-check="${i}" ${checks.includes(i) ? 'checked' : ''}>
                  <span>${esc(x)}</span>
                </label>`
                )
                .join('')}
            </div>
          `
          }

          <hr class="divider">
          <h3>📝 Ghi chú cá nhân / Lưu bằng chứng Lab</h3>
          <textarea class="field" id="lesson-note" placeholder="Ghi lại ý hiểu của riêng em, câu lệnh đã chạy thành công, hoặc link GitHub repo bài Lab...">${esc(state.notes[l.id] || '')}</textarea>
          <div class="actions" style="margin-top:9px">
            <button class="btn alt" id="save-note">💾 Lưu ghi chú</button>
            <small>Lưu tự động trên trình duyệt máy này</small>
          </div>

          <h3 style="margin-top:22px">🔗 Tài liệu tham khảo chính thức Microsoft</h3>
          <p>
            ${link('Microsoft Study Guide (' + l.stage + ')', SOURCES[l.source])} &nbsp;·&nbsp;
            ${link('Khóa học Microsoft Learn: ' + (l.stage === 'AI-500' ? 'AI-500' : 'AI-103'), l.stage === 'AI-500' ? SOURCES.learn500 : SOURCES.learn103)}
            ${l.module === 'E' ? ` &nbsp;·&nbsp; ${link('Microsoft Agent Framework', SOURCES.agent)} &nbsp;·&nbsp; ${link('MCP Spec', SOURCES.mcp)} &nbsp;·&nbsp; ${link('LangGraph', SOURCES.langgraph)}` : ''}
          </p>
        </section>

        <section class="card section" id="lesson-quiz-section">
          <div class="row">
            <h2>✍️ Kiểm tra hiểu bài & Thầy chữa chi tiết</h2>
            <span class="tag purple">${qList.length} câu hỏi tình huống</span>
          </div>
          <p class="muted" style="margin-top:0">Trả lời đúng tất cả câu hỏi dưới đây để mở khóa hoàn thành bài học. Sau khi bấm chấm, thầy sẽ giải thích rõ vì sao câu đúng và vì sao các phương án nhiễu lại sai.</p>

          ${qList
            .map((q, qi) => {
              const chosen = savedAns[qi];
              const isChosen = chosen !== undefined && chosen !== null;
              const isRight = isChosen && Number(chosen) === q.answer;
              return `
                <div class="question">
                  <strong>Câu ${qi + 1}. ${richText(q.question)}</strong>
                  <div style="margin-top:8px">
                    ${q.options
                      .map((opt, oi) => {
                        let optCls = '';
                        if (showGraded && isChosen) {
                          if (oi === q.answer) optCls = 'opt-correct';
                          else if (Number(chosen) === oi) optCls = 'opt-wrong';
                        }
                        return `
                          <label class="quiz-option ${optCls}">
                            <input type="radio" name="lquiz_${qi}" value="${oi}" ${isChosen && Number(chosen) === oi ? 'checked' : ''}>
                            <span><b>${String.fromCharCode(65 + oi)}.</b> ${richText(opt)}</span>
                          </label>`;
                      })
                      .join('')}
                  </div>
                  ${
                    showGraded && isChosen
                      ? `
                    <div class="walkthrough-box">
                      <div class="wt-step">
                        <span class="wt-label ${isRight ? 'ok' : 'err'}">${isRight ? '✓ Chính xác! Em hiểu bài rất chắc.' : `✕ Chưa đúng · Đáp án chuẩn là ${String.fromCharCode(65 + q.answer)}`}</span>
                        <div>${richText(q.explanation)}</div>
                      </div>
                      ${
                        !isRight && q.wrongReasons && q.wrongReasons[Number(chosen)]
                          ? `
                        <div class="wt-step">
                          <span class="wt-label err">🔍 Vì sao phương án ${String.fromCharCode(65 + Number(chosen))} em chọn lại sai?</span>
                          <div>${richText(q.wrongReasons[Number(chosen)])}</div>
                        </div>`
                          : ''
                      }
                      ${
                        q.wrongReasons && q.wrongReasons.some((r, ri) => ri !== q.answer && ri !== Number(chosen) && r)
                          ? `
                        <div class="wt-step">
                          <span class="wt-label tip">💡 Phân tích thêm các phương án nhiễu khác:</span>
                          <ul style="margin:6px 0 0;padding-left:18px">
                            ${q.wrongReasons
                              .map((r, ri) => (ri !== q.answer && r ? `<li><b>Phương án ${String.fromCharCode(65 + ri)}:</b> ${richText(r)}</li>` : ''))
                              .join('')}
                          </ul>
                        </div>`
                          : ''
                      }
                    </div>`
                      : ''
                  }
                </div>`;
            })
            .join('')}

          <div class="actions" style="margin-top:12px">
            <button class="btn" id="grade-one">👨‍🏫 Chấm bài & Xem thầy giải thích</button>
            ${
              quizState?.ok
                ? `<span class="tag green">✓ Đã vượt qua bài kiểm tra (${quizState.score || qList.length}/${qList.length} câu đúng)</span>`
                : quizState
                  ? `<span class="tag orange">Đã đúng ${quizState.score || 0}/${qList.length} câu — Hãy chọn lại câu sai rồi bấm chấm lại nhé!</span>`
                  : ''
            }
          </div>
        </section>
      </div>

      <aside>
        <div class="card" style="position:sticky;top:20px">
          <h3>Tiến độ bài ${esc(l.id)}</h3>
          ${progress(pct(checks.length + (quizState?.ok ? 1 : 0), 4), checks.length === 3 && quizState?.ok ? 'green' : '')}
          <p>
            <small>
              • Checklist Lab: <b>${checks.length}/3</b><br>
              • Câu hỏi cuối bài: <b>${quizState?.ok ? '✓ Đạt (' + qList.length + '/' + qList.length + ')' : 'Chưa đạt'}</b>
            </small>
          </p>
          <button class="btn ${state.done[l.id] ? 'success' : ''}" id="complete" style="width:100%" ${checks.length === 3 && quizState?.ok ? '' : 'disabled'}>
            ${state.done[l.id] ? '✓ Đã hoàn thành bài này' : '✓ Đánh dấu hoàn thành & Qua bài mới'}
          </button>
          <p class="help">Hoàn thành đủ 3 mục checklist thực hành và trả lời đúng ${qList.length} câu hỏi tình huống để mở khóa nút hoàn thành.</p>
          <hr class="divider">
          <h3>Điều hướng nhanh</h3>
          ${prevL ? `<p style="margin:6px 0"><small>Bài trước:</small><br><b>${esc(prevL.id)}. ${esc(prevL.title)}</b></p><button class="btn alt sm" id="prev-side" style="width:100%;margin-bottom:10px">← Mở bài ${esc(prevL.id)}</button>` : ''}
          <p style="margin:6px 0"><small>Bài kế tiếp:</small><br><b>${nextL ? `${esc(nextL.id)}. ${esc(nextL.title)}` : 'Đã tới cuối chương trình!'}</b></p>
          <button class="btn alt sm" id="next" style="width:100%" ${!nextL ? 'disabled' : ''}>Bài tiếp theo →</button>
          <hr class="divider">
          <button class="btn alt sm" style="width:100%" data-page="quiz">✦ Sang Phòng Thi Thử</button>
          <div class="kpi" style="margin-top:12px">
            <span>${completed()}/60 bài</span>
            <span>${esc(l.stage)}</span>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function today() {
  const todo = LESSONS.filter(l => !state.done[l.id]).slice(0, 3);
  const rev = LESSONS.filter(
    l =>
      state.done[l.id] &&
      state.history
        .filter(h => h.lesson === l.id && h.type === 'completed')
        .some(h => Date.now() - new Date(h.at).getTime() > 3 * 86400000)
  ).slice(0, 3);
  const mistakes = getMistakeQuestions();

  return `
    ${heading('Kế hoạch học tập cá nhân hóa', 'Nhiệm vụ hôm nay', `<span class="pill">Mục tiêu ${state.dailyGoal} phút/ngày</span>`)}
    <div class="two">
      <section class="card">
        <h2>3 Bài học ưu tiên tiếp theo</h2>
        ${
          todo.length
            ? todo
                .map(
                  (l, i) => `
              <div class="task-row">
                <div>
                  <b>${i + 1}. [${esc(l.id)}] ${esc(l.title)}</b><br>
                  <small>${esc(l.lab)}</small>
                </div>
                <button class="btn alt" data-lesson="${l.id}">Vào học</button>
              </div>`
                )
                .join('')
            : notice('Tuyệt vời! Em đã hoàn thành trọn vẹn 60/60 bài giảng. Giờ hãy tập trung giải đề thi thử và hoàn thiện dự án Capstone nhé!', 'success')
        }

        <h3 style="margin-top:22px">Ôn tập ngắt quãng (Spaced Repetition ≥ 3 ngày)</h3>
        ${
          rev.length
            ? rev
                .map(
                  l => `
              <div class="task-row">
                <span><b>${esc(l.id)}.</b> ${esc(l.title)}</span>
                <button class="btn alt sm" data-lesson="${l.id}">Ôn lại</button>
              </div>`
                )
                .join('')
            : '<p class="muted">Chưa có bài đã học quá 3 ngày cần nhắc ôn. Hệ thống sẽ tự động nhắc khi đến chu kỳ ôn tập.</p>'
        }

        <h3 style="margin-top:22px">Sổ tay câu sai cần phục thù</h3>
        ${
          mistakes.length
            ? `<p>Em đang có <b>${mistakes.length} câu hỏi</b> từng làm sai trong các đề thi thử.</p>
               <button class="btn warn" id="go-mistakes-today">📕 Mở Sổ tay câu sai & Chữa lại ngay</button>`
            : '<p class="muted">Sổ tay câu sai đang trống — rất tốt! Mọi câu làm sai khi thi thử sẽ tự động lưu vào đây để em ôn lại.</p>'
        }
      </section>

      <section class="card">
        <h2>Đồng hồ tập trung Pomodoro</h2>
        <div class="metric-num" id="timer" style="font-size:52px;letter-spacing:2px;text-align:center;margin:18px 0">${timeFmt(timerSeconds)}</div>
        <div class="actions" style="justify-content:center">
          <button class="btn" id="timer-start">${timerOn ? 'Tạm dừng' : 'Bắt đầu phiên 25 phút'}</button>
          <button class="btn alt" id="timer-reset">Đặt lại</button>
        </div>
        <p class="help">Mỗi phiên học tập trung trọn vẹn 25 phút sẽ tự động cộng vào thống kê giờ học của em.</p>
        <hr class="divider">
        <label class="formlabel">Mục tiêu thời gian học mỗi ngày</label>
        <select id="goal" class="field" style="width:100%">
          ${[30, 60, 90, 120, 180]
            .map(n => `<option value="${n}" ${n === state.dailyGoal ? 'selected' : ''}>${n} phút / ngày</option>`)
            .join('')}
        </select>
      </section>
    </div>
  `;
}

function calendar() {
  const now = new Date();
  const y = now.getFullYear();
  const mon = now.getMonth();
  const first = new Date(y, mon, 1);
  const days = new Date(y, mon + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const counts = {};
  state.history.forEach(h => {
    const d = h.at.slice(0, 10);
    counts[d] = (counts[d] || 0) + 1;
  });
  const cells = Array.from({ length: offset }, () => '<div></div>');
  for (let i = 1; i <= days; i++) {
    const d = `${y}-${String(mon + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const n = counts[d] || 0;
    cells.push(
      `<div class="day ${i === now.getDate() ? 'today' : ''}" style="background:${n ? '#e8f6ee' : '#fff'}"><small>${i}</small>${n ? `<b style="color:#156e49">✓ ${n} hoạt động</b>` : '<small>—</small>'}</div>`
    );
  }
  return `
    ${heading('Theo dõi kỷ luật bản thân', 'Lịch học tháng ' + (mon + 1) + '/' + y)}
    <div class="card">
      <div class="calendar" style="margin-bottom:10px">
        ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
          .map(x => `<b style="text-align:center;color:#697f9f;font-size:12px">${x}</b>`)
          .join('')}
      </div>
      <div class="calendar">${cells.join('')}</div>
      <hr class="divider">
      <p>Ô màu xanh đánh dấu những ngày em hoàn thành bài giảng, ghi chú Lab, trả lời câu hỏi hoặc giải đề thi thử.</p>
      <div class="kpi">
        <span>${studiedDays()} ngày hoạt động</span>
        <span>${streak()} ngày liên tiếp</span>
        <span>${state.studyMinutes} phút tập trung</span>
        <span>${state.exam.length} lượt thi thử</span>
      </div>
    </div>
  `;
}

function project() {
  const cap = LESSONS.filter(l => l.module === 'I');
  return `
    ${heading('Dự án thực chiến cuối khóa', 'Capstone Multi-Agent chuẩn Enterprise', `<span class="pill">6 cột mốc thực hành</span>`)}
    ${notice('<b>Đề bài tổng hợp:</b> Xây dựng Hệ thống Đa Tác Tử Phân Tích & Thẩm Định Báo Cáo Doanh Nghiệp (Orchestrator – Retriever – Analyst – Verifier) tích hợp RAG có dẫn nguồn, MCP tools, phê duyệt con người (HITL), bảo mật OAuth2/RBAC tối thiểu, OpenTelemetry tracing và bộ kiểm thử hồi quy ≥ 25 ca.')}
    <div class="two section">
      <div class="card">
        <h2>6 Cột mốc triển khai chi tiết</h2>
        ${cap
          .map(
            (l, i) => `
          <div class="lesson-row">
            <div>
              <span class="tag ${state.done[l.id] ? 'green' : ''}">Milestone ${i + 1} · ${esc(l.id)}</span>
              <h3 style="margin:8px 0 4px">${esc(l.title)}</h3>
              <small>${esc(l.lab)}</small>
            </div>
            <button class="btn ${state.done[l.id] ? 'alt' : ''}" data-lesson="${l.id}">${state.done[l.id] ? 'Xem lại hướng dẫn' : 'Mở bài hướng dẫn →'}</button>
          </div>`
          )
          .join('')}
      </div>
      <div class="card">
        <h2>Tiêu chí nghiệm thu chuẩn Kiến trúc sư AI-500</h2>
        <ul class="reading">
          <li>Phân tách tối thiểu 3–4 vai trò Agent rõ ràng kèm ma trận quyền hạn riêng biệt.</li>
          <li>Agent truy xuất (Retriever) và Agent kiểm chứng (Verifier) đối chiếu trích dẫn chống bịa đặt (Hallucination).</li>
          <li>Middleware kiểm soát cứng <code>max_iterations</code>, ngân sách token, timeout, retry có backoff.</li>
          <li>Tác vụ nhạy cảm bắt buộc dừng chờ con người phê duyệt (<code>PENDING_APPROVAL</code>).</li>
          <li>Distributed Tracing gắn <code>trace_id</code> xuyên suốt các Agent và tự động che giấu PII/Secrets.</li>
          <li>Bộ Golden Dataset ≥ 25 test cases (gồm cả kịch bản tấn công Indirect Prompt Injection) tích hợp vào CI/CD.</li>
          <li>Có tài liệu ADR và Runbook hướng dẫn Canary rollout / Rollback khẩn cấp.</li>
        </ul>
        <p>${link('Đối chiếu Study Guide AI-500 Microsoft', SOURCES.a500)}</p>
      </div>
    </div>
  `;
}

/* ================= MOCK EXAM & WALKTHROUGH CENTER ================= */

function startExamSession(examObj, mode) {
  page = 'quiz';
  activeExam = examObj;
  examRunMode = mode; // 'timed' | 'practice'
  examView = 'session';
  examCurrentIdx = 0;
  examAnswers = {};
  examFlags = {};
  examRevealed = {};
  examStartedAt = Date.now();
  examSecondsLeft = (examObj.durationMinutes || 45) * 60;
  if (examTimer) {
    clearInterval(examTimer);
    examTimer = null;
  }
  render();
  window.scrollTo(0, 0);
}

function submitActiveExam(autoExpired = false) {
  if (!activeExam) return;
  const qs = activeExam.questions;
  const answeredCount = Object.keys(examAnswers).length;
  if (!autoExpired && answeredCount < qs.length) {
    if (!confirm(`Em mới trả lời ${answeredCount}/${qs.length} câu hỏi. Em vẫn muốn nộp bài ngay để xem điểm và lời giải chi tiết của thầy?`)) {
      return;
    }
  }
  if (examTimer) {
    clearInterval(examTimer);
    examTimer = null;
  }
  examElapsedSeconds = Math.max(1, Math.round((Date.now() - examStartedAt) / 1000));

  let correct = 0;
  const domainMap = {};
  qs.forEach((q, i) => {
    const dom = q.domain || 'Tổng hợp';
    if (!domainMap[dom]) domainMap[dom] = { correct: 0, total: 0 };
    domainMap[dom].total++;
    const userChoice = examAnswers[i];
    const ok = userChoice !== undefined && Number(userChoice) === q.answer;
    if (ok) {
      correct++;
      domainMap[dom].correct++;
      // If solved right in mistake drill, we keep a flag or allow clearing
      if (activeExam.isMistakeDrill && state.mistakes[q.id]) {
        delete state.mistakes[q.id];
      }
    } else if (!activeExam.isWarmup) {
      // Record into Sổ tay câu sai
      const prev = state.mistakes[q.id] || { count: 0 };
      state.mistakes[q.id] = {
        count: prev.count + 1,
        lastChoice: userChoice !== undefined ? Number(userChoice) : null,
        at: new Date().toISOString(),
        cert: activeExam.cert
      };
    }
  });

  const s1000 = scaledScore(correct, qs.length);
  const p = pct(correct, qs.length);
  state.exam.push({
    mode: activeExam.cert,
    examId: activeExam.id,
    examTitle: activeExam.title,
    runMode: examRunMode,
    score1000: s1000,
    percent: p,
    correct,
    total: qs.length,
    elapsedSeconds: examElapsedSeconds,
    domainStats: domainMap,
    at: new Date().toISOString()
  });
  record('exam', activeExam.id);
  reviewFilter = 'all';
  reviewDomain = 'all';
  examView = 'review';
  render();
  window.scrollTo(0, 0);
}

function renderWalkthroughBlock(q, userChoice, showChoiceVerdict = true) {
  const wt = q.walkthrough || {};
  const hasChosen = userChoice !== undefined && userChoice !== null;
  const isRight = hasChosen && Number(userChoice) === q.answer;
  const linkedLesson = LESSONS.find(l => l.id === q.lessonId);

  return `
    <div class="walkthrough-box">
      <div class="row" style="margin-bottom:6px">
        <strong style="color:#173d7a;font-size:15px">👨‍🏫 Thầy giáo chữa chi tiết câu này</strong>
        ${
          showChoiceVerdict
            ? `<span class="tag ${isRight ? 'green' : 'red'}">${
                isRight
                  ? '✓ Em chọn đúng (' + String.fromCharCode(65 + q.answer) + ')'
                  : hasChosen
                    ? '✕ Em chọn ' + String.fromCharCode(65 + Number(userChoice)) + ' · Đáp án đúng: ' + String.fromCharCode(65 + q.answer)
                    : '⚠️ Bỏ trống · Đáp án đúng: ' + String.fromCharCode(65 + q.answer)
              }</span>`
            : `<span class="tag green">Đáp án chuẩn: ${String.fromCharCode(65 + q.answer)}</span>`
        }
      </div>

      ${
        wt.keyword
          ? `
        <div class="wt-step">
          <span class="wt-label kw">🎯 Bước 1 — Bắt từ khóa đề bài (Exam Keyword):</span>
          <div>${richText(wt.keyword)}</div>
        </div>`
          : ''
      }

      <div class="wt-step">
        <span class="wt-label ok">✅ Bước 2 — Bản chất kỹ thuật (Vì sao ${String.fromCharCode(65 + q.answer)} ĐÚNG?):</span>
        <div>${richText(wt.whyCorrect || '')}</div>
      </div>

      ${
        Array.isArray(wt.whyWrong) && wt.whyWrong.some((w, wi) => wi !== q.answer && w)
          ? `
        <div class="wt-step">
          <span class="wt-label err">❌ Bước 3 — Mổ xẻ phương án nhiễu (Vì sao các câu kia SAI?):</span>
          <ul style="margin:6px 0 0;padding-left:19px">
            ${wt.whyWrong
              .map((reason, wi) =>
                wi !== q.answer && reason
                  ? `<li style="margin-bottom:5px"><b>Phương án ${String.fromCharCode(65 + wi)}${hasChosen && Number(userChoice) === wi ? ' (Phương án em chọn)' : ''}:</b> ${richText(reason)}</li>`
                  : ''
              )
              .join('')}
          </ul>
        </div>`
          : ''
      }

      <div class="wt-step">
        <span class="wt-label tip">💡 Bước 4 — Mẹo phản xạ phòng thi & Bài học liên quan:</span>
        <div>${richText(wt.tip || '')}</div>
        ${
          linkedLesson
            ? `<div style="margin-top:9px">
                 <button class="btn alt sm" data-lesson="${esc(linkedLesson.id)}">📖 Ôn lại Bài ${esc(linkedLesson.id)}: ${esc(linkedLesson.title)} →</button>
               </div>`
            : ''
        }
      </div>
    </div>
  `;
}

function renderExamHub() {
  const allSets = getAllExamSets();
  const mistakes = getMistakeQuestions();
  const filteredSets = allSets.filter(s => examCertFilter === 'all' || s.cert === examCertFilter);

  return `
    ${heading(
      'Phòng Thi Thử Mô Phỏng & Chữa Đề 4 Bước',
      'Thi thử & Thầy giáo chữa đề',
      `<span class="pill">Thang điểm chuẩn Microsoft 100–1000 · Đỗ từ 700</span>`
    )}
    ${notice('Mỗi bộ đề thi thử chính gồm <b>Case Study doanh nghiệp + các câu hỏi tình huống phân hóa đúng tỷ trọng đề cương Microsoft</b>. Em có thể chọn <b>⏱️ Thi thử bấm giờ</b> (trải nghiệm áp lực phòng thi Pearson VUE) hoặc <b>👨‍🏫 Luyện đề & Xem chữa ngay</b> (xem thầy phân tích từ khóa, giải thích câu đúng và mổ xẻ từng đáp án bẫy ngay sau mỗi câu).')}

    <div class="section toolbar">
      <button class="btn ${examCertFilter === 'all' ? '' : 'alt'}" data-cert-tab="all">Tất cả bộ đề (${allSets.length})</button>
      <button class="btn ${examCertFilter === 'AI-103' ? '' : 'alt'}" data-cert-tab="AI-103">Chứng chỉ AI-103 Associate</button>
      <button class="btn ${examCertFilter === 'AI-500' ? '' : 'alt'}" data-cert-tab="AI-500">Chứng chỉ AI-500 Expert</button>
      <button class="btn ${examCertFilter === 'mistakes' ? 'warn' : 'alt'}" data-cert-tab="mistakes">📕 Sổ tay câu sai (${mistakes.length})</button>
      <button class="btn ${examCertFilter === 'history' ? '' : 'alt'}" data-cert-tab="history">📊 Lịch sử điểm thi (${state.exam.length})</button>
    </div>

    ${
      examCertFilter === 'mistakes'
        ? `
      <div class="card">
        <div class="row">
          <div>
            <h2>📕 Sổ tay câu sai của em (${mistakes.length} câu)</h2>
            <p class="muted" style="margin:4px 0 0">Mọi câu trả lời sai trong các đề thi thử AI-103 & AI-500 đều được lưu lại tại đây. Khi em thi lại bộ câu sai này và trả lời đúng, câu đó sẽ tự động được gỡ khỏi danh sách!</p>
          </div>
          ${
            mistakes.length
              ? `<div class="actions">
                   <button class="btn" id="start-mistake-drill">▶ Làm đề Phục thù (${mistakes.length} câu)</button>
                   <button class="btn danger sm" id="clear-all-mistakes">Xóa sạch sổ tay</button>
                 </div>`
              : ''
          }
        </div>
        <hr class="divider">
        ${
          mistakes.length
            ? mistakes
                .map(
                  (q, idx) => `
              <div class="question-card">
                <div class="row" style="margin-bottom:8px">
                  <div class="actions">
                    <span class="tag ${q._meta?.cert === 'AI-500' ? 'green' : ''}">${esc(q._meta?.cert || '')}</span>
                    <span class="tag gray">${esc(q.domain)}</span>
                    <span class="tag red">Sai ${q._meta?.count || 1} lần</span>
                  </div>
                  <button class="btn alt sm" data-remove-mistake="${esc(q.id)}">✓ Đã thuộc — Xóa câu này</button>
                </div>
                ${q.caseStudy ? `<details class="case-study-box"><summary>📋 Xem bối cảnh ${esc(q.caseStudy.title)}</summary><p style="margin:8px 0 0">${richText(q.caseStudy.context)}</p></details>` : ''}
                <p style="font-weight:700;margin:8px 0">${idx + 1}. ${richText(q.question)}</p>
                ${q.options
                  .map(
                    (opt, oi) => `
                  <div class="quiz-option ${oi === q.answer ? 'opt-correct' : q._meta?.lastChoice === oi ? 'opt-wrong' : ''}" style="cursor:default">
                    <span><b>${String.fromCharCode(65 + oi)}.</b> ${richText(opt)}</span>
                  </div>`
                  )
                  .join('')}
                ${renderWalkthroughBlock(q, q._meta?.lastChoice, true)}
              </div>`
                )
                .join('')
            : '<div class="empty">Chưa có câu hỏi nào trong Sổ tay câu sai. Hãy thử sức với một đề thi thử AI-103 hoặc AI-500 nhé!</div>'
        }
      </div>`
        : examCertFilter === 'history'
          ? `
      <div class="card">
        <h2>📊 Lịch sử các lần thi thử (${state.exam.length} lượt)</h2>
        ${
          state.exam.length
            ? `
          <div class="table-wrap">
            <table class="comp-table">
              <thead>
                <tr>
                  <th>Thời điểm</th>
                  <th>Đề thi</th>
                  <th>Chế độ</th>
                  <th>Số câu đúng</th>
                  <th>Điểm quy đổi (100–1000)</th>
                  <th>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                ${[...state.exam]
                  .reverse()
                  .map(h => {
                    const sc = h.score1000 || scaledScore(h.percent, 100);
                    const pass = sc >= 700;
                    return `
                      <tr>
                        <td>${esc(h.at.slice(0, 16).replace('T', ' '))}</td>
                        <td><b>${esc(h.examTitle || h.mode)}</b></td>
                        <td>${h.runMode === 'practice' ? 'Luyện & chữa ngay' : 'Phòng thi bấm giờ'}</td>
                        <td>${h.correct !== undefined ? `${h.correct}/${h.total} (${h.percent}%)` : `${h.percent}%`}</td>
                        <td><b style="font-size:15px;color:${pass ? '#157347' : '#b02a37'}">${sc} / 1000</b></td>
                        <td><span class="tag ${pass ? 'green' : 'red'}">${pass ? '✓ ĐẠT (PASS)' : 'CHƯA ĐẠT'}</span></td>
                      </tr>`;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>`
            : '<div class="empty">Em chưa có lượt nộp bài thi thử nào.</div>'
        }
      </div>`
          : `
      <div class="exam-grid">
        ${filteredSets
          .map(ex => {
            const attempts = state.exam.filter(h => h.examId === ex.id);
            const best = attempts.length ? Math.max(...attempts.map(a => a.score1000 || scaledScore(a.percent, 100))) : null;
            const hasCaseStudy = ex.questions.some(q => q.caseStudy);
            return `
              <div class="card exam-card">
                <div>
                  <div class="row">
                    <div class="actions">
                      <span class="tag ${ex.cert === 'AI-500' ? 'green' : ''}">${esc(ex.cert)}</span>
                      ${hasCaseStudy ? '<span class="tag purple">📋 Có Case Study</span>' : '<span class="tag gray">Ôn phản xạ nhanh</span>'}
                      <span class="tag gray">${ex.questions.length} câu · ${ex.durationMinutes} phút</span>
                    </div>
                    ${
                      best !== null
                        ? `<span class="tag ${best >= 700 ? 'green' : 'orange'}">Cao nhất: ${best}/1000</span>`
                        : '<span class="tag gray">Chưa thi</span>'
                    }
                  </div>
                  <h3 style="font-size:18px;margin:12px 0 6px">${esc(ex.title)}</h3>
                  <p class="muted" style="margin:0;font-size:14px">${esc(ex.subtitle || '')}</p>
                </div>
                <div>
                  <hr class="divider" style="margin:12px 0">
                  <div class="actions">
                    <button class="btn" data-start-exam="${esc(ex.id)}" data-mode="timed">⏱️ Thi thử bấm giờ</button>
                    <button class="btn alt" data-start-exam="${esc(ex.id)}" data-mode="practice">👨‍🏫 Vừa làm vừa xem Thầy chữa</button>
                  </div>
                </div>
              </div>`;
          })
          .join('')}
      </div>`
    }
  `;
}

function renderSingleQuestionCard(q, idx, total) {
  const chosen = examAnswers[idx];
  const hasChosen = chosen !== undefined && chosen !== null;
  const isFlagged = !!examFlags[idx];
  const isRevealed = examRunMode === 'practice' && !!examRevealed[idx];

  return `
    ${
      q.caseStudy
        ? `
      <details class="case-study-box" open>
        <summary>📋 ${esc(q.caseStudy.title)} (Bấm để thu gọn / mở rộng bối cảnh doanh nghiệp)</summary>
        <p style="margin:10px 0 0">${richText(q.caseStudy.context)}</p>
      </details>`
        : ''
    }
    <div class="question-card ${isFlagged ? 'flagged' : ''}" id="qcard-${idx}">
      <div class="row" style="margin-bottom:10px">
        <div class="actions">
          <span class="tag">Câu ${idx + 1} / ${total}</span>
          <span class="tag gray">${esc(q.domain || '')}</span>
          ${q.difficulty ? `<span class="tag ${q.difficulty.includes('Khó') ? 'orange' : 'purple'}">${esc(q.difficulty)}</span>` : ''}
        </div>
        <button class="btn sm ${isFlagged ? 'warn' : 'alt'}" data-flag="${idx}">
          ${isFlagged ? '🚩 Đã đánh dấu xem lại' : '🏳️ Đánh dấu phân vân'}
        </button>
      </div>

      <p style="font-weight:700;font-size:15.8px;margin:8px 0 12px">${richText(q.question)}</p>

      <div>
        ${q.options
          .map((opt, oi) => {
            let cls = '';
            if (isRevealed) {
              if (oi === q.answer) cls = 'opt-correct';
              else if (hasChosen && Number(chosen) === oi) cls = 'opt-wrong';
            }
            const cleanOpt = String(opt).replace(/^[A-D]\.\s*/, '');
            return `
              <label class="quiz-option ${cls}">
                <input type="radio" name="exam_q_${idx}" value="${oi}" ${hasChosen && Number(chosen) === oi ? 'checked' : ''}>
                <span><b>${String.fromCharCode(65 + oi)}.</b> ${richText(cleanOpt)}</span>
              </label>`;
          })
          .join('')}
      </div>

      ${
        examRunMode === 'practice'
          ? `
        <div class="actions" style="margin-top:12px">
          <button class="btn sm ${isRevealed ? 'alt' : ''}" data-reveal="${idx}">
            ${isRevealed ? 'Ẩn lời giải của Thầy' : '👨‍🏫 Xem Thầy chữa câu này ngay'}
          </button>
        </div>
        ${isRevealed ? renderWalkthroughBlock(q, chosen, hasChosen) : ''}`
          : ''
      }
    </div>
  `;
}

function renderExamSession() {
  if (!activeExam) {
    examView = 'hub';
    return renderExamHub();
  }
  const qs = activeExam.questions;
  const answeredCount = Object.keys(examAnswers).length;
  const flagCount = Object.keys(examFlags).filter(k => examFlags[k]).length;

  return `
    ${heading(
      `${activeExam.cert} · ${examRunMode === 'timed' ? '⏱️ Chế độ Phòng thi bấm giờ' : '👨‍🏫 Chế độ Luyện đề & Xem chữa trực tiếp'}`,
      esc(activeExam.title),
      `<button class="btn alt sm" id="toggle-exam-layout">${examSingleMode ? '▤ Xem toàn bộ câu trên 1 trang' : '▢ Chế độ từng câu (Pearson VUE)'}</button>
       <button class="btn danger sm" id="exit-exam">Thoát đề</button>`
    )}

    <div class="exam-runner">
      <div>
        ${
          examSingleMode
            ? `
          ${renderSingleQuestionCard(qs[examCurrentIdx], examCurrentIdx, qs.length)}
          <div class="row card" style="padding:14px 18px">
            <button class="btn alt" id="exam-prev" ${examCurrentIdx === 0 ? 'disabled' : ''}>← Câu trước</button>
            <span>Câu <b>${examCurrentIdx + 1}</b> / ${qs.length}</span>
            ${
              examCurrentIdx < qs.length - 1
                ? `<button class="btn" id="exam-next">Câu tiếp theo →</button>`
                : `<button class="btn success" id="submit-exam-bottom">✓ Nộp bài & Xem Thầy Chữa Đề</button>`
            }
          </div>`
            : qs.map((q, i) => renderSingleQuestionCard(q, i, qs.length)).join('')
        }
      </div>

      <aside>
        <div class="card" style="position:sticky;top:20px">
          ${
            examRunMode === 'timed'
              ? `
            <div class="metric-label">Thời gian làm bài còn lại</div>
            <div class="metric-num" id="exam-clock" style="font-size:36px;color:${examSecondsLeft < 300 ? '#c93535' : '#153261'}">${timeFmt(examSecondsLeft)}</div>`
              : `
            <div class="metric-label">Chế độ học & chữa trực tiếp</div>
            <div style="font-weight:800;color:#1b5299;margin:6px 0 10px">Không giới hạn thời gian</div>`
          }
          ${progress(pct(answeredCount, qs.length))}
          <p style="margin:8px 0 10px">
            <small>Đã chọn: <b>${answeredCount}/${qs.length}</b> câu · Phân vân: <b>${flagCount}</b></small>
          </p>

          <div class="palette-grid">
            ${qs
              .map((q, i) => {
                const ans = examAnswers[i] !== undefined;
                const flg = !!examFlags[i];
                const cur = examSingleMode && examCurrentIdx === i;
                let stateCls = ans ? 'answered' : '';
                if (examRunMode === 'practice' && examRevealed[i] && ans) {
                  stateCls = Number(examAnswers[i]) === q.answer ? 'right' : 'wrong';
                }
                return `<button class="p-btn ${stateCls} ${flg ? 'flagged' : ''} ${cur ? 'current' : ''}" data-jump="${i}">${i + 1}</button>`;
              })
              .join('')}
          </div>

          <button class="btn success" id="submit-exam" style="width:100%;margin-top:8px">
            ✓ Nộp bài & Xem Thầy Chữa Đề
          </button>
          <p class="help" style="margin-bottom:0">Mẹo phòng thi: Đừng dừng quá 2 phút ở một câu dài — hãy bấm <b>Đánh dấu phân vân</b> rồi quay lại sau!</p>
        </div>
      </aside>
    </div>
  `;
}

function renderExamReview() {
  if (!activeExam) {
    examView = 'hub';
    return renderExamHub();
  }
  const qs = activeExam.questions;
  let correctCount = 0;
  const domainStats = {};
  qs.forEach((q, i) => {
    const dom = q.domain || 'Tổng hợp';
    if (!domainStats[dom]) domainStats[dom] = { correct: 0, total: 0 };
    domainStats[dom].total++;
    if (examAnswers[i] !== undefined && Number(examAnswers[i]) === q.answer) {
      correctCount++;
      domainStats[dom].correct++;
    }
  });

  const s1000 = scaledScore(correctCount, qs.length);
  const passed = s1000 >= (activeExam.passingScore || 700);
  const wrongCount = qs.length - correctCount;
  const flagCount = Object.keys(examFlags).filter(k => examFlags[k]).length;
  const domains = Object.keys(domainStats);

  const weakDomains = domains.filter(d => pct(domainStats[d].correct, domainStats[d].total) < 70);

  const visibleQuestions = qs
    .map((q, idx) => ({ q, idx }))
    .filter(({ q, idx }) => {
      const isRight = examAnswers[idx] !== undefined && Number(examAnswers[idx]) === q.answer;
      if (reviewFilter === 'wrong' && isRight) return false;
      if (reviewFilter === 'correct' && !isRight) return false;
      if (reviewFilter === 'flagged' && !examFlags[idx]) return false;
      if (reviewDomain !== 'all' && q.domain !== reviewDomain) return false;
      return true;
    });

  return `
    ${heading(
      `Kết Quả & Chữa Đề Chi Tiết · ${esc(activeExam.cert)}`,
      esc(activeExam.title),
      `<button class="btn alt" id="retry-this-exam">↻ Làm lại đề này</button>
       <button class="btn" id="back-exam-hub">← Danh sách bộ đề</button>`
    )}

    <div class="score-banner ${passed ? 'pass' : ''}">
      <div class="score-circle">
        <small style="color:rgba(255,255,255,0.82)">Điểm quy đổi</small>
        <strong>${s1000}</strong>
        <small style="color:rgba(255,255,255,0.9)">/ 1000 điểm</small>
      </div>
      <div>
        <div class="eyebrow" style="color:rgba(255,255,255,0.85)">${passed ? '✓ ĐẠT NGƯỠNG KHUYẾN NGHỊ (≥ 700/1000)' : '⚠️ CHƯA ĐẠT NGƯỠNG 700 — CẦN ÔN KỸ CÂU SAI'}</div>
        <h2 style="color:#fff;margin:6px 0 8px">
          Đúng ${correctCount} / ${qs.length} câu (${pct(correctCount, qs.length)}%) · Thời gian: ${timeFmt(examElapsedSeconds)}
        </h2>
        <p style="margin:0;color:rgba(255,255,255,0.92)">
          ${
            passed
              ? 'Phong độ rất tốt! Dù đã đạt chuẩn, em vẫn nên đọc kỹ phần <b>Thầy chữa 4 bước</b> ở các câu làm sai hoặc câu phân vân bên dưới để lấp kín mọi lỗ hổng trước khi đăng ký thi thật.'
              : `Đừng lo lắng! Những câu em vừa làm sai đã được lưu tự động vào <b>Sổ tay câu sai</b>.${weakDomains.length ? ` Hãy tập trung đọc kỹ lời giải của thầy ở miền: <b>${esc(weakDomains.join(', '))}</b>.` : ''}`
          }
        </p>
      </div>
    </div>

    <div class="card section">
      <h2>📊 Phân tích năng lực theo từng Miền kỹ năng (Exam Domains)</h2>
      <div class="domain-bars">
        ${domains
          .map(dom => {
            const st = domainStats[dom];
            const dp = pct(st.correct, st.total);
            const barColor = dp >= 75 ? 'green' : dp >= 50 ? 'orange' : 'red';
            return `
              <div class="domain-row">
                <div class="row" style="margin-bottom:6px">
                  <strong>${esc(dom)}</strong>
                  <span><b>${st.correct}/${st.total}</b> câu đúng (<b>${dp}%</b>) ${dp < 70 ? '· <span style="color:#b83232;font-weight:700">Cần củng cố</span>' : '· <span style="color:#157347;font-weight:700">Vững vàng</span>'}</span>
                </div>
                ${progress(dp, barColor)}
              </div>`;
          })
          .join('')}
      </div>
    </div>

    <div class="section toolbar">
      <button class="btn ${reviewFilter === 'all' ? '' : 'alt'}" data-rev-filter="all">Tất cả (${qs.length})</button>
      <button class="btn ${reviewFilter === 'wrong' ? 'danger' : 'alt'}" data-rev-filter="wrong">✕ Câu làm sai / Bỏ trống (${wrongCount})</button>
      <button class="btn ${reviewFilter === 'flagged' ? 'warn' : 'alt'}" data-rev-filter="flagged">🚩 Câu phân vân (${flagCount})</button>
      <button class="btn ${reviewFilter === 'correct' ? 'success' : 'alt'}" data-rev-filter="correct">✓ Câu làm đúng (${correctCount})</button>
      <select class="field" id="review-domain-select">
        <option value="all">Lọc theo tất cả miền kỹ năng</option>
        ${domains.map(dom => `<option value="${esc(dom)}" ${reviewDomain === dom ? 'selected' : ''}>${esc(dom)}</option>`).join('')}
      </select>
    </div>

    <div>
      ${
        visibleQuestions.length
          ? visibleQuestions
              .map(({ q, idx }) => {
                const userChoice = examAnswers[idx];
                const hasChosen = userChoice !== undefined && userChoice !== null;
                return `
                  <div class="question-card">
                    <div class="row" style="margin-bottom:8px">
                      <div class="actions">
                        <span class="tag">Câu ${idx + 1}</span>
                        <span class="tag gray">${esc(q.domain || '')}</span>
                        ${examFlags[idx] ? '<span class="tag orange">🚩 Đã đánh dấu phân vân</span>' : ''}
                      </div>
                      <span class="tag gray">Mã câu: ${esc(q.id)}</span>
                    </div>
                    ${
                      q.caseStudy
                        ? `<details class="case-study-box"><summary>📋 Xem lại bối cảnh ${esc(q.caseStudy.title)}</summary><p style="margin:8px 0 0">${richText(q.caseStudy.context)}</p></details>`
                        : ''
                    }
                    <p style="font-weight:700;font-size:15.8px;margin:8px 0 12px">${richText(q.question)}</p>
                    <div>
                      ${q.options
                        .map((opt, oi) => {
                          const cleanOpt = String(opt).replace(/^[A-D]\.\s*/, '');
                          const cls = oi === q.answer ? 'opt-correct' : hasChosen && Number(userChoice) === oi ? 'opt-wrong' : '';
                          return `
                            <div class="quiz-option ${cls}" style="cursor:default">
                              <span>
                                <b>${String.fromCharCode(65 + oi)}.</b> ${richText(cleanOpt)}
                                ${oi === q.answer ? ' &nbsp;<b>(✓ Đáp án đúng)</b>' : ''}
                                ${hasChosen && Number(userChoice) === oi && oi !== q.answer ? ' &nbsp;<b>(✕ Lựa chọn của em)</b>' : ''}
                              </span>
                            </div>`;
                        })
                        .join('')}
                    </div>
                    ${renderWalkthroughBlock(q, userChoice, true)}
                  </div>`;
              })
              .join('')
          : '<div class="card empty">Không có câu hỏi nào khớp với bộ lọc chữa đề hiện tại.</div>'
      }
    </div>
  `;
}

function quiz() {
  if (examView === 'session') return renderExamSession();
  if (examView === 'review') return renderExamReview();
  return renderExamHub();
}

function settings() {
  return `
    ${heading('Cá nhân hóa & Bảo toàn dữ liệu', 'Cài đặt học tập')}
    <div class="two">
      <section class="card">
        <h2>Hồ sơ học viên</h2>
        <p><b>Xuất phát điểm:</b> Đã biết Python cơ bản</p>
        <p><b>Tiến độ hiện tại:</b> ${completed()}/60 bài giảng; ${state.exam.length} lượt thi thử; ${getMistakeQuestions().length} câu trong Sổ tay câu sai.</p>
        <label class="checkline">
          <input id="cert103" type="checkbox" ${state.cert103 ? 'checked' : ''}>
          <span>Tôi đã thi đỗ chứng chỉ AI-103 chính thức tại Pearson VUE / Microsoft</span>
        </label>
        <label class="checkline">
          <input id="cert500" type="checkbox" ${state.cert500 ? 'checked' : ''}>
          <span>Tôi đã thi đỗ chứng chỉ AI-500 chính thức tại Pearson VUE / Microsoft</span>
        </label>
        ${
          state.cert103 && state.cert500
            ? notice('Chúc mừng Tân Chuyên Gia Microsoft Certified: Multi-Agent AI Solutions Expert! Hãy kiểm tra chứng chỉ trên hồ sơ Microsoft Learn.', 'success')
            : notice('Các ô đánh dấu trên dùng để tự theo dõi mục tiêu cá nhân; website hoạt động độc lập offline và không kết nối tài khoản Microsoft.')
        }
        <h3 style="margin-top:22px">Liên kết chính thức Microsoft</h3>
        <p>${link('Trang chứng chỉ Multi-Agent Expert', SOURCES.cert)}</p>
        <p>${link('Study Guide AI-103', SOURCES.a103)}</p>
        <p>${link('Study Guide AI-500', SOURCES.a500)}</p>
      </section>

      <section class="card">
        <h2>Sao lưu & Khôi phục tiến độ</h2>
        <p>Toàn bộ bài đã hoàn thành, ghi chú Lab, lịch sử điểm thi và Sổ tay câu sai được lưu trong <code>localStorage</code> của trình duyệt. Hãy xuất file JSON định kỳ để lưu trữ an toàn hoặc chuyển sang máy tính khác.</p>
        <div class="actions">
          <button class="btn" id="export">⬇ Xuất dữ liệu JSON</button>
          <label class="btn alt" for="import-file" style="cursor:pointer">⬆ Nhập dữ liệu JSON</label>
          <input type="file" id="import-file" accept="application/json,.json" style="display:none">
        </div>
        <hr class="divider">
        <button class="btn danger" id="wipe">Xóa toàn bộ tiến độ học tập</button>
        <p class="help">Phiên bản web học tập offline hoàn toàn — không thu thập dữ liệu, không gửi thông tin ra ngoài máy tính của bạn.</p>
      </section>
    </div>
  `;
}

function render() {
  stopTimers();
  switch (page) {
    case 'home':
      shell(home());
      break;
    case 'curriculum':
      shell(curriculum());
      break;
    case 'lesson':
      shell(lesson());
      break;
    case 'today':
      shell(today());
      break;
    case 'calendar':
      shell(calendar());
      break;
    case 'project':
      shell(project());
      break;
    case 'quiz':
      shell(quiz());
      break;
    case 'settings':
      shell(settings());
      break;
    default:
      shell(home());
  }
  wire();
}

function wire() {
  document.querySelectorAll('[data-page]').forEach(b => (b.onclick = () => go(b.dataset.page)));
  document.querySelectorAll('[data-lesson]').forEach(b => (b.onclick = () => openLesson(b.dataset.lesson)));
  document.querySelectorAll('[data-module]').forEach(
    b =>
      (b.onclick = () => {
        filter = b.dataset.module;
        stageFilter = 'all';
        bookmarkedOnly = false;
        go('curriculum');
      })
  );

  if (page === 'curriculum') {
    const input = document.getElementById('filter');
    input.oninput = () => {
      filter = input.value;
      document.getElementById('results').innerHTML = lessonList(getFilteredLessons());
      document.querySelectorAll('[data-lesson]').forEach(b => (b.onclick = () => openLesson(b.dataset.lesson)));
    };
    document.getElementById('stage').onchange = e => {
      stageFilter = e.target.value;
      go('curriculum');
    };
    document.getElementById('toggle-bookmark-filter').onclick = () => {
      bookmarkedOnly = !bookmarkedOnly;
      go('curriculum');
    };
    document.getElementById('reset-filter').onclick = () => {
      filter = '';
      stageFilter = 'all';
      bookmarkedOnly = false;
      go('curriculum');
    };
  }

  if (page === 'lesson') {
    const l = current();
    const d = window.LESSON_DETAILS && window.LESSON_DETAILS[l.id];
    const qList = getLessonQuestions(l);

    document.getElementById('back-curriculum').onclick = () => go('curriculum');
    document.getElementById('bookmark-lesson').onclick = () => {
      state.bookmarks[l.id] = !state.bookmarks[l.id];
      if (!state.bookmarks[l.id]) delete state.bookmarks[l.id];
      save();
      render();
    };

    const prevHandler = () => {
      const p = LESSONS[l.global - 1];
      if (p) openLesson(p.id);
    };
    const nextHandler = () => {
      const n = LESSONS[l.global + 1];
      if (n) openLesson(n.id);
    };
    if (document.getElementById('prev-top')) document.getElementById('prev-top').onclick = prevHandler;
    if (document.getElementById('next-top')) document.getElementById('next-top').onclick = nextHandler;
    if (document.getElementById('prev-side')) document.getElementById('prev-side').onclick = prevHandler;
    if (document.getElementById('next')) document.getElementById('next').onclick = nextHandler;

    const copyBtn = document.getElementById('copy-code');
    if (copyBtn) {
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(d?.code || l.sample);
          copyBtn.textContent = '✓ Đã sao chép!';
          setTimeout(() => (copyBtn.textContent = '📋 Sao chép code'), 1800);
        } catch (err) {
          alert('Trình duyệt không cho phép copy tự động, em hãy bôi đen đoạn code nhé.');
        }
      };
    }

    document.querySelectorAll('[data-check]').forEach(b => {
      b.onchange = () => {
        const arr = Array.from(document.querySelectorAll('[data-check]:checked')).map(x => +x.dataset.check);
        state.checks[l.id] = arr;
        state.notes[l.id] = document.getElementById('lesson-note').value;
        save();
        render();
      };
    });

    document.getElementById('save-note').onclick = () => {
      state.notes[l.id] = document.getElementById('lesson-note').value;
      record('notes', l.id);
      alert('Đã lưu ghi chú bài học trong trình duyệt này.');
    };

    document.querySelectorAll('input[name^="lquiz_"]').forEach(el => {
      el.onchange = () => {
        const qi = +el.name.replace('lquiz_', '');
        if (!state.lessonQuizAnswers[l.id]) state.lessonQuizAnswers[l.id] = {};
        state.lessonQuizAnswers[l.id][qi] = +el.value;
        save();
      };
    });

    document.getElementById('grade-one').onclick = () => {
      const ansObj = state.lessonQuizAnswers[l.id] || {};
      if (Object.keys(ansObj).length < qList.length) {
        alert(`Em hãy chọn đáp án cho đủ cả ${qList.length} câu hỏi trước khi bấm chấm nhé!`);
        return;
      }
      let right = 0;
      qList.forEach((q, qi) => {
        if (Number(ansObj[qi]) === q.answer) right++;
      });
      const ok = right === qList.length;
      state.quiz[l.id] = { ok, score: right, total: qList.length, at: new Date().toISOString() };
      lessonQuizGraded[l.id] = true;
      state.notes[l.id] = document.getElementById('lesson-note').value;
      record('quiz', l.id);
      const scrollY = window.scrollY;
      render();
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };

    document.getElementById('complete').onclick = () => {
      if ((state.checks[l.id] || []).length !== 3 || !state.quiz[l.id]?.ok) return;
      if (!state.done[l.id]) {
        state.done[l.id] = new Date().toISOString();
        record('completed', l.id);
      }
      openLesson(LESSONS[l.global + 1]?.id || l.id);
    };
  }

  if (page === 'today') {
    document.getElementById('goal').onchange = e => {
      state.dailyGoal = +e.target.value;
      save();
      go('today');
    };
    const goMistakes = document.getElementById('go-mistakes-today');
    if (goMistakes) {
      goMistakes.onclick = () => {
        examView = 'hub';
        examCertFilter = 'mistakes';
        go('quiz');
      };
    }
    document.getElementById('timer-start').onclick = () => {
      if (timerOn) {
        clearInterval(timer);
        timer = null;
        timerOn = false;
        document.getElementById('timer-start').textContent = 'Tiếp tục';
        return;
      }
      timerOn = true;
      document.getElementById('timer-start').textContent = 'Tạm dừng';
      timer = setInterval(() => {
        timerSeconds--;
        const el = document.getElementById('timer');
        if (el) el.textContent = timeFmt(timerSeconds);
        if (timerSeconds <= 0) {
          clearInterval(timer);
          timer = null;
          timerOn = false;
          state.studyMinutes += 25;
          record('pomodoro', '');
          alert('Tuyệt vời! Em vừa hoàn thành một phiên học tập trung 25 phút.');
          timerSeconds = 25 * 60;
          go('today');
        }
      }, 1000);
    };
    document.getElementById('timer-reset').onclick = () => {
      timerSeconds = 25 * 60;
      go('today');
    };
  }

  if (page === 'quiz') {
    if (examView === 'hub') {
      document.querySelectorAll('[data-cert-tab]').forEach(btn => {
        btn.onclick = () => {
          examCertFilter = btn.dataset.certTab;
          render();
        };
      });
      document.querySelectorAll('[data-start-exam]').forEach(btn => {
        btn.onclick = () => {
          const ex = getAllExamSets().find(x => x.id === btn.dataset.startExam);
          if (ex) startExamSession(ex, btn.dataset.mode || 'timed');
        };
      });
      const drillBtn = document.getElementById('start-mistake-drill');
      if (drillBtn) {
        drillBtn.onclick = () => {
          const mq = getMistakeQuestions();
          if (!mq.length) return;
          startExamSession(
            {
              id: 'mistake-drill',
              cert: 'Tổng hợp',
              title: 'Đề Phục Thù — Chinh phục lại các câu từng làm sai',
              durationMinutes: Math.max(15, mq.length * 2),
              passingScore: 700,
              isMistakeDrill: true,
              questions: mq
            },
            'practice'
          );
        };
      }
      const clearMistakes = document.getElementById('clear-all-mistakes');
      if (clearMistakes) {
        clearMistakes.onclick = () => {
          if (confirm('Xóa toàn bộ câu hỏi trong Sổ tay câu sai?')) {
            state.mistakes = {};
            save();
            render();
          }
        };
      }
      document.querySelectorAll('[data-remove-mistake]').forEach(btn => {
        btn.onclick = () => {
          delete state.mistakes[btn.dataset.removeMistake];
          save();
          render();
        };
      });
    } else if (examView === 'session') {
      if (examRunMode === 'timed' && !examTimer) {
        examTimer = setInterval(() => {
          examSecondsLeft--;
          const clock = document.getElementById('exam-clock');
          if (clock) {
            clock.textContent = timeFmt(examSecondsLeft);
            if (examSecondsLeft < 300) clock.style.color = '#c93535';
          }
          if (examSecondsLeft <= 0) {
            clearInterval(examTimer);
            examTimer = null;
            alert('Hết thời gian làm bài! Hệ thống sẽ tự động nộp bài và mở phần Thầy chữa đề chi tiết.');
            submitActiveExam(true);
          }
        }, 1000);
      }

      document.getElementById('toggle-exam-layout').onclick = () => {
        examSingleMode = !examSingleMode;
        render();
      };
      document.getElementById('exit-exam').onclick = () => {
        if (confirm('Thoát khỏi phòng thi hiện tại? (Kết quả lượt đang làm dở sẽ không lưu)')) {
          if (examTimer) {
            clearInterval(examTimer);
            examTimer = null;
          }
          examView = 'hub';
          render();
          window.scrollTo(0, 0);
        }
      };

      document.querySelectorAll('input[name^="exam_q_"]').forEach(el => {
        el.onchange = () => {
          const idx = +el.name.replace('exam_q_', '');
          examAnswers[idx] = +el.value;
          const scrollPos = window.scrollY;
          render();
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        };
      });

      document.querySelectorAll('[data-flag]').forEach(btn => {
        btn.onclick = () => {
          const idx = +btn.dataset.flag;
          examFlags[idx] = !examFlags[idx];
          const scrollPos = window.scrollY;
          render();
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        };
      });

      document.querySelectorAll('[data-reveal]').forEach(btn => {
        btn.onclick = () => {
          const idx = +btn.dataset.reveal;
          examRevealed[idx] = !examRevealed[idx];
          const scrollPos = window.scrollY;
          render();
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        };
      });

      document.querySelectorAll('[data-jump]').forEach(btn => {
        btn.onclick = () => {
          const idx = +btn.dataset.jump;
          if (examSingleMode) {
            examCurrentIdx = idx;
            render();
            window.scrollTo(0, 0);
          } else {
            const card = document.getElementById('qcard-' + idx);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        };
      });

      if (document.getElementById('exam-prev')) {
        document.getElementById('exam-prev').onclick = () => {
          if (examCurrentIdx > 0) {
            examCurrentIdx--;
            render();
            window.scrollTo(0, 0);
          }
        };
      }
      if (document.getElementById('exam-next')) {
        document.getElementById('exam-next').onclick = () => {
          if (examCurrentIdx < activeExam.questions.length - 1) {
            examCurrentIdx++;
            render();
            window.scrollTo(0, 0);
          }
        };
      }
      if (document.getElementById('submit-exam-bottom')) {
        document.getElementById('submit-exam-bottom').onclick = () => submitActiveExam(false);
      }
      document.getElementById('submit-exam').onclick = () => submitActiveExam(false);
    } else if (examView === 'review') {
      document.getElementById('back-exam-hub').onclick = () => {
        examView = 'hub';
        render();
        window.scrollTo(0, 0);
      };
      document.getElementById('retry-this-exam').onclick = () => {
        startExamSession(activeExam, examRunMode);
      };
      document.querySelectorAll('[data-rev-filter]').forEach(btn => {
        btn.onclick = () => {
          reviewFilter = btn.dataset.revFilter;
          const scrollPos = window.scrollY;
          render();
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        };
      });
      const domSel = document.getElementById('review-domain-select');
      if (domSel) {
        domSel.onchange = e => {
          reviewDomain = e.target.value;
          const scrollPos = window.scrollY;
          render();
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        };
      }
    }
  }

  if (page === 'settings') {
    document.getElementById('cert103').onchange = e => {
      state.cert103 = e.target.checked;
      save();
      go('settings');
    };
    document.getElementById('cert500').onchange = e => {
      state.cert500 = e.target.checked;
      save();
      go('settings');
    };
    document.getElementById('export').onclick = () => {
      const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), progress: state }, null, 2)], {
        type: 'application/json'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ai500-progress-' + dateKey(new Date()) + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    document.getElementById('import-file').onchange = async e => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || (data.version !== 1 && data.version !== 2) || typeof data.progress !== 'object' || !data.progress.done || !data.progress.checks) {
          throw Error('Sai định dạng file sao lưu');
        }
        if (!confirm('Nhập dữ liệu này sẽ ghi đè toàn bộ tiến độ hiện tại. Tiếp tục?')) return;
        state = { ...defaultState(), ...data.progress };
        save();
        go('settings');
      } catch (err) {
        alert('Không thể nhập: ' + err.message);
      }
    };
    document.getElementById('wipe').onclick = () => {
      if (confirm('Bạn chắc chắn muốn xóa toàn bộ tiến độ, ghi chú, lịch sử thi và sổ tay câu sai?') && confirm('Xác nhận lần cuối?')) {
        state = defaultState();
        save();
        go('home');
      }
    };
  }
}

render();
