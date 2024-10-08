/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 19:54:41
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 23:16:56
 * @FilePath: /YLC/backend/src/models/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = require('../config/database');

class UserModel {
  static async findByAccount(account) {
    const [rows] = await db.execute('SELECT * FROM users WHERE account = ?', [account]);
    return rows[0];
  }

  static async createUser(account, password, name, type, unrestricted = false) {
    const [result] = await db.execute(
      'INSERT INTO users (account, password, name, type, unrestricted) VALUES (?, ?, ?, ?, ?)',
      [account, password, name, type, unrestricted]
    );
    return { id: result.insertId, account, name, type, unrestricted };
  }

  static async getAllUsers() {
    const [rows] = await db.execute('SELECT id, account, name, type FROM users');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async deleteUser(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = UserModel;