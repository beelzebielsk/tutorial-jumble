import defaultValue from './export-with-default';
import noDefault from './export-no-default';

import {value1 as withDefault0,
        value2 as withDefault1} from  './export-with-default';
import {value1 as noDefault0,
        value2 as noDefault1} from './export-no-default';

console.log("Default exported value from export-with-defaultValue.js",
            defaultValue);

console.log("Default exported value from export-no-default.js",
            noDefault);

console.log("Exported non-default values from export-with-default.js",
            withDefault0, withDefault1);

console.log("Exported non-default values from export-no-default.js",
            noDefault0, noDefault1);
