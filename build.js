
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const root = __dirname;
const output = [];
const categories = ['science', 'gaming'];

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
      console.warn(`Skipping ${file}: missing YAML frontmatter`);
      continue;
    }

    let metadata;

    try {
      metadata = YAML.parse(match[1]) || {};
    } catch (error) {
      console.warn(`Skipping ${file}: ${error.message}`);
      continue;
    }

    const slug = file
      .replace(/\.md$/i, '')
      .replace(/^\d{4}-\d{2}-\d{2}-/, '');

    const body = metadata.body ?? match[2] ?? '';

    output.push({
      slug,
      category,
      title: String(metadata.title || slug),
      date: metadata.date ? String(metadata.date) : '',
      excerpt: String(metadata.excerpt || ''),
      cover: String(metadata.cover || ''),
      body: typeof body === 'string'
        ? body.trim()
        : JSON.stringify(body)
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

console.log(
  `Generated articles.json with ${output.length} article(s).`
);
