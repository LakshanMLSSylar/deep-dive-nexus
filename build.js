
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const root = __dirname;
const output = [];
const categories = ['science', 'gaming'];

function shortHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

for (const category of categories) {
  const dir = path.join(root, 'articles', category);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir)
    .filter(name => name.toLowerCase().endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const source = fs.readFileSync(fullPath, 'utf8')
      .replace(/^\uFEFF/, '');

    const match = source.match(
      /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)([\s\S]*)$/
    );

    if (!match) {
      console.warn(`Skipping ${category}/${file}: missing YAML frontmatter`);
      continue;
    }

    let metadata;

    try {
      metadata = YAML.parse(match[1]) || {};
    } catch (error) {
      console.warn(`Skipping ${category}/${file}: invalid YAML (${error.message})`);
      continue;
    }

    const base = file
      .replace(/\.md$/i, '')
      .replace(/^\d{4}-\d{2}-\d{2}-/, '');

    const title = String(metadata.title || base || 'Untitled article');

    const date = metadata.date instanceof Date
      ? metadata.date.toISOString().slice(0, 10)
      : String(metadata.date || '');

    const slug = base ||
      `${category}-${date || 'undated'}-${shortHash(title)}`;

    const excerpt = String(metadata.excerpt || '');
    const body = metadata.body || match[2] || excerpt;

    output.push({
      slug,
      category,
      title,
      date,
      excerpt,
      cover: String(metadata.cover || ''),
      body: String(body).trim()
    });
  }
}

output.sort((a, b) =>
  (b.date || '').localeCompare(a.date || '') ||
  a.title.localeCompare(b.title)
);

fs.writeFileSync(
  path.join(root, 'articles.json'),
  JSON.stringify(output, null, 2) + '\n'
);

console.log(`Generated articles.json with ${output.length} article(s).`);
