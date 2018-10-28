'use strict'


var fs = require('fs')
var Promise = require('bluebird')
var xml2js = require('xml2js')
var { compiled } = require('./tpl.js')

exports.readFileAsync = function(fpath, encoding) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fpath, encoding, function(err, content) {
			if (err) {
				reject(err)
			} else {
				resolve(content)
			}
		})
	})
}

exports.writeFileAsync = function(fpath, content) {
	console.log('content:', content)
	return new Promise(function(resolve, reject) {
		fs.writeFile(fpath, content, function(err) {
			if (err) {
				reject(err)
			} else {
				resolve(content)
			}
		})
	})
}
exports.formatMessage = function (result) {
	var message = {}
	if (typeof result === 'object') {
		var keys = Object.keys(result)
		for (var i = 0; i < keys.length; i++) {
			var item = result[keys[i]]
			var key = keys[i]
			if (!(item instanceof Array) || item.length === 0) {
				continue
			} 
			if (item.length === 1) {
				var val = item[0]
				if (typeof val === 'object') {
					message[key] = formatMessage(val)
				} else {
					message[key] = (val || '').trim()
				}
			} else {
				message[key] = []
				for(var j = 0, k = item.length; j< k; j++) {
					message[key].push(formatMessage(item[j]))
				}
			}
		}
	}
	return message
}
exports.parseXMLAsync = function(xml) {
	return new Promise(function(resolve, reject) {
		xml2js.parseString(xml, {trim: true}, function(err, content) {
			if (err) {
				reject(err)
			} else {
				resolve(content)
			}
		})
	})
}

exports.tpl = function(content, message) {
	var info = {}
	let type = 'text'
	var FromUserName = message.FromUserName
	var ToUserName = message.ToUserName

	if (Array.isArray(content)) {
		type = 'news'
	}
	console.log('content: ', content);
	console.log('message: ', message);
	type = content.type || type
	info.content = content
	info.CreateTime = new Date().getTime()
	// info.MsgType = type
	info.MsgType = 'text'
	console.log('info.MsgType: ', info.MsgType)
	info.ToUserName = FromUserName
	info.FromUserName = ToUserName

	return compiled(info)
}
