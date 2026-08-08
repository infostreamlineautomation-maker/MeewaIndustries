import os
import re

directories = ['frontend/src', 'admin_frontend/src']

# regex to find 'http://localhost:8000/...' or "http://localhost:8000/..."
# and convert them to `${process.env.NEXT_PUBLIC_API_URL}/...`
# If they are already in backticks, we just replace `http://localhost:8000` with `${process.env.NEXT_PUBLIC_API_URL}`

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Replace inside existing template literals: `http://localhost:8000...`
    content = content.replace('`http://localhost:8000', '`${process.env.NEXT_PUBLIC_API_URL}')
    content = content.replace('`http://localhost:8001', '`${process.env.NEXT_PUBLIC_ADMIN_API_URL}')

    # 2. Replace single quote strings: 'http://localhost:8000/something' -> `${process.env.NEXT_PUBLIC_API_URL}/something`
    content = re.sub(r"'http://localhost:8000([^']*)'", r"`${process.env.NEXT_PUBLIC_API_URL}\1`", content)
    content = re.sub(r"'http://localhost:8001([^']*)'", r"`${process.env.NEXT_PUBLIC_ADMIN_API_URL}\1`", content)

    # 3. Replace double quote strings: "http://localhost:8000/something" -> `${process.env.NEXT_PUBLIC_API_URL}/something`
    content = re.sub(r'"http://localhost:8000([^"]*)"', r"`${process.env.NEXT_PUBLIC_API_URL}\1`", content)
    content = re.sub(r'"http://localhost:8001([^"]*)"', r"`${process.env.NEXT_PUBLIC_ADMIN_API_URL}\1`", content)
    
    # 4. Sometimes it might just be the raw string http://localhost:8000 (rare but just in case)
    # Actually, the above covers all React/NextJS usage.

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for d in directories:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                process_file(os.path.join(root, file))

print("Done!")
