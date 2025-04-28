import { useEffect, useState } from "react";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export function useAppAuth() {
  const [user, setUser]       = useState(null);
  const [initializing, setInit] = useState(true);

  useEffect(() => {
    // 1) Call your sessionInfo endpoint to exchange the cookie for a custom token
    fetch("http://localhost:8000/api/sessionInfo", {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("No session");
        return res.json();
      })
      .then(({ customToken }) => {
        // 2) Sign in the Web SDK with that token
        return signInWithCustomToken(auth, customToken);
      })
      .catch(() => {
        // no valid session → skip straight to “not logged in”
      })
      .finally(() => {
        // 3) Now wire up your onAuthStateChanged watcher
        onAuthStateChanged(auth, (u) => {
          setUser(u);
          setInit(false);
        });
      });
  }, []);

  return { user, initializing };
}