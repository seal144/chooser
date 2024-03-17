<template>
  <router-link
    v-if="route.name === RoutesNames.Room"
    :to="{ name: RoutesNames.RoomChat }"
  >
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-chat" size="large" /><span v-if="smAndUp"> Chat </span>
    </Button>
  </router-link>
  <router-link
    v-if="route.name === RoutesNames.Room"
    :to="{ name: RoutesNames.Home }"
  >
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-close-thick" size="large" /><span v-if="smAndUp">
        Leave
      </span>
    </Button>
  </router-link>
  <router-link v-else :to="{ name: RoutesNames.Room }">
    <Button :icon="!smAndUp">
      <v-icon icon="mdi-logout-variant" size="large" /><span v-if="smAndUp">
        Go back
      </span>
    </Button>
  </router-link>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import { RoutesNames } from "@/router";
import { Button } from "@/components";

const route = useRoute();
const { smAndUp } = useDisplay();
</script>
