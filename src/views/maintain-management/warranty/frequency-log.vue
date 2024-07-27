<template>
  <el-drawer :model-value="visible" title="车辆装配" direction="rtl" size="800px" close-on-click-modal :before-close="closeDom">
    <div class="p-2">
      <div class="mb10">
        <el-descriptions title="产品质保" :column="3" border>
          <el-descriptions-item label="车架号牌"> {{ basicData.vin }} </el-descriptions-item>
          <el-descriptions-item label="车辆品牌"> {{ basicData.brandName }} </el-descriptions-item>
          <el-descriptions-item label="车牌号码"> {{ basicData.licensePlate }} </el-descriptions-item>
          <el-descriptions-item label="项目类型"> {{ basicData.productName }} </el-descriptions-item>
          <el-descriptions-item label="产品名称"> {{ basicData.productBrandName }} </el-descriptions-item>
          <el-descriptions-item label="保养频率"> {{ basicData.currentNum }} </el-descriptions-item>
        </el-descriptions>
      </div>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="tableInfo.showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="订单编号" prop="orderNo">
                <el-input v-model="tableInfo.queryParams.orderNo" placeholder="请输入套餐名称" />
              </el-form-item>
              <el-form-item label="保养方式" prop="rechargeId">
                <el-input v-model="tableInfo.queryParams.rechargeId" placeholder="请输入套餐名称" />
              </el-form-item>
              <el-form-item label="计划日期" prop="type">
                <el-date-picker
                  v-model="dateRangePlan"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="实际日期" prop="type">
                <el-date-picker
                  v-model="dateRange"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="保养状态" prop="state">
                <el-input v-model="tableInfo.queryParams.state" placeholder="请输入套餐名称" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </transition>

      <el-card shadow="hover">
        <template #header>
          <el-row :gutter="10" class="mb8">
            <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
          </el-row>
        </template>
        <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
          <el-table-column label="保养记录" align="center" prop="currentNum">
            <template #default="{ row }">
              {{ `第${row.currentNum}次` }}
            </template>
          </el-table-column>
          <el-table-column label="计划日期" align="center" prop="planDate" show-overflow-tooltip />
          <el-table-column label="实际日期" align="center" prop="realityDate" show-overflow-tooltip />
          <el-table-column label="保养方式" align="center" prop="projectType" />
          <el-table-column label="订单编号" align="center" prop="orderNo" />
          <el-table-column label="保养状态" align="center" prop="state" />
          <!-- <el-table-column label="操作" align="center" prop="">
            <template #default="{ row }">
              <el-tooltip content="详情" placement="top">
                <el-button v-hasPermi="['system:post:detail']" link type="info" icon="InfoFilled" @click="handleDetail(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column> -->
        </el-table>

        <pagination
          v-show="tableInfo.total > 0"
          v-model:page="tableInfo.queryParams.pageNum"
          v-model:limit="tableInfo.queryParams.pageSize"
          :total="tableInfo.total"
          @pagination="getTableData"
        />
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes';
import { frequencyList } from '@/api/maintain-management/maintain';
import {} from '@/api/maintain-management/maintain/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emit = defineEmits(['update:visible', 'cancel']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  basicData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const dateRangePlan = ref<[DateModelType, DateModelType]>(['', '']);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const queryFormRef = ref<ElFormInstance>();
const tableInfo = reactive({
  showSearch: true,
  loading: false,
  queryParams: { pageNum: 1, pageSize: 10 },
  total: 0,
  data: []
});

/** 查询列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const params1 = proxy?.addDateRange(tableInfo.queryParams, dateRangePlan.value, 'planDate');
  const params2 = proxy?.addDateRange(params1, dateRange.value, 'realityDate');
  const res = await frequencyList(params2);
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};
/** 搜索按钮操作 */
const handleQuery = () => {
  tableInfo.queryParams.pageNum = 1;
  getTableData();
};
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  tableInfo.queryParams.pageNum = 1;
  handleQuery();
};

const handleDetail = (row) => {};

const closeDom = () => {
  emit('update:visible', false);
};

watch(
  () => props.visible,
  () => {
    getTableData();
  }
);
</script>
<style scoped lang="scss"></style>
