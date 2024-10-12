import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../api/userApi';
import { addAppointment } from '../api/appointmentApi';
import { getTeacherAppointments } from '../api/appointmentApi';
const hourLists = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
import BottomTabNavigation from '../components/BottomTabNavigator';
import globalStyles from '../config/globalStyles';
const AppointmentPage = () => {
  const navigation = useNavigation();
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const organizations = ['校团委', '学生会', '校青协', '汕大青年', '踹网', '社团中心', '研会', '主持队', '礼仪队'];
  const teachers = ['姚溱', '陈益纯', '林煜', '林蔷', '罗列', '黄嘉曼'];
  const appointmentForms = ['线下', '线上'];

  const [availableDate, setAvailableDate] = useState(null);
  const [canSelectTime, setCanSelectTime] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    organization: organizations[0],
    organizationId: 0,
    teacher: teachers[0],
    teacherId: 0,
    //appointmentDate为当前日期的后一天
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    appointmentTime: '',
    appointmentForm: appointmentForms[0],
    content: '',
    subscriber: '',
    subscriberPhone: '',
  });

  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [isVip, setIsVip] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);



  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const userInfo = await getUserById(storedUserId);
        if (userInfo) {
          setFormData(prevData => ({ ...prevData, userId: storedUserId }));
          setIsVip(userInfo.unrestricted);
        } else {
          Alert.alert('错误', '用户未登录');
          navigation.navigate('ChoicePage');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    };

    getUserInfo();

    // 检查是否可以选择时间段
    checkAvailableDate();
  }, []);

  const checkAvailableDate = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayOfWeek = tomorrow.getDay();
    console.log("dayOfWeek", dayOfWeek);
    // const isValidDay = [2, 4, 5].includes(dayOfWeek); // 2: 周一, 4: 周三, 5: 周四
    const isValidDay = [0, 1, 2, 3, 4, 5, 6].includes(dayOfWeek); // 1: 周一, 3: 周三, 4: 周四
    // if (isValidDay && now.getHours() < 18) {
    //   setAvailableDate(tomorrow);
    //   setCanSelectTime(true);
    // } else {
    //   setAvailableDate(null);
    //   setCanSelectTime(false);
    // }
    if (isValidDay && now.getHours() < 24) {
      setAvailableDate(tomorrow);
      setCanSelectTime(true);
    } else {
      setAvailableDate(null);
      setCanSelectTime(false);
    }
  };

  const showTimeModel = async () => {
    if (!canSelectTime) {
      Alert.alert('提示', '当前不可选择时间段');
      return;
    }

    try {
      const date = availableDate.toISOString().split('T')[0];
      const appointments = await getTeacherAppointments(formData.teacherId, date);
      console.log("appointments", appointments);
      setUnavailableTimes(appointments); 
      setTimeModalVisible(true);
    } catch (error) {
      console.error('获取老师预约信息失败:', error);
      Alert.alert('错误', '获取可用时间段失败，请稍后再试');
    }
  };

  const hideTimeModel = () => {
    setTimeModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await addAppointment(formData);
      if (result.success) {
        Alert.alert('成功', result.message);
        // 可以在这里添加导航到其他页面的逻辑
        navigation.navigate('AppointmentHistory', { 
          needRefresh: true
        });
      } else {
        Alert.alert('错误', result.message);
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      Alert.alert('错误', '提交预约失败,请稍后再试');
    }
  };

  // 添加表单验证函数
  const validateForm = () => {
    // 实现表单验证逻辑
    if (!formData.organization) {
      Alert.alert('错误', '请选择所归属的组织');
      return false;
    }
    if (!formData.teacher) {
      Alert.alert('错误', '请选择预约的老师');
      return false;
    }
    if (!formData.appointmentTime) {
      Alert.alert('错误', '请选择预约的时间段');
      return false;
    }
    if (!formData.appointmentForm) {
      Alert.alert('错误', '请选择预约的形式');
      return false;
    }
    if (!formData.content) {
      Alert.alert('错误', '请输入预约事项');
      return false;
    }
    if (!formData.subscriber) {
      Alert.alert('错误', '请输入预约人姓名');
      return false;
    }
    if (!formData.subscriberPhone) {
      Alert.alert('错误', '请输入预约人联系方式');
      return false;
    }
    
    return true; // 如果验证通过,返回 true
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.appointment}>
          <View style={styles.appointmentTitle}>
            <Text style={styles.titleText}>预约老师</Text>
          </View>

          {/* 所归属的组织 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>所归属的组织:</Text>
            <Picker
              selectedValue={formData.organization}
              onValueChange={(itemValue, itemIndex) => 
                setFormData({...formData, organization: itemValue, organizationId: itemIndex})}
              style={styles.picker}
            >
              {organizations.map((org, index) => (
                <Picker.Item key={index} label={org} value={org} />
              ))}
            </Picker>
          </View>

          {/* 预约的老师 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>预约的老师:</Text>
            <Picker
              selectedValue={formData.teacher}
              onValueChange={(itemValue, itemIndex) => 
                setFormData({...formData, teacher: itemValue, teacherId: itemIndex})}
              style={styles.picker}
            >
              {teachers.map((teacher, index) => (
                <Picker.Item key={index} label={teacher} value={teacher} />
              ))}
            </Picker>
          </View>

          {/* 预约时间 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>预约时间:</Text>
            {availableDate ? (
              <Text style={globalStyles.text}>{availableDate.toDateString()}</Text>
            ) : (
              <Text style={globalStyles.text}>当前无可预约时间</Text>
            )}
            <TouchableOpacity 
              onPress={showTimeModel} 
              style={[styles.timePickerButton, !canSelectTime && styles.disabledButton]}
              disabled={!canSelectTime}
            >
              <Text style={globalStyles.text}>{formData.appointmentTime || '选择时间段'}</Text>
              <Icon name="clock-o" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* 预约形式 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>约形式:</Text>
            <Picker
              selectedValue={formData.appointmentForm}
              onValueChange={(itemValue) => setFormData({...formData, appointmentForm: itemValue})}
              style={styles.picker}
            >
              {appointmentForms.map((form, index) => (
                <Picker.Item key={index} label={form} value={form} />
              ))}
            </Picker>
          </View>

          {/* 预约事项 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>预约事项:</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入预约事项"
              placeholderTextColor={globalStyles.placeholderText.color}
              value={formData.content}
              onChangeText={(text) => setFormData({...formData, content: text})}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          {/* 预约人信息 */}
          <View style={styles.formSection}>
            <Text style={styles.subtitle}>预约人信息:</Text>
            <TextInput
              style={styles.input}
              placeholder="预约人姓名"
              placeholderTextColor={globalStyles.placeholderText.color}
              value={formData.subscriber}
              onChangeText={(text) => setFormData({...formData, subscriber: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="预约人联系方式"
              placeholderTextColor={globalStyles.placeholderText.color}
              value={formData.subscriberPhone}
              onChangeText={(text) => setFormData({...formData, subscriberPhone: text})}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>提交预约</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomTabNavigation />

      {/* 时间选择模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={hideTimeModel}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, globalStyles.text]}>选择预约的时间段</Text>
            <View style={styles.timeGrid}>
              {hourLists.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeItem,
                    formData.appointmentTime === time && styles.timeItemActive,
                    unavailableTimes.includes(time) && styles.timeItemDisabled
                  ]}
                  onPress={() => {
                    if (!unavailableTimes.includes(time)) {
                      setFormData({...formData, appointmentTime: time});
                      hideTimeModel();
                    }
                  }}
                  disabled={unavailableTimes.includes(time)}
                >
                  <Text style={[unavailableTimes.includes(time) ? styles.timeItemTextDisabled : null, globalStyles.text]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={hideTimeModel}>
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 改为纯白色背景
  },
  scrollView: {
    flex: 1,
  },
  appointment: {
    padding: 20,
  },
  appointmentTitle: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#333333',
    paddingBottom: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // 使用纯黑色
  },
  formSection: {
    marginBottom: 25, // 增加底部间距
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#B22222', // 使用深红色
  },
  picker: {
    backgroundColor: '#f8f8f8', // 浅灰色背景
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    color: '#000000',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#000000', // 使用纯黑色文字
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    marginBottom: 10,
  },
  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
  },
  submitButton: {
    backgroundColor: '#B22222', // 使用深红色
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // 增加宽度
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000', // 使用纯黑色
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeItem: {
    width: '30%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // 浅灰色背景
  },
  timeItemActive: {
    backgroundColor: '#B22222', // 使用深红色
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#B22222', // 使用深红色
    borderRadius: 10,
    width: '100%', // 使按钮宽度与模态框一致
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  timeItemDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#cccccc',
  },
  timeItemTextDisabled: {
    color: '#999999',
  },
});

export default AppointmentPage;