import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getActivityById } from '../api/activityApi';

const EventDetailPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activityId, user, type } = route.params;
  const [activity, setActivity] = useState(route.params.activity);

  const handleEdit = () => {
    navigation.navigate('EditActivity', { activity });
  };

  const handleSubmitSummary = () => {
    navigation.navigate('SubmitActivitySummary', { activity });
  };

  const renderEditButton = () => {
    if (user === 'stu' && activity.status === 2) {
      return (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>修改申请</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderSubmitSummaryButton = () => {
    if (user === 'stu' && activity.status === 1) {
      return (
        <TouchableOpacity style={styles.editButton} onPress={handleSubmitSummary}>
          <Text style={styles.editButtonText}>提交总结</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };


  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.activity_name}</Text>
        <Text style={styles.status}>
          状态: {
            activity.status === 0 ? '审核中' :
            activity.status === 1 ? '已通过' :
            '已驳回'
          }
        </Text>
        {renderEditButton()}
        {renderSubmitSummaryButton()}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>基本信息</Text>
        {renderSection('开始时间', new Date(activity.start_date).toLocaleString())}
        {renderSection('结束时间', new Date(activity.end_date).toLocaleString())}
        {renderSection('活动地点', activity.activity_place)}
        {renderSection('区域', activity.area)}
        {renderSection('组织', activity.organization)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>负责人信息</Text>
        {renderSection('姓名', activity.responsible_name)}
        {renderSection('年级', activity.responsible_grade)}
        {renderSection('电话', activity.responsible_phone)}
        {renderSection('邮箱', activity.responsible_email)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预算信息</Text>
        {renderSection('总预算', `${activity.budget_total} 元`)}
        {renderSection('自筹经费', `${activity.budget_self} 元`)}
        {renderSection('申请经费', `${activity.budget_apply} 元`)}
      </View>

      {activity.has_sponsor === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>赞助信息</Text>
          {renderSection('赞助公司', activity.sponsor_company)}
          {renderSection('赞助形式', activity.sponsor_form)}
          {renderSection('赞助金额', `${activity.sponsor_money} 元`)}
        </View>
      )}

      {activity.need_borrow === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>借款信息</Text>
          {renderSection('借款人姓名', activity.borrower_name)}
          {renderSection('借款人年级', activity.borrower_grade)}
          {renderSection('借款人年龄', activity.borrower_age)}
          {renderSection('借款人电话', activity.borrower_phone)}
          {renderSection('借款金额', `${activity.borrower_money} 元`)}
        </View>
      )}

      {activity.need_service_fee === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>劳务费信息</Text>
          {renderSection('发放对象', activity.service_object)}
          {renderSection('劳务费金额', `${activity.service_money} 元`)}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>其他信息</Text>
        {renderSection('参与人数', activity.participant_count)}
        {renderSection('是否需要上传OA', activity.need_upload_oa === 'yes' ? '是' : '否')}
        {renderSection('备注', activity.remark)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>活动简介</Text>
        <Text style={styles.briefContent}>{activity.brief_content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  briefContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EventDetailPage;