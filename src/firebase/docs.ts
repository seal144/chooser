import { db } from "@/firebase/config";
import {
  collection,
  doc,
  getDocs as getDocsFirestore,
  query as queryFireStore,
  updateDoc as updateDocFirestore,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import {
  Collection,
  ChatDataDBPartial,
  RoomDataDBPartial,
  UserDataDBPartial,
} from "@/types";

export const getDocs = async (
  collectionName: Collection,
  query: [string, WhereFilterOp, string | undefined]
) => {
  const q = queryFireStore(
    collection(db, collectionName),
    where(query[0], query[1], query[2])
  );

  const snapshot = await getDocsFirestore(q);

  return snapshot;
};

export const updateDoc = async (
  collectionName: Collection,
  id: string,
  data: RoomDataDBPartial | UserDataDBPartial | ChatDataDBPartial
) => {
  const docRef = doc(db, collectionName, id);

  await updateDocFirestore(docRef, data);
};
