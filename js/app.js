(function () {
  const DATA = window.LECTURE_DATA || { course: {}, sections: [] };
  const app = document.getElementById('app');

  // Replace this URL with the Feishu questionnaire when registration opens.
  const REGISTRATION_FORM_URL = 'https://tideclub26.feishu.cn/share/base/form/shrcn751dWIgzJimMjFGiXvSThd';

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function button(href, label, variant = 'primary', extra = '') {
    const external = /^https?:\/\//.test(href);
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="btn btn-${variant} ${extra}" href="${esc(href)}"${target}>${esc(label)} <span aria-hidden="true">→</span></a>`;
  }

  function registrationButton(label = '填写报名问卷', variant = 'primary', extra = '') {
    return button(REGISTRATION_FORM_URL, label, variant, extra);
  }

  function list(items, className = 'clean-list') {
    if (!items || !items.length) return '';
    return `<ul class="${className}">${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`;
  }

  function sectionCard(section) {
    const searchText = [section.code, section.title, section.summary, section.partner, ...(section.tags || [])].join(' ').toLowerCase();
    return `<article class="section-card" data-section-card data-category="${esc(section.category)}" data-search="${esc(searchText)}">
      <div class="section-card-topline">
        <span class="section-code">${esc(section.code)}</span>
        <span class="badge">${esc(section.categoryLabel)}</span>
      </div>
      <div>
        <h3>${esc(section.title)}</h3>
        <p class="muted section-summary">${esc(section.summary)}</p>
      </div>
      <div class="tag-row">${(section.tags || []).slice(0, 3).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div>
      <div class="section-card-footer">
        <span class="partner-label">${esc(section.partner)}</span>
        ${button(`#/sections/${section.id}`, '查看详情', 'secondary', 'btn-sm')}
      </div>
    </article>`;
  }

  function renderHome() {
    const course = DATA.course;
    const sections = DATA.sections || [];
    return `<div class="fade-in">
      <section class="course-hero">
        <div class="course-hero-bg" aria-hidden="true"></div>
        <div class="container course-hero-inner">
          <div class="hero-kicker">${esc(course.school)} · ${esc(course.term)}</div>
          <h1>${esc(course.titleZh)}</h1>
          <p class="hero-title-en">${esc(course.code)} · ${esc(course.titleEn)}</p>
          <p class="hero-slogan">${esc(course.slogan)}</p>
          <div class="hero-meta" aria-label="课程基本信息">
            <span>${esc(course.units)}</span>
            <span>${esc(course.hours)}</span>
            <span>${esc(course.format)}</span>
          </div>
          <div class="hero-actions">
            ${button('#/sections', '浏览平行教学班', 'light')}
            ${registrationButton('课程报名', 'outline-light')}
          </div>
        </div>
      </section>

      <section class="overview-band">
        <div class="container overview-grid">
          <div class="overview-copy">
            <div class="eyebrow">课程概览</div>
            <h2>把AI带进真实场景</h2>
            <p class="lead">${esc(course.overview)}</p>
            ${button('#/course', '查看课程总纲', 'secondary')}
          </div>
          <div class="feature-list">
            ${(course.features || []).map((feature, index) => `<div class="feature-item">
              <span class="feature-number">0${index + 1}</span>
              <div><h3>${esc(feature.title)}</h3><p class="muted">${esc(feature.text)}</p></div>
            </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="section-space">
        <div class="container">
          <div class="section-heading heading-row">
            <div><div class="eyebrow">Parallel Sections</div><h2>平行教学班</h2></div>
            <p class="lead">统一课程目标与考核要求，不同主题连接不同真实场景。</p>
          </div>
          <div class="section-grid">${sections.map(sectionCard).join('')}</div>
          <div class="center-action">${button('#/sections', '查看全部教学班', 'secondary')}</div>
        </div>
      </section>

      <section class="process-band">
        <div class="container">
          <div class="section-heading">
            <div class="eyebrow">Learning Journey</div>
            <h2>从问题发现到成果公开</h2>
          </div>
          <div class="phase-grid">
            ${(course.phases || []).map((phase, index) => `<article class="phase-item">
              <div class="phase-marker">${index + 1}</div>
              <span class="phase-weeks">${esc(phase.weeks)}</span>
              <h3>${esc(phase.title)}</h3>
              <p class="muted">${esc(phase.description)}</p>
              <div class="milestone"><span>里程碑</span>${esc(phase.milestone)}</div>
            </article>`).join('')}
          </div>
        </div>
      </section>

      ${renderRegistrationBand()}
    </div>`;
  }

  function renderSectionsPage() {
    const sections = DATA.sections || [];
    const categories = [...new Map(sections.map(item => [item.category, item.categoryLabel])).entries()];
    return `<div class="fade-in">
      <section class="page-intro">
        <div class="container">
          <div class="breadcrumb"><a href="#/">首页</a><span>/</span><span>平行教学班</span></div>
          <div class="page-title-row">
            <div><div class="eyebrow">${sections.length} 个主题方向</div><h1>选择你的真实实践场景</h1></div>
            <p class="lead">每个教学班共享课程目标与考核标准，并围绕不同社会场景开展独立项目实践。</p>
          </div>
        </div>
      </section>
      <section class="section-space section-list-space">
        <div class="container">
          <div class="filter-panel">
            <label class="search-label" for="section-search">搜索教学班</label>
            <input class="search-input" id="section-search" type="search" placeholder="搜索主题、合作方或关键词..." />
            <div class="filter-row" id="section-filters">
              <button class="filter-btn active" type="button" data-category-filter="all">全部</button>
              ${categories.map(([id, label]) => `<button class="filter-btn" type="button" data-category-filter="${esc(id)}">${esc(label)}</button>`).join('')}
            </div>
          </div>
          <div class="section-grid" id="section-grid">${sections.map(sectionCard).join('')}</div>
          <div class="empty-state" id="no-results"><h2>没有找到匹配的教学班</h2><p class="muted">可以更换关键词，或切换到“全部”。</p></div>
        </div>
      </section>
      ${renderRegistrationBand()}
    </div>`;
  }

  function renderSectionDetail(sectionId) {
    const section = (DATA.sections || []).find(item => item.id === sectionId);
    if (!section) return renderNotFound('教学班未找到', '该教学班可能尚未发布或地址有误。');
    const course = DATA.course;
    return `<div class="fade-in">
      <section class="detail-intro detail-accent-${esc(section.category)}">
        <div class="container">
          <div class="breadcrumb breadcrumb-light"><a href="#/">首页</a><span>/</span><a href="#/sections">平行教学班</a><span>/</span><span>${esc(section.code)}</span></div>
          <div class="detail-heading">
            <div>
              <div class="detail-labels"><span class="section-code light">${esc(section.code)}</span><span>${esc(section.categoryLabel)}</span></div>
              <h1>${esc(section.title)}</h1>
              <p class="detail-summary">${esc(section.summary)}</p>
            </div>
            ${registrationButton('报名该教学班', 'light')}
          </div>
        </div>
      </section>

      <section class="section-space detail-content">
        <div class="container detail-layout">
          <div class="detail-main">
            <section class="content-section">
              <div class="eyebrow">教学班介绍</div>
              <h2>在真实场景中完成完整实践闭环</h2>
              <div class="prose">${(section.description || []).map(text => `<p>${esc(text)}</p>`).join('')}</div>
            </section>
            <section class="content-section">
              <div class="eyebrow">实践重点</div>
              <h2>你将参与的方向</h2>
              <div class="focus-grid">${(section.focus || []).map((item, index) => `<div class="focus-item"><span>${String(index + 1).padStart(2, '0')}</span><p>${esc(item)}</p></div>`).join('')}</div>
            </section>
          </div>
          <aside class="detail-aside">
            <div class="aside-block"><span>课程代码</span><strong>${esc(course.code)}</strong></div>
            <div class="aside-block"><span>开课学期</span><strong>${esc(course.term)}</strong></div>
            <div class="aside-block"><span>学分与课时</span><strong>${esc(course.units)} · ${esc(course.hours)}</strong></div>
            <div class="aside-block"><span>合作与实践场景</span><strong>${esc(section.partner)}</strong></div>
            <div class="aside-block"><span>主题关键词</span><div class="tag-row">${(section.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div></div>
          </aside>
        </div>
      </section>
      ${renderRegistrationBand(section.code)}
    </div>`;
  }

  function renderCoursePage() {
    const course = DATA.course;
    return `<div class="fade-in">
      <section class="page-intro">
        <div class="container">
          <div class="breadcrumb"><a href="#/">首页</a><span>/</span><span>课程详情</span></div>
          <div class="page-title-row">
            <div><div class="eyebrow">${esc(course.code)} · ${esc(course.units)}</div><h1>${esc(course.titleZh)}</h1><p class="title-en">${esc(course.titleEn)}</p></div>
            <p class="lead">${esc(course.description)}</p>
          </div>
        </div>
      </section>

      <section class="fact-band">
        <div class="container fact-grid">
          <div><span>课程学期</span><strong>${esc(course.term)}</strong></div>
          <div><span>教学安排</span><strong>${esc(course.hours)}</strong></div>
          <div><span>教学形式</span><strong>${esc(course.format)}</strong></div>
          <div><span>平行班规模</span><strong>每班不超过 30 人</strong></div>
        </div>
      </section>

      <section class="section-space">
        <div class="container">
          <div class="section-heading"><div class="eyebrow">Learning Outcomes</div><h2>学习目标</h2></div>
          <div class="outcome-grid">${(course.learningOutcomes || []).map((group, index) => `<article class="outcome-item"><span class="outcome-index">0${index + 1}</span><h3>${esc(group.title)}</h3>${list(group.items)}</article>`).join('')}</div>
        </div>
      </section>

      <section class="syllabus-band">
        <div class="container split-section">
          <div>
            <div class="eyebrow">Course Syllabus</div>
            <h2>课程内容</h2>
            <p class="lead">各平行教学班会根据主题、合作基地、学生构成与学期资源选择和调整具体内容。</p>
          </div>
          <div class="syllabus-list">${(course.syllabus || []).map((item, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(item)}</strong></div>`).join('')}</div>
        </div>
      </section>

      <section class="section-space">
        <div class="container assessment-layout">
          <div>
            <div class="section-heading align-left"><div class="eyebrow">Assessment</div><h2>考核方式</h2></div>
            <div class="assessment-list">${(course.assessments || []).map(item => `<div class="assessment-row"><div><span>${esc(item.label)}</span><strong>${item.value}%</strong></div><div class="assessment-track"><span style="width:${item.value}%"></span></div></div>`).join('')}</div>
          </div>
          <div class="prerequisite-panel">
            <div class="eyebrow">选课基础</div>
            <h3>先修要求</h3>
            <p>${esc(course.prerequisites)}</p>
            <div class="rule"></div>
            <h3>课程规模</h3>
            <p>${esc(course.enrollment)}</p>
          </div>
        </div>
      </section>

      <section class="process-band">
        <div class="container">
          <div class="section-heading"><div class="eyebrow">Teaching Plan</div><h2>三阶段教学安排</h2></div>
          <div class="phase-grid">${(course.phases || []).map((phase, index) => `<article class="phase-item"><div class="phase-marker">${index + 1}</div><span class="phase-weeks">${esc(phase.weeks)}</span><h3>${esc(phase.title)}</h3><p class="muted">${esc(phase.description)}</p><div class="milestone"><span>里程碑</span>${esc(phase.milestone)}</div></article>`).join('')}</div>
        </div>
      </section>

      <section class="integrity-band">
        <div class="container integrity-layout">
          <div><div class="eyebrow">Responsible AI</div><h2>负责任地使用AI</h2></div>
          <p>${esc(course.academicIntegrity)}</p>
        </div>
      </section>
      ${renderRegistrationBand()}
    </div>`;
  }

  function renderRegistrationBand(sectionCode = '') {
    const title = sectionCode ? `${sectionCode} 教学班报名` : '准备好进入真实场景了吗？';
    return `<section class="registration-band" id="registration">
      <div class="container registration-inner">
        <div><span class="registration-kicker">2026 秋季 · 报名入口</span><h2>${esc(title)}</h2><p>报名问卷链接当前为占位地址，正式问卷发布后将在此更新。</p></div>
        ${registrationButton('前往报名问卷', 'light')}
      </div>
    </section>`;
  }

  function renderNotFound(title = '页面未找到', description = '你访问的页面不存在。') {
    return `<section class="empty-page"><div class="container"><h1>${esc(title)}</h1><p class="muted">${esc(description)}</p>${button('#/', '返回首页', 'primary')}</div></section>`;
  }

  function parseRoute() {
    const raw = (window.location.hash || '#/').replace(/^#\/?/, '').replace(/^\//, '');
    const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'sections' && parts.length === 1) return { name: 'sections' };
    if (parts[0] === 'sections' && parts.length >= 2) return { name: 'section', sectionId: parts[1] };
    if (parts[0] === 'course') return { name: 'course' };
    return { name: 'notfound' };
  }

  function updateNav(routeName) {
    const navKey = routeName === 'section' ? 'sections' : routeName;
    document.querySelectorAll('[data-nav]').forEach(item => {
      item.classList.toggle('active', item.dataset.nav === navKey);
    });
  }

  function initSectionFilters() {
    const input = document.getElementById('section-search');
    const filters = document.getElementById('section-filters');
    if (!input || !filters) return;
    let activeCategory = 'all';

    const apply = () => {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      document.querySelectorAll('[data-section-card]').forEach(card => {
        const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
        const searchMatch = !query || (card.dataset.search || '').includes(query);
        const show = categoryMatch && searchMatch;
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });
      document.getElementById('no-results')?.classList.toggle('show', visible === 0);
    };

    input.addEventListener('input', apply);
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-category-filter]');
      if (!button) return;
      activeCategory = button.dataset.categoryFilter;
      filters.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      apply();
    });
  }

  function render() {
    const route = parseRoute();
    let html = '';
    if (route.name === 'home') html = renderHome();
    else if (route.name === 'sections') html = renderSectionsPage();
    else if (route.name === 'section') html = renderSectionDetail(route.sectionId);
    else if (route.name === 'course') html = renderCoursePage();
    else html = renderNotFound();

    app.innerHTML = html;
    updateNav(route.name);
    initSectionFilters();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.querySelector('.mobile-nav')?.classList.remove('open');
    document.querySelector('.mobile-menu-button')?.setAttribute('aria-expanded', 'false');
    const menuButton = document.querySelector('.mobile-menu-button');
    if (menuButton) menuButton.textContent = '☰';
  }

  document.querySelector('.mobile-menu-button')?.addEventListener('click', function () {
    const nav = document.querySelector('.mobile-nav');
    const open = nav.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? '×' : '☰';
  });

  window.addEventListener('hashchange', render);
  render();
})();
