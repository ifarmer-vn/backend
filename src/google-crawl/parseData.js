const _ = require("lodash");
// Calo (kcal)
const NUTRITION_NAME = [
    {
        name: "Total Fat",
        vnName: "Tổng Chất Béo"
    },
    {
        name: "Lipid",
        vnName: "Lipid"
    },
    {
        name: "Đường thực phẩm",
        vnName: "Đường thực phẩm"
    },
    {
        name: "Calo (kcal)",
        vnName: "Calo (kcal)"
    },
    {
        name: "Cholesterol",
        vnName: "Cholesterol"
    },
    {
        name: "Sodium",
        vnName: "Kẽm"
    },
    {
        name: "Potassium",
        vnName: "Kali"
    },
    {
        name: "Total Carbohydrate",
        vnName: "Cacbohydrat"
    },
    {
        name: "Protein",
        vnName: "Protein"
    },
    {
        name: "Fiber",
        vnName: "Chất xơ"
    }
];

function parse(str) {
    var arr = str.split('\n');
    return processArr(arr);
}

function processArr(arr) {
    var isStartDailyValue = false;
    var nutritionFact = {};
    var dailyNutrition = [];
    let result = {};
    _.each(arr, item => {
        if (item.indexOf("Description") === 0 || item.indexOf("Mô tả") === 0) {
            result.description = item.replace("Description", "");
            result.description = item.replace("Mô tả", "");
            return true;
        }
        if (item.indexOf("Nutrition Facts") === 0 || item.indexOf("Thông tin dinh dưỡng") === 0) {
            nutritionFact = {};
            result.nutritionFact = nutritionFact;
            isStartDailyValue = true;
            nutritionFact.dailyNutrition = dailyNutrition;
            return true;
        }
        if (item.indexOf("Calories ") === 0 || item.indexOf("Calo (kcal) ") === 0) {
            nutritionFact.calories = item.replace("Calories ", "").replace("Calo (kcal) ", "");
            return true;
        }
        // if (item.indexOf("% Daily Value*") === 0) {
        // 	isStartDailyValue = true;
        // 	nutritionFact.dailyNutrition = dailyNutrition;
        // 	return true;
        // }
        if (item.indexOf("*Per cent Daily Values") === 0 || item.indexOf("Mọi người cũng tìm kiếm") === 0) {
            return false;
        }
        if (isStartDailyValue && item.split("\t").length < 3) {
            let nutrition = parseDailyNutrition(item);
            if (nutrition) {
                dailyNutrition.push(nutrition);
            }
            return true;
        }
        if (isStartDailyValue && item.split("\t").length === 4) {
            let vitamins = parseDailyVitamin(item);
            dailyNutrition.push(...vitamins);
            return true;
        }
    });
    return result;
}

function parseDailyNutrition(str) {
    var result = {};
    let existNutrition = false;
    _.each(NUTRITION_NAME, nutrition => {
        if (str.indexOf(nutrition.name) === 0 || str.indexOf(nutrition.vnName) === 0) {
            result.name = nutrition.name;
            result.vnName = nutrition.vnName;
            existNutrition = true;
            str = str.replace(nutrition.name, "").replace(nutrition.vnName, "").trim();
        }
    });
    if (!existNutrition) {
        console.warn("cannot find this nutrition:", str);
        return;
    }
    let arr = str.split("\t");
    result.value = arr[0];
    result.dailyValue = arr[1];
    return result;
}

function parseDailyVitamin(str) {
    var result = [];
    var arr = str.split("\t");
    let item1 = {
        name: arr[0],
        vnName: arr[0],
        dailyValue: arr[1]
    };
    let item2 = {
        name: arr[2],
        vnName: arr[2],
        dailyValue: arr[3]
    };
    result.push(item1);
    result.push(item2);
    return result;
}

const revealed = {
    parse: parse,
    processArr: processArr,
    parseDailyVitamin: parseDailyVitamin,
    parseDailyNutrition: parseDailyNutrition,
};

module.exports = revealed;