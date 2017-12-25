const express = require('express');
const bp = require('body-parser');

const app = express();
app.use(bp.urlencoded({extended : false}))
app.use(bp.json());

app.get('/', (request, response) => {
    let original = request.query.string;
    let command = request.query.case.toLowerCase();
    let converted;
    if (command === 'lower') {
        converted = original.toLowerCase();
    } else if (command === 'upper') {
        converted = original.toUpperCase();
    } else {
        converted = 'unmodified';
    }
    res.json({
        original : original,
        command : command,
        converted : converted
    })
})

let port = 8000;

app.listen(port, () => {
    console.log(`Server started listening on ${port}`);
})
