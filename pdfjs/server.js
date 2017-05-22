var express = require('express');
var app = express();
var path = require('path');
var baseUrl = path.resolve(__dirname, 'build');
app.use( express.static( baseUrl ) );

/**
 * set index.html in public folder as default landing router
 */
app.use('*',function (req, res) {
  res.sendFile( baseUrl );
});

/**
 * Start server at port
 */
app.listen(8000, function() {
  console.log('Server started at :8000');
});