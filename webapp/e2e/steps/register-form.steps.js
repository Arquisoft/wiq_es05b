const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeEach(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: true,slowMo:10 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 120000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });

  test('The password does not fulfill the security parameters (length)', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user with short password', async () => {
      username = "prueba123"
      password = "prueba"
      await expect(page).toClick("a", { text:"Sign up" });
    });

    when('Fill the data in the form', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Alert about the weak password', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Password must be at least 8 characters long" });    });
  })

  test('The user is not registered in the site', ({ given, when, then }) => {
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "prueba123"
      password = "Prueba1213$"
      await expect(page).toClick("a", { text: "Sign up" });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Redirect to home page', async () => {
      await expect(page).toMatchElement("a", { text: "Play" });
    });
  })

  test('The username already exists', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user with repeated username', async () => {
      username = "prueba123"
      password = "Prueba1213$"
      await expect(page).toClick("a", { text:"Sign up" });
    });

    when('Fill the data in the form', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Alert about the username', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Username already exists" });    });
  })

  test('The password does not fulfill the security parameters (upperCase)', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user with non upperCase password', async () => {
      username = "prueba123"
      password = "prueba1213$"
      await expect(page).toClick("a", { text:"Sign up" });
    });

    when('Fill the data in the form', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Alert about the weak password', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Password must contain at least one uppercase letter" });    });
  })

  test('The password does not fulfill the security parameters (special character)', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user with non special character password', async () => {
      username = "prueba123"
      password = "Prueba1213j"
      await expect(page).toClick("a", { text:"Sign up" });
    });

    when('Fill the data in the form', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Alert about the weak password', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Password must contain at least one special character" });    });
  })

  test('The password does not fulfill the security parameters (number)', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user with non number password', async () => {
      username = "prueba123"
      password = "Pruebaaaaa$"
      await expect(page).toClick("a", { text:"Sign up" });
    });

    when('Fill the data in the form', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Alert about the weak password', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Password must contain at least one number" });    });
  })

  afterAll(async () => {
    browser.close()
  })
});