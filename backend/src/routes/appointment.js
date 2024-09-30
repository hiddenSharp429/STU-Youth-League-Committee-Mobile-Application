/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-30 04:04:57
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-30 12:31:03
 * @FilePath: /YLC/backend/src/routes/appointment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

router.post('/', AppointmentController.createAppointment);
router.get('/:userId', AppointmentController.getUserAppointments);
router.get('/:userId/count', AppointmentController.getUserAppointmentsCount);
router.put('/:id', AppointmentController.updateAppointment);
router.get('/:id', AppointmentController.getAppointmentById);
router.get('/teacher/:teacherId', AppointmentController.getTeacherAppointments);
router.get('/user/:userId', AppointmentController.getUserAppointments);
router.get('/user/:userId/count', AppointmentController.getUserAppointmentsCount);

module.exports = router;