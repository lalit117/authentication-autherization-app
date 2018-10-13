

const expect = require('expect');
const request = require('supertest');

const {app} =  require('../server.js');
const Todo = require('../models/todo');
const {User} = require('../models/user');

var totalDoc = 0;
beforeEach((done) => {
    //Todo.remove().then(() => done());
    Todo.count().then((num)=>{
        totalDoc = num;
        done();
    });
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=> {
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(totalDoc + 1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
            });
    });

    it('Should Not Create New document in Todo', (done)=>{
        var text = '';

        request(app)
            .post('/todos')
            .send({text})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(totalDoc);
                    //expect(todos)
                    done();
                }).catch((e)=>done(e));
            });
    });
});

describe('GET /todos', ()=> {
    it('should return all documents', (done)=>{
        
                request(app)
                    .get('/todos')
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.doc.length).toBe(totalDoc);
                    })
                    .end(done);
    });
})

describe('GET /todos/:id', () =>{ 
    // Should send 404 for non object ids
    it('Should send 404 and \'Not a Valid ID.\' message', (done)=>{
        
        request(app)
            .get('/todos/5baf75eea9c23a1fe8164f2012')
            .expect(404)
            .expect((res) => {
                console.log(res.body);
            })
            .end(done);
    });
 
    // Should send 404 if todo not found
    it('Should send 404 and \'User Not Found.\' message', (done) => {
        // var id = new ObjectID().toHexString;
        request(app)
            .get('/todos/5baf75eea9c23a1fe8164f20')
            .expect(200)
            .expect((res) => {
                console.log(res.body);
            })
            .end(done);
    });

    it('Should send 200 and valid Doc', (done) => {
        
        request(app)
            .get('/todos/5baf75eea9c23a1fe8164f21')
            .expect(404)
            .expect((res) => {
                console.log(res.body);
            })
            .end(done);
    });
});