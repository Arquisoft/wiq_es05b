const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login-correct.feature');

let page;
let browser;

defineFeature(feature, test => {

    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch()
            : await puppeteer.launch({ headless: false, slowMo: 10 });
        page = await browser.newPage();
        setDefaultOptions({ timeout: 120000 })

        await page
            .goto("http://localhost:3000", {
                waitUntil: "networkidle0",
            })
            .catch(() => { });
    });

    //Correct login
    test('The user is not logged in the site', ({ given, when, then }) => {

        let username;
        let password;

        given('An existent user', async () => {
            username = "prueba"
            password = "Prueba1213$"
            await expect(page).toClick("a", { text: "Play" });
        });

        when('I fill the data in the form and press submit', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Login' });
        });

        then('Redirect to game menu page', async () => {
            await expect(page).toMatchElement("p", { text: "Choose a category to play" });
        });
    })

    afterAll(async () => {
        browser.close()
    })

});