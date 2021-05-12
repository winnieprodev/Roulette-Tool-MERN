var mysql = require('mysql');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var cognitoconfig = require('../../config/cognito.json');
var paypalconfig = require('../../config/paypal.json');
global.fetch = require('node-fetch');
const paypal = require('paypal-rest-sdk');
const { json } = require('body-parser');
paypal.configure(paypalconfig.api);
// var dataconfig = require('../../config/database.json');
// var conn = mysql.createConnection(dataconfig);
require('custom-env').env('staging')
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const poolData = {    
	UserPoolId : cognitoconfig.USER_POOL_ID, // Your user pool id here    
	ClientId : cognitoconfig.APP_CLIENT_ID // Your client id here
	}; 

const pool_region = cognitoconfig.REGION;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function login(data, callback)
{
	conn.query('SELECT * FROM users WHERE email = "' + data.email + '"', function(err, row) {
		if (!err) {
			if (row.length > 0)
			{
				conn.query('SELECT * FROM users WHERE email = "' + data.email + '" AND password = MD5("' + data.password + '")', function(err, row) {
					if (!err) {
						if (row.length > 0) {
							if (row[0].active == 0) {
								callback({ success: false, message: 'Your account is disabled!\n Please contact to the support.' });
							} else {
								callback({ success: true, userinfo: row[0] });
							}
						} else {
							callback({ success: false, message: 'Password is incorrect!' });
						}
					} else {
						console.log(err);
						callback({ success: false });
					}
				})
			} else {
				callback({ success: false, message: 'Email is incorrect!' });
			}
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function register(data, callback)
{
	var field = [];
	var value = [];

	user_exist(data, function(valid_user) {
		if (valid_user['exist']) {
	        callback({ success: false, message: valid_user['message'] });
	        return;
	    }

		for (var item in data) {
			if (item == 'password') {
				data[item] = 'MD5(' + JSON.stringify(data[item]) + ')';
			} else if (item == 'conf_password') {
				continue;
			} else {
				data[item] = JSON.stringify(data[item]);
			}

			field.push(item);
			value.push(data[item]);
		}
		
		conn.query('INSERT INTO users(' + field.join(',') + ') VALUES(' + value.join(',') + ')', function(err, row) {
			if (!err) {
				conn.query('SELECT * FROM users WHERE id = (SELECT MAX(id) FROM users)', function(err, row) {
					if (!err) {
						callback({ success: true, userinfo: row[0] });
						let comment = 'registered ';
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
						callback({ success: false });
					}
				});
			} else {
				console.log(err);
				callback({ success: false });
			}
		});
	});
}

function get_profile(data, callback)
{
	conn.query('SELECT * FROM users WHERE id = ' + data.user_id, function(err, row) {
		if(!err) {
			callback({ success: true, userinfo: row[0] });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function update_profile(data, callback)
{
	var updatedata = [];

	conn.query('SELECT * FROM users WHERE NOT id = ' + data.id + ' AND (username = "' + data.username + '" OR email = "' + data.email + '")', function(err, row) {
		if (!err) {
			if (row.length > 0) {
				if (row[0]['username'].toLowerCase() == data.username.toLowerCase()) {
					callback({ success: false, message: 'Username is already exist. Please retry again with another Username' });
				} else {
					callback({ success: false, message: 'Email is already exist. Please retry again with another Email' });
				}
			} else {
				for (var item in data) {
					if (item != 'id') {
						data[item] = JSON.stringify(data[item]);
						updatedata.push(item + '=' + data[item]);
					} else {
						var user_id = data[item];
					}
				}
				
				conn.query('UPDATE users SET ' + updatedata.join(',') + ' WHERE id = ' + user_id, function(err, row) {
					if (!err) {
						conn.query('SELECT * FROM users WHERE id = ' + user_id, function(err, row) {
							if(!err) {
								callback({ success: true, userinfo: row[0] });
							} else {
								console.log(err);
								callback({ success: false });
							}
						});
					} else {
						console.log(err);
						callback({ success: false });
					}
				});
			}
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function reset_password(data, callback)
{
	var updatedata = [];

	for (var item in data) {
		if (item != 'email') {
			data[item] = 'MD5(' + JSON.stringify(data[item]) + ')';
			updatedata.push(item + '=' + data[item]);
		} else {
			var email = JSON.stringify(data[item]);
		}
	}
	
	conn.query('UPDATE users SET ' + updatedata.join(',') + ' WHERE email = ' + email, function(err, row) {
		if (!err) {
			callback({ success: true });
			conn.query('UPDATE admins SET ' + updatedata.join(',') + ' WHERE email = ' + email, function(err, row) {
				if (!err) {
					console.log('success');
				} else {
					console.log(err);
				}
			});
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function user_exist(data, callback)
{
	conn.query('SELECT * FROM users WHERE username = "' + data.username + '" OR email = "' + data.email + '"', function(err, row) {
		if (!err) {
			if (row.length > 0) {
				if (row[0]['username'].toLowerCase() == data.username.toLowerCase()) {
					callback({ exist: true, success: false, message: 'Username is already exist. Please retry again with another Username', type: 'username' });
				} else {
					callback({ exist: true, success: false, message: 'Email is already exist. Please retry again with another Email', type: 'email' });
				}
			} else {
				callback({ exist: false, success: true });
			}
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function upload_avatar(data, callback)
{
	var updatedata = [];

	for (var item in data) {
		if (item != 'id') {
			data[item] = JSON.stringify(data[item]);
			updatedata.push(item + '=' + data[item]);
		} else {
			var user_id = data[item];
		}
	}
    
	conn.query('UPDATE users SET ' + updatedata.join(',') + ' WHERE id = ' + user_id, function(err, row) {
		if (!err) {
			conn.query('SELECT * FROM users WHERE id = ' + user_id, function(err, row) {
				if(!err) {
					callback({ success: true, userinfo: row[0] });
				} else {
					console.log(err);
					callback({ success: false });
				}
			});
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function mac_login(data, callback)
{
	var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
		Username : data.email,
		Password : data.password,
	});

	var userData = {
		Username : data.email,
		Pool : userPool
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			conn.query('SELECT * FROM users WHERE email = "' + data.email + '"', function(err, row) {
				if (!err) {
					if (row.length > 0)
					{
						conn.query('SELECT * FROM users WHERE email = "' + data.email + '" AND password = MD5("' + data.password + '")', function(err, row) {
							if (!err) {
								if (row.length > 0) {
									if (row[0].subscription != 3) {
										callback({ success: 'expired' });
									} else {
										var expired_at = new Date(row[0].expired_at);
										let now_date = new Date();
										var diffTime = expired_at - now_date;
										if (diffTime > 0) {
											callback({ success: 'true' });
										} else {
											billingAgreementId = row[0].billingAgreementId;
											paypal.billingAgreement.get(billingAgreementId, function (error, billingAgreement) {
												if (error) {
														console.log(error);
														callback({ success: 'false' });
														throw error;
												} else {
													expired_at = new Date(billingAgreement.agreement_details.next_billing_date);
													diffTime = expired_at - now_date;
													if (diffTime > 0) {
														callback({ success: 'true' });
													} else {
														callback({ success: 'expired' });
													}
												}
											});
										}
									}
								} else {
									callback({ success: 'false', message: 'Password is incorrect!' });
								}
							} else {
								console.log(err);
								callback({ success: 'false' });
							}
						})
					} else {
						callback({ success: 'false', message: 'Email is incorrect!' });
					}
				} else {
					console.log(err);
					callback({ success: 'false' });
				}
			});
		},
		onFailure: function(err) {
			callback({ success: 'false', message: err.message });
		},
	});
}

function mac_register(data, callback)
{
	var field = [];
	var value = [];

	user_exist(data, function(valid_user) {
		if (valid_user['exist']) {
			if (valid_user['type'] == 'username') {
				callback({ success: 'username' });
			} else {
				callback({ success: 'email' });
			}
			return;
		}

		var attributeList = [];
    	attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: "email", Value: data['email']}));

		userPool.signUp(data['username'], data['password'], attributeList, null, function(err, result){
			if (err) {
				console.log(err);
				if (err.code === 'UsernameExistsException') {
					callback({ success: 'exist', message: 'Username already exists' });
				}
				if (err.code === 'InvalidParameterException' || err.code == 'InvalidPasswordException') {
					callback({ success: 'password', message: 'At least 1 number and minimum 8 letters !' });
				}
				return;
			}

			for (var item in data) {
				if (item == 'password') {
					data[item] = 'MD5(' + JSON.stringify(data[item]) + ')';
				} else {
					data[item] = JSON.stringify(data[item]);
				}

				field.push(item);
				value.push(data[item]);
			}
					
			conn.query('INSERT INTO users(' + field.join(',') + ') VALUES(' + value.join(',') + ')', function(err, row) {
				if (!err) {
					conn.query('SELECT * FROM users WHERE id = (SELECT MAX(id) FROM users)', function(err, row) {
						if (!err) {
							callback({ success: 'true' });
							let comment = 'registered ';
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
							callback({ success: 'false' });
						}
					});
				} else {
					console.log(err);
					callback({ success: 'false' });
				}
			});
		});
	});
}

function mac_email_confirm(data, callback)
{
	var userData = {
		Username : data.email,
		Pool : userPool
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.forgotPassword({
		onSuccess: function (result) {
			console.log(result);
			callback({ success: 'true' });
		},
		onFailure: function(err) {
			console.log(err);
			callback({ success: 'false', message: err.message });
		},
	});
}

function mac_reset_password(data, callback)
{
	var userData = {
		Username : data.email,
		Pool : userPool
	};
	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmPassword(data.confirm_code, data.new_password, {
		onSuccess: function (result) {
			console.log(result);
			conn.query('UPDATE users SET password = MD5("' + data.new_password + '") WHERE email = "' + data.email + '"', function(err, row) {
				if (!err) {
					callback({ success: 'true' });
				} else {
					console.log(err);
					callback({ success: 'false' });
				}
			});
		},
		onFailure: function(err) {
			console.log(err);
			if (err.code === 'InvalidParameterException' || err.code == 'InvalidPasswordException') {
				callback({ success: 'password', message: 'At least 1 number and minimum 8 letters !' });
			} else {
				callback({ success: 'false' });
			}
		},
	});
}

function admin_login(data, callback)
{
	conn.query('SELECT * FROM admins WHERE email = "' + data.email + '"', function(err, row) {
		if (!err) {
			if (row.length > 0)
			{
				conn.query('SELECT * FROM admins WHERE email = "' + data.email + '" AND password = MD5("' + data.password + '")', function(err, row) {
					if (!err) {
						if (row.length > 0) {
							if (row[0].active == 0) {
								callback({ success: false, message: 'Your account is disabled!\n Please contact to the support.' });
							} else {
								callback({ success: true, userinfo: row[0] });
							}
						} else {
							callback({ success: false, message: 'Password is incorrect!' });
						}
					} else {
						console.log(err);
						callback({ success: false });
					}
				})
			} else {
				callback({ success: false, message: 'Email is incorrect!' });
			}
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function get_user(data, callback)
{
	conn.query('SELECT * FROM users WHERE username = "' + data.username + '"', function(err, row) {
		if (!err) {
			callback({ success: true, user: row[0] });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function get_users(data, callback)
{
	conn.query('SELECT * FROM users', function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function get_plans(data, callback)
{
	conn.query('SELECT * FROM plans', function(err, row) {
		if (!err) {
			callback({ success: true, plans: row });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function get_notifications(data, callback)
{
	conn.query('SELECT * FROM histories ORDER BY created_at DESC', function(err, row) {
		if (!err) {
			callback({ success: true, histories: row });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function update_price(data, callback)
{
	conn.query('UPDATE plans SET price = ' + data['price'] + ' WHERE id = ' + data['id'], function(err, row) {
		if (!err) {
			callback({ success: true, userinfo: row[0] });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function update_userinfo(data, callback)
{
	var updatedata = [];
	conn.query('SELECT * FROM users WHERE NOT id = ' + data.id + ' AND (username = "' + data.username + '" OR email = "' + data.email + '")', function(err, row) {
		if (!err) {
			if (row.length > 0) {
				if (row[0]['username'].toLowerCase() == data.username.toLowerCase()) {
					callback({ success: false, message: 'Username is already exist. Please retry again with another Username' });
				} else {
					callback({ success: false, message: 'Email is already exist. Please retry again with another Email' });
				}
			} else {
				

				conn.query('SELECT * FROM users WHERE id = ' + data.id, function(err, row) {
					if(!err) {

						var attributeList = [];

						var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
							Username : row[0].email,
							Password : data.password,
						});
					
						var userData = {
							Username : row[0].email,
							Pool : userPool
						};
						var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
						cognitoUser.authenticateUser(authenticationDetails, {
							onSuccess: function (result) {
								
								attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
										Name: "email",
										Value: data.email
								}));
								cognitoUser.updateAttributes(attributeList, (err, result) => {
									if (err) {
										console.log(err);
										callback({ success: false, message: err.message });
									} else {
										for (var item in data) {
											if (item != 'id' && item != 'password') {
												data[item] = JSON.stringify(data[item]);
												updatedata.push(item + '=' + data[item]);
											}
										}
										
										conn.query('UPDATE users SET ' + updatedata.join(',') + ' WHERE id = ' + data.id, function(err, row) {
											if (!err) {
												conn.query('SELECT * FROM users WHERE id = ' + user_id, function(err, row) {
													if(!err) {
														callback({ success: true, userinfo: row[0] });
													} else {
														console.log(err);
														callback({ success: false, message: 'Server Error' });
													}
												});
											} else {
												console.log(err);
												callback({ success: false, message: 'Server Error' });
											}
										});
									}
								});
							},
							onFailure: function(err) {
								callback({ success: false, message: err.message });
							},
						});
						
					} else {
						console.log(err);
						callback({ success: false, message: 'Server Error' });
					}
				});
			}
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function user_delete(data, callback)
{
	conn.query('DELETE FROM users WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_reports(data, callback)
{
	conn.query('SELECT * FROM reports', function(err, row) {
		if (!err) {
			callback({ success: true, reports: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_searchUsers(data, callback)
{
	conn.query('SELECT * FROM users WHERE username LIKE "%' + data.key + '%" OR email LIKE "%' + data.key + '%"', function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_searchUsers(data, callback)
{
	conn.query('SELECT * FROM users WHERE username LIKE "%' + data.key + '%" OR email LIKE "%' + data.key + '%"', function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_orderUsers(data, callback)
{
	var query = 'SELECT * FROM users';
	if (data.key) {
		query += ' WHERE username LIKE "%' + data.key + '%" OR email LIKE "%' + data.key + '%"';
	}
	query += ' ORDER BY ' + data.order + ' ' + data.by;
	conn.query(query, function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function save_analytic(data, callback)
{
	var field = [];
	var value = [];

	for (var item in data) {
		data[item] = JSON.stringify(data[item]);
		field.push(item);
		value.push(data[item]);
	}
	
	conn.query('INSERT INTO google_analysis(' + field.join(',') + ') VALUES(' + value.join(',') + ')', function(err, row) {
		if (!err) {
			conn.query('SELECT * FROM google_analysis', function(err, row) {
				if (!err) {
					callback({ success: true, analysis: row });
				} else {
					console.log(err);
					callback({ success: false, message: 'Server Error' });
				}
			});
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function get_analytics(data, callback)
{
	conn.query('SELECT * FROM google_analysis', function(err, row) {
		if (!err) {
			callback({ success: true, analysis: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function update_analytic(data, callback)
{
	conn.query('UPDATE google_analysis SET status = ' + data.status + ' WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			conn.query('SELECT * FROM google_analysis', function(err, row) {
				if (!err) {
					callback({ success: true, analysis: row });
				} else {
					console.log(err);
					callback({ success: false, message: 'Server Error' });
				}
			});
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function delete_analytic(data, callback)
{
	conn.query('DELETE FROM google_analysis WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			conn.query('SELECT * FROM google_analysis', function(err, row) {
				if (!err) {
					callback({ success: true, analysis: row });
				} else {
					console.log(err);
					callback({ success: false, message: 'Server Error' });
				}
			});
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_admins(data, callback)
{
	conn.query('SELECT * FROM admins', function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function update_admin(data, callback)
{
	conn.query('UPDATE admins SET role = ' + data.role + ' WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function delete_admin(data, callback)
{
	conn.query('DELETE FROM admins WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function new_admin(data, callback)
{
	var field = [];
	var value = [];

	conn.query('SELECT * FROM admins WHERE username = "' + data.username + '" OR email = "' + data.email + '"', function(err, row) {
		if (!err) {
			if (row.length > 0) {
				if (row[0]['username'].toLowerCase() == data.username.toLowerCase()) {
					callback({ success: false, message: 'Username is already exist. Please retry again with another Username' });
				} else {
					callback({ success: false, message: 'Email is already exist. Please retry again with another Email' });
				}
			} else {
				for (var item in data) {
					if (item == 'password') {
						data[item] = 'MD5(' + JSON.stringify(data[item]) + ')';
					} else {
						data[item] = JSON.stringify(data[item]);
					}
		
					field.push(item);
					value.push(data[item]);
				}
				
				conn.query('INSERT INTO admins(' + field.join(',') + ') VALUES(' + value.join(',') + ')', function(err, row) {
					if (!err) {
						callback({ success: true });
					} else {
						console.log(err);
						callback({ success: false, message: 'Server Error'  });
					}
				});
			}
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error'  });
		}
	});
}

function get_orderAdmins(data, callback)
{
	var query = 'SELECT * FROM admins';
	query += ' ORDER BY ' + data.order + ' ' + data.by;
	conn.query(query, function(err, row) {
		if (!err) {
			callback({ success: true, users: row });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function get_settings(data, callback)
{
	var query = 'SELECT * FROM settings WHERE context = "' + data.context + '"';
	conn.query(query, function(err, row) {
		if (!err) {
			callback({ success: true, settings: row[0] });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function update_settings(data, callback)
{
	conn.query('UPDATE settings SET data = ' + JSON.stringify(data.data) + ' WHERE context = "' + data.context + '"', function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

module.exports = {
	login: login,
	user_exist: user_exist,
	register: register,
	get_profile: get_profile,
	update_profile: update_profile,
	reset_password: reset_password,
	upload_avatar: upload_avatar,
	mac_login: mac_login,
	mac_register: mac_register,
	mac_email_confirm: mac_email_confirm,
	mac_reset_password: mac_reset_password,
	admin_login: admin_login,
	get_user: get_user,
	get_users: get_users,
	get_plans: get_plans,
	get_notifications: get_notifications,
	update_price: update_price,
	update_userinfo: update_userinfo,
	user_delete: user_delete,
	get_reports: get_reports,
	get_searchUsers: get_searchUsers,
	get_orderUsers: get_orderUsers,
	save_analytic: save_analytic,
	get_analytics: get_analytics,
	update_analytic: update_analytic,
	delete_analytic: delete_analytic,
	get_admins: get_admins,
	new_admin: new_admin,
	update_admin: update_admin,
	delete_admin: delete_admin,
	get_orderAdmins: get_orderAdmins,
	get_settings: get_settings,
	update_settings: update_settings
}