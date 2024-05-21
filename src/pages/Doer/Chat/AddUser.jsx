import { db } from "../../../firebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "./lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const username = formData.get("username");

//     try {
//       const userRef = collection(db, "users");

//       const q = query(userRef, where("username", "==", username));

//       const querySnapShot = await getDocs(q);

//       if (!querySnapShot.empty) {
//         setUser(querySnapShot.docs[0].data());
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };



//this is what you'll use to add a new chat from anywhere else

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "User Messages");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        id: newChatRef.id
      });

      await updateDoc(doc(userChatsRef, "go3S71zOX6ggePi72VtLVO6ZIdI2"), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.uid,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.uid), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: "go3S71zOX6ggePi72VtLVO6ZIdI2",
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      {/* <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form> */}
      {/* {user && ( */}
        <div className="user">
          <div className="detail">
            <img  alt="" />
            {/* <span>{user.username}</span> */}
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      {/* )} */}
    </div>
  );
};

export default AddUser;