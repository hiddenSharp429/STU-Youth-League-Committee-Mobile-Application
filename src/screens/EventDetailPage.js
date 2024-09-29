import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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

  const renderStepBar = () => {
    // 如果活动状态为已驳回（status为2），则不显示进度条
    if (activity.status === 2) {
      return null;
    }

    const steps = [
      { label: '审核中', status: 0 },
      { label: '已通过', status: 1 },
      { label: '已提交总结', status: 3 },
      { label: '已结束', status: 4 }
    ];

    return (
      <View style={styles.stepBar}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View style={[
              styles.step,
              activity.status >= step.status ? styles.stepCompleted : styles.stepIncomplete
            ]}>
              <Text style={styles.stepText}>{step.label}</Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepConnector,
                activity.status > step.status ? styles.stepConnectorCompleted : styles.stepConnectorIncomplete
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  const renderFileLink = (url, title) => {
    if (url) {
      const fileName = url.split('/').pop(); // 从 URL 中提取文件名
      return (
        <TouchableOpacity 
          style={styles.fileLink} 
          onPress={() => {
            console.log('Opening file:', url); // 添加日志
            Linking.openURL(url).catch(err => {
              console.error('无法打开文件', err);
              Alert.alert('错误', '无法打开文件');
            });
          }}
        >
          <Icon name="file" size={20} color="#4CAF50" />
          <Text style={styles.fileLinkText}>{title}: {fileName}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderSummarySection = () => {
    if (activity.status < 3) {
      return null;
    }

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>活动总结</Text>
        {renderSection('实际参与人数', activity.practical_member)}
        {renderSection('实际总费用', `${activity.practical_total_money} 元`)}
        {renderSection('实际赞助金额', `${activity.practical_sponsorship} 元`)}
        {renderSection('实际申请拨款金额', `${activity.practical_ap_money} 元`)}
        
        {renderFileLink(activity.satisfaction_survey_url, '满意度调查表')}
        {renderFileLink(activity.fund_details_url, '资金细项')}
        {renderFileLink(activity.activity_files_url, '活动文件')}

        <Text style={styles.sectionTitle}>宣传报道链接:</Text>
        {(activity.publicity_links || []).map((link, index) => (
          <Text key={index} style={styles.link} onPress={() => Linking.openURL(link)}>{link}</Text>
        ))}

        <Text style={styles.sectionTitle}>办公自动化链接:</Text>
        {(activity.oa_links || []).map((link, index) => (
          <Text key={index} style={styles.link} onPress={() => Linking.openURL(link)}>{link}</Text>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{activity.activity_name}</Text>
        <Text style={styles.status}>
          状态: {
            activity.status === 0 ? '审核中' :
            activity.status === 1 ? '已通过' :
            activity.status === 2 ? '已驳回' :
            activity.status === 3 ? '已提交总结' :
            activity.status === 4 ? '已结束' : '未知状态'
          }
        </Text>
        {renderStepBar()}
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

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>活动总结</Text>
        <Text style={styles.briefContent}>{activity.summary_content}</Text>
      </View>

      {renderSummarySection()}

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
  stepBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  step: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepIncomplete: {
    backgroundColor: '#E0E0E0',
  },
  stepText: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  stepConnectorCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepConnectorIncomplete: {
    backgroundColor: '#E0E0E0',
  },
  fileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fileLinkText: {
    marginLeft: 10,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
    marginVertical: 2,
  },
});

export default EventDetailPage;