const express = require('express');
const app = express();
const morgan = require('morgan')
const path = require('path')

// app.use('/api', require('../api/api.router'))
app.use(morgan('dev'));
app.get('/', (req, res, next) => {
    const indexPath = path.join(__dirname, '..', 'index.html')
    res.sendFile(indexPath);
});

app.use(require('./static.middleware'))

app.listen(8000, (err) => {
    if (err) throw err;
    console.log('Listening on port 8000')
})

module.exports = app;

