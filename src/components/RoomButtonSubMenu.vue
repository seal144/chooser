<template>
  <v-menu :offset="offset">
    <template v-slot:activator="{ props }">
      <v-btn
        class="button-submenu"
        variant="text"
        icon="mdi-dots-vertical"
        density="compact"
        v-bind="props"
      ></v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(action, index) in actionsList" :key="index">
        <Button block @click="action.action(id, name)" :danger="action.danger">
          <v-icon v-if="action.icon" :icon="action.icon" size="large" />
          {{ action.label }}
        </Button>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import { Button } from "@/components";

interface ActionItem {
  label: string;
  action: (id: string, name: string) => void;
  icon?: string;
  danger?: boolean;
}

defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  offset: {
    type: Array as PropType<number[]>,
    default: () => [0, 0],
  },
  actionsList: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
.button-submenu {
  position: absolute;
  right: 0.25rem;
}
</style>
