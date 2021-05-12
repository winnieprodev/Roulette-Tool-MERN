const paypal = require('paypal-rest-sdk');
var url = require('url');
var mysql = require('mysql');
var paypalconfig = require('../../config/paypal.json');
// var dataconfig = require('../../config/database.json');
// var conn = mysql.createConnection(dataconfig);
require('custom-env').env('staging')
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

paypal.configure(paypalconfig.api);

var billingPlanUpdateAttributes = [
  {
    "op": "replace",
    "path": "/",
    "value": {
        "state": "ACTIVE"
    }
  }
];

var billingAgreementAttributes = {
  "name": "Billing Agreement",
  "description": "Create Agreement for Billing",
  "start_date": '2019-12-22T09:13:49Z',
  "plan": {
    "id": ""
  },
  "payer": {
    "payment_method": "paypal"
  }
};

var paymentToken = '';

//Retrieve payment token appended as a parameter to the redirect_url specified in
//billing plan was created. It could also be saved in the user session
paymentToken = 'EC-2V0782854X675410W';

var billingAgreementId = "I-08413VDRU6DE";

var cancel_note = {
    "note": "Canceling the agreement"
};

function pay(data, callback)
{
  var isoDate = new Date();
  isoDate.setMinutes(isoDate.getMinutes() + 5);
  isoDate.toISOString().slice(0, 19) + 'Z';

  var billingPlanAttributes = data.billingPlanAttributes;
  // Create the billing plan
  paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
    if (error) {
        console.log(error);
        callback({ success: false });
        throw error;
    } else {
        // Activate the plan by changing status to Active
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
            if (error) {
                console.log(error);
                callback({ success: false });
                throw error;
            } else {
                billingAgreementAttributes.plan.id = billingPlan.id;
                billingAgreementAttributes.start_date = isoDate;
                // Use activated billing plan to create agreement
                paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
                    if (error) {
                        console.log(error.response.details);
                        callback({ success: false });
                        throw error;
                    } else {
                        //console.log(billingAgreement);
                        for (var index = 0; index < billingAgreement.links.length; index++) {
                            if (billingAgreement.links[index].rel === 'approval_url') {
                              var approval_url = billingAgreement.links[index].href;
                              var token = url.parse(approval_url, true).query.token;

                              callback({ success: true, result: approval_url });

                              conn.query('UPDATE users SET pre_subscription = ' + data.pre_subscription + ', pre_subscription_desc = "' + data.pre_subscription_desc + '", token = "' + token + '" WHERE id = ' + data.user_id, function(err, row) {
                                if (!err) {
                                  console.log('success');
                                } else {
                                  console.log('fail');
                                }
                              });
                            }
                        }
                    }
                });
            }
        });
    }
  });
}

function cancel(data, callback)
{
  billingAgreementId = data.billingAgreementId;
  paypal.billingAgreement.cancel(billingAgreementId, cancel_note, function (error, response) {
    if (error) {
      console.log(error);
      callback({ success: false });
      throw error;
    } else {
      console.log("Cancel Billing Agreement Response");
      console.log(response);

      paypal.billingAgreement.get(billingAgreementId, function (error, billingAgreement) {
          if (error) {
              console.log(error.response);
              callback({ success: false });
              throw error;
          } else {
              console.log(billingAgreement.state);
              callback({ success: true, result: billingAgreement.state });
              conn.query('SELECT * FROM users WHERE id = ' + data.user_id, function(err, row) {
                if (!err) {
                  let comment = '';
                  if (row[0].subscription == 1) {
                    comment = 'cancelled Roulette Plan ';
                  } else if (row[0].subscription == 2) {
                    comment = 'cancelled Roulette + BlackJack Plan ';
                  } else if (row[0].subscription == 3) {
                    comment = 'cancelled All You Can Access Plan ';
                  }
                  conn.query('INSERT INTO histories(user_id, username, comment) VALUES(' + row[0].id + ', "' + row[0].username+ '", "' + comment + '")', function(err, row) {
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
              });
          }
      });
    }
  });
}

function get_state(data, callback)
{
  billingAgreementId = data.billingAgreementId;
  paypal.billingAgreement.get(billingAgreementId, function (error, billingAgreement) {
    if (error) {
        console.log(error);
        callback({ success: false });
        throw error;
    } else {
      console.log("Get Billing Agreement");
      console.log(JSON.stringify(billingAgreement));
      callback({ success: true, result: billingAgreement });
    }
  });
}

module.exports = {
	pay: pay,
  cancel: cancel,
  get_state: get_state
}