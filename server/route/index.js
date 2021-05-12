var express = require('express');
var route = express.Router();
var user = require('../controller/user');
var page = require('../controller/page');
var payment = require('../controller/payment');
//
function register(req, res)
{
    /************  Web Route  ***********/
    // User Route
    route.get('/user/login', user.login);
    route.get('/user/user_exist', user.user_exist);
    route.post('/user/register', user.register);
    route.get('/user/get_profile', user.get_profile);
    route.put('/user/upload_avatar', user.upload_avatar);
    route.put('/user/update_profile', user.update_profile);
    route.put('/user/reset_password', user.reset_password);
    // Pages Route
    route.post('/page/new_page', page.new_page);
    route.post('/page/new_page_usa', page.new_page_usa);
    route.put('/page/save_page', page.save_page);
    route.get('/page/get_page', page.get_page);
    route.get('/page/get_pages', page.get_pages);
    route.get('/page/get_histories', page.get_histories);
    route.get('/page/get_histories_usa', page.get_histories_usa);
    route.delete('/page/delete_page', page.delete_page);
    route.put('/page/save_name', page.save_name);
    route.put('/page/save_rating', page.save_rating);
    route.put('/page/upload_dealer', page.upload_dealer);
    //payment Route
    route.post('/payment/pay', payment.pay);
    route.post('/payment/cancel', payment.cancel);
    route.get('/payment/get_state', payment.get_state);
    // Video Route
    route.post('/page/new_videoembedcode', page.new_videoembedcode);
    route.get('/page/get_videos', page.get_videos);
    route.get('/page/get_video', page.get_video);
    route.put('/page/update_video', page.update_video);
    route.delete('/page/delete_video', page.delete_video);
    
    /************  App Route  ***********/
    // Pages Route
    route.put('/page/save_page_app', page.save_page_app);
    route.put('/page/save_page_app_usa', page.save_page_app_usa);

    /*************  MacOS Route ******************/
    route.get('/mac_user/login', user.mac_login);
    route.get('/mac_user/register', user.mac_register);
    route.get('/mac_user/email_confirm', user.mac_email_confirm);
    route.get('/mac_user/reset_password', user.mac_reset_password);

    /**************** Admin Route ***************** */
    route.get('/user/admin_login', user.admin_login);
    route.get('/user/get_user', user.get_user);
    route.get('/user/get_users', user.get_users);
    route.get('/user/get_plans', user.get_plans);
    route.get('/user/get_notifications', user.get_notifications);
    route.put('/user/update_price', user.update_price);
    route.put('/user/update_userinfo', user.update_userinfo);
    route.delete('/user/user_delete', user.user_delete);
    route.get('/user/get_reports', user.get_reports);
    route.get('/user/get_searchUsers', user.get_searchUsers);
    route.get('/user/get_orderUsers', user.get_orderUsers);
    route.post('/user/save_analytic', user.save_analytic);
    route.get('/user/get_analytics', user.get_analytics);
    route.put('/user/update_analytic', user.update_analytic);
    route.delete('/user/delete_analytic', user.delete_analytic);
    route.get('/user/get_admins', user.get_admins);
    route.post('/user/new_admin', user.new_admin);
    route.put('/user/update_admin', user.update_admin);
    route.delete('/user/delete_admin', user.delete_admin);
    route.get('/user/get_orderAdmins', user.get_orderAdmins);
    route.get('/user/get_settings', user.get_settings);
    route.put('/user/update_settings', user.update_settings);
}

register();

exports.register = route;