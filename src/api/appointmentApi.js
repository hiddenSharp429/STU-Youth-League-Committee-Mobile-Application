/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:32:38
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-30 12:30:16
 * @FilePath: /YLC/src/api/activityApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import { Platform } from 'react-native';

export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const addAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(`${API_URL}/appointments`, appointmentData);
        return response.data;
    } catch (error) {
        throw handleApiError(error, '提交预约失败');
    }
};

export const getTeacherAppointments = async (teacherId, date) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/teacher/${teacherId}`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, '获取老师预约信息失败');
    }
  };

export const getUserAppointments = async (userId, status, page, limit = 4) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/user/${userId}`, {
        params: { status: status.join(','), page, limit }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, '获取用户预约信息失败');
    }
};

export const getUserAppointmentsCount = async (userId, status) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/user/${userId}/count`, {
        params: { status: status.join(',') }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, '获取用户预约数量失败');
    }
};