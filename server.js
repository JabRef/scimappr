var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var baseUrl = path.resolve(__dirname, 'build');
app.use( express.static( baseUrl ) );

/**
 * set index.html in public folder as default landing router
 */
app.use('*',function (req, res) {
  res.sendFile( baseUrl );
});

app.use(bodyParser.json());

app.use('/sendData', function (req, res) {
  console.log(req.body);
  res.send('ok')
});

/**
 * Start server at port
 */
app.listen(8080, function() {
  console.log('Server started at :8080');
});