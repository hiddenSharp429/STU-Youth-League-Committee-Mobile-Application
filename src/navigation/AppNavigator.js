/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-24 21:47:28
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-09-27 07:51:32
 * @FilePath: /YLC/src/navigation/AppNavigator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChoiceScreens from '../screens/ChoicePage';
import RegisterScreen from '../screens/RegisterPage';
import UserManagement from '../screens/UserManagementPage';
// 导入其他页面...

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Choice">
        <Stack.Screen 
          name="Choice" 
          component={ChoiceScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="UserManagement" component={UserManagement} />
        {/* 添加其他页面... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;