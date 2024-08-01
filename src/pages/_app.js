import "../app/globals.css";
import { AuthProvider } from "../firebaseAuth"; // firebaseAuth.jsのインポート

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
