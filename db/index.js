const mongoose = require("mongoose");
const db = mongoose.connect(
  "mongodb://localhost:27777/blog",
  { useNewUrlParser: true },
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Connection success!");
    }
  }
);
const Schema = mongoose.Schema;

// 文章表
let articleSchema = new Schema({
  article_title: String,
  article_tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Tag"
    }
  ],
  article_create_time: { type: String, default: Date.now },
  article_update_time: { type: String, default: Date.now },
  article_state: {
    type: Number,
    defaule: 1 // 0 => draft  1=> published
  },
  article_cover: String,
  article_desc: String,
  article_ready: {
    type: Number,
    defaule: 0
  },
  article_content: String,
  article_markdown: String,
  article_html: String
});

// 标签表
let TagsSchema = new Schema({
  tags_name: String,
  tags_desc: String
});

// 作品表
let worksSchema = new Schema({
  works_name: String,
  works_desc: String,
  works_time: String,
  works_website: String,
  works_cover: String
});

// 管理员表
let UserSchema = new Schema({
  user_name: String,
  user_id: String,
  user_pwd: String,
  token: {
    type: String,
    default: ""
  }
});

// 全局设置表
let settingSchema = new Schema({
  myInfo: {
    about_me_page: String
  },
  website_cover: {
    home: String,
    production: String,
    archives: String,
    about: String
  },
  qiniu: {
    ACCESS_KEY: String,
    SECRET_KEY: String,
    BUCKET: String
  },
  other: {
    ICP: String,
    blog_website: String
  }
});

// 验证码
let checkcodeSchema = new Schema({
  token: String,
  code: String
});

// 验证码
let blogCreateTimeSchema = new Schema({
  create_time: String
});

// 上传文件
let fileSchema = new Schema({
  file_path: String,
  file_url: String,
  file_dir: String
});
exports.Article = mongoose.model("Article", articleSchema);
exports.Tag = mongoose.model("Tag", TagsSchema);
exports.Work = mongoose.model("Work", worksSchema);
exports.User = mongoose.model("User", UserSchema);
exports.Setting = mongoose.model("Setting", settingSchema);
exports.Checkcode = mongoose.model("Checkcode", checkcodeSchema);
exports.blogCreateTime = mongoose.model("blogCreateTime", blogCreateTimeSchema);
exports.File = mongoose.model("fileSchema", fileSchema);
