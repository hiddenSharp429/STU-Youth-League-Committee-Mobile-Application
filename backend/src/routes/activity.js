/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:46:06
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-05 00:00:44
 * @FilePath: /YLC/backend/src/routes/activity.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', activityController.createActivity);
router.get('/:userId', activityController.getUserActivities);
router.get('/:userId/count', activityController.getUserActivitiesCount);
router.put('/:id', activityController.updateActivity);
router.get('/single/:id', activityController.getActivityById);
router.post('/upload', upload.single('file'), activityController.uploadFile);
router.get('/get/all', activityController.getAllActivities);
router.put('/:id/approve', activityController.approveActivity);
router.put('/:id/reject', activityController.rejectActivity);

module.exports = router;