var mysql = require('mysql');
// var dataconfig = require('../../config/database.json');
// var conn = mysql.createConnection(dataconfig);
require('custom-env').env('staging')
var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

function new_page(data, callback)
{
	conn.query('INSERT INTO pages(user_id) VALUES(' + data.user_id + ')', function(err, row) {
        if (!err) {
            conn.query('SELECT * FROM pages WHERE id = (SELECT MAX(id) FROM pages WHERE user_id = ' + data.user_id + ')', function(err, row) {
                if (!err) {
                    callback({ success: true, pageinfo: row[0] });
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

function new_page_usa(data, callback)
{
	conn.query('INSERT INTO pages_usa(user_id) VALUES(' + data.user_id + ')', function(err, row) {
        if (!err) {
            conn.query('SELECT * FROM pages_usa WHERE id = (SELECT MAX(id) FROM pages_usa WHERE user_id = ' + data.user_id + ')', function(err, row) {
                if (!err) {
                    callback({ success: true, pageinfo: row[0] });
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

function save_page(data, callback)
{
    var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
            if (item != 'dev') {
                data[item] = '"' + JSON.stringify(data[item]) + '"';
            }
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
        }
    }
    
    conn.query('UPDATE pages SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function get_page(data, callback)
{
	conn.query('SELECT * FROM pages WHERE id = ' + data.page_id, function(err, row) {
        if (!err) {
            callback({ success: true, historyinfo: row[0] });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function get_pages(data, callback)
{
    user_status(data, function(user_info) {
        if (user_info['subscription'] > 1) {
            if (user_info['expired_status']) {
                conn.query('SELECT * FROM pages WHERE (casino_name LIKE "%' + data.search_key + '%" OR dealer_name LIKE "%' + data.search_key + '%") AND user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            } else {
                conn.query('SELECT * FROM pages WHERE ((casino_name LIKE "%' + data.search_key + '%" OR dealer_name LIKE "%' + data.search_key + '%") AND dev = ' + data.dev + ') AND user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            }
        } else {
            conn.query('SELECT * FROM pages WHERE ((casino_name LIKE "%' + data.search_key + '%" OR dealer_name LIKE "%' + data.search_key + '%") AND dev = ' + data.dev + ') AND user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                if (!err) {
                    callback({ success: true, historyinfo: row });
                } else {
                    console.log(err);
                    callback({ success: false });
                }
            });
        }
    });
}

function get_histories(data, callback)
{
    user_status(data, function(user_info) {
        if (user_info['subscription'] > 1) {
            if (user_info['expired_status']) {
                conn.query('SELECT * FROM pages WHERE user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            } else {
                conn.query('SELECT * FROM pages WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            }
        } else {
            conn.query('SELECT * FROM pages WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                if (!err) {
                    callback({ success: true, historyinfo: row });
                } else {
                    console.log(err);
                    callback({ success: false });
                }
            });
        }
    });
}

function get_histories_usa(data, callback)
{
    user_status(data, function(user_info) {
        if (user_info['subscription'] > 1) {
            if (user_info['expired_status']) {
                conn.query('SELECT * FROM pages_usa WHERE user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            } else {
                conn.query('SELECT * FROM pages_usa WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                    if (!err) {
                        callback({ success: true, historyinfo: row });
                    } else {
                        console.log(err);
                        callback({ success: false });
                    }
                });
            }
        } else {
            conn.query('SELECT * FROM pages_usa WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                if (!err) {
                    callback({ success: true, historyinfo: row });
                } else {
                    console.log(err);
                    callback({ success: false });
                }
            });
        }
    });
}

function delete_page(data, callback)
{
	conn.query('DELETE FROM pages WHERE id = ' + data.page_id, function(err, row) {
        if (!err) {
            user_status(data, function(user_info) {
                if (user_info['subscription'] > 1) {
                    if (user_info['expired_status']) {
                        conn.query('SELECT * FROM pages WHERE user_id = ' + data.user_id + ' ORDER BY created_at DESC', function(err, row) {
                            if (!err) {
                                callback({ success: true, historyinfo: row });
                            } else {
                                console.log(err);
                                callback({ success: false });
                            }
                        });
                    } else {
                        conn.query('SELECT * FROM pages WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                            if (!err) {
                                callback({ success: true, historyinfo: row });
                            } else {
                                console.log(err);
                                callback({ success: false });
                            }
                        });
                    }
                } else {
                    conn.query('SELECT * FROM pages WHERE (user_id = ' + data.user_id + ' AND dev = ' + data.dev + ') ORDER BY created_at DESC', function(err, row) {
                        if (!err) {
                            callback({ success: true, historyinfo: row });
                        } else {
                            console.log(err);
                            callback({ success: false });
                        }
                    });
                }
            });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function save_name(data, callback)
{
    var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
            data[item] = JSON.stringify(data[item]);
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
        }
    }
    
    conn.query('UPDATE pages SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function save_rating(data, callback)
{
    var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
        }
    }
    
    conn.query('UPDATE pages SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function upload_dealer(data, callback)
{
	var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
			data[item] = JSON.stringify(data[item]);
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
		}
    }
    
    conn.query('UPDATE pages SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function save_page_app(data, callback)
{
    var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
            if(Array.isArray(data[item]))
            {
                data[item] = JSON.stringify(data[item]);    
            }
            
            if(item != 'dev')
            {
                data[item] = '"' + data[item] + '"';
            }
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
        }
    }
    
    conn.query('UPDATE pages SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function save_page_app_usa(data, callback)
{
    var updatedata = [];

    for (var item in data) {
        if (item != 'page_id') {
            if(Array.isArray(data[item]))
            {
                data[item] = JSON.stringify(data[item]);    
            }
            
            if(item != 'dev')
            {
                data[item] = '"' + data[item] + '"';
            }
            updatedata.push(item + '=' + data[item]);
        } else {
            var page_id = data[item];
        }
    }
    
    conn.query('UPDATE pages_usa SET ' + updatedata.join(',') + ' WHERE id = ' + page_id, function(err, row) {
        if (!err) {
            callback({ success: true });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function user_status(res, callback)
{
	conn.query('SELECT * FROM users WHERE id = ' + res.user_id, function(err, row) {
        if(!err) {
            if (row[0].subscription > 1) {
                const expired_at = new Date(row[0]['expired_at']);
                const now_date = new Date()
                const diffTime = expired_at - now_date;
                if (diffTime <= 0) {
                    callback({ subscription: row[0].subscription, expired_status: false });
                } else {
                    callback({ subscription: row[0].subscription, expired_status: true });
                }
            } else {
                callback({ subscription: row[0].subscription, expired_status: false });
            }
        } else {
			console.log(err);
			callback({ success: false });
		}
	});
}

function new_videoembedcode(data, callback)
{
    var field = [];
	var value = [];
    for (var item in data) {
        if (item != 'user_id' || item != 'category') {
			data[item] = JSON.stringify(data[item]);
		}

        field.push(item);
        value.push(data[item]);
    }
    
	conn.query('INSERT INTO videos(' + field.join(',') + ') VALUES(' + value.join(',') + ')', function(err, row) {
        if (!err) {
            conn.query('SELECT videos.*, users.username AS username, users.avatar AS avatar FROM videos, users WHERE videos.user_id = users.id AND videos.active = 1', function(err, row) {
                if (!err) {
                    callback({ success: true, videos: row });
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

function get_videos(data, callback)
{
    conn.query('SELECT videos.*, users.username AS username, users.avatar AS avatar FROM videos, users WHERE videos.user_id = users.id AND videos.active = ' + data.active + ' ORDER BY created_at DESC', function(err, row) {
        if (!err) {
            callback({ success: true, videos: row });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function get_video(data, callback)
{
    conn.query('SELECT videos.*, users.username AS username, users.avatar AS avatar FROM videos, users WHERE videos.user_id = users.id AND videos.id = ' + data.id + ' ORDER BY created_at DESC', function(err, row) {
        if (!err) {
            callback({ success: true, videos: row });
        } else {
            console.log(err);
            callback({ success: false });
        }
    });
}

function update_video(data, callback)
{
	var updatedata = [];

	for (var item in data) {
        if (item != 'id') {
            if (item != 'active' || item != 'category' || item != 'user_id') {
                if (item == 'likes') {
                    data[item] = '"' + JSON.stringify(data[item]) + '"';
                } else {
                    data[item] = JSON.stringify(data[item]);
                }
            }
            updatedata.push(item + '=' + data[item]);
        } else {
            var id = data[item];
        }
	}
    
	conn.query('UPDATE videos SET ' + updatedata.join(',') + ' WHERE id = ' + id, function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
}

function delete_video(data, callback)
{
	conn.query('DELETE FROM videos WHERE id = ' + data.id, function(err, row) {
		if (!err) {
			callback({ success: true });
		} else {
			console.log(err);
			callback({ success: false, message: 'Server Error' });
		}
	});
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