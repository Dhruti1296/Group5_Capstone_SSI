from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 10)

try:
    print("Starting Test...")

    # -------------------------
    # STEP 1: LOGIN
    # -------------------------
    driver.get("http://localhost:3000/login")
    time.sleep(2)

    username = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Username']"))
    )
    password = driver.find_element(By.XPATH, "//input[@placeholder='Password']")

    for char in "dhruti":
        username.send_keys(char)
        time.sleep(0.3)

    for char in "dhruti123":
        password.send_keys(char)
        time.sleep(0.3)

    time.sleep(1)

    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
    login_button.click()

    print("Login successful")
    time.sleep(3)

    # -------------------------
    # STEP 2: DASHBOARD
    # -------------------------
    wait.until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), \"What's on your mind\")]")
        )
    )

    print("Dashboard loaded")
    time.sleep(2)

    # -------------------------
    # STEP 3: CREATE BLOG POST
    # -------------------------
    post_box_trigger = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[contains(text(), \"What's on your mind\")]")
        )
    )

    post_box_trigger.click()
    print("Post modal opened")
    time.sleep(2)

    post_input = wait.until(
        EC.presence_of_element_located((By.XPATH, "//textarea"))
    )

    post_input.send_keys("This is an automated test post")
    time.sleep(2)

    post_button = driver.find_element(By.XPATH, "//button[text()='Post']")
    post_button.click()

    print("Post submitted")
    time.sleep(3)

    wait.until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'This is an automated test post')]")
        )
    )

    print("Post created successfully")
    time.sleep(2)

    # -------------------------
    # STEP 4: NAVIGATION (EVENTS)
    # -------------------------
    events_link = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//a[contains(text(),'Events')]"))
    )

    events_link.click()
    time.sleep(2)

    wait.until(
        EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(),'Events')]")
        )
    )

    print("Navigation to Events page successful")

    print("ALL TESTS PASSED")

except Exception as e:
    print("TEST FAILED:", e)

finally:
    time.sleep(2)
    driver.quit()