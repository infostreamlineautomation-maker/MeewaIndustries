import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Specific fix for the syntax error
    content = content.replace("`url(`${process.env.NEXT_PUBLIC_API_URL}${cat.cover_image}`)`", 
                              "`url('${cat.cover_image?.startsWith('http') ? cat.cover_image : process.env.NEXT_PUBLIC_API_URL + cat.cover_image}')`")
    
    # Generic fix for other occurrences
    pattern = r'`\$\{process\.env\.NEXT_PUBLIC_API_URL\}\$\{([^}]+)\}`'
    
    def repl(m):
        var = m.group(1)
        return f"`${{{var}?.startsWith('http') ? {var} : process.env.NEXT_PUBLIC_API_URL + {var}}}`"
        
    new_content = re.sub(pattern, repl, content)
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Done fixing URLs!")
