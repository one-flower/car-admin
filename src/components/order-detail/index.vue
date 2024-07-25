<template>
  <!-- 基础信息 -->
  <el-descriptions :title="orderTitle" :column="2" border class="mb10">
    <el-descriptions-item label="订单类型"> {{ orderData.typeLabel }}</el-descriptions-item>
    <el-descriptions-item label="项目类型"> {{ orderData.projectTypeLabel }} </el-descriptions-item>
    <el-descriptions-item label="品牌名称"> {{ orderData.productBrandIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="订单价格"> {{ orderData.orderPrice }} 元</el-descriptions-item>
    <el-descriptions-item label="订单车辆" :span="2"> {{ orderData.carBrandLabel }} </el-descriptions-item>
    <el-descriptions-item label="客户昵称"> {{ orderData.nickname }} </el-descriptions-item>
    <el-descriptions-item label="预留电话"> {{ orderData.telephone }} </el-descriptions-item>
    <el-descriptions-item label="客户标签"> {{ orderData.tagIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="账户余额">
      {{ orderData.accountBalance }} 元
      <el-button v-if="!readonly" link type="primary" @click="handleRecharge">充值</el-button>
    </el-descriptions-item>
  </el-descriptions>
  <!-- 配置和支付 -->
  <template v-if="configPayShow">
    <el-descriptions :title="cinfigPayTitle" :column="2" border class="mb10">
      <el-descriptions-item label="负责人" :span="2"> {{ configPyaData.directorIdLabel }} </el-descriptions-item>
      <el-descriptions-item label="作业团队" :span="2"> {{ configPyaData.workTeamLabel }} </el-descriptions-item>
      <el-descriptions-item label="订单施工" :span="2"> {{ configPyaData.isFlowLabel }} </el-descriptions-item>
      <!-- 无提成  -->
      <template v-if="!configPyaData.isCommission">
        <!-- 无提成 稍后支付 -->
        <template v-if="configPyaData.orderPayType === 'LATER_ON_PAY'">
          <el-descriptions-item label="订单提成"> {{ configPyaData.isCommissionLabel }} </el-descriptions-item>
          <el-descriptions-item label="订单支付"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
        </template>
        <template v-else>
          <el-descriptions-item label="订单提成"> {{ configPyaData.isCommissionLabel }} </el-descriptions-item>
          <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户支付"> {{ configPyaData.accountPrice }} 元 </el-descriptions-item>
          <el-descriptions-item label="现金支付" :span="2"> {{ configPyaData.cashPrice }} 元 </el-descriptions-item>
        </template>
      </template>
      <template v-else>
        <template v-if="configPyaData.orderPayType === 'LATER_ON_PAY'">
          <el-descriptions-item label="提成金额"> {{ configPyaData.commPrice }} 元 </el-descriptions-item>
          <el-descriptions-item label="提成分配"> {{ configPyaData.commDistriLabel }} </el-descriptions-item>
          <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
        </template>
        <template v-else>
          <el-descriptions-item label="提成金额"> {{ configPyaData.commPrice }} 元 </el-descriptions-item>
          <el-descriptions-item label="提成分配"> {{ configPyaData.commDistriLabel }} </el-descriptions-item>
          <el-descriptions-item label="订单支付" :span="2"> {{ configPyaData.orderPayTypeLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户支付"> {{ `${configPyaData.accountPrice}` }} 元 </el-descriptions-item>
          <el-descriptions-item label="现金支付" :span="2"> {{ configPyaData.cashPrice }} 元 </el-descriptions-item>
        </template>
      </template>
      <el-descriptions-item label="备注" :span="2"> {{ configPyaData.remarks }} </el-descriptions-item>
    </el-descriptions>
    <el-descriptions :title="`实际支付${configPyaData.realityPrice}元`" border class="mb10" />
  </template>
  <!-- 日志 -->
  <el-steps :active="orderLogList.length" direction="vertical" process-status="success" finish-status="success">
    <el-step v-for="item in orderLogList" :key="item.key" :title="item.orderState">
      <template #description>
        <el-descriptions title="" :column="1" border class="mb10">
          <el-descriptions-item label="处理人员"> {{ item.createByLabel }} </el-descriptions-item>
          <el-descriptions-item label="操作时间"> {{ item.createTime }} </el-descriptions-item>
          <el-descriptions-item label="备注说明"> {{ item.remarks }} </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-step>
  </el-steps>
  <UserRecharge v-model:visible="rechargeInfo.visible" :target-info="rechargeInfo.data" @confirm-call-back="changePrice"></UserRecharge>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import UserRecharge from '@/views/customer-management/customer/user-recharge.vue';

const emit = defineEmits(['update:orderData']);
const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  },
  orderTitle: { type: String, default: '订单信息' },
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
  },
  configPayShow: {
    type: Boolean,
    default: true
  },
  cinfigPayTitle: { type: String, default: '配置与支付' },
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
  orderLogList: {
    type: Object,
    default: () => {
      return [];
    }
  }
});

const rechargeInfo = reactive({
  visible: false,
  data: {}
});

const handleRecharge = () => {
  rechargeInfo.data = {
    id: props.orderData.customId,
    nickname: props.orderData.nickname,
    telephone: props.orderData.telephone,
    tagIdLabel: props.orderData.tagIdLabel,
    accountBalance: props.orderData.accountBalance
  };
  rechargeInfo.visible = true;
};
const changePrice = (val: string) => {
  props.orderData.accountBalance = val;
};
</script>
<style scoped lang="scss"></style>
