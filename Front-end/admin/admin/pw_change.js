import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

// 아이콘 경로 맞게 수정!
const arrowLeft = require('../../assets/images/arrow_left.png');

export default function PasswordChangeScreen() {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
      </View>

    {/* 내용 전체 래퍼 */}
    <View style={styles.contentBox}>
        {/* 관리자 번호 */}
        <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>관리자 번호</Text>
            <Text style={styles.adminNum}>ARHS152DD</Text>
        </View>

        {/* 현재 비밀번호 */}
        <Text style={[styles.label, { marginTop: 30 }]}>현재 비밀번호</Text>
        <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
        />

        {/* 변경 비밀번호 */}
        <Text style={styles.label}>변경 비밀번호</Text>
        <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
        />
        <Text style={styles.pwDesc}>
            6~20자 / 영문, 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
        </Text>

        {/* 새 비밀번호 확인 */}
        <Text style={styles.label}>새 비밀번호 확인</Text>
        <TextInput
            style={styles.input}
            placeholder=""
            secureTextEntry
        />

        {/* 변경 버튼 */}
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>비밀번호 변경</Text>
        </TouchableOpacity>
        </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
    paddingTop: 38,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom:16,
    justifyContent: 'space-between',
    borderBottomWidth:1,
    borderBottomColor:'#ddd',
  },
  contentBox: {
    marginHorizontal: 28,   // 실제 내용 전체 감싸는 View에 적용!
    },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#888',
    position:'absolute',
    top:-12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 7,
  },
  adminNum: {
    fontSize: 14,
    color: '#BABABA',
    marginTop: 2,
    marginLeft: 2,
    marginBottom: 14,
  },
  input: {
    height: 38,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    fontSize: 15,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  pwDesc: {
    color: '#B5B5B5',
    fontSize: 11,
    marginTop: -10,
    marginBottom: 13,
    marginLeft: 2,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  buttonText: {
    fontSize: 16,
    color: '#818181',
    fontWeight: 'bold',
  },
});
