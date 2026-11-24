DEEP DIVE NEXUS - CMS Article Display Update

මෙම ZIP එකේ ඇත්තේ වෙනස් කළ යුතු / අලුතින් එක් කළ files පමණි.

GitHub repository එකේ root එකට මේ ZIP එක Extract කර එහි files upload කරන්න. දැනට තිබෙන files overwrite කිරීමට විමසූ විට පහත files පමණක් replace කරන්න:
- science.html
- gaming.html
- styles.css

අලුතින් එක් කළ යුතු files:
- article.html
- article.js
- articles.js
- build.js
- package.json

වැදගත්: articles/ සහ images/ folders, .pages.yml, index.html, Google verification file සහ අනෙකුත් දැනට තිබෙන files delete/replace කරන්න එපා.

Netlify Build settings:
- Build command: npm run build
- Publish directory: .
- Base directory: හිස්ව තබන්න

Build command එක යෙදූ පසු Netlify deploy එකක් සිදු කරන්න. build.js මගින් articles/science සහ articles/gaming යටතේ ඇති Markdown ලිපි කියවා articles.json සාදයි. ඉන්පසු Science සහ Gaming pages ඒ JSON එකෙන් ලිපි පෙන්වයි.

Pages CMS හි Publish/Save කිරීමෙන් GitHub commit එකක් සිදු වන අතර GitHub-Netlify සම්බන්ධතාව නිසා Netlify නැවත build/deploy කරයි. ඒ නිසා අතින් ZIP නැවත නැවත deploy කිරීම අවශ්‍ය නොවේ.
