<template>
  <div class="error-container" :class="{ extendsLayout, alignRight, xs }">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  errorMessage: {
    type: String,
    required: true,
  },
  extendsLayout: {
    type: Boolean,
    default: false,
  },
  alignRight: {
    type: Boolean,
    default: false,
  },
});

const { xs } = useDisplay();
</script>

<style lang="scss" scoped>
.error-container {
  position: absolute;
  padding-top: 0.3rem;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-error));

  &.xs {
    position: static;
  }

  &.extendsLayout {
    position: static;
  }

  &.alignRight {
    text-align: right;
  }
}
</style>
