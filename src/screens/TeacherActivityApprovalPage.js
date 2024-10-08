import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllActivities } from '../api/activityApi';

const TeacherActivityApprovalPage = () => {
  const [activities, setActivities] = useState({
    pending: [],
    approved: [],
    rejected: [],
    reportApproved: [],
    finished: []
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    console.log('Activities:', activities);
    console.log('Active Tab:', activeTab);
    console.log('Current Activities:', activities[activeTab]);
  }, [activities, activeTab]);

  const fetchActivities = async () => {
    try {
      const pending = await getAllActivities(0);
      const approved = await getAllActivities(1);
      const rejected = await getAllActivities(2);
      const reportApproved = await getAllActivities(3);
      const finished = await getAllActivities(4);

      setActivities({
        pending,
        approved,
        rejected,
        reportApproved,
        finished
      });
      console.log('Fetched Activities:', { pending, approved, rejected, reportApproved, finished });
    } catch (error) {
      console.error('获取活动失败:', error);
      Alert.alert('错误', '获取活动列表失败');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchActivities();
    } catch (error) {
      console.error('刷新活动失败:', error);
      Alert.alert('错误', '刷新活动列表失败');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onDateChange = (event, selected) => {
    const currentDate = selected || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleActivityPress = (activity) => {
    navigation.navigate('EventDetail', { 
      activityId: activity.id,
      activity: activity,
      user: 'tec',
      type: 'activity'
    });
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityItem} 
      onPress={() => handleActivityPress(item)}
    >
      <Text style={styles.activityName}>活动名称: {item.activity_name}</Text>
      <Text style={styles.activityTime}>活动时间: {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}</Text>
      <Text style={styles.activityDetail}>活动地点: {item.area}</Text>
      <Text style={styles.activityDetail}>所属组织: {item.organization}</Text>
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
      case 3: return '已提交总结';
      case 4: return '已结束';
      default: return '未知状态';
    }
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    console.log('Active Tab:', tabName); // 添加日志
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => handleTabPress('pending')}
          >
            <Text style={styles.tabText}>待审核</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
            onPress={() => handleTabPress('approved')}
          >
            <Text style={styles.tabText}>已通过</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
            onPress={() => handleTabPress('rejected')}
          >
            <Text style={styles.tabText}>已驳回</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reportApproved' && styles.activeTab]}
            onPress={() => handleTabPress('reportApproved')}
          >
            <Text style={styles.tabText}>已提交总结</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'finished' && styles.activeTab]}
            onPress={() => handleTabPress('finished')}
          >
            <Text style={styles.tabText}>已结束</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={activities[activeTab] || []}
        renderItem={renderActivityItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#D43030']}
            tintColor="#D43030"
          />
        }
        ListEmptyComponent={() => (
          // 展示暂无活动的图标
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>暂无活动</Text>
          </View>
        )}
      />

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
      },
      tabScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      tab: {
        padding: 10,
        marginHorizontal: 5,
      },
      activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#D43030',
      },
      tabText: {
        fontSize: 16,
      },
      activityItem: {
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
      activityTime: {
        color: '#666',
        fontSize: 14,
        marginBottom: 3,
      },
      activityDetail: {
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
      state_3: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#2196F3',
        padding: 10,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
      },
      state_4: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#9E9E9E',
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
      emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      emptyListText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
      },
});

export default TeacherActivityApprovalPage;