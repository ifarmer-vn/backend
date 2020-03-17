const puppeteer = require('puppeteer');

async function crawl(url) {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/google-chrome'
	});
	const page = await browser.newPage();
	await page.goto(url);
	// await sleep(200);
	const data = await page.evaluate(() => {
		let h1 = document.querySelector("h1").innerText;
		let title = document.querySelector("title").innerText;
		let meta = document.querySelector("[name='description']").getAttribute("content");
		let result = [h1, title, meta];
		return result;
	});
	await browser.close();
	return data;
}

const sleep = (time) => {
	return new Promise(function (resolve) {
		setTimeout(resolve, time)
	});
}

const revealed = {
	crawl: crawl
};

module.exports = revealed;