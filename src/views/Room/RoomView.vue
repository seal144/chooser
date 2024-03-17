<template>
  <SideDrawer v-model="drawer" @close="drawer = false" />
  <div class="content-container">
    <ButtonIcon
      icon="mdi-menu-open"
      class="open-menu-button"
      :class="{ hide: drawer }"
      @click="drawer = true"
      rotate
    />
    <div class="content" :class="{ mdAndDown }">
      <HeaderCard class="content-title" :class="{ xs }">{{
        room ? room.name : ""
      }}</HeaderCard>
      <div
        v-if="route.name === RoutesNames.RoomChat"
        class="chat-container"
        :class="{ xs }"
      >
        <Chat
          v-if="room"
          :roomId="room.id"
          :participantsList="[...room.guests, ...room.pastGuests, room.owner]"
        />
      </div>
      <div v-else class="choosing-container">
        <HeaderCard>
          {{ phaseDescription }}
        </HeaderCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

import { useRoomStore } from "@/store/roomStore";
import SideDrawer from "./SideDrawer.vue";
import Chat from "./Chat.vue";
import { ButtonIcon, HeaderCard } from "@/components";
import getUser from "@/composables/getUser";
import { RoutesNames } from "@/router";
import { Phase } from "@/types";

const room = toRef(useRoomStore(), "room");
const route = useRoute();
const { xs, mdAndDown } = useDisplay();
const { user } = getUser();

const drawer = ref(false);
const isOwner = computed(() => {
  return room.value?.owner.id === user.value?.uid;
});

const phaseDescription = computed(() => {
  if (room.value) {
    switch (room.value.phase) {
      case Phase.SettingOptions:
        if (isOwner.value) {
          return "Firstly, as the room host, provide options for choosing.";
        } else return "Wait for the room host to provide options for choosing";
      case Phase.Choosing:
        return "Please, rank the options from best to worst according to your personal preferences and confirm.";
      case Phase.Results:
        return "The choosing is done. These are the results.";
    }
  }
  return "Oops, the unexpected error has occurred! There is no room data please try again later.";
});
</script>

<style lang="scss" scoped>
.content-container {
  width: 100%;
}
.content {
  margin-top: -36px;
  padding: 0 3.5rem;

  .content-title {
    width: fit-content;
    padding-left: 2rem;
    padding-right: 2rem;
    margin: 0 auto 1.5rem;

    &.xs {
      margin: 0 0 1.5rem 3.1rem;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      width: unset;
    }
  }

  &.mdAndDown {
    padding: 0;
  }
}

.open-menu-button {
  position: sticky;
  top: 5.2rem;
  z-index: 100;
  &.hide {
    transform: translateX(-600px);
  }
}

.chat-container {
  height: calc(100vh - 180px);
  min-height: 400px;

  &.xs {
    height: calc(100vh - 230px);
  }
}

.choosing-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
