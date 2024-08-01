import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../firebaseAuth";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Image from "next/image";

const Top = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const { user } = useAuth();

  const updateDate = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    setCurrentDate(`${year}年${month}月${day}日（${dayOfWeek}）`);
  }, []);

  const fetchParticipationData = useCallback(async () => {
    if (!user) return;

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    const q = query(
      collection(db, "teams"),
      where("createdate", "==", formattedDate)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const teamDoc = querySnapshot.docs[0];
      const participantsQuery = query(
        collection(db, "participation"),
        where("teams_id", "==", teamDoc.id)
      );
      const participantsSnapshot = await getDocs(participantsQuery);

      const participantsList = participantsSnapshot.docs.map((doc) => {
        const participantData = doc.data();
        return {
          id: doc.id,
          name: participantData.name,
          user_id: participantData.user_id,
          uid: participantData.uid,
          status: participantData.status,
        };
      });
      setParticipants(
        participantsList.filter((participant) => participant.status === "参加")
      );

      // Check if user is participating
      const userParticipant = participantsList.find(
        (participant) => participant.uid === user.uid
      );

      setIsParticipating(userParticipant && userParticipant.status === "参加");
    } else {
      setParticipants([]);
      setIsParticipating(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      updateDate();
      fetchParticipationData();
    } else {
      setParticipants([]);
      setIsParticipating(false);
    }
  }, [user, updateDate, fetchParticipationData]);

  const handleParticipation = async () => {
    if (!user) return;

    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    const q = query(
      collection(db, "teams"),
      where("createdate", "==", formattedDate)
    );
    const querySnapshot = await getDocs(q);

    let teamId;
    if (querySnapshot.empty) {
      const newTeam = await addDoc(collection(db, "teams"), {
        createdate: formattedDate,
        status: "未完了",
      });
      teamId = newTeam.id;
    } else {
      const teamDoc = querySnapshot.docs[0];
      teamId = teamDoc.id;
    }

    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", user.uid)
    );
    const userDoc = await getDocs(userQuery);
    const userId = userDoc.docs[0].id;
    const userData = userDoc.docs[0]?.data();

    const participationQuery = query(
      collection(db, "participation"),
      where("teams_id", "==", teamId),
      where("user_id", "==", userId)
    );
    const participationSnapshot = await getDocs(participationQuery);

    if (!participationSnapshot.empty) {
      const participationDoc = participationSnapshot.docs[0];
      await updateDoc(doc(db, "participation", participationDoc.id), {
        status: isParticipating ? "退出" : "参加",
      });
      if (isParticipating) {
        setParticipants((prev) =>
          prev.filter((participant) => participant.user_id !== userId)
        );
      } else {
        setParticipants((prev) => [
          ...prev,
          {
            id: participationDoc.id,
            user_id: userId,
            uid: user.uid,
            name: userData?.name || "Unknown",
          },
        ]);
      }
    } else {
      const newParticipation = await addDoc(collection(db, "participation"), {
        user_id: userId,
        uid: user.uid,
        teams_id: teamId,
        status: "参加",
        name: userData?.name || "Unknown",
        participationDate: formattedDate,
      });
      setParticipants((prev) => [
        ...prev,
        {
          id: newParticipation.id,
          user_id: userId,
          uid: user.uid,
          name: userData?.name || "Unknown",
        },
      ]);
    }

    setIsParticipating(!isParticipating);
  };

  return (
    <div className="fixed inset-0 bg-white">
      <div className="relative min-h-screen">
        <div className="fixed top-0 left-0 w-full py-8 z-10 flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">{currentDate}</h1>
          <button
            onClick={fetchParticipationData}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          >
            更新
          </button>
        </div>
        <div className="flex flex-col items-center justify-center pt-32 space-y-6">
          <button
            onClick={handleParticipation}
            className={`${
              isParticipating
                ? "bg-gray-500 hover:bg-gray-700"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded w-3/5`}
          >
            {isParticipating ? "退出" : "参加"}
          </button>
          <button className="text-blue-500 font-bold py-2 px-4 border border-blue-500 hover:text-blue-800 hover:border-blue-800 rounded w-3/5">
            チームを確認
          </button>
        </div>
        <div className="flex flex-col items-center mt-12">
          <h2 className="text-xl font-bold mb-2">参加者一覧</h2>
          <p className="mb-4">合計：{participants.length}人</p>
          <div className="grid grid-cols-2 gap-4 w-full px-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`px-4 py-1 rounded text-center border ${
                  participant.uid === user.uid
                    ? "border-blue-500"
                    : "border-gray-300"
                } bg-white w-full`}
              >
                {participant.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
