<template>
  <div class="page-container">
    <div class="update-page-container">
      <div class="container_flex">
        <div class="updata-content-container _width">
          <!-- 基本资料 -->
          <div class="content-title">基本资料</div>
          <a-row :gutter="18">
            <a-col :span="4">
              <div class="flex_start_top">
                <a-image-preview-group>
                  <div
                    class="_item-img"
                    style="
                      width: 86px;
                      height: 86px;
                      margin-top: 0;
                      border-radius: 50%;
                      overflow: hidden;
                    "
                  >
                    <template v-if="buyerData?.avatarUrl === null">
                      <a-image src="/@/assets/images/logo.png" style="width: 100%; height: 100%" />
                    </template>
                    <template v-if="buyerData?.avatarUrl !== null">
                      <a-image
                        :src="getFileUrl(buyerData?.avatarUrl)"
                        alt=""
                        style="width: 100%; height: 100%"
                      />
                    </template>
                  </div>
                </a-image-preview-group>
              </div>
            </a-col>

            <a-col :span="16">
              <a-row :gutter="18">
                <a-col>
                  <div class="flex_start_top _item-box">
                    <div class="_item-value" style="font-size: 20px; font-weight: 600">
                      {{ buyerData?.nickName || '-' }}
                    </div>
                  </div>
                </a-col>
              </a-row>
              <a-row :gutter="18">
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">手机号码：</div>
                    <div class="_item-value" :class="{ '_border-item': !buyerData?.mobile }">
                      {{ buyerData?.mobile ? buyerData?.mobile : '未授权' }}
                    </div>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">注册时间：</div>
                    <div class="_item-value">
                      {{ filterTime(buyerData?.createdDate) }}
                    </div>
                  </div>
                </a-col>
              </a-row>
              <a-row :gutter="18">
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性别：</div>
                    <div class="_item-value">{{ buyerData?.gender?.name }}</div>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">最近浏览：</div>
                    <div class="_item-value">
                      {{ filterTime(buyerData?.createdDate) }}
                    </div>
                  </div>
                </a-col>
              </a-row>
              <a-row :gutter="18">
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">微信授权：</div>
                    <div class="_item-value _border-item" :class="{ _green: buyerData?.wxAuth }">
                      {{ buyerData?.wxAuth ? '已授权' : '未授权' }}
                    </div>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="flex_start_top _item-box">
                    <div class="_item-title">测试人员：</div>
                    <div class="_item-value">
                      {{ buyerData?.testOnly ? '是' : '否' }}
                    </div>
                  </div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row :gutter="18">
            <a-col :span="24">
              <div class="flex_start_top">
                <div class="_item-title">备注：</div>
                <div
                  class="_item-value"
                  style="flex: 1; height: 22px; cursor: pointer"
                  @click="menuAciton('edit')"
                >
                  <Icon icon="ant-design:form-outlined" />&nbsp;
                </div>
                <div style="width: 90%">{{ buyerData?.description || '-' }}</div>
              </div>
            </a-col>
          </a-row>
        </div>

        <div class="updata-content-container _width">
          <!-- 账号数据 -->
          <div class="content-title">账号数据</div>
          <a-row>
            <div class="gutter-row" style="width: calc(50% - 20px); margin-right: 10px">
              <div class="flex_center">
                <div class="icon-btn icon_grade"></div>
                <div>
                  <div class="_item-title">会员等级</div>
                  <div class="_item-value font-color-999999">有效期至：2021-10-20</div>
                </div>
              </div>
              <div class="_item-text">Lv.0</div>
            </div>
            <div class="gutter-row" style="width: calc(50% - 20px)">
              <div class="flex_center">
                <div class="icon-btn icon_integral"></div>
                <div>
                  <div class="_item-title">积分</div>
                  <div class="_item-value font-color-999999">即将过期积分：0</div>
                </div>
              </div>
              <div class="_item-text">0</div>
            </div>
          </a-row>
          <a-row>
            <div class="gutter-row" style="width: calc(100% - 30px)">
              <div class="flex_center">
                <div class="icon-btn icon_grow_value"></div>
                <div class="_item-title" style="padding-right: 20px">成长值</div>
                <!-- progress进度条 -->
                <div class="_progress">
                  <div class="_stroke-color purple" style="width: 50%">
                    <span>{{ 1000 / 2 }}</span>
                  </div>
                  <div class="_stroke-color gray"></div>
                  <div class="flex_between">
                    <span style="color: #b8b8b8">保级0</span>
                    <span style="color: #b8b8b8">升级{{ 1000 }}</span>
                  </div>
                </div>
              </div>
              <div class="_item-text">{{ 1000 / 2 }}</div>
            </div>
          </a-row>
        </div>
      </div>

      <div class="updata-content-container_block"></div>

      <!-- tab栏 -->
      <div style="background-color: #fff">
        <span class="tab-container">
          <div class="tab-content-container">
            <a-tabs>
              <a-tab-pane tab="交易记录" key="1" />
              <a-tab-pane tab="积分" key="2" />
              <a-tab-pane tab="成长值" key="3" />
              <a-tab-pane tab="收货地址" key="4" />
            </a-tabs>
          </div>
        </span>
        <div class="table-container">
          <table style="position: relative; width: 100%">
            <thead>
              <tr>
                <th style="width: 30px; min-width: 30px; max-width: 30px"></th>
                <th style="width: 120px">店铺名称</th>
                <th style="width: 120px">订单</th>
                <th style="width: 120px; min-width: 85px">金额（元）</th>
                <th style="width: 120px; min-width: 85px">经营主体状态</th>
                <th style="width: 120px">交易状态</th>
                <th style="width: 120px">售后状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> </td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="11" class="text-center">
                  <div class="row">
                    <div class="col-2" style="padding: 10px; text-align: left; padding-left: 30px">
                      <span
                        nzTooltipTitle="prompt text"
                        nzTooltipPlacement="bottomLeft"
                        nz-text
                        nz-tooltip
                      >
                        数据总数：{{ 0 }}
                      </span>
                    </div>
                    <div class="col-8" style="padding-top: 20px"> </div>
                    <div class="col-2"></div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑备注 -->
  <RemarkModal @register="registerModal" @success="handleSuccess" />
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { getBuyerById } from './list.api';
  import { useRouter } from 'vue-router';
  import RemarkModal from './components/RemarkModal.vue';
  import { OssUtils } from '/@/utils/ossUtils';

  const { currentRoute } = useRouter();

  const { params } = unref(currentRoute);
  console.log('params =>', params);

  const { path } = params;
  // 消费者信息
  let buyerData = ref({} as any);

  const filterTime = (time) => {
    if (time) {
      return formatToDateTime(time);
    } else {
      return '-';
    }
  };

  const ossUtils = new OssUtils();
  function getFileUrl(fileUrl: string) {
    return ossUtils.getSignatureUrl(fileUrl);
  }

  const menuAciton = (action: 'edit') => {
    if (action == 'edit' && buyerData.value.id) {
      // 打开备注编辑框
      openModal(true, {
        id: buyerData.value.id,
        description: buyerData.value.description,
      });
    }
  };

  const loadData = async () => {
    let res = await getBuyerById(path as string);

    buyerData.value = res;
  };

  onMounted(() => {
    loadData();
  });

  // -----------------弹窗相关功能-----------------
  const [registerModal, { openModal }] = useModal();

  /**
   * 成功回调
   */
  function handleSuccess() {
    loadData();
  }
</script>

<style lang="less" scoped>
  // 左侧内容外框
  .page-container {
    padding: 20px;
    height: 100%;
  }

  .flex_start_top {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .flex_center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .font-color-999999 {
    color: #999999 !important;
  }

  // 页面分tab
  .tab-container {
    width: 100%;
    border-radius: 5px 5px 0 0;
    background-color: #fff;
    overflow: hidden; // 圆角底色溢出，也会造成底线叠加失效
    display: inline-flex;
    user-select: none !important;

    // 外层盒子分开两部分  让选中底线叠加
    .tab-content-container {
      border-bottom: 2px solid #e4e7ed;
      width: 100%;

      .tab-item {
        width: 100px;
        height: 48px;
        line-height: 48px;
        color: #4f4f4f;
        text-align: center;
        display: inline-block;
        cursor: pointer;

        // 被选中
        &._active {
          background-color: #fff !important;
          color: #c02235;
          font-weight: 700;
          position: relative;
          text-shadow: none !important;

          // 底线叠加
          &::after {
            content: '';
            width: 100%;
            height: 2px;
            background-color: #c02235;
            position: absolute;
            bottom: -2px;
            left: 0;
            z-index: 1000;
          }
        }
      }
    }

    // 当存在分tab时 表格上圆角为0
    & + .table-container {
      border-radius: 0px 0px 5px 5px !important;
    }
  }

  .table-container table thead > tr {
    height: 51px;
    background-color: #f8f8f8;
  }
  .table-container table tbody tr:hover {
    background-color: #f5f7f9 !important;
  }
  .table-container table tbody tr {
    height: 45px;
    border-bottom: 1px solid #f2f2f2;
  }

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

      &._none-border {
        border: none !important;
      }

      &._width {
        width: calc(50% - 10px);
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

        .icon-btn {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          margin-right: 15px;

          &.icon_grade {
            background: url('/@/assets/images/icon_grade.png') no-repeat;
            background-size: cover;
          }

          &.icon_integral {
            background: url('/@/assets/images/icon_integral.png') no-repeat;
            background-size: cover;
          }

          &.icon_grow_value {
            background: url('/@/assets/images/icon_grow_value.png') no-repeat;
            background-size: cover;
          }
        }

        ._item-text {
          font-size: 32px;
          font-weight: 600;
          line-height: 42px;
          color: #333333;
        }

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

  .review-content-container {
    .radio-group-item {
      width: 100%;
      color: #222222;

      .select-item {
        width: 100%;
        line-height: 32px;
        height: 32px;

        .select-remark {
          width: 100%;
          padding-left: 30px;

          // .select-remark-title {}

          .select-remark-input {
            width: calc(100% - 80px - 50px);
            border: 1px solid #d9d9d9;
            border-radius: 3px;
            overflow: hidden;
            outline: none;
            height: 32px;
            line-height: 32px;
            padding-left: 8px;
          }
        }
      }
    }
  }
</style>
