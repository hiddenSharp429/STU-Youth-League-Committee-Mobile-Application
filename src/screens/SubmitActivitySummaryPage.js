import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import { updateActivity, API_URL } from '../api/activityApi';
import axios from 'axios';

const SubmitActivitySummaryPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const [summary, setSummary] = useState({
    practicalMember: '',
    practicalTotalMoney: '',
    practicalSponsorship: '',
    practicalApMoney: '',
    satisfactionSurveyUrl: '',
    fundDetailsUrl: '',
    activityFilesUrl: '',
    publicityLinks: [''],
    oaLinks: [''],
  });

  const [files, setFiles] = useState({
    satisfaction: null,
    fund: null,
    activityFiles: null,
  });

  const handleInputChange = (key, value) => {
    setSummary(prev => ({ ...prev, [key]: value }));
  };

  const handleLinkChange = (index, value, type) => {
    setSummary(prev => {
      const newLinks = [...prev[type]];
      newLinks[index] = value;
      return { ...prev, [type]: newLinks };
    });
  };

  const addLink = (type) => {
    setSummary(prev => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const removeLink = (type) => {
    setSummary(prev => ({
      ...prev,
      [type]: prev[type].slice(0, -1),
    }));
  };

  const pickDocument = async (type) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFiles(prev => ({ ...prev, [type]: res[0] }));
      Alert.alert('成功', '文件选择成功');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('用户取消了文件选择');
      } else {
        console.error('文件选择失败', err);
        Alert.alert('错误', '文件选择失败');
      }
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type || 'application/octet-stream', // 如果类型未知，使用通用二进制流类型
      name: file.name,
    });

    try {
      const response = await axios.post(`${API_URL}/activity/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File upload response:', response.data); // 添加日志
      return response.data.fileUrl;
    } catch (error) {
      console.error('文件上传失败', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let updatedActivity = {
        id: activity.id,
        status: 1, 
        practical_member: summary.practicalMember,
        practical_total_money: summary.practicalTotalMoney,
        practical_sponsorship: summary.practicalSponsorship,
        practical_ap_money: summary.practicalApMoney,
        publicity_links: JSON.stringify(summary.publicityLinks.filter(link => link.trim() !== '')),
        oa_links: JSON.stringify(summary.oaLinks.filter(link => link.trim() !== '')),
      };

      // 上传文件
      if (files.satisfaction) {
        updatedActivity.satisfaction_survey_url = await uploadFile(files.satisfaction);
      }
      if (files.fund) {
        updatedActivity.fund_details_url = await uploadFile(files.fund);
      }
      if (files.activityFiles) {
        updatedActivity.activity_files_url = await uploadFile(files.activityFiles);
      }

      console.log('Updated activity:', updatedActivity);
      const result = await updateActivity(updatedActivity);
      Alert.alert('成功', '活动总结提交成功', [
        { text: '确定', onPress: () => navigation.navigate('MyActivities', { needRefresh: true }) }
      ]);
    } catch (error) {
      Alert.alert('错误', '提交失败: ' + error.message);
    }
  };

  const validateForm = () => {
    if (!summary.practicalMember || !summary.practicalTotalMoney) {
      Alert.alert('错误', '请填写活动实际参与人数和总价');
      return false;
    }
    if (!files.satisfaction || !files.fund || !files.activityFiles) {
      Alert.alert('错误', '请上传所有必要的文件');
      return false;
    }
    return true;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.subtitle}>1. 活动实际参与人数:</Text>
        <TextInput
          style={styles.input}
          placeholder="必填"
          keyboardType="numeric"
          value={summary.practicalMember}
          onChangeText={(text) => handleInputChange('practicalMember', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>2. 满意度调查情况（上传附件调查表）：</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('satisfaction')}>
          <Image source={require('../../assets/icons/uploading.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>
            {files.satisfaction ? files.satisfaction.name : '上传文件'} <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>3. 项目资金实际情况（上传附件细项）</Text>
        <TextInput
          style={styles.input}
          placeholder="总价（必填*）"
          keyboardType="numeric"
          value={summary.practicalTotalMoney}
          onChangeText={(text) => handleInputChange('practicalTotalMoney', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="实际赞助金额"
          keyboardType="numeric"
          value={summary.practicalSponsorship}
          onChangeText={(text) => handleInputChange('practicalSponsorship', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="实际申请拨款金额"
          keyboardType="numeric"
          value={summary.practicalApMoney}
          onChangeText={(text) => handleInputChange('practicalApMoney', text)}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('fund')}>
          <Image source={require('../../assets/icons/uploading3.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>
            {files.fund ? files.fund.name : '上传文件'} <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>4. 活动文件（申报书，总结表，备忘录）：</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('activityFiles')}>
          <Image source={require('../../assets/icons/uploading2.png')} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>
            {files.activityFiles ? files.activityFiles.name : '上传文件'} <Text style={styles.required}>*</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>5. 宣传报道链接</Text>
        {summary.publicityLinks.map((link, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="报道链接"
            value={link}
            onChangeText={(text) => handleLinkChange(index, text, 'publicityLinks')}
          />
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => addLink('publicityLinks')}>
            <Text style={styles.buttonText}>添加输入框</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delButton} onPress={() => removeLink('publicityLinks')}>
            <Text style={styles.buttonText}>删除输入框</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tips}>注：包括该活动有关的所有宣传报道</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>6. 办公自动化链接</Text>
        {summary.oaLinks.map((link, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="请输入OA链接"
            value={link}
            onChangeText={(text) => handleLinkChange(index, text, 'oaLinks')}
          />
        ))}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => addLink('oaLinks')}>
            <Text style={styles.buttonText}>添加输入框</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delButton} onPress={() => removeLink('oaLinks')}>
            <Text style={styles.buttonText}>删除输入框</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>提交</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#D43C33',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgb(241, 241, 241)',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffb9',
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#ffffffb9',
    borderRadius: 20,
    padding: 10,
    width: '48%',
  },
  delButton: {
    backgroundColor: '#ffffffb9',
    borderRadius: 20,
    padding: 10,
    width: '48%',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  tips: {
    fontSize: 12,
    color: 'brown',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#d43030d5',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SubmitActivitySummaryPage;