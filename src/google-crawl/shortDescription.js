const util = require("../utils");
var fs = require('fs'),
    _ = require('lodash');
const config = require('./config/config');
const phone = "Liên hệ: " + config.phone;

function generateShortDescription(product, index, price) {
    price = price || (Math.floor(Math.random() * 30) + 60) * 1000;
    let template = [
        `Giá ${product} ${price.toString().money()} đồng/kg, ${phone} ngay để để đặt mua hàng. Bán hàng toàn quốc. Có giao hàng tận nơi.`,
        `Nếu bạn cần nhập ${product} số lượng để mở cửa hàng hay để bán hãy liên hệ với ifarmer.vn để được mua ${product} giá sỉ.
Nếu Bạn có ${product} xin hãy liên hệ với ifarmer.vn để lưu lại thông tin cho người cần.`,
        `Nếu bạn cần nhập ${product} số lượng để mở cửa hàng hay để bán hãy liên hệ với ifarmer.vn để được mua ${product} giá sỉ.
Nếu Bạn có ${product} xin hãy liên hệ với ifarmer.vn để lưu lại thông tin cho người cần.`,
        `Bạn là người sản xuất cần tìm đầu ra cho ${product} xuất khẩu. Hãy liên hệ với ifarmer.vn để lưu lại thông tin. Chúng tôi sẽ tìm thị trường xuất khẩu ${product} cho bạn. Nếu bạn là công ty xuất khẩu đang cần tìm ${product} đủ chuẩn để xuất khẩu. Hãy liên hệ ngay 091 832 7819. ifarmer.vn làm cầu nối cho người người sản xuất và công ty xuất khẩu ${product}`,
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