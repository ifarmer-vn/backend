const puppeteer = require('puppeteer');

async function crawl(url) {
	const browser = await puppeteer.launch({
		executablePath: '/usr/bin/google-chrome'
	});
	const page = await browser.newPage();
	await page.goto(url);
	// await sleep(200);
	const data = await page.evaluate(() => {
		let robot = document.querySelector("[name=robots]").getAttribute("content").replace(",","");
		let result = {robot: robot};
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