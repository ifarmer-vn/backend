const categories = require("./article-categories");
const data = require("../../data-examples/ifarmer")['article-categories'];

categories.createAll(data);
