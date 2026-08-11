import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and replace src={`${process.env.NEXT_PUBLIC_API_URL}${variable}`}
    pattern1 = r'src=\{`\$\{process\.env\.NEXT_PUBLIC_API_URL\}\$\{([^}]+)\}`\}'
    replacement1 = r'src={(\1)?.startsWith("http") ? (\1) : `${process.env.NEXT_PUBLIC_API_URL}${\1}`}'
    
    # Also handle some edge cases like `admin_frontend/src/app/landing/page.tsx` line 519:
    # src={feature.icon.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${feature.icon}` : feature.icon}
    # This one is probably fine if it uses .startsWith('/'), but actually cloudinary URLs might not start with '/'
    
    new_content = re.sub(pattern1, replacement1, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

def main():
    directory = r"d:\work\Meewa\MeewaIndustries\admin_frontend\src"
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
