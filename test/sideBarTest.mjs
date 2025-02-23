import { By, Key, until } from "selenium-webdriver";
import { closeDriver, getDriver } from "../utils/webDriverSetup.mjs";
import { expect } from "chai";

describe("Sidebar", () => {
  let driver;

  const login = async (driver) => {
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
  };

  const toggleSidebarOn = async (driver) => {
    if (
      !(await (
        await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]'))
      ).isDisplayed())
    ) {
      await (
        await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
      ).click();
    }
  };

  before(async () => (driver = await getDriver()));
  after(async () => await closeDriver());

  describe("For not logged in users", async () => {
    describe("Toggle button", async () => {
      it("is displayed on all pages", async () => {
        await driver.get("https://katalon-demo-cura.herokuapp.com/");
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
          ).isDisplayed()
        ).to.be.true;

        await driver.get(
          "https://katalon-demo-cura.herokuapp.com/profile.php#login"
        );
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
          ).isDisplayed()
        ).to.be.true;
      });
      it("is working correctly", async () => {
        await driver.get("https://katalon-demo-cura.herokuapp.com/");
        await (
          await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
        ).click();
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]'))
          ).isDisplayed()
        ).to.be.true;
        await (
          await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
        ).click();
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]'))
          ).isDisplayed()
        ).to.be.false;
      });
    });
    describe("Sidebar buttons", () => {
      it("relevant are displayed", async () => {
        await toggleSidebarOn(driver);

        const sideBar = await driver.findElement(
          By.xpath('//*[@id="sidebar-wrapper"]')
        );
        await driver.wait(until.elementIsVisible(sideBar), 2000);

        expect(await sideBar.getText()).to.contain("Home");
        expect(await sideBar.getText()).to.contain("Login");
      });
      it("irrelevant are not displayed", async () => {
        await toggleSidebarOn(driver);
        const sideBar = await driver.findElement(
          By.xpath('//*[@id="sidebar-wrapper"]')
        );

        expect(await sideBar.getText()).to.not.contain("History");
        expect(await sideBar.getText()).to.not.contain("Profile");
        expect(await sideBar.getText()).to.not.contain("Logout");
      });
      it("are working correctly", async () => {
        await toggleSidebarOn(driver);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[2]/a')
          )
        ).click();
        await driver.wait(
          until.urlIs("https://katalon-demo-cura.herokuapp.com/"),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/"
        );

        await toggleSidebarOn(driver);

        const sideBar = await driver.findElement(
          By.xpath('//*[@id="sidebar-wrapper"]')
        );
        await driver.wait(until.elementIsVisible(sideBar), 2000);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[3]/a')
          )
        ).click();

        await driver.wait(
          until.urlIs(
            "https://katalon-demo-cura.herokuapp.com/profile.php#login"
          ),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/profile.php#login"
        );
      });
    });
  });

  describe("For logged in users", async () => {
    before(async () => await login(driver));

    describe("Toggle button", async () => {
      it("is displayed on all Pages", async () => {
        await driver.get("https://katalon-demo-cura.herokuapp.com/");
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
          ).isDisplayed()
        ).to.be.true;

        await driver.get(
          "https://katalon-demo-cura.herokuapp.com/history.php#history"
        );
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
          ).isDisplayed()
        ).to.be.true;

        await driver.get(
          "https://katalon-demo-cura.herokuapp.com/profile.php#profile"
        );
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
          ).isDisplayed()
        ).to.be.true;
      });
      it("is working correctly", async () => {
        await driver.get("https://katalon-demo-cura.herokuapp.com/");
        await (
          await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
        ).click();
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]'))
          ).isDisplayed()
        ).to.be.true;
        await (
          await driver.findElement(By.xpath('//*[@id="menu-toggle"]'))
        ).click();
        expect(
          await (
            await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]'))
          ).isDisplayed()
        ).to.be.false;
      });
    });
    describe("Sidebar buttons", () => {
      it("are displayed", async () => {
        await toggleSidebarOn(driver);

        const sideBar = await driver.findElement(
          By.xpath('//*[@id="sidebar-wrapper"]')
        );
        await driver.wait(until.elementIsVisible(sideBar), 2000);

        expect(await sideBar.getText()).to.contain("Home");
        expect(await sideBar.getText()).to.contain("History");
        expect(await sideBar.getText()).to.contain("Profile");
        expect(await sideBar.getText()).to.contain("Logout");
      });
      it("are working correctly", async () => {
        await toggleSidebarOn(driver);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[2]/a')
          )
        ).click();
        await driver.wait(
          until.urlIs("https://katalon-demo-cura.herokuapp.com/"),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/"
        );

        await toggleSidebarOn(driver);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[3]/a')
          )
        ).click();
        await driver.wait(
          until.urlIs(
            "https://katalon-demo-cura.herokuapp.com/history.php#history"
          ),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/history.php#history"
        );

        await toggleSidebarOn(driver);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[4]/a')
          )
        ).click();
        await driver.wait(
          until.urlIs(
            "https://katalon-demo-cura.herokuapp.com/profile.php#profile"
          ),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/profile.php#profile"
        );

        await toggleSidebarOn(driver);
        await (
          await driver.findElement(
            By.xpath('//*[@id="sidebar-wrapper"]/ul/li[2]/a')
          )
        ).click();
        await driver.wait(
          until.urlIs("https://katalon-demo-cura.herokuapp.com/"),
          2000
        );
        expect(await driver.getCurrentUrl()).to.equal(
          "https://katalon-demo-cura.herokuapp.com/"
        );
      });
    });
  });
});
