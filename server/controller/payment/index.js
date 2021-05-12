var payment = require('../../module/payment');

function pay(req, res)
{
	payment.pay(req.body, function(data) {
		res.send(data);
	})
}

function cancel(req, res)
{
	payment.cancel(req.body, function(data) {
		res.send(data);
	})
}

function get_state(req, res)
{
	payment.get_state(req.query, function(data) {
		res.send(data);
	})
}

module.exports = {
	pay: pay,
	cancel: cancel,
	get_state: get_state
}