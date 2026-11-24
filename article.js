(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  const category = params.get('category');
  const title = document.getElementById('article-title');
  const meta = document.getElementById('article-meta');
  const cover = document.getElementById('article-cover');
  const body = document.getElementById('article-body');
  const status = document.getElementById('article-status');
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const dateLabel = value => {
    if (!value) return '';
    const date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
  };

  if (!slug || !['science', 'gaming'].includes(category)) {
    status.textContent = 'මෙම ලිපිය සොයාගත නොහැක.';
    return;
  }

  fetch('articles.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('Article data unavailable'); return response.json(); })
    .then(articles => {
      const article = articles.find(item => item.slug === slug && item.category === category);
      if (!article) throw new Error('Article not found');
      document.title = `${article.title} | DEEP DIVE NEXUS`;
      title.textContent = article.title;
      meta.textContent = `${dateLabel(article.date)} · ${category.toUpperCase()}`;
      if (article.cover) {
        cover.src = article.cover;
        cover.alt = article.title;
        cover.hidden = false;
      }
      if (window.marked && window.DOMPurify) {
        body.innerHTML = window.DOMPurify.sanitize(window.marked.parse(article.body || ''));
      } else {
        body.textContent = article.body || '';
      }
      status.textContent = '';
    })
    .catch(error => { status.textContent = 'මෙම ලිපිය දැනට ලබාගත නොහැක.'; console.error(error); });
})();
