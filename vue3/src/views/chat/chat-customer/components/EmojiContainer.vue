<template>
  <div class="emoji-container scrollbar-item-y">
    <template v-for="emoji in showEmojiList" :key="emoji.order">
      <i
        style="cursor: pointer"
        :style="{ 'background-image': 'url(' + emoji.hexcodeUrl + ')' }"
        class="oma oma-3x"
        @click="selectEmojiItem(emoji)"
        :title="emoji.annotation"
      ></i>
    </template>
  </div>
</template>

<script setup lang="ts">
  // defineProps({
  //   showEmojiList: {
  //     type: Object as PropType<ErrorLogInfo>,
  //     default: null,
  //   },
  // });

  defineProps<{
    showEmojiList: any[];
  }>();

  const emits = defineEmits<{
    (e: 'menuEvent', emoji: any): void;
  }>();

  const selectEmojiItem = (emoji) => {
    emits('menuEvent', emoji);
  };
</script>

<style lang="less" scoped>
  @import '../../style.less';

  .emoji-container {
    width: 500px;
    height: 220px;
    background: #fff;
    position: absolute;
    bottom: 36px;
    left: 4px;
    border-radius: 4px;
    box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);

    &::after {
      content: '';
      width: 0px;
      height: 0px;
      border-width: 8px;
      border-style: solid;
      border-color: #fff transparent transparent transparent;
      position: absolute;
      bottom: -14px;
      left: 4px;
    }
  }
</style>
