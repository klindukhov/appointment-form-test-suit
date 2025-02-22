import { Builder, Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

let driver;

const options = new Options();
options.addArguments("--guest");

export async function getDriver() {
  if (!driver) {
    driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build();
  }
  return driver;
}

export async function closeDriver() {
  if (driver) {
    await driver.quit();
    driver = null;
  }
}
