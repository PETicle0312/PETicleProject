import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

// 아이콘 import
const petIcon = require('../../assets/images/pet_icon.png');
const arrowLeft = require('../../assets/images/arrow_left.png');

export default function AlarmScreen() {
  // 알림 더미 데이터
  const todayAlarms = [
    {
      key: 1,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
    {
      key: 2,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
    {
      key: 3,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
  ];
  const oldAlarms = [
    {
      key: 4,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
    {
      key: 5,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
    {
      key: 6,
      manager: 'QSD0052FG',
      school: '대중세무고등학교',
      time: '12분 전',
      device: 'SDF254ER',
    },
  ];

  // 알림 카드 컴포넌트
  const renderAlarm = (alarm) => (
    <View style={styles.alarmCard} key={alarm.key}>
      <Image source={petIcon} style={styles.alarmIcon} />
      <View style={styles.alarmTextBox}>
        <View style={styles.alarmTitleRow}>
          <Text style={styles.alarmManager}><Text style={{fontWeight:'bold'}}>관리자 {alarm.manager}</Text></Text>
          <Text style={styles.alarmTime}>{alarm.time}</Text>
        </View>
        <Text style={styles.alarmMsg}>
          {alarm.school} 페티클이 수거완료 되었습니다!
        </Text>
        <Text style={styles.alarmDevice}>페티클 번호 : {alarm.device}</Text>
      </View>
    </View>
  );

  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{width: 40, alignItems: 'flex-start'}} onPress={onBack}>
          <Image source={arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        <View style={{width: 40}} /> {/* 오른쪽 여백용 */}
      </View>

      <ScrollView contentContainerStyle={{paddingBottom:30}}>
        <Text style={styles.sectionTitle}>오늘 받은 알림</Text>
        {todayAlarms.map(renderAlarm)}
        <Text style={[styles.sectionTitle, {marginTop:28}]}>이전 알림</Text>
        {oldAlarms.map(renderAlarm)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
    paddingTop: 65,
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
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#888',
    //position:'absolute',
    //top: -12
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
    marginBottom: 9,
    marginLeft: 18,
    marginTop: 15,
  },
  alarmCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  alarmIcon: {
    width: 42,
    height: 34,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 8,
  },
  alarmTextBox: {
    flex: 1,
  },
  alarmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  alarmManager: {
    fontSize: 14,
    color: '#222',
    marginRight: 10,
  },
  alarmTime: {
    fontSize: 13,
    color: '#aaa',
    marginLeft: 4,
  },
  alarmMsg: {
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
  },
  alarmDevice: {
    fontSize: 12,
    color: '#C5C5C5',
    marginTop: 1,
  },
});
