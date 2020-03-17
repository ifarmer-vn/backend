const _ = require('lodash');
const firebase = require('../firebase');
//
// getArticleByID("cong-dung-cua-dau-gac-doi-voi-me-bau").then(data=> {
//   console.log(data);
// });

function getArticleByID(id) {
	const articlePromise = firebase.getPath('/articles/' + id);
	return articlePromise.once('value').then(snapshot => {
		return snapshot.val() || {};
	});
}

function getArticles() {
	const articlesPromise = firebase.getPath('/articles');
	return articlesPromise.once('value').then(snapshot => {
		return parseArticles(snapshot.val());
	});
}

function parseArticles(articles) {
	var results = [];
	_.each(articles, (item, key) => {
		item.id = key;
		results.push(item);
	});
	return results;
}

function saveArticle(updateData) {
	return getArticleByID(updateData.id).then(currentData => {
		let updates = {};
		updateData.dateModified = new Date();
		updateData.dateCreated = currentData.dateCreated ? new Date(currentData.dateCreated) : new Date();
		updateData.created = updateData.dateCreated.toLocaleDateString("vi");
		updates['/articles/' + updateData.id] = updateData;

		return firebase.getPath().update(updates).then(updateData => {
			return updateData;
		});
	});
}

function saveArticles(articles) {
	_.each(articles, async (article) => {
		await saveArticle(article);
	});
}

// getArticles().then(function (data) {
//     console.log(data);
// })
const articles = {
	getArticleByID: getArticleByID,
	getArticles: getArticles,
	saveArticle: saveArticle,
	saveArticles: saveArticles
};
module.exports = articles;
