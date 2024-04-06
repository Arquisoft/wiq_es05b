const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game-enter.feature');

let page;
let browser;

defineFeature(feature, test => {

    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch()
            : await puppeteer.launch({ headless: false, slowMo: 10 });
        page = await browser.newPage();
        setDefaultOptions({ timeout: 300000 })

        await page
            .goto("http://localhost:3000", {
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
            await expect(page).toClick("a", { text: "Play" });
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Login' });

        });

        when('A category is selected', async () => {
            await expect(page).toClick('a', { text: 'capitals' });
        });

        then('Redirect to game view', async () => {
            const newUrl = page.url();
            expect(newUrl).toBe('http://localhost:3000/game/capitals');
        });
    })

    afterAll(async () => {
        browser.close()
    })

});