import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllAppointments } from '../api/appointmentApi';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import DateTimePicker from '@react-native-community/datetimepicker';
import globalStyles from '../config/globalStyles';


const TeacherAppointmentApprovalPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const pending = await getAllAppointments(0);
      const approved = await getAllAppointments(1);
      const rejected = await getAllAppointments(2);

      setPendingAppointments(pending);
      setApprovedAppointments(approved);
      setRejectedAppointments(rejected);
    } catch (error) {
      console.error('获取预约失败:', error);
      Alert.alert('错误', '获取预约列表失败');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAppointments();
    } catch (error) {
      console.error('刷新预约失败:', error);
      Alert.alert('错误', '刷新预约列表失败');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDownload = async () => {
    try {
      // 创建一个工作簿
      const wb = XLSX.utils.book_new();
      
      // 将待审核的预约数据转换为工作表
      const ws = XLSX.utils.json_to_sheet(pendingAppointments.map(appointment => ({
        '预约人': appointment.subscriber,
        '预约时间': `${new Date(appointment.appointmentDate).toLocaleDateString()} ${appointment.appointmentTime}`,
        '组织': appointment.organization,
        '预约老师': appointment.teacher,
        '预约事项': appointment.content
      })));
      
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "已通过预约");
      
      // 将工作簿转换为base64编码的字符串
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      const fileName = `已通过预约_${selectedDate.toISOString().slice(0,10)}.xlsx`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // 将base64字符串写入文件
      await RNFS.writeFile(filePath, wbout, 'base64');
      
      Alert.alert(
        '成功',
        `预约表单已保存到应用文档目录。\n文件路径: ${filePath}\n\n是否要移动文件到其他位置？`,
        [
          {
            text: '否',
            onPress: () => console.log('用户选择不移动文件'),
            style: 'cancel',
          },
          {
            text: '是',
            onPress: async () => {
              const shareOptions = {
                title: '移动预约表单',
                message: '请选择保存位置',
                url: `file://${filePath}`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              };
              try {
                await Share.open(shareOptions);
                console.log('文件已成功分享');
              } catch (error) {
                if (error.message !== 'User did not share') {
                  console.error('分享文件失败:', error);
                  Alert.alert('错误', '移动文件失败');
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('下载失败:', error);
      Alert.alert('错误', '下载预约表单失败');
    }
  };

  const handleDownloadApproved = async () => {
    try {
      // 筛选选定日期的已通过预约
      const filteredAppointments = approvedAppointments.filter(appointment => 
        new Date(appointment.appointmentDate).toDateString() === selectedDate.toDateString()
      );

      if (filteredAppointments.length === 0) {
        Alert.alert('提示', '所选日期没有已通过的预约记录');
        return;
      }

      // 创建一个工作簿
      const wb = XLSX.utils.book_new();
      console.log(filteredAppointments);
      console.log(selectedDate);
      // 将已通过的预约数据转换为工作表
      const ws = XLSX.utils.json_to_sheet(filteredAppointments.map(appointment => ({
        '预约人': appointment.subscriber,
        '预约时间': `${new Date(appointment.appointmentDate).toLocaleDateString()} ${appointment.appointmentTime}`,
        '组织': appointment.organization,
        '预约老师': appointment.teacher,
        '预约事项': appointment.content
      })));
      
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, "已通过预约");
      
      // 将工作簿转换为base64编码的字符串
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      const fileName = `已通过预约_${selectedDate.toISOString().slice(0,10)}.xlsx`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // 将base64字符串写入文件
      await RNFS.writeFile(filePath, wbout, 'base64');
      
      Alert.alert(
        '成功',
        `预约表单已保存到应用文档目录。\n文件路径: ${filePath}\n\n是否要移动文件到其他位置？`,
        [
          {
            text: '否',
            onPress: () => console.log('用户选择不移动文件'),
            style: 'cancel',
          },
          {
            text: '是',
            onPress: async () => {
              const shareOptions = {
                title: '移动预约表单',
                message: '请选择保存位置',
                url: `file://${filePath}`,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              };
              try {
                await Share.open(shareOptions);
                console.log('文件已成功分享');
              } catch (error) {
                if (error.message !== 'User did not share') {
                  console.error('分享文件失败:', error);
                  Alert.alert('错误', '移动文件失败');
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('下载失败:', error);
      Alert.alert('错误', '下载预约表单失败');
    }
  };

  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('EventDetail', { 
      appointmentId: appointment.id,
      appointment: appointment,
      user: 'tec',
      type: 'appointment'
    });
  };

  const renderAppointmentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.appointmentItem} 
      onPress={() => handleAppointmentPress(item)}
    >
      <Text style={[styles.teacherName, globalStyles.text]}>预约人: {item.subscriber}</Text>
      <Text style={[styles.appointmentTime, globalStyles.text]}>预约时间: {new Date(item.appointmentDate).toLocaleDateString()} {item.appointmentTime}</Text>
      <Text style={[styles.appointmentDetail, globalStyles.text]}>组织: {item.organization}</Text>
      <Text style={[styles.appointmentDetail, globalStyles.text]}>预约老师: {item.teacher}</Text>
      <Text style={[styles.appointmentDetail, globalStyles.text]}>预约事项: {item.content}</Text>
      <View style={styles[`state_${item.status}`]}>
        <Text style={styles.stateContent}>{getStatusText(item.status)}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusText = (status) => {
    switch(status) {
      case 0: return '待审核';
      case 1: return '已通过';
      case 2: return '已驳回';
      default: return '未知状态';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, globalStyles.text]}>待审核</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, globalStyles.text]}>已通过</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
          onPress={() => setActiveTab('rejected')}
        >
          <Text style={[styles.tabText, globalStyles.text]}>已驳回</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'approved' && (
        <View style={styles.approvedControlsContainer}>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerButtonText}>
                选择日期: {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadApproved}>
            <Text style={styles.buttonText}>下载已通过预约表单</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={
          activeTab === 'pending'
            ? pendingAppointments
            : activeTab === 'approved'
            ? approvedAppointments
            : rejectedAppointments
        }
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D43030']} // 自定义刷新指示器的颜色
            tintColor="#D43030"
          />
        }
      />

      {activeTab === 'pending' && (
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Text style={styles.buttonText}>下载待审核预约表单</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#D43030',
  },
  tabText: {
    fontSize: 16,
  },
  appointmentItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
    marginTop: 10, 
    marginBottom: 10,
    borderRadius: 15,
    position: 'relative',
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appointmentTime: {
    color: '#666',
    fontSize: 14,
    marginBottom: 3,
  },
  appointmentDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  state_0: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFA500',
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  state_1: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  state_2: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  stateContent: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    margin: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  datePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  approvedControlsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TeacherAppointmentApprovalPage;