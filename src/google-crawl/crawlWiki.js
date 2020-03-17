const puppeteer = require('puppeteer');

async function crawl(url) {
	const browser = await puppeteer.launch({
		headless: true,
	});
	const page = await browser.newPage();
	await page.goto(url);
	await sleep(1000);
	const data = await page.evaluate(() => {
		var targetElements = document.querySelectorAll("#mw-content-text>div>p,#mw-content-text>div>h2");
		var result = [];
		for (var i = 0; i < targetElements.length - 2; i++) {
			let elem = targetElements[i];
			if(elem.nodeName === "H2"){
				result.push("{abc}");
			}
			if(elem.nodeName === "P"){
				result.push("{abc1}");
			}
			result.push(elem.innerText);
			if(elem.nodeName === "P"){
				result.push("{/abc1}");
			}
			if(elem.nodeName === "H2"){
				result.push("{/abc}");
			}
		}
		return result.join("");
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