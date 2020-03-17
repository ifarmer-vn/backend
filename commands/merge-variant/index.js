const cmsVariants = require("../../src/strapi/variants/variants");
const cmsProducts = require("../../src/strapi/products/products");
const utils = require("../../src/utils");
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
    let result = {
        redirect: [],
        updatedData: [],
    };
    let products = {};
    data.map(async (item) => {
        let newItem = [
            item["_id"],
            item["product"],
            "",
            item["url"] //old url
        ];
        let productCMS = R.find(R.propEq('url', item["product"]))(productsCMS);
        if (!blackList.includes(item["product"]) && !blackListCat.includes(productCMS["category"])) {
            if (!products[item["product"]]) {
                products[item["product"]] = {};
            }
            if (item["product"] !== item["url"]) {
                result.redirect.push(
                    `rewrite ^/san-pham/${item["url"]}/$ https://ifarmer.vn/san-pham/${item["product"]}/ permanent;`);
            }
            if (item["default"] === true && !products[item["product"]].default) {
                //Main
                products[item["product"]].default = true;
                newItem.push(item["product"]); //new url
                newItem.push({loai: "le"}); //new url
                newItem[2] = transformDescription(item["description"]);
                // console.log(newItem);
            } else {
                if (!products[item["product"]].si) {
                    products[item["product"]].si = true;
                    newItem[2] = `Muốn mua ${productCMS["name"]} giá sỉ? liên hệ ngay 091 832 7819 để nhận báo giá.`
                    newItem.push(item["product"] + "-gia-si"); //new url for gia si
                    newItem.push({loai: "si"}); //new url

                } else {
                    if (!products[item["product"]].xuatKhau) {
                        products[item["product"]].xuatKhau = true;
                        newItem[2] = `Bạn là nông dân cần tìm chỗ thu mua ${productCMS["name"]} xuất khẩu. Hãy liên hệ với ifarmer.vn để lưu lại thông tin. Chúng tôi sẽ tìm thị trường xuất khẩu ${productCMS["name"]} cho bạn. Nếu bạn là công ty xuất khẩu đang cần tìm ${productCMS["name"]} đủ chuẩn để xuất khẩu. Hãy liên hệ ngay 091 832 7819. ifarmer.vn làm cầu nối cho người nông dân và công ty xuất khẩu ${productCMS["name"]}`;
                        newItem.push(item["product"] + "-xuat-khau"); //new url for gia le
                        newItem.push({loai: "xuat-khau"}); //new url
                    } else {
                        newItem.push("delete"); //new url for gia le
                    }
                }
            }

            result.updatedData.push(newItem);

            // console.log(result.updatedData);
        }
    });
    // console.log(result);
    return result;
};
const transformDescription = (description) => {
    const priceRegex = /(\d{4,8})/sg;
    let result = description;

    const priceRegexMatching = utils.regexMatchingSync(priceRegex);
    priceRegexMatching(description, matches => {
        const price = matches[0];
        if (price === "7819" || price === "2019") {
            return;
        }
        const index = matches.index - 5;
        // console.log(matches.index);
        const convertPrice = price.toString().money();
        result = result.replaceAll(` Giá ${price} `, ``);
        const convertString = `Giá ${convertPrice} đồng/kg`;
        if (!result.includes(convertString)) {
            result = result.splice(index, 0, `Giá ${convertPrice} đồng/kg `);
        }
        // console.log(price);
    });
    return result.replaceAll("  ", "");
};
const main = async () => {
    // const test = "Cần bán Xoài Cát Hòa Lộc Giá 40000 Giá 40000 LH: 091 832 7819 ngay.";
    //
    // await transformDescription(test);
    // return;
    const data = await transformRedirect(cmsVariants);
    await utils.saveCSVFile("updatedData.csv", data.updatedData);
    await updateVariantCMS(data.updatedData);
    await utils.saveArrayToText("redirect.txt", data.redirect);


    // const variants =await utils.getArrDataFromCSV("updatedData.csv","\t");
    // await deleteVariantCMS(variants);
};
const deleteVariantCMS = async (variants) => {
    variants.map(async variant => {
        if (variant[4] === "delete") {
            await cmsVariants.deleteByID(variant[0]);
        }
    });
};


const updateVariantCMS = async (variants) => {
    let tasks = [];
    const insertTask = utils.createTasks(tasks);
    variants.map(variant => insertTask(async () => {
        if (variant[4] === "delete") {
            await cmsVariants.deleteByID(variant[0]);
        } else {
            let updateVariant = {
                _id: variant[0],
                url: variant[4],
                description: variant[2],
                variantTypes: variant[5],
            };
            if (variant[1] !== variant[4]) {
                updateVariant.price = 0;
            }
            await cmsVariants.update(updateVariant);
        }

    }));
    return await utils.executeTasks(tasks, {});
};

main().then(() => {
    console.log("Done");
});