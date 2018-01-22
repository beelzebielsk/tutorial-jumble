const path = require('path');
module.exports = {
    'entry' : './import.js',
    'output' : {
        path : path.resolve(__dirname, 'bundles'),
        filename: 'bundle.js'
    }
}
