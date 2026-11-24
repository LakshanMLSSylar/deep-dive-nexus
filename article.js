
(function () {
  const category = document.body.dataset.category;
  const container = document.getElementById('article-list');
  const status = document.getElementById('article-status');
  const pagination = document.getElementById('pagination');

  const pageSize = 12;
  let currentPage = 1;
  let selected = [];

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));

  const dateLabel = value => {
    if (!value) return '';
    const date = new Date(value + 'T00:00:00');

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
  };

  const excerptText = value =>
    String(value || '')
      .replace(/[#*_>`\[\]!]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const imageHTML = article =>
    article.cover
      ? `<img class="article-cover" src="${escapeHTML(article.cover)}" alt="${escapeHTML(article.title)}" loading="lazy">`
      : '<div class="article-cover article-cover-empty">DEEP DIVE NEXUS</div>';

  function render() {
    const totalPages = Math.max(
      1,
      Math.ceil(selected.length / pageSize)
    );

    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * pageSize;
    const pageArticles = selected.slice(start, start + pageSize);

    container.innerHTML = pageArticles.map(article => {
      const fullExcerpt = excerptText(article.excerpt);
      const shortExcerpt = fullExcerpt.slice(0, 170);

      return `
        <article class="article-card">
          <a class="article-card-link"
             href="article.html?category=${encodeURIComponent(article.category)}&slug=${encodeURIComponent(article.slug)}">

            ${imageHTML(article)}

            <div class="article-card-content">
              <p class="article-meta">
                ${escapeHTML(dateLabel(article.date))}
                · ${escapeHTML(article.category.toUpperCase())}
              </p>

              <h2>${escapeHTML(article.title)}</h2>

              <p class="article-excerpt">
                ${escapeHTML(shortExcerpt)}${fullExcerpt.length > 170 ? '…' : ''}
              </p>

              <span class="read-more">Read Full Article →</span>
            </div>
          </a>
        </article>
      `;
    }).join('');

    status.textContent =
      `Showing ${start + 1}–${Math.min(start + pageSize, selected.length)} of ${selected.length} articles`;

    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const addButton = (label, page, disabled, active, aria) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = `page-button${active ? ' active' : ''}`;
      button.textContent = label;
      button.disabled = disabled;
      button.setAttribute('aria-label', aria || `Page ${page}`);

      if (!disabled) {
        button.addEventListener('click', () => {
          currentPage = page;
          render();

          document.querySelector('.article-section')
            .scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
        });
      }

      pagination.appendChild(button);
    };

    addButton(
      '← Previous',
      currentPage - 1,
      currentPage === 1,
      false,
      'Previous page'
    );

    const maxVisible = 5;
    let first = Math.max(1, currentPage - 2);
    let last = Math.min(totalPages, first + maxVisible - 1);

    first = Math.max(1, last - maxVisible + 1);

    for (let page = first; page <= last; page++) {
      addButton(
        String(page),
        page,
        false,
        page === currentPage
      );
    }

    addButton(
      'Next →',
      currentPage + 1,
      currentPage === totalPages,
      false,
      'Next page'
    );
  }

  fetch('articles.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Article data is not available yet.');
      }

      return response.json();
    })
    .then(articles => {
      selected = articles
        .filter(article => article.category === category)
        .sort((a, b) =>
          (b.date || '').localeCompare(a.date || '')
        );

      if (!selected.length) {
        status.textContent =
          'තවම ලිපි පළ කර නැහැ. අලුත් ලිපි ඉක්මනින් මෙතැනින් කියවන්න.';
        return;
      }

      render();
    })
    .catch(error => {
      status.textContent =
        'ලිපි දත්ත ලබාගැනීමට නොහැකි වුණා. කරුණාකර පසුව නැවත උත්සාහ කරන්න.';
      console.error(error);
    });
})();
