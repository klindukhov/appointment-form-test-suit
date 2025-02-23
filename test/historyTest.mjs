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
        until.urlIs("https://katalon-demo-cura.herokuapp.com/#appointment")
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
      )
    );
  };

  before(async () => {
    driver = await getDriver();
    await openAppointmentForm(driver);
  });
  after(async () => closeDriver());
  it("displays created appointments", async () => {
    for (const form of forms) {
      await openAppointmentForm(driver);
      await submitForm(driver, form);
    }

    await driver.get(
      "https://katalon-demo-cura.herokuapp.com/history.php#history"
    );

    for (const form of forms) {
      expect(
        await (
          await driver.findElement(By.xpath('//*[@id="history"]'))
        ).getText()
      ).to.contain(form.date);
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
      const facility = await (
        await appointment.findElement(By.id("facility"))
      ).getText();
      const readmission = await (
        await appointment.findElement(By.id("hospital_readmission"))
      ).getText();
      const healthcare = await (
        await appointment.findElement(By.id("program"))
      ).getText();
      let comment = "";
      try {
        comment = await (
          await appointment.findElement(By.id("comment"))
        ).getText();
      } catch {}
      for (const form of forms) {
        if (appointmentDate.includes(form.date)) {
          expect(facility).to.equal(form.facility);
          expect(readmission).to.equal(form.readmission);
          expect(healthcare).to.equal(form.healthcare);
          expect(comment).to.equal(form.comment);
        }
      }
    }
  });

  it("has a working Home Button", async () => {
    await (
      await driver.findElement(By.xpath('//*[@id="history"]/div/div[3]/p/a'))
    ).click();

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/"
    );
  });
});
