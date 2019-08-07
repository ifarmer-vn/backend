const multiTasks = require("./multiTasks");
const sleep = (time) => {
    return new Promise(function (resolve) {
        console.log("time call", +(new Date()));
        setTimeout(resolve, time)
    });
};

describe("multiTasks", () => {
    describe("createQueue", () => {
        it("should create queue correctly", async () => {
            const input = "test_queue";
            const output = multiTasks.createQueue(input, {});
            expect("test_queue").toEqual(output.name);

        });
    });
    describe("executeAsync", () => {
        fit("should executeAsync tasks correctly", async () => {
            const tasks = [
                async () => {
                    await sleep(1000);
                },
                async () => {
                    await sleep(2000);
                },
                async () => {
                    await sleep(3000);
                }
            ];
            const timeStart = +(new Date());
            await multiTasks.executeAsync(tasks);
            const timeEnd = +(new Date());
            const timeTake = timeEnd - timeStart;
            expect(true).toEqual(timeTake < 3010);

        });
    });
});
