(function () {
  const DATA = window.LECTURE_DATA || { course: {}, documents: { zh: [], en: [] } };
  const app = document.getElementById('app');
  const DOWNLOAD_URL = './assets/files/AIE3905-20260701.pdf';
  const REGISTRATION_URL = 'https://tideclub26.feishu.cn/share/base/form/shrcn751dWIgzJimMjFGiXvSThd';
  let activeLanguage = 'zh';

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
    if (block.style === 'Heading 1' || text === 'Course Features' || text === 'Parallel Classes') return 'heading';
    if (block.style === 'Heading 2' || /^平行教学班S\d/.test(text) || /^Parallel Class (Section|Session) S\d/.test(text)) return 'section-title';
    if (/^合作书院[:：]/.test(text) || /^Collaboration with /.test(text)) return 'partner';
    if (/^·/.test(text)) return 'feature';
    if (language === 'en' && /^\d+\./.test(text)) return 'feature';
    return 'paragraph';
  }

  function renderBlock(block, index, language) {
    const type = blockType(block, index, language);
    const text = esc(block.text);
    if (type === 'document-kicker') return `<p class="document-kicker">${text}</p>`;
    if (type === 'document-title') return `<h2 class="document-title">${text}</h2>`;
    if (type === 'heading') return `<h3 class="document-heading">${text}</h3>`;
    if (type === 'section-title') return `<h4 class="document-section-title">${text}</h4>`;
    if (type === 'partner') return `<p class="document-partner">${text}</p>`;
    if (type === 'feature') return `<p class="document-feature">${text}</p>`;
    return `<p class="document-paragraph">${text}</p>`;
  }

  function renderDocument(language) {
    const blocks = DATA.documents?.[language] || [];
    return blocks.map((block, index) => renderBlock(block, index, language)).join('');
  }

  function renderPage() {
    const course = DATA.course || {};
    const languageLabel = activeLanguage === 'zh' ? '课程信息' : 'Course Information';
    const documentLanguage = activeLanguage === 'zh' ? 'zh-CN' : 'en';

    app.innerHTML = `<div class="fade-in">
      <section class="course-hero">
        <div class="container course-hero-inner">
          <div class="hero-primary">
            <div class="hero-kicker">${esc(course.school)} · ${esc(course.term)}</div>
            <h1>${esc(course.titleZh)}</h1>
            <p class="hero-title-en">${esc(course.code)} · ${esc(course.titleEn)}</p>
          </div>
          <div class="hero-information">
            <p class="hero-slogan">${esc(course.slogan)}</p>
            <p class="hero-slogan-en">${esc(course.sloganEn)}</p>
            <div class="hero-meta" aria-label="课程基本信息">
              <span>${esc(course.units)}</span>
              <span>${esc(course.hours)}</span>
              <span>${esc(course.format)}</span>
            </div>
            <div class="hero-actions">
              <a class="hero-action-button download-button" href="${DOWNLOAD_URL}" download="AIE3905-20260701.pdf">
                <span aria-hidden="true">↓</span>
                下载课程信息文件
              </a>
              <a class="hero-action-button registration-button" href="${REGISTRATION_URL}" target="_blank" rel="noopener noreferrer">
                课程报名
                <span aria-hidden="true">→</span>
              </a>
            </div>
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
            <div class="language-switch" role="group" aria-label="选择课程信息语言">
              <button type="button" data-language="zh" class="${activeLanguage === 'zh' ? 'active' : ''}" aria-pressed="${activeLanguage === 'zh'}">中文</button>
              <button type="button" data-language="en" class="${activeLanguage === 'en' ? 'active' : ''}" aria-pressed="${activeLanguage === 'en'}">English</button>
            </div>
          </div>
          <article class="course-document" lang="${documentLanguage}">
            ${renderDocument(activeLanguage)}
          </article>
        </div>
      </section>
    </div>`;

    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        const nextLanguage = button.dataset.language;
        if (nextLanguage === activeLanguage) return;
        activeLanguage = nextLanguage;
        renderPage();
      });
    });
  }

  renderPage();
})();
