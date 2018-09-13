'use strict'
var path = require('path')
var wechat_file = path.join(__dirname, './wechat.txt')

var util = require('../libs/util.js')


var config = {
	wechat: {
		"appID": 'wx75a92f4137695073',
		"appSecret": '3f49c182d1ffb2cbff292839393f5cb2',
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
