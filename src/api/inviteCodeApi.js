/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 15:04:33
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-28 23:15:39
 * @FilePath: /YLC/src/api/inviteCodeApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { handleApiError } from './apiUtils';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const checkInviteCode = async (inviteCode, type) => {
  try {
    const response = await axios.post(`${API_URL}/invite-codes/check`, { inviteCode, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '邀请码验证失败');
  }
};

export const createInviteCode = async (code, name, type) => {
  try {
    const response = await axios.post(`${API_URL}/invite-codes`, { code, name, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '创建邀请码失败');
  }
};

export const getInviteCodes = async () => {
  try {
    const response = await axios.get(`${API_URL}/invite-codes`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取邀请码列表失败');
  }
};

export const deleteInviteCode = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/invite-codes/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '删除邀请码失败');
  }
};

// 其他邀请码相关的 API