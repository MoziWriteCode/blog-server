/*
 * @Author: Yuanxinfeng
 * @Date: 2018-08-14 17:42:19
 * @Last Modified by: Yuanxinfeng
 * @Last Modified time: 2018-09-05 19:59:39
 */

const jwt = require("jsonwebtoken");
const { JWT_ADD_STR, URL_NO_PASS, URL_YES_PASS } = require("./config");
const User = require("../db").User;

function handle_401_error(opt) {
  let { ctx, msg = "你还没有登录，请先去登录!" } = opt;
  ctx.body = {
    code: 401,
    msg: msg
  };
}

module.exports = {
  create_token(user_id) {
    return jwt.sign(
      {
        user_id
      },
      JWT_ADD_STR,
      {
        expiresIn: "1h"
      }
    );
  },
  async check_token(ctx, next) {
    let url = ctx.url;
    if (
      (ctx.method != "GET" || URL_NO_PASS.includes(url)) &&
      !URL_YES_PASS.includes(url)
    ) {
      let token = ctx.get("Authorization");
      if (token == "") {
        handle_401_error({ ctx });
        return;
      }
      try {
        // 验证token是否过期
        let { user_id = "" } = await jwt.verify(token, JWT_ADD_STR);
        // 验证token与账号是否匹配
        let res = await User.find({ user_id, token });
        if (res.length == 0) {
          handle_401_error({ ctx, msg: "登录已过期，请重新登录!!!" });
          return;
        }
      } catch (e) {
        console.log(e);
        handle_401_error({ ctx, msg: "登录已过期，请重新登录!!" });
        return;
      }
    }
    await next();
  },
  async check_token_code(token) {
    try {
      await jwt.verify(token, JWT_ADD_STR);
    } catch (e) {
      // console.log(e);
      return false;
    }
    return true;
  },
  // 判断是后台还是前台请求
  async judge_source(ctx) {
    let token = ctx.get("Authorization");
    if (token == "") {
      return false;
    }
    try {
      let { user_id = "" } = await jwt.verify(token, JWT_ADD_STR);
      let res = await User.find({ user_id, token });
      if (res.length == 0) {
        return false;
      }
    } catch (e) {
      console.log(e);
      handle_401_error({ ctx, msg: "登录已过期，请重新登录!" });
      return false;
    }
    return true;
  }
};
