<template>
  <a-row :gutter="10">
    <a-col :xl="24" :lg="24" :md="24" :sm="24" style="flex: 1">
      <!-- 商品信息 -->
      <div class="updata-content">
        <div class="content-title">商品信息</div>
        <div class="content">
          <div class="item-box">
            <div class="item-title">商品名称：</div>
            <div class="item-value">{{ data?.name }}</div>
          </div>
          <div class="item-box">
            <div class="item-title">商品描述：</div>
            <div class="item-value">{{ data?.description || '-' }}</div>
          </div>
          <div class="item-box">
            <div class="item-title">商品图片：</div>
            <div class="item-value">
              <media-container :media-src="data.productFiles" />
            </div>
          </div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="updata-content">
        <div class="content-title">其他信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品编码：</div>
                <div class="item-value"> {{ data?.productId || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品类型：</div>
                <div class="item-value">
                  {{ data?.productType?.name || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">所属店铺：</div>
                <div
                  class="item-value"
                  :class="{ 'action-text': hasPermission('SHOP_DETAIL_GET') }"
                  @click="hasPermission('SHOP_DETAIL_GET') ? goDetail(data.shopId, 'shop') : ''"
                >
                  {{ data?.shopName || '-' }}
                </div>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品状态：</div>
                <div class="item-value">{{ data?.status?.name || '-' }}</div>
              </div>
            </a-col>
            <a-col :span="16">
              <div class="item-box">
                <div class="item-title">上架时间：</div>
                <div class="item-value">{{ filterTime(data?.showStartDate) }}</div>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">创建人：</div>
                <div class="item-value">{{ data?.createdUserShopNickname }}</div>
              </div>
            </a-col>
            <a-col :span="16">
              <div class="item-box">
                <div class="item-title">创建时间：</div>
                <div class="item-value">{{ filterTime(data?.createdDate) }}</div>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">修改人：</div>
                <div class="item-value">{{ data?.updatedUserShopNickname || '-' }}</div>
              </div>
            </a-col>
            <a-col :span="16">
              <div class="item-box">
                <div class="item-title">修改时间：</div>
                <div class="item-value">{{ filterTime(data?.updatedDate) }}</div>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">代售商品：</div>
                <div class="item-value">
                  {{ data?.productSalesInfo?.delegatedProduct ? '是' : '否' }}
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">备注信息：</div>
                <div class="item-value">
                  {{ data?.productSalesInfo?.delegatedProductRemark || '-' }}
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">商品收藏量：</div>
                <div class="item-value">{{ data?.favoriteTotalCount || '-' }}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- 商品属性 -->
      <div class="updata-content">
        <div class="content-title">商品属性</div>
        <div class="content-other">
          <div class="item-box">
            <div class="item-title">分类：</div>
            <div class="item-value"> {{ data?.productCategoryName || '-' }} </div>
          </div>
          <a-row class="flex-1">
            <a-col :span="8" v-for="(item, index) in productAttributesShowData" :key="index">
              <div class="item-box">
                <div class="item-title">{{ item.productAttributeConfigName || '-' }}：</div>
                <div class="item-value">
                  {{
                    item?.productAttributeSingleValue ||
                    item?.productAttributeMultiSelectedValue ||
                    '-'
                  }}
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- 销售信息 -->
      <div class="updata-content">
        <div class="content-title">销售信息</div>
        <div class="content-other">
          <a-row class="flex-1">
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">销售价：</div>
                <div class="item-value"> {{ data?.productSalesInfo?.price || '0.00' }} </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">总数量：</div>
                <div class="item-value"> {{ data?.productSalesInfo?.quantity || '-' }} </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">七天包退：</div>
                <div class="item-value">
                  {{ data?.productSalesInfo?.allowNoReasonReturn ? '开启' : '关闭' }}
                </div>
              </div>
            </a-col>

            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">包邮：</div>
                <div class="item-value">
                  {{ data?.productSalesInfo?.allowFreeDelivery ? '开启' : '关闭' }}
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="item-box">
                <div class="item-title">运费：</div>
                <div class="item-value">
                  {{ data?.productSalesInfo?.deliveryFee || '0.00' }}
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { getProductById } from './list.api';
  import { useRouter } from 'vue-router';
  import MediaContainer from './components/MediaContainer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasPermission } = usePermission();
  const go = useGo();
  const { currentRoute } = useRouter();
  const { params } = unref(currentRoute);

  const { path } = params;
  // 商品数据信息
  let data = ref({} as any);
  // 商品属性显示数据
  let productAttributesShowData = ref<any[]>([]);

  const goDetail = (id, type: 'buyer' | 'shop' | 'product') => {
    if (type == 'buyer') {
      go(`/consumer/basic/consumerDetail/${id}`);
    } else if (type == 'product') {
      go(`/goods/basic/productDetail/${id}`);
    } else if (type == 'shop') {
      go(`/merchant/basic/shopDetail/${id}`);
    }
  };

  const filterTime = (time) => {
    if (time) {
      return formatToDateTime(time);
    } else {
      return '-';
    }
  };

  const loadData = async () => {
    let res = await getProductById(path as string);
    console.log('data =>', data);

    if (res.productAttributes && res.productAttributes.length !== 0) {
      res.productAttributes.forEach((item) => {
        productAttributesShowData.value.push(item);
      });
    }
    res['productSalesInfo'] = res.productFixedPrice ? res.productFixedPrice : res.productAuction;

    // // TODO
    // res.productFiles.push(...res.productFiles);
    // res.productFiles.push(...res.productFiles);

    data.value = res;
  };

  onMounted(() => {
    loadData();
  });
</script>

<style lang="less" scoped>
  .action-text {
    cursor: pointer;
    color: #007bff !important;
    &._disable {
      cursor: not-allowed;
      color: #d1d3d7 !important;
    }
  }

  .item-click {
    color: #007bff !important;
    cursor: pointer;
  }

  .updata-content {
    margin: 20px;
    padding: 20px 34px 0 34px;
    background: #fff;
    border-radius: 2px;

    .flex-1 {
      flex: 1;
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

    .content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .item-box {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding-bottom: 20px;

      .item-title {
        font-size: 14px;
        color: #4f4f4f;
        line-height: 22px;
        min-width: 40px;
        flex-shrink: 0;
      }

      .item-value {
        font-size: 14px;
        color: #4f4f4f;
        line-height: 22px;
      }
    }
  }

  :deep(.ant-image) {
    width: 175px;
    height: 175px;
    background: #f1f1f1;
    margin: 0 20px 15px;

    .ant-image-img {
      position: relative;
      width: auto;
      height: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
