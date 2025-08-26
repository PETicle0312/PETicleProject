import React, { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";

export default function AdminDetailScreen() {
  // ===== 기본 세팅 =====
  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const { school, address, deviceId } = useLocalSearchParams();
  console.log("👉 school:", school);
console.log("👉 address:", address);
console.log("👉 deviceId:", deviceId);

  // ===== 상태값 =====
  const [showNfcPopup, setShowNfcPopup] = useState(false);
  const [checkLogs, setCheckLogs] = useState([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [percent, setPercent] = useState(90);

  // ===== 최근 6개월 =====
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
        `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}.${String(d.getDate()).padStart(2, "0")}`;

      monthPeriodMap[label] = { start: format(startDate), end: format(endDate) };
    }

    return { monthList, monthPeriodMap };
  }

  const { monthList, monthPeriodMap } = generateRecentMonthsWithPeriod(6);
  const [selectedMonth, setSelectedMonth] = useState(monthList[0]);
  const period = monthPeriodMap[selectedMonth] || { start: "", end: "" };

  // ===== 라벨 → YYYY-MM =====
  const toYearMonth = (label) => {
    const [year, month] = label.replace("년", "").replace("월", "").trim().split(" ");
    return `${year}-${month.padStart(2, "0")}`;
  };

  // ===== 데이터 가져오기 =====
    useEffect(() => {
      console.log("👉 deviceId:", deviceId);
console.log("👉 selectedMonth:", selectedMonth);

      const fetchLogs = async () => {
        try {
          const response = await axios.get(
            `http://172.30.1.66:8080/api/device-logs/${deviceId}`,
            { params: { yearMonth: toYearMonth(selectedMonth) } }
          );
          console.log("✅ 서버 응답:", response.data); // 👉 확인 로그
          console.log("📌 변환된 yearMonth:", toYearMonth(selectedMonth));
          const formatted = response.data.map((log) => {
            const dateObj = new Date(log.logTime);
            const yearMonth = `${dateObj.getFullYear()}년 ${String(
              dateObj.getMonth() + 1
            ).padStart(2, "0")}월`;
          const formattedDate = `${String(dateObj.getFullYear()).slice(2)}.${String(
            dateObj.getMonth() + 1
          ).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

          return {
            adminId: log.adminId,
            admin: log.adminName,
            date: formattedDate,
            yearMonth: yearMonth,
          };
        });

        setCheckLogs(formatted);
      } catch (error) {
        console.error("수거 로그 불러오기 실패:", error);
      }
    };

    fetchLogs();
  }, [selectedMonth, deviceId]);

  // ===== 팝업 날짜 =====
  const schoolName = school;
  const location = address;
  const now = new Date();
  const date = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}월 ${String(now.getDate()).padStart(2, "0")}일 ${
    now.getHours() < 12 ? "오전" : "오후"
  } ${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

  // ===== 바텀시트 =====
  const openSheet = () => {
    setShowMonthPicker(true);
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT - 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setShowMonthPicker(false));
  };

  // ===== 수거율 아이콘 =====
  const getLevelIcon = () => {
    if (percent === 0) return require("../../../assets/images/levelEmpty_icon.png");
    if (percent > 0 && percent <= 40) return require("../../../assets/images/levelGood_icon.png");
    if (percent >= 50 && percent <= 70) return require("../../../assets/images/levelWarn_icon.png");
    if (percent >= 80) return require("../../../assets/images/levelDanger_icon.png");
    return require("../../../assets/images/levelEmpty_icon.png");
  };

  // ===== 라우터 =====
  const router = useRouter();
  const onAlarm = () => router.push("/admin/alarm");
  const onBack = () => router.back();

  // ===== 화면 =====
  return (
    <View style={styles.container}>
      {/* NFC 팝업 */}
      <Modal visible={showNfcPopup} transparent animationType="fade">
        <View style={styles.popupBackground}>
          <View style={styles.popupBox}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowNfcPopup(false)}>
              <Text style={{ fontSize: 24, color: "#aaa" }}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.popupTitle}>
              <Text style={{ color: "#1B854D", fontWeight: "bold" }}>
                {schoolName} PETicle <Text style={{ color: "#222" }}>을</Text>
              </Text>
              {"\n"}
              <Text style={{ color: "#222", fontWeight: "bold" }}>수거 완료 하시겠습니까?</Text>
            </Text>

            <View style={styles.popupInfoWrap}>
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
              <TouchableOpacity style={styles.confirmBtn} onPress={() => {}}>
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
        <TouchableOpacity style={{ width: 40, alignItems: "flex-start" }} onPress={onBack}>
          <Image source={require("../../../assets/images/arrow_left.png")} style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAlarm}>
          <View style={styles.headerIcons}>
            <Image source={require("../../../assets/images/alarm1_icon.png")} style={[styles.icon, { marginLeft: 10 }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 학교 + 적재율 */}
      <View style={styles.statusBox}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <Image source={require("../../../assets/images/school_icon.png")} style={styles.schoolIcon} />
          <Text style={styles.schoolTitle}>{school}</Text>
        </View>

        <TouchableOpacity onPress={() => setShowNfcPopup(true)}>
          <Text>테스트로 NFC 팝업 열기</Text>
        </TouchableOpacity>

        <View style={styles.arcBox}>
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Image source={getLevelIcon()} style={{ width: 160, height: 80, resizeMode: "contain" }} />
            <Text style={styles.arcPercent}>{percent}%</Text>
            <Text
              style={[
                styles.arcAlert,
                {
                  color:
                    percent === 0
                      ? "#bbb"
                      : percent <= 40
                      ? "#2DA25A"
                      : percent <= 70
                      ? "#F3B32F"
                      : "#E94234",
                },
              ]}
            >
              {percent === 0 ? "비어있음" : percent <= 40 ? "양호" : percent <= 70 ? "주의" : "수거필요"}
            </Text>
          </View>
        </View>
        <Text style={styles.deviceNum}>페티클 번호: SDF254ER</Text>
      </View>

      {/* 월별 수거내역 */}
      <View style={styles.listBox}>
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <TouchableOpacity onPress={openSheet} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
            <Text style={styles.tableHeaderTitle}>{selectedMonth.split(" ")[1]} 수거내역</Text>
            <Image source={require("../../../assets/images/arrow_down.png")} style={{ width: 16, height: 9, marginLeft: 6 }} />
          </TouchableOpacity>
          <Text style={styles.tableHeaderPeriod}>
            {period.start} ~ {period.end}
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>날짜</Text>
            <Text style={styles.tableCell}>관리자</Text>
            <Text style={styles.tableCell}>관리자 번호</Text>
          </View>
          {checkLogs
            .filter((row) => row.yearMonth === selectedMonth)
            .map((row, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{row.date}</Text>
                <Text style={styles.tableCell}>{row.admin}</Text>
                <Text style={styles.tableCell}>{row.adminId}</Text>
              </View>
            ))}
        </ScrollView>
      </View>

      {/* 바텀시트 */}
      {showMonthPicker && (
        <>
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: 10,
            }}
            onPress={closeSheet}
          />
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 400,
              backgroundColor: "#fff",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              zIndex: 20,
              padding: 20,
              top: slideAnim,
            }}
          >
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>조회 월 선택</Text>
              <Pressable onPress={closeSheet}>
                <Text style={{ fontSize: 24, color: "#aaa" }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 270 }}>
              {monthList.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={styles.monthItem}
                  onPress={() => {
                    setSelectedMonth(month);
                    closeSheet();
                  }}
                >
                  <Text style={[styles.monthText, month === selectedMonth && { color: "#2DA25A", fontWeight: "bold" }]}>{month}</Text>
                  {month === selectedMonth && (
                    <Image source={require("../../../assets/images/check_icon.png")} style={{ width: 18, height: 14, marginRight: 5 }} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

// ===== 스타일 =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F6",
    paddingTop: 36,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#888",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  schoolIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 6,
  },
  schoolTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
  },
  statusBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  arcBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  arcPercent: {
    position: "absolute",
    top: 30,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  arcAlert: {
    position: "absolute",
    top: 60,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  deviceNum: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 5,
  },
  listBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tableHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  tableHeaderPeriod: {
    fontSize: 13,
    color: "#888",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 0.6,
    borderColor: "#eee",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    color: "#444",
    fontSize: 14,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    paddingLeft: 10,
    marginTop: 10,
  },
  monthItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: "#F3F3F3",
    justifyContent: "space-between",
  },
  monthText: { fontSize: 16, color: "#222", paddingLeft: 10 },
  // 팝업
  popupBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 32,
    paddingHorizontal: 22,
    alignItems: "center",
    position: "relative",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 2 },
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  popupTitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 18,
    fontWeight: "bold",
    color: "#222",
    marginTop: 20,
  },
  popupInfoWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 2,
  },
  popupInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  popupInfoLabelCol: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  popupInfoValueCol: {
    alignItems: "flex-start",
  },
  popupInfoLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#222",
    marginBottom: 12,
    minWidth: 62,
    textAlign: "left",
    lineHeight: 12,
  },
  popupInfoValue: {
    fontSize: 12,
    color: "#444",
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    gap: 2,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: "#209356",
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 4,
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    borderRadius: 7,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 4,
  },
  cancelBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
