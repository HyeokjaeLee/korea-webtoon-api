const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 스키마 생성 */
const User = new Schema({
  username: String,
  password: String,
  admin: {type: Boolean, default: false}
});

/* 해당 스키마에 데이터 추가 */
User.statics.create = function(username:any, password:any){
  const user = new this({
    username,
    password
  });
  return user.save();
};

/* 해당 스키마의 데이터 조회 */
User.statics.findOne = function(username:any){
  return this.findOne({
    username
  }).exec();
}

module.exports = mongoose.model('User', User);