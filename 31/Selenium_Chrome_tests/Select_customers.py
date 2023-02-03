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

driver = webdriver.Chrome(service=Service('/home/user/qa/chromedriver/chromedriver'), options=options)
driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/list")

searchCustomer = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > form > div > div > input")))
searchCustomer.click()

searchCustomer.send_keys("Granger")

delCustomer = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > div > table > tbody > tr > td:nth-child(5) > button")))
delCustomer.click()

assert "Germiona" not in driver.page_source

driver.close()


