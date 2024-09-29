import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../components/BottomTabNavigator';
const hourLists = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

const AppointmentPage = () => {
  const navigation = useNavigation();
  const [openid, setOpenid] = useState('');
  const [canUseProfile, setCanUseProfile] = useState(false);
  const [orgArray, setOrgArray] = useState(['校团委', '学生会', '校青协', '汕大青年', '踹网', '社团中心', '研会', '主持队', '礼仪队']);
  const [teacArray, setTeacArray] = useState(['姚溱', '陈益纯', '林煜', '林蔷', '罗列', '黄嘉曼']);
  const [formArray, setFormArray] = useState(['线下', '线上']);
  const [orgIndex, setOrgIndex] = useState(0);
  const [teacIndex, setTeacIndex] = useState(0);
  const [formIndex, setFormIndex] = useState(0);
  const [content, setContent] = useState('');
  const [subscriber, setSubscriber] = useState('');
  const [subscriberPhone, setSubscriberPhone] = useState('');
  const [timeList, setTimeList] = useState([]);
  const [yyDay, setYyDay] = useState(2);
  const [hourList, setHourList] = useState([
    { hour: "9:00", n: 9, isShow: false },
    { hour: "9:30", n: 9.5, isShow: false },
    { hour: "10:00", n: 10, isShow: false },
    { hour: "10:30", n: 10.5, isShow: false },
    { hour: "11:00", n: 11, isShow: false },
    { hour: "11:30", n: 11.5, isShow: false },
    { hour: "14:30", n: 14.5, isShow: false },
    { hour: "15:00", n: 15, isShow: false },
    { hour: "15:30", n: 15.5, isShow: false },
    { hour: "16:00", n: 16, isShow: false },
    { hour: "16:30", n: 16.5, isShow: false },
    { hour: "17:00", n: 17, isShow: false },
  ]);
  const [timeShow, setTimeShow] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [chooseHour, setChooseHour] = useState('');
  const [rankDay, setRankDay] = useState('');
  const [chooseTime, setChooseTime] = useState('');
  const [hourIndex, setHourIndex] = useState(-1);
  const [yyTime, setYyTime] = useState('');
  const [day, setDay] = useState('');
  const [submitButton, setSubmitButton] = useState(false);

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    // Initialize data, fetch user info, etc.
    initializeData();
  }, []);

  const initializeData = async () => {
    // Implement data initialization logic here
    // This would include fetching user info, setting up date lists, etc.
    initializeTimeList();
  };

  const initializeTimeList = () => {
    const today = new Date();
    const timeList = [];
    for (let i = 0; i < yyDay; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      timeList.push({
        name: getWeekdayName(date.getDay()),
        date: formatDate(date),
        rank: formatDateRank(date),
      });
    }
    setTimeList(timeList);
  };

  const getWeekdayName = (day) => {
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekdays[day];
  };

  const formatDate = (date) => {
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const formatDateRank = (date) => {
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  const showTimeModel = () => {
    setTimeModalVisible(true);
  };

  const hideTimeModel = () => {
    setTimeModalVisible(false);
  };

  const timeClick = (index) => {
    setCurrentTab(index);
    setSelectedDate(timeList[index]);
    // 重置小时选择
    setSelectedHour(null);
    setHourIndex(-1);
    
    // 这里可以添加逻辑来更新可选的时间段
    // 例如，检查是否是今天，如果是今天，则禁用已经过去的时间段
    const updatedHourList = hourList.map(hour => {
      if (index === 0) {
        const now = new Date();
        return { ...hour, isShow: now.getHours() < hour.n };
      }
      return { ...hour, isShow: true };
    });
    setHourList(updatedHourList);
  };

  const hourClick = (index) => {
    if (!hourList[index].isShow) return;
    setHourIndex(index);
    setSelectedHour(hourList[index]);
  };

  const confirmTimeSelection = () => {
    if (selectedDate && selectedHour) {
      const formattedTime = `${selectedDate.date} ${selectedHour.hour}`;
      setYyTime(formattedTime);
      setDay(selectedDate.date);
      setRankDay(parseFloat(selectedDate.rank) * 10000 + hourIndex);
      hideTimeModel();
    } else {
      Alert.alert("请选择日期和时间");
    }
  };

  const handleSubmit = async () => {
    if (!yyTime) {
      Alert.alert("请选择预约时间");
      return;
    }
    // Implement submission logic
  };

  return (
    <View style={styles.container}>
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>预约老师</Text>
        </View>

        <Text style={styles.subtitle}>所归属的组织:</Text>
        <Picker
            selectedValue={orgIndex}
            onValueChange={(itemValue) => setOrgIndex(itemValue)}
        >
            {orgArray.map((item, index) => (
            <Picker.Item key={index} label={item} value={index} />
            ))}
        </Picker>

        <Text style={styles.subtitle}>预约的老师</Text>
        <Picker
            selectedValue={teacIndex}
            onValueChange={(itemValue) => setTeacIndex(itemValue)}
        >
            {teacArray.map((item, index) => (
            <Picker.Item key={index} label={item} value={index} />
            ))}
        </Picker>

        <Text style={styles.subtitle}>预约事项</Text>
        <TextInput
            style={styles.input}
            placeholder="预约事项"
            onChangeText={setContent}
            value={content}
        />

        <Text style={styles.subtitle}>预约形式</Text>
        <Picker
            selectedValue={formIndex}
            onValueChange={(itemValue) => setFormIndex(itemValue)}
        >
            {formArray.map((item, index) => (
            <Picker.Item key={index} label={item} value={index} />
            ))}
        </Picker>

        <Text style={styles.subtitle}>预约时间:</Text>
        <TouchableOpacity style={styles.timeButton} onPress={showTimeModel}>
            <Text>{yyTime || '选择时间'}</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>预约人</Text>
        <TextInput
            style={styles.input}
            placeholder="预约人姓名"
            onChangeText={setSubscriber}
            value={subscriber}
        />

        <Text style={styles.subtitle}>预约人手机号</Text>
        <TextInput
            style={styles.input}
            placeholder="预约人联系方式"
            onChangeText={setSubscriberPhone}
            value={subscriberPhone}
        />

        <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitButton}
        >
            <Text style={styles.submitButtonText}>提交</Text>
        </TouchableOpacity>

        <Modal
            animationType="slide"
            transparent={true}
            visible={timeModalVisible}
            onRequestClose={hideTimeModel}
        >
            <View style={styles.modalView}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>选择预约的时间段</Text>
                <ScrollView horizontal style={styles.dateScroll}>
                {timeList.map((time, index) => (
                    <TouchableOpacity
                    key={index}
                    style={[styles.dateItem, currentTab === index && styles.dateItemActive]}
                    onPress={() => timeClick(index)}
                    >
                    <Text>{time.name}</Text>
                    <Text>{time.date}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
                <View style={styles.hourGrid}>
                {hourList.map((hour, index) => (
                    <TouchableOpacity
                    key={index}
                    style={[
                        styles.hourItem,
                        !hour.isShow && styles.hourItemDisabled,
                        hourIndex === index && styles.hourItemActive
                    ]}
                    onPress={() => hourClick(index)}
                    disabled={!hour.isShow}
                    >
                    <Text>{hour.hour}</Text>
                    </TouchableOpacity>
                ))}
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmTimeSelection}>
                <Text style={styles.confirmButtonText}>确认</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>
        </ScrollView>
        <BottomTabNavigator />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#D43030',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateItem: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  dateItemActive: {
    backgroundColor: '#D43030',
  },
  hourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hourItem: {
    width: '30%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  hourItemDisabled: {
    backgroundColor: '#f0f0f0',
  },
  hourItemActive: {
    backgroundColor: '#D43030',
  },
  confirmButton: {
    backgroundColor: '#D43030',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default AppointmentPage;