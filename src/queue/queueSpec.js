const queue = require("./queue");

describe("queue", () => {
    describe("createQueue", () => {
        fit("should create queue correctly", async () => {
            const input = "test_queue";
            const output = queue.createQueue(input);
            expect({}).toEqual(output);

        });
    });
});