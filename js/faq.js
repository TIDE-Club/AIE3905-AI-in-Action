(function () {
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  const returnLanguage = requestedLanguage === 'en' ? 'en' : 'zh';
  const returnUrl = `./?lang=${returnLanguage}`;

  document.getElementById('faq-brand')?.setAttribute('href', returnUrl);
  document.getElementById('faq-back')?.setAttribute('href', returnUrl);
})();
