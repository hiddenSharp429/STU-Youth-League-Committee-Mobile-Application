/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 22:31:54
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 14:50:34
 * @FilePath: /YLC/backend/src/models/inviteCodeModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = require('../config/database');

class InviteCodeModel {
  static async isValidInviteCode(inviteCode, type) {
    const [rows] = await db.execute(
      'SELECT * FROM invite_codes WHERE code = ? AND type = ? AND used = 0',
      [inviteCode, type]
    );
    return rows.length > 0;
  }

  static async markInviteCodeAsUsed(inviteCode) {
    await db.execute('UPDATE invite_codes SET used = 1 WHERE code = ?', [inviteCode]);
  }

  static async createInviteCode(code, name, type) {
    await db.execute(
      'INSERT INTO invite_codes (code, name, type, used) VALUES (?, ?, ?, 0)',
      [code, name, type]
    );
    return code;
  }

  static async findByCode(code) {
    const [rows] = await db.execute('SELECT * FROM invite_codes WHERE code = ?', [code]);
    return rows[0];
  }

  static async getAllInviteCodes() {
    const [rows] = await db.execute('SELECT id, code, name, type, used FROM invite_codes');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM invite_codes WHERE id = ?', [id]);
    return rows[0];
  }

  static async deleteInviteCode(id) {
    await db.execute('DELETE FROM invite_codes WHERE id = ?', [id]);
  }
}

module.exports = InviteCodeModel;