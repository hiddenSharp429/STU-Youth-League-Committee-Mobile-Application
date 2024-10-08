/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 20:05:14
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 23:18:35
 * @FilePath: /YLC/backend/src/services/authService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const UserModel = require('../models/userModel');
const InviteCodeModel = require('../models/inviteCodeModel');

class AuthService {
  static async login(account, password, type) {
    const user = await UserModel.findByAccount(account);

    if (!user || user.password !== password || user.type !== type) {
      return { success: false, message: '账号或密码错误' };
    }

    return { success: true, userId: user.id, message: '登录成功' };
  }


  static async register(account, password, name, type, inviteCode) {
    const existingUser = await UserModel.findByAccount(account);
    if (existingUser) {
      throw new Error('账号已存在');
    }

    const inviteCodeInfo = await InviteCodeModel.getInviteCodeInfo(inviteCode);
    if (!inviteCodeInfo || inviteCodeInfo.type !== type) {
      throw new Error('邀请码无效或已使用');
    }

    const isVip = inviteCodeInfo.type === 3;
    const newUser = await UserModel.createUser(account, password, name, isVip ? 0 : type, isVip);
    await InviteCodeModel.markInviteCodeAsUsed(inviteCode);

    return { success: true, userId: newUser.id, message: '注册成功', isVip };
  }

}

module.exports = AuthService;