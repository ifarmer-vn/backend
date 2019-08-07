const createProcessor = (name) => {
    const execute = ()=>{

    };
    let processor = {
        name,
        execute
    };

    return processor;
};


const revealed = {
    createProcessor
};

module.exports = revealed;