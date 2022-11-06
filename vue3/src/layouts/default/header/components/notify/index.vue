<template>
  <div :class="prefixCls">
    <Badge
      :count="count"
      dot
      :numberStyle="numberStyle"
      @click="goNoticeList"
      v-if="hasPermission('MAMA_CHAT')"
    >
      <BellOutlined />
    </Badge>
    <!-- <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>-->
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onBeforeUnmount, ref, onBeforeMount } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData, ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo, useRedo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';
  import { getChatNotReadTotalCount } from './chatCustomer.api';
  import { usePermission } from '/@/hooks/web/usePermission';

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const go = useGo();
      const { prefixCls } = useDesign('header-notify');
      const { createMessage } = useMessage();
      const listData = ref(tabListData);
      const userStore = useUserStore();
      const checktimer = ref();
      const { hasPermission } = usePermission();
      const count = computed(() => {
        let count = 0;
        for (let i = 0; i < tabListData.length; i++) {
          count += tabListData[i].list.length;
        }
        return count;
      });

      function onNoticeClick(record: ListItem) {
        createMessage.success('你点击了通知，ID=' + record.id);
        // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
        record.titleDelete = !record.titleDelete;
      }

      const goNoticeList = () => {
        // console.log(hasPermission('MAMA_CHAT'), 22222222);
        if (hasPermission('MAMA_CHAT')) {
          go('/chat/platform/chatCustomer');
        }
      };

      async function getChatTotalCount() {
        const res = await getChatNotReadTotalCount({
          mamaId: userStore.getUserInfo.id,
          userTypeCode: 'buyer',
        });
        //    console.log(res.notReadTotalCount, 2222, userStore.getUserInfo.id);
      }

      onBeforeMount(() => {
        // console.log(el, binding, vnode, prevVnode);
        console.log('onBeforeMount');
        console.log('------------------');
        if (hasPermission('MAMA_CHAT')) {
          checktimer.value = setInterval(() => {
            getChatTotalCount();
          }, 20000);
        }
      });
      onBeforeUnmount(() => {
        console.log('onUpdated');
        console.log('------------------');
        clearInterval(checktimer.value);
      });

      return {
        goNoticeList,
        prefixCls,
        listData,
        count,
        onNoticeClick,
        numberStyle: {},
        hasPermission,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
