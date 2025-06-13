import { FontAwesome } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import styles from "./styles/GameMainScreenStyles";
import axios from "axios"; // ← 백엔드 API 요청을 위해 추가
import { useRoute } from '@react-navigation/native';


export default function GameMainScreen() {
  const route = useRoute();
  const {
    userId = "guest",
    characterName = "blue",
    lives: initialLives = 3,
    recycleCount = 0,
    highestScore = 0,
  } = route.params || {};
  const [modalType, setModalType] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState("blue");
  const [recycleData, setRecycleData] = useState([]);
  const [lives, setLives] = useState(initialLives);//현재 목숨숨
  const [score, setScore] = useState(highestScore);
  const [totalRecycleCount, setTotalRecycleCount] = useState(recycleCount);




  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  useEffect(() => {
  const fetchRecycleData = async () => {
    try {

      // ✅ 요청 보내기 전 확인 로그!
      console.log("📡 재활용 내역 요청 보냄:", userId);

      const response = await axios.get(
        `http://192.168.219.106:8080/api/device/logs/${userId}`,
        { timeout: 20000 }
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

      setRecycleData(transformed.reverse());//최신순 정렬
      setTotalRecycleCount(total);
    } catch (error) {
      console.error("재활용 내역 불러오기 실패", error);
    }
  };

  fetchRecycleData();
}, []);

useEffect(() => {
  const baseLives = Number(route.params?.lives ?? 3); // ← 강제 숫자 변환!
  const earned = Number(totalRecycleCount); // ← 이것도 숫자 변환!
  setLives(baseLives + earned);
}, [totalRecycleCount,route.params?.lives]);


  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.count}개</Text>
      <Text style={styles.cell}>{item.total}개</Text>
    </View>
  );



  // ✅ [추가] 게임 결과 POST 요청 함수
  const submitGameResult = async () => {
    try {
      const response = await axios.post(
        "http://<백엔드_IP>:8080/game/result",
        {
          userId: userId,
          classificationResult: "CLEAN", // 예: CLEAN, WRONG, UNKNOWN
        }
      );

      const result = response.data;
      setScore(result.score);
      setLives(result.totalLives);
      fetchRecycleData();
      
    } catch (error) {
      console.error("❌ 게임 결과 전송 실패", error);
    }
  };

  //캐릭터 선택
  const characters = [
    { id: "blue", image: require("../../assets/images/bluehead.png") },
    { id: "orange", image: require("../../assets/images/orangehead.png") },
    { id: "purple", image: require("../../assets/images/purplehead.png") },
    { id: "green", image: require("../../assets/images/greenhead.png") },
  ];

  // 순위현황데이터
  const rankingData = [
    { id: "peticle0312", score: "10,240" },
    { id: "peticle0312", score: "10,240" },
    { id: "peticle0312", score: "9,240" },
    { id: "peticle0312", score: "6,240" },
    { id: "peticle0312", score: "1,240" },
  ];

  // 재활용데이터
  // recycleData = [
  //   { date: "2024-06-01", count: "1", total: "12" },
  //   { date: "2024-06-01", count: "1", total: "11" },
  //   { date: "2024-06-01", count: "2", total: "10" },
  //   { date: "2024-06-01", count: "2", total: "9" },
  //   { date: "2024-06-01", count: "2", total: "7" },
  //   { date: "2024-06-01", count: "1", total: "5" },
  //   { date: "2024-06-01", count: "1", total: "3" },
  // ];

  return (
    <View style={styles.container}>
      {/* 캐릭터 배경 */}
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
            <Text style={styles.profileText}>{userId}님</Text>
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
              <Text style={[styles.statText, { marginHorizontal: 6 }]}>&ensp;&ensp;{lives}</Text>
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
              <Text style={[styles.statText, { marginHorizontal: 6 }]}>&ensp;&ensp;{totalRecycleCount}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* 플레이 버튼 */}
      {modalType === null && (
        <View style={styles.centerWrapper}>
          <Pressable
            onPress={() => console.log("게임 시작")}
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.playButtonPressed,
            ]}
          >
            <Image
              source={require("../../assets/images/play.png")}
              style={styles.playImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      )}

      {/* ---------------------------------------------------------------------------------------------------------------------- */}
      {/* 프로필 모달 */}
      {modalType === "profile" && (
        <View style={styles.modalOverlay}>
          <View style={styles.characterModal}>
            {/* 상단 헤더 */}
            <View style={styles.charactermodalHeader}>
              <Text style={styles.charactermodalTitle}>
                PETicle 캐릭터 선택
              </Text>
              <Pressable onPress={() => setModalType(null)}>
                <Text style={{ fontSize: 22 }}>✕</Text>
              </Pressable>
            </View>

            {/* 캐릭터 선택 라인 */}
            <View style={styles.characterRow}>
              {characters.map((char, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedCharacter(char.id)}
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
          </View>
        </View>
      )}

      {/*순위 모달 */}

      {modalType === "ranking" && (
        <View style={styles.modalOverlay}>
          <View style={styles.rankingModal}>
            {/* 헤더 */}
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

            {/* 표 헤더 */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>순위</Text>
              <Text style={styles.headerCell}>아이디</Text>
              <Text style={styles.headerCell}>점수</Text>
            </View>

            {/* 표 내용 */}
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

      {/* 페트병 모달 */}
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

            {/* 표 헤더 */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>날짜</Text>
              <Text style={styles.headerCell}>오늘의 PET 개수</Text>
              <Text style={styles.headerCell}>누적 수거량</Text>
            </View>

            {/* 표 내용 */}
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
