<template>
  <div class="room-view-container">
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="48"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else-if="error === CommonErrors.TheDocumentNotFound">
      <RoomNotExist />
    </template>
    <template v-else>
      <RoomView v-if="room" />
    </template>
    <InfoDialog
      @close="redirectLoginDialog"
      :dialogIdentification="Dialogs.RoomInfoLogin"
      title="Please log in"
      text="To participate in a room you have to log in."
      closeLabel="log in"
    />
    <InfoDialog
      @close="redirectHomeDialog"
      :dialogIdentification="Dialogs.RoomInfoIsFull"
      title="&#128532; The room is Full"
      :text="`there is already ${maxGuestsInRoom} guests in the room`"
      closeLabel="go Home"
    />
    <JoinCreateRoomDialog
      @close="onCloseJoinRoomDialog"
      v-if="room"
      variant="joinFromUrl"
      :roomName="room.name"
    />
    <Snackbar
      v-model="snackbarJoinRoomError"
      title="Something went wrong"
      text="Joining room failed. Please, try again later."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watchEffect, ref, toRef } from "vue";
import { useRouter, useRoute } from "vue-router";

import { lineThickness } from "@/plugins/vuetify";
import { RoutesNames } from "@/router";
import { useRoomStore } from "@/store/roomStore";
import { useDialogsStore } from "@/store/dialogs";
import { InfoDialog, JoinCreateRoomDialog, Snackbar } from "@/components";
import RoomView from "./RoomView.vue";
import getUser from "@/composables/getUser";
import useSubscribeRoom from "@/composables/useSubscribeRoom";
import useJoinRoom from "@/composables/useJoinRoom";
import { maxGuestsInRoom } from "@/utils/validation";
import { CommonErrors, Dialogs } from "@/types";

import RoomNotExist from "./RoomNotExist.vue";

const router = useRouter();
const route = useRoute();
const { user } = getUser();
const dialogs = useDialogsStore();
const userInitValidation = ref(true);
const snackbarJoinRoomError = ref(false);
const { subscribeRoom, unsubscribeRoom, error } = useSubscribeRoom(
  route.params.id as string
);
const room = toRef(useRoomStore(), "room");
const { joinRoom, error: errorJoinRoom } = useJoinRoom();

let delayedKick: NodeJS.Timeout;

watchEffect(() => {
  if (errorJoinRoom.value && room.value && room.value.parsedGroupId === 0) {
    snackbarJoinRoomError.value = true;
    delayedKick = setTimeout(() => {
      userInitValidation.value = false;
    }, 4000);
  }
});

onBeforeUnmount(() => {
  clearTimeout(delayedKick);
  unsubscribeRoom();
});

watchEffect(() => {
  if (!user.value) {
    dialogs.isOpen[Dialogs.RoomInfoLogin] = true;
  } else {
    subscribeRoom();
  }
});

const userIsParticipant = computed(() => {
  if (
    user.value &&
    room.value &&
    // next line is needed to avoid console error on deleting room from inside the room
    room.value.guestsIds &&
    (room.value.guestsIds.includes(user.value.uid) ||
      room.value.owner.id === user.value.uid)
  ) {
    return true;
  }
  return false;
});

const loading = computed(() => {
  if (error.value === CommonErrors.TheDocumentNotFound) {
    return false;
  } else if (!user.value || !room.value || !userIsParticipant.value) {
    return true;
  }
  return false;
});

const goHome = () => {
  router.push({ name: RoutesNames.Home });
};

const redirectLoginDialog = () => {
  if (!user.value) {
    router.push({ name: RoutesNames.Login });
  }
};

const redirectHomeDialog = () => {
  if (!userInitValidation.value && !userIsParticipant.value) {
    goHome();
  }
};

const onCloseJoinRoomDialog = () => {
  if (room.value && room.value.parsedGroupId === 1) {
    userInitValidation.value = false;
  }
};

watchEffect(() => {
  if (userInitValidation.value && !userIsParticipant.value) {
    if (error.value === CommonErrors.TheRoomIsFull) {
      userInitValidation.value = false;
      dialogs.isOpen[Dialogs.RoomInfoIsFull] = true;
    }
    if (room.value && room.value.parsedGroupId === 1) {
      dialogs.isOpen[Dialogs.JoinRoomFromURL] = true;
    }
    if (room.value && room.value.parsedGroupId === 0) {
      joinRoom({ name: room.value.name, password: "" });
    }
  } else if (!userIsParticipant.value) {
    goHome();
  } else {
    userInitValidation.value = false;
  }
});
</script>

<style lang="scss" scoped>
.room-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .v-progress-circular {
    margin-top: 2rem;
  }
}
</style>

<!-- handled on url join: -->
<!-- bad url -->
<!-- non logged user -->
<!-- fullRoom -->
<!-- user isn't participant password -->
<!-- user isn't participant no password -->
