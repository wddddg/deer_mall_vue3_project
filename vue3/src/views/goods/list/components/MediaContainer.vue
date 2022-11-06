<template>
  <a-image-preview-group>
    <template v-for="item in medias" :key="item">
      <video v-if="item?.fileType?.code === 'VIDEO'" :src="item?.fileUrl" controls></video>
      <a-image v-else-if="item?.fileType?.code === 'IMAGE'" :src="item.fileUrl" />
    </template>
  </a-image-preview-group>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { OssUtils } from '/@/utils/ossUtils';

  const props = defineProps<{
    mediaSrc: any[];
  }>();

  const ossUtils = new OssUtils();

  const medias = computed(() => {
    const result = props.mediaSrc?.map((item) => {
      if (item?.fileUrl && !(item.fileUrl as string).startsWith('http')) {
        item.fileUrl = ossUtils.getSignatureUrl(item.fileUrl);
      }
      if (item?.fileType?.code) {
        item.fileType.code = (item.fileType.code as string).toLocaleUpperCase();
      }

      return item;
    });

    return result || [];
  });
</script>
