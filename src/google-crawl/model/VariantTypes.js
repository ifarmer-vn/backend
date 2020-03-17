const _ = require('lodash');


async function getVariantTypesOrigin() {
	return {
		loai:{
			name: "Loại",
			children:{

				"le": {
					"name": "Lẻ",
					"order": "0"
				},
				"si": {
					"name": "Sỉ",
					"order": "1"
				},

			}
		}
	}
}

// getVariantTypes().then(function (data) {
//     console.log(data);
// })
const variantTypes = {
	getVariantTypesOrigin: getVariantTypesOrigin,
};
module.exports = variantTypes;
