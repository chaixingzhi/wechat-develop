'use strict'

var Koa = require('koa')
var verification  = require('./middleWare/verification')
var config = require('./config/config.js')
var wx = require('./libs/wexin.js')

var app = new Koa()
app.use(verification(config, wx.reply))

app.listen(80)
console.log('Listening: 80')