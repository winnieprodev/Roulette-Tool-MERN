var page = require('../../module/page');

function new_page(req, res)
{
	page.new_page(req.body, function(data) {
		res.send(data);
	})
}

function new_page_usa(req, res)
{
	page.new_page_usa(req.body, function(data) {
		res.send(data);
	})
}

function save_page(req, res)
{
	page.save_page(req.body, function(data) {
		res.send(data);
	})
}

function get_page(req, res)
{
	page.get_page(req.query, function(data) {
		res.send(data);
	})
}

function get_pages(req, res)
{
	page.get_pages(req.query, function(data) {
		res.send(data);
	})
}

function get_histories(req, res)
{
	page.get_histories(req.query, function(data) {
		res.send(data);
	})
}

function get_histories_usa(req, res)
{
	page.get_histories_usa(req.query, function(data) {
		res.send(data);
	})
}

function delete_page(req, res)
{
	page.delete_page(req.body, function(data) {
		res.send(data);
	})
}

function save_name(req, res)
{
	page.save_name(req.body, function(data) {
		res.send(data);
	})
}

function save_rating(req, res)
{
	page.save_rating(req.body, function(data) {
		res.send(data);
	})
}

function upload_dealer(req, res)
{
	page.upload_dealer(req.body, function(data) {
		res.send(data);
	})
}

function save_page_app(req, res)
{
	page.save_page_app(req.body, function(data) {
		res.send(data);
	})
}

function save_page_app_usa(req, res)
{
	page.save_page_app_usa(req.body, function(data) {
		res.send(data);
	})
}

// Video Embed

function new_videoembedcode(req, res)
{
	page.new_videoembedcode(req.body, function(data) {
		res.send(data);
	})
}

function get_videos(req, res)
{
	page.get_videos(req.query, function(data) {
		res.send(data);
	})
}

function get_video(req, res)
{
	page.get_video(req.query, function(data) {
		res.send(data);
	})
}

function update_video(req, res)
{
	page.update_video(req.body, function(data) {
		res.send(data);
	})
}

function delete_video(req, res)
{
	page.delete_video(req.body, function(data) {
		res.send(data);
	})
}

module.exports = {
	new_page: new_page,
	new_page_usa: new_page_usa,
	save_page: save_page,
	get_page: get_page,
	get_pages: get_pages,
	get_histories: get_histories,
	get_histories_usa: get_histories_usa,
	delete_page: delete_page,
	save_name: save_name,
	save_rating: save_rating,
	upload_dealer: upload_dealer,
	//
	save_page_app: save_page_app,
	save_page_app_usa: save_page_app_usa,
	//
	new_videoembedcode: new_videoembedcode,
	get_videos: get_videos,
	get_video: get_video,
	update_video: update_video,
	delete_video: delete_video
}