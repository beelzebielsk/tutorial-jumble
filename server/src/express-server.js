const express = require('express');

const app = express();

// NOTE: When responding with res.json, fields whose value is
// undefined are not sent out at all.

app.get('/im/a/route', (req, res) => {
  res.send("What a long route!");
});

app.get('/', (req, res) => {
  res.json({
    message : "Response to GET!",
    query   : req.query,
    body    : req.body,
    params  : req.params,
  })
});

app.post('/', (req, res) => {
  res.json({
    message : "Response to POST!",
    query   : req.query,
    body    : req.body,
    params  : req.params,
  })
});

app.delete('/', (req, res) => {
  res.json({
    message : "Response to DELETE!",
    query   : req.query,
    body    : req.body,
    params  : req.params,
  })
});

app.put('/', (req, res) => {
  res.json({
    message : "Response to PUT!",
    query   : req.query,
    body    : req.body,
    params  : req.params,
  })
});

app.listen(8000, () => {
  console.log("Listening on port 8000!");
});
