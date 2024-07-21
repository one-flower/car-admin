<template>
  <el-drawer :model-value="visible" title="客户档案" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="mb10">
      <el-descriptions title="客户信息" :column="2" border>
        <el-descriptions-item label="客户编号" column="2"> {{ basicData.customNo }} </el-descriptions-item>
        <el-descriptions-item label="客户标签"> {{ basicData.tagIdLabel }} </el-descriptions-item>
        <el-descriptions-item label="客户昵称"> {{ basicData.nickname }} </el-descriptions-item>
        <el-descriptions-item label="手机号码"> {{ basicData.telephone }} </el-descriptions-item>
        <el-descriptions-item label="客户来源"> {{ basicData.channel }} </el-descriptions-item>
        <el-descriptions-item label="账户余额"> {{ basicData.accountBalance }} </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- <el-descriptions  title="个人信息" :column="2" border>
      <el-descriptions-item label="数据来源" column="2"> {{}} </el-descriptions-item>
      <el-descriptions-item label="注册时间"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户姓名"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户性别"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="出生日期"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="常驻地址"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="公众号关注"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="最后更新时间"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="小程序注册"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="上次登录时间"> {{}} 元</el-descriptions-item>
    </el-descriptions> -->
    <div class="mb10">
      <el-descriptions title="车辆信息" :column="2" border></el-descriptions>

      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="车辆品牌" align="center" prop="brandName" />
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <el-table-column label="车架号码" align="center" prop="vin" />
        <el-table-column label="车辆归属" align="center" prop="state" />
        <el-table-column label="车辆状态" align="center" prop="state" />
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="装配情况" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link @click="handleFabricate(row)">
                <svg-icon class-name="search-icon" icon-class="car-change" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="订单记录" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link @click="handleOrder(row)">
                <svg-icon class-name="search-icon" icon-class="order-log" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tableInfo.total > 0"
        v-model:page="tableInfo.queryParams.pageNum"
        v-model:limit="tableInfo.queryParams.pageSize"
        :total="tableInfo.total"
        @pagination="getTableData"
      />
    </div>
    <template #footer>
      <div class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 车辆装配 -->
  <FabricateInfoItem v-model:visible="fabricateInfo.visible" :title="fabricateInfo.title" :basic-data="fabricateInfo.data"></FabricateInfoItem>

  <!-- 订单记录 -->
  <OrderInfoItem v-model:visible="orderInfo.visible" :title="orderInfo.title" :basic-data="fabricateInfo.data"></OrderInfoItem>
</template>

<script setup lang="ts">
import { warrantyList } from '@/api/maintain-management/warranty';
import { FormData, TableQuery, TableVO } from '@/api/maintain-management/warranty/types';
import FabricateInfoItem from './fabricate-info.vue';
import OrderInfoItem from './order-info.vue';

const emit = defineEmits(['update:visible', 'update:form']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  basicData: {
    type: Object as PropType<FormData>,
    default: () => {
      return {};
    },
    required: true
  }
});
const handleCancel = () => {
  emit('update:visible', false);
};

const tableInfo = reactive<TableInfo<TableQuery, TableVO[]>>({
  ids: [],
  multiple: true,
  loading: false,
  showSearch: true,
  queryParams: { pageNum: 1, pageSize: 10 },
  data: [],
  total: 0
});

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await warrantyList({
    ...tableInfo.queryParams,
    customId: props.basicData.id
  });
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};

const fabricateInfo = reactive({
  visible: false,
  title: '车辆装配',
  data: {}
});
const handleFabricate = (row) => {
  fabricateInfo.data = row;
  fabricateInfo.visible = true;
};

// 订单状态
const orderInfo = reactive({
  visible: false,
  title: '订单记录',
  data: {}
});
const handleOrder = (row) => {
  orderInfo.data = row;
  orderInfo.visible = true;
};

const init = async () => {
  getTableData();
};

watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    init();
  }
);
</script>
<style scoped lang="scss">
.login-code {
  width: 33%;
  height: 35px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.login-code-img {
  height: 35px;
  padding-left: 12px;
}
</style>
