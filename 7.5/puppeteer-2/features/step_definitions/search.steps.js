const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { getText, clickElement } = require("../../lib/commands.js");

let browser;
let page;
let byuingSchema;
let place;

Before(async function () {
  browser = await puppeteer.launch({
    headless: false,
    // slowMo: 50,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("пользователь на странице {string}", async function (url) {
  try {
    await this.page.goto(url, { setTimeout: 50000 });
  } catch (error) {
    throw new Error(`Failed to navigate to ${url} with error: ${error}`);
  }
});

When("выбирает дату", async function () {
  return await clickElement(this.page, "body > nav > a:nth-child(3)");
});

When(
  "выбирает время сеанса фильма Терминатор-заржавел на 10-00",
  async function () {
    await this.page.waitForTimeout(1000);
    return await clickElement(
      this.page,
      "body > main > section:nth-child(2) > div.movie-seances__hall > ul > li > a"
    );
  }
);

When("выбирает место в зале кинотеатра 4 ряд 7 место", async function () {
  await this.page.waitForSelector("div.buying-scheme");
  await this.page.waitForTimeout(500);
  await clickElement(
    this.page,
    "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(4) > span:nth-child(7)"
  );
  await clickElement(this.page, "button");
});

Then("получает результат первого теста", async function () {
  await this.page.waitForTimeout(1000);
  await this.page.waitForSelector("h2");
  let actual = await getText(this.page, `div > p:nth-child(2) > span`);
  const expected = "4/7";
  expect(actual).to.equal(expected);
});

When("выбирает время сеанса фильма Зверополис на 11-00", async function () {
  await this.page.waitForTimeout(1000);
  return await clickElement(
    this.page,
    "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a"
  );
});

When("выбирает места в зале кинотеатра 5 ряд 3,4,5 места", async function () {
  await this.page.waitForSelector("div.buying-scheme");
  await this.page.waitForTimeout(500);
  await clickElement(
    this.page,
    "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(5) > span:nth-child(3)"
  );
  await clickElement(
    this.page,
    "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(5) > span:nth-child(4)"
  );
  await clickElement(
    this.page,
    "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(5) > span:nth-child(5)"
  );
  await clickElement(this.page, "button");
});

Then("получает результат второго теста", async function () {
  await this.page.waitForTimeout(1000);
  await this.page.waitForSelector("h2");
  let actual = await getText(this.page, `div > p:nth-child(2) > span`);
  const expected = "5/3, 5/4, 5/5";
  expect(actual).to.equal(expected);
});

When(
  "выбирает время сеанса фильма Унесенные ветром на 12-00",
  async function () {
    await this.page.waitForTimeout(1000);
    return await clickElement(
      this.page,
      "body > main > section:nth-child(3) > div:nth-child(2) > ul > li > a"
    );
  }
);

When("выбирает место в зале кинотеатра 5 ряд 6 место", async function () {
  await this.page.waitForSelector("div.buying-scheme");
  await clickElement(
    this.page,
    "body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(5) > span:nth-child(6)"
  );
  await clickElement(this.page, "button");
});

Then("получает купленный билет", async function () {
  await this.page.waitForTimeout(1000);
  await this.page.waitForSelector("h2");
  await clickElement(this.page, "button");
  await this.page.waitForSelector("h2");
  await this.page.waitForTimeout(1000);
  const actual = await getText(this.page, "h2");
  const expected = "Электронный билет";
  expect(actual).to.equal(expected);
});

When(
  "переходит снова на главную страницу кинотеатра {string}",
  async function (url) {
    try {
      await this.page.goto(url);
    } catch (error) {
      throw new Error(`Failed to navigate to ${url} with error: ${error}`);
    }
  }
);

Then(
  "пытается выбрать место, которое занято и получает результат",
  async function () {
    await this.page.waitForSelector("div.buying-scheme");
    let actual = await getText(this.page, "div:nth-child(2) > p:nth-child(1)");
    const expected = " Занято";
    expect(actual).to.equal(expected);
  }
);
