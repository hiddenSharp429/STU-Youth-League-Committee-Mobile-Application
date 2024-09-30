/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-09-24 21:47:28
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-30 12:14:56
 * @FilePath: /YLC/src/navigation/AppNavigator.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChoiceScreens from '../screens/ChoicePage';
import RegisterScreen from '../screens/RegisterPage';
import UserManagement from '../screens/UserManagementPage';
import AddUserPage from '../screens/AddUserPage';
import AddAdminPage from '../screens/AddAdminPage';
import RevokeRegistrationPage from '../screens/RevokeRegistrationPage';
import RevokeExistingMemberPage from '../screens/RevokeExistingMemberPage';
import MyActivitiesPage from '../screens/MyActivitiesPage';
import ApplyActivityPage from '../screens/ApplyActivityPage';
import EventDetailPage from '../screens/EventDetailPage';
import EditActivityPage from '../screens/EditActivityPage';
import SubmitActivitySummaryPage from '../screens/SubmitActivitySummaryPage';
import HistoryActivitiesPage from '../screens/HistoryActivitiesPage';
import AppointmentPage from '../screens/AppointmentPage';
import HistoryAppointmentsPage from '../screens/HistoryAppointmentsPage';
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
        <Stack.Screen name="AddUser" component={AddUserPage} />
        <Stack.Screen name="AddAdmin" component={AddAdminPage} />
        <Stack.Screen name="RevokeRegistration" component={RevokeRegistrationPage} />
        <Stack.Screen name="RevokeExistingMember" component={RevokeExistingMemberPage} />
        <Stack.Screen name="MyActivities" component={MyActivitiesPage} />
        <Stack.Screen name="ApplyActivity" component={ApplyActivityPage} />
        <Stack.Screen name="EventDetail" component={EventDetailPage} />
        <Stack.Screen name="EditActivity" component={EditActivityPage}/>
        <Stack.Screen name="SubmitActivitySummary" component={SubmitActivitySummaryPage}/>
        <Stack.Screen name="HistoryActivities" component={HistoryActivitiesPage}/>
        <Stack.Screen name="Appointment" component={AppointmentPage}/>
        <Stack.Screen name="AppointmentHistory" component={HistoryAppointmentsPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;