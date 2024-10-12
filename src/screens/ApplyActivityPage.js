/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 19:29:54
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-10-12 14:30:17
 * @FilePath: /YLC/src/screens/ApplyActivityPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import RadioButton from '../components/RadioButton';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { addActivity } from '../api/activityApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../config/globalStyles';

const ApplyActivityPage = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    userId:'',
    status: 0,
    activityName: '',
    startDate: new Date(),
    endDate: new Date(),
    activityPlace: '',
    area: '',
    organization: '',
    organizationId: 0,
    responsibleName: '',
    responsibleGrade: '',
    responsiblePhone: '',
    responsibleEmail: '',
    budgetTotal: '',
    budgetSelf: '',
    budgetApply: '',
    hasSponsor: '',
    sponsorCompany: '',
    sponsorForm: '',
    sponsorMoney: '',
    needBorrow: '',
    borrowerName: '',
    borrowerGrade: '',
    borrowerAge: '',
    borrowerPhone: '',
    borrowerMoney: '',
    needServiceFee: '',
    serviceObject: '',
    serviceMoney: '',
    participantCount: '',
    needUploadOA: '',
    remark: '',
    briefContent: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const organizations = ['', '校团委', '学生会', '校青协', '汕大青年', '踹网', '社团中心', '研会'];
  const campuses = ['', '桑浦山校区', '东海岸校区'];

  const sponsorOptions = [
    { label: '是', value: 'yes' },
    { label: '否', value: 'no' },
  ];

  const borrowOptions = [
    { label: '是', value: 'yes' },
    { label: '否', value: 'no' },
  ];

  const serviceFeeOptions = [
    { label: '是', value: 'yes' },
    { label: '否', value: 'no' },
  ];

  const uploadOAOptions = [
    { label: '是', value: 'yes' },
    { label: '否', value: 'no' },
  ];

  useEffect(() => {
    // 在组件加载时获取用户 ID
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setFormData(prevData => ({ ...prevData, userId: storedUserId }));
        } else {
          // 如果没有找到用户 ID，可能需要重定向到登录页面
          Alert.alert('错误', '用户未登录');
          navigation.navigate('ChoicePage');
        }
      } catch (error) {
        console.error('获取用户 ID 失败:', error);
      }
    };

    getUserId();
  }, []);

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.userId) {
        Alert.alert('错误', '用户未登录');
        return;
    }
    if (!formData.activityName) {
      Alert.alert('错误', '请填写活动名称');
      return;
    }
    // ... 其他字段的验证
    if (!formData.organization) {
        Alert.alert('错误', '请选择所归属的组织');
        return;
    }
    if (!formData.startDate) {
        Alert.alert('错误', '请选择起始时间');
        return;
    }
    if (!formData.endDate) {
        Alert.alert('��误', '请选择结束时间');
        return;     
    }
    if (!formData.area) {
        Alert.alert('错误', '请选择活动地点');
        return;
    }
    if (!formData.responsibleName) {
        Alert.alert('错误', '请填写负责人姓名');
        return;
    }
    if (!formData.responsibleGrade) {
        Alert.alert('错误', '请填写负责人年级');
        return;
    }
    if (!formData.responsiblePhone) {
        Alert.alert('错误', '请填写负责人电话');
        return;
    }   
    if (!formData.responsibleEmail) {
        Alert.alert('错误', '请填写负责人邮箱');
        return;
    }
    if (!formData.participantCount) {
        Alert.alert('错误', '请填写预计参与人数');
        return;
    }
    if (!formData.briefContent) {
        Alert.alert('错误', '请填写项目内容阐述');
        return;
    }
    if (!formData.budgetTotal) {
        Alert.alert('错误', '请填写活动经费预算');
        return;
    }
    if (!formData.budgetSelf) {
        Alert.alert('错误', '请填写自筹数');
        return;
    }
    if (!formData.budgetApply) {
        Alert.alert('错误', '请填写申请拨款数');
        return;
    }
    if (!formData.hasSponsor) {
        Alert.alert('错误', '请选择是否有赞助');
        return;
    }
    if (formData.hasSponsor === 'yes' && !formData.sponsorCompany) {
        Alert.alert('错误', '请填写赞助公司');
        return;
    }
    if (formData.hasSponsor === 'yes' && !formData.sponsorMoney) {
        Alert.alert('错误', '请填写赞助金额');
        return;
    }
    if (formData.needBorrow === 'yes' && !formData.borrowerName) {
        Alert.alert('错误', '请填写借款人姓名');
        return;
    }
    if (formData.needBorrow === 'yes' && !formData.borrowerGrade) {
        Alert.alert('错误', '请填写借款人年级');
        return;
    }
    if (formData.needBorrow === 'yes' && !formData.borrowerMajor) {
        Alert.alert('错误', '请填写借款人专业');
        return;
    }
    if (formData.needBorrow === 'yes' && !formData.borrowerPhone) {
        Alert.alert('错误', '请填写借款人电话');
        return;
    }
    if (formData.needBorrow === 'yes' && !formData.borrowerMoney) {
        Alert.alert('错误', '请填写借款金额');
        return;
    }
    if (formData.needServiceFee === 'yes' && !formData.serviceObject) {
        Alert.alert('错误', '请填写发放对象');
        return;
    }
    if (formData.needServiceFee === 'yes' && !formData.serviceMoney) {
        Alert.alert('错误', '请填写服务金额');
        return;
    }
    if (formData.needUploadOA === 'yes' && !formData.remark) {
        Alert.alert('错误', '请填写备注');
        return;
    }

    const formattedData = {
      ...formData,
      startDate: formData.startDate.toISOString().slice(0, 10),
      endDate: formData.endDate.toISOString().slice(0, 10),
      sponsorMoney: formData.hasSponsor === 'yes' ? formData.sponsorMoney : null,
      borrowerMoney: formData.needBorrow === 'yes' ? formData.borrowerMoney : null,
      serviceMoney: formData.needServiceFee === 'yes' ? formData.serviceMoney : null,
      
    };

    // 移除所有空字符串的字段
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === '') {
        formattedData[key] = null;
      }
    });

    try {
      const result = await addActivity(formattedData);
      Alert.alert('成功', result.message);
      navigation.navigate('MyActivities', { 
        needRefresh: true
      });
    } catch (error) {
      Alert.alert('错误', error.message);
    }
  };


  return (
    <View style={styles.container}>
        <ScrollView style={styles.container}>
        <View style={styles.apply}>
            <View style={styles.applyTitle}>
            <Text style={styles.titleText}>申请活动</Text>
            </View>
            
            {/* 活动内容 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>活动内容:</Text>
            <TextInput
                style={styles.input}
                placeholder="活动名称（必填*）"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.activityName}
                onChangeText={(text) => setFormData({...formData, activityName: text})}
            />
            </View>

            {/* 所归属的组织 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>所归属的组织:</Text>
            <Picker
                selectedValue={formData.organization}
                onValueChange={(itemValue, itemIndex) => setFormData({...formData, organization: itemValue, organizationId: itemIndex})}
                style={styles.picker}
            >
                {organizations.map((org, index) => (
                <Picker.Item key={index} label={org} value={org} />
                ))}
            </Picker>
            </View>

            {/* 起始时间 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>起始时间*</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
                <Text style={globalStyles.text}>{formData.startDate.toDateString()}</Text>
                <Icon name="calendar" size={20} color="#000" />
            </TouchableOpacity>
            {showStartDatePicker && (
                <DateTimePicker
                value={formData.startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                    setFormData({...formData, startDate: selectedDate});
                    }
                }}
                />
            )}
            </View>

            {/* 结束时间 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>结束时间*</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
                <Text style={globalStyles.text}>{formData.endDate.toDateString()}</Text>
                <Icon name="calendar" size={20} color="#000" />
            </TouchableOpacity>
            {showEndDatePicker && (
                <DateTimePicker
                value={formData.endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                    setFormData({...formData, endDate: selectedDate});
                    }
                }}
                />
            )}
            </View>

            {/* 活动地点 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>活动地点*</Text>
            <Picker
                selectedValue={formData.area}
                onValueChange={(itemValue) => setFormData({...formData, area: itemValue})}
                style={styles.picker}
            >
                {campuses.map((campus, index) => (
                <Picker.Item key={index} label={campus} value={campus} />
                ))}
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="具体地点（必填*）"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.activityPlace}
                onChangeText={(text) => setFormData({...formData, activityPlace: text})}
            />
            </View>

            {/* 负责人信息 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>负责人信息 *</Text>
            <TextInput
                style={styles.input}
                placeholder="负责人姓名(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.responsibleName}
                onChangeText={(text) => setFormData({...formData, responsibleName: text})}
            />
            <TextInput
                style={styles.input}
                placeholder="负责人年级(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.responsibleGrade}
                onChangeText={(text) => setFormData({...formData, responsibleGrade: text})}
            />
            <TextInput
                style={styles.input}
                placeholder="负责人电话(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.responsiblePhone}
                onChangeText={(text) => setFormData({...formData, responsiblePhone: text})}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="负责人邮箱(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.responsibleEmail}
                onChangeText={(text) => setFormData({...formData, responsibleEmail: text})}
                keyboardType="email-address"
            />
            </View>

            {/* 预计参与人数 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>预计参与人数 *</Text>
            <TextInput
                style={styles.input}
                placeholder="预计参与人数(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.participantCount}
                onChangeText={(text) => setFormData({...formData, participantCount: text})}
                keyboardType="numeric"  
            />
            </View>

            {/* 项目内容阐述 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>项目内容阐述 *</Text>
            <TextInput
                style={styles.input}
                placeholder="项目内容阐述(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.briefContent}
                onChangeText={(text) => setFormData({...formData, briefContent: text})}
                multiline={true}
                numberOfLines={4}
            />
            </View>


            {/* 活动经费预算 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>活动经费预算 *</Text>
            <TextInput
                style={styles.input}
                placeholder="合计：xx元"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.budgetTotal}
                onChangeText={(text) => setFormData({...formData, budgetTotal: text})}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="自筹数：xx元"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.budgetSelf}
                onChangeText={(text) => setFormData({...formData, budgetSelf: text})}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="申请拨款数：xx元"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.budgetApply}
                onChangeText={(text) => setFormData({...formData, budgetApply: text})}
                keyboardType="numeric"
            />
            </View>
        

            {/* 是否有赞助 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>是否有赞助 *</Text>
            <RadioButton
                options={sponsorOptions}
                selectedValue={formData.hasSponsor}
                onSelect={(value) => setFormData({...formData, hasSponsor: value})}
                style={styles.radioButton}
            />
            </View>

            {formData.hasSponsor === 'yes' && (
            <View style={styles.formSection}>
                <Text style={styles.subtitle}>赞助相关信息 *</Text>
                <TextInput
                style={styles.input}
                placeholder="赞助公司(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.sponsorCompany}
                onChangeText={(text) => setFormData({...formData, sponsorCompany: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="赞助形式"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.sponsorForm}
                onChangeText={(text) => setFormData({...formData, sponsorForm: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="赞助金额(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.sponsorMoney}
                onChangeText={(text) => setFormData({...formData, sponsorMoney: text})}
                keyboardType="numeric"
                />
            </View>
            )}

            {/* 是否需要借款 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>是否需要借款 *</Text>
            <RadioButton
                options={borrowOptions}
                selectedValue={formData.needBorrow}
                onSelect={(value) => setFormData({...formData, needBorrow: value})}
                style={styles.radioButton}
            />
            </View>

            {formData.needBorrow === 'yes' && (
            <View style={styles.formSection}>
                <Text style={styles.subtitle}>借款相关信息 *</Text>
                <TextInput
                style={styles.input}
                placeholder="借款人姓名(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.borrowerName}
                onChangeText={(text) => setFormData({...formData, borrowerName: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="借款人年级(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.borrowerGrade}
                onChangeText={(text) => setFormData({...formData, borrowerGrade: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="借款人专业(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.borrowerMajor}
                onChangeText={(text) => setFormData({...formData, borrowerMajor: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="借款人电话(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.borrowerPhone}
                onChangeText={(text) => setFormData({...formData, borrowerPhone: text})}
                keyboardType="phone-pad"
                />
                <TextInput
                style={styles.input}
                placeholder="借款金额(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.borrowerMoney}
                onChangeText={(text) => setFormData({...formData, borrowerMoney: text})}
                keyboardType="numeric"
                />
            </View>
            )}

            {/* 是否需要申请发放教师劳务费 */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>是否需要申请发放教师劳务费 *</Text>
            <RadioButton
                options={serviceFeeOptions}
                selectedValue={formData.needServiceFee}
                onSelect={(value) => setFormData({...formData, needServiceFee: value})}
                style={styles.radioButton}
            />
            </View>

            {formData.needServiceFee === 'yes' && (
            <View style={styles.formSection}>
                <Text style={styles.subtitle}>教师劳务费相关信息 *</Text>
                <TextInput
                style={styles.input}
                placeholder="发放对象(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.serviceObject}
                onChangeText={(text) => setFormData({...formData, serviceObject: text})}
                />
                <TextInput
                style={styles.input}
                placeholder="服务金额(必填)"
                placeholderTextColor={globalStyles.placeholderText.color}
                value={formData.serviceMoney}
                onChangeText={(text) => setFormData({...formData, serviceMoney: text})}
                keyboardType="numeric"
                />
            </View>
            )}

            {/* 是否需要上传OA */}
            <View style={styles.formSection}>
            <Text style={styles.subtitle}>是否需要上传OA *</Text>
            <RadioButton
                options={uploadOAOptions}
                selectedValue={formData.needUploadOA}
                onSelect={(value) => setFormData({...formData, needUploadOA: value})}
                style={styles.radioButton}
            />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>提交</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
        <BottomTabNavigator />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 改为纯白色背景
  },
  apply: {
    marginHorizontal: 15,
  },
  applyTitle: {
    height: 45,
    borderBottomWidth: 2.5,
    borderBottomColor: '#333333', // 加深边框颜色
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15, // 增加底部间距
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'Segoe UI',
    fontWeight: 'bold', // 加粗标题
    color: '#000000', // 使用纯黑色
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600', // 增加字重
    color: '#B22222', // 使用更深的红色
    marginBottom: 10,
    marginTop: 15, // 增加顶部间距
  },
  picker: {
    borderWidth: 1,
    borderColor: '#cccccc', // 加深边框颜色
    borderRadius: 15,
    padding: 0,
    marginBottom: 15,
    backgroundColor: '#f8f8f8', // 添加浅灰色背景
    color: '#000000',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#cccccc', // 加深边框颜色
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // 添加浅灰色背景
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc', // 加深边框颜色
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    fontSize: 16, // 增加字体大小
    color: '#000000', // 使用纯黑色文字
    backgroundColor: '#ffffff', // 确保输入框背景为白色
  },
  submitButton: {
    backgroundColor: '#B22222', // 使用更深的红色
    borderRadius: 40,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18, // 增加字体大小
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20, // 增加表单部分之间的间距
  },
});

export default ApplyActivityPage;