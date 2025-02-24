const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game-enter.feature');

let page;
let browser;

defineFeature(feature, test => {

    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch({ headless: 'new'})
            : await puppeteer.launch({ headless: 'new', slowMo: 10 });
        page = await browser.newPage();
        setDefaultOptions({ timeout: 120000 })

        await page
            .goto("http://localhost:3000/login", {
                waitUntil: "networkidle0",
            })
            .catch(() => { });
    });

    //Correct login
    test('The user starts playing', ({ given, when, then }) => {

        let username;
        let password;

        given('An user located at category select view', async () => {

            //Login
            username = "prueba"
            password = "Prueba1213$"
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Login' });

        });

        when('A category is selected', async () => {
            await expect(page).toClick('a', { text: 'capitals' });
        });

        then('Redirect to game view', async () => {
            await expect(page).toMatchElement('button', { id: 'button0' })
        });
    })

    afterAll(async () => {
        browser.close()
    })

});