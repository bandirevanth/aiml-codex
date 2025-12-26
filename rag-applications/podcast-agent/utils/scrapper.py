import requests
from bs4 import BeautifulSoup

def scrape_page(url: str) -> str:
    print(f"🔗 Scraping: {url}")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"❌ Failed to fetch {url}: {e}")
        return ""

    soup = BeautifulSoup(response.text, 'html.parser')

    # Filter unwanted scripts and styles
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    paragraphs = soup.find_all("p")
    text = "\n".join(p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 40)

    return text
