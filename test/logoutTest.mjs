import { By, Key } from "selenium-webdriver";
import { expect } from "chai";
import { closeDriver, getDriver } from "../utils/webDriverSetup.mjs";

describe("Logout", () => {
  let driver;

  before(async () => {
    driver = await getDriver();
    await driver.get("https://katalon-demo-cura.herokuapp.com/");
    await (await driver.findElement(By.id("btn-make-appointment"))).click();
    await (
      await driver.findElement(By.xpath('//*[@id="txt-username"]'))
    ).sendKeys("John Doe");
    await (
      await driver.findElement(By.xpath('//*[@id="txt-password"]'))
    ).sendKeys("ThisIsNotAPassword", Key.RETURN);
  });
  after(async () => await closeDriver());

  it("logs out successfully", async function () {
    await (
      await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
    ).click();

    await (
      await driver.findElement(
        By.xpath('//*[@id="sidebar-wrapper"]/ul/li[5]/a')
      )
    ).click();

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/"
    );
  });
});
