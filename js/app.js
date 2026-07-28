(function () {
  const DATA = window.LECTURE_DATA || { course: {}, documents: { zh: [], en: [] } };
  const app = document.getElementById('app');
  const languageSwitch = document.getElementById('language-switch');
  const DOWNLOAD_URL = './assets/files/AIE3905-20260701.pdf';
  const REGISTRATION_URL = 'https://tideclub26.feishu.cn/share/base/form/shrcn751dWIgzJimMjFGiXvSThd';
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  let activeLanguage = requestedLanguage === 'en' ? 'en' : 'zh';

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function blockType(block, index, language) {
    const text = block.text || '';
    if (index === 0) return 'document-kicker';
    if (index === 1) return 'document-title';
    if (block.style === 'Session Summary') return 'session-summary';
    if (block.style === 'Heading 1' || text === 'Course Features' || text === 'Parallel Classes') return 'heading';
    if (block.style === 'Heading 2' || /^平行教学班S\d/.test(text) || /^Parallel Class (Section|Session) S\d/.test(text)) return 'section-title';
    if (/^合作(?:书院|单位)[:：]/.test(text) || /^(?:Collaboration with |Collaboration Unit:)/.test(text)) return 'partner';
    if (/^·/.test(text)) return 'feature';
    if (language === 'en' && /^\d+\./.test(text)) return 'feature';
    return 'paragraph';
  }

  function renderBlock(block, index, language) {
    if (block.href) {
      const lead = block.lead ? `${esc(block.lead)} ` : '';
      return `<p class="document-resource-line">${lead}<a class="document-resource-link" href="${esc(block.href)}"><span>${esc(block.text)}</span><span aria-hidden="true">→</span></a></p>`;
    }

    const type = blockType(block, index, language);
    const text = esc(block.text);
    if (type === 'document-kicker') return `<p class="document-kicker">${text}</p>`;
    if (type === 'document-title') return `<h2 class="document-title">${text}</h2>`;
    if (type === 'session-summary') return `<p class="session-summary-heading">${text}</p>`;
    if (type === 'heading') return `<h3 class="document-heading">${text}</h3>`;
    if (type === 'section-title') return `<h4 class="document-section-title">${text}</h4>`;
    if (type === 'partner') {
      const instructor = block.instructor
        ? `<span class="document-instructor">${esc(block.instructor)}</span>`
        : '';
      return `<p class="document-partner"><span>${text}</span>${instructor}</p>`;
    }
    if (type === 'feature') return `<p class="document-feature">${text}</p>`;
    return `<p class="document-paragraph">${text}</p>`;
  }

  function renderDocument(language) {
    const blocks = DATA.documents?.[language] || [];
    return blocks.map((block, index) => {
      const listProperty = block.sessionItem ? 'sessionItem' : 'listItem';
      if (!block[listProperty]) return renderBlock(block, index, language);

      const opensList = !blocks[index - 1]?.[listProperty];
      const closesList = !blocks[index + 1]?.[listProperty];
      const listClass = block.sessionItem ? 'document-list session-summary-list' : 'document-list';
      return `${opensList ? `<ul class="${listClass}">` : ''}<li>${esc(block.text)}</li>${closesList ? '</ul>' : ''}`;
    }).join('');
  }

  function renderPage() {
    const course = DATA.course || {};
    const isEnglish = activeLanguage === 'en';
    const languageLabel = isEnglish ? 'Course Information' : '课程信息';
    const documentLanguage = isEnglish ? 'en' : 'zh-CN';
    const primaryTitle = isEnglish ? `${course.code} · ${course.titleEn}` : course.titleZh;
    const secondaryTitle = isEnglish ? course.titleZh : `${course.code} · ${course.titleEn}`;
    const school = isEnglish ? course.schoolEn : course.school;
    const term = isEnglish ? course.termEn : course.term;
    const primarySlogan = isEnglish ? course.sloganEn : course.slogan;
    const secondarySlogan = isEnglish ? course.slogan : course.sloganEn;
    const units = isEnglish ? course.unitsEn : course.units;
    const formats = (isEnglish ? course.formatsEn : course.formats) || [];
    const downloadLabel = isEnglish ? 'Download official course outline' : '下载官方课程大纲';
    const heroMetaLabel = isEnglish ? 'Course details' : '课程基本信息';
    const languageSwitchLabel = isEnglish ? 'Select course information language' : '选择课程信息语言';
    const applicationNotice = isEnglish
      ? `Each session is capped at 20 students to ensure an optimal learning experience for everyone. Placements will be made based on applications, and interviews may be arranged if needed. Please fill in the <a href="${REGISTRATION_URL}" target="_blank" rel="noopener noreferrer">[Application Form]</a>.`
      : `为确保教学效果，每个教学班仅开放20个名额，教学团队会根据报名情况进行合理分班，如有必要，还将安排面试。请填<a href="${REGISTRATION_URL}" target="_blank" rel="noopener noreferrer">【报名表】</a>。`;
    const applicationTip = isEnglish
      ? 'Presenting innovative ideas in your application will significantly increase your chances of being selected.'
      : '在申请表中展现具有创新性的设想，将显著提升您的入选概率。';

    document.documentElement.lang = documentLanguage;
    languageSwitch?.setAttribute('aria-label', languageSwitchLabel);
    languageSwitch?.querySelectorAll('[data-language]').forEach(button => {
      const isActive = button.dataset.language === activeLanguage;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    app.innerHTML = `<div class="fade-in">
      <section class="course-hero">
        <div class="container course-hero-inner">
          <div class="hero-primary" lang="${documentLanguage}">
            <div class="hero-kicker">${esc(school)} · ${esc(term)}</div>
            <h1>${esc(primaryTitle)}</h1>
            <p class="hero-title-secondary">${esc(secondaryTitle)}</p>
          </div>
          <div class="hero-information" lang="${documentLanguage}">
            <p class="hero-slogan">${esc(primarySlogan)}</p>
            <p class="hero-slogan-secondary">${esc(secondarySlogan)}</p>
            <div class="hero-meta" aria-label="${heroMetaLabel}">
              <span>${esc(units)}</span>
              ${formats.map(format => `<span>${esc(format)}</span>`).join('')}
            </div>
            <div class="hero-actions">
              <a class="hero-action-button download-button" href="${DOWNLOAD_URL}" download="AIE3905-20260701.pdf">
                <span aria-hidden="true">↓</span>
                ${downloadLabel}
              </a>
            </div>
            <p class="application-notice">${applicationNotice}<br>${applicationTip}</p>
          </div>
        </div>
      </section>

      <section class="document-area">
        <div class="container document-container">
          <div class="document-toolbar">
            <div>
              <span class="eyebrow">AIE 3905</span>
              <h2>${languageLabel}</h2>
            </div>
          </div>
          <article class="course-document" lang="${documentLanguage}">
            ${renderDocument(activeLanguage)}
          </article>
        </div>
      </section>
    </div>`;

  }

  languageSwitch?.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    const nextLanguage = button.dataset.language;
    if (nextLanguage === activeLanguage) return;
    activeLanguage = nextLanguage;
    window.history.replaceState({}, '', `?lang=${activeLanguage}`);
    renderPage();
  });

  renderPage();
})();
