const util = require("../utils");
var fs = require('fs'),
    _ = require('lodash');
const config = require('./config/config');
const phone = "Liên hệ: " + config.phone;

function generateShortDescription(product, index, price) {
    price = price || (Math.floor(Math.random() * 30) + 60) * 1000;
    let template = [
        `Giá ${product} ${price.toString().money()} đồng/kg, ${phone} ngay để để đặt mua hàng. ${product} dùng hỗ trợ bồi dưỡng cơ thể. Bán hàng toàn quốc. Có giao hàng tận nơi.`,
        `Nếu bạn cần mua ${product} số lượng lớn để điều chế thuốc hay để bán hãy liên hệ với ifarmer.vn để được mua ${product} giá sỉ.
Nếu Bạn có ${product} xin hãy liên hệ với ifarmer.vn để lưu lại thông tin cho người cần.`,
    ];

    return template[index];
}

function generateForVariants(variants, name, product) {
    _.each(variants, (variant, index) => {
        variant.description = generateShortDescription(name, index, variant.price);
    });
}

const revealed = {
    generateForVariants: generateForVariants
};

module.exports = revealed;