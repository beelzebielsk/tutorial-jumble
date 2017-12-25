'use strict';
const http = require('http');

const server = http.createServer((req, res) => {
    const {method, url, headers} = req;
    console.log("Method:", method);
    console.log("url:", url);
    console.log("headers:", headers);
    //res.send("Hi!");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write("Me big strong man. Me build big website. Me captain of destiny. Me so cool.");
    res.end();
});

server.listen(8000);
