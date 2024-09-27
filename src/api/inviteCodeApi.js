import axios from 'axios';
import { handleApiError } from './apiUtils';

const API_URL = 'http://localhost:3000/api';

export const checkInviteCode = async (inviteCode, type) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-invite`, { inviteCode, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '邀请码验证失败');
  }
};

export const createInviteCode = async (code, name, type) => {
  try {
    const response = await axios.post(`${API_URL}/auth/create-invite`, { code, name, type });
    return response.data;
  } catch (error) {
    throw handleApiError(error, '创建邀请码失败');
  }
};

export const getInviteCodes = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/invite-codes`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '获取邀请码列表失败');
  }
};

export const deleteInviteCode = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/auth/invite-codes/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, '删除邀请码失败');
  }
};

// 其他邀请码相关的 API