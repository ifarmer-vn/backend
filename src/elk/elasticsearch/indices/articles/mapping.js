const baseMapping = require("../_base/page-mapping");
const index = {
    mappings: {
        properties:{
            ...baseMapping.mappings.properties,
            author: {
                type: "keyword"
            },
            next: {
                type: "keyword"
            },
            prev: {
                type: "keyword"
            },
            propagated_urls: {
                type: "nested"
            },
            related_products: {
                type: "nested"
            },
            related_articles: {
                type: "nested"
            },
            article_category: {
                type: "keyword"
            },
            category: {
                type: "keyword"
            },
            articleCategorySource: {
                type: "nested"
            }
        }
    }
};

module.exports = index;
