import { useEffect, useState } from "react";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

export function useAppAuth(auth) {

  const [user, setUser] = useState(null);
  const [initializing, setInit] = useState(true);
  useEffect(() => {


    fetch("https://auth.getfulfil.com/api/sessionInfo", {
      // fetch("http://localhost:8000/api/sessionInfo", {
      credentials: "include",
    })
    .then(async (res) => {
      if (!res.ok) throw new Error("No session");
      const data = await res.json();
   

      // if your server returns { customToken: null } or missing…
      if (!data.customToken) throw new Error("No session");

      // 2) Sign in
      await signInWithCustomToken(auth, data.customToken);

      // 3) Only now wire the watcher
      const unsubscribe = onAuthStateChanged(auth, u => {
        setUser(u);
        setInit(false);
      });

      return () => unsubscribe();
    })
    .catch(() => {

      console.log("landing catch")
      // No session at *all* → skip watcher, go straight to "not logged in"
      setInit(false);
    });

  
  
  }, [auth]);

  return { user, initializing };
}