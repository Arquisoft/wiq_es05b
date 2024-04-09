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
      : await puppeteer.launch({ headless: true,slowMo:10 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 300000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });

  test('Register new user, click play button', ({ given, when, then }) => {

    let username;
    let password;

    given('A registered user', async () => {
      username = "prueba"
      password = "Prueba1213$"
      await expect(page).toClick("a", { text: "Play" });
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
    });

    when('he logs in', async () => {
      await expect(page).toClick('button', { text: 'Login' });
    });

    then('Shows the game categories', async () => {
      await expect(page).toMatchElement("a", { text: "area" });
      await expect(page).toMatchElement("a", { text: "capitals" });
      await expect(page).toMatchElement("a", { text: "continent" });
      await expect(page).toMatchElement("a", { text: "currency" });
      await expect(page).toMatchElement("a", { text: "economy" });
      await expect(page).toMatchElement("a", { text: "gdp" });
      await expect(page).toMatchElement("a", { text: "geography" });
      await expect(page).toMatchElement("a", { text: "languages" });
      await expect(page).toMatchElement("a", { text: "politics" });
      await expect(page).toMatchElement("a", { text: "population" });
      await expect(page).toMatchElement("a", { text: "president" });
    });
  })


  afterAll(async () => {
    browser.close()
  })

});