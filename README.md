# AccuWeather One Automation Framework
A scalable end-to-end test automation framework for the **AccuWeather One** web application, built using **Playwright and TypeScript** with a modular Page Object Model architecture.

The framework is designed to provide maintainable, reusable, and reliable UI automation with centralized configuration, reusable fixtures, authentication state management, detailed test reporting, and CI/CD integration.

## 🔗 Repository
[AccuWeather One Automation – GitHub](https://github.com/shivas-092/accuweather-one-automation)

---

## 🚀 Tech Stack
TechnologyPurpose**Playwright**End-to-end browser automation**TypeScript**Test framework and application code**Node.js / npm**Runtime and dependency management**Page Object Model**Page-level abstraction and maintainability**Custom Fixtures**Reusable test setup and context**dotenv**Environment configuration**GitHub Actions**CI/CD test execution**HTML Reporter**Test execution reportingThe project currently uses Playwright `^1.52.0`, TypeScript `^5.7.3`, Node.js type definitions, and dotenv.

---

## 📌 Project Overview
The purpose of this framework is to automate critical user journeys and UI functionality of the AccuWeather One application.

The framework follows a modular architecture where:

- **Page Objects** contain page-level interactions and reusable workflows.
- **Components** encapsulate reusable UI elements.
- **Fixtures** provide reusable test setup and extensions.
- **Configuration** centralizes environment and framework settings.
- **Tests** contain the actual business-level test scenarios.
- **GitHub Actions** supports automated execution through CI/CD.
The current repository is organized around `src`, `tests`, Playwright configuration, and GitHub Actions workflows.

---

## 🏗️ Framework Architecture

```
accuweather-one-automation/
│
├── .github/
│   └── workflows/
│       └── GitHub Actions workflows
│
├── src/
│   ├── components/
│   │   ├── bottomNav.component.ts
│   │   ├── legendSidebar.component.ts
│   │   └── searchBar.component.ts
│   │
│   ├── config/
│   │   ├── environment.ts
│   │   └── globalSetup.ts
│   │
│   ├── fixtures/
│   │   └── baseTest.ts
│   │
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── daily.page.ts
│   │   ├── hourly.page.ts
│   │   ├── maps.page.ts
│   │   ├── onboarding.page.ts
│   │   ├── premiumUpsell.page.ts
│   │   └── today.page.ts
│   │
│   └── utils/
│
├── tests/
│   └── Test specifications
│
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── state.json
└── tsconfig.json
```
The repository currently contains dedicated component, configuration, fixture, page, and utility layers under `src`.

---

## 🧩 Page Object Model
The framework uses a **Page Object Model (POM)** approach to separate test scenarios from UI implementation details.

### Page Objects
The current page layer includes:

- `base.page.ts`
- `today.page.ts`
- `daily.page.ts`
- `hourly.page.ts`
- `maps.page.ts`
- `onboarding.page.ts`
- `premiumUpsell.page.ts`
These page classes provide reusable methods for interacting with the corresponding areas of the application.

### Components
Reusable UI components are maintained separately:

- `bottomNav.component.ts`
- `legendSidebar.component.ts`
- `searchBar.component.ts`
This separation helps avoid duplicating common UI interactions across test cases.

---

## 🧪 Test Automation
The framework uses Playwright Test as the execution engine.

Tests are maintained under:

```
tests/
```
The Playwright configuration points the test runner to this directory.

The framework is intended to validate important AccuWeather One user flows and UI functionality such as:

- Home / Today experience
- Location and search functionality
- Daily weather information
- Hourly weather information
- Maps
- Bottom navigation
- Sidebar interactions
- Onboarding flows
- Premium-related UI
- Other application-level UI scenarios

---

## 🔐 Authentication & State Management
The framework uses Playwright's **storage state** capability.

A setup project is configured to execute the authentication setup before the main Chromium test project. The generated `state.json` is then reused by the test project through Playwright's `storageState` configuration.

This approach helps avoid repeating authentication steps unnecessarily for every test.

### Execution flow

```
Test Execution
      │
      ▼
Authentication Setup
      │
      ▼
Generate / Load state.json
      │
      ▼
Chromium Test Project
      │
      ▼
Execute Test Cases
```

---

## ⚙️ Playwright Configuration
The framework configuration is maintained in:

```
playwright.config.ts
```
Current configuration includes:

- Test directory: `./tests`
- Chromium project
- Authentication setup project
- Saved storage state
- HTML reporter
- List reporter
- 45-second test timeout
- 15-second action timeout
- Screenshot on failure
- Video retained on failure
- Trace captured on first retry
- 1440 × 900 viewport
- Geolocation permissions
- Single worker execution

---

## 📊 Test Reporting
The framework generates Playwright HTML reports along with console/list output.

### Generate / view report

```
npm run report
```
The command opens the generated Playwright HTML report.

The framework is configured with:

```
HTML Reporter
List Reporter
```
This provides both a detailed browser-based report and execution output in the terminal.

---

## 🛠️ Failure Diagnostics
The framework is configured to automatically collect debugging information when tests fail.

### Screenshots
Screenshots are captured only when a test fails:

```
screenshot: 'only-on-failure'
```

### Video
Video is retained for failed tests:

```
video: 'retain-on-failure'
```

### Trace
Playwright tracing is enabled on the first retry:

```
trace: 'on-first-retry'
```
These diagnostics make it easier to investigate failed test executions.

---

## 🌐 Environment Configuration
Environment-specific values are managed through:

```
src/config/environment.ts
```
The Playwright configuration consumes the environment configuration for the application `baseURL`.

Sensitive or environment-specific values should not be hardcoded into test specifications.

---

## 📦 Installation

### 1. Clone the repository

```
git clone https://github.com/shivas-092/accuweather-one-automation.git
```

### 2. Navigate to the project

```
cd accuweather-one-automation
```

### 3. Install dependencies

```
npm install
```

### 4. Install Playwright browsers

```
npx playwright install
```

---

## ▶️ Running Tests

### Run all tests

```
npm test
```

### Run tests with a visible browser

```
npm run test:headed
```

### Run tests using Playwright UI Mode

```
npm run test:ui
```

### Open the HTML report

```
npm run report
```
These commands are defined in the project's `package.json`.

---

## 🖥️ Running a Specific Test
A specific test file can be executed using:

```
npx playwright test tests/<test-file>.spec.ts
```
For example:

```
npx playwright test tests/home.spec.ts
```
Replace the file name with the required test specification available in the repository.

---

## 🔄 CI/CD
The project contains GitHub Actions workflow configuration under:

```
.github/workflows/
```
This allows Playwright tests to be integrated into a CI/CD pipeline and executed through GitHub Actions.

Playwright officially supports running automated tests through GitHub Actions, including installation of dependencies, browser setup, test execution, and report artifact handling.

---

## 🧱 Design Principles
The framework follows these core principles:

### 1. Reusability
Common UI interactions are abstracted into Page Objects and Components.

### 2. Maintainability
Selectors and page-specific logic are separated from test scenarios.

### 3. Scalability
New pages, components, fixtures, and test suites can be added without significantly affecting existing tests.

### 4. Centralized Configuration
Environment and Playwright settings are maintained separately from test logic.

### 5. Failure Diagnostics
Screenshots, videos, and traces provide additional information when test execution fails.

### 6. CI/CD Readiness
The framework is structured for automated execution through GitHub Actions.

---

## 📁 Key Framework Files
File / DirectoryResponsibility`src/pages/`Page Object classes`src/components/`Reusable UI components`src/fixtures/`Custom Playwright fixtures`src/config/`Environment and global configuration`src/utils/`Reusable utility functions`tests/`Test specifications`playwright.config.ts`Playwright test runner configuration`package.json`Dependencies and npm scripts`.github/workflows/`CI/CD workflows`state.json`Playwright authentication/session state
---

## 🔍 Framework Execution Flow

```
                    ┌─────────────────────┐
                    │     Test Runner     │
                    │     Playwright      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Authentication Setup│
                    │     state.json      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Test Fixtures    │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │          Test Specs             │
              └───────────────┬────────────────┘
                              │
                              ▼
                ┌──────────────────────────┐
                │       Page Objects       │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │      UI Components       │
                └────────────┬─────────────┘
                             │
                             ▼
                ┌──────────────────────────┐
                │     AccuWeather One      │
                └──────────────────────────┘
```

---

## 📈 Benefits of the Framework

- Clean and modular automation architecture
- Type-safe test development using TypeScript
- Reusable Page Object Model implementation
- Reusable component abstraction
- Custom Playwright fixtures
- Centralized environment configuration
- Authentication state reuse
- Screenshot, video, and trace-based failure diagnostics
- HTML test reporting
- Chromium-based automated execution
- GitHub Actions integration
- Easy extension for additional application modules and test scenarios

---

## 🔮 Future Enhancements
Potential improvements for future iterations include:

- Cross-browser execution across Chromium, Firefox, and WebKit
- Parallel test execution
- Enhanced test tagging and suite filtering
- Allure reporting
- API automation
- Data-driven test execution
- Visual regression testing
- Accessibility testing
- Expanded CI/CD reporting and artifact management
- Additional environment support

---

## 👨‍💻 Author
**Shivasai Billa**

QA Automation Engineer | Playwright | TypeScript | Test Automation

---

## 📄 License
This project is intended for automation and testing purposes.

---

## ⭐ Project
If you find this automation framework useful, consider starring the repository:

[AccuWeather One Automation – GitHub](https://github.com/shivas-092/accuweather-one-automation)
