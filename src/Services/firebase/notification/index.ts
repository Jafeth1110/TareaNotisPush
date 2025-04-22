import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const savePushToken = async (token: string,uid: string) => {
  try {
    await setDoc(doc(db, "deviceTokens", uid), {
      token: token,
      updatedAt: new Date(),
    });    
  } catch (error) {
    alert("❌ Error al guardar token: "+ error);
  }
};