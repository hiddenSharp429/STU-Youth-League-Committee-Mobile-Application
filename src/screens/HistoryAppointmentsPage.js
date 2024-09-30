import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { getUserAppointments, getUserAppointmentsCount } from '../api/appointmentApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppointmentItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.appointmentItem} onPress={() => onPress(item)}>
    <View>
      <Text style={styles.teacherName}>预约老师：{item.teacher}</Text>
      <Text style={styles.appointmentTime}>预约时间：{new Date(item.appointmentDate).toLocaleDateString()} {item.appointmentTime}</Text>
      <Text style={styles.appointmentDetail}>组织：{item.organization}</Text>
      <Text style={styles.appointmentDetail}>预约人：{item.subscriber}</Text>
      <Text style={styles.appointmentDetail}>预约事项：{item.content}</Text>
    </View>
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

const HistoryAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [userId, setUserId] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert('错误', '用户未登录');
        navigation.navigate('Login');
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAppointments();
      fetchTotalCount();
    }
  }, [userId, currentPage]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = navigation.getState().routes.find(r => r.name === 'AppointmentHistory')?.params;
      if (params?.needRefresh) {
        setNeedRefresh(true);
        // 重置 needRefresh 参数，以便下次导航时不会重复刷新
        navigation.setParams({ needRefresh: false });
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (needRefresh && userId) {
      fetchAppointments();
      fetchTotalCount();
      setNeedRefresh(false);
    }
  }, [needRefresh, userId]);

  const fetchAppointments = async () => {
    try {
      const data = await getUserAppointments(userId, [0,1,2], currentPage, 4);
      setAppointments(data.appointments || []);
      if (data.appointments.length === 0 && currentPage > 1) {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    } catch (error) {
      console.error('获取历史预约列表失败', error);
      Alert.alert('错误', '获取历史预约列表失败');
    }
  };

  const fetchTotalCount = async () => {
    try {
      const { total } = await getUserAppointmentsCount(userId, [0,1,2]);
      setTotalRecord(total);
      setTotalPage(Math.ceil(total / 4)); // 假设每页显示4条记录
    } catch (error) {
      console.error('获取总数失败', error);
    }
  };

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('EventDetail', { 
      appointmentId: appointment.id,
      appointment: appointment,
      user: 'stu',
      type: 'appointment'
    });
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    } else {
      Alert.alert('提示', '已经到最后一页');
    }
  };

  const lastPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      Alert.alert('提示', '已经是第一页了');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>历史预约</Text>
          <Text style={styles.comment}>共{totalRecord}条记录</Text>
        </View>
        {appointments.length === 0 ? (
          <View style={styles.noData}>
            <Image source={require('../../assets/icons/noData.png')} style={styles.noDataImage} />
            <Text style={styles.noDataText}>很抱歉，暂无历史预约记录哦</Text>
          </View>
        ) : (
          <FlatList
            data={appointments}
            renderItem={({ item }) => (
              <AppointmentItem 
                item={item} 
                onPress={handleAppointmentPress}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        )}
        {appointments.length > 0 && (
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.pageButton} onPress={lastPage}>
              <Icon name="chevron-left" size={20} color="#000" />
            </TouchableOpacity>
            <View style={styles.currentPageButton}>
              <Text style={styles.currentPageText}>{currentPage}</Text>
            </View>
            <TouchableOpacity style={styles.pageButton} onPress={nextPage}>
              <Icon name="chevron-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 13,
    color: '#666',
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noDataImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  appointmentItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  pageButton: {
    backgroundColor: '#ececea',
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  currentPageButton: {
    backgroundColor: '#666666',
    width: 35,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  currentPageText: {
    color: 'white',
  },
});

export default HistoryAppointmentsPage;