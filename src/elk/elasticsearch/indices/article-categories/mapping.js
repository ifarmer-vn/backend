const baseMapping = require("../_base/page-mapping");
const index = {
    mappings: {
        properties:{
            ...baseMapping.mappings.properties,
        }
    }
};
module.exports = index;
