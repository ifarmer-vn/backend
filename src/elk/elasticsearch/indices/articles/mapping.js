const baseMapping = require("../_base/page-mapping");
const index = {
    mappings: {
        properties:{
            ...baseMapping.mappings.properties,
            content: {
                type: "text"
            },
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
            }
        }
    }
};

module.exports = index;
