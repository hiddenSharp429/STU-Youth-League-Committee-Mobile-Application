/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-30 04:01:36
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-30 04:29:59
 * @FilePath: /YLC/backend/src/services/appointmentService.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const AppointmentModel = require('../models/appointmentModel');

class AppointmentService {
  static async createAppointment(appointmentData) {
    try {
      const appointmentId = await AppointmentModel.createAppointment(appointmentData);
      return { success: true, message: '预约申请已提交', appointmentId };
    } catch (error) {
      console.error('Create appointment error:', error);
      throw new Error('提交预约申请失败: ' + error.message);
    }
  }

  static async getUserAppointments(userId, status, page, limit) {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || isNaN(limit)) {
      throw new Error('Invalid page or limit');
    }

    const offset = Math.max((page - 1) * limit, 0);
    const appointments = await AppointmentModel.getUserAppointments(userId, status, offset, limit);
    return { appointments };
  }

  static async getUserAppointmentsCount(userId, status) {
    const total = await AppointmentModel.getUserAppointmentsCount(userId, status);
    return { total };
  }

  static async updateAppointment(id, appointmentData) {
    try {
      const updated = await AppointmentModel.updateAppointment(id, appointmentData);
      if (updated) {
        return { success: true, message: '预约状态已更新' };
      } else {
        throw new Error('预约更新失败');
      }
    } catch (error) {
      console.error('Update appointment error:', error);
      throw new Error('更新预约失败: ' + error.message);
    }
  }

  static async getAppointmentById(id) {
    try {
      const appointment = await AppointmentModel.getAppointmentById(id);
      return appointment;
    } catch (error) {
      console.error('Get appointment by id error:', error);
      throw new Error('获取预约详情失败: ' + error.message);
    }
  }

  static async getTeacherAppointments(teacherId, date) {
    try {
      const appointments = await AppointmentModel.getTeacherAppointments(teacherId, date);
      return appointments;
    } catch (error) {
      console.error('Get teacher appointments error:', error);
      throw new Error('获取教师预约信息失败: ' + error.message);
    }
  }
}

module.exports = AppointmentService;