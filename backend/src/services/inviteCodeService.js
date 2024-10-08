/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 21:22:21
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 23:42:34
 * @FilePath: /YLC/backend/src/services/inviteCodeService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const InviteCodeModel = require('../models/inviteCodeModel');

class InviteCodeService {
  static async checkInviteCode(inviteCode, type) {
    const inviteCodeInfo = await InviteCodeModel.getInviteCodeInfo(inviteCode);
    if (!inviteCodeInfo) {
      throw new Error('邀请码不存在');
    }
    const isVip = inviteCodeInfo.type === 3;
    const isValid = await InviteCodeModel.isValidInviteCode(inviteCode, isVip ? 3 : type);
    if (!isValid) {
      throw new Error('邀请码无效或已使用');
    }
    return { success: true, message: '邀请码有效', isVip: isVip };
  }

  static async createInviteCode(code, name, type) {
    const existingCode = await InviteCodeModel.findByCode(code);
    if (existingCode) {
      throw new Error('邀请码已存在');
    }
    await InviteCodeModel.createInviteCode(code, name, type);
    return { success: true, inviteCode: code, message: '邀请码创建成功' };
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

module.exports = InviteCodeService;