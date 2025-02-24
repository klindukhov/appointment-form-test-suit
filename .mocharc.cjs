module.exports = {
  file: "testSetup.mjs",
  bail: false,
  timeout: "10000",
  spec: [
    "test/loginTest.mjs",
    "test/logoutTest.mjs",
    "test/formTest.mjs",
    "test/historyTest.mjs",
    "test/sideBarTest.mjs",
    "test/scrollToTopTest.mjs",
  ],
};
