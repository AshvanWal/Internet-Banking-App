const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('express-session');
const crypto = require('crypto');
const request = require('request');
const saltRounds = 10;



const clientId = "1029651229301-joflh53096shnlrplnf6654bv2ku97pb.apps.googleusercontent.com";
const clientSecret = "cxz4TMIpdTiuK0n2Adr6n3dc";
const accessToken = "ya29.Glv8Bo4olL0UUFXDSKsIAvqvHToo8OpeF3SB_PLcwhNsvBi9zmqCbbyQiTW7jg4L7OvtsxYjGhDfLMIKLbqftLJGediOBChRqt3N0nEExJurs_VfKXd93M42iw93";
const refreshToken = "1/Ke2tGXwC2gHXyVdCb67cSRYRGPa9pAD_XBee2GkENh4";

var exphbs = require('express-handlebars');
var path = require('path');
var utils = require('./mongo_init.js');
var db = utils.getDb();


var app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');




app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
    utils.init();
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/home/update/:name', (request, response, next) => {
//
//     var name = String(request.params.name);
//     console.log(request.session.user.username);
//     console.log(name);
//     if (request.session.user.username === name) {
//         console.log('Should work');
//     } else if (request.session.user.username != name) {
//         console.log('Should not work');
//     }
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (String(request.session.user.username) != name) {
//         response.send('Cannot view the page of another user');
//     } else if (String(request.session.user.username) === name) {
//         next();
//     }
//
// });
//
// app.use('/home/update/update/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/user/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/account/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/e_transfer/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/currency/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/contact/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/currency/deposit/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });
//
// app.use('/home/currency/withdraw/:name', (request, response, next) => {
//
//     var name = request.params.name;
//
//     if (!request.session.user) {
//         response.send('User not authorized. Please sign in.');
//     } else if (request.session.user.username != name) {
//         response.send('Cannot view the page of another user');
//     } else if (request.session.user.username === name) {
//         next();
//     }
//
// });

app.get('/', function (request, response) {

    // var db = utils.getDb();
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function (request, response) {
    // var id = request.body.id;
    // var name = request.body.name;
    // var email = request.body.email;

    var db = utils.getDb();
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        db.collection('bank').find({ username: username }).toArray(function (err, result) {

            let verify = bcrypt.compareSync(password, result[0].password);

            let confirmed = false;
            if (result[0].verified === true) {
                confirmed = true;
            }
            if (verify && confirmed) {
                request.session.user = {
                    username: result[0].username,
                    password: result[0].password,
                    first_name: result[0].first_name,
                    last_name: result[0].last_name,
                    checkings: result[0].checkings,
                    savings: result[0].savings,
                    email: result[0].email,
                    phone_num: result[0].phone_num,
                    token: result[0].token,
                    tokenExpire: result[0].tokenExpire,
                    confirmToken: result[0].confirmToken,
                    verified: result[0].verified
                };

                response.redirect(`/home/${username}`);
            } else if (!verify) {
                response.send('Incorrect Username and/or Password!');
            } else if (verify && !confirmed) {
                response.send('Please verify your account through the email sent to your address.');
            }

            response.end();
        })
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/register', function (request, response) {
    response.render('account_create.hbs')
});

app.post('/saveUser', function (request, response) {

    var username = request.body.username;
    var password = request.body.password;
    var repassword = request.body.repassword;
    var goodPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
    if (goodPass == false) {
        response.send('Password must be at least 8 characters long, have one uppercase letter and one lowercase letter');
    } else if (password != repassword) {
        response.send('Passwords must match');
    } else {
        password = bcrypt.hashSync(password, saltRounds);
        var first_name = request.body.first_name;
        var last_name = request.body.last_name;
        var checkings = 0;
        var savings = 0;
        var email = request.body.email;
        var phone_num = request.body.phone_num;
        var token = "";
        var tokenExpire = "";
        var confirmToken = "";
        var total_balance = request.body.checkings + request.body.checkings;

        var db = utils.getDb();
        let create = true;

        db.collection('bank').find({
            email: email
        }).toArray(function (err, result) {
            if (result[0] != null) {
                response.render('basic_response.hbs', {
                    h1: 'Email in use'
                })
                create = false;
            }
        });


        db.collection('bank').find({
            username: username
        }).toArray(function (err, result) {
            if (result[0] == null && create === true) {
                db.collection('bank').insertOne({
                    username: username,
                    password: password,
                    first_name: first_name,
                    last_name: last_name,
                    checkings: checkings,
                    savings: savings,
                    email: email,
                    phone_num: phone_num,
                    token: token,
                    tokenExpire: tokenExpire,
                    confirmToken: confirmToken,
                    verified: false
                }, (err, result) => {
                    if (err) {
                        create = false;
                        console.log('Unable to insert user');
                        response.send('Unable to create user');
                    }
                    //response.send(JSON.stringify(result.ops, undefined, 2));
                    if (create === true) {
                        response.redirect('/confirm-account');
                    }
                })
            } else {
                response.render('basic_response.hbs', {
                    h1: 'Username in use'
                });
            }
        });
        }
    }
);

app.get('/confirm-account', function (request, response) {

    var db = utils.getDb();

    response.render('confirm_account.hbs')

});

app.post('/create-account', function (request, response) {

    var db = utils.getDb();
    var email = request.body.email;
    var confirmToken;

    db.collection('bank').find({
        email: email
    }).toArray(function (err, result) {

        if (!result[0]) {
            response.render('basic_response.hbs', {
                h1: 'No registered account with specified email address'
            });
        } else {

            request.session.user = {
                username: result[0].username,
                password: result[0].password,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                checkings: result[0].checkings,
                savings: result[0].savings,
                email: result[0].email,
                phone_num: result[0].phone_num,
                token: result[0].token,
                tokenExpire: result[0].tokenExpire,
                confirmToken: result[0].confirmToken,
                verified: result[0].verified
            };


            crypto.randomBytes(15, function (err, buf) {
                confirmToken = buf.toString('hex');

                db.collection('bank').updateOne(
                    { email: email },
                    {
                        $set: {
                            confirmToken: confirmToken,
                        }
                    }
                );

                request.session.user.confirmToken = confirmToken;
                request.session.save(function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
            });

            var auth = {
                type: 'oauth2',
                user: 'internetbanking.node@gmail.com',
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken
            };

            db.collection('bank').find({
                email: email
            }).toArray(function (err, result) {
                var mailOptions = {
                    to: result[0].email,
                    from: 'internetbanking.node@gmail.com',
                    subject: 'Account Creation Confirmation',
                    text: 'Click the following link to confirm your account and complete your registration. \n' +
                        'localhost:8080' + '/confirm/' + request.session.user.confirmToken,
                    auth: {
                        user: 'internetbanking.node@gmail.com',
                        refreshToken: refreshToken,
                        accessToken: accessToken
                    }
                };

                console.log(request.session.user.confirmToken);

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: auth
                });

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.log(err);
                    }
                });

                if (err) {
                    console.log(err);
                } else {
                    response.render('basic_response.hbs', {
                        h1: 'A confirmation email has been sent'
                    });
                }
            });
        }
    });

});

app.get('/confirm/:confirmToken', function (request, response) {

    var db = utils.getDb();

    db.collection('bank').find({
        confirmToken: request.params.confirmToken
    }).toArray(function (err, result) {
        if (result[0] != null) {
            db.collection('bank').updateOne(
                { confirmToken: request.params.confirmToken },
                {
                    $set: {
                        verified: true
                    }
                }
            );
            response.render('basic_response.hbs', {
                h1: 'Account Verified',
                message: 'You are now able to log in.'
            });
        } else {
            response.render('basic_response.hbs', {
                h1: 'Invalid Token',
                message: 'You have provided an invalid token. No changes have been made.'
            });
        }
    });

});

//Backup

// app.get('/home/update/:name', function(request, response) {
//
//     // var username = request.body.username;
//     var db = utils.getDb();
//
//     response.render("update.hbs");
//     var pass_word = request.body.password;
//     var first_name = request.body.first_name;
//     var last_name = request.body.last_name;
//     var email = request.body.email;
//     var phone_num = request.body.phone_num;
//
//     var user_name = request.params.name;
//     db.collection('bank').find({username: user_name}).toArray((err, docs) => {
//         if(err){
//             console.log('Unable to get user');
//         }
//         db.collection('bank').update({username: user_name}, {$set: {username: user_name, password: pass_word, first_name: first_name, last_name: last_name, email: email, phone_num:phone_num}});
//         // response.send("Thank You");
//         response.render('thankyou.hbs');
//
//     })
// });


app.get('/home/update/:name', function (request, response) {

    // var username = request.body.username;

    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('update.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })
    })



    // response.render("update.hbs"), {
    //     username: request.params.name
    // };

});

app.post('/home/update/update/:name', function (request, response) {

    // var username = request.body.username;
    var db = utils.getDb();

    var pass_word = request.body.password;
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var phone_num = request.body.phone_num;


    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        db.collection('bank').update({ username: user_name },
            {
                $set:
                {
                    username: user_name,
                    password: pass_word,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    phone_num: phone_num
                }
            });
        // response.send("Thank You");
        response.render('thankyou.hbs', {
            username: user_name,
        })


    })
});


app.del('/delUser', function (request, response) {
    var db = utils.getDb();
    db.collection('bank').remove({});
    db.collection('bank').find({}).toArray(function (err, result) {
        if (err) {
            response.send("Unable to delete student data")
        }
        response.send(JSON.stringify(result, undefined, 2))
    });

});

app.get('/all', function (request, response) {

    var db = utils.getDb();
    db.collection('bank').find({}).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        // response.send("Found the following records" + docs);
        response.send(docs);
        // response.send('email',response.)

    }
    )
});


app.get(`/user/:name`, function (request, response) {

    var db = utils.getDb();
    var user_name = request.params.name;
    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        // response.send("Found the following records" + docs);
        //response.send(docs[0]);

    }
    )
});

app.get('/home/:name', function (request, response) {

    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        var currencies = docs[0].foreign_currencys;

        var num_of_cur = currencies.length;
        var display_currencies = [];

        for (var x = 0; x < num_of_cur; x++) {
            var current_cur = currencies[x];
            var code = String(Object.keys(current_cur));

            var amount = String(Object.values(current_cur));

            var for_cur = code + ': ' + amount;
            console.log(for_cur);

            display_currencies.push(for_cur)

        }
        console.log(display_currencies);





        response.render('homepage.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            foreign_cur: display_currencies,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })

    })
    // response.sendFile(path.join(__dirname + '/homepage.html'));


    // var db = utils.getDb();



    // if (request.session.loggedin) {
    //     response.send('Welcome back, ' + request.session.username + '!');
    // } else {
    //     response.send('Please login to views this page!');
    // }
    // response.end();




});

app.get('/home/account/:name', function (request, response) {

    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('account_management.hbs', {
            title: 'Home page',
            username: docs[0].username,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account_management', 'currency']
        })

    })
});


app.get('/home/e_transfer/:name', function (request, response) {

    var db = utils.getDb();
    var user_name = request.params.name;
    
    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('e_transfer.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })

    })
});

app.post('/home/e_transfer/:name', function (request, response) {

    var db = utils.getDb();
    // var withdraw = request.body.withdraw;
    var transfer = Number(request.body.transfer);
    var email = request.body.email;
    var e_password = request.body.e_password;
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    response.render('thankyou.hbs', {
        username: user_name,
    });

    db.collection('bank').insertOne({
        e_transfer: true,
        from: user_name,
        to: email,
        transfer: transfer,
        e_password: e_password
    });

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }

        var balance = docs[0].checkings;
        var email = docs[0].email;


        var new_balance = parseInt(balance) - parseInt(transfer);
        db.collection('bank').updateOne({ username: user_name }, { $set: { checkings: new_balance } });
        response.render('thankyou.hbs', {
            username: user_name,
        });
    })
});

app.get('/home/e_transfer/collect/:name', function (request, response) {
    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('e_transfer_check.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })
    })
});


app.post('/home/e_transfer/collect/:name', function (request, response) {
    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({username: user_name}).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        var email = docs[0].email;

        db.collection('bank').find({e_transfer: true, to: email}).toArray((err, docs) => {
            if (err) {
                console.log('Unable to get user');
            }
            response.render('e_transfer_collect.hbs', {
                username: user_name,
                transfer: docs[0].transfer,
                e_password: docs[0].e_password,
                from: docs[0].from,
                to: docs[0].to
            })

        });

    });
});

app.post('/home/e_transfer/collect/e_deposit/:name', function (request, response) {
    var db = utils.getDb();
    var user_name = request.params.name;
    var password_attempt = request.body.password;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }

        var balance = docs[0].checkings;
        var email = docs[0].email;


        db.collection('bank').find({e_transfer: true, to: email}).toArray((err, docs) => {
            if (err) {
                console.log('Unable to get user');
            }

            var e_transfer = docs[0].transfer;
            var e_password = docs[0].e_password;
            if (password_attempt === e_password) {
                var new_balance = parseInt(balance) + parseInt(e_transfer);
                db.collection('bank').updateOne({ username: user_name }, { $set: { checkings: new_balance } });
                db.collection('bank').deleteOne({e_transfer: true, to: email});
                response.render('thankyou.hbs', {
                    username: user_name,
                });
            }
            else {
                response.render('error.hbs', {
                    username: user_name
                })

        }
        // response.send("Thank You");

        });
    })
});



app.get('/home/cur_calculator/:name', function(request, response) {
    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({username: user_name}).toArray((err, docs) => {
        if(err){
            console.log('Unable to get user');
        }

        var currencies = docs[0].foreign_currencys;

        var num_of_cur = currencies.length;
        var display_currencies = [];

        for (var x = 0; x < num_of_cur; x++) {
            var current_cur = currencies[x];
            var code = String(Object.keys(current_cur));

            var amount = String(Object.values(current_cur));

            var for_cur = code + ': ' + amount;


            display_currencies.push(for_cur)

        }

        response.render('cur_calculator.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            foreign_cur: display_currencies,
            pages: ['account_management', 'currency']
        })

    })
});

app.get('/home/currency/:name', function (request, response) {

    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('currency.hbs', {

            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })

    })
});

app.get('/home/contact/:name', function (request, response) {


    var db = utils.getDb();
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }

    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }
        response.render('contact.hbs', {
            title: 'Home page',
            username: docs[0].username,
            password: docs[0].password,
            first_name: docs[0].first_name,
            last_name: docs[0].last_name,
            checkings: docs[0].checkings,
            savings: docs[0].savings,
            email: docs[0].email,
            phone_num: docs[0].phone_num,
            pages: ['account', 'currency', 'update', 'cur_calculator', 'e_transfer', 'collect']
        })

    })
});

app.post('/home/currency/deposit/:name', function (request, response) {

    var db = utils.getDb();
    // var withdraw = request.body.withdraw;
    var account = request.body.account;
    var deposit = Number(request.body.deposit);
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username != user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {
        console.log('OK');
    }


    db.collection('bank').find({ username: user_name }).toArray((err, docs) => {
        if (err) {
            console.log('Unable to get user');
        }


        if (Number.isInteger(deposit) && (account === 'checkings')) {
            var balance = docs[0].checkings;
            var new_balance = parseInt(balance) + parseInt(deposit);
            db.collection('bank').updateOne({ username: user_name }, { $set: { checkings: new_balance } });
            response.render('thankyou.hbs', {
                username: user_name,
            });
        }
        else if (Number.isInteger(deposit) && (account === 'savings')) {
            var balance = docs[0].savings;
            var new_balance = parseInt(balance) + parseInt(deposit);
            db.collection('bank').updateOne({ username: user_name }, { $set: { savings: new_balance } });
            response.render('thankyou.hbs', {
                username: user_name,
            });
        }
        else {
            response.render('error.hbs', {
                username: user_name
            })

        }
        // response.send("Thank You");


    })
});



app.post('/home/currency/withdraw/:name', function(request, response) {

    var db = utils.getDb();
    var account = request.body.account;
    var withdraw = request.body.withdraw;
    // var deposit = Number(request.body.deposit);
    var user_name = request.params.name;

    db.collection('bank').find({username: user_name}).toArray((err, docs) => {
        if(err){
            console.log('Unable to get user');
        }

        var balance = docs[0].checkings;
        if (Number.isInteger(parseInt(withdraw)) === false){
            response.render('error.hbs', {
                username: user_name
            })

        } else{
            if (account === 'savings') {
                var balance = docs[0].savings;
                var new_balance = parseInt(balance) - parseInt(withdraw);
                if (new_balance < 0) {
                    response.render('error.hbs', {
                        username: user_name
                    })
                }
                db.collection('bank').updateOne({ username: user_name }, { $set: { savings: new_balance } });
                response.render('thankyou.hbs', {
                    username: user_name,
                });
            }
            else {
                var balance = docs[0].checkings;
                var new_balance = parseInt(balance) - parseInt(withdraw);
                if (new_balance < 0) {
                    response.render('error.hbs', {
                        username: user_name
                    })
                }
                db.collection('bank').updateOne({username: user_name}, {$set: {checkings: new_balance}});
                response.render('thankyou.hbs', {
                    username: user_name,
                });
            }
        }
        // response.send("Thank You");


    })
});

app.post('/home/cur_calculator/convert/:name', function(request, response) {

    var db = utils.getDb();
    // var withdraw = request.body.withdraw;
    var origin = Number(request.body.origin);
    var targetamount= Number(request.body.output);
    var currency1 = request.body.curr1;
    var currency2 = request.body.curr2;
    var user_name = request.params.name;

    if (!request.session.user) {
        response.send('User not authorized. Please sign in.');
    } else if (request.session.user.username !== user_name) {
        response.send('Cannot view the page of another user');
    } else if (request.session.user.username === user_name) {

    }

    db.collection('bank').find({username: user_name}).toArray((err, docs) => {
        if(err){
            console.log('Unable to get user');
        }

        var balance = docs[0].checkings;

        if (Number.isInteger(origin)) {
            var new_balance = parseInt(balance) - parseInt(origin);

            db.collection('bank').updateOne({username: user_name}, {$set: {checkings: new_balance}});
            console.log('done')
        }

        if (docs[0].foreign_currencys === undefined) {
            var foreign_cur = [];

        }
        else {
            var foreign_cur = docs[0].foreign_currencys;
        }

        var new_cur = {};
        console.log(foreign_cur);

        new_cur[currency2] = targetamount;
        console.log(new_cur);
        foreign_cur.push(new_cur);
        console.log(foreign_cur);

        db.collection('bank').updateOne({username: user_name}, {$set: {foreign_currencys: foreign_cur}});



        // var origincurramount  = currency;
        //
        // // if (typeof currency[currency2] == "undefined"){
        // //     var target_currence_amount = 0;
        // // }
        // // else{
        // //     var target_currence_amount = currency[currency2];
        // // }
        //
        //
        // if (Number.isInteger(origin) ){
        //     var oldcurrencyamount = parseFloat(origincurramount);
        //     var newoldcurrencyamount  = parseFloat(oldcurrencyamount) - parseFloat(origin);
        //     newoldcurrencyamount = newoldcurrencyamount.toFixed(2);
        //     console.log(newoldcurrencyamount);
        //     if (newoldcurrencyamount < 0){
        //         response.render('error.hbs', {
        //             username: user_name
        //         })
        //     }
        //
        //     else{
        //         targetamount = target_currence_amount + targetamount;
        //
        //
        //         var setObject = {};
        //         var unsetObject = {};
        //         if (newoldcurrencyamount > 0){
        //             setObject["currency."+ currency1] = newoldcurrencyamount;
        //             setObject["currency."+ currency2] = targetamount;
        //
        //         }
        //         else{
        //             setObject["currency."+ currency2] = targetamount;
        //             unsetObject["currency."+ currency1] = newoldcurrencyamount;
        //             db.collection('bank').updateOne({username:user_name},{$unset: unsetObject })
        //         }

                //db.collection('bank').updateOne({username: user_name}, {$set: setObject});

                response.render('thankyou.hbs', {
                    title: 'Home page',
                    username: docs[0].username,
                    password: docs[0].password,
                    first_name: docs[0].first_name,
                    last_name: docs[0].last_name,
                    checkings: docs[0].checkings,
                    savings: docs[0].savings,
                    email: docs[0].email,
                    phone_num: docs[0].phone_num,
                    pages: ['account_management', 'currency']
                });
            //}

        //}
        // else {
        //     response.render('error.hbs', {
        //         username: user_name
        //     })
        //
        // }
        // response.send("Thank You");



    })
});

app.get('/reset-password', function (request, response) {
    response.render('pass_reset.hbs');
});

app.post('/reset', function (request, response) {

    var db = utils.getDb();
    var email = request.body.email;
    var token;

    db.collection('bank').find({
        email: email
    }).toArray(function (err, result) {

        if (!result[0]) {
            response.render('basic_response.hbs', {
                h1: 'No registered account with specified email address'
            });
        } else {

            request.session.user = {
                username: result[0].username,
                password: result[0].password,
                first_name: result[0].first_name,
                last_name: result[0].last_name,
                checkings: result[0].checkings,
                savings: result[0].savings,
                email: result[0].email,
                phone_num: result[0].phone_num,
                token: result[0].token,
                tokenExpire: result[0].tokenExpire
            };

            crypto.randomBytes(15, function (err, buf) {
                token = buf.toString('hex');

                db.collection('bank').updateOne(
                    { email: email },
                    {
                        $set: {
                            token: token,
                            tokenExpire: Date.now() + 3600
                        }
                    }
                );

                request.session.user.token = token;
                request.session.user.tokenExpire = Date.now() + 3600
                request.session.save(function (err) {
                    if (err) {
                        console.log(err)
                    }
                });
            });

            var auth = {
                type: 'oauth2',
                user: 'internetbanking.node@gmail.com',
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken
            };

            db.collection('bank').find({
                email: email
            }).toArray(function (err, result) {
                var mailOptions = {
                    to: result[0].email,
                    from: 'internetbanking.node@gmail.com',
                    subject: 'Password Reset',
                    text: 'The account linked to this email has requested a password reset. Click the following link and enter a new password. \n' +
                        'localhost:8080' + '/reset/' + request.session.user.token,
                    auth: {
                        user: 'internetbanking.node@gmail.com',
                        refreshToken: refreshToken,
                        accessToken: accessToken
                    }
                };

                console.log(request.session.user.token);

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: auth
                });

                transporter.sendMail(mailOptions, (err, response) => {
                    if (err) {
                        console.log(err);
                    }
                });

                if (err) {
                    console.log(err);
                } else {
                    response.render('basic_response.hbs', {
                        h1: 'An email has been sent'
                    });
                }
            });
        }
    }
    )
});

app.get('/reset/:token', function (request, response) {
    var db = utils.getDb();

    db.collection('bank').find({
        token: request.params.token
    }).toArray(function (err, result) {
        if (result[0] == null) {
            response.render('basic_response.hbs', {
                h1: 'Invalid Token'
            });
        } else {
            response.render('reset.hbs', {
                username: result[0].username
            });
        }
    });
});

app.post('/reset/:token', function (request, response) {
    var db = utils.getDb();

    var password = request.body.password;
    password = bcrypt.hashSync(password, saltRounds);

    db.collection('bank').find({
        token: request.params.token
    }).toArray(function (err, result) {
        if (result[0] != null) {
            db.collection('bank').updateOne(
                { token: request.params.token },
                {
                    $set: {
                        password: password
                    }
                }
            )
            response.render('basic_response.hbs', {
                h1: 'Password Reset',
                message: 'The password has been succesfully updated.'
            });
            console.log(result[0].password)
        } else {
            response.render('basic_response.hbs', {
                h1: 'Invalid Token',
                message: 'You have provided an invalid token. No changes have been made.'
            });
        }
    })
    // var deposit = Number(request.body.deposit);

});







// connection.connect(function(err) {
//     if (err) {
//         return console.error('error: ' + err.message);
//     }

    //Make request to verify API
//     messagebird.verify.verify(id, token, function(err, response ) {
//         if(err){
//             //Verification has failed
//             res.render('step2', {
//                 error: err.errors[0].description,
//                 id: id
//             })
//         } else {
//             //Verification was successful ${username}
//             res.redirect(`/home/${user_name}`);
//         }
//     })
// });


// connection.end(function(err) {
//     if (err) {
//         return console.log('error:' + err.message);
//     }
//     console.log('Close the database connection.');
// });

//Load and initialize MessageBird SDK
// var messagebird = require('messagebird')('nXHHvxdfonv5EegEe323A1Gv1'); //Input message bird key here
//
// //Set up and configure the Express framework
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');
//
//
// //Display page to ask the user their phone number
// app.get('/phone/:name', function(req, res) {
//     var user_name = req.params.name;
//
//     res.render(`step1`, {
//         username: user_name
//     });
// });
//
// //Handle phone number submission
// app.post('/step2/:name', function(req, res) {
//     var number = req.body.number;
//     var user_name = req.params.name;
//
//     //Make request to verify API
//     messagebird.verify.create(number, {
//         template: "Your verification code is %token."
//     },function (err, response) {
//         if(err) {
//             //Request has failed
//             console.log(err);
//             res.render(`step1`,{
//                 error: err.errors[0].description,
//                 username: user_name
//             });
//         }
//         else{
//             //Request succeeds
//             console.log(response);
//             res.render(`step2`,{
//                 id: response.id,
//                 username: user_name
//             });
//         }
//     })
// });
//
// //Verify whether the token is correct
//
// app.post('/step3/:name', function(req, res) {
//     var id = req.body.id;
//     var token = req.body.token;
//     var user_name = req.params.name;
//
//     //Make request to verify API
//     messagebird.verify.verify(id, token, function(err, response ) {
//         if(err){
//             //Verification has failed
//             res.render('step2', {
//                 error: err.errors[0].description,
//                 id: id
//             })
//         } else {
//             //Verification was succe${username}
//             res.redirect(`/home/${user_name}`);
//         }
//     })
// });
//
// //


module.exports = app, utils, db;
