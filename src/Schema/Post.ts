const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* 스키마 생성 */
/*const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});*/
const Post = new Schema({
  index: Number,
  title: String,
  content: String,
});

/* 해당 스키마에 데이터 추가 */
Post.statics.create = function (index: number, title: string) {
  const user = new this({
    index,
    title,
  });
  return user.save();
};

/* 해당 스키마의 데이터 조회 */
Post.statics.findOne = function (index: any) {
  return this.findOne({
    index,
  }).exec();
};

module.exports = mongoose.model("Post", Post);
