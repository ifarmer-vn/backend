let queues = {};

const createQueue = (queueName, opt) => {
    let queue = queues[queueName] = {opt};
    queue.name = queueName;
    queue.tasks = [];
    queue.execute = () => {
        executeAll(queue.tasks);
    };
    return queue;
};
const getQueue = queueName => queues[queueName];

const processor = () => {
    return
};
const executeAll = allTasks => {
    return new Promise(resolve => {

    });

};
const executeAsync = tasks => {
    const timeStart = "timeStart-" + (+new Date());
    console.time(timeStart);
    return new Promise(resolve => {
        let promises = [];
        tasks.map(task => {
            promises.push(task());
        });
        Promise.all(promises).then(() => {
            console.timeEnd(timeStart);
            resolve();
        });
    });
};

const addTaskIntoQueue = queueName => fn => {
    const queue = getQueue(queueName);
    queue.tasks.push(fn);
    return queue;
};


const revealed = {
    addTaskIntoQueue,
    createQueue,
    executeAsync
};

module.exports = revealed;
