"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* 스키마 생성 */
var User = new Schema({
    username: String,
    password: String,
    admin: { type: Boolean, default: false }
});
/* 해당 스키마에 데이터 추가 */
User.statics.create = function (username, password) {
    var user = new this({
        username: username,
        password: password
    });
    return user.save();
};
/* 해당 스키마의 데이터 조회 */
User.statics.findOne = function (username) {
    return this.findOne({
        username: username
    }).exec();
};
module.exports = mongoose.model('User', User);
