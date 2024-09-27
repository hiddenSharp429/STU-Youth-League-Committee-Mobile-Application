/*
 * @Author: hiddenSharp429 z404878860@163.com
 * @Date: 2024-09-27 19:32:00
 * @LastEditors: hiddenSharp429 z404878860@163.com
 * @LastEditTime: 2024-09-27 20:08:10
 * @FilePath: /YLC/src/components/RadioButton.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={styles.option}
          onPress={() => onSelect(item.value)}
        >
          <View style={[styles.radio, selectedValue === item.value && styles.selectedRadio]} />
          <Text style={styles.optionText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // 样式定义
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,  
    marginLeft: 10,
    marginRight: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: 'red',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
},
});

export default RadioButton;