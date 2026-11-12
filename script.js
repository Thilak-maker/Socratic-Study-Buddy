<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Socratic Study Buddy — Adaptive AI Tutor</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <!-- Font Awesome for crisp educational & UI icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              900: '#312e81',
            },
          },
        },
      },
    };
  </script>

  <style>
    /* Custom scrollbar for smooth chat & inspector reading */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    @keyframes pulseDot {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    .typing-dot {
      animation: pulseDot 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col">

  <!-- Toast Notification Banner (Replaces alert()) -->
  <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- Top Navigation Header -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      <!-- Brand Identity -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
          <i class="fa-solid fa-owl text-lg"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">Socratic Study Buddy</h1>
            <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Prompt Engine
            </span>
          </div>
          <p class="text-xs text-slate-500 hidden md:block">Guided discovery instead of passive answers</p>
        </div>
      </div>

      <!-- Right Controls: Mastery Meter + Prompt Inspector Toggle -->
      <div class="flex items-center gap-3 sm:gap-5">
        <!-- Mastery Meter -->
        <div class="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-3">
          <div class="flex flex-col">
            <div class="flex items-center justify-between gap-3 text-xs font-semibold">
              <span class="text-slate-600 flex items-center gap-1">
                <i class="fa-solid fa-fire text-amber-500"></i> Mastery
              </span>
              <span id="mastery-percent" class="text-indigo-600 font-bold">0%</span>
            </div>
            <div class="w-24 sm:w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div id="mastery-bar" class="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full transition-all duration-500" style="width: 0%;"></div>
            </div>
          </div>
          <span id="mastery-badge" class="hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
            Novice
          </span>
        </div>

        <!-- Prompt Engineering Inspector Button -->
        <button
          id="toggle-inspector-btn"
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition shadow-sm"
          title="Inspect the live System Prompts & JSON Schemas"
        >
          <i class="fa-solid fa-code text-indigo-400"></i>
          <span class="hidden sm:inline">Prompt Inspector</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Workspace Grid -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

    <!-- LEFT COLUMN: Study Material & Sample Topics (4 cols on lg) -->
    <aside class="lg:col-span-4 flex flex-col gap-5">
      <!-- Study Notes Card -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-book-open text-indigo-600"></i>
            Study Material
          </h2>
          <button
            id="clear-notes-btn"
            type="button"
            class="text-xs font-medium text-slate-400 hover:text-rose-600 transition"
          >
            Clear
          </button>
        </div>

        <!-- Quick Sample Topic Pills -->
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Load Sample Notes:</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              data-sample="photosynthesis"
              class="sample-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-leaf"></i> Photosynthesis
            </button>
            <button
              type="button"
              data-sample="revolution"
              class="sample-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-landmark"></i> American Revolution
            </button>
            <button
              type="button"
              data-sample="python"
              class="sample-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition flex items-center gap-1.5"
            >
              <i class="fa-brands fa-python"></i> Python Loops
            </button>
          </div>
        </div>

        <!-- Textarea for Notes -->
        <div class="flex flex-col gap-1.5">
          <label for="study-notes-input" class="text-xs font-medium text-slate-600">
            Paste class notes, an article, or a textbook excerpt:
          </label>
          <textarea
            id="study-notes-input"
            rows="9"
            placeholder="Paste your study notes here, or click one of the sample topics above to begin..."
            class="w-full rounded-xl border border-slate-300 bg-slate-50/70 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-y leading-relaxed"
          ></textarea>
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span id="char-count">0 characters</span>
            <span>Grounded strictly on your notes</span>
          </div>
        </div>

        <!-- Start / Reset Session Button -->
        <button
          id="start-session-btn"
          type="button"
          class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>Start Socratic Session</span>
        </button>
      </section>

      <!-- How Socratic Prompting Works Card -->
      <section class="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <h3 class="text-sm font-bold flex items-center gap-2 text-indigo-200 mb-2">
          <i class="fa-solid fa-brain"></i>
          Why Socratic AI Works
        </h3>
        <ul class="space-y-2 text-xs text-slate-300 leading-relaxed">
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check-circle text-emerald-400 mt-0.5"></i>
            <span><strong class="text-white">Zero Spoiler Policy:</strong> The system prompt forbids giving away direct answers prematurely.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check-circle text-emerald-400 mt-0.5"></i>
            <span><strong class="text-white">Bloom's Taxonomy Scaling:</strong> Questions adapt from basic recall to deeper synthesis as your mastery rises.</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fa-solid fa-check-circle text-emerald-400 mt-0.5"></i>
            <span><strong class="text-white">Active Recall:</strong> Explaining concepts in Feynman Mode exposes blind spots immediately.</span>
          </li>
        </ul>
      </section>
    </aside>

    <!-- RIGHT COLUMN: Interactive Study Modes (8 cols on lg) -->
    <section class="lg:col-span-8 flex flex-col gap-4">

      <!-- Mode Switcher Tabs -->
      <div class="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 gap-1.5">
        <button
          type="button"
          data-mode="tutor"
          class="mode-tab active-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition bg-indigo-600 text-white shadow-sm"
        >
          <i class="fa-solid fa-comments"></i>
          <span>1. Socratic Tutor</span>
        </button>
        <button
          type="button"
          data-mode="feynman"
          class="mode-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition text-slate-600 hover:bg-slate-100"
        >
          <i class="fa-solid fa-chalkboard-user"></i>
          <span>2. Feynman Mode</span>
        </button>
        <button
          type="button"
          data-mode="quiz"
          class="mode-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition text-slate-600 hover:bg-slate-100"
        >
          <i class="fa-solid fa-bolt"></i>
          <span>3. Mnemonics & Quiz</span>
        </button>
      </div>

      <!-- ========================================================= -->
      <!-- MODE 1: SOCRATIC TUTOR CHAT                               -->
      <!-- ========================================================= -->
      <div id="panel-tutor" class="mode-panel bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
        <!-- Chat Subheader -->
        <div class="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/60 rounded-t-2xl">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs sm:text-sm font-bold text-slate-800">Adaptive Socratic Dialogue</span>
            <span id="difficulty-pill" class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              Level: Recall
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              id="request-hint-btn"
              type="button"
              disabled
              class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-lightbulb text-amber-500"></i>
              <span>Need a Hint</span>
            </button>
          </div>
        </div>

        <!-- Chat Messages Scroll Container -->
        <div id="chat-messages" class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Empty State Welcome -->
          <div id="chat-empty-state" class="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-4 border border-indigo-100">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-1">Ready to test your understanding?</h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-5">
              Load a sample topic or paste your own notes on the left, then click <strong class="text-indigo-600">Start Socratic Session</strong>. I won't give you the answers—I'll help you discover them!
            </p>
            <button
              type="button"
              onclick="loadSampleAndStart('photosynthesis')"
              class="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition"
            >
              Try Quick Demo: Photosynthesis →
            </button>
          </div>
        </div>

        <!-- Chat Input Footer -->
        <form id="chat-form" class="p-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl flex items-center gap-2.5">
          <input
            id="chat-input"
            type="text"
            disabled
            placeholder="Start a session first, then type your answer here..."
            class="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed transition"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled
            class="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition flex items-center gap-2 shrink-0"
          >
            <span>Reply</span>
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>

      <!-- ========================================================= -->
      <!-- MODE 2: FEYNMAN TECHNIQUE MODE                            -->
      <!-- ========================================================= -->
      <div id="panel-feynman" class="mode-panel hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-chalkboard-user text-indigo-600"></i>
              The Feynman Technique
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              "If you can't explain it simply, you don't understand it well enough." Teach the concept from your notes in plain language.
            </p>
          </div>
          <button
            id="feynman-prompt-btn"
            type="button"
            class="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition shrink-0"
          >
            <i class="fa-solid fa-shuffle mr-1"></i> Pick Concept to Explain
          </button>
        </div>

        <!-- Target Concept Banner -->
        <div id="feynman-target-box" class="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Your Teaching Prompt:</span>
          <p id="feynman-target-text" class="text-sm font-semibold text-slate-800 mt-1">
            Explain the main ideas from your study notes as if you were teaching a 12-year-old student.
          </p>
        </div>

        <!-- Student Explanation Input -->
        <div class="flex flex-col gap-2">
          <label for="feynman-input" class="text-xs font-semibold text-slate-700">
            Your Explanation (in your own words):
          </label>
          <textarea
            id="feynman-input"
            rows="5"
            placeholder="Write your explanation here without looking too closely at the jargon in your notes..."
            class="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          ></textarea>
          <div class="flex justify-end">
            <button
              id="evaluate-feynman-btn"
              type="button"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
            >
              <i class="fa-solid fa-magnifying-glass-chart"></i>
              <span>Grade My Explanation</span>
            </button>
          </div>
        </div>

        <!-- Structured Evaluation Results -->
        <div id="feynman-results" class="hidden space-y-4 pt-2 border-t border-slate-100">
          <!-- Scores Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-emerald-800 uppercase">Factual Accuracy</span>
                <span id="feynman-accuracy-score" class="text-lg font-extrabold text-emerald-700">0/100</span>
              </div>
              <div class="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div id="feynman-accuracy-bar" class="h-full bg-emerald-600 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
            <div class="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-sky-800 uppercase">Clarity & Simplicity</span>
                <span id="feynman-clarity-score" class="text-lg font-extrabold text-sky-700">0/100</span>
              </div>
              <div class="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
                <div id="feynman-clarity-bar" class="h-full bg-sky-600 rounded-full transition-all duration-500" style="width: 0%"></div>
              </div>
            </div>
          </div>

          <!-- Detailed Feedback Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 flex items-center gap-1.5">
                <i class="fa-solid fa-star"></i> What You Nailed
              </h4>
              <ul id="feynman-strengths" class="text-sm text-slate-700 space-y-1.5 list-disc pl-4"></ul>
            </div>
            <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2 flex items-center gap-1.5">
                <i class="fa-solid fa-triangle-exclamation"></i> Knowledge Gaps & Jargon Alerts
              </h4>
              <ul id="feynman-gaps" class="text-sm text-slate-700 space-y-1.5 list-disc pl-4"></ul>
            </div>
          </div>

          <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-1">
              <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Tutor's Reframing Tip:
            </h4>
            <p id="feynman-tip" class="text-sm text-indigo-950 leading-relaxed"></p>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- MODE 3: MNEMONIC & QUICK QUIZ GENERATOR                   -->
      <!-- ========================================================= -->
      <div id="panel-quiz" class="mode-panel hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-bolt text-amber-500"></i>
              Mnemonic & Active Quiz Builder
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Structured JSON prompt engineering converts your notes into sticky memory tricks and diagnostic questions.
            </p>
          </div>
          <button
            id="generate-quiz-btn"
            type="button"
            class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 shrink-0"
          >
            <i class="fa-solid fa-sparkles"></i>
            <span>Generate Mnemonics & Quiz</span>
          </button>
        </div>

        <!-- Loading Skeleton for Quiz Mode -->
        <div id="quiz-loading" class="hidden py-12 flex flex-col items-center justify-center text-center">
          <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p class="text-sm font-semibold text-slate-700">Engineering mnemonics & diagnostic questions...</p>
          <p class="text-xs text-slate-400 mt-1">Using structured JSON schema output</p>
        </div>

        <!-- Empty State for Quiz Mode -->
        <div id="quiz-empty" class="py-10 text-center max-w-md mx-auto">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl mx-auto mb-3 border border-amber-100">
            <i class="fa-solid fa-lightbulb"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800">No Quiz Generated Yet</h4>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Make sure you have study notes loaded on the left, then click <strong>Generate Mnemonics & Quiz</strong>.
          </p>
        </div>

        <!-- Populated Quiz & Mnemonic Content -->
        <div id="quiz-content" class="hidden space-y-6">
          <!-- Mnemonics Section -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-1.5">
              <i class="fa-solid fa-brain"></i> Sticky Memory Tricks (Mnemonics)
            </h4>
            <div id="mnemonics-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3"></div>
          </div>

          <!-- Interactive Quiz Section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <i class="fa-solid fa-list-check text-emerald-600"></i> Diagnostic Practice Quiz
              </h4>
              <span id="quiz-score-pill" class="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Score: 0 / 0
              </span>
            </div>
            <div id="quiz-questions-list" class="space-y-4"></div>
          </div>
        </div>
      </div>

    </section>
  </main>

  <!-- ========================================================= -->
  <!-- PROMPT ENGINEERING INSPECTOR MODAL / DRAWER               -->
  <!-- ========================================================= -->
  <div id="inspector-modal" class="fixed inset-0 z-50 hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div class="flex items-center gap-2.5">
          <i class="fa-solid fa-terminal text-indigo-400"></i>
          <div>
            <h3 class="text-sm sm:text-base font-bold text-white">Prompt Engineering Inspector</h3>
            <p class="text-[11px] text-slate-400">Live view of the System Instructions & JSON Schemas powering the active mode</p>
          </div>
        </div>
        <button id="close-inspector-btn" type="button" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-5 font-mono text-xs">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-indigo-400 font-bold uppercase tracking-wider">1. Active Mode & Model</span>
            <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">gemini-3-flash-preview</span>
          </div>
          <div id="inspector-mode-desc" class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-300 leading-relaxed"></div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-amber-400 font-bold uppercase tracking-wider">2. System Instruction (Persona & Guardrails)</span>
            <button id="copy-prompt-btn" type="button" class="text-[11px] text-slate-400 hover:text-white underline">
              Copy Prompt
            </button>
          </div>
          <pre id="inspector-system-prompt" class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto"></pre>
        </div>

        <div>
          <span class="text-sky-400 font-bold uppercase tracking-wider block mb-2">3. Structured JSON Output Schema</span>
          <pre id="inspector-schema" class="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sky-300 whitespace-pre-wrap leading-relaxed overflow-x-auto"></pre>
        </div>
      </div>
    </div>
  </div>

  <!-- Application Logic -->
  <script>
    // =========================================================================
    // 1. SAMPLE STUDY NOTES REPOSITORY
    // =========================================================================
    const SAMPLE_NOTES = {
      photosynthesis: `Photosynthesis is the biochemical process used by plants, algae, and certain bacteria to convert light energy into chemical energy stored in glucose. It takes place primarily in the chloroplasts of plant leaves, which contain the green pigment chlorophyll.

The overall balanced chemical equation is:
6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2

Photosynthesis occurs in two main stages:
1. Light-Dependent Reactions (in the thylakoid membranes): Chlorophyll absorbs sunlight, exciting electrons and splitting water molecules (photolysis) to release oxygen (O2) as a byproduct. This generates energy-carrying molecules: ATP and NADPH.
2. The Calvin Cycle / Light-Independent Reactions (in the stroma): Uses ATP and NADPH from the first stage to fix carbon dioxide (CO2) from the atmosphere into organic sugar molecules (G3P, which forms glucose) via the enzyme RuBisCO.`,

      revolution: `The American Revolution (1775–1783) was a political and military struggle in which thirteen British colonies in North America won independence to form the United States of America.

Key Causes:
- After the French and Indian War (1754–1763), Britain faced massive war debt and imposed direct taxes on the colonies without colonial representation in Parliament ("No taxation without representation").
- Major acts included the Stamp Act (1765), Townshend Acts (1767), and Tea Act (1773), which sparked protests like the Boston Tea Party.
- Enlightenment ideas (such as John Locke's natural rights: life, liberty, and property) inspired colonial leaders.

Turning Points:
- Battles of Lexington and Concord (April 1775) marked the outbreak of armed conflict.
- Declaration of Independence (July 4, 1776), primarily drafted by Thomas Jefferson.
- Battle of Saratoga (1777) convinced France to formally ally with the Americans, providing crucial naval and financial support.
- Siege of Yorktown (1781) led to British General Cornwallis's surrender, culminating in the Treaty of Paris (1783).`,

      python: `Loops in Python allow programmers to execute a block of code repeatedly without duplicating code. Python provides two primary loop constructs:

1. 'for' Loops: Used for iterating over a sequence (such as a list, tuple, string, or range).
   Example:
   for i in range(5):
       print(i)  # Prints 0 through 4

2. 'while' Loops: Repeats a block of code as long as a specified boolean condition evaluates to True. If the condition never becomes False, it creates an infinite loop.

Loop Control Statements:
- 'break': Immediately exits the loop entirely, regardless of remaining iterations.
- 'continue': Skips the rest of the current iteration and jumps straight to the next iteration.
- 'else' clause on loops: Executes only if the loop finished normally (i.e., was NOT terminated by a 'break' statement).`
    };

    // =========================================================================
    // 2. PROMPT ENGINEERING BLUEPRINTS (Displayed in Inspector & Sent to API)
    // =========================================================================
    const PROMPT_BLUEPRINTS = {
      tutor: {
        description: "Uses Pedagogical Chain-of-Thought + Structured JSON Output. The model evaluates the student's reply internally before formulating a single guiding question, never revealing the final answer directly.",
        systemPrompt: `You are "Socratic Study Buddy", an encouraging, patient, and sharp Socratic tutor.
CRITICAL RULES:
1. NEVER give away the direct answer to a question you asked, even if the student says "I don't know". Instead, break the concept down into a smaller, simpler stepping-stone question or give a subtle analogy.
2. Ground all questions strictly in the user's provided STUDY NOTES.
3. Ask ONLY ONE clear, focused question at a time so the student isn't overwhelmed.
4. Evaluate the student's latest message:
   - Praise accurate reasoning specifically.
   - Gently pinpoint misconceptions without lecturing.
   - Adjust the "masteryDelta" (-5 to +20) based on demonstrated understanding.
   - Progress difficulty smoothly across Bloom's Taxonomy: "Recall" -> "Comprehension" -> "Application" -> "Synthesis".`,
        schema: `{
  "tutorReply": "Encouraging feedback + ONE guiding Socratic question",
  "hint": "A subtle progressive clue for the current question without spoiling the answer",
  "masteryDelta": 12,
  "bloomLevel": "Recall | Comprehension | Application | Synthesis"
}`
      },
      feynman: {
        description: "Implements the Feynman Technique rubric. Compares the student's plain-language explanation against the source notes to detect jargon reliance, factual inaccuracies, and missing causal links.",
        systemPrompt: `You are an expert evaluator trained in Richard Feynman's learning technique.
Analyze the student's explanation against the provided STUDY NOTES.
1. Score "accuracy" (0-100) based on factual alignment with the notes.
2. Score "clarity" (0-100) based on simple, jargon-free language and intuitive flow.
3. Identify 2-3 specific things the student explained well ("strengths").
4. Identify 1-3 missing concepts, logical leaps, or unexplained buzzwords ("gaps").
5. Provide a concise "reframingTip" showing a crisp analogy or simpler way to connect the trickiest part.`,
        schema: `{
  "accuracy": 85,
  "clarity": 78,
  "strengths": ["Clear explanation of inputs and outputs"],
  "gaps": ["Forgot to mention the role of ATP/NADPH"],
  "reframingTip": "Try comparing chlorophyll to a solar panel..."
}`
      },
      quiz: {
        description: "Generates high-retention memory hooks (acronyms, vivid associations) alongside diagnostic multiple-choice questions where every distractor option has a targeted explanation.",
        systemPrompt: `You are a cognitive science instructional designer. Based strictly on the provided STUDY NOTES:
1. Create 2 memorable mnemonics (acronyms, rhymes, or vivid mental hooks) for key facts or sequences in the notes.
2. Create 3 diagnostic multiple-choice questions that test genuine understanding (not trivial word matching).
3. Provide a clear explanation for why the correct option is right and why common misconceptions fail.`,
        schema: `{
  "mnemonics": [
    { "title": "Acronym Name", "trick": "Catchy phrase", "meaning": "What each letter stands for" }
  ],
  "questions": [
    {
      "question": "Scenario or concept question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Why B is correct and A/C/D are incorrect."
    }
  ]
}`
      }
    };

    // =========================================================================
    // 3. APPLICATION STATE
    // =========================================================================
    const state = {
      activeMode: 'tutor', // 'tutor' | 'feynman' | 'quiz'
      notes: '',
      mastery: 0,
      bloomLevel: 'Recall',
      chatHistory: [], // { role: 'user' | 'model', text: string }
      currentHint: '',
      sessionActive: false,
      isLoading: false,
      quizScore: 0,
      quizAnswered: 0,
      quizTotal: 0
    };

    // =========================================================================
    // 4. GEMINI API HELPER WITH EXPONENTIAL BACKOFF
    // =========================================================================
    async function callGeminiStructured({ systemInstruction, contents, responseSchema, temperature = 0.7 }) {
      const apiKey = ""; // Runtime-injected in Canvas environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature,
          responseMimeType: "application/json",
          responseSchema
        }
      };

      const maxRetries = 4;
      let delay = 1000;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            if (response.status === 429 || response.status >= 500) {
              throw new Error(`HTTP ${response.status}`);
            }
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Request failed (${response.status})`);
          }

          const result = await response.json();
          const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) {
            throw new Error("Empty response from AI tutor.");
          }
          return JSON.parse(rawText);
        } catch (err) {
          if (attempt === maxRetries) {
            throw err;
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }

    // =========================================================================
    // 5. UI UTILITIES (Toasts, Mastery Updates, Inspector Sync)
    // =========================================================================
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      const styles = {
        info: 'bg-slate-900 text-white border-slate-700',
        success: 'bg-emerald-600 text-white border-emerald-500',
        warning: 'bg-amber-500 text-slate-950 border-amber-400',
        error: 'bg-rose-600 text-white border-rose-500'
      };
      const icons = {
        info: 'fa-circle-info',
        success: 'fa-circle-check',
        warning: 'fa-lightbulb',
        error: 'fa-circle-exclamation'
      };

      toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-xs sm:text-sm font-semibold transition-all duration-300 transform translate-y-0 ${styles[type] || styles.info}`;
      toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${escapeHtml(message)}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        setTimeout(() => toast.remove(), 300);
      }, 3600);
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function updateMastery(delta) {
      state.mastery = Math.max(0, Math.min(100, state.mastery + delta));
      document.getElementById('mastery-percent').textContent = `${state.mastery}%`;
      document.getElementById('mastery-bar').style.width = `${state.mastery}%`;

      const badge = document.getElementById('mastery-badge');
      if (state.mastery >= 85) {
        badge.textContent = 'Master';
        badge.className = 'hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200';
      } else if (state.mastery >= 55) {
        badge.textContent = 'Proficient';
        badge.className = 'hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200';
      } else if (state.mastery >= 25) {
        badge.textContent = 'Apprentice';
        badge.className = 'hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200';
      } else {
        badge.textContent = 'Novice';
        badge.className = 'hidden lg:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200';
      }
    }

    function syncPromptInspector() {
      const bp = PROMPT_BLUEPRINTS[state.activeMode];
      document.getElementById('inspector-mode-desc').textContent = bp.description;
      document.getElementById('inspector-system-prompt').textContent = bp.systemPrompt;
      document.getElementById('inspector-schema').textContent = bp.schema;
    }

    // =========================================================================
    // 6. MODE 1: SOCRATIC TUTOR CHAT LOGIC
    // =========================================================================
    function appendChatMessage(sender, text, isHint = false) {
      const container = document.getElementById('chat-messages');
      const emptyState = document.getElementById('chat-empty-state');
      if (emptyState) emptyState.remove();

      const wrapper = document.createElement('div');
      wrapper.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start items-start gap-3';

      if (sender === 'user') {
        wrapper.innerHTML = `
          <div class="max-w-[82%] bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
            ${escapeHtml(text)}
          </div>
        `;
      } else if (isHint) {
        wrapper.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
            <i class="fa-solid fa-lightbulb text-xs"></i>
          </div>
          <div class="max-w-[85%] bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">Progressive Hint</span>
            ${escapeHtml(text)}
          </div>
        `;
      } else {
        wrapper.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
            <i class="fa-solid fa-owl text-xs"></i>
          </div>
          <div class="max-w-[85%] bg-slate-100 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
            ${escapeHtml(text)}
          </div>
        `;
      }

      container.appendChild(wrapper);
      container.scrollTop = container.scrollHeight;
    }

    function setTypingIndicator(show) {
      const container = document.getElementById('chat-messages');
      const existing = document.getElementById('typing-indicator');
      if (existing) existing.remove();

      if (show) {
        const el = document.createElement('div');
        el.id = 'typing-indicator';
        el.className = 'flex justify-start items-center gap-3';
        el.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-owl text-xs"></i>
          </div>
          <div class="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></span>
            <span class="w-2 h-2 rounded-full bg-indigo-500 typing-dot"></span>
          </div>
        `;
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
      }
    }

    async function startSocraticSession() {
      const notesVal = document.getElementById('study-notes-input').value.trim();
      if (notesVal.length < 30) {
        showToast('Please paste at least a short paragraph of study notes first!', 'warning');
        document.getElementById('study-notes-input').focus();
        return;
      }

      state.notes = notesVal;
      state.chatHistory = [];
      state.sessionActive = true;
      state.bloomLevel = 'Recall';
      document.getElementById('difficulty-pill').textContent = 'Level: Recall';

      // Reset chat UI
      const chatContainer = document.getElementById('chat-messages');
      chatContainer.innerHTML = '';

      const chatInput = document.getElementById('chat-input');
      const chatSendBtn = document.getElementById('chat-send-btn');
      const hintBtn = document.getElementById('request-hint-btn');

      chatInput.disabled = true;
      chatSendBtn.disabled = true;
      hintBtn.disabled = true;
      setTypingIndicator(true);

      const tutorSchema = {
        type: "OBJECT",
        properties: {
          tutorReply: { type: "STRING" },
          hint: { type: "STRING" },
          masteryDelta: { type: "INTEGER" },
          bloomLevel: { type: "STRING" }
        },
        required: ["tutorReply", "hint", "masteryDelta", "bloomLevel"]
      };

      const initialPrompt = `Here are my STUDY NOTES:\n"""\n${state.notes}\n"""\n\nGreet me briefly and ask your very first foundational Socratic question to check my initial understanding. Remember: NEVER give away the answer.`;

      try {
        const res = await callGeminiStructured({
          systemInstruction: PROMPT_BLUEPRINTS.tutor.systemPrompt,
          contents: [{ role: 'user', parts: [{ text: initialPrompt }] }],
          responseSchema: tutorSchema
        });

        setTypingIndicator(false);
        appendChatMessage('model', res.tutorReply);
        state.currentHint = res.hint;
        state.chatHistory.push(
          { role: 'user', parts: [{ text: initialPrompt }] },
          { role: 'model', parts: [{ text: JSON.stringify(res) }] }
        );

        chatInput.disabled = false;
        chatInput.placeholder = "Type your answer or ask for clarification...";
        chatSendBtn.disabled = false;
        hintBtn.disabled = false;
        chatInput.focus();
      } catch (err) {
        setTypingIndicator(false);
        showToast('Could not connect to AI Tutor. Please try again.', 'error');
        console.error(err);
      }
    }

    async function handleChatReply(e) {
      e.preventDefault();
      if (!state.sessionActive || state.isLoading) return;

      const chatInput = document.getElementById('chat-input');
      const userReply = chatInput.value.trim();
      if (!userReply) return;

      chatInput.value = '';
      appendChatMessage('user', userReply);

      state.isLoading = true;
      chatInput.disabled = true;
      document.getElementById('chat-send-btn').disabled = true;
      document.getElementById('request-hint-btn').disabled = true;
      setTypingIndicator(true);

      state.chatHistory.push({
        role: 'user',
        parts: [{ text: `Student's reply: "${userReply}"\nEvaluate my answer and ask the next Socratic guiding question.` }]
      });

      const tutorSchema = {
        type: "OBJECT",
        properties: {
          tutorReply: { type: "STRING" },
          hint: { type: "STRING" },
          masteryDelta: { type: "INTEGER" },
          bloomLevel: { type: "STRING" }
        },
        required: ["tutorReply", "hint", "masteryDelta", "bloomLevel"]
      };

      try {
        const res = await callGeminiStructured({
          systemInstruction: PROMPT_BLUEPRINTS.tutor.systemPrompt,
          contents: state.chatHistory,
          responseSchema: tutorSchema
        });

        setTypingIndicator(false);
        appendChatMessage('model', res.tutorReply);
        state.currentHint = res.hint;
        state.bloomLevel = res.bloomLevel || state.bloomLevel;
        document.getElementById('difficulty-pill').textContent = `Level: ${state.bloomLevel}`;

        if (typeof res.masteryDelta === 'number' && res.masteryDelta !== 0) {
          updateMastery(res.masteryDelta);
          if (res.masteryDelta > 0) {
            showToast(`+${res.masteryDelta}% Mastery! Great reasoning.`, 'success');
          }
        }

        state.chatHistory.push({
          role: 'model',
          parts: [{ text: JSON.stringify(res) }]
        });
      } catch (err) {
        setTypingIndicator(false);
        showToast('Error getting tutor response. Try sending again.', 'error');
        state.chatHistory.pop();
      } finally {
        state.isLoading = false;
        chatInput.disabled = false;
        document.getElementById('chat-send-btn').disabled = false;
        document.getElementById('request-hint-btn').disabled = false;
        chatInput.focus();
      }
    }

    // =========================================================================
    // 7. MODE 2: FEYNMAN TECHNIQUE LOGIC
    // =========================================================================
    async function pickFeynmanConcept() {
      const notesVal = document.getElementById('study-notes-input').value.trim();
      if (notesVal.length < 30) {
        showToast('Paste or load study notes on the left first!', 'warning');
        return;
      }
      const btn = document.getElementById('feynman-prompt-btn');
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-1"></i> Selecting...`;

      try {
        const res = await callGeminiStructured({
          systemInstruction: "Extract ONE specific, important core concept or mechanism from the user's notes and frame a short teaching prompt asking the student to explain it simply.",
          contents: [{ role: 'user', parts: [{ text: notesVal }] }],
          responseSchema: {
            type: "OBJECT",
            properties: {
              teachingPrompt: { type: "STRING" }
            },
            required: ["teachingPrompt"]
          }
        });
        document.getElementById('feynman-target-text').textContent = res.teachingPrompt;
        showToast('New Feynman concept prompt ready!', 'info');
      } catch (err) {
        showToast('Could not extract concept right now.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-shuffle mr-1"></i> Pick Concept to Explain`;
      }
    }

    async function evaluateFeynmanExplanation() {
      const notesVal = document.getElementById('study-notes-input').value.trim();
      const explanation = document.getElementById('feynman-input').value.trim();

      if (notesVal.length < 30) {
        showToast('Please load study notes on the left first!', 'warning');
        return;
      }
      if (explanation.length < 15) {
        showToast('Write at least a couple of sentences explaining the concept!', 'warning');
        return;
      }

      const btn = document.getElementById('evaluate-feynman-btn');
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>Analyzing Explanation...</span>`;

      const feynmanSchema = {
        type: "OBJECT",
        properties: {
          accuracy: { type: "INTEGER" },
          clarity: { type: "INTEGER" },
          strengths: { type: "ARRAY", items: { type: "STRING" } },
          gaps: { type: "ARRAY", items: { type: "STRING" } },
          reframingTip: { type: "STRING" }
        },
        required: ["accuracy", "clarity", "strengths", "gaps", "reframingTip"]
      };

      const userPrompt = `STUDY NOTES:\n"""\n${notesVal}\n"""\n\nTEACHING PROMPT:\n${document.getElementById('feynman-target-text').textContent}\n\nSTUDENT'S EXPLANATION:\n"""\n${explanation}\n"""`;

      try {
        const res = await callGeminiStructured({
          systemInstruction: PROMPT_BLUEPRINTS.feynman.systemPrompt,
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          responseSchema: feynmanSchema
        });

        document.getElementById('feynman-results').classList.remove('hidden');
        document.getElementById('feynman-accuracy-score').textContent = `${res.accuracy}/100`;
        document.getElementById('feynman-accuracy-bar').style.width = `${res.accuracy}%`;
        document.getElementById('feynman-clarity-score').textContent = `${res.clarity}/100`;
        document.getElementById('feynman-clarity-bar').style.width = `${res.clarity}%`;

        const strengthsList = document.getElementById('feynman-strengths');
        strengthsList.innerHTML = res.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('');

        const gapsList = document.getElementById('feynman-gaps');
        gapsList.innerHTML = res.gaps.length
          ? res.gaps.map(g => `<li>${escapeHtml(g)}</li>`).join('')
          : `<li>No major gaps detected—crystal clear explanation!</li>`;

        document.getElementById('feynman-tip').textContent = res.reframingTip;

        const avg = Math.round((res.accuracy + res.clarity) / 2);
        if (avg >= 70) {
          updateMastery(15);
          showToast('Awesome Feynman explanation! +15% Mastery', 'success');
        } else {
          updateMastery(5);
        }
      } catch (err) {
        showToast('Failed to grade explanation. Please try again.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-magnifying-glass-chart"></i><span>Grade My Explanation</span>`;
      }
    }

    // =========================================================================
    // 8. MODE 3: MNEMONIC & QUIZ GENERATOR LOGIC
    // =========================================================================
    async function generateMnemonicsAndQuiz() {
      const notesVal = document.getElementById('study-notes-input').value.trim();
      if (notesVal.length < 30) {
        showToast('Paste or load study notes on the left first!', 'warning');
        return;
      }

      const btn = document.getElementById('generate-quiz-btn');
      const loading = document.getElementById('quiz-loading');
      const empty = document.getElementById('quiz-empty');
      const content = document.getElementById('quiz-content');

      btn.disabled = true;
      empty.classList.add('hidden');
      content.classList.add('hidden');
      loading.classList.remove('hidden');

      const quizSchema = {
        type: "OBJECT",
        properties: {
          mnemonics: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                trick: { type: "STRING" },
                meaning: { type: "STRING" }
              },
              required: ["title", "trick", "meaning"]
            }
          },
          questions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: { type: "ARRAY", items: { type: "STRING" } },
                correctIndex: { type: "INTEGER" },
                explanation: { type: "STRING" }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        },
        required: ["mnemonics", "questions"]
      };

      try {
        const res = await callGeminiStructured({
          systemInstruction: PROMPT_BLUEPRINTS.quiz.systemPrompt,
          contents: [{ role: 'user', parts: [{ text: `STUDY NOTES:\n"""\n${notesVal}\n"""` }] }],
          responseSchema: quizSchema
        });

        // Render Mnemonics
        const mnemonicsGrid = document.getElementById('mnemonics-grid');
        mnemonicsGrid.innerHTML = res.mnemonics.map(m => `
          <div class="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl p-4">
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-700">${escapeHtml(m.title)}</span>
            <p class="text-sm font-extrabold text-slate-900 mt-1">"${escapeHtml(m.trick)}"</p>
            <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${escapeHtml(m.meaning)}</p>
          </div>
        `).join('');

        // Render Interactive Quiz
        state.quizScore = 0;
        state.quizAnswered = 0;
        state.quizTotal = res.questions.length;
        updateQuizScorePill();

        const questionsList = document.getElementById('quiz-questions-list');
        questionsList.innerHTML = '';

        res.questions.forEach((q, qIdx) => {
          const card = document.createElement('div');
          card.className = 'bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3';
          card.innerHTML = `
            <p class="text-sm font-bold text-slate-900">
              <span class="text-indigo-600 mr-1">Q${qIdx + 1}.</span> ${escapeHtml(q.question)}
            </p>
            <div class="grid grid-cols-1 gap-2" id="q-options-${qIdx}"></div>
            <div id="q-exp-${qIdx}" class="hidden text-xs bg-white border border-slate-200 rounded-lg p-3 text-slate-700 leading-relaxed"></div>
          `;

          const optionsWrap = card.querySelector(`#q-options-${qIdx}`);
          q.options.forEach((optText, optIdx) => {
            const optBtn = document.createElement('button');
            optBtn.type = 'button';
            optBtn.className = 'w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-xs sm:text-sm font-medium text-slate-700 transition flex items-center gap-2.5';
            optBtn.innerHTML = `
              <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                ${String.fromCharCode(65 + optIdx)}
              </span>
              <span>${escapeHtml(optText)}</span>
            `;

            optBtn.addEventListener('click', () => {
              // Prevent re-answering
              if (optionsWrap.dataset.answered === 'true') return;
              optionsWrap.dataset.answered = 'true';
              state.quizAnswered++;

              const allBtns = optionsWrap.querySelectorAll('button');
              allBtns.forEach((b, i) => {
                b.disabled = true;
                if (i === q.correctIndex) {
                  b.className = 'w-full text-left px-3.5 py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-2.5';
                } else if (i === optIdx && optIdx !== q.correctIndex) {
                  b.className = 'w-full text-left px-3.5 py-2.5 rounded-xl border-2 border-rose-400 bg-rose-50 text-xs sm:text-sm font-medium text-rose-900 flex items-center gap-2.5';
                } else {
                  b.className = 'w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white opacity-60 text-xs sm:text-sm text-slate-500 flex items-center gap-2.5';
                }
              });

              if (optIdx === q.correctIndex) {
                state.quizScore++;
                updateMastery(10);
                showToast('Correct! +10% Mastery', 'success');
              }
              updateQuizScorePill();

              const expBox = card.querySelector(`#q-exp-${qIdx}`);
              expBox.classList.remove('hidden');
              expBox.innerHTML = `<strong class="text-indigo-700">Explanation:</strong> ${escapeHtml(q.explanation)}`;
            });

            optionsWrap.appendChild(optBtn);
          });

          questionsList.appendChild(card);
        });

        loading.classList.add('hidden');
        content.classList.remove('hidden');
      } catch (err) {
        loading.classList.add('hidden');
        empty.classList.remove('hidden');
        showToast('Failed to generate quiz. Please try again.', 'error');
      } finally {
        btn.disabled = false;
      }
    }

    function updateQuizScorePill() {
      document.getElementById('quiz-score-pill').textContent = `Score: ${state.quizScore} / ${state.quizTotal}`;
    }

    // =========================================================================
    // 9. EVENT LISTENERS & INITIALIZATION
    // =========================================================================
    function loadSampleAndStart(sampleKey) {
      const textarea = document.getElementById('study-notes-input');
      textarea.value = SAMPLE_NOTES[sampleKey] || '';
      document.getElementById('char-count').textContent = `${textarea.value.length} characters`;
      switchMode('tutor');
      startSocraticSession();
    }

    function switchMode(newMode) {
      state.activeMode = newMode;
      syncPromptInspector();

      // Update Tab Styling
      document.querySelectorAll('.mode-tab').forEach(tab => {
        const isTarget = tab.dataset.mode === newMode;
        tab.className = isTarget
          ? 'mode-tab active-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition bg-indigo-600 text-white shadow-sm'
          : 'mode-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition text-slate-600 hover:bg-slate-100';
      });

      // Show/Hide Panels
      document.querySelectorAll('.mode-panel').forEach(panel => panel.classList.add('hidden'));
      document.getElementById(`panel-${newMode}`).classList.remove('hidden');
    }

    window.addEventListener('DOMContentLoaded', () => {
      syncPromptInspector();

      // Sample topic buttons
      document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.sample;
          const textarea = document.getElementById('study-notes-input');
          textarea.value = SAMPLE_NOTES[key];
          document.getElementById('char-count').textContent = `${textarea.value.length} characters`;
          showToast(`Loaded "${btn.textContent.trim()}" notes!`, 'info');
        });
      });

      // Character counter
      const notesInput = document.getElementById('study-notes-input');
      notesInput.addEventListener('input', () => {
        document.getElementById('char-count').textContent = `${notesInput.value.length} characters`;
      });

      // Clear notes button
      document.getElementById('clear-notes-btn').addEventListener('click', () => {
        notesInput.value = '';
        document.getElementById('char-count').textContent = '0 characters';
      });

      // Start Socratic Session button
      document.getElementById('start-session-btn').addEventListener('click', () => {
        switchMode('tutor');
        startSocraticSession();
      });

      // Mode tabs
      document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
      });

      // Chat form submission
      document.getElementById('chat-form').addEventListener('submit', handleChatReply);

      // Hint button
      document.getElementById('request-hint-btn').addEventListener('click', () => {
        if (state.currentHint) {
          appendChatMessage('model', state.currentHint, true);
          document.getElementById('request-hint-btn').disabled = true;
        }
      });

      // Feynman buttons
      document.getElementById('feynman-prompt-btn').addEventListener('click', pickFeynmanConcept);
      document.getElementById('evaluate-feynman-btn').addEventListener('click', evaluateFeynmanExplanation);

      // Quiz generator button
      document.getElementById('generate-quiz-btn').addEventListener('click', generateMnemonicsAndQuiz);

      // Prompt Inspector Modal Controls
      const inspectorModal = document.getElementById('inspector-modal');
      document.getElementById('toggle-inspector-btn').addEventListener('click', () => {
        syncPromptInspector();
        inspectorModal.classList.remove('hidden');
      });
      document.getElementById('close-inspector-btn').addEventListener('click', () => {
        inspectorModal.classList.add('hidden');
      });
      inspectorModal.addEventListener('click', (e) => {
        if (e.target === inspectorModal) inspectorModal.classList.add('hidden');
      });

      // Copy prompt using execCommand for iframe compatibility
      document.getElementById('copy-prompt-btn').addEventListener('click', () => {
        const textToCopy = document.getElementById('inspector-system-prompt').textContent;
        const tempArea = document.createElement('textarea');
        tempArea.value = textToCopy;
        document.body.appendChild(tempArea);
        tempArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempArea);
        showToast('System prompt copied to clipboard!', 'success');
      });
    });
  </script>
</body>
</html>
