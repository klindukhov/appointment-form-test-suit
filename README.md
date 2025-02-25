# CURA Healthcare Service Demo Test Suite

## Overview

This repository contains an automated test suite built using **Selenium WebDriver**, **Mocha**, and **Mochawesome** for testing [CURA Healthcare Service](https://katalon-demo-cura.herokuapp.com/) demo website.

## Prerequisites

Ensure you have the following installed before running the tests:

- **Node.js** (latest LTS recommended)
- **npm** (comes with Node.js)

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/klindukhov/appointment-form-test-suit.git
cd appointment-form-test-suit
npm i
```

## Running Tests

To execute tests, run:

```sh
npm test
```

## Test Reports

Mochawesome generates HTML test reports. After running tests, find reports in:

```sh
./mochawesome-report/mochawesome.html
```

## Project structure

```sh
📂 appointment-form-test-suit
│── 📂 test                 # Test scripts
│── 📂 utils                # Helper functions
│── 📂 mochawesome-report   # Generated reports
│── 📜 .mocharc.cjs         # Mocha configuration
│── 📜 testSetup.mjs        # Tests setup and teardown
│── 📜 package.json         # Dependencies and scripts
│── 📜 README.md            # Project summary
```

## Test suite overview

### Login Page

> ✔ Opens after pressing **Make Appointment** \
> ✔ Displays interactable **Login** and **Password** fields\
> ✔ Shows an error message for **invalid credentials**\
> ✔ Logs in successfully with **valid credentials**

### Logout

> ✔ Logs out successfully

### Appointment Form

> ✔ Is displayed\
> ✔ Can be filled\
> ✔ Can be submitted\
> ✔ Saves the information correctly\
> ✔ Cannot be submitted **without a date**\
> ❌ Cannot be submitted with a **past date**\
> ✔ Displays a working **Home** button in the summary

### History Page

> ✔ Displays created appointments\
> ✔ Shows the appointment information correctly\
> ✔ Has a working **Home** button

### Sidebar

> ### For Not Logged-in Users
>
> #### Toggle Button
>
> ✔ Is displayed on all pages\
> ✔ Works correctly
>
> #### Sidebar Buttons
>
> ✔ Relevant buttons are displayed\
> ✔ Irrelevant buttons are **not** displayed\
> ✔ All buttons work correctly

> ### For Logged-in Users
>
> #### Toggle Button
>
> ✔ Is displayed on all pages\
> ✔ Works correctly
>
> #### Sidebar Buttons
>
> ✔ Are displayed\
> ✔ Work correctly

### Scroll to Top Button

> ### For Not Logged-in Users
>
> ✔ Appears on all relevant pages after scrolling down\
> ✔ Is **not** displayed when the page is not scrolled down\
> ✔ Disappears after manually scrolling to top\
> ✔ Disappears after being pressed\
> ✔ Scrolls the page to the top

> ### For Logged-in Users
>
> ✔ Appears on all relevant pages after scrolling down\
> ✔ Is **not** displayed when the page is not scrolled down\
> ✔ Disappears after manually scrolling to top\
> ✔ Disappears after being pressed\
> ✔ Scrolls the page to the top
