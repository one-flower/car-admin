<template>
  <OrderPayDescItme :title="'订单信息'" :readonly="readonly" :order-data="orderData"></OrderPayDescItme>
  <el-descriptions title="配置与支付" :column="2" border class="mb10">
    <el-descriptions-item label="负责人" :span="2"> {{ configPyaData.directorIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="作业团队" :span="2"> {{ configPyaData.workTeamLabel }} </el-descriptions-item>
    <el-descriptions-item label="订单施工" :span="2"> {{ configPyaData.isFlowLabel }} </el-descriptions-item>
    <!-- 无提成 稍后支付 -->
    <template v-if="configPyaData.isCommission">
      <!-- 无提成  -->
      <template v-if="configPyaData.orderPayType === 'LATER_ON_PAY'">
        <el-descriptions-item label="订单提成"> {{ configPyaData.isCommissionLabel }} </el-descriptions-item>
        <el-descriptions-item label="订单支付"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
      </template>
      <template v-else>
        <el-descriptions-item label="订单提成"> {{ configPyaData.isCommissionLabel }} </el-descriptions-item>
        <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
        <el-descriptions-item label="账户支付"> {{ configPyaData.accountPrice }} </el-descriptions-item>
        <el-descriptions-item label="现金支付" :span="2"> {{ configPyaData.cashPrice }} </el-descriptions-item>
      </template>
    </template>
    <template v-else>
      <template v-if="configPyaData.orderPayType === 'LATER_ON_PAY'">
        <el-descriptions-item label="提成金额"> {{ configPyaData.commPrice }} </el-descriptions-item>
        <el-descriptions-item label="提成分配"> {{ configPyaData.commDistriLabel }} </el-descriptions-item>
        <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
      </template>
      <template v-else>
        <el-descriptions-item label="提成金额"> {{ configPyaData.commPrice }} </el-descriptions-item>
        <el-descriptions-item label="提成分配"> {{ configPyaData.commDistriLabel }} </el-descriptions-item>
        <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
        <el-descriptions-item label="账户支付"> {{ configPyaData.accountPrice }} </el-descriptions-item>
        <el-descriptions-item label="现金支付" :span="2"> {{ configPyaData.cashPrice }} </el-descriptions-item>
      </template>
    </template>
    <el-descriptions-item label="备注" :span="2"> {{ configPyaData.remarks }} </el-descriptions-item>
  </el-descriptions>
  <el-descriptions :title="`实际支付${configPyaData.realityPrice}元`" border class="mb10" />
  <el-steps :active="orderLogObj.length" direction="vertical" process-status="success" finish-status="success">
    <el-step v-for="item in orderLogObj" :key="item.key" :title="item.orderState">
      <template #description>
        <el-descriptions title="" :column="1" border class="mb10">
          <el-descriptions-item label="处理人员"> {{ item.createByLabel }} </el-descriptions-item>
          <el-descriptions-item label="操作时间"> {{ item.createTime }} </el-descriptions-item>
          <el-descriptions-item label="备注说明"> {{ item.remarks }} </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-step>
  </el-steps>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import OrderPayDescItme from './order-pay-desc.vue';

const props = defineProps({
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
        carManageName: '',
        nickname: '',
        telephone: '',
        tagIdLabel: '',
        accountBalance: ''
      };
    }
  },
  configPyaData: {
    type: Object as PropType<ConfigPayDesc>,
    default: () => {
      return {
        directorIdLabel: '',
        workTeamLabel: '',
        isFlow: '',
        isFlowLabel: '',
        isCommission: '',
        isCommissionLabel: '',
        commDistriLabel: '',
        orderPayType: '',
        orderPayTypeLabel: '',
        cashPrice: '',
        payChannel: '',
        realityPrice: '',
        remarks: ''
      };
    }
  },
  orderLogObj: {
    type: Object,
    default: () => {
      return [];
    }
  }
});
</script>
<style scoped lang="scss"></style>
