
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var ToDo = require('./models/todo');
var {User} = require('./models/user');
var {ObjectId} = require('mongodb');
var _ = require('lodash');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new ToDo({
        text : req.body.text,
    });

    todo.save().then((doc)=> {
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res)=>{
    ToDo.find().then((doc)=>{
        res.send({doc});
    }, (e)=>{
        res.status(400).send({doc});
    });
});

// GET  /todos/12345
app.get('/todos/:id', (req,res)=> {
    //res.send( req.params);
    var id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send('Not a Valid ID.');
    } 

    ToDo.findById(id).then((doc)=>{
        if(!doc){
            return res.status(404).send('User Not Found.');
        } 

        res.send({doc});
    }).catch((e) => {
        res.status(400).send('Failed To process request');
    });   
    ToDo.findById(req.params.id);
});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(()=>{
        //res.send(user);
        return user.generateAuthToken();
    }).then((token)=>{ 
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    
        User.findByToken(token)
        .then((user)=>{
            if(!user) {
                return Promise.reject();
            }
    
            req.user = user;
            req.token = token;
            next();
        }).catch((e)=>{
            res.status(401).send();
    });
};
app.use(authenticate);
app.get('/users/me', (req, res)=>{
    var token = req.header('x-auth');
    res.send(req.user);
});

app.listen(3000, ()=>{
    console.log('Server started, Port : ' + 3000);
})

module.exports = {app};
