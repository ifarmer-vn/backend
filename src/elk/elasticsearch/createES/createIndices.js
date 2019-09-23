

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
const deleteIndices = (indices) => {
    return new Promise(resolve => {
        let promises = [];
        indices.map(index => {
            promises.push(index.deleteIndex());
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
    createIndices,
    deleteIndices
};

module.exports = revealed;
