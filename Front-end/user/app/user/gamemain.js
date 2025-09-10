// GameMainScreen.jsx
import { FontAwesome } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
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
import { useRoute } from "@react-navigation/native";

/** ⛳️ 백엔드 주소: PC의 로컬 IP */
const BASE_URL = "http://172.18.93.209:8080"; // 네 PC IP 맞게 수정
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 현재 하트 조회
async function getLives(userId) {
  const res = await api.get("/api/lives", { params: { userId } });
  return res.data;
}

// 하트 차감
async function consumeLife(userId) {
  const res = await api.post("/api/lives/consume", null, {
    params: { userId },
  });
  return res.data;
}

export default function GameMainScreen() {
  const route = useRoute();
  const {
    userId = "guest",
    characterName = "blue",
    lives: initialLives = 3,
    recycleCount = 0,
    highestScore = 0,
  } = route?.params || {};

  const [modalType, setModalType] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(
    characterName || "blue"
  );
  const [recycleData, setRecycleData] = useState([]);
  const [lives, setLives] = useState(Number(initialLives));
  const [score, setScore] = useState(highestScore);
  const [totalRecycleCount, setTotalRecycleCount] = useState(recycleCount);
  const [busy, setBusy] = useState(false);

  // ✅ 새로 추가: 하트 부족 모달
  const [noLifeModal, setNoLifeModal] = useState(false);

  // 가로 고정
  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        console.log("Orientation lock failed:", e?.message);
      }
    })();
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  // 초기 라우트값 반영
  useEffect(() => {
    setLives(Number(initialLives));
  }, [initialLives]);

  // 서버 하트 조회
  const fetchLives = async () => {
    if (!userId || userId === "guest") return;
    try {
      console.log("🔎 하트 조회 시도: /api/lives");
      const data = await getLives(userId);
      setLives(Number(data));
    } catch (e) {
      console.log("하트 조회 실패:", e?.message);
    }
  };

  // 첫 진입 시 서버값 동기화
  useEffect(() => {
    fetchLives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // PLAY: 하트 1 차감
  const handlePlay = async () => {
    if (!userId || userId === "guest") {
      Alert.alert("안내", "로그인이 필요합니다.");
      return;
    }
    if (Number(lives) <= 0) {
      setNoLifeModal(true); // ✅ 모달 열기
      return;
    }

    try {
      setBusy(true);
      console.log("▶️ 하트 차감 시도: /api/lives/consume");
      const remaining = await consumeLife(userId);
      setLives(Number(remaining));
      console.log("✅ 남은 하트:", remaining);

      // TODO: 실제 게임 시작(화면 이동/유니티 실행 등)
      // 예) navigation.navigate("UnityScreen");
    } catch (e) {
      if (e?.response?.status === 409) {
        setLives(0);
        setNoLifeModal(true); // ✅ 모달 열기
      } else {
        Alert.alert("에러", String(e?.message ?? "네트워크 오류"));
      }
    } finally {
      setBusy(false);
    }
  };

  // 캐릭터 선택 리소스
  const characters = [
    { id: "blue", image: require("../../assets/images/bluehead.png") },
    { id: "orange", image: require("../../assets/images/orangehead.png") },
    { id: "purple", image: require("../../assets/images/purplehead.png") },
    { id: "green", image: require("../../assets/images/greenhead.png") },
  ];

  // 순위 더미
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

      {/* 상단 정보 바 */}
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

        {/* 스탯들 */}
        <View style={styles.statsContainer}>
          {/* 목숨 */}
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
            disabled={busy || Number(lives) <= 0}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.playButtonPressed,
              (busy || Number(lives) <= 0) && { opacity: 0.6 },
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

      {/* ✅ 하트 부족 모달 */}
      {noLifeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModal}>
            <Text style={styles.modalTitle}>하트 부족</Text>
            <Text style={{ marginVertical: 10 }}>
              하트가 없어 게임을 시작할 수 없습니다.
            </Text>
            <Pressable
              onPress={() => setNoLifeModal(false)}
              style={styles.playButton}
            >
              <Text style={{ color: "white", fontSize: 16 }}>확인</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
