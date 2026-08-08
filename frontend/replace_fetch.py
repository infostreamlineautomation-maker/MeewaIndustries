import os

CLIENT_FILES = [
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\ContactFaqSection.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\Header.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\FeaturedCategories.tsx",
]

SERVER_FILES = [
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\WhyChooseUs.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\IndustriesWeServe.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\HeroSection.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\ExportProcess.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\landing\AboutCompany.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\components\Footer.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\app\contact\page.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\app\categories\page.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\app\about\page.tsx",
    r"d:\work\Meewa\MeewaIndustries\frontend\src\app\products\[slug]\page.tsx",
]

for filepath in CLIENT_FILES:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'fetchClientSettings' not in content:
            content = "import { fetchClientSettings } from '@/lib/fetchClientSettings';\n" + content
        content = content.replace("fetch('http://localhost:8000/settings')", "fetchClientSettings()")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
for filepath in SERVER_FILES:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'fetchServerSettings' not in content:
            content = "import { fetchServerSettings } from '@/lib/fetchSettings';\n" + content
        content = content.replace("fetch('http://localhost:8000/settings', { next: { revalidate: 10 } })", "fetchServerSettings()")
        content = content.replace("fetch('http://localhost:8000/settings')", "fetchServerSettings()")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
