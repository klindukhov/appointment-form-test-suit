import { closeDriver, getDriver } from "./utils/webDriverSetup.mjs";

before(async () => await getDriver());

after(async () => await closeDriver());
