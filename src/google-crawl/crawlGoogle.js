const puppeteer = require('puppeteer');

async function crawlGoogle(url) {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	await page.goto(url);
	await sleep(1000);
	const data = await page.evaluate(() => {
		var targetElement = document.querySelector("#rhs");
		var wikiElem =document.evaluate("//a[contains(@href,'https://vi.wikipedia.org/wiki/')][not(contains(@href,'url'))]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
		if(wikiElem){
			return [targetElement.innerText, wikiElem.href];
		}
		return ["",""];
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
	crawl: crawlGoogle
};

module.exports = revealed;