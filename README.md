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
.

├── .github/

│   └── workflows/

│       └── ci.yml                    # GitHub Actions pipeline

├── helpers/

│   └── api.js                        # Shared supertest instance & seed helper

├── tests/

│   ├── api/

│   │   ├── members.register.test.js  # TC-G2-001 to TC-G2-008

│   │   ├── members.get.test.js       # TC-G2-009 to TC-G2-012

│   │   ├── members.update.test.js    # TC-G2-013 to TC-G2-017

│   │   ├── members.status.test.js    # TC-G2-018 to TC-G2-022

│   │   └── members.delete.test.js    # TC-G2-023 to TC-G2-026

│   └── e2e/

│       └── members.ui.spec.js        # TC-G2-E01 to TC-G2-E05

├── playwright.config.js

├── package.json

└── README.md

---

## Test Coverage Summary

| ID Range | File | Area | Tests |
|---|---|---|---|
| TC-G2-001 – 008 | members.register.test.js | Registration | 8 |
| TC-G2-009 – 012 | members.get.test.js | Retrieval | 4 |
| TC-G2-013 – 017 | members.update.test.js | Updates | 5 |
| TC-G2-018 – 022 | members.status.test.js | Deactivate/Activate | 5 |
| TC-G2-023 – 026 | members.delete.test.js | Deletion | 4 |
| TC-G2-E01 – E05 | members.ui.spec.js | UI / E2E | 5 |
| **Total** | | | **31** |

---

## CI/CD

Tests run automatically on every push to `main` via **GitHub Actions**.  
The pipeline clones the SUT, seeds the database, runs all tests, and publishes JUnit XML and Playwright HTML reports as artifacts.

See `.github/workflows/ci.yml` for the full pipeline definition.