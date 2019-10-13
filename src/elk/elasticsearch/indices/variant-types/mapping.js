const baseMapping = require("../_base/base-mapping");
const index = {
    settings: {
        ...baseMapping.settings
    },
    mappings: {
        properties: {
        	...baseMapping.mappings.properties,
            "show_name": {
                "type": "boolean"
            },
            "order": {
                "type": "integer"
            },
            "children": {
                "type": "nested"
            }
        }
    }
};

module.exports = index;
