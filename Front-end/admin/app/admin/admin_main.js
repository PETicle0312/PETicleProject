import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl, // ✅ 추가
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const BASE_URL = "http://172.18.38.26:8080";

export const options = {
  headerShown: false,
};

export default function AdminMainScreen() {
  const [hasUnreadAlarm, setHasUnreadAlarm] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // ✅ 추가
  const router = useRouter();

  // ✅ 재사용 가능한 조회 함수
  const fetchSchools = useCallback(async () => {
    try {
      const adminId = await AsyncStorage.getItem("adminId");
      const adminRegion = await AsyncStorage.getItem("adminRegion");
      console.log("🟢 로그인된 관리자 ID:", adminId);
      console.log("🟢 저장된 관리자 지역:", adminRegion);

      if (adminRegion) {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/api/school/by-region`,
            { params: { region: adminRegion } }
          );
          setSchoolList(data || []);
          console.log("🏫 지역 기반 학교 리스트:", data);
          return;
        } catch (e) {
          console.warn(
            "⚠️ by-region 실패, adminId 경로로 폴백:",
            e?.response?.status
          );
        }
      }

      const { data } = await axios.get(`${BASE_URL}/api/admin/schools`, {
        params: { adminId },
      });
      setSchoolList(data || []);
      console.log("🏫 adminId 기반 학교 리스트:", data);
    } catch (err) {
      console.error("❌ 학교 리스트 가져오기 실패:", err?.response || err);
    }
  }, []);

  // 화면 포커스될 때마다 갱신
  useFocusEffect(
    useCallback(() => {
      fetchSchools();
    }, [fetchSchools])
  );

  // ✅ 당겨서 새로고침 핸들러
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchSchools();
    } finally {
      setRefreshing(false);
    }
  }, [fetchSchools]);

  const onPrivacy = () => router.push("/admin/admin_privacy");
  const onAlarm = () => router.push("/admin/alarm");


  return (
    <View style={styles.container}>
      {/* 상단 로고/아이콘 영역 */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/text_logo.png")}
          style={styles.logoImage}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onPrivacy}>
            <Image
              source={require("../../assets/images/admin_icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAlarm}>
            <Image
              source={
                hasUnreadAlarm
                  ? require("../../assets/images/alarm2_icon.png")
                  : require("../../assets/images/alarm1_icon.png")
              }
              style={[styles.icon, { marginLeft: 10 }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableBox}>
        <View style={styles.tableHeader}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.tableHeaderTitle}>등급/기준</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tableHeaderTitle}>설명</Text>
          </View>
        </View>
        <View style={styles.tableDivider} />

        <View style={styles.tableRow}>
          <Text style={[styles.levelGood, styles.bold]}>양호</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.levelDesc}>적정 범위 내 (0%~49%)</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.levelDesc}>적재 기준에 맞게 채워짐</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.levelWarn, styles.bold]}>주의</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.levelDesc}>
              기준보다 다소 초과 (예: 50%~79%)
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.levelDesc}>다소 여유있거나 약간 과적</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.levelDanger, styles.bold]}>수거필요</Text>
        </View>
        <View style={styles.tableRow}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.levelDesc}>기준의 80% 이상 or 과적</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.levelDesc}>과적 → 위험발생</Text>
          </View>
        </View>
      </View>

      {/* 적재량 현황 리스트 */}
      <ScrollView
        style={styles.statusBox}
        contentContainerStyle={{ paddingBottom: 16 }}
        // ✅ 당겨서 새로고침 연결
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.sectionHeader}>
          <Image
            source={require("../../assets/images/pet_icon.png")}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>기계 적재량 현황</Text>
        </View>

        {schoolList.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>해당 지역 학교가 없습니다.</Text>
          </View>
        ) : (
          schoolList.map((item, index) => (
            <TouchableOpacity
              key={`${item.schoolName}-${index}`}
              onPress={() =>
                router.push({
                  pathname: "/admin/admin_details/[school]",
                  params: { 
                    school: item.schoolName,
                    address: item.address,
                    deviceId: item.deviceId,
                    loadRate: item.loadRate, 
                   },
                })
              }
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.schoolName, { fontWeight: "bold" }]}>
                  {item.schoolName}
                </Text>
                <Text
                  style={[
                    item.loadRate >= 80
                      ? styles.statusRed
                      : item.loadRate >= 50
                      ? styles.statusYellow
                      : styles.statusGreen,
                  ]}
                >
                  {item.loadRate >= 80
                    ? "수거필요"
                    : item.loadRate >= 50
                    ? "주의"
                    : "양호"}
                </Text>
              </View>
              <Text
                style={[
                  item.loadRate >= 80
                    ? styles.statusRed
                    : item.loadRate >= 50
                    ? styles.statusYellow
                    : styles.statusGreen,
                ]}
              >
                적재량 : {item.loadRate}%
              </Text>
              <Text style={styles.schoolAddr}>{item.address}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

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
  logoImage: { width: 100, height: 30, resizeMode: "contain" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { width: 28, height: 28, resizeMode: "contain" },
  statusBox: { flex: 1, backgroundColor: "transparent" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 10,
  },
  sectionIcon: { width: 22, height: 22, marginRight: 3, resizeMode: "contain" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#222" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  schoolName: { fontSize: 15, color: "#222" },
  schoolAddr: { fontSize: 13, color: "#888" },
  statusGreen: { fontSize: 15, color: "#2DA25A", fontWeight: "bold" },
  statusYellow: { fontSize: 15, color: "#F3B32F", fontWeight: "bold" },
  statusRed: { fontSize: 15, color: "#E94234", fontWeight: "bold" },

  tableBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  tableHeader: { flexDirection: "row", marginBottom: 5 },
  tableHeaderTitle: { fontWeight: "bold", fontSize: 12, color: "#222" },
  tableDivider: { height: 1, backgroundColor: "#ddd", marginBottom: 7 },
  tableRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5 },
  levelGood: { color: "#2DA25A", fontSize: 12 },
  levelWarn: { color: "#FF9D00", fontSize: 12 },
  levelDanger: { color: "#E94234", fontSize: 12 },
  levelDesc: { color: "#333", fontSize: 12, lineHeight: 18 },
  bold: { fontWeight: "bold" },
});
