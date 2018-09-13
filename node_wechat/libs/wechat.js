'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var {tpl} = require('./util')

var prefix = 'https://api.weixin.qq.com/cgi-bin/token?'
var api = {
	accessToken: prefix + 'grant_type=client_credential' 
}

function Wechat(opts) {
	var that = this
	console.log('this', this)
	this.appID = opts.appID
	this.appSecret = opts.appSecret
	this.getAccessToken = opts.getAccessToken
	this.saveAccessToken = opts.saveAccessToken

	this.getAccessToken() // 获取票据，返回一个Promise
		.then(function(data) {
			try {
				data = JSON.parse(data)
			} catch(e) {
				return that.updateAccessToken() // 更新票据
			}
			if (that.isValidAccessToken(data)) { // 判断票据是否合法
				return Promise.resolve(data) // 把合法票据传出
			} else {
				return that.updateAccessToken()
			}
		})

		.then(function(data) {
			console.log(1,data)
			that.access_token = data.access_token
			that.expires_in = data.expires_in
			var result = JSON.stringify(data)
			that.saveAccessToken(result) // 保存票据
		})
}


Wechat.prototype.isValidAccessToken = function (data) {
	if (!data || !data.access_token || !data.expires_in) {
		return false
	}

	var access_token = data.access_token
	var expires_in = data.expires_in
	var now = (new Date().getTime())

	if (now < expires_in) {
		return true
	} else {
		return false
	}
}

Wechat.prototype.updateAccessToken = function() {
	var appID = this.appID
	var appSecret = this.appSecret
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
	console.log('url: ', url)

	return new Promise(function(resolve, reject) {
		request(url, {json: true}).then(function(response) {
			console.log('response: ', response.body)
			var data = response.body
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in - 20) * 1000
			data.expires_in = expires_in
			resolve(data)
		})
	})
}

Wechat.prototype.reply = function() {
	var content = this.body
	var message = this.wexin.message
	console.log('this.wexin',this.wexin);
	var xml = tpl(content, message)
	this.status = 200
	this.type = 'application/xml'
	this.body = xml
}

module.exports = Wechat
