from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.options import Options
import time
options = Options()
options.add_argument("--no-sandbox")
options.add_argument("headless")

# # CHECK_TRANSACTIONS
driver = webdriver.Chrome(service=Service('/home/user/qa/chromedriver/chromedriver'), options=options)
driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/account")

DeposButton = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div:nth-child(5) > button:nth-child(2)")))
DeposButton.click()

backButton = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.box.mainhdr > button.btn.home")))
backButton.click()

assert "XYZ Bank" in driver.page_source

driver.close()