import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig.js";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        name: name,
        gender: gender,
        birthdate: birthdate,
      });
      alert("User registered successfully!");
      router.push("/login"); // 登録成功後にログインページにリダイレクト
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      <div className="relative min-h-screen flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold py-6">新規登録</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form
          onSubmit={handleSignUp}
          className="w-full max-w-md"
          style={{ width: "326px" }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">
                名前（ニックネーム）
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">性別</label>
              <div className="flex items-center mt-1 space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  男性
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  女性
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">生年月日</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Image
                    src={
                      showPassword
                        ? "/icon/indicative-icon.png"
                        : "/icon/Non-indicative-icon.png"
                    }
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">パスワード（確認）</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <Image
                    src={
                      showConfirmPassword
                        ? "/icon/indicative-icon.png"
                        : "/icon/Non-indicative-icon.png"
                    }
                    alt={
                      showConfirmPassword ? "Hide Password" : "Show Password"
                    }
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center flex-col mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
                style={{ width: "80%", fontSize: "18px" }}
              >
                登録
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
