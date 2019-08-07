const processor = require("./processor");
const sleep = (time) => {
    return new Promise(function (resolve) {
        console.log("time call", +(new Date()));
        setTimeout(resolve, time)
    });
};

describe("processor", () => {
    describe("createQueue", () => {
        it("should create queue correctly", async () => {
            const input = "test_queue";
            const output = multiTasks.createQueue(input, {});
            expect("test_queue").toEqual(output.name);

        });
    });

});
