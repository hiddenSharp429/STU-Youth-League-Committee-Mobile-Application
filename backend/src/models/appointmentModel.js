/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-30 04:01:05
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-01 13:15:27
 * @FilePath: /YLC/backend/src/models/appointmentModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const db = require('../config/database');

class AppointmentModel {
  static async createAppointment(appointmentData) {
    const {
      userId, organization, organizationId, teacher, teacherId,
      appointmentDate, appointmentTime, appointmentForm, content,
      subscriber, subscriberPhone
    } = appointmentData;

    const formattedDate = new Date(appointmentDate).toISOString().slice(0, 10);

    const query = `INSERT INTO appointments 
      (userId, organization, organizationId, teacher, teacherId, 
       appointmentDate, appointmentTime, appointmentForm, content, 
       subscriber, subscriberPhone) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      userId, organization, organizationId, teacher, teacherId,
      formattedDate, appointmentTime, appointmentForm, content,
      subscriber, subscriberPhone
    ];

    const [result] = await db.execute(query, values);
    return result.insertId;
  }

  static async getUserAppointments(userId, status, offset, limit) {
    // 确保 offset 和 limit 是数字
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    
    // status为数组，获取status最大值和最小值
    const maxStatus = Math.max(...status);
    const minStatus = Math.min(...status);
    
    // 添加一些错误检查
    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0) {
      throw new Error('Invalid offset or limit');
    }
    
    // 首先获取总记录数
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE userId = ?',
      [userId]
    );
    const total = countResult[0].total;
        
    // 如果没有记录，直接返回空数组
    if (total === 0) {
      return [];
    }

    const query = `SELECT * FROM appointments 
      WHERE userId = ? AND status >= ? AND status <= ?
      ORDER BY appointmentDate DESC, appointmentTime DESC 
      LIMIT ${limit} OFFSET ${offset}`;
    
    const [rows] = await db.execute(query, [userId, minStatus, maxStatus, limit, offset]);
    return rows;
  }

  static async getUserAppointmentsCount(userId, status) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) as total FROM appointments WHERE userId = ? AND status = ?',
      [userId, status]
    );
    return rows[0].total;
  }

  static async updateAppointment(id, appointmentData) {
    const { status, rejectReason } = appointmentData;
    let query = 'UPDATE appointments SET status = ?';
    let params = [status, id];

    if (rejectReason) {
      query += ', rejectReason = ?';
      params.splice(1, 0, rejectReason);
    }

    query += ' WHERE id = ?';

    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  }

  static async getAppointmentById(id) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('Appointment not found');
    }
    return rows[0];
  }

  static async getTeacherAppointments(teacherId, date) {
    const query = `
      SELECT appointmentTime 
      FROM appointments 
      WHERE teacherId = ? AND appointmentDate = ? AND status != 2
    `;
    const [rows] = await db.execute(query, [teacherId, date]);
    return rows.map(row => row.appointmentTime.slice(0, 5)); // 只返回小时和分钟
  }

  static async getAllAppointments(status) {
    let query = 'SELECT * FROM appointments';
    let params = [];
    if (status !== null) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    const [rows] = await db.execute(query, params);
    return rows;
  }
}

module.exports = AppointmentModel;