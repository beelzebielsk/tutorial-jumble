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

app.get('/', (req, res) => {
    fs.readFile(counterFile, 'utf8', (err, data) => {
        /* `err` is an error which might occur as a result of reading
         * the file. Your code needs to either react correctly to the
         * error, or fail. There is at least one error that you should
         * be able to respond to: the error of the file not existing.
         */
        if (err && !isFileNotExistErr(err)) {
            res.statusCode = 500;
            res.end();
            console.error("Read Error:");
            console.error(err);
            return;
        } else {
            if (err && isFileNotExistErr(err)) {
                obj = {counter : 0};
            } else {
                obj = JSON.parse(data);
            }
            obj.counter++;
            fs.writeFile(counterFile, JSON.stringify(obj), (err) => {
                if (err) {
                    res.statusCode = 500;
                    res.end();
                    console.error("Write Error:");
                    console.error(err);
                    return
                }
                res.send("Welcome to my site");
            })
        }
    });
});

app.post('/reset', (req, res) => {
    let obj = { counter: 0 };
    fs.writeFile(counterFile, JSON.stringify(obj), (err) => {
        if (err) {
            res.statusCode = 500;
            res.end();
            return;
        } else {
            res.send('okay counter is reset to 0');
        }
    });
});

app.listen(3000);
