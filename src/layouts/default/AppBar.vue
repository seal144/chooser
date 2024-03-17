<template>
  <v-app-bar>
    <v-container class="default-app-bar">
      <v-app-bar-title> <Logo :collapse="smAndDown" /> </v-app-bar-title>
      <div v-if="!!user">
        <div v-if="isRoom" class="action-container">
          <ActionButtonsRoom />
        </div>
        <div v-else class="action-container">
          <Button @click="openAppInfoDialog" icon
            ><v-icon icon="mdi-information" size="large"
          /></Button>
          <SettingsDialog />
          <Button
            @click="handleLogout"
            :icon="!smAndUp"
            v-if="!user?.isAnonymous"
            ><v-icon icon="mdi-logout" size="large" /><span v-if="smAndUp"
              >Logout</span
            ></Button
          >
          <AppInfoDialog />
        </div>
      </div>
    </v-container>
    <CookieBanner />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { signOut } from "firebase/auth";

import { useDialogsStore } from "@/store/dialogs";
import { auth } from "@/firebase/config";
import {
  AppInfoDialog,
  Button,
  CookieBanner,
  Logo,
  SettingsDialog,
} from "@/components";
import ActionButtonsRoom from "./ActionButtonsRoom.vue";
import getUser from "@/composables/getUser";
import { RoutesNames } from "@/router";
import { Dialogs } from "@/types";

const route = useRoute();

const isRoom = computed(() => {
  if (route.name === RoutesNames.Room || route.name === RoutesNames.RoomChat)
    return true;
  return false;
});

const dialogs = useDialogsStore();
const { user } = getUser();
const router = useRouter();
const { smAndDown, smAndUp } = useDisplay();

watchEffect(() => {
  if (!user.value && !isRoom.value) {
    router.push({ name: "Login" });
  }
});

const handleLogout = () => {
  signOut(auth);
};

const openAppInfoDialog = () => {
  dialogs.isOpen[Dialogs.AppInfo] = true;
};
</script>

<style lang="scss">
.v-container.default-app-bar {
  display: flex;

  .action-container {
    display: flex;
    gap: 1rem;

    .v-btn {
      height: 34px;
      &--icon {
        width: 34px;
      }
    }
  }
}
</style>
