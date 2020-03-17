const cmsVariants = require("../../src/strapi/variants/variants");
const cmsProducts = require("../../src/strapi/products/products");
const utils = require("../../src/utils");
const R = require("ramda");
const whiteListCat = [
    "cay-thuoc-nam",
];
const transformRedirect = async () => {
    let productsCMS = await cmsProducts.getAll();
    let data = await cmsVariants.getAll();
    let result = [];
    data.map(async (item) => {
        let newItem = [
            item["_id"],
            item["price"],
            item["description"],
        ];
        let productCMS = R.find(R.propEq('url', item["product"]))(productsCMS);
        if (!productCMS) {
            console.log("not found product ", item["product"]);
            return;
        }
        if (whiteListCat.includes(productCMS["category"])) {
            if (item["default"] === true) {
                newItem[1] = findPriceInText(item["description"]);
            } else {
                newItem[1] = 0;
            }
            result.push(newItem);
            // console.log(result.updatedData);
        }
    });
    // console.log(result);
    return result;
};

const findPriceInText = (str) => {
    // Giá Cây Bảy lá một hoa 75.000 đồng/kg,
    const priceRegex = /(.*)( đồng\/kg)/sg;
    let price = 50000;
    const priceRegexMatching = utils.regexMatchingSync(priceRegex);
    priceRegexMatching(str, matches => {
        price = matches[1];
        price = price.split(" ")[price.split(" ").length - 1];
        price = price.replace(".", "");
        console.log(price)
    });
    return parseInt(price);
};
const main = async () => {
    // const test = "Giá Cây Bảy lá một hoa 75.000 đồng/kg,";
    const data = await transformRedirect(cmsVariants);
    await updateVariantCMS(data);


};

const updateVariantCMS = async (variants) => {
    let tasks = [];
    const insertTask = utils.createTasks(tasks);
    variants.map(variant => insertTask(async () => {
        let updateVariant = {
            _id: variant[0],
            price: variant[1],
        };
        await cmsVariants.update(updateVariant);
    }));
    return await utils.executeTasks(tasks, {});
};

main().then(() => {
    console.log("Done");
});