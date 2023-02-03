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
driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login")
customerLogin = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.borderM.box.padT20 > div:nth-child(1) > button")))
# customerLogin = driver.find_element(By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.borderM.box.padT20 > div:nth-child(1) > button")
customerLogin.click()


userSelect = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "userSelect")))
userSelect.click()

nameCustomer = WebDriverWait(driver, 15).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#userSelect > option:nth-child(2)")))
nameCustomer.click()

loginButton = WebDriverWait(driver, 15).until(EC.element_to_be_clickable((By.XPATH, "/html/body/div/div/div[2]/div/form/button")))
loginButton.click()
time.sleep(3)

assert "Welcome" in driver.page_source

driver.close()







