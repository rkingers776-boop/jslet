// jslet.com — Shared Navigation + Theme Toggle + Search
// Injects the same header as the homepage (Tool Hub style) into <div id="site-nav">
(function() {
    'use strict';

    var NAV_HTML =         '<header class="jslet-header" id="jslet-nav" data-current="__PAGE__">' +
            '<div class="jslet-header-inner">' +
                '<div class="jslet-nav-left">' +
                    '<a href="/" class="jslet-logo-btn" aria-label="jslet home"><svg class="jslet-mark" width="26" height="26" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#4F46E5"/><rect width="64" height="30" rx="16" fill="#ffffff" opacity="0.18"/><circle cx="40" cy="16" r="5" fill="#ffffff"/><path d="M40 27 L40 45 C40 52.5 30 54.5 26.5 48" fill="none" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
                    '<div class="jslet-title-wrap jslet-dropdown" id="jslet-hub-menu">' +
                        '<button class="jslet-brand-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Tool Hub categories">' +
                            '<span class="jslet-brand-text">Tool Hub</span>' +
                            '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="jslet-dropdown-arrow"><path d="M22 4H2v2h20zm0 7H2v2h20zM2 20h20v-2H2z"></path></svg>' +
                        '</button>' +
                        '<div class="jslet-hub-panel" id="jslet-hub-panel" role="menu" aria-label="Tool categories">' +
                            '<div class="jslet-hub-head">' +
                                '<span class="jslet-hub-title">Tool Categories</span>' +
                                '<span class="jslet-hub-count">14 Categories · 112 Tools</span>' +
                            '</div>' +
                            '<div class="jslet-hub-grid">' +
                                '<a href="/json-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-json">{ }</span><span class="jslet-hub-info"><strong>JSON / CSV</strong><span>Format · Validate · Convert</span></span></a>' +
                                '<a href="/regex-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-regex">.*</span><span class="jslet-hub-info"><strong>Regex</strong><span>Test · Visualize · Cheatsheet</span></span></a>' +
                                '<a href="/encoding-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-encoding">🔣</span><span class="jslet-hub-info"><strong>Encoding</strong><span>Base64 · URL · Entities</span></span></a>' +
                                '<a href="/timestamp-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-time">🕐</span><span class="jslet-hub-info"><strong>Timestamp</strong><span>Unix · ISO 8601 · Timezone</span></span></a>' +
                                '<a href="/css-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-css">🎨</span><span class="jslet-hub-info"><strong>CSS / Color</strong><span>Generators · Units · Palettes</span></span></a>' +
                                '<a href="/dev-tools" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-dev">🔧</span><span class="jslet-hub-info"><strong>Developer</strong><span>Encoding · Hash · Convert</span></span></a>' +
                                '<a href="/core-calculators" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-core">🎛️</span><span class="jslet-hub-info"><strong>Core Calc</strong><span>Units · Bases · Scale</span></span></a>' +
                                '<a href="/ai-gpu-compute" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-ai">🤖</span><span class="jslet-hub-info"><strong>AI &amp; GPU</strong><span>VRAM · Inference · Fine-tune</span></span></a>' +
                                '<a href="/data-magnitude" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-data">📊</span><span class="jslet-hub-info"><strong>Data</strong><span>Storage · Throughput · Migration</span></span></a>' +
                                '<a href="/network-economics" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-net">🌐</span><span class="jslet-hub-info"><strong>Network</strong><span>Bandwidth · Latency · Load Balancing</span></span></a>' +
                                '<a href="/cloud-quotas" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-cloud">☁️</span><span class="jslet-hub-info"><strong>Cloud Quota</strong><span>Quotas · Capacity · Servers</span></span></a>' +
                                '<a href="/decision-matrix" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-decision">🛠️</span><span class="jslet-hub-info"><strong>Decision</strong><span>Cost Compare · Trade-offs</span></span></a>' +
                                '<a href="/security-sre" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-sec">🔒</span><span class="jslet-hub-info"><strong>Security / SRE</strong><span>SLA · Passwords · Auditing</span></span></a>' +
                                '<a href="/devops-utilities" class="jslet-hub-item" role="menuitem"><span class="jslet-hub-icon gic-ops">🕐</span><span class="jslet-hub-info"><strong>DevOps</strong><span>Ops · Deploy · Time</span></span></a>' +
                            '</div>' +
                            '<a href="/" class="jslet-hub-all">View all 112 tools <span aria-hidden="true">→</span></a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="jslet-account-pill">' +
                        '<div class="jslet-mini-avatar">J</div>' +
                        '<span class="jslet-account-name">jslet.core</span>' +
                        '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" class="jslet-pill-arrow"><path d="m8 9.59 4.3-4.3 1.4 1.42L8 12.4 2.3 6.7l1.4-1.42z"></path></svg>' +
                    '</div>' +
                '</div>' +
                '<div class="jslet-search-container">' +
                    '<div class="jslet-search-bar">' +
                        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="jslet-search-icon"><path d="M17.33 18.74a10 10 0 1 1 1.41-1.41l4.47 4.47-1.41 1.41zM11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16"></path></svg>' +
                        '<input type="text" placeholder="Search 112 dev tools, calculators &amp; briefings..." id="jslet-global-search" autocomplete="off">' +
                    '</div>' +
                '</div>' +
                '<div class="jslet-nav-right">' +
                    '<a href="/articles" class="jslet-icon-btn" title="Updates &amp; articles" aria-label="Updates &amp; articles">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 19h8v-2h-.34a3.15 3.15 0 0 1-3.12-2.76l-.8-6.41a7.8 7.8 0 0 0-15.48 0l-.8 6.41A3.15 3.15 0 0 1 .34 17H0v2h8v1h.02a3.4 3.4 0 0 0 3.38 3h1.2a3.4 3.4 0 0 0 3.38-3H16zm1.75-10.92.8 6.4c.12.95.5 1.81 1.04 2.52H4.4c.55-.7.92-1.57 1.04-2.51l.8-6.41a5.8 5.8 0 0 1 11.5 0M13.4 19c.33 0 .6.27.6.6 0 .77-.63 1.4-1.4 1.4h-1.2a1.4 1.4 0 0 1-1.4-1.4c0-.33.27-.6.6-.6z"></path></svg>' +
                    '</a>' +
                    '<a href="/rss.xml" class="jslet-icon-btn" title="RSS feed" aria-label="RSS feed">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-5 10c1.8 0 3.5-.41 5-1.15l3.69.65A2 2 0 0 0 23 20.7l-.65-3.7A11.5 11.5 0 1 0 12 23.5m8.55-7.36-.28.58.76 4.31-4.31-.76-.58.28q-1.89.93-4.14.95a9.5 9.5 0 1 1 8.55-5.36"></path></svg>' +
                    '</a>' +
                    '<a href="/about" class="jslet-profile-btn" title="Your profile &amp; about" aria-label="Your profile"><div class="jslet-profile-avatar">J</div></a>' +
                    '<button class="jslet-icon-btn jslet-theme-btn" id="btn-theme" title="Toggle dark/light mode" aria-label="Toggle dark mode">☽</button>' +
                '</div>' +
            '</div>' +
        '</header>';;

    function injectNav() {
        var container = document.getElementById('site-nav');
        if (!container) return;
        var page = container.getAttribute('data-current') || 'tool';
        container.innerHTML = NAV_HTML.replace('__PAGE__', page);

        // Mark active link on the hub dropdown button for tool pages
        // (Home/Articles/About get an underline highlight via CSS)

        // Bind Tool Hub dropdown
        var hubMenu = document.getElementById('jslet-hub-menu');
        if (hubMenu) {
            var hubBtn = hubMenu.querySelector('.jslet-brand-btn');
            var hubPanel = document.getElementById('jslet-hub-panel');
            function setHubOpen(open) {
                if (!hubBtn || !hubPanel) return;
                hubMenu.classList.toggle('jslet-hub-open', open);
                hubBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
                hubPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
            }
            hubBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var isOpen = hubMenu.classList.contains('jslet-hub-open');
                setHubOpen(!isOpen);
            });
            document.addEventListener('click', function(e) {
                if (!hubMenu.contains(e.target)) setHubOpen(false);
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') setHubOpen(false);
            });
            hubPanel.addEventListener('click', function(e) {
                if (e.target.closest('a')) setHubOpen(false);
            });
        }

        // Bind global search (Enter -> /search?q=)
        var searchInput = document.getElementById('jslet-global-search');
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var q = (searchInput.value || '').trim();
                    window.location.href = '/search?q=' + encodeURIComponent(q);
                }
            });
        }
    }

    // ── Dark Mode Toggle ────────────────────────────────────────────────
    var THEME_KEY = 'ctx-theme';
    var stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        if (next === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem(THEME_KEY, 'light');
        }
        updateThemeIcon();
    }

    function bindThemeBtn() {
        var btn = document.getElementById('btn-theme');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
            updateThemeIcon();
        }
    }

    function updateThemeIcon() {
        var btn = document.getElementById('btn-theme');
        if (!btn) return;
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        btn.textContent = isDark ? '☀' : '☽';
    }

    // ── Tool Search (index page only) ───────────────────────────────────
    function initToolSearch() {
        var searchInput = document.getElementById('tool-search-input');
        if (!searchInput) return;

        var cards = document.querySelectorAll('.calculator-card[data-corridor]');
        if (!cards.length) return;

        var noResults = document.getElementById('no-results');
        var sections = document.querySelectorAll('.section-heading');

        searchInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            var visibleCount = 0;

            cards.forEach(function(card) {
                var title = (card.querySelector('h3') || {}).textContent || '';
                var desc  = (card.querySelector('.card-desc') || {}).textContent || '';
                var match = !query || title.toLowerCase().indexOf(query) !== -1 || desc.toLowerCase().indexOf(query) !== -1;
                card.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });

            sections.forEach(function(heading) {
                var grid = heading.nextElementSibling;
                if (!grid || !grid.classList.contains('matrix-grid')) return;
                var hasVisible = false;
                var gridCards = grid.querySelectorAll('.calculator-card[data-corridor]');
                gridCards.forEach(function(c) {
                    if (c.style.display !== 'none') hasVisible = true;
                });
                heading.style.display = hasVisible ? '' : 'none';
            });

            if (noResults) {
                noResults.style.display = (query && visibleCount === 0) ? 'block' : 'none';
            }
        });
    }

    // ── Article Search (index page only) ────────────────────────────────
    function initArticleSearch() {
        var articleInput = document.getElementById('article-search-input');
        if (!articleInput) return;

        var articles = [{
            title: 'LLM Inference Latency: Why Your 7B Model Gets 15 tok/s on a T4 but 3,500 tok/s on an H100 (2026)',
            desc: 'The bottleneck isn\'t TFLOPS — it\'s memory bandwidth. Model throughput across 12 models, 7 GPUs, and 4 quantization levels with real benchmarks.',
            url: '/llm-inference-latency',
            el: document.getElementById('briefing-llm-inference')
        }, {
            title: 'DNS Propagation Time: How Long Until Your DNS Change Goes Live? (2026)',
            desc: 'DNS propagation isn\'t one number — it\'s a distribution shaped by TTL, ISP cache policy, and anycast topology. Resolver-by-resolver timing model.',
            url: '/dns-propagation',
            el: document.getElementById('briefing-dns-propagation')
        }, {
            title: 'Kubernetes Pod Density: Why 110 Pods Is a Lie — The Hidden Limits That Cap Your Node (2026)',
            desc: 'K8s says 110 pods/node. Cloud providers say 30-60. Why your node has idle CPU but the scheduler refuses pods.',
            url: '/pod-density-real',
            el: document.getElementById('briefing-pod-density')
        }, {
            title: 'UUID v4 Collision Probability at Scale: How Many UUIDs Before a Collision? (2026)',
            desc: '2.71 quintillion UUIDs for 50% collision. Math says never. RNG bugs say otherwise.',
            url: '/uuid-v4-collision-probability-real',
            el: document.getElementById('briefing-uuid-collision')
        }, {
            title: 'RAID 5 vs RAID 6: 20TB Rebuild Times Compared (2026)',
            desc: 'RAID 6 rebuild is only 13% slower than RAID 5 at 20TB. The URE survival gap is five orders of magnitude.',
            url: '/raid-5-vs-raid-6-rebuild-ure',
            el: document.getElementById('briefing-raid-rebuild')
        }];

        articleInput.addEventListener('input', function() {
            var query = this.value.toLowerCase().trim();
            articles.forEach(function(a) {
                if (a.el) {
                    var match = !query ||
                        a.title.toLowerCase().indexOf(query) !== -1 ||
                        a.desc.toLowerCase().indexOf(query) !== -1;
                    a.el.style.display = match ? '' : 'none';
                }
            });
        });
    }

    // ── Init on DOM ready ───────────────────────────────────────────────
    function initAll() {
        injectNav();
        bindThemeBtn();
        initToolSearch();
        initArticleSearch();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
