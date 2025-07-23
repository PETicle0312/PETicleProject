import React, { useRef, useState } from 'react';
import { useRouter , useLocalSearchParams } from 'expo-router';
import { Modal, Button, Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function AdminDetailScreen() {
    const SCREEN_HEIGHT = Dimensions.get('window').height;    
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const { school } = useLocalSearchParams(); //학교데이터

    const [showNfcPopup, setShowNfcPopup] = useState(false); //NFC인식

    // 예시 데이터
    const schoolName = "대중세무고등학교";
    const date = "2025-03-11(화) 12:44";
    const location = "서울 종로구 계동길 84-10";
    const deviceId = "IXFG12345DW";

    //바텀시트 open
    const openSheet = () => {
    setShowMonthPicker(true);
    Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT - 400, // 320: 바텀시트 높이
        duration: 300,
        useNativeDriver: false,
    }).start();
    };

    //바텀시트 close
    const closeSheet = () => {
    Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: false,
    }).start(() => setShowMonthPicker(false));
    };
    
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    function generateRecentMonthsWithPeriod(count = 6) {
    const monthList = [];
    const monthPeriodMap = {};
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const label = `${year}년 ${month}월`;
      monthList.push(label);

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const format = (d) =>
        `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

      monthPeriodMap[label] = {
        start: format(startDate),
        end: format(endDate),
      };
    }

    return { monthList, monthPeriodMap };
  }

    const { monthList, monthPeriodMap } = generateRecentMonthsWithPeriod(6);
    const [selectedMonth, setSelectedMonth] = useState(() => monthList[0]);
    const period = monthPeriodMap[selectedMonth] || { start: '', end: '' };

  // 테이블용 가짜 데이터
  const tableData = Array.from({ length: 10 }).map((_, i) => ({
    date: '2025-05-16',
    admin: '홍길동',
    adminId: 'SDF123WE',
    key: i + 1,
  }));

  // 1. 상태 선언 (수거 퍼센트)
  const [percent, setPercent] = useState(90); // 예시로 20%부터 시작

  // 2. 퍼센트에 따라 이미지 이름을 리턴하는 함수
  const getLevelIcon = () => {
    if (percent === 0) {
      return require('../../../assets/images/levelEmpty_icon.png');
    } else if (percent > 0 && percent <= 40) {
      return require('../../../assets/images/levelGood_icon.png');
    } else if (percent >= 50 && percent <= 70) {
      return require('../../../assets/images/levelWarn_icon.png');
    } else if (percent >= 80) {
      return require('../../../assets/images/levelDanger_icon.png');
    }
    // 혹시 해당되지 않는 구간은 levelEmpty로
    return require('../../../assets/images/levelEmpty_icon.png');
  };

    const router = useRouter();
    const onAlarm = () => {
      router.push("/admin/alarm");
    };
    const onBack = () => {
      router.back();
    };    

  return (
    <View style={styles.container}>

      {/* =========== 팝업 모달 =========== */}
      <Modal
        visible={showNfcPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNfcPopup(false)}
      >
        <View style={styles.popupBackground}>
          <View style={styles.popupBox}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowNfcPopup(false)}>
              <Text style={{ fontSize: 24, color: '#aaa' }}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.popupTitle}>
              <Text style={{ color: '#1B854D', fontWeight: 'bold' }}>{schoolName} PETicle <Text style={{color:'#222'}}>을</Text></Text>
              {'\n'}
              <Text style={{ color: '#222', fontWeight: 'bold' }}>수거 완료 하시겠습니까?</Text>
            </Text>
<View style={[styles.popupInfoWrap]}>
  <View style={styles.popupInfoRow}>
    <View style={styles.popupInfoLabelCol}>
      <Text style={styles.popupInfoLabel}>일시</Text>
      <Text style={styles.popupInfoLabel}>위치</Text>
      <Text style={styles.popupInfoLabel}>기계번호</Text>
    </View>
    <View style={styles.popupInfoValueCol}>
      <Text style={styles.popupInfoValue}>{date}</Text>
      <Text style={styles.popupInfoValue}>{location}</Text>
      <Text style={styles.popupInfoValue}>{deviceId}</Text>
    </View>
  </View>
</View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => {/* 예: 수거완료 처리 */}}>
                <Text style={styles.confirmBtnText}>예</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowNfcPopup(false)}>
                <Text style={styles.cancelBtnText}>아니요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* 상단 헤더 */}
      <View style={styles.header}>
                <TouchableOpacity style={{width: 40, alignItems: 'flex-start'}} onPress={onBack}>
                  <Image source={require('../../../assets/images/arrow_left.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
        <TouchableOpacity onPress={onAlarm}>
          <View style={styles.headerIcons}>
            <Image source={require('../../../assets/images/alarm1_icon.png')} style={[styles.icon, { marginLeft: 10 }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 학교명 + 적재율 박스 */}
      <View style={styles.statusBox}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Image source={require('../../../assets/images/school_icon.png')} style={styles.schoolIcon} />
          <Text style={styles.schoolTitle}>{school}</Text>
        </View>
              {/* 테스트용 버튼: 실제로는 NFC 인식 콜백에서 setShowNfcPopup(true) */}
      <TouchableOpacity onPress={() => setShowNfcPopup(true)}>
        <Text>테스트로 NFC 팝업 열기</Text>
      </TouchableOpacity>
        <View style={styles.arcBox}>
          {/* 반원 차트는 예시, 실제 구현은 SVG나 이미지 대체 */}

        <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Image source={getLevelIcon()} style={{ width: 160, height: 80, resizeMode: 'contain' }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginTop: 4 , position:'absolute', top: 30 ,textAlign: 'center'}}>{percent}%</Text>
        <Text
            style={{position:'absolute', top: 60 ,textAlign: 'center',
            fontSize: 15, fontWeight: 'bold', marginTop: 2,
            color:
                percent === 0
                ? '#bbb'
                : percent <= 40
                ? '#2DA25A'
                : percent <= 70
                ? '#F3B32F'
                : '#E94234',
            }}
        >
            {percent === 0
            ? '비어있음'
            : percent <= 40
            ? '양호'
            : percent <= 70
            ? '주의'
            : '수거필요'}
        </Text>
        </View>



        </View>
        <Text style={styles.deviceNum}>페티클 번호: SDF254ER</Text>
      </View>

      {/* 5월 수거내역 테이블 */}
        <View style={styles.listBox}>
            {/* 테이블 헤더 (월 선택) */}
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <TouchableOpacity
                onPress={openSheet}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}
            >
                <Text style={styles.tableHeaderTitle}>
                {selectedMonth.split(' ')[1]} 수거내역
                </Text>
                <Image source={require('../../../assets/images/arrow_down.png')} style={{ width: 16, height:9, marginLeft: 6 }} />
            </TouchableOpacity>
            
             {/* === 여기서 기간 자동 변경 === */}
            <Text style={styles.tableHeaderPeriod}>
                {period.start} ~ {period.end}
            </Text>
        </View>
        
        {/* 실제 테이블 */}
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellDate]}>날짜</Text>
            <Text style={[styles.tableCell, styles.cellAdmin]}>관리자</Text>
            <Text style={[styles.tableCell, styles.cellId]}>관리자 번호</Text>
          </View>
          {tableData.map(row => (
            <View style={styles.tableRow} key={row.key}>
              <Text style={[styles.tableCell, styles.cellDate]}>{row.date}</Text>
              <Text style={[styles.tableCell, styles.cellAdmin]}>{row.admin}</Text>
              <Text style={[styles.tableCell, styles.cellId]}>{row.adminId}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* === 드롭다운(바텀시트) 모달 === */}
{showMonthPicker && (
  <>
    {/* 1. 검정색 배경(overlay, 고정) */}
    <Pressable
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 10,
      }}
      onPress={closeSheet}
    />

    {/* 2. 바텀시트 (Animated 슬라이드) */}
    <Animated.View
      style={{
        position: 'absolute',
        left: 0, right: 0,
        height: 400,
        backgroundColor: '#fff',
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        zIndex: 20,
        padding: 20,
        top: slideAnim,
      }}
    >
      <View style={styles.bottomSheetHeader}>
        <Text style={styles.bottomSheetTitle}>조회 월 선택</Text>
        <Pressable onPress={closeSheet}>
          <Text style={{ fontSize: 24, color: '#aaa' }}>✕</Text>
        </Pressable>
      </View>
      {/* === 리스트 부분을 ScrollView로 감싼다! === */}
    <ScrollView style={{ maxHeight: 270 }}>
      {monthList.map(month => (
        <TouchableOpacity
          key={month}
          style={styles.monthItem}
          onPress={() => { setSelectedMonth(month); closeSheet(); }}
        >
          <Text style={[
            styles.monthText,
            month === selectedMonth && { color: '#2DA25A', fontWeight: 'bold' }
          ]}>
            {month}
          </Text>
          {month === selectedMonth && <Image source={require('../../../assets/images/check_icon.png')} style={{ width: 18, height: 14, marginRight: 5 }} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
    </Animated.View>
  </>
)}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F6',
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
    arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#888',
  },
  logoImage: {
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  schoolIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 6,
  },
  schoolTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  statusBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  arcBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  halfCircle: {
    width: 160, height: 80,
    borderTopLeftRadius: 80, borderTopRightRadius: 80,
    backgroundColor: '#E94234',
    justifyContent: 'flex-end', alignItems: 'center',
    marginBottom: 5
  },
  arcPercent: {
    position: 'absolute',
    left: 0, right: 0, top: 60,
    textAlign: 'center',
    fontSize: 22, fontWeight: 'bold', color: '#333',
    marginTop:-15
  },
  arcAlert: {
    position: 'absolute',
    left: 0, right: 0, top: 75,
    textAlign: 'center',
    fontSize: 15, fontWeight: 'bold', color: '#333'
  },
  deviceNum: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 5,
  },
  listBox: {
    flex: 1,
    //alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  tableHeaderTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#222',
  },
  tableHeaderPeriod: {
    fontSize: 13, color: '#888',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomWidth: 0.6, borderColor: '#eee',
    alignItems: 'center',
    paddingHorizontal: 6,
    //backgroundColor:'red'
  },
  tableCell: { color: '#444', fontSize: 14 },
  cellDate: { flex: 1 , textAlign: 'center'},
  cellAdmin: { flex: 1 , textAlign: 'center'},
  cellId: { flex: 1 , textAlign: 'center'},
  // === 바텀시트(드롭다운) 스타일 ===
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30,
    minHeight: 280,
  },
  bottomSheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 18,
  },
  bottomSheetTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#222',  paddingLeft:10, marginTop:10
  },
  monthItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 13,
    borderBottomWidth: 1, borderColor: '#F3F3F3',
    justifyContent: 'space-between'
  },
  monthText: { fontSize: 16, color: '#222', paddingLeft:10 },
  checkIcon: { color: '#2DA25A', fontSize: 18, marginLeft: 6 },

  //팝업모달
  popupBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 32,
    paddingHorizontal: 22,
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 2 },
  },
  closeBtn: {
    position: 'absolute', right: 16, top: 10, zIndex: 1,
    padding: 8,
  },
  popupTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
    //backgroundColor:'red'
  },
  popupInfoWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 2,
  },
  popupInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',  // <--- 꼭 추가!!
    justifyContent: 'center',
    marginTop:10
  },
  popupInfoLabelCol: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  popupInfoValueCol: {
    alignItems: 'flex-start',
  },
  popupInfo: {
    width: '100%',
    marginBottom: 22,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  }, 
  popupInfoLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#222',
    marginBottom: 12,
    minWidth: 62,
    textAlign: 'left',
    lineHeight: 12,
    //backgroundColor:'red' 
  },
  popupInfoValue: {
    fontSize: 12,
    color: '#444',
    marginBottom: 12,
    textAlign: 'left',
    lineHeight: 12,
    //backgroundColor:'red' 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    gap: 2,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#209356',
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 4,
  },
  cancelBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },

  
});
