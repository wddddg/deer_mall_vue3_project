<template>
  <a-image-preview-group>
    <template v-for="item in images" :key="item">
      <a-image :src="item" />
    </template>
  </a-image-preview-group>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { isArray, isString } from '/@/utils/is';
  import { OssUtils } from '/@/utils/ossUtils';

  const props = defineProps<{
    imageSrc: string;
  }>();

  const ossUtils = new OssUtils();

  const images = computed(() => {
    let result = [] as any[];
    if (isArray(props.imageSrc)) {
      result = [...props.imageSrc];
    } else if (isString(props.imageSrc)) {
      result = props.imageSrc.split(',');
    }
    result = result
      .filter((item) => item && item.length > 0)
      .map((item) => ossUtils.getSignatureUrl(item));

    return result;
  });
</script>
