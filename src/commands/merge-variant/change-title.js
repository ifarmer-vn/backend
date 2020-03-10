const cmsVariants = require("../../strapi/variants/variants");
const cmsProducts = require("../../strapi/products/products");
const utils = require("../../utils");
const R = require("ramda");
const blackListCat = [
    "cay-canh",
    "thu-cong-my-nghe",
    "mon-an-vat",
    "dau-thien-nhien",
    "banh"
];
const blackList = [
    "thit-ca-sau",
    "thit-trau",
    "tieu-canh-ngu-tieu-canh-moc",
    "ga-ac",
    "trai-binh-bat",
    "nam-tram",
    "chuoi-ta-qua",
    "trai-lekima",
    "cay-mai-do",
    "qua-chum-ruot",
    "qua-khe",
    "chanh-day",
    "muc-xa",
    "trung-cut-bac-thao",
    "mut-dua",
    "thit-than-bo",
    "mau-dua",
    "banh-trang",
    "ca-tai-tuong"
];
const transformRedirect = async () => {
    let productsCMS = await cmsProducts.getAll();
    let data = await cmsVariants.getAll();
    let result = [];
    data.map(async (item) => {
        let newItem = [
            item["_id"],
            item["url"], //old url
            "", //extra title
            "", //title
        ];
        let productCMS = R.find(R.propEq('url', item["product"]))(productsCMS);
        if (!blackList.includes(item["product"]) && !blackListCat.includes(productCMS["category"])) {
            if (item["default"] === true) {
                newItem[2] = "";
                newItem[3] = `${productCMS["name"]}`;
            }
            if (item["url"].includes("gia-si")) {
                newItem[2] = "";
                newItem[3] = `${productCMS["name"]} Giá Sỉ`;
            }
            if (item["url"].includes("xuat-khau")) {
                newItem[2] = "";
                newItem[3] = `${productCMS["name"]} Xuất Khẩu`;
            }
            result.push(newItem);
            // console.log(result.updatedData);
        }
    });
    // console.log(result);
    return result;
};

const main = async () => {
    // const test = "Cần bán Xoài Cát Hòa Lộc Giá 40000 Giá 40000 LH: 091 832 7819 ngay.";
    //
    // await transformDescription(test);
    // return;
    const data = await transformRedirect(cmsVariants);
    await utils.saveCSVFile("updatedTitle.csv", data);
    await updateVariantCMS(data);


    // const variants =await utils.getArrDataFromCSV("updatedData.csv","\t");
    // await deleteVariantCMS(variants);
};

const updateVariantCMS = async (variants) => {
    let tasks = [];
    const insertTask = utils.createTasks(tasks);
    variants.map(variant => insertTask(async () => {
        let updateVariant = {
            _id: variant[0],
            extraTitle: variant[2],
            title: variant[3],
        };
        await cmsVariants.update(updateVariant);
    }));
    return await utils.executeTasks(tasks, {});
};

main().then(() => {
    console.log("Done");
});