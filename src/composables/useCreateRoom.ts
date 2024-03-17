import { ref } from "vue";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { getDocs } from "@/firebase/docs";
import CryptoJS from "crypto-js";
import {
  CommonErrors,
  Phase,
  RoomDataDB,
  RoomField,
  Collection,
} from "@/types";

type RoomFormData = {
  name: string;
  password: string;
};

const loading = ref(false);
const error = ref<string | null>(null);

const createRoom = async (roomFormData: RoomFormData) => {
  loading.value = true;
  error.value = null;

  try {
    if (!auth.currentUser) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const snapshot = await getDocs(Collection.Rooms, [
      RoomField.Name,
      "==",
      roomFormData.name,
    ]);

    if (!snapshot.empty) {
      throw new Error("Name already in use");
    }

    const groupId = roomFormData.password
      ? CryptoJS.AES.encrypt(
          roomFormData.password,
          import.meta.env.VITE_CJS_K
        ).toString()
      : "";

    const room: RoomDataDB = {
      [RoomField.CreateTime]: Timestamp.now(),
      [RoomField.GroupId]: groupId,
      [RoomField.Name]: roomFormData.name,
      [RoomField.GuestsIds]: [],
      [RoomField.Owner]: {
        id: auth.currentUser.uid,
        displayName: auth.currentUser.displayName
          ? auth.currentUser.displayName
          : "",
      },
      [RoomField.Guests]: [],
      [RoomField.PastGuests]: [],
      [RoomField.Phase]: Phase.SettingOptions,
      [RoomField.Options]: [],
      [RoomField.Choices]: [],
    };

    const response = await addDoc(collection(db, Collection.Rooms), room);

    if (!response) {
      throw new Error("Could not create the new room");
    }

    const chatRef = doc(db, Collection.Chats, response.id);
    await setDoc(chatRef, { chat: [] });

    loading.value = false;

    return response.id;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const resetError = () => {
  error.value = null;
};

const useCreateRoom = () => {
  return { createRoom, loading, error, resetError };
};

export default useCreateRoom;
