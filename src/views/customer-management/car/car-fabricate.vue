<template>
  <el-drawer :model-value="visible" title="车辆装配" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="p-2">
      <div class="mb10">
        <el-descriptions class="margin-top" title="车辆信息" :column="3" border>
          <el-descriptions-item label="车辆品牌" min-width="100"> {{ userDialog.form.nickname }} </el-descriptions-item>
          <el-descriptions-item label="车牌号码" min-width="100"> {{ userDialog.form.telephone }} </el-descriptions-item>
          <el-descriptions-item label="车架号码" min-width="100"> {{ userDialog.form.accountBalance }} </el-descriptions-item>
          <el-descriptions-item label="车辆归属" min-width="100"> {{ userDialog.form.nickname }} </el-descriptions-item>
          <el-descriptions-item label="车主昵称" min-width="100"> {{ userDialog.form.telephone }} </el-descriptions-item>
          <el-descriptions-item label="预留电话" min-width="100"> {{ userDialog.form.accountBalance }} </el-descriptions-item>
        </el-descriptions>
      </div>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="tableInfo.showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="项目类型" prop="type">
                <el-select v-model="tableInfo.queryParams.projectType" placeholder="请选择车辆品牌" clearable filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品品牌" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productBrandId" placeholder="请选择车辆品牌" clearable filterable>
                  <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productId" placeholder="请选择车辆品牌" clearable filterable>
                  <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
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
            <el-col :span="1.5">
              <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleRecharge">充值</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
          </el-row>
        </template>
        <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
          <el-table-column label="客户昵称" align="center" prop="customName" />
          <el-table-column label="预留电话" align="center" prop="customTelephone" />
          <el-table-column label="套餐名称" align="center" prop="rechargeName" />
          <el-table-column label="充值金额" align="center" prop="realityMoney" />
          <el-table-column label="赠送金额" align="center" prop="giveMoney" />
          <el-table-column label="经办人" align="center" prop="" />
          <el-table-column label="充值时间" align="center" prop="" />
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

  <!-- 添加对话框 -->
  <UserRecharge v-model:visible="userDialog.visible" :target-info="userDialog.form" @confirm-call-back="init"></UserRecharge>
</template>

<script setup name="commExt" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { TableQuery, TableVO } from '@/api/store-management/recharge/types';
import UserRecharge from './user-recharge.vue';
import { rechargeLogList } from '@/api/store-management/recharge';
import { FormData } from '@/api/customer-management/customer/types';
import { customInfo } from '@/api/customer-management/customer';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy.useNewDict('configProject__configProject', 'configProductBrand__configProductBrand'));
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  targetId: propTypes.string.def('').isRequired
});

const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const queryFormRef = ref<ElFormInstance>();
const tableInfo = reactive<TableInfo<TableQuery, TableVO[]>>({
  ids: [],
  multiple: true,
  loading: false,
  showSearch: true,
  queryParams: { pageNum: 1, pageSize: 10 },
  data: [],
  total: 0
});

/** 查询列表 */
const getTableData = async () => {
  tableInfo.loading = true;

  const res = await rechargeLogList(proxy?.addDateRange(tableInfo.queryParams, dateRange.value));
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
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  tableInfo.queryParams.pageNum = 1;
  handleQuery();
};

const initFormData: FormData = {
  id: undefined,
  tagId: '',
  nickname: '',
  telephone: '',
  channel: '',
  remarks: '',
  tagIdLabel: ''
};
const userDialog = reactive({
  visible: false,
  title: '',
  form: <FormData>{ ...initFormData }
});
/** 充值 */
const handleRecharge = async () => {
  Object.assign(userDialog.form, {});
  userDialog.visible = true;
};

const handleCancel = () => {
  emit('update:visible', false);
};

const init = async () => {
  const res = await customInfo(props.targetId);
  Object.assign(userDialog.form, res.data);
  tableInfo.queryParams.customId = props.targetId;

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
