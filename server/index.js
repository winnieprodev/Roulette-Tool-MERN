const https = require('https');
const fs = require('fs');
const options = {
    cert: fs.readFileSync('./ssl/STAR_bigdata666_com.crt'),
    ca: fs.readFileSync('./ssl/bigdata666.com.ca-bundle'),
    key: fs.readFileSync('./ssl/bigdata666.key'),
};
const cron = require("node-cron");
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var route = require('./route');
var path = require('path');
const cors = require('cors');
const multer = require('multer');
var mysql = require('mysql');
const shell = require('shelljs');
// var dataconfig = require('./config/database.json');

// var conn = mysql.createConnection(dataconfig);
require('custom-env').env('staging')
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const paypal = require('paypal-rest-sdk');
var paypalconfig = require('./config/paypal.json');

paypal.configure(paypalconfig.api);
const ejs = require('ejs');

app.set("view engine", "ejs");

const user_avatar = multer.diskStorage({
    destination: "./upload/users/",
    filename: function(req, file, cb){
       cb(null,"avatar-" + Date.now() + path.extname(file.originalname));
    }
});

const dealer_avatar = multer.diskStorage({
    destination: "./upload/dealers/",
    filename: function(req, file, cb){
       cb(null,"dealer-" + Date.now() + path.extname(file.originalname));
    }
});

const thumbnail_avatar = multer.diskStorage({
    destination: "./upload/thumbnails/",
    filename: function(req, file, cb){
       cb(null,"thumbnail-" + Date.now() + path.extname(file.originalname));
    }
});

const user_upload = multer({storage: user_avatar});
const dealer_upload = multer({storage: dealer_avatar});
const thumbnail_upload = multer({storage: thumbnail_avatar});

app.use(bodyparser.json({
    urlencoded:false
}))
app.use(cors());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-timebase"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.static('./'));
app.use('/api', route.register);

const httpsServer = https.createServer(options, app);
  
httpsServer.listen(5000, () => {
    console.log('HTTPS Server running on port 5000');
});

app.get("/success", (req, res) => {
    let paymentToken = req.query.token;
    paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log("Billing Agreement Execute Response");
            console.log(billingAgreement);
            console.log(billingAgreement.id);
            let billingAgreementId = billingAgreement.id;
            let expired_at = new Date(billingAgreement.agreement_details.next_billing_date);
            let comment = '';
            expired_at = new Date(expired_at).getFullYear() + '-'  + (new Date(expired_at).getMonth() + 1) + '-' + new Date(expired_at).getDate() + ' '  + new Date(expired_at).getHours() + ':' + new Date(expired_at).getMinutes() + ':' + new Date(expired_at).getSeconds();
            conn.query('SELECT * FROM users WHERE token = "' + paymentToken + '"', function(err, row) {
                if (!err) {
                    var cancel_note = {
                        "note": "Canceling the agreement"
                    };
                    let result = row;
                    if (result[0].billingAgreementId && result[0].billingAgreementId == billingAgreementId) {
                        paypal.billingAgreement.get(result[0].billingAgreementId, function (error, billingAgreement) {
                            if (error) {
                                console.log(error.response);
                                throw error;
                            } else {
                                console.log(billingAgreement.state);
                                if (billingAgreement.state == 'Cancelled') {
                                    conn.query('UPDATE users SET billingAgreementId = "' + billingAgreementId + '", subscription = ' + result[0].pre_subscription + ', subscription_desc = "' + result[0].pre_subscription_desc + '" WHERE token = "' + paymentToken + '"', function(err, row) {
                                        if (!err) {
                                            console.log('success');
                                            if (result[0].pre_subscription == 1) {
                                                comment = 'purchased Roulette Plan ';
                                            } else if (result[0].pre_subscription == 2) {
                                                comment = 'purchased Roulette + BlackJack Plan ';
                                            } else if (result[0].pre_subscription == 3) {
                                                comment = 'purchased All You Can Access Plan ';
                                            }
                                            conn.query('INSERT INTO histories(user_id, username, comment) VALUES(' + result[0].id + ', "' + result[0].username+ '", "' + comment + '")', function(err, row) {
                                                if (!err) {
                                                    console.log('success');
                                                } else {
                                                    console.log(err);
                                                    console.log('fail');
                                                }
                                            });
                                        } else {
                                            console.log(err)
                                            console.log('fail');
                                        }
                                    });
                                } else {
                                    paypal.billingAgreement.cancel(result[0].billingAgreementId, cancel_note, function (error, response) {
                                        if (error) {
                                          console.log(error);
                                          throw error;
                                        } else {
                                          console.log("Cancel Billing Agreement Response");
                                          console.log(response);
                                    
                                          paypal.billingAgreement.get(result[0].billingAgreementId, function (error, billingAgreement) {
                                              if (error) {
                                                  console.log(error.response);
                                                  throw error;
                                              } else {
                                                  console.log(billingAgreement.state);
                                                  if (billingAgreement.state == 'Cancelled') {
                                                    conn.query('UPDATE users SET billingAgreementId = "' + billingAgreementId + '", subscription = ' + result[0].pre_subscription + ', subscription_desc = "' + result[0].pre_subscription_desc + '", expired_at = "' + expired_at + '" WHERE token = "' + paymentToken + '"', function(err, row) {
                                                        if (!err) {
                                                            console.log('success');
                                                            if (result[0].pre_subscription == 1) {
                                                                comment = 'purchased Roulette Plan ';
                                                            } else if (result[0].pre_subscription == 2) {
                                                                comment = 'purchased Roulette + BlackJack Plan ';
                                                            } else if (result[0].pre_subscription == 3) {
                                                                comment = 'purchased All You Can Access Plan ';
                                                            }
                                                            conn.query('INSERT INTO histories(user_id, username, comment) VALUES(' + result[0].id + ', "' + result[0].username+ '", "' + comment + '")', function(err, row) {
                                                                if (!err) {
                                                                    console.log('success');
                                                                } else {
                                                                    console.log(err);
                                                                    console.log('fail');
                                                                }
                                                            });
                                                        } else {
                                                            console.log(err)
                                                            console.log('fail');
                                                        }
                                                    });
                                                  }
                                              }
                                          });
                                        }
                                    });
                                }
                            }
                        })  
                    } else {
                        conn.query('UPDATE users SET billingAgreementId = "' + billingAgreementId + '", subscription = ' + result[0].pre_subscription + ', subscription_desc = "' + result[0].pre_subscription_desc + '", expired_at = "' + expired_at + '" WHERE token = "' + paymentToken + '"', function(err, row) {
                            if (!err) {
                                console.log('success');
                                
                                if (result[0].pre_subscription == 1) {
                                    comment = 'purchased Roulette Plan ';
                                } else if (result[0].pre_subscription == 2) {
                                    comment = 'purchased Roulette + BlackJack Plan ';
                                } else if (result[0].pre_subscription == 3) {
                                    comment = 'purchased All You Can Access Plan ';
                                }
                                conn.query('INSERT INTO histories(user_id, username, comment) VALUES(' + result[0].id + ', "' + result[0].username+ '", "' + comment + '")', function(err, row6) {
                                    if (!err) {
                                        console.log('success');
                                    } else {
                                        console.log(err);
                                        console.log('fail');
                                    }
                                });
                            } else {
                                console.log(err)
                                console.log('fail');
                            }
                        });
                    }
                    
                } else {
                    console.log(err);
                    console.log('fail');
                }
            });
        }
    });
    res.render("success");
})

app.get("/cancel", (req, res) => {
    res.render("cancel");
})

app.post('/api/user_image', user_upload.single('fileImg'), function(req, res, next) {
    res.json({success: true, file: 'upload/users/' + req.file.filename});
})

app.post('/api/dealer_image', dealer_upload.single('fileImg'), function(req, res, next) {
    res.json({success: true, file: 'upload/dealers/' + req.file.filename});
})

app.post('/api/thumbnail_image', thumbnail_upload.single('fileImg'), function(req, res, next) {
    res.json({success: true, file: 'upload/thumbnails/' + req.file.filename});
})

app.post('/api/get_time', function(req, res) {
    res.json({success: true, time: new Date()})
})

cron.schedule("59 23 * * *", function() {
    conn.query('SELECT * FROM users', function(err, row) {
        if (!err) {
            let users = row;
            let sales = 0;
            conn.query('SELECT * FROM plans', function(err, row) {
                if (!err) {
                    for (var item = 0; item < users.length; item++) {
                        if (users[item]['subscription'] > 0) {
                            sales += row[users[item]['subscription'] - 1]['price'];
                        }
                    }
                    conn.query('INSERT INTO reports(users, sales) VALUES(' + users.length + ', ' + sales +  ')', function(err, row) {
                        if (!err) {
                            console.log('success');
                        } else {
                            console.log(err);
                            console.log('fail');
                        }
                    });
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
            callback({ success: 'false' });
        }
    });
})

cron.schedule('0 * * * *', function() {
    console.log('---------------------');
    console.log('Running Cron Job');

    const mysqldump = require('mysqldump')
 
    // dump the result straight to a file
    mysqldump({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        dumpToFile: './roulette_dump.sql',
    });
});