/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-27 15:05:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 15:05:35
 * @FilePath: /YLC/src/api/apiUtils.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const handleApiError = (error, defaultMessage) => {
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      throw new Error(error.response.data.message || defaultMessage);
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      throw new Error('无法连接到服务器');
    } else {
      // 在设置请求时发生了一些错误
      throw new Error('发生错误，请稍后再试');
    }
  };