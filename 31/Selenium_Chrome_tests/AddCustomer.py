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
driver.get("https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust")

InputFirstName = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > div > form > div:nth-child(1) > input")))
InputFirstName.send_keys("piter")

InputLastName = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > div > form > div:nth-child(2) > input")))
InputLastName.send_keys("parker")

InputPostCode = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > div > form > div:nth-child(3) > input")))
InputPostCode.send_keys("66006")

AddCustButton = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "body > div > div > div.ng-scope > div > div.ng-scope > div > div > form > button")))
AddCustButton.click()

alert = driver.switch_to.alert
alert.accept()

time.sleep(3)

assert "XYZ Bank" in driver.page_source



