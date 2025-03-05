from selenium import webdriver

from selenium.webdriver.edge.service import Service

from bs4 import BeautifulSoup

# Path to the Edge WebDriver

edge_driver_path = 'msedgedriver.exe'

# Set up the Edge WebDriver

service = Service(edge_driver_path)

options = webdriver.EdgeOptions()

options.use_chromium = True  # Ensure Chromium-based Edge is used

# Initialize the WebDriver

driver = webdriver.Edge(service=service, options=options)

# URL of the web page to scrape

url = 'https://www.athlinks.com/event/219291/results/Event/1064637/Course/2413780/Results'

# Open the web page

driver.get(url)

# Get the page source

page_source = driver.page_source

# Close the browser

driver.quit()

# Parse the page source with Beautiful Soup

soup = BeautifulSoup(page_source, 'html.parser')

# Example: Extract all the links on the page

links = soup.find_all('a')

for link in links:
    print(link.get('href'))

# Example: Extract the title of the page

title = soup.title.string

print(f"Page Title: {title}")