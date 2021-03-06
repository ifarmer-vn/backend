const baseMapping = require("./base-mapping");
const index = {
    settings: {
        ...baseMapping.settings,
    },
    mappings: {
        properties: {
            ...baseMapping.mappings.properties,
            source: {
                type: "nested"
            },
            description: {
                type: "text"
            },
            content: {
                type: "text"
            },
            title: {
                type: "text"
            },
            robots: {
                type: "keyword"
            },
            images: {
                type: "nested"
            },
            transformedImages: {
                type: "nested"
            },
            search_volume: {
                type: "integer"
            },
            clicks: {
                type: "integer"
            },
            ctr: {
                type: "float"
            },
            impressions: {
                type: "integer"
            },
            position: {
                type: "float"
            },
            redirect: {
                type: "keyword"
            },
            heading: {
                type: "keyword"
            },
            // keywords: {
            // 	type: "object"
            // },
        }
    }
};
module.exports = index;
