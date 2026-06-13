# FHB MCCE – Group 2: Member Management Test Suite

Automated test suite for the **Member Management** domain of the Library Management System.  
Course: *DevOps – Testing* | Master Cloud Computing Engineering | University of Applied Sciences Burgenland

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

---

## 1 – Install dependencies

```bash
# Clone this repository
git clone https://github.com/andimcce/devops-testing-member-management-group-g.git
cd devops-testing-member-management-group-g

# Install test dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium
```

---

## 2 – Set up and start the System Under Test (SUT)

The SUT must be running before any tests are executed.

```bash
# Clone the SUT (do this once, outside the test repo)
git clone https://github.com/horvathkevin/FHB-MCCE-Library-Management-System-Student.git sut
cd sut
npm install
npm run seed   # resets the database to the known clean state
npm start      # starts the server on http://localhost:3000
```

> **Important:** Run `npm run seed` before every test session to guarantee a clean database state.

---

## 3 – Configure the SUT path (local runs only)

The API tests call `npm run seed` automatically before each test file.  
Set the `SUT_DIR` environment variable to point to your local SUT clone:

```bash
export SUT_DIR=/path/to/sut          # macOS / Linux
set SUT_DIR=C:\path\to\sut           # Windows
```

If `SUT_DIR` is not set, the helper defaults to `../sut` (one level up from this repo).

---

## 4 – Run the full test suite

```bash
# API tests (Jest + Supertest) — 26 tests
npm run test:api

# E2E / UI tests (Playwright) — 5 tests
npm run test:e2e
```

---

## 5 – Run a single test file or test

```bash
# Run one API test file
npx jest tests/api/members.register.test.js

# Run tests matching a name pattern
npx jest --testNamePattern="should return 409"

# Run a single Playwright test file
npx playwright test tests/e2e/members.ui.spec.js

# Run a single Playwright test by title
npx playwright test --grep "register a new member"
```

---

## 6 – Read the test report

### Jest (API tests)
- **Console output** – pass/fail summary printed after each run
- **JUnit XML** – `test-results/junit.xml` – lists all 26 API tests with pass/fail, duration, and error details

### Playwright (E2E tests)
- **Console output** – live list reporter during the run
- **JUnit XML** – `test-results/e2e-junit.xml` – lists all 5 E2E tests with pass/fail and error details
- **HTML report** – `playwright-report/index.html` – open in a browser for a visual overview with screenshots on failure

```bash
# Open the Playwright HTML report after a local run
npx playwright show-report playwright-report
```

### In CI (GitHub Actions)
After every pipeline run, a `test-results` artifact is published at the bottom of the workflow run page.  
Download the zip to access all report files locally.  
The pipeline exits with a non-zero code if any test fails, which marks the run as ❌ in GitHub.

---

## Repository Structure