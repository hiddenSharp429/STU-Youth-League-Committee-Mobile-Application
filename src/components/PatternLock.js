import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const PATTERN_SIZE = width * 0.8;
const POINT_RADIUS = PATTERN_SIZE / 20;

const PatternLock = ({ onSuccess, onFailure }) => {
  const [pattern, setPattern] = useState([]);
  const [layout, setLayout] = useState(null);

  const correctPattern = [0, 1, 2, 5, 8]; // 正确的密码模式

  const points = [
    { x: PATTERN_SIZE / 6, y: PATTERN_SIZE / 6 },
    { x: PATTERN_SIZE / 2, y: PATTERN_SIZE / 6 },
    { x: PATTERN_SIZE * 5 / 6, y: PATTERN_SIZE / 6 },
    { x: PATTERN_SIZE / 6, y: PATTERN_SIZE / 2 },
    { x: PATTERN_SIZE / 2, y: PATTERN_SIZE / 2 },
    { x: PATTERN_SIZE * 5 / 6, y: PATTERN_SIZE / 2 },
    { x: PATTERN_SIZE / 6, y: PATTERN_SIZE * 5 / 6 },
    { x: PATTERN_SIZE / 2, y: PATTERN_SIZE * 5 / 6 },
    { x: PATTERN_SIZE * 5 / 6, y: PATTERN_SIZE * 5 / 6 },
  ];

  const handlePointPress = (index) => {
    if (pattern.includes(index)) {
      // 如果点已经被选中，不做任何操作
      return;
    }

    const newPattern = [...pattern, index];
    setPattern(newPattern);

    if (newPattern.length === correctPattern.length) {
      // 当用户输入的密码长度等于正确密码长度时，进行验证
      if (comparePatterns(newPattern, correctPattern)) {
        onSuccess();
      } else {
        onFailure();
      }
      setPattern([]); // 重置密码
    }
  };

  const comparePatterns = (pattern1, pattern2) => {
    if (pattern1.length !== pattern2.length) return false;
    return pattern1.every((point, index) => point === pattern2[index]);
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => setLayout(event.nativeEvent.layout)}
    >
      {points.map((point, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.point,
            {
              left: point.x - POINT_RADIUS,
              top: point.y - POINT_RADIUS,
            },
            pattern.includes(index) && styles.selectedPoint,
          ]}
          onPress={() => handlePointPress(index)}
        />
      ))}
      {pattern.map((pointIndex, index) => {
        if (index < pattern.length - 1) {
          const start = points[pointIndex];
          const end = points[pattern[index + 1]];
          return (
            <View
              key={`line-${index}`}
              style={[
                styles.line,
                {
                  left: start.x,
                  top: start.y,
                  width: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)),
                  transform: [
                    {
                      rotate: `${Math.atan2(end.y - start.y, end.x - start.x)}rad`,
                    },
                  ],
                },
              ]}
            />
          );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PATTERN_SIZE,
    height: PATTERN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  point: {
    position: 'absolute',
    width: POINT_RADIUS * 2,
    height: POINT_RADIUS * 2,
    borderRadius: POINT_RADIUS,
    backgroundColor: '#ccc',
  },
  selectedPoint: {
    backgroundColor: '#007AFF',
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007AFF',
    transformOrigin: 'left',
  },
});

export default PatternLock;