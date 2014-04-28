// server.js (Express 4.0)
var express        = require('express');
var morgan         = require('morgan');

var pub = __dirname + '/public';
var views = __dirname + '/views';
var port = 8000;

var app = express();

app.set('views', views);
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.static(pub));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port);

console.log("Now listening on port: " + port);