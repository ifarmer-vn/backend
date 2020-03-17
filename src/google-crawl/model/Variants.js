const _ = require('lodash');
const firebase = require('../firebase');

function getVariantByID(id) {
    const variantPromise = firebase.getPath('/variants/' + id);
    return variantPromise.once('value').then(snapshot => {
        return snapshot.val() || {};
    });
}

function getVariants() {
    const variantsPromise = firebase.getPath('/variants');
    return variantsPromise.once('value').then(snapshot => {
        return parseVariants(snapshot.val());
    });
}

function parseVariants(variants) {
    var results = [];
    _.each(variants, (item, key) => {
        item.id = key;
        results.push(item);
    });
    return results;
}

function saveVariant(updateData) {
    return getVariantByID(updateData.id).then(currentData => {
        let updates = {};
        updateData.dateModified = new Date();
        updateData.dateCreated = currentData.dateCreated ? new Date(currentData.dateCreated) : new Date();
        updateData.created = updateData.dateCreated.toLocaleDateString("vi");
        updates['/variants/' + updateData.id] = updateData;

        return firebase.getPath().update(updates).then(updateData => {
            return updateData;
        });
    });
}

function saveVariants(variants) {
    _.each(variants, (variant) => {
        saveVariant(variant);
    });
}

// getVariants().then(function (data) {
//     console.log(data);
// })
const variants = {
    saveVariants: saveVariants
};
module.exports = variants;
