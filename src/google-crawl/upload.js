const _ = require('lodash');
const prods = require('../ifarmer/products');
const vars = require('../ifarmer/variants');
const products = require('../lib/model/Products');
const variants = require('../lib/model/Variants');
const uploadImage = require('../lib/uploadImage');

function run(){
	products.saveProducts(prods);
	variants.saveVariants(vars);
	uploadImage.uploadFiles("ifarmer/img/*/*.*").then(()=>{
		process.exit();
	}).catch((e)=>{
		console.log(e);
		process.exit(1)
	});
}
run();