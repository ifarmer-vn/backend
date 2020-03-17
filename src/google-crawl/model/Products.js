const _ = require('lodash');
const firebase = require('../firebase');

function getProductByID(id) {
    const productPromise = firebase.getPath('/products/' + id);
    return productPromise.once('value').then(snapshot => {
        return snapshot.val() || {};
    });
}
function getProducts() {
    const productsPromise = firebase.getPath('/products');
    return productsPromise.once('value').then(snapshot => {
        return parseProducts(snapshot.val());
    });
}
function parseProducts(products){
    var results= [];
    _.each(products, (item, key) => {
        item.id= key;
        results.push(item);
    });
    return results;
}
function saveProduct(updateData) {
    return getProductByID(updateData.id).then(currentData=>{
        let updates = {};
        updateData.dateModified = new Date();
        updateData.dateCreated = currentData.dateCreated ? new Date(currentData.dateCreated) : new Date();
        updateData.created = updateData.dateCreated.toLocaleDateString("vi");
        updates['/products/' + updateData.id] = updateData;

        return firebase.getPath().update(updates).then(updateData=>{
            return updateData;
        });
    });
}

function saveProducts(products) {
    _.each(products, (product) => {
        saveProduct(product);
    });
}
// getProducts().then(function (data) {
//     console.log(data);
// })
const products = {
    saveProducts : saveProducts,
};
module.exports = products;
