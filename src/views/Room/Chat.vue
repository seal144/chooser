<template>
  <div class="chat-wrapper">
    <div
      class="chat-window"
      :class="{ smAndDown, scrollSmooth }"
      ref="chatWindow"
      @click="focusChatWindow"
      v-click-outside="unFocusChatWindow"
      @scroll="handleChatScroll"
    >
      <div v-if="errorChat" class="chat-error">
        {{ errorChat }}
      </div>
      <v-progress-circular
        class="chat-loading"
        v-else-if="wholeChat === null"
        indeterminate
        size="48"
        :width="lineThickness"
      ></v-progress-circular>
      <div v-else>
        <LazyMessagesChunk
          :isMounted="isOldestChatMounted"
          :messagesChunk="oldestChat"
          :participantsList="participantsList"
        />
        <LazyMessagesChunk
          :isMounted="isOlderChatMounted"
          @updated="isOldestChatMounted = true"
          :messagesChunk="olderChat"
          :participantsList="participantsList"
        />
        <LazyMessagesChunk
          :isMounted="isOldChatMounted"
          @updated="isOlderChatMounted = true"
          :messagesChunk="oldChat"
          :participantsList="participantsList"
        />
        <Message
          v-for="(message, index) in latestChat"
          :key="index"
          :message="message"
          :participantsList="participantsList"
        />
      </div>
    </div>
    <div class="bottom-row">
      <v-form v-model="form" @submit.prevent="submitMessage">
        <Textarea
          :rules="[...messageValidation]"
          v-model="message"
          placeholder="Write something nice 😉"
          @keypress.enter.exact.prevent="submitMessage"
          :error-messages="errorSendMessage ? errorSendMessage : []"
        />
        <div class="actions">
          <ButtonIcon icon="mdi-send" type="submit" />
        </div>
      </v-form>
      <ButtonScrollToBottom
        v-if="!errorChat && wholeChat?.length && showScrollBottomBtn"
        :text="scrollBottomBtnText"
        class="btn-scroll-down"
        @click="scrollToBottom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, PropType, watch } from "vue";
import { useDisplay } from "vuetify";

import { lineThickness } from "@/plugins/vuetify";
import { ButtonIcon, ButtonScrollToBottom, Textarea } from "@/components";
import Message from "./Message.vue";
import LazyMessagesChunk from "./LazyMessagesChunk.vue";
import useSendMessage from "@/composables/useSendMessage";
import subscribeChat from "@/composables/subscribeChat";
import { messageValidation } from "@/utils/validation";
import { User } from "@/types";

const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
  participantsList: {
    type: Object as PropType<User[]>,
    required: true,
  },
});

const { smAndDown } = useDisplay();
const { sendMessage, error: errorSendMessage } = useSendMessage();
const { chat: wholeChat, error: errorChat } = subscribeChat(props.roomId);

const form = ref(false);
const message = ref("");
const chatWindow = ref<HTMLDivElement | null>(null);
const scrollSmooth = ref(false);
const scrollBottomBtnText = ref("");
const showScrollBottomBtn = ref(false);
const isChatWindowFocused = ref(false);
const isOldChatMounted = ref(false);
const isOlderChatMounted = ref(false);
const isOldestChatMounted = ref(false);
const newMessages = ref(-1);
const isFirefox = computed(() => {
  return /firefox/i.test(navigator.userAgent);
});

const ChatChunk = 30;

const latestChat = computed(() => {
  if (wholeChat.value) {
    return wholeChat.value.slice(-(ChatChunk * 1 + newMessages.value));
  } else {
    return [];
  }
});
const oldChat = computed(() => {
  if (wholeChat.value) {
    return wholeChat.value?.slice(
      -(ChatChunk * 2 + newMessages.value),
      -(ChatChunk * 1 + newMessages.value)
    );
  } else {
    return [];
  }
});
const olderChat = computed(() => {
  if (wholeChat.value) {
    return wholeChat.value?.slice(
      -(ChatChunk * 3 + newMessages.value),
      -(ChatChunk * 2 + newMessages.value)
    );
  } else {
    return [];
  }
});
const oldestChat = computed(() => {
  if (wholeChat.value) {
    return wholeChat.value?.slice(0, -(ChatChunk * 3 + newMessages.value));
  } else {
    return [];
  }
});

const nearBottomValue = computed(() => {
  return isFirefox.value ? 850 : 600;
});

const handleChatScroll = () => {
  if (
    chatWindow.value &&
    chatWindow.value.scrollHeight - chatWindow.value.scrollTop >
      nearBottomValue.value
  ) {
    if (!showScrollBottomBtn.value || !scrollSmooth.value) {
      showScrollBottomBtn.value = true;
      scrollSmooth.value = true;
      focusChatWindow();
    }
  } else {
    if (showScrollBottomBtn.value || !!scrollBottomBtnText.value) {
      showScrollBottomBtn.value = false;
      scrollBottomBtnText.value = "";
      unFocusChatWindow();
    }
  }

  if (!isOldChatMounted.value) {
    isOldChatMounted.value = true;
  }
};

const focusChatWindow = () => {
  isChatWindowFocused.value = true;
};
const unFocusChatWindow = () => {
  isChatWindowFocused.value = false;
};

watch(wholeChat, async () => {
  // the autoScrollToBottom is not working properly without this await
  await newMessages.value++;
  autoScrollToBottom();
});

const autoScrollToBottom = () => {
  if (chatWindow.value && !isChatWindowFocused.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  } else {
    scrollBottomBtnText.value = "New message";
  }
};

const scrollToBottom = () => {
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    unFocusChatWindow();
  }
};

const submitMessage = () => {
  if (!form.value || !message.value.trim()) return;
  sendMessage(props.roomId, message.value);
  message.value = "";
};
</script>

<style scoped lang="scss">
@import "../../styles/settings.scss";
.chat-wrapper {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .chat-window {
    border: $border-style;
    background: rgb(var(--v-theme-surface));
    flex: 1;
    position: relative;
    overflow: auto;
    padding: 1.5rem;

    &.scrollSmooth {
      scroll-behavior: smooth;
    }

    &.smAndDown {
      padding: 0.8rem;
    }

    .chat-error {
      text-align: center;
      margin-top: 3rem;
      padding: 1rem;
      color: rgb(var(--v-theme-error));
    }

    .chat-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .bottom-row {
    position: relative;
    .actions {
      width: fit-content;
      margin-left: auto;
      margin-top: -0.8rem;
    }
  }

  .btn-scroll-down {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -3.5rem;
  }
}
</style>
