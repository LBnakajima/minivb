import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in as:", userCredential.user);
      router.push("/top"); // ログイン成功後にトップページにリダイレクト
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    router.push("/registration");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md" style={{ height: "500px" }}>
        <h2 className="text-center text-3xl font-bold mb-6">ログイン</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-none rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              パスワード
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ transform: "translateY(-12%)" }}
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
          <div className="flex items-center justify-center flex-col">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              style={{ width: "80%", fontSize: "18px" }}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="inline-block align-baseline font-bold text-blue-500 hover:text-blue-800 hover:border-blue-800 py-2 px-4 border border-blue-500 rounded"
              style={{ width: "80%", fontSize: "18px" }}
            >
              新規登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
