/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-28 01:46:16
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-28 03:03:13
 * @FilePath: /YLC/src/screens/EditActivityPage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { updateActivity } from '../api/activityApi';
import RadioButton from '../components/RadioButton';

const EditActivityPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { activity } = route.params;
    const [editedActivity, setEditedActivity] = useState(activity);
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

    const handleChange = (key, value) => {
        setEditedActivity(prev => ({ ...prev, [key]: value }));
      };
    
    const renderSection = (title, content) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {content}
    </View>
    );

  const handleSubmit = async () => {
    try {
      const result = await updateActivity(editedActivity);
      Alert.alert('成功', '活动已更新并重新提交审核');
      navigation.navigate('MyActivities', { 
        needRefresh: true
      });
    } catch (error) {
      Alert.alert('错误', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>编辑活动</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>基本信息</Text>
        {renderSection('活动名称', 
          <TextInput
            style={styles.input}
            value={editedActivity.activity_name}
            onChangeText={(text) => handleChange('activity_name', text)}
          />
        )}
        {renderSection('开始时间', 
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
            <Text>{new Date(editedActivity.start_date).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(editedActivity.start_date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                handleChange('start_date', selectedDate.toISOString());
              }
            }}
          />
        )}
        {renderSection('结束时间', 
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
            <Text>{new Date(editedActivity.end_date).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(editedActivity.end_date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                handleChange('end_date', selectedDate.toISOString());
              }
            }}
          />
        )}
        {renderSection('活动地点', 
          <View>
            <Picker
              selectedValue={editedActivity.area}
              onValueChange={(itemValue) => handleChange('area', itemValue)}
              style={styles.picker}
            >
              {campuses.map((campus, index) => (
                <Picker.Item key={index} label={campus} value={campus} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="具体地点"
              value={editedActivity.activity_place}
              onChangeText={(text) => handleChange('activity_place', text)}
            />
          </View>
        )}
        {renderSection('组织', 
          <Picker
            selectedValue={editedActivity.organization}
            onValueChange={(itemValue) => handleChange('organization', itemValue)}
            style={styles.picker}
          >
            {organizations.map((org, index) => (
              <Picker.Item key={index} label={org} value={org} />
            ))}
          </Picker>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>负责人信息</Text>
        {renderSection('姓名', 
          <TextInput
            style={styles.input}
            value={editedActivity.responsible_name}
            onChangeText={(text) => handleChange('responsible_name', text)}
          />
        )}
        {renderSection('年级', 
          <TextInput
            style={styles.input}
            value={editedActivity.responsible_grade}
            onChangeText={(text) => handleChange('responsible_grade', text)}
          />
        )}
        {renderSection('电话', 
          <TextInput
            style={styles.input}
            value={editedActivity.responsible_phone}
            onChangeText={(text) => handleChange('responsible_phone', text)}
            keyboardType="phone-pad"
          />
        )}
        {renderSection('邮箱', 
          <TextInput
            style={styles.input}
            value={editedActivity.responsible_email}
            onChangeText={(text) => handleChange('responsible_email', text)}
            keyboardType="email-address"
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预计参与人数</Text>
        {renderSection('人数', 
          <TextInput
            style={styles.input}
            value={editedActivity.participant_count ? editedActivity.participant_count.toString() : ''}
            onChangeText={(text) => handleChange('participant_count', text)}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>项目内容阐述</Text>
        {renderSection('内容', 
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={editedActivity.brief_content}
            onChangeText={(text) => handleChange('brief_content', text)}
            multiline={true}
            numberOfLines={4}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>预算信息</Text>
        {renderSection('总预算', 
          <TextInput
            style={styles.input}
            value={editedActivity.budget_total ? editedActivity.budget_total.toString() : ''}
            onChangeText={(text) => handleChange('budget_total', text)}
            keyboardType="numeric"
          />
        )}
        {renderSection('自筹经费', 
          <TextInput
            style={styles.input}
            value={editedActivity.budget_self ? editedActivity.budget_self.toString() : ''}
            onChangeText={(text) => handleChange('budget_self', text)}
            keyboardType="numeric"
          />
        )}
        {renderSection('申请经费', 
          <TextInput
            style={styles.input}
            value={editedActivity.budget_apply ? editedActivity.budget_apply.toString() : ''}
            onChangeText={(text) => handleChange('budget_apply', text)}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>赞助信息</Text>
        {renderSection('是否有赞助', 
          <RadioButton
            options={sponsorOptions}
            selectedValue={editedActivity.has_sponsor}
            onSelect={(value) => handleChange('has_sponsor', value)}
          />
        )}
        {editedActivity.has_sponsor === 'yes' && (
          <View>
            {renderSection('赞助公司', 
              <TextInput
                style={styles.input}
                value={editedActivity.sponsor_company}
                onChangeText={(text) => handleChange('sponsor_company', text)}
              />
            )}
            {renderSection('赞助形式', 
              <TextInput
                style={styles.input}
                value={editedActivity.sponsor_form}
                onChangeText={(text) => handleChange('sponsor_form', text)}
              />
            )}
            {renderSection('赞助金额', 
              <TextInput
                style={styles.input}
                value={editedActivity.sponsor_money ? editedActivity.sponsor_money.toString() : ''}
                onChangeText={(text) => handleChange('sponsor_money', text)}
                keyboardType="numeric"
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>借款信息</Text>
        {renderSection('是否需要借款', 
          <RadioButton
            options={borrowOptions}
            selectedValue={editedActivity.need_borrow}
            onSelect={(value) => handleChange('need_borrow', value)}
          />
        )}
        {editedActivity.need_borrow === 'yes' && (
          <View>
            {renderSection('借款人姓名', 
              <TextInput
                style={styles.input}
                value={editedActivity.borrower_name}
                onChangeText={(text) => handleChange('borrower_name', text)}
              />
            )}
            {renderSection('借款人年级', 
              <TextInput
                style={styles.input}
                value={editedActivity.borrower_grade}
                onChangeText={(text) => handleChange('borrower_grade', text)}
              />
            )}
            {renderSection('借款人电话', 
              <TextInput
                style={styles.input}
                value={editedActivity.borrower_phone}
                onChangeText={(text) => handleChange('borrower_phone', text)}
                keyboardType="phone-pad"
              />
            )}
            {renderSection('借款金额', 
              <TextInput
                style={styles.input}
                value={editedActivity.borrower_money ? editedActivity.borrower_money.toString() : ''}
                onChangeText={(text) => handleChange('borrower_money', text)}
                keyboardType="numeric"
              />
            )}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionHeader}>教师劳务费</Text>
        {renderSection('是否需要申请发放教师劳务费', 
          <RadioButton
            options={serviceFeeOptions}
            selectedValue={editedActivity.need_service_fee}
            onSelect={(value) => handleChange('need_service_fee', value)}
          />
        )}
        {editedActivity.need_service_fee === 'yes' && (
          <View>
            {renderSection('发放对象', 
              <TextInput
                style={styles.input}
                value={editedActivity.service_object}
                onChangeText={(text) => handleChange('service_object', text)}
              />
            )}
            {renderSection('服务金额', 
              <TextInput
                style={styles.input}
                value={editedActivity.service_money ? editedActivity.service_money.toString() : ''}
                onChangeText={(text) => handleChange('service_money', text)}
                keyboardType="numeric"
              />
            )}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>重新提交</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
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
    marginTop: 20,
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
  submitButton:{
    backgroundColor: '#4CAF50',
    padding: 20,
    marginTop: 10,
  },
  submitButtonText:{
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  }

});

export default EditActivityPage;