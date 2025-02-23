import { By, Key, until } from "selenium-webdriver";
import { expect } from "chai";
import { closeDriver, getDriver } from "../utils/webDriverSetup.mjs";

describe("Login Page", () => {
  let driver;

  before(async () => {
    driver = await getDriver();
    await driver.get("https://katalon-demo-cura.herokuapp.com/");
  });

  after(async () => await closeDriver());

  it("is opened after pressing Make Appointment", async function () {
    await (await driver.findElement(By.id("btn-make-appointment"))).click();

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/profile.php#login"
    );
  });

  it("displays an error message with invalid credentials", async function () {
    const loginField = await driver.findElement(
      By.xpath('//*[@id="txt-username"]')
    );
    await loginField.sendKeys("John Doe");

    const passwordField = await driver.findElement(
      By.xpath('//*[@id="txt-password"]')
    );
    await passwordField.sendKeys("WrongPassword", Key.RETURN);

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/profile.php#login"
    );
    expect(
      await (
        await driver.findElement(
          By.xpath('//*[@id="login"]/div/div/div[1]/p[2]')
        )
      ).getText()
    ).to.equal(
      "Login failed! Please ensure the username and password are valid."
    );
  });

  it("logs in successfully with valid credentials", async function () {
    const loginField = await driver.findElement(
      By.xpath('//*[@id="txt-username"]')
    );
    await loginField.sendKeys("John Doe");

    const passwordField = await driver.findElement(
      By.xpath('//*[@id="txt-password"]')
    );
    await passwordField.sendKeys("ThisIsNotAPassword", Key.RETURN);

    try {
      await driver.wait(
        until.urlIs("https://katalon-demo-cura.herokuapp.com/#appointment"),
        2000
      );
    } catch {}

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/#appointment"
    );
  });
});
