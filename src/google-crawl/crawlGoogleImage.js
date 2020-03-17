const puppeteer = require('puppeteer');

async function crawlGoogleImage(url) {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome'
    });
    const page = await browser.newPage();
    await page.goto(url);
    let result = [];

    for (let i = 0, j = 0; j < 10; i++) {
        if (i > 100) {
            return [];
        }
        await page.click(`#islrg>div div:nth-child(${i + 1}) a.islib`);
        // await sleep(5000);
        const data = await page.evaluate(async () => {
            const sleep = (time) => {
                return new Promise(function (resolve) {
                    setTimeout(resolve, time)
                });
            };
            await sleep(5000);
            let imageUrl = "";
            let targetElements = document.querySelectorAll("#Sva75c img.n3VNCb")[1];
            if(targetElements){
                imageUrl = targetElements.src;
            }
            if(imageUrl.includes("data:")){
                return "";
            }
            console.log(imageUrl);
            if (imageUrl.split('imgurl=')[1] && imageUrl.indexOf(".jpg") > 0 && imageUrl.indexOf(")") === -1) {
                imageUrl = imageUrl.split('imgurl=')[1].split('&')[0];
                imageUrl = decodeURIComponent(imageUrl);
            } else {
                // alert(imageUrl);
            }
            return imageUrl;
        });
        console.log(data);
        if(data){
            result.push(data);
            j++;
        }

    }
    // await browser.close();
    console.log(result);
    return result;
}

const sleep = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
};
const revealed = {
    crawl: crawlGoogleImage
};

module.exports = revealed;