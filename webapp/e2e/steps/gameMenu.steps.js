const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/gameMenu.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: 'new',slowMo:50 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 120000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });

  test('Registered user, click play button', ({ given, when, then }) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "prueba"
      password = "Prueba1213$"
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
    });

    when('he logs in', async () => {
      await expect(page).toClick('button', { text: 'Login' });

    });

    then('Shows the game categories', async () => {
      then('Shows at least one game category', async () => {
        const categories = ["area", "capitals", "continent", "currency", "economy", "gdp", "geography", "languages", "politics", "population", "president"];
        await expect(page).toMatchElement("a", { text: categories.some(category => category) });
      });

    });
  })


  afterAll(async () => {
    browser.close()
  })

});