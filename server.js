const express = require('express');
var bodyParser = require('body-parser');
var getData = require('./utils');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/data', (req, res) => {
    getData((data)=>{
        res.send(data);
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
