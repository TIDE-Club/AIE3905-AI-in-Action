(function () {
  const DATA = window.MENTOR_DATA || {};
  const app = document.getElementById('mentor-app');
  const languageSwitch = document.getElementById('language-switch');
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

  function renderResponsibility(text) {
    const separatorIndex = text.search(/[:：]/);
    if (separatorIndex < 0) return esc(text);
    const label = text.slice(0, separatorIndex + 1);
    const description = text.slice(separatorIndex + 1);
    return `<strong>${esc(label)}</strong>${esc(description)}`;
  }

  function renderPage() {
    const copy = DATA[activeLanguage] || DATA.zh;
    const isEnglish = activeLanguage === 'en';
    const documentLanguage = isEnglish ? 'en' : 'zh-CN';
    const backLabel = isEnglish ? 'Back to Course Information' : '返回课程信息';
    const switchLabel = isEnglish ? 'Select mentor responsibilities language' : '选择导师职责语言';

    document.documentElement.lang = documentLanguage;
    document.title = `AIE 3905 | ${copy.title}`;
    languageSwitch?.setAttribute('aria-label', switchLabel);
    languageSwitch?.querySelectorAll('[data-language]').forEach(button => {
      const isActive = button.dataset.language === activeLanguage;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    app.innerHTML = `<div class="mentor-page fade-in">
      <section class="mentor-hero">
        <div class="container mentor-hero-inner" lang="${documentLanguage}">
          <a class="mentor-back-link" href="./?lang=${activeLanguage}"><span aria-hidden="true">←</span>${backLabel}</a>
          <span class="eyebrow">AIE 3905</span>
          <h1>${esc(copy.title)}</h1>
        </div>
      </section>
      <section class="container mentor-content">
        <article class="mentor-document" lang="${documentLanguage}">
          ${copy.intro.map((paragraph, index) => `<p class="${index === 0 ? 'mentor-intro' : ''}">${esc(paragraph)}</p>`).join('')}
          <ul class="document-list mentor-responsibility-list">
            ${copy.responsibilities.map(item => `<li>${renderResponsibility(item)}</li>`).join('')}
          </ul>
          <p class="mentor-closing">${esc(copy.closing)}</p>
        </article>
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
