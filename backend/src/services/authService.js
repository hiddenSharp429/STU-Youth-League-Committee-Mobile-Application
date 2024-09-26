/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 20:05:14
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-26 20:05:20
 * @FilePath: /YLC/backend/src/services/authService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const UserModel = require('../models/userModel');

class AuthService {
  static async login(account, password) {
    const user = await UserModel.findByAccount(account);

    if (!user || user.password !== password) {
      return { success: false, message: '账号或密码错误' };
    }

    return { success: true, userId: user.id, message: '登录成功' };
  }
}

module.exports = AuthService;