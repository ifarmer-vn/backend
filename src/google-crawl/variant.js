let revealed = (async () => {
        const fs = require('fs');
        const _ = require('lodash');
        const config = require('./config/config');
        const varTypes = require("./model/VariantTypes");
        let variantTypes = await getVariantTypes();

        async function getVariantTypes() {
            var result = await varTypes.getVariantTypesOrigin();
            console.log("done getVariantTypes");
            return result;
        }

        const DEFAULT_VARIANT_TYPES = config.variantTypes;

        function createVariant(produc   t, str, defaultVar, price, name) {
            price = price || (Math.floor(Math.random() * 30) + 60) * 1000;

            // var input = ["banh-chung","loai|dac-biet||so-luong|1-cai"];
            let urlName = getURLVariant(product, str);
            let variant = {};
            let variants = str.split("||");
            // variant.extraTittle = getExtraTittle(variants[1]);
            variant.title = getExtraTittle(variants[0], name);
            variant.title = variant.title.trim();
            variant.product = product;
            variant.name = product;
            variant.id = urlName;
            if (defaultVar) {
                variant.defaultProduct = defaultVar;
                if (price) {
                    variant.price = price;
                }
            }
            variant.dateCreated = new Date();
            variant.dateModified = new Date();
            let variantTypes = variant.variantTypes = {};
            variantTypes[variants[0].split('|')[0]] = variants[0].split('|')[1];
            return variant;
        }

        function getExtraTittle(str, name) {
            if (str === "loai|le") {
                return name;
            }
            return name + " Giá Sỉ";
        }

        function getURLVariant(product, str) {
            let result = [];
            result.push(product);
            if (str !== "loai|le") {
                result.push("gia-si");
            }
            return result.join("-");
        }

        function create(product, str, price, name) {
            // var input = ["banh-chung", "so-luong|1-cai|1-cap|2-cap||loai|dac-biet|truyen-thong"];
            str = str ? str : DEFAULT_VARIANT_TYPES;
            let result = [];
            let variantType1 = str.split("||")[0];
            let variant1 = variantType1.split('|');
            let defaultVar = true;
            for (let i = 1; i < variant1.length; i++) {
                let strName = variant1[0] + "|" + variant1[i];
                let variant = createVariant(product, strName, defaultVar, price, name);
                defaultVar = false;
                result.push(variant);
            }
            return result;
        }

        async function setup() {
            variantTypes = await getVariantTypes();
            console.log("setup done");
        }

        await setup();
        return {
            createVariant: createVariant,
            create: create,
            getURLVariant: getURLVariant,
            getExtraTittle: getExtraTittle,
        };
    }
)();
module.exports = revealed;