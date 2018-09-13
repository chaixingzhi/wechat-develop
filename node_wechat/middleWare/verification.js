var sha1 = require('sha1')

var Wechat =  require('../libs/wechat.js')

var getRawBody = require('raw-body')
var { parseXMLAsync, formatMessage } = require('../libs/util')
 
console.log('wechat: ', Wechat.prototype)
module.exports = function(opts, handler) {
	let wechat = new Wechat(opts['wechat'])

	return function *(next) {
		console.log(this.query)
		var that  = this
		var token = opts.wechat.token
		var signature = this.query.signature
		var nonce = this.query.nonce
		var echostr = this.query.echostr
		var timestamp = this.query.timestamp
		var str = [token, timestamp, nonce].sort().join('')
		var sha = sha1(str)

		if (this.method === 'GET') {

			if (sha === signature) {
				this.body = echostr + ''
			} else {
				this.body = 'wrong';
			}

		} else if (this.method === 'POST') {

			if (sha !== signature) {
				this.body = 'wrong';
				return false;
			}

			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			})

			console.log('data: ', data)

			var content = yield parseXMLAsync(data)
			console.log('content: ', content)
			var message = formatMessage(content.xml)
			console.log('消息是：', message);
			this.wexin = {message}
			console.log('Wechat.reply', wechat.reply)
			console.log('next',next);
			yield handler.call(this, next)
			console.log('this.body:',this.body)
			wechat.reply.call(this)

		}
		
	}
}
