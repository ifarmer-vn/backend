

const createIndices = (indices) => {
    return new Promise(resolve => {
        let promises = [];
        indices.map(index => {
            promises.push(createMapping(index));
        });
        Promise.all(promises).then(() => {
            resolve();
        })
    });
};

const createMapping = async (index) => {
    return await index.mapping();
};

const revealed = {
    createIndices
};

module.exports = revealed
