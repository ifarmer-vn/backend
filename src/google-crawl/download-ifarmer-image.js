const image = require("../lib/image");
const dir = require("../lib/dir");

function main() {
	dir.make("cropped");
	image.downloadAll("articles/trai-cay/40-kieu-trang-tri-trai-cay-ngo-nghinh");
}

main();