var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

  console.log(req.body);

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  //Valid id using isValid
    //404 - send back empty send
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // findById
    // success
      // if todo - send it back
      // if no todo - send back 404 with empty body
    // error
      // 400 - and send empty body back
  Todo.findById(id).then((todo) => {
    if(todo) {
      return res.send({todo});
    } else {
      return res.status(404).send();
    }
  }).catch((e) => {
      res.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Starting on port 3000.');
});

module.exports = {app};