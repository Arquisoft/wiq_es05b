const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/answerQuestion.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false,slowMo:10 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 3000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });


  test('Register new user plays a new game', ({ given, when, then }) => {

    let username;
    let password;

    given('An unregistered user', async () => {
      username = "prueba12345"
      password = "Prueba1213$"
      await expect(page).toClick("a", { text: "Sign up" });
    });

    when('Plays a game answering a question', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Create account' })
      await expect(page).toClick('a', { text: 'Play' })
      await expect(page).toClick('a', { text: 'area' })
      await expect(page).toMatchElement("p", { name:'points',text: "0" });
      await expect(page).toClick('button', { id: 'button0' })
    });

    then('Points are updated', async () => {
      await expect(page).toMatchElement("p", { name:'points',text: /^(?!0$).+/ });
    });
  })

  afterAll(async () => {
    browser.close()
  })

});