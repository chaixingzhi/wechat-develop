'use strict'
var path = require('path')
var wechat_file = path.join(__dirname, './wechat.txt')
var util = require('../libs/util.js')

var config = {
	wechat: {
		"appID": 'wx3d675874cefcd713',
		"appSecret": 'b3ed24c096284fcda20ccba7536f2733',
		'token': 'moviesearch',
		getAccessToken: function() {
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function(data) {
			return util.writeFileAsync(wechat_file, data)
		}
	}
}
module.exports = config