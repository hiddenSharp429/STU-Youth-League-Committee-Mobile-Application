import React, { useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getActivityById, approveActivity, rejectActivity } from '../api/activityApi';
import { approveAppointment, rejectAppointment } from '../api/appointmentApi';

const EventDetailPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activityId, appointmentId, user, type } = route.params;
  const [data, setData] = useState(route.params.activity || route.params.appointment);

  const isAppointment = type === 'appointment';
  const isTeacher = user === 'tec';

  useFocusEffect(
    useCallback(() => {
      if (activityId && !isAppointment) {
        fetchActivityDetails();
      }
    }, [activityId])
  );

  const fetchActivityDetails = async () => {
    try {
      const activityDetails = await getActivityById(activityId);
      setData(activityDetails);
    } catch (error) {
      console.error('获取活动详情失败:', error);
      Alert.alert('错误', '获取活动详情失败');
    }
  };

  const handleEdit = () => {
    if (isAppointment) {
      navigation.navigate('AppointmentPage', { appointment: data });
    } else {
      navigation.navigate('EditActivity', { activity: data });
    }
  };

  const handleSubmitSummary = () => {
    navigation.navigate('SubmitActivitySummary', { activity: data });
  };

  const handleApproveAppointment = async () => {
    try {
      await approveAppointment(appointmentId);
      Alert.alert('成功', '预约已通过');
      setData({ ...data, status: 1 });
    } catch (error) {
      console.error('审批预约失败:', error);
      Alert.alert('错误', '审批预约失败');
    }
  };

  const handleRejectAppointment = () => {
    Alert.prompt(
      '驳回预约',
      '请输入驳回理由:',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: async (reason) => {
            if (!reason || reason.trim() === '') {
              Alert.alert('错误', '请输入驳回理由');
              return;
            }
            try {
              await rejectAppointment(appointmentId, reason);
              Alert.alert('成功', '预约已驳回');
              setData({ ...data, status: 2, rejectReason: reason });
            } catch (error) {
              console.error('驳回预约失败:', error);
              Alert.alert('错误', '驳回预约失败');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleApproveActivity = async (status) => {
    try {
      if (status === 0) {
        await approveActivity(activityId, 1);
      } else if (status === 1) {
        await approveActivity(activityId, 3);
      } else if (status === 3) {
        await approveActivity(activityId, 4);
      }
      Alert.alert('成功', '活动已通过');
      setData({ ...data, status: 1 });
    } catch (error) {
      console.error('审批活动失败:', error);
      Alert.alert('错误', '审批活动失败');
    }
  };

  const handleRejectActivity = () => {
    Alert.prompt(
      '驳回活动',
      '请输入驳回理由:',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: async (reason) => {
            if (!reason || reason.trim() === '') {
              Alert.alert('错误', '请输入驳回理由');
              return;
            }
            try {
              await rejectActivity(activityId);
              Alert.alert('成功', '活动已驳回');
              setData({ ...data, status: 2, rejectReason: reason });
            } catch (error) {
              console.error('驳回活动失败:', error);
              Alert.alert('错误', '驳回活动失败');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const renderEditButton = () => {
    if (!isAppointment && data.status === 2) {
      return (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>{isAppointment ? '修改预约' : '修改申请'}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderSubmitSummaryButton = () => {
    if (!isAppointment && user === 'stu' && data.status === 1) {
      return (
        <TouchableOpacity style={styles.editButton} onPress={handleSubmitSummary}>
          <Text style={styles.editButtonText}>提交总结</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderStepBar = () => {
    if (isAppointment) {
      const steps = [
        { label: '待审核', status: 0 },
        { label: '已通过', status: 1 },
      ];
      return (
        <View style={styles.stepBar}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <View style={[
                styles.step,
                data.status === step.status ? styles.stepCompleted : styles.stepIncomplete
              ]}>
                <Text style={styles.stepText}>{step.label}</Text>
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  data.status > step.status ? styles.stepConnectorCompleted : styles.stepConnectorIncomplete
                ]} />
              )}
            </React.Fragment>
          ))}
        </View>
      );
    } else {
      // 活动的进度条逻辑保持不变
      if (data.status === 2) {
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
                data.status >= step.status ? styles.stepCompleted : styles.stepIncomplete
              ]}>
                <Text style={styles.stepText}>{step.label}</Text>
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  data.status > step.status ? styles.stepConnectorCompleted : styles.stepConnectorIncomplete
                ]} />
              )}
            </React.Fragment>
          ))}
        </View>
      );
    }
  };

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  const renderFileLink = (url, title) => {
    if (url) {
      const fileName = url.split('/').pop();
      return (
        <TouchableOpacity 
          style={styles.fileLink} 
          onPress={() => {
            console.log('Opening file:', url);
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

  const renderActivityDetails = () => (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>基本信息</Text>
        {renderSection('开始时间', new Date(data.start_date).toLocaleString())}
        {renderSection('结束时间', new Date(data.end_date).toLocaleString())}
        {renderSection('活动地点', data.activity_place)}
        {renderSection('区域', data.area)}
        {renderSection('组织', data.organization)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>负责人信息</Text>
        {renderSection('姓名', data.responsible_name)}
        {renderSection('年级', data.responsible_grade)}
        {renderSection('电话', data.responsible_phone)}
        {renderSection('邮箱', data.responsible_email)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预算信息</Text>
        {renderSection('总预算', `${data.budget_total} 元`)}
        {renderSection('自筹经费', `${data.budget_self} 元`)}
        {renderSection('申请经费', `${data.budget_apply} 元`)}
      </View>

      {data.has_sponsor === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>赞助信息</Text>
          {renderSection('赞助公司', data.sponsor_company)}
          {renderSection('赞助形式', data.sponsor_form)}
          {renderSection('赞助金额', `${data.sponsor_money} 元`)}
        </View>
      )}

      {data.need_borrow === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>借款信息</Text>
          {renderSection('借款人姓名', data.borrower_name)}
          {renderSection('借款人年级', data.borrower_grade)}
          {renderSection('借款人年龄', data.borrower_age)}
          {renderSection('借款人电话', data.borrower_phone)}
          {renderSection('借款金额', `${data.borrower_money} 元`)}
        </View>
      )}

      {data.need_service_fee === 'yes' && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>劳务费信息</Text>
          {renderSection('发放对象', data.service_object)}
          {renderSection('劳务费金额', `${data.service_money} 元`)}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>其他信息</Text>
        {renderSection('参与人数', data.participant_count)}
        {renderSection('是否需要上传OA', data.need_upload_oa === 'yes' ? '是' : '否')}
        {renderSection('备注', data.remark)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>活动简介</Text>
        <Text style={styles.briefContent}>{data.brief_content}</Text>
      </View>

      {data.status >= 3 && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>活动总结</Text>
          <Text style={styles.briefContent}>{data.summary_content}</Text>
        </View>
      )}

      {renderSummarySection()}
    </>
  );

  const renderAppointmentDetails = () => (
    <>
      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预约信息</Text>
        {renderSection('所属组织', data.organization)}
        {renderSection('预约老师', data.teacher)}
        {renderSection('预约日期', new Date(data.appointmentDate).toLocaleDateString())}
        {renderSection('预约时间', data.appointmentTime)}
        {renderSection('预约形式', data.appointmentForm)}
        {renderSection('预约事项', data.content)}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预约人信息</Text>
        {renderSection('姓名', data.subscriber)}
        {renderSection('联系方式', data.subscriberPhone)}
      </View>

      {data.status === 2 && data.rejectReason && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionHeader}>驳回理由</Text>
          <Text style={styles.sectionContent}>{data.rejectReason}</Text>
        </View>
      )}
    </>
  );

  const renderSummarySection = () => {
    if (data.status < 3 || isAppointment) {
      return null;
    }

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>活动总结</Text>
        {renderSection('实际参与人数', data.practical_member)}
        {renderSection('实际总费用', `${data.practical_total_money} 元`)}
        {renderSection('实际赞助金额', `${data.practical_sponsorship} 元`)}
        {renderSection('实际申请拨款金额', `${data.practical_ap_money} 元`)}
        
        {renderFileLink(data.satisfaction_survey_url, '满意度调查表')}
        {renderFileLink(data.fund_details_url, '资金细项')}
        {renderFileLink(data.activity_files_url, '活动文件')}

        <Text style={styles.sectionTitle}>宣传报道链接:</Text>
        {(data.publicity_links || []).map((link, index) => (
          <Text key={index} style={styles.link} onPress={() => Linking.openURL(link)}>{link}</Text>
        ))}

        <Text style={styles.sectionTitle}>办公自动化链接:</Text>
        {(data.oa_links || []).map((link, index) => (
          <Text key={index} style={styles.link} onPress={() => Linking.openURL(link)}>{link}</Text>
        ))}
      </View>
    );
  };

  const renderApprovalButtons = () => {
    if (isTeacher) {
      if (isAppointment && data.status === 0) {
        return (
          <View style={styles.approvalButtonsContainer}>
            <TouchableOpacity style={styles.approveButton} onPress={handleApproveAppointment}>
              <Text style={styles.buttonText}>通过预约</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectButton} onPress={handleRejectAppointment}>
              <Text style={styles.buttonText}>驳回预约</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        if (data.status === 0 || data.status === 1 || data.status === 3) {
          return (
            <View style={styles.approvalButtonsContainer}>
              <TouchableOpacity 
                style={styles.approveButton} 
                onPress={() => handleApproveActivity(data.status)}
              >
                <Text style={styles.buttonText}>通过活动</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectActivity}>
                <Text style={styles.buttonText}>驳回活动</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isAppointment ? '预约详情' : data.activity_name}</Text>
        <Text style={styles.status}>
          状态: {
            isAppointment
              ? (data.status === 0 ? '待审核' : data.status === 1 ? '已通过' : '已驳回')
              : (data.status === 0 ? '审核中' :
                 data.status === 1 ? '已通过' :
                 data.status === 2 ? '已驳回' :
                 data.status === 3 ? '已提交总结' :
                 data.status === 4 ? '已结束' : '未知状态')
          }
        </Text>
        {renderStepBar()}
        {renderEditButton()}
        {renderSubmitSummaryButton()}
        {renderApprovalButtons()}
      </View>

      {isAppointment ? renderAppointmentDetails() : renderActivityDetails()}
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
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  fileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  fileLinkText: {
    marginLeft: 5,
  },
  approvalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EventDetailPage;