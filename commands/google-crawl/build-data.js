const _ = require('lodash');
const fs = require('fs');
const globule = require('globule');
const product = require("../../src/google-crawl/product");
const variantImage = require("../../src/google-crawl/variantImage");
const libVar = require("../../src/google-crawl/variant");
const shortDescription = require("../../src/google-crawl/shortDescription");
const saveFile = require("../../src/google-crawl/saveFile");
const dir = require('../../src/google-crawl/dir');
const variantsStrapi = require("../../src/strapi/variants/variants");
const productStrapi = require("../../src/strapi/products/products");
const path = "google/*/*.json";
let variant;
let products = [];
let variants = [];

const buildData = () => {
    return new Promise(async resolve => {
        let files = globule.find(path);
        variant = await libVar.then(res => {
            return res;
        });
        dir.make("ifarmer/");
        dir.make("ifarmer/img/");
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            await fs.readFile(file, 'utf8', async function (err, data) {
                let json = JSON.parse(data);
                let prod = product.create(json);
                products.push(prod);
                let temp = [];
                let vars = variant.create(prod.id, prod.variants, prod.price, prod.name);
                vars = variantImage.generate(prod.id, vars);
                await variantImage.addImageForContent(prod);
                await productStrapi.create(prod);

                shortDescription.generateForVariants(vars, prod.name, json);
                _.each(vars, v => {
                    temp.push(v);
                });
                for (let i = 0; i < temp.length; i++) {
                    console.log("Create variant", temp[i].id);
                    await variantsStrapi.create(temp[i]);
                }
                resolve({products, variants});
            });
        }
    })
};

async function process() {
    let data = await buildData();
    await saveFile.save("ifarmer/products.json", JSON.stringify(data.products));
    await saveFile.save("ifarmer/variants.json", JSON.stringify(data.variants));


}

process();