const utils = require("../utils");

const main = async () => {
    const dataCompare1 = await utils.getArrDataFromCSV("src/google-search-console/Queries-23-02.csv");
    const dataCompare2 = await utils.getArrDataFromCSV("src/google-search-console/Queries-28-02.csv");
    let processedData = {};
    let result = [];
    let result1 = [];

    dataCompare1.map(item1 => {
        // console.log(item1[0]);
        processedData[item1[0]] = item1;
    });
    dataCompare2.map(item2 => {
        let item1 = processedData[item2[0]];
        if (item1) {
            const click1 = parseInt(item1[1]);
            const click2 = parseInt(item2[1]);
            if (!isNaN(click2))//click
            {
                item1[5] = true;
                if (click2 < click1) {
                    // console.log(item2[0], click1, click2);
                    result.push(
                        [
                            item2[0], click2, item2[2], item2[3], item2[4],
                            click1, item1[2], item1[3], item1[4]
                        ]);
                }
            }
        }
    });
    dataCompare1.map(item1 => {
        // console.log(item1[0]);
        let processedItem = processedData[item1[0]];
        if (!processedItem[5]) {
            result1.push(item1);
        }

    });
    await utils.saveCSVFile("lost.csv", result1);
};
main();