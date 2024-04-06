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
        setDefaultOptions({ timeout: 3000 })

        await page
            .goto("http://localhost:3000", {
                waitUntil: "networkidle0",
            })
            .catch(() => { });
    });

    //Correct login
    test('The user finishes a game', ({ given, when, then }) => {

        let username;
        let password;

        given('An user who is answering questions', async () => {

            //Login
            username = "prueba"
            password = "Prueba1213$"
            await expect(page).toClick("a", { text: "Play" });
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Login' });

            //Select category
            await expect(page).toClick('a', { text: 'capitals' });
        });

        when('He answers the last one', async () => {
            //Answer all questions
            for (let i = 0; i < 10; i++) {
                await expect(page).toClick('button', { id: 'button0' });
            }
        });

        then('Redirect to end game view', async () => {
            const newUrl = page.url();
            expect(newUrl).toBe('http://localhost:3000/game/endgame');
        });
    })

    afterAll(async () => {
        browser.close()
    })

});