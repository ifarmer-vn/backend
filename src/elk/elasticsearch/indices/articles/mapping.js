const baseMapping = require("../_base/page-mapping");
const index = {
    settings: {
        ...baseMapping.settings
    },
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
                type: "keyword"
            },
            related_articles: {
                type: "keyword"
            },
            article_category: {
                type: "keyword"
            },
            category: {
                type: "keyword"
            },
            articleCategorySource: {
                type: "nested",
                "properties": {
                    "url": {
                        "type": "text"
                    },
                    "title": {
                        "type": "text"
                    }
                }
            }
        }
    }
};

module.exports = index;
