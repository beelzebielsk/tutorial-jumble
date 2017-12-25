const express = require('express');
const bp = require('body-parser');
const fs = require('fs');
const app = express();
const counterFile = 'counter.json';

// Setting these causes express to use body-parser on your behalf. You
// do not personally use body-parser from here on in.
app.use(bp.urlencoded({
    extended: false
}))
app.use(bp.json());

/* When you try to read a file that does not exist, then an error
 * happens. That error is reported to you as an object in the `err`
 * parameter of the readFile callback. One of the properties of this
 * object is 'code', which represents the error code. When the file
 * does not exist, the error code is "ENOENT".
 *
 * I know this because I let the code run without checking for this
 * condition (and without a counter file, to make sure the error
 * happened) and just looked at the error that was printed out.  
 *
 * You might wonder why I turned this into a function, since it is so
 * short. For documentation, honestly. It's easier than writing in
 * comments as to what the wrapped code means whenever I use it.
 */
function isFileNotExistfileErr(fileErr) {
    return fileErr.code === "ENOENT";
}

function readFilePromise(path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) 
                reject(err);
            else 
                resolve(data);
        });
    });
}
function writeFilePromise(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}

app.get('/', (req, res) => {
    readFilePromise(counterFile, 'utf8')
    .catch(err => {
        if (isFileNotExistfileErr(err))
            return '{"counter" : 0}';
        else {
            res.statusCode = 500;
            res.end();
            console.error("Read Error:");
            console.error(err);
        }
    })
    .then(data => {
        let obj = JSON.parse(data);
        obj.counter++;
        return writeFilePromise(counterFile, JSON.stringify(obj));
    })
    .then(() => {
        res.send("Welcome to my site!");
    })
    .catch(err => {
        res.statusCode = 500;
        res.end();
        console.error("Write Error:");
        console.error(err);
    });
});

app.post('/reset', (req, res) => {
    let obj = { counter: 0 };
    writeFilePromise(counterFile, JSON.stringify(obj))
    .then(() => { 
        res.send("Okay counter is reset to 0");
    })
    .catch(err => {
        res.statusCode = 500;
        res.end();
        console.error("Write Error:");
        console.error(err);
    });
});

app.listen(3000);
