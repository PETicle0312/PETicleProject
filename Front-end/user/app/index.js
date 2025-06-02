import { useRouter } from "expo-router";
import { useEffect } from "react";

import "react-native-gesture-handler";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/user/start");
    }, 10);
    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
