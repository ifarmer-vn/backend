let queues = {};
const addIntoQueue = task => {

};
const createQueue = name => {
    let result = queues[name] = {};
    result.name = name;

    return result;
};


const revealed = {
    addIntoQueue,
    createQueue
};

module.exports = revealed;
