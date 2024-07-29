<template>
  <el-drawer :model-value="visible" title="客户档案" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="mb10">
      <el-descriptions title="客户信息" :column="2" border>
        <el-descriptions-item label="客户编号" column="2"> {{ basicData.customNo }} </el-descriptions-item>
        <el-descriptions-item label="客户标签"> {{ basicData.tagIdLabel }} </el-descriptions-item>
        <el-descriptions-item label="客户昵称"> {{ basicData.nickname }} </el-descriptions-item>
        <el-descriptions-item label="手机号码"> {{ basicData.telephone }} </el-descriptions-item>
        <el-descriptions-item label="客户来源"> {{ basicData.channelLabel }} </el-descriptions-item>
        <el-descriptions-item label="账户余额"> {{ basicData.totalMoney }} </el-descriptions-item>
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
        <el-table-column label="车辆品牌" align="center" prop="brandIdLabel" />
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <!-- <el-table-column label="车架号码" align="center" prop="vin" /> -->
        <el-table-column label="车辆归属" align="center" prop="toTypeLabel" />
        <el-table-column label="车辆状态" align="center" prop="carStateLabel" />
        <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="装配情况" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link @click="handleFabricate(row)">
                <svg-icon class-name="search-icon" icon-class="car-change" />
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
  </el-drawer>

  <!-- 车辆装配 -->
  <CarFabricate v-model:visible="fabricateInfo.visible" :title="fabricateInfo.title" :basic-data="fabricateInfo.data"> </CarFabricate>
</template>

<script setup lang="ts">
import { carManageList } from '@/api/customer-management/car';
import { FormData, TableQuery, TableVO } from '@/api/customer-management/car/types';
import CarFabricate from '@/components/car-fabricate/index.vue';

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
  queryParams: { pageNum: 1, pageSize: 20 },
  data: [],
  total: 0
});

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await carManageList({
    ...tableInfo.queryParams,
    customId: props.basicData.id
  });
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};

// 车辆装配
const fabricateInfo = reactive({
  visible: false,
  title: '客户档案',
  data: <any>{}
});
const handleFabricate = async (row: TableVO) => {
  fabricateInfo.data = {
    customId: props.basicData.id,
    customIdObj: props.basicData,
    brandIdLabel: row.brandIdLabel,
    licensePlate: row.licensePlate,
    vin: row.vin,
    toTypeLabel: row.toTypeLabel
  };
  fabricateInfo.visible = true;
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
