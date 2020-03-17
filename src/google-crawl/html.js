function parseHTML(str){
		return str
			.replace(/{abc}/g, "<h3>")
			.replace(/{\/abc}/g, "</h3>")
			.replace(/{abc1}/g, "<p>")
			.replace(/{\/abc1}/g, "</p>")
			.replace(/\[[0-9]?[0-9]\]/g,"")
			.replace(/\[sửa | sửa mã nguồn\]/g,"")
			.replace(/\|/g,"")
			.replace(/\[edit\]/g,"")
			;
}

const revealed = {
	parseHTML: parseHTML,
};

module.exports = revealed;