import { By, Key, until } from "selenium-webdriver";
import { closeDriver, getDriver } from "../utils/webDriverSetup.mjs";
import { expect } from "chai";

describe("History page", () => {
  let driver;

  const forms = [
    {
      facility: "Tokyo CURA Healthcare Center",
      readmission: "No",
      healthcare: "Medicare",
      date: "10/10/2050",
      comment: "Comment",
    },
    {
      facility: "Tokyo CURA Healthcare Center",
      readmission: "Yes",
      healthcare: "None",
      date: "10/10/2051",
      comment: "Comment",
    },
    {
      facility: "Seoul CURA Healthcare Center",
      readmission: "No",
      healthcare: "None",
      date: "10/10/2053",
      comment: "",
    },
  ];

  const openAppointmentForm = async (driver) => {
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

  const submitForm = async (driver, form) => {
    await (
      await driver.findElement(By.xpath('//*[@id="combo_facility"]'))
    ).click();

    await (
      await driver.wait(
        until.elementLocated(
          By.xpath(
            form.facility === "Tokyo CURA Healthcare Center"
              ? '//*[@id="combo_facility"]/option[1]'
              : form.facility === "Hongkong CURA Healthcare Center"
              ? '//*[@id="combo_facility"]/option[2]'
              : form.facility === "Seoul CURA Healthcare Center" &&
                '//*[@id="combo_facility"]/option[3]'
          )
        ),
        5000
      )
    ).click();

    if (form.readmission === "Yes") {
      await (
        await driver.findElement(
          By.xpath('//*[@id="chk_hospotal_readmission"]')
        )
      ).click();
    }

    await (
      await driver.findElement(
        By.xpath(
          form.healthcare === "Medicare"
            ? '//*[@id="radio_program_medicare"]'
            : form.healthcare === "Meicaid"
            ? '//*[@id="radio_program_medicaid"]'
            : form.healthcare === "None" && '//*[@id="radio_program_none"]'
        )
      )
    ).click();

    await (
      await driver.findElement(By.xpath('//*[@id="txt_visit_date"]'))
    ).sendKeys(form.date);

    await (
      await driver.findElement(By.xpath('//*[@id="txt_comment"]'))
    ).sendKeys(form.comment);

    await (
      await driver.findElement(By.xpath('//*[@id="btn-book-appointment"]'))
    ).click();
    await driver.wait(
      until.urlIs(
        "https://katalon-demo-cura.herokuapp.com/appointment.php#summary"
      ),
      2000
    );
  };

  before(async () => {
    driver = await getDriver();
    await openAppointmentForm(driver);
  });
  after(async () => await closeDriver());

  it("displays created appointments", async () => {
    for (const form of forms) {
      await openAppointmentForm(driver);
      await submitForm(driver, form);
    }

    await driver.get(
      "https://katalon-demo-cura.herokuapp.com/history.php#history"
    );

    for (const form of forms) {
      const historyComponent = await driver.findElement(
        By.xpath('//*[@id="history"]')
      );
      expect(await historyComponent.getText()).to.contain(form.date);
      expect(await historyComponent.isDisplayed()).to.be.true;
    }
  });

  it("displays the appointment information correctly", async () => {
    const appointmentEntries = await driver.findElements(
      By.className("col-sm-offset-2 col-sm-8")
    );

    for (const appointment of appointmentEntries) {
      const appointmentDate = await (
        await appointment.findElement(By.className("panel-heading"))
      ).getText();
      const facility = await appointment.findElement(By.id("facility"));
      const readmission = await appointment.findElement(
        By.id("hospital_readmission")
      );
      const healthcare = await appointment.findElement(By.id("program"));
      const comment = await appointment.findElement(By.id("comment"));

      for (const form of forms) {
        if (appointmentDate.includes(form.date)) {
          expect(await facility.getText()).to.equal(form.facility);
          expect(await facility.isDisplayed()).to.be.true;
          expect(await readmission.getText()).to.equal(form.readmission);
          expect(await readmission.isDisplayed()).to.be.true;
          expect(await healthcare.getText()).to.equal(form.healthcare);
          expect(await healthcare.isDisplayed()).to.be.true;
          expect(await comment.getText()).to.equal(form.comment);
          expect(await comment.isDisplayed()).to.equal(form.comment !== "");
        }
      }
    }
  });

  it("has a working Home Button", async () => {
    const homeButton = await driver.findElement(
      By.xpath('//*[@id="history"]/div/div[3]/p/a')
    );
    expect(await homeButton.isDisplayed()).to.be.true;

    await homeButton.click();
    try {
      await driver.wait(
        until.urlIs("https://katalon-demo-cura.herokuapp.com/"),
        2000
      );
    } catch {}

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/"
    );
  });
});
