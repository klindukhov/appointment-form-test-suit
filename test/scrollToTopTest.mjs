import { By, Key, until } from "selenium-webdriver";
import { getDriver } from "../utils/webDriverSetup.mjs";
import { expect } from "chai";

describe("Scroll to top Button", async () => {
  let driver;
  before(async () => (driver = await getDriver()));

  const scrollDown = async (driver) => {
    const footer = await driver.findElement(By.xpath("/html/body/footer"));
    const deltaY = Math.round((await footer.getRect()).y);

    await driver.actions().scroll(0, 0, 0, deltaY).perform();
  };
  const scrollToTop = async (driver) => {
    await driver.executeScript("window.scrollTo(0,0);");
  };

  // describe("For not logged in users", async () => {
  //   it("appears on all relevant pages after scrolling down", async () => {
  //     await driver.get("https://katalon-demo-cura.herokuapp.com/profile.php");
  //     const toTopButton = await driver.findElement(
  //       By.xpath('//*[@id="to-top"]')
  //     );
  //     await scrollDown(driver);
  //     await driver.wait(until.elementIsVisible(toTopButton), 2000);
  //     expect(await toTopButton.isDisplayed()).to.be.true;
  //   });
  //   it("is not displayed when the page is not scrolled down", async () => {
  //     await driver.get("https://katalon-demo-cura.herokuapp.com/profile.php");
  //     const toTopButton = await driver.findElement(
  //       By.xpath('//*[@id="to-top"]')
  //     );
  //     expect(await toTopButton.isDisplayed()).to.be.false;

  //     await scrollDown(driver);
  //     await scrollToTop(driver);
  //     await driver.wait(until.elementIsNotVisible(toTopButton), 2000);
  //     expect(await toTopButton.isDisplayed()).to.be.false;

  //     await driver.get("https://katalon-demo-cura.herokuapp.com/");
  //     expect(
  //       await (
  //         await driver.findElement(By.xpath('//*[@id="to-top"]'))
  //       ).isDisplayed()
  //     ).to.be.false;
  //   });
  //   it("disappears after it is pressed", async () => {
  //     await driver.get("https://katalon-demo-cura.herokuapp.com/profile.php");
  //     const toTopButton = await driver.findElement(
  //       By.xpath('//*[@id="to-top"]')
  //     );
  //     await scrollDown(driver);
  //     await driver.wait(until.elementIsVisible(toTopButton), 2000);
  //     await toTopButton.click();
  //     await driver.wait(until.elementIsNotVisible(toTopButton), 2000);
  //     expect(await toTopButton.isDisplayed()).to.be.false;
  //   });
  //   it("scrolls the page to the top", async () => {
  //     await driver.get("https://katalon-demo-cura.herokuapp.com/profile.php");
  //     const toTopButton = await driver.findElement(
  //       By.xpath('//*[@id="to-top"]')
  //     );
  //     await scrollDown(driver);
  //     await driver.wait(until.elementIsVisible(toTopButton), 2000);
  //     expect(await toTopButton.isDisplayed()).to.be.true;
  //     await toTopButton.click();
  //     await driver.wait(until.elementIsNotVisible(toTopButton));
  //     expect(await driver.executeScript("return window.scrollY;")).to.equal(0);
  //   });
  // });

  describe("For logged in users", async () => {
    before(async () => {
      await driver.get("https://katalon-demo-cura.herokuapp.com/");
      try {
        await driver.findElement(
          By.xpath('//*[@id="appointment"]/div/div/div/h2')
        );
      } catch {
        await (await driver.findElement(By.id("btn-make-appointment"))).click();
        await (
          await driver.findElement(By.xpath('//*[@id="txt-username"]'))
        ).sendKeys("John Doe");
        await (
          await driver.findElement(By.xpath('//*[@id="txt-password"]'))
        ).sendKeys("ThisIsNotAPassword", Key.RETURN);
        await driver.wait(
          until.urlIs("https://katalon-demo-cura.herokuapp.com/#appointment"),
          2000
        );
      }
    });

    it("appears on all relevant pages after scrolling down", async () => {
      for (const url of [
        "https://katalon-demo-cura.herokuapp.com/",
        "https://katalon-demo-cura.herokuapp.com/history.php",
        "https://katalon-demo-cura.herokuapp.com/profile.php",
      ]) {
        await driver.get(url);
        const toTopButton = await driver.findElement(
          By.xpath('//*[@id="to-top"]')
        );
        await scrollDown(driver);
        await driver.wait(until.elementIsVisible(toTopButton), 2000);
        expect(await toTopButton.isDisplayed()).to.be.true;
      }
    });
    it("is not displayed when the page is not scrolled down", async () => {
      for (const url of [
        "https://katalon-demo-cura.herokuapp.com/",
        "https://katalon-demo-cura.herokuapp.com/history.php",
        "https://katalon-demo-cura.herokuapp.com/profile.php",
      ]) {
        await driver.get(url);
        const toTopButton = await driver.findElement(
          By.xpath('//*[@id="to-top"]')
        );
        expect(await toTopButton.isDisplayed()).to.be.false;

        await scrollDown(driver);
        await scrollToTop(driver);
        await driver.wait(until.elementIsNotVisible(toTopButton), 2000);
        expect(await toTopButton.isDisplayed()).to.be.false;
      }
    });
    it("disappears after it is pressed", async () => {
      for (const url of [
        "https://katalon-demo-cura.herokuapp.com/",
        "https://katalon-demo-cura.herokuapp.com/history.php",
        "https://katalon-demo-cura.herokuapp.com/profile.php",
      ]) {
        await driver.get(url);
        const toTopButton = await driver.findElement(
          By.xpath('//*[@id="to-top"]')
        );
        expect(await toTopButton.isDisplayed()).to.be.false;

        await scrollDown(driver);
        await driver.wait(until.elementIsVisible(toTopButton), 2000);
        await toTopButton.click();
        await driver.wait(until.elementIsNotVisible(toTopButton), 2000);
        expect(await toTopButton.isDisplayed()).to.be.false;
      }
    });
    it("scrolls the page to the top", async () => {
      for (const url of [
        "https://katalon-demo-cura.herokuapp.com/",
        "https://katalon-demo-cura.herokuapp.com/history.php",
        "https://katalon-demo-cura.herokuapp.com/profile.php",
      ]) {
        await driver.get(url);
        const toTopButton = await driver.findElement(
          By.xpath('//*[@id="to-top"]')
        );
        expect(await toTopButton.isDisplayed()).to.be.false;

        await scrollDown(driver);
        await driver.wait(until.elementIsVisible(toTopButton), 2000);
        await toTopButton.click();
        await driver.wait(until.elementIsNotVisible(toTopButton), 2000);
        await driver.wait(
          until.elementIsVisible(await driver.findElement(By.css("header"))),
          2000
        );
        expect(await toTopButton.isDisplayed()).to.be.false;
        let waitTime = 2000;
        while ((await driver.executeScript("return window.scrollY;")) > 0) {
          await driver.manage().setTimeouts({ implicit: 200 });
          waitTime -= 200;
        }
        expect(await driver.executeScript("return window.scrollY;")).to.equal(
          0
        );
      }
    });
  });
});
