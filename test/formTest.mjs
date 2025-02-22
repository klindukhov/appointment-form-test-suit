import { By, Key, until } from "selenium-webdriver";
import { closeDriver, getDriver } from "../utils/webDriverSetup.mjs";
import { expect } from "chai";

describe("Form tests", () => {
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
    await driver.wait(
      until.urlIs("https://katalon-demo-cura.herokuapp.com/#appointment")
    );
  });

  after(async () => closeDriver());

  it("Form is displayed", async () => {
    const formHeader = await (
      await driver.findElement(
        By.xpath('//*[@id="appointment"]/div/div/div/h2')
      )
    ).getText();
    expect(formHeader).to.contain("Make Appointment");

    const formText = await (
      await driver.findElement(By.xpath('//*[@id="appointment"]/div/div/form'))
    ).getText();
    expect(formText).to.contain("Facility");
    expect(formText).to.contain("Healthcare Program");
    expect(formText).to.contain("Visit Date (Required)");
    expect(formText).to.contain("Comment");
    expect(formText).to.contain("Book Appointment");

    expect(
      (await driver.findElements(By.xpath('//*[@id="combo_facility"]')))
        .length > 0
    ).to.be.true;
    expect(
      (
        await driver.findElements(
          By.xpath('//*[@id="appointment"]/div/div/form/div[2]/div/label')
        )
      ).length > 0
    ).to.be.true;
    expect(
      (
        await driver.findElements(
          By.xpath('//*[@id="appointment"]/div/div/form/div[3]/div')
        )
      ).length > 0
    ).to.be.true;
    expect(
      (
        await driver.findElements(
          By.xpath('//*[@id="appointment"]/div/div/form/div[4]/div')
        )
      ).length > 0
    ).to.be.true;
    expect(
      (
        await driver.findElements(
          By.xpath('//*[@id="appointment"]/div/div/form/div[5]/div')
        )
      ).length > 0
    ).to.be.true;
  });

  it("Form can be filled", async () => {
    const facilityDropdown = await driver.findElement(
      By.xpath('//*[@id="combo_facility"]')
    );
    await facilityDropdown.click();

    const facilityDropdownOption = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="combo_facility"]/option[2]')),
      5000
    );
    await facilityDropdownOption.click();

    const checkBox = await driver.findElement(
      By.xpath('//*[@id="chk_hospotal_readmission"]')
    );
    await checkBox.click();

    const radioButton = await driver.findElement(
      By.xpath('//*[@id="radio_program_medicaid"]')
    );
    await radioButton.click();

    const visitDate = await driver.findElement(
      By.xpath('//*[@id="txt_visit_date"]')
    );
    await visitDate.sendKeys("03/05/2025");
    expect(await visitDate.getAttribute("value")).to.equal("03/05/2025");

    await visitDate.click();

    //The date at this location changes depending on the current month, but as "03/05/2025" was previosly selected, this will allways be "09/05/2025"
    const visitDateOption = await driver.wait(
      until.elementLocated(
        By.xpath("/html/body/div/div[1]/table/tbody/tr[2]/td[6]"),
        5000
      )
    );
    await driver.wait(until.elementIsVisible(visitDateOption), 5000);
    await visitDateOption.click();

    const commentTextArea = await driver.findElement(
      By.xpath('//*[@id="txt_comment"]')
    );
    await commentTextArea.sendKeys("Comment text");

    expect(await facilityDropdownOption.isSelected()).to.be.true;
    expect(await checkBox.isSelected()).to.be.true;
    expect(await radioButton.isSelected()).to.be.true;
    expect(await visitDate.getAttribute("value")).to.equal("09/05/2025");
    expect(await commentTextArea.getAttribute("value")).to.equal(
      "Comment text"
    );
  });

  it("Form can be submitted", async () => {
    await (
      await driver.findElement(By.xpath('//*[@id="btn-book-appointment"]'))
    ).click();

    await driver.wait(
      until.urlIs(
        "https://katalon-demo-cura.herokuapp.com/appointment.php#summary"
      )
    );

    expect(
      await (
        await driver.findElement(
          By.xpath('//*[@id="summary"]/div/div/div[1]/h2')
        )
      ).getText()
    ).to.contain("Appointment Confirmation");
  });

  it("Form information is saved correctly", async () => {
    const facilityField = await driver.findElement(
      By.xpath('//*[@id="summary"]/div/div/div[2]')
    );
    const readmissionField = await driver.findElement(
      By.xpath('//*[@id="summary"]/div/div/div[3]')
    );
    const healthcareField = await driver.findElement(
      By.xpath('//*[@id="summary"]/div/div/div[4]')
    );
    const dateField = await driver.findElement(
      By.xpath('//*[@id="summary"]/div/div/div[5]')
    );
    const commentField = await driver.findElement(
      By.xpath('//*[@id="summary"]/div/div/div[6]')
    );

    //Data from the previous it() clause
    expect(await facilityField.getText()).to.contain(
      "Hongkong CURA Healthcare Center"
    );
    expect(await readmissionField.getText()).to.contain("Yes");
    expect(await healthcareField.getText()).to.contain("Medicaid");
    expect(await dateField.getText()).to.contain("09/05/2025");
    expect(await commentField.getText()).to.contain("Comment text");
  });

  it("Form cannot be submitted without a date", async () => {
    await (await driver.findElement(By.id("btn-make-appointment"))).click();
    await driver.wait(
      until.urlIs(
        "https://katalon-demo-cura.herokuapp.com/index.php#appointment"
      )
    );

    await (
      await driver.findElement(By.xpath('//*[@id="btn-book-appointment"]'))
    ).click();

    try {
      await driver.wait(
        until.urlIs(
          "https://katalon-demo-cura.herokuapp.com/appointment.php#summary"
        ),
        2000
      );
    } catch {}

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/index.php#appointment"
    );
  });

  // Supposed to fail
  it("Form cannot be submitted with a past date", async () => {
    await (await driver.findElement(By.id("btn-make-appointment"))).click();
    await driver.wait(
      until.urlIs(
        "https://katalon-demo-cura.herokuapp.com/index.php#appointment"
      )
    );

    const visitDate = await driver.findElement(
      By.xpath('//*[@id="txt_visit_date"]')
    );
    await visitDate.sendKeys("03/05/2020");

    await (
      await driver.findElement(By.xpath('//*[@id="btn-book-appointment"]'))
    ).click();

    try {
      await driver.wait(
        until.urlIs(
          "https://katalon-demo-cura.herokuapp.com/appointment.php#summary"
        ),
        2000
      );
    } catch {}

    expect(await driver.getCurrentUrl()).to.equal(
      "https://katalon-demo-cura.herokuapp.com/index.php#appointment"
    );
  });
});
