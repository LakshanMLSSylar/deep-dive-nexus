(function () {
  const params = new URLSearchParams(location.search);
  const category = document.body.dataset.category;
  const container = document.getElementById('article-list');
  const status = document.getElementById('article-status');
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const dateLabel = value => {
    if (!value) return '';
    const date = new Date(value + 'T00:00:00');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {year:'numeric', month:'long', day:'numeric'});
  };
  const imageHTML = article => article.cover
    ? `<img class="article-cover" src="${escapeHTML(article.cover)}" alt="${escapeHTML(article.title)}" loading="lazy">`
    : '<div class="article-cover article-cover-empty">DEEP DIVE NEXUS</div>';

  fetch('articles.json', { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error('Article data is not available yet.'); return response.json(); })
    .then(articles => {
      const selected = articles.filter(article => article.category === category);
      if (!selected.length) {
        status.textContent = 'තවම ලිපි පළ කර නැහැ. අලුත් ලිපි ඉක්මනින් මෙතැනින් කියවන්න.';
        return;
      }
      status.textContent = '';
      container.innerHTML = selected.map(article => `
        <article class="article-card">
          <a class="article-card-link" href="article.html?category=${encodeURIComponent(article.category)}&slug=${encodeURIComponent(article.slug)}">
            ${imageHTML(article)}
            <div class="article-card-content">
              <p class="article-meta">${escapeHTML(dateLabel(article.date))} · ${escapeHTML(article.category.toUpperCase())}</p>
              <h2>${escapeHTML(article.title)}</h2>
              <p>${escapeHTML(article.excerpt)}</p>
              <span class="read-more">Read article →</span>
            </div>
          </a>
        </article>`).join('');
    })
    .catch(error => { status.textContent = 'ලිපි දත්ත ලබාගැනීමට නොහැකි වුණා. කරුණාකර පසුව නැවත උත්සාහ කරන්න.'; console.error(error); });
})();
