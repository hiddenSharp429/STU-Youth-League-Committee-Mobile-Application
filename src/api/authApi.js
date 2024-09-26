/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-26 20:14:02
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-26 20:26:08
 * @FilePath: /YLC/src/api/authApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const loginUser = async (account, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      account,
      password
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      throw new Error(error.response.data.message || '登录失败');
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      throw new Error('无法连接到服务器');
    } else {
      // 在设置请求时发生了一些错误
      throw new Error('发生错误，请稍后再试');
    }
  }
};

// 你可以在这里添加其他与认证相关的 API 请求函数
// 例如：注册用户、重置密码等