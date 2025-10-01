// app/user/app.js
import "abort-controller/polyfill"; // ✅ 제일 위에 추가
import StartScreen from "./start"; // 같은 폴더니까 ./start


export default function App() {
  return <StartScreen />;
}

