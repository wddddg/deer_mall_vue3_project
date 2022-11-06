<template>
  <div class="p-4">
    <!-- 头部栏 -->
    <div class="page-header-container">
      <!-- 信息栏 -->
      <div class="container_flex" style="margin-top: 15px">
        <div class="updata-content-container _saleDetail">
          <div class="content-title">个人信息</div>
          <div class="flex_start_top">
            <div>
              <div
                class="_item-img"
                style="
                  width: 80px;
                  height: 80px;
                  margin-top: 0;
                  border-radius: 50%;
                  overflow: hidden;
                "
              >
                <a-image :src="getFileUrl(buyerData.buyerAvatarUrl)" />
                <!-- <a-image
                  :width="80"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                /> -->
                <!-- <ng-container *ngIf="buyerData?.buyerAvatarUrl; else avatarTemplate">
                                      <app-image-container [imageSrc]="buyerData?.buyerAvatarUrl"
                                          [imageClass]="'image-cover'">
                                      </app-image-container>
                                  </ng-container>
                                  <template #avatarTemplate>
                                      <img src="../../assets/images/logo.png">
                                  </template> -->
              </div>
            </div>
            <div style="margin-left: 30px">
              <div class="flex_start_top _item-box" style="padding-bottom: 20px">
                <div
                  class="_item-value"
                  style="font-size: 20px; line-height: 26px; color: #000; font-weight: 600"
                >
                  {{ buyerData.buyerNickName }}
                </div>
              </div>
              <div class="flex_start_top _item-box">
                <div class="_item-title">手机号码：</div>
                <div class="_item-value">{{ buyerData?.buyerMobile }}</div>
              </div>
              <div class="flex_start_top _item-box" style="padding-bottom: none">
                <div class="_item-title">OpenId：</div>
                <div class="_item-value">{{ buyerData?.buyerWxMiniOpenId }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="updata-content-container">
          <!-- 账号数据 -->
          <div class="content-title">销售情况</div>
          <a-row>
            <a-col :span="11" class="back22">
              <div class="flex_center" style="align-items: center">
                <div class="icon-btn icon_grade"></div>
                <div>
                  <div class="_item-title">累计已赚取现金奖励</div>
                </div>
              </div>
              <div class="_item-text">
                {{ buyerData?.sumFinishFee }}
                <span style="font-size: 16px; color: #575858">元</span>
              </div>
            </a-col>
            <a-col :span="11" style="margin-left: 20px" class="back22">
              <div class="flex_center" style="align-items: center">
                <div class="icon-btn icon_integral"></div>
                <div>
                  <div class="_item-title">待入账现金奖励</div>
                </div>
              </div>
              <div class="_item-text">
                {{ buyerData?.sumPendingFinishFee }}
                <span style="font-size: 16px; color: #575858">元</span>
              </div>
            </a-col>
            <!-- <div nz-col class="gutter-row" [nzSpan]="4" style="width: calc(50% - 20px);margin-right: 10px;">

                          </div>
                          <div nz-col class="gutter-row" [nzSpan]="4" style="width: calc(50% - 20px);">

                          </div> -->
          </a-row>
        </div>
      </div>
    </div>
    <!-- tab栏 -->
    <span class="tab-container">
      <div class="tab-content-container flex_between">
        <!--<div>

                          <div v-for="let item of tabList;let itemIndex=index" class="tab-item" [class._active]="item.code === selectedTabCode"
                              @click="switchTab(item.code)">{{item.name}} {{item.num}}</div>

                  </div>-->

        <!-- 搜索栏
                  <div class="search-container" style="width: 505px;flex-shrink: 0;">
                      <div class="flex_start_wrap">
                          <div class="search-item" style="width: 280px;margin-top: 0;">
                              <input type="text" >
                          </div>
                          <div class="flex_start">
                              <div class="search-item" style="width: auto;margin-top: 0;">
                                  <div class="action-btn red" @click="search()">
                                      <i nz-icon nzType="search" nzTheme="outline"></i>
                                  </div>
                              </div>
                              <div class="search-item" style="width: auto;margin-top: 0;">
                                  <div class="action-btn" @click="reset()">
                                      <i nz-icon nzType="reload" nzTheme="outline"></i>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>-->
      </div>
      <div class="bag">
        <a-card :bordered="false" style="height: 100%">
          <a-tabs default-active-key="1" @change="changTab">
            <a-tab-pane key="1" :tab="`在路上 ${totalCount.IngTab == 0 ? '' : totalCount.IngTab}`">
              <IngTab ref="IngTab" />
            </a-tab-pane>
            <a-tab-pane
              key="2"
              :tab="`已赚取 ${totalCount.successTab == 0 ? '' : totalCount.successTab}`"
            >
              <success-tab ref="successTab" />
            </a-tab-pane>
            <a-tab-pane
              key="3"
              :tab="`邀请失败 ${totalCount.failTab == 0 ? '' : totalCount.failTab}`"
            >
              <fail-tab ref="failTab" />
            </a-tab-pane>
            <a-tab-pane
              key="4"
              :tab="`分享统计 ${totalCount.ShareTab == 0 ? '' : totalCount.ShareTab}`"
            >
              <ShareTab ref="ShareTab" />
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </span>
    <!-- list -->
    <div class="table-container"> </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, searchFormSchema } from './salesMan.data';
  import { Alert } from 'ant-design-vue';

  import { getDetailByID, saleInfo } from './salesMan.api';
  import { useGo } from '/@/hooks/web/usePage';
  import IngTab from './components/IngTab.vue';
  import SuccessTab from './components/SuccessTab.vue';
  import FailTab from './components/FailTab.vue';
  import ShareTab from './components/ShareTab.vue';
  import { OssUtils } from '/@/utils/ossUtils';
  import { listIng, shareStats } from './salesMan.api';

  export default defineComponent({
    components: { BasicTable, AAlert: Alert, TableAction, IngTab, SuccessTab, FailTab, ShareTab },
    setup() {
      const { currentRoute, replace } = useRouter();

      const { params, query } = unref(currentRoute);
      const { path } = params;
      // console.log(params, 'path');
      let buyerData = ref({
        buyerAvatarUrl: null,
        buyerId: '',
        buyerMobile: '',
        buyerNickName: '',
        buyerWxMiniOpenId: null,
        sumFinishFee: 0,
        sumPendingFinishFee: 0,
        totalClosedCount: '0',
        totalFinishCount: '0',
        totalPendingCount: '0',
        totalShareStatsCount: '0',
      });

      // 获取子组件
      const totalCount = ref({
        IngTab: 0,
        successTab: 0,
        failTab: 0,
        ShareTab: 0,
      });

      onMounted(() => {
        getDetailByID(path).then(function (resp) {
          buyerData.value = resp;
        });
        saleInfo({ buyerId: path }).then(function (resp) {
          console.log(resp, 'saleInfo');
        });
      });

      const go = useGo();
      const checkedKeys = ref<Array<string | number>>([]);

      const changTab = () => {
        listIng({
          buyerId: path,
          categoryCode: 'PRODUCT',
          keywords: null,
          result: 'PENDING',
        }).then((result) => {
          totalCount.value.IngTab = result.totalCount;
        });
        listIng({
          buyerId: path,
          categoryCode: 'PRODUCT',
          keywords: null,
          result: 'SUCCESS',
        }).then((result) => {
          totalCount.value.successTab = result.totalCount;
        });
        listIng({
          buyerId: path,
          categoryCode: 'PRODUCT',
          keywords: null,
          result: 'CLOSED',
        }).then((result) => {
          totalCount.value.failTab = result.totalCount;
        });
        shareStats({
          buyerId: path,
          categoryCode: 'PRODUCT',
          keywords: null,
          result: 'SHARE_STATATS',
        }).then((result) => {
          totalCount.value.ShareTab = result.totalCount;
        });
        // console.log(key, 2222222222);
      };
      changTab();
      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

      function onSelectChange(selectedRowKeys: (string | number)[]) {
        console.log(selectedRowKeys);
        checkedKeys.value = selectedRowKeys;
      }
      function handleView(record: Recordable) {
        go('/merchant/salesMan/salesManDetail/' + record.id);
      }

      const ossUtils = new OssUtils();
      function getFileUrl(fileUrl: String) {
        return ossUtils.getSignatureUrl(fileUrl);
      }

      return {
        totalCount,
        changTab,
        getFileUrl,
        buyerData,
        handleView,
        getFormValues,
        checkedKeys,
        onSelectChange,
      };
    },
  });
</script>
<style lang="less" scoped>
  .bag {
    background: #fff;
    margin-top: 20px;
    // min-height: 600px;
  }
  .update-page-container {
    border-radius: 5px;
  }

  // .breadcrumb-container {
  //     padding-top: 10px;
  //     padding-bottom: 20px;
  //     border-radius: 5px;
  // }

  .updata-content-container_block {
    height: 20px;
    background: #ebecee;
  }

  .container_flex {
    display: flex;
    justify-content: space-between;

    .updata-content-container {
      background-color: #fff;
      padding: 20px 0 20px 34px;
      border-radius: 5px;
      width: 100%;

      &._none-border {
        border: none !important;
      }

      &._saleDetail {
        width: 544px !important;
        flex-shrink: 0 !important;
        margin-right: 20px;
      }

      .content-title {
        font-size: 16px;
        color: #222222;
        line-height: 21px;
        position: relative;
        padding-bottom: 20px;

        &::before {
          content: '';
          position: absolute;
          left: -14px;
          height: 21px;
          width: 4px;
          background-color: #c02235;
        }
      }

      ._item-describe {
        font-size: 12px;
        color: #c4c4c4;
      }

      ._item-box {
        padding-bottom: 10px;

        ._item-title {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          min-width: 40px;
          flex-shrink: 0; // flex 布局下 不会因为宽度不够而被压缩该元素宽度
        }

        ._item-value {
          font-size: 14px;
          color: #4f4f4f;
          line-height: 22px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        ._item-img {
          margin-top: 12px;
          width: 300px;
          height: 175px;
          background: #f1f1f1;
          text-align: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
      }

      .row,
      .col-4 {
        padding: 0 !important;
        margin: 0 !important;
      }

      .content {
        background: none;
      }

      // 未授权
      ._border-item {
        padding: 3px 9px;
        border-radius: 2px;
        font-size: 12px !important;
        line-height: 16px !important;
        white-space: nowrap;
        user-select: none;
        background-color: #fff;
        border: 1px solid #b8b8b8;

        // 已授权
        &._green {
          color: #fff !important;
          border: none;
          background-color: #5cb85c;
        }
      }

      .gutter-row {
        background-color: #f7f8fa;
        padding: 20px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        ._progress {
          width: 400px;
          height: 20px;
          position: relative;

          ._stroke-color {
            height: 100%;
            border-radius: 20px;

            span {
              position: absolute;
              right: -5px;
              top: -20px;
            }

            &.purple {
              position: absolute;
              left: 0;
              background-color: #676ec6;
            }

            &.gray {
              width: 100%;
              background-color: #dbdbdb;
            }
          }
        }
      }
    }
  }
  .icon-btn {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    margin-right: 15px;

    &.icon_grade {
      background: url('../../../assets/images/icon_grade.png') no-repeat;
      background-size: cover;
    }

    &.icon_integral {
      background: url('../../../assets/images/icon_integral.png') no-repeat;
      background-size: cover;
    }

    &.icon_grow_value {
      background: url('../../../../assets/images/icon_grow_value.png') no-repeat;
      background-size: cover;
    }
  }

  ._item-text {
    font-size: 32px;
    font-weight: 600;
    line-height: 42px;
    color: #333333;
  }

  .table-container table tbody ._height td {
    height: 68px;
  }

  .share-switch-icon {
    font-size: 12px;
    padding: 4px;
    cursor: pointer;
    background: #d1d1d1;
    color: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #007bff;
    }
  }
  .vben-basic-table {
    padding: 0 !important;
  }
  .flex_start_top {
    display: flex;
  }
  .back22 {
    background-color: #f7f8fa;
    padding: 20px;
    margin-bottom: 10px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
  }
</style>
