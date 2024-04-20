const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/answerQuestion.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new',slowMo:10})
      : await puppeteer.launch({ headless: 'new', slowMo: 10 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 120000 })

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => { });
  });


  test('Registered user plays a new game', ({ given, when, then }) => {

    let username;
    let password;
    let text;

    given('A registered user', async () => {
      username = "prueba"
      password = "Prueba1213$"
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Login' });
    });

    when('Plays a game answering a question', async () => {
      await expect(page).toClick('a', { text: 'capitals' });
      await expect(page).toMatchElement("p", { name: 'points', text: "0" });
      let text = await page.evaluate(() => {
        text = document.getElementById('questionTxt');
      });
      await page.click('#button0');
    });

    then('Points and question text are updated', async () => {
      await expect(page).toMatchElement("p", { name: 'points', text: /^(?!0$).+/ });
      await expect(page).toMatchElement("h4", { id: 'questionTxt', text: new RegExp(`^(?!${text}$).+`) });
    });
  })

  afterAll(async () => {
    //browser.close()
  })

});