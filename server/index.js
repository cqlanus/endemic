const express = require('express');
const app = express();
const morgan = require('morgan')
const path = require('path')

app.set('port', (process.env.PORT || 5000))

// app.use(morgan('dev'));
app.get('/', (req, res, next) => {
    const indexPath = path.join(__dirname, '..', 'index.html')
    res.sendFile(indexPath);
});

app.use(require('./static.middleware'))

app.listen(app.get('port'), (err) => {
    if (err) throw err;
    console.log('Listening on port', app.get('port'))
})

module.exports = app;

