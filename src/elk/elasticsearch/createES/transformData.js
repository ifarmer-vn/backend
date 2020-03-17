const R = require("ramda");
const utils = require("../../../utils");

function transformData(data) {
    transformVariants(data);
    transformArticles(data);
    transformProducts(data);
}

function convertToAmp(content) {
    let imgTags = imgToAmpImg(content);
    imgTags.map(img => {
        content = content.replace(img.origin, img.replace);
    });
    return content;
}

const imgToAmpImg = content => {
    const imgTagRegex = /(<img)(.+?)(>)/sg;
    const imgTagRegexMatching = utils.regexMatchingSync(imgTagRegex);
    let result = [];
    imgTagRegexMatching(content, matches => {
        const img = matches[0];
        let replace = img.replace("<img", "<amp-img lightbox=\"view-images\"");
        if (!img.includes(`width="`) || !img.includes(`height="`) || !img.includes(`layout="`)) {
            replace = replace
                .replace(`width="100%"`, ``)
                .replace(`/>`, `/>`).replace(`>`, `width="1600" height="900" layout="responsive"></amp-img>`);
        } else {
            replace = replace.replace(`/>`, `/>`).replace(`>`, `></amp-img>`);
        }
        result.push({
            origin: img,
            replace: replace
        });
    });
    return result;
};

function transformProducts(data) {
    let products = data.products;
    products.map(product => {
        product.content = convertToAmp(product.content);

    });
}

function transformVariants(data) {
    let variants = data.variants;
    const products = data.products;
    const categories = data.categories;
    variants.map(variant => {
        let product = R.find(R.propEq('url', variant.product))(products);
        if (product) {
            let category = R.find(R.propEq('url', product.category))(categories);
            variant.category = product.category;
            variant.productSource = {
                url: product.url,
                title: product.title.trim()
            };
            if (category) {
                variant.categorySource = {
                    url: product.category,
                    title: category.name.trim()
                };
            } else {
                variant.categorySource = {};
                console.log("missing category", variant.url, variant.product);
            }

        } else {
            variant.productSource = {};
            console.log("missing prod", variant.url, variant.product);
        }
    });
}


function transformArticles(data) {
    let articles = data.articles;
    const articlecategories = data.articlecategories;
    articles.map(article => {
        article.content = convertToAmp(article.content);
        let articleCategory = R.find(R.propEq('url', article.category))(articlecategories);
        if (article.related_products) {
            article.related_products = article.related_products.join();
        }

        if (article.related_articles && article.related_articles.length) {
            article.related_articles = article.related_articles.join();
        }

        if (articleCategory) {
            article.articleCategorySource = {
                url: articleCategory.category,
                title: category.name.trim()
            };
        } else {
        }
    });
}


const revealed = {
    transformData,
    imgToAmpImg: imgToAmpImg,
    convertToAmp: convertToAmp
};

module.exports = revealed;
