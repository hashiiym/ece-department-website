const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '.');

const processHtmlFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove `<hr>` if it exists right after header
  content = content.replace(/<\/header>\s*<hr[^>]*>/, '</header>');

  // We only want to process the main-nav block.
  const mainNavRegex = /<nav class="main-nav">([\s\S]*?)<\/nav>/g;
  
  content = content.replace(mainNavRegex, (match, navInner) => {
    // Process all <a> tags inside main-nav
    let newNavInner = navInner.replace(/<a([^>]*?)>/g, (aMatch, attrs) => {
      // Check if it's active
      const isActive = /class="[^"]*\bactive\b[^"]*"/.test(attrs) || /class='[^']*\bactive\b[^']*'/.test(attrs) || (!attrs.includes('class=') && /href="([^"]+)"/.exec(attrs) && false); // wait, we just check if it has active class.
      
      const isNavTrigger = /class="[^"]*\bnav-trigger\b[^"]*"/.test(attrs);

      let newClass = "";
      if (isActive) {
        newClass = "uppercase tracking-wider text-sm font-extrabold text-sky-600";
      } else {
        newClass = "uppercase tracking-wider text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors";
      }

      if (isNavTrigger) {
        newClass = "nav-trigger " + newClass;
      }

      // Remove existing class attribute
      let newAttrs = attrs.replace(/class="[^"]*"/, '').replace(/class='[^']*'/, '').trim();
      
      return `<a ${newAttrs} class="${newClass}">`;
    });
    return `<nav class="main-nav">\n${newNavInner}\n</nav>`; // preserve spacing
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${filePath}`);
};

const findHtmlFiles = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('figma')) {
            findHtmlFiles(fullPath);
        }
    } else if (file.endsWith('.html')) {
      processHtmlFile(fullPath);
    }
  });
};

findHtmlFiles(directoryPath);

// Also modify styles.css
const cssPath = path.join(directoryPath, 'styles.css');
if (fs.existsSync(cssPath)) {
  let cssContent = fs.readFileSync(cssPath, 'utf8');
  cssContent = cssContent.replace(/border-bottom:\s*1px\s*solid\s*#e5e7eb;/g, '');
  cssContent = cssContent.replace(/box-shadow:\s*0\s*4px\s*6px\s*-1px\s*rgba\(0,\s*0,\s*0,\s*0\.05\);/g, '');
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Processed styles.css');
}
