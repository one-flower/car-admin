<template>
  <el-descriptions :title="title" :column="2" border class="mb10">
    <el-descriptions-item label="订单类型"> 服务订单 </el-descriptions-item>
    <el-descriptions-item label="项目类型"> {{ orderData.projectTypeLabel }} </el-descriptions-item>
    <el-descriptions-item label="品牌名称"> {{ orderData.productBrandIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="订单价格"> {{ orderData.orderPrice }} </el-descriptions-item>
    <el-descriptions-item label="订单车辆" :span="2"> {{ orderData.carBrandLabel }} </el-descriptions-item>
    <el-descriptions-item label="客户昵称"> {{ orderData.nickname }} </el-descriptions-item>
    <el-descriptions-item label="预留电话"> {{ orderData.telephone }} </el-descriptions-item>
    <el-descriptions-item label="客户标签"> {{ orderData.tagIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="账户余额">
      {{ orderData.accountBalance }}
      <el-button v-if="!readonly" type="text" @click="handleRecharge">充值</el-button>
    </el-descriptions-item>
  </el-descriptions>

  <UserRecharge v-model:visible="rechargeInfo.visible" :target-info="rechargeData" @confirm-call-back=""></UserRecharge>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { OrderDesc } from '@/api/order-management/order/types';
import UserRecharge from '@/views/customer-management/customer/user-recharge.vue';

const props = defineProps({
  title: { type: String, default: '' },
  readonly: {
    type: Boolean,
    default: false
  },
  orderData: {
    type: Object as PropType<OrderDesc>,
    default: () => {
      return {
        orderName: '',
        productName: '',
        brandName: '',
        orderPrice: '',
        carBrandLabel: '',
        nickname: '',
        telephone: '',
        tagIdLabel: '',
        accountBalance: ''
      };
    }
  }
});

const rechargeInfo = reactive({
  visible: false
});
const rechargeData = reactive({});
const handleRecharge = () => {
  Object.assign(rechargeData, {});
  rechargeInfo.visible = true;
};
</script>
<style scoped lang="scss"></style>
