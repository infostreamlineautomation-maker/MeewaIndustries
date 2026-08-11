const fs = require('fs');
const path = require('path');

function fixFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Pattern for src={`${process.env.NEXT_PUBLIC_API_URL}${var}`}
    // We replace it with: src={(var)?.startsWith('http') ? (var) : `${process.env.NEXT_PUBLIC_API_URL}${var}`}
    const pattern = /src=\{`\$\{process\.env\.NEXT_PUBLIC_API_URL\}\$\{([^}]+)\}`\}/g;
    const replacement = 'src={($1)?.startsWith("http") ? ($1) : `${process.env.NEXT_PUBLIC_API_URL}${$1}`}';
    
    const newContent = content.replace(pattern, replacement);
    
    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Fixed ${filepath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            fixFile(fullPath);
        }
    }
}

const targetDir = path.join(__dirname, 'admin_frontend', 'src');
walkDir(targetDir);
console.log("Done");
