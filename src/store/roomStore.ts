import { defineStore } from "pinia";
import { RoomDetailsData } from "@/types/";

export const useRoomStore = defineStore("roomStore", {
  state: () => ({
    room: null as RoomDetailsData | null,
  }),
});
