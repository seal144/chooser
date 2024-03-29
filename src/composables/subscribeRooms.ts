import { ref, watchEffect } from "vue";
import { auth, db } from "@/firebase/config";
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query as queryFirestore,
  where,
} from "firebase/firestore";
import {
  Room,
  RoomField,
  RoomBasicData,
  RoomRole,
  Collection,
  UserField,
} from "@/types";
import useDeleteRoom from "./useDeleteRoom";

const { deleteRoom } = useDeleteRoom();

const subscribeRooms = (roomRole: RoomRole) => {
  const rooms = ref<RoomBasicData[] | null>(null);

  const collectionRef = collection(db, Collection.Rooms);

  const query =
    roomRole === RoomRole.Owner
      ? queryFirestore(
          collectionRef,
          where(
            `${RoomField.Owner}.${UserField.Id}`,
            "==",
            auth.currentUser?.uid
          ),
          orderBy(RoomField.CreateTime, "desc")
        )
      : queryFirestore(
          collectionRef,
          where(RoomField.GuestsIds, "array-contains", auth.currentUser?.uid),
          orderBy(RoomField.CreateTime, "desc")
        );

  const unsubscribe = onSnapshot(query, (snapshot) => {
    //the app is filtering out and deleting rooms older than two weeks
    const filteredDocs = snapshot.docs.filter((doc) => {
      const TwoWeeksInSeconds = 60 * 60 * 24 * 14;
      const nowSeconds = Timestamp.now().seconds;
      const createTime: Room[RoomField.CreateTime] = doc.get(
        RoomField.CreateTime
      );
      if (nowSeconds - createTime.seconds > TwoWeeksInSeconds) {
        deleteRoom(doc.id);
        return false;
      }
      return true;
    });

    rooms.value = filteredDocs.map((doc) => ({
      id: doc.id,
      name: doc.get(RoomField.Name),
    }));
  });

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { rooms };
};

export default subscribeRooms;
