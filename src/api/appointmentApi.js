/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 20:32:38
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-12 01:30:29
 * @FilePath: /YLC/src/api/activityApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import API_URL from './apiConfig';

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

export const getAllAppointments = async (status) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/get/all`, {
        params: status !== undefined ? { status } : {}
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, '获取所有预约信息失败');
    }
};

// src/api/appointmentApi.js

export const approveAppointment = async (appointmentId) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/approve`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '审批预约失败');
  }
};

export const rejectAppointment = async (appointmentId, rejectReason) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}/reject`, { rejectReason });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '驳回预约失败');
  }
};