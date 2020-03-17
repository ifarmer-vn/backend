const _ = require('lodash');
const uploadImage = require('../lib/uploadImage');

function run(){
	uploadImage.uploadFiles("ifarmer/img/*/*.*").then(()=>{
		process.exit();
	}).catch((e)=>{
		console.log(e);
		process.exit(1)
	});
}
run();