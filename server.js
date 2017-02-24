var express = require('express');
var bodyParser = require('body-parser');
var ECT = require('ect');

var app = express();
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use(express.static('static'));
var moment = require('moment');
var _ = require('lodash');

var g_id_counter = 100; 
var g_messages = [
  {
    id: 1,
    text: "Hello, this first message!",
    created_at: 0  
  }
];

function formatMessages(messages) {
  return {
    msgs: _.reverse(_.map(messages, function(val){
      return {
        id: val.id,
        text: val.text,
        created_at: moment(val.created_at).fromNow()
      };
    }))
  };
}
 
app.get('/', function (req, res){
  res.render('index', formatMessages(g_messages));
});

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json()

// POST /login gets urlencoded bodies
app.post('/', urlencodedParser, function (req, res){
  if (!req.body) return res.sendStatus(400);
	//console.log("get post!"+req.body.message + " " + moment().valueOf());
  g_messages.push({
    id: ++g_id_counter,
    text: req.body.message,
    created_at: moment().valueOf()
  });
  res.render('index', formatMessages(g_messages));
});

app.delete('/msg/:id', function (req, res){
  _.remove(g_messages, {id: parseInt(req.params.id, 10)});
  res.redirect('/');
});





app.get('/api/message', function (req, res){
  res.json({status: "OK", data: g_messages});
});

app.post('/api/message', jsonParser, function (req, res){
  if (req.body) {
    g_messages.push(req.body);
    res.json({status: "OK", data: req.body});
  } else 
    res.json({status: "FAIL", description: "Invalid data"});
});

app.get('/api/message/:id', function (req, res){
  var message = _.find(g_messages, {id: req.params.id});
  if (message) {
    res.json({status: "OK", data: message});
  } else 
    res.json({status: "FAIL", description: "Message ID not found"});
});

app.put('/api/message/:id', jsonParser, function (req, res){
  if (res.body) {
    var i = _.findIndex(g_messages, {id: req.params.id});
    if (i) {
      g_messages[i] = req.body;
      res.json({status: "OK"});
    } else
      res.json({status: "FAIL", description: "Message ID not found"});
  } else
    res.json({status: "FAIL", description: "Invalid data"});
});

app.delete('/api/message/:id', function (req, res){
  _.remove(g_messages, {id: req.params.id})
  res.json({status: "OK"});
});




app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});