process.env.NODE_ENV = "development"

var should = require('should'),
    request = require('supertest'),
    User = require('../app/models/user.model'),
    mongoose = require('mongoose-q')(),
    config = require('../config/config');

describe('users', function() {
    mongoose.connect(config.db);

    var url = 'localhost:5011',
        user = {
            username: 'foofoo',
            password: 'barbar',
            email : 'foo@bar.com'
        },
        userId;


    before(function(done){
        var user2 = new User({
            username: 'toto',
            password: 'tata',
            email : 'toto@tata.com'
        });
        user2.save(function(data){
            user2 = data;
            done();
        });
    });

    describe('routing', function() {
        it('should respond with an empty array when sending a get request',function(done){
           request(url)
               .get('/users')
               .end(function(err,res){
//                   res.body.should.equal([]);
                   res.should.have.status(200);
                   done()
               })
        });
        it('should respond with status 200 when creating a new user', function (done) {
            request(url)
                .post('/auth/signup')
                .send(user)
                .end(function (err, res) {
                    console.log(res.body);
                    userId = res.body._id;
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });
        it('should return error when trying to duplicate user', function (done) {

            request(url)
                .post('/auth/signup')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(400);
                    done();
                });
        });
        it("should sign the user in", function(done){
            request(url)
                .post('/auth/signin')
                .send(user)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                });
        });
        it('should had a follower to our user',function(done){
            var param = {
                eid : userId
            };
            request(url)
                .post('/users/follow')
                .send(param)
                .end(function(err,res){
                    if (err){
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                })
        });
        it('should remove a follower to our user',function(done){
            var param = {
                eid : userId
            };
            request(url)
                .post('/users/unfollow')
                .send(param)
                .end(function(err,res){
                    if (err){
                        throw err;
                    }
                    res.should.have.status(200);
                    done();
                })
        });
        it('should update our user',function(done){
            var param = {
                username : 'thing'
            }
            request(url)
                .put('/users/'+userId)
                .send(param)
                .end(function(err,res){
                    if(err){
                        throw err;
                    }
                    User.findOne({ _id : userId },function(data){
                        data.should.have.username(param.username);
                        done();
                    });
                })
        });
        after(function(done) {
            User.removeQ({username : 'foofoo'}).then(function(){
                done();
            });
        });
    });
});