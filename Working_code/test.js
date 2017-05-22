// server code 
var express = require("express");
var app     = express();
var path    = require("path");


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/jsmind.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/jsmind.css',function(req,res){
  res.sendFile(path.join(__dirname+'/jsmind.css'));
  //__dirname : It will resolve to your project folder.
});

app.get('/jsmind.draggable.js',function(req,res){
  res.sendFile(path.join(__dirname+'/jsmind.draggable.js'));
  //__dirname : It will resolve to your project folder.
});

app.get('/jsmind.js',function(req,res){
  res.sendFile(path.join(__dirname+'/jsmind.js'));
  //__dirname : It will resolve to your project folder.
});


app.listen(3000);

console.log("Running at Port 3000");