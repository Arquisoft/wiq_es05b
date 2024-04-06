const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 3000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });


  test('The user is not registered in the site', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user', async () => {
      username = "prueba"
      password = "Prueba123$"
      await expect(page).toClick("button", { text: "Don't have an account? Sign up" });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
    });

    then('Redirect to home page', async () => {
      await expect(page).toMatchElement("button", { text: "Play" });
    });
  })

  afterAll(async () => {
    browser.close()
  })

});