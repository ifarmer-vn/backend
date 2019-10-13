const baseMapping = require("../_base/page-mapping");
const index = {
    settings: {
        ...baseMapping.settings
    },
    mappings: {
        properties:{
            ...baseMapping.mappings.properties,
        }
    }
};

module.exports = index;
