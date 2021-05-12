var user = require('../../module/user');

function login(req, res)
{
	user.login(req.query, function(data) {
		res.send(data);
	})
}

function user_exist(req, res)
{
	user.user_exist(req.query, function(data) {
		res.send(data);
	})
}

function register(req, res)
{
	user.register(req.body, function(data) {
		res.send(data);
	})
}

function get_profile(req, res)
{
	user.get_profile(req.query, function(data) {
		res.send(data);
	})
}

function update_profile(req, res)
{
	user.update_profile(req.body, function(data) {
		res.send(data);
	})
}

function reset_password(req, res)
{
	user.reset_password(req.body, function(data) {
		res.send(data);
	})
}

function upload_avatar(req, res)
{
	user.upload_avatar(req.body, function(data) {
		res.send(data);
	})
}

function mac_login(req, res)
{
	user.mac_login(req.query, function(data) {
		res.send(data);
	})
}

function mac_register(req, res)
{
	user.mac_register(req.query, function(data) {
		res.send(data);
	})
}

function mac_email_confirm(req, res)
{
	user.mac_email_confirm(req.query, function(data) {
		res.send(data);
	})
}

function mac_reset_password(req, res)
{
	user.mac_reset_password(req.query, function(data) {
		res.send(data);
	})
}

function admin_login(req, res)
{
	user.admin_login(req.query, function(data) {
		res.send(data);
	})
}

function get_user(req, res)
{
	user.get_user(req.query, function(data) {
		res.send(data);
	})
}

function get_users(req, res)
{
	user.get_users(req.query, function(data) {
		res.send(data);
	})
}

function get_plans(req, res)
{
	user.get_plans(req.query, function(data) {
		res.send(data);
	})
}

function get_notifications(req, res)
{
	user.get_notifications(req.query, function(data) {
		res.send(data);
	})
}

function update_price(req, res)
{
	user.update_price(req.body, function(data) {
		res.send(data);
	})
}

function update_userinfo(req, res)
{
	user.update_userinfo(req.body, function(data) {
		res.send(data);
	})
}

function user_delete(req, res)
{
	user.user_delete(req.body, function(data) {
		res.send(data);
	})
}

function get_reports(req, res)
{
	user.get_reports(req.query, function(data) {
		res.send(data);
	})
}

function get_searchUsers(req, res)
{
	user.get_searchUsers(req.query, function(data) {
		res.send(data);
	})
}

function get_orderUsers(req, res)
{
	user.get_orderUsers(req.query, function(data) {
		res.send(data);
	})
}

function save_analytic(req, res)
{
	user.save_analytic(req.body, function(data) {
		res.send(data);
	})
}

function get_analytics(req, res)
{
	user.get_analytics(req.query, function(data) {
		res.send(data);
	})
}

function update_analytic(req, res)
{
	user.update_analytic(req.body, function(data) {
		res.send(data);
	})
}

function delete_analytic(req, res)
{
	user.delete_analytic(req.body, function(data) {
		res.send(data);
	})
}

function get_admins(req, res)
{
	user.get_admins(req.query, function(data) {
		res.send(data);
	})
}

function new_admin(req, res)
{
	user.new_admin(req.body, function(data) {
		res.send(data);
	})
}

function update_admin(req, res)
{
	user.update_admin(req.body, function(data) {
		res.send(data);
	})
}

function delete_admin(req, res)
{
	user.delete_admin(req.body, function(data) {
		res.send(data);
	})
}

function get_orderAdmins(req, res)
{
	user.get_orderAdmins(req.query, function(data) {
		res.send(data);
	})
}

function get_settings(req, res)
{
	user.get_settings(req.query, function(data) {
		res.send(data);
	})
}

function update_settings(req, res)
{
	user.update_settings(req.body, function(data) {
		res.send(data);
	})
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