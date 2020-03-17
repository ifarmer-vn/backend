const puppeteer = require('puppeteer');

async function crawl(url) {
	const browser = await puppeteer.launch(
		// {
		// 	headless: false
		// }
	);

	const page = await browser.newPage();
	await page.goto(url);
	const data = await page.evaluate(() => {
		let table = document.evaluate("//div[contains(.,'Featured snippet')]//table", document, null, XPathResult.ANY_TYPE, null).iterateNext();
		let paragraph = document.evaluate("//div[contains(.,'Featured snippet')]//div[contains(@class,'LGOjhe')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
		let video = document.evaluate("//div[contains(.,'Video')]//g-scrolling-carousel", document, null, XPathResult.ANY_TYPE, null).iterateNext();
		let list = document.evaluate("//div[contains(.,'Featured snippet')]//div[contains(@class,'rc')]//ul", document, null, XPathResult.ANY_TYPE, null).iterateNext();
		// image
		//list

		let type;
		let isPrice;
		let urlSnippet;
		if (video) {
			type = "video";
			let snippet = document.evaluate("//div[contains(.,'Video')]//g-scrolling-carousel//div[contains(.,'Iprice')]//a", document, null, XPathResult.ANY_TYPE, null).iterateNext();
			urlSnippet = snippet ? snippet.href : "";
			isPrice = !!urlSnippet;
		}
		if (list) {
			type = "list";
			let snippet = document.evaluate("//div[contains(.,'Featured snippet')]//div[contains(@class,'rc')]//a", document, null, XPathResult.ANY_TYPE, null).iterateNext();
			urlSnippet = snippet ? snippet.href : "";
			isPrice = urlSnippet.indexOf("iprice") !== -1;
		}
		if (table) {
			type = "table";
			let snippet = document.evaluate("//div[contains(.,'Featured snippet')][contains(@class,'xpdopen')]//a", document, null, XPathResult.ANY_TYPE, null).iterateNext();
			urlSnippet = snippet ? snippet.href : "";
			isPrice = urlSnippet.indexOf("iprice") !== -1;
		}
		if (paragraph) {
			type = "paragraph";
			let snippet = document.evaluate("//div[contains(.,'Featured snippet')]//div[contains(@class,'rc')]//a", document, null, XPathResult.ANY_TYPE, null).iterateNext();
			urlSnippet = snippet ? snippet.href : "";
			isPrice = urlSnippet.indexOf("iprice") !== -1;
		}

		return [urlSnippet, isPrice, type];
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