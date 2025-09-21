import { FontAwesome } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "./styles/GameMainScreenStyles";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.123.100:8080";
const DEVICE_API = BASE_URL;

export default function GameMainScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // ===== 로그아웃 =====
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.reset({ index: 0, routes: [{ name: "login" }] });
    } catch (e) {
      console.warn("로그아웃 에러:", e);
    }
  };

  // ===== 라우트 파라미터 =====
  const {
    userId = "guest",
    characterName = "blue",
    lives: initialLives = 3,
    recycleCount = 0,
    highestScore = 0,
  } = route.params || {};

  // ===== 상태값 =====
  const [modalType, setModalType] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterName || "blue"
  );
  const [recycleData, setRecycleData] = useState([]);
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(highestScore);
  const [totalRecycleCount, setTotalRecycleCount] = useState(recycleCount);
  const [busy, setBusy] = useState(false);

  // ===== 화면 방향 설정 =====
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  // ===== 재활용 내역 불러오기 =====
  useEffect(() => {
    const fetchRecycleData = async () => {
      try {
        console.log("📡 재활용 내역 요청 보냄:", userId);
        const response = await axios.get(
          `${DEVICE_API}/api/device/logs/${userId}`,
          {
            timeout: 20000,
          }
        );

        const data = response.data;
        let total = 0;
        const transformed = data.map((item) => {
          total += item.inputCount;
          return {
            date: item.inputTime.split("T")[0],
            count: item.inputCount.toString(),
            total: total.toString(),
          };
        });

        setRecycleData(transformed.reverse());
        setTotalRecycleCount(total);
      } catch (error) {
        console.error("재활용 내역 불러오기 실패", error);
      }
    };

    if (userId && userId !== "guest") {
      fetchRecycleData();
    }
  }, [userId]);

  // ===== 초기 목숨 반영 =====
  useEffect(() => {
    setLives(Number(initialLives));
  }, [initialLives]);

  // ===== 서버에서 하트 수 조회 =====
  const fetchLives = async () => {
    if (!userId || userId === "guest") return;
    try {
      const { data } = await axios.get(`${BASE_URL}/users/lives`, {
        params: { userId },
        timeout: 10000,
      });
      setLives(Number(data));
    } catch (e) {
      console.log("하트 조회 실패:", e?.message);
    }
  };

  useEffect(() => {
    fetchLives();
  }, [userId]);

  // ===== 게임 시작 (PLAY 버튼) =====
  const handlePlay = async () => {
    if (!userId || userId === "guest") {
      Alert.alert("안내", "로그인이 필요합니다.");
      return;
    }
    if (Number(lives) <= 0) {
      Alert.alert("하트 부족 💔", "하트가 부족합니다", [{ text: "확인" }]);
      return;
    }

    try {
      setBusy(true);
      const { data: remaining } = await axios.post(
        `${BASE_URL}/users/lives/consume`,
        null,
        { params: { userId }, timeout: 10000 }
      );

      setLives(Number(remaining));
      console.log("게임 시작! 남은 하트:", remaining);

      // TODO: Unity 화면 이동
      // navigation.navigate("UnityScreen");
    } catch (e) {
      if (e?.response?.status === 409) {
        setLives(0);
        Alert.alert("하트 부족 💔", "하트가 부족합니다");
      } else {
        Alert.alert("에러", String(e?.message ?? "네트워크 오류"));
      }
    } finally {
      setBusy(false);
    }
  };

  // ===== 캐릭터 리스트 =====
  const characters = [
    { id: "blue", image: require("../../assets/images/bluehead.png") },
    { id: "orange", image: require("../../assets/images/orangehead.png") },
    { id: "purple", image: require("../../assets/images/purplehead.png") },
    { id: "green", image: require("../../assets/images/greenhead.png") },
  ];

  // ===== 랭킹 더미 데이터 =====
  const rankingData = [
    { id: "peticle0312", score: "10,240" },
    { id: "peticle0312", score: "10,240" },
    { id: "peticle0312", score: "9,240" },
    { id: "peticle0312", score: "6,240" },
    { id: "peticle0312", score: "1,240" },
  ];

  return (
    <View style={styles.container}>
      {/* 배경 */}
      <Image
        source={require("../../assets/images/gamebackground.png")}
        style={styles.background}
        resizeMode="contain"
      />

      {/* 상단 정보바 */}
      <View style={styles.statusBar}>
        {/* 프로필 */}
        <Pressable onPress={() => setModalType("profile")}>
          <View style={styles.profileContainer}>
            <Image
              source={require("../../assets/images/greenhead.png")}
              style={styles.profileImage}
            />
            <Text style={styles.profileText}>{userId}</Text>
          </View>
        </Pressable>

        {/* 스탯 */}
        <View style={styles.statsContainer}>
          {/* 하트 */}
          <View style={styles.statGroup}>
            <View style={styles.iconCircle}>
              <FontAwesome name="heart" size={20} color="red" />
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statText, { marginHorizontal: 6 }]}>
                &ensp;&ensp;{lives}
              </Text>
            </View>
          </View>

          {/* 랭킹 */}
          <Pressable
            onPress={() => setModalType("ranking")}
            style={({ pressed }) => [
              styles.statGroup,
              pressed && { opacity: 0.6 },
            ]}
          >
            <View style={styles.iconCircle}>
              <FontAwesome name="trophy" size={22} color="#FFD700" />
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statText}>&ensp;&ensp;&ensp;0&ensp;</Text>
            </View>
          </Pressable>

          {/* 재활용 */}
          <Pressable
            onPress={() => setModalType("recycle")}
            style={({ pressed }) => [
              styles.statGroup,
              pressed && { opacity: 0.6 },
            ]}
          >
            <View style={styles.iconCircle}>
              <FontAwesome name="recycle" size={22} color="#4CAF50" />
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statText, { marginHorizontal: 6 }]}>
                &ensp;&ensp;{totalRecycleCount}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 플레이 버튼 */}
      {modalType === null && (
        <View style={styles.centerWrapper}>
          <Pressable
            onPress={handlePlay}
            disabled={busy}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.playButtonPressed,
              busy && { opacity: 0.6 },
            ]}
          >
            {busy ? (
              <ActivityIndicator />
            ) : (
              <Image
                source={require("../../assets/images/play.png")}
                style={styles.playImage}
                resizeMode="contain"
              />
            )}
          </Pressable>
        </View>
      )}

      {/* 프로필 모달 */}
      {modalType === "profile" && (
        <View style={styles.modalOverlay}>
          <View style={styles.characterModal}>
            <View style={styles.charactermodalHeader}>
              <Text style={styles.charactermodalTitle}>
                PETicle 캐릭터 선택
              </Text>
              <Pressable onPress={() => setModalType(null)}>
                <Text style={{ fontSize: 22 }}>✕</Text>
              </Pressable>
            </View>

            {/* 캐릭터 선택 */}
            <View style={styles.characterRow}>
              {characters.map((char, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelectedCharacter(char.id);
                    console.log("👉 선택된 캐릭터:", char.id);
                  }}
                  style={styles.characterOption}
                >
                  <Image source={char.image} style={styles.characterImage} />
                  {selectedCharacter === char.id && (
                    <View style={styles.checkCircle}>
                      <FontAwesome
                        name="check-circle-o"
                        size={25}
                        color="#4CAF50"
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {/* 로그아웃 버튼 */}
            <View style={styles.logoutContainer}>
              <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>로그아웃</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 랭킹 모달 */}
      {modalType === "ranking" && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModal}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTopRow}>
                <Text style={styles.modalTitle}>RANKING</Text>
                <Pressable onPress={() => setModalType(null)}>
                  <Text style={{ fontSize: 22 }}>✕</Text>
                </Pressable>
              </View>
              <Text style={styles.periodText}>
                1차 집계 기간은 1월부터 7월까지 입니다.
              </Text>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>순위</Text>
              <Text style={styles.headerCell}>아이디</Text>
              <Text style={styles.headerCell}>점수</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              {rankingData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.rowCell}>{index + 1}</Text>
                  <Text style={styles.rowCell}>{item.id}</Text>
                  <Text style={styles.rowCell}>{item.score}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 수거 내역 모달 */}
      {modalType === "recycle" && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModal}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTopRow}>
                <Text style={styles.modalTitle}>수거내역</Text>
                <Pressable onPress={() => setModalType(null)}>
                  <Text style={{ fontSize: 22 }}>✕</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>날짜</Text>
              <Text style={styles.headerCell}>오늘의 PET 개수</Text>
              <Text style={styles.headerCell}>누적 수거량</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              {recycleData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.rowCell}>{item.date}</Text>
                  <Text style={styles.rowCell}>{item.count}</Text>
                  <Text style={styles.rowCell}>{item.total}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
