/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 20:05:14
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 14:50:13
 * @FilePath: /YLC/backend/src/services/authService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const UserModel = require('../models/userModel');
const InviteCodeModel = require('../models/inviteCodeModel');

class AuthService {
  static async login(account, password) {
    const user = await UserModel.findByAccount(account);

    if (!user || user.password !== password) {
      return { success: false, message: '账号或密码错误' };
    }

    return { success: true, userId: user.id, message: '登录成功' };
  }

  static async checkInviteCode(inviteCode, type) {
    const isValid = await InviteCodeModel.isValidInviteCode(inviteCode, type);
    if (!isValid) {
      throw new Error('邀请码无效或已使用');
    }
    return { success: true, message: '邀请码有效' };
  }

  static async register(account, password, name, type, inviteCode) {
    const existingUser = await UserModel.findByAccount(account);
    if (existingUser) {
      throw new Error('账号已存在');
    }

    const isValidInviteCode = await InviteCodeModel.isValidInviteCode(inviteCode, type);
    if (!isValidInviteCode) {
      throw new Error('邀请码无效或已使用');
    }

    const newUser = await UserModel.createUser(account, password, name, type);
    await InviteCodeModel.markInviteCodeAsUsed(inviteCode);

    return { success: true, userId: newUser.id, message: '注册成功' };
  }

  static async createInviteCode(code, name, type) {
    // 首先检查邀请码是否已存在
    const existingCode = await InviteCodeModel.findByCode(code);
    if (existingCode) {
      throw new Error('邀请码已存在');
    }

    await InviteCodeModel.createInviteCode(code, name, type);
    return { success: true, inviteCode: code, message: '邀请码创建成功' };
  }

  static async getUsers() {
    return await UserModel.getAllUsers();
  }

  static async deleteUser(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('用户不存在');
    }
    await UserModel.deleteUser(id);
  }

  static async getInviteCodes() {
    return await InviteCodeModel.getAllInviteCodes();
  }

  static async deleteInviteCode(id) {
    const inviteCode = await InviteCodeModel.findById(id);
    if (!inviteCode) {
      throw new Error('邀请码不存在');
    }
    await InviteCodeModel.deleteInviteCode(id);
  }
}

module.exports = AuthService;