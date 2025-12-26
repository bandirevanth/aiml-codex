from duckduckgo_search import DDGS

def duckDuckSearch(name: str) -> list:
    links = []
    with DDGS() as ddgs:
        for r in ddgs.text(name, region='wt-wt', safesearch='Moderate', timelimit='y'):
            if 'href' in r:
                links.append(r['href'])
            if len(links) == 3:
                break
    return links
