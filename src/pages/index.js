import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth, storage } from "../firebaseConfig.js";
import { useRouter } from "next/router";

const Home = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // リダイレクトする
    router.push("/login");
  }, [router]); // 依存関係配列に router を追加

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersList);
    };

    fetchData();
  }, []);

  return null; // リダイレクトのために何も表示しない
};

export default Home;
