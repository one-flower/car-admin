<template>
  <el-drawer :model-value="visible" title="充值记录" direction="rtl" size="80%" close-on-click-modal @close="() => emit('update:visible', false)">
    <div class="p-2">
      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.prevent>
              <el-form-item label="充值时间" prop="type">
                <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
              </el-form-item>
              <el-form-item label="客户昵称" prop="projectType">
                <el-input v-model="queryParams.customName" placeholder="请输入客户昵称" />
              </el-form-item>
              <el-form-item label="预留电话" prop="createTime">
                <el-input v-model="queryParams.customTelephone" placeholder="请输入预留电话" />
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
        <el-table v-loading="loading" :data="tableData" tooltip-effect="dark myTooltips">
          <el-table-column label="客户昵称" align="center" prop="customName" />
          <el-table-column label="预留电话" align="center" prop="customTelephone" />
          <el-table-column label="套餐名称" align="center" prop="rechargeName" />
          <el-table-column label="充值金额" align="center" prop="realityMoney" />
          <el-table-column label="赠送金额" align="center" prop="giveMoney" />
          <el-table-column label="账户余额" align="center" prop="remainingSum" />
          <el-table-column label="经办人" align="center" prop="" />
          <el-table-column label="充值时间" align="center" prop="" />
        </el-table>

        <pagination
          v-show="tableAttr.total > 0"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          :total="tableAttr.total"
          @pagination="getTableData"
        />
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup name="commExt" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { rechargeLogList } from '@/api/store-management/recharge';
import { logTableVO, logTableQuery } from '@/api/store-management/recharge/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  targetInfo: {
    type: Object,
    default: () => {
      return [];
    },
    required: true
  }
});

const tableData = ref<logTableVO[]>([]);
const tableInfo = reactive({
  totalMoney: props.targetInfo.totalMoney,
  pageMoney: props.targetInfo.pageMoney
});
const loading = ref(true);
const showSearch = ref(true);

const tableAttr = reactive<TableAttr>({
  total: 0,
  ids: [],
  multiple: true
});

const queryFormRef = ref<ElFormInstance>();
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const queryParams = reactive<logTableQuery>({
  pageNum: 1,
  pageSize: 10
});

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;

  const res = await rechargeLogList(proxy?.addDateRange(queryParams, dateRange.value));
  tableData.value = res.rows;
  tableInfo.totalMoney = res.rows[0]?.totalMoney;
  tableInfo.pageMoney = res.rows.reduce((a: any, b: any) => a.personalCommPrice + b.personalCommPrice, 0);
  tableAttr.total = res.total;
  loading.value = false;
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getTableData();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
};

const init = async () => {
  getTableData();
};

init();
</script>
