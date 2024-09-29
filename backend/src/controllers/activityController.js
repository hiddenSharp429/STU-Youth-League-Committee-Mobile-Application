/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:36:50
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-29 16:09:13
 * @FilePath: /YLC/backend/src/controllers/activityController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ActivityService = require('../services/activityService');
const path = require('path');
const fs = require('fs');

class ActivityController {
  static async createActivity(req, res) {
    try {
      const activityData = req.body;
      const result = await ActivityService.createActivity(activityData);
      res.json(result);
    } catch (error) {
      console.error('Create activity error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUserActivities(req, res) {
    try {
      const { userId } = req.params;
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1); // 确保页码至少为 1
      const limit = Math.max(parseInt(req.query.limit, 10) || 4, 1);
      const status = req.query.status.split(',').map(Number);
      if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ success: false, message: 'Invalid page or limit' });
      }

      const result = await ActivityService.getUserActivities(userId, status, page, limit);
      res.json(result);
    } catch (error) {
      console.error('Get user activities error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUserActivitiesCount(req, res) {
    try {
      const { userId } = req.params;
      const status = req.query.status.split(',').map(Number);
      const result = await ActivityService.getUserActivitiesCount(userId, status);
      res.json(result);
    } catch (error) {
      console.error('Get user activities count error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateActivity(req, res) {
    try {
      const { id } = req.params;
      const activityData = req.body;
      const result = await ActivityService.updateActivity(id, activityData);
      res.json(result);
    } catch (error) {
      console.error('Update activity error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  
  static async getActivityById(req, res) {
    try {
      const { id } = req.params;
      const activity = await ActivityService.getActivityById(id);
      res.json(activity);
    } catch (error) {
      console.error('Get activity by id error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: '没有文件上传' });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.json({ success: true, fileUrl });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ success: false, message: '文件上传失败' });
    }
  }
}

module.exports = ActivityController;