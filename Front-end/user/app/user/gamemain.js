import { FontAwesome } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState, useRef } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import styles from "./styles/GameMainScreenStyles";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventSource from "react-native-sse";


const BASE_URL = "https://interempire-cayla-arcanely.ngrok-free.dev"; //ngrok 사용
const DEVICE_API = BASE_URL;

export default function GameMainScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null); //토스트 메세지
  const unreadCount = notifications.filter(n => !n.read).length;
  const idRef = useRef(0);
  const makeId = () => {
    idRef.current += 1;
    return `${Date.now()}-${idRef.current}`; // 항상 유니크
  };



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

  // 고유 ID는 이미 처리했으니, 이번엔 페이로드 중복만 막기
  const lastSeenRef = useRef({ k: null, t: 0 });

  function shouldAcceptOnce(obj, windowMs = 10000) {
    try {
      const k = JSON.stringify(obj);     // 페이로드를 해시처럼 사용
      const now = Date.now();
      if (!lastSeenRef.current || lastSeenRef.current.k !== k || (now - lastSeenRef.current.t) > windowMs) {
        lastSeenRef.current = { k, t: now };
        return true;                      // 처음 보거나 시간 창 넘어가면 허용
      }
      return false;                       // 동일 페이로드 재수신 → 무시
    } catch {
      return true;                        // 혹시 직렬화 실패하면 통과
    }
  }

  // 상단 배너 애니메이션
  const toastY = useRef(new Animated.Value(-120)).current; // 시작: 화면 위 밖
  const screen = Dimensions.get("window");
  const isLandscape = screen.width > screen.height;

  // 토스트가 바뀔 때마다 애니메이션 (내려오기 → 잠시 표시 → 올라가기)
  useEffect(() => {
    if (!toast) return;
    // 내려오기
    Animated.timing(toastY, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // 대기 후 올라가기
      setTimeout(() => {
        Animated.timing(toastY, {
          toValue: -100,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          // 끝나면 메시지 클리어
          // (다음 토스트 때 다시 내려올 수 있게)
          // 필요하면 유지
          // setToast(null);  // 자동 초기화 원하면 주석 해제
        });
      }, 2200);
    });
  }, [toast]);

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

        // 1. 날짜 오래된 순으로 정렬 (누적 계산을 위해)
        const sorted = [...data].sort(
          (a, b) => new Date(a.inputTime) - new Date(b.inputTime)
        );

        // 2. 누적(total) 계산
        let total = 0;
        const transformed = sorted.map((item) => {
          total += item.inputCount;
          return {
            date: item.inputTime.split("T")[0], // 날짜만
            count: item.inputCount.toString(),
            total: total.toString(),
          };
        });

        // 3. 최신순으로 뒤집어서 저장 (맨 위가 가장 최근, 누적이 제일 큼)
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

  // ===== SSE로 lives / recycleCount / recycleData 실시간 반영 =====
  useEffect(() => {
    if (!userId || userId === "guest") return;
    
    console.log(
      "[SSE] connect to:",
      `${BASE_URL}/api/sse/lives/${userId}?ngrok-skip-browser-warning=true`,
      "userId=", userId
    );

    const es = new EventSource(
      `${BASE_URL}/api/sse/lives/${userId}?ngrok-skip-browser-warning=true`
    );

    // ✅ 연결 로그 핸들러 두 개 (생성 직후 바로)
    es.addEventListener("open", () => console.log("[SSE] open"));
    es.addEventListener("connected", (e) =>
      console.log("[SSE] connected:", e?.data)
    );
    es.onerror = (err) => {
      console.error("SSE error:", err);
      // iOS에서 문제 시 바로 눈으로 보이게
      try { Alert.alert("SSE error", JSON.stringify(err)); } catch {}
    };

    es.onmessage = (e) => {
      console.log("[SSE] message:", e.data);
      try {
        const p = JSON.parse(e.data);
        const added = p.addedPoints ?? p.points ?? p.scoreGiven ?? p.delta ?? null;
        const total = p.currentPoints ?? p.total ?? p.newTotal ?? p.score ?? null;
        if (added !== null && total !== null && shouldAcceptOnce({ type:"points", added, total })) {

          setNotifications((prev) => [
            {
              id: makeId(),
              text: `OpenAPI 호출로 +${added} 포인트! (총 ${total})`,
              read: false,
            },
            ...prev,
          ]);
          setToast(`OpenAPI 호출로 +${added} 포인트 지급! (총 ${total})`);
          setTimeout(() => setToast(null), 2500);
        }
      } catch (_) {}
    }; 

    es.addEventListener("lives", (e) => {
      console.log("[SSE] lives raw:", e?.data);

      try {
        const data = JSON.parse(e.data);
        if (!shouldAcceptOnce({ type:"lives", ...data })) return;

        // 1. lives / totalRecycleCount 갱신
        setLives(data.totalLives);
        setTotalRecycleCount(data.totalRecycleCount);

        // 2. 새 로그 있으면 리스트에 추가
        if (data.inputTime && data.inputCount) {
          setRecycleData((prev) => {
            const newRow = {
              date: data.inputTime.split("T")[0],
              count: String(data.inputCount),
              total: String(data.totalRecycleCount),
            };
            return [newRow, ...prev]; // 최신 데이터가 맨 위로
          });

          // 🔔 알림 리스트에도 추가
          setNotifications((prev) => [
            {
              id: makeId(),
              text: `PET ${data.inputCount}개 수거됨!`,
              read: false,
            },
            ...prev,
          ]);
        }
      } catch (err) {
        console.warn("SSE parse error", err);
      }
    });

    // points 이벤트
    es.addEventListener("points", (e) => {
      console.log("[SSE] points raw:", e?.data);

      try {
        const payload = JSON.parse(e.data);
        // ✅ 백엔드 DTO 필드명이 다른 경우를 대비해 유연하게 처리
        const added =
          payload.addedPoints ?? payload.points ?? payload.scoreGiven ?? payload.delta ?? 0;
        const total =
          payload.currentPoints ?? payload.total ?? payload.newTotal ?? payload.score ?? 0;
        if (!shouldAcceptOnce({ type:"points", added, total })) return;
        
        setNotifications((prev) => [
          {
            id: makeId(),
            text: `OpenAPI 호출로 +${added} 포인트! (총 ${total})`,
            read: false,
          },
          ...prev,
        ]);

        // 🔔 포인트 지급 즉시 화면에 작은 토스트 띄우기
        setToast(`OpenAPI 호출로 +${added} 포인트 지급! (총 ${total})`);
        setTimeout(() => setToast(null), 2500);
      } catch (err) {
        console.warn("SSE points parse error", err);
      }
    });


    es.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      if (es) {
        try {
          es.close();
        } catch (err) {
          console.warn("SSE close error", err);
        }
      }
    };
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
      <View style={[styles.statusBar, { flexDirection: "row", alignItems: "center" }]}>
        {/* 왼쪽 그룹: 프로필 + 알림 */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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

          {/* 알림 아이콘 */}
          <Pressable
            onPress={() => setModalType("notifications")}
            style={{ marginLeft: 12, position: "relative" }}
          >
            <FontAwesome name="envelope" size={28} color="#fff" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  right: -6,
                  top: -6,
                  backgroundColor: "red",
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 2,
                }}
              >
                <Text style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* 오른쪽 그룹: 스탯 */}
        <View style={[styles.statsContainer, { marginLeft: "auto" }]}>
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

      {/* 알림 모달 */}
      {modalType === "notifications" && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModal}>
            <View style={styles.modalHeader}>
              <View style={styles.headerTopRow}>
                <Text style={styles.modalTitle}>알림</Text>
                <Pressable
                  onPress={() => {
                    // 닫을 때 전체 읽음 처리
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                    setModalType(null);
                  }}
                >
                  <Text style={{ fontSize: 22 }}>✕</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.scrollView}>
              {notifications.length === 0 ? (
                <Text style={{ padding: 10, color: "#888" }}>알림이 없습니다.</Text>
              ) : (
                notifications.map((n) => (
                  <Text
                    key={n.id}
                    style={{
                      fontSize: 16,
                      marginBottom: 6,
                      color: n.read ? "#888" : "#000",
                    }}
                  >
                    • {n.text}
                  </Text>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* ✅ 상단 배너 토스트 */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0, // ✅ 화면 맨 위
          left: 0,
          right: 0,
          alignItems: "center",
          transform: [{ translateY: toastY }], // 애니메이션으로 내려옴
          zIndex: 9999,
        }}
      >
        {toast ? (
          <View
            style={{
              // 상태바 높이 만큼 여백 (iPhone 안전영역 고려)
              marginTop: Platform.OS === "ios" ? 44 : 30,
              width: Math.min(Dimensions.get("window").width * 0.6, 520),
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.95)", // 살짝 투명 흰색
              borderWidth: 1,
              borderColor: "#ddd",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 8,
            }}
          >
            <FontAwesome name="bell" size={18} color="#333" />
            <Text
              numberOfLines={2}
              style={{
                color: "#222",
                fontSize: 16,
                fontWeight: "600",
                marginLeft: 8,
                includeFontPadding: false,
                textAlign: "center",
              }}
            >
              {toast}
            </Text>
          </View>
        ) : null}
      </Animated.View>


    </View>
  );
}
