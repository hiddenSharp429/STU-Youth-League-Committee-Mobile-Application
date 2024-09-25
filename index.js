/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-24 11:58:33
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-25 23:54:41
 * @FilePath: /YLC/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE%E5%8E%9F%E5%9B%9E
 */
/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';

console.log('App name:', appName);
console.log('App component:', App);

if (module.hot) {
  module.hot.accept();
}

LogBox.ignoreLogs([
  'Warning: Overlay: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.',
]);

AppRegistry.registerComponent(appName, () => App);
