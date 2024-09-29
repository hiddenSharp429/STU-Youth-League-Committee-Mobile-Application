/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-30 04:02:05
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-30 04:37:33
 * @FilePath: /YLC/backend/src/controllers/appointmentController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const AppointmentService = require('../services/appointmentService');

class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      const result = await AppointmentService.createAppointment(appointmentData);
      res.json(result);
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUserAppointments(req, res) {
    try {
      const { userId } = req.params;
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
      const status = parseInt(req.query.status, 10);

      if (isNaN(page) || isNaN(limit) || isNaN(status)) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
      }

      const result = await AppointmentService.getUserAppointments(userId, status, page, limit);
      res.json(result);
    } catch (error) {
      console.error('Get user appointments error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUserAppointmentsCount(req, res) {
    try {
      const { userId } = req.params;
      const status = parseInt(req.query.status, 10);

      if (isNaN(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const result = await AppointmentService.getUserAppointmentsCount(userId, status);
      res.json(result);
    } catch (error) {
      console.error('Get user appointments count error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointmentData = req.body;
      const result = await AppointmentService.updateAppointment(id, appointmentData);
      res.json(result);
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentService.getAppointmentById(id);
      res.json(appointment);
    } catch (error) {
      console.error('Get appointment by id error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getTeacherAppointments(req, res) {
    try {
      const { teacherId } = req.params;
      const { date } = req.query;

      if (!teacherId || !date) {
        return res.status(400).json({ success: false, message: 'Teacher ID and date are required' });
      }

      const appointments = await AppointmentService.getTeacherAppointments(teacherId, date);
      res.json(appointments);
    } catch (error) {
      console.error('Get teacher appointments error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = AppointmentController;