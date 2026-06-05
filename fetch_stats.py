import requests
import json

# URL de Solo CKPool
url = "https://solo.ckpool.org/users/bc1q4gp9ycevf88wz8nhej89m4n2w3s760h88845xl"
headers = {'User-Agent': 'Mozilla/5.0'}

response = requests.get(url, headers=headers)

# Aquí procesas el contenido (usando BeautifulSoup si es necesario)
# Y guardas el resultado en un archivo JSON
data = {"raw_html": response.text} 

with open('stats.json', 'w') as f:
    json.dump(data, f)
