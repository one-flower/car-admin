<template>
  <el-drawer
    :model-value="visible"
    title="提成明细"
    direction="rtl"
    size="800px"
    close-on-click-modal
    :before-close="() => emit('update:visible', false)"
  >
    <div class="p-2">
      <div class="mb-[10px]">
        <el-descriptions title="员工信息" :column="3" border>
          <el-descriptions-item label="员工编号" :min-width="100"> {{ pesronInfo.staffCode }}</el-descriptions-item>
          <el-descriptions-item label="员工姓名" :min-width="100"> {{ pesronInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="员工岗位" :min-width="100"> {{ pesronInfo.configPostIdLabel }}
          </el-descriptions-item>
          <el-descriptions-item label="员工性别" :min-width="100"> {{ pesronInfo.genderLabel }}</el-descriptions-item>
          <el-descriptions-item label="联系电话" :min-width="100"> {{ pesronInfo.telephone }}</el-descriptions-item>
          <el-descriptions-item label="在职状态" :min-width="100"> {{ pesronInfo.stateLabel }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                  :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="data.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="订单类型" prop="type">
                <el-select v-model="data.queryParams.type" value-key="post" placeholder="请选择订单类型" clearable
                           filterable>
                  <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="data.queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable
                           filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单时间" prop="createTime">
                <el-date-picker
                  v-model="dateRange"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="提成方式" prop="commDistri">
                <el-select v-model="data.queryParams.commDistri" value-key="" placeholder="请选择提成方式" clearable
                           filterable>
                  <el-option v-for="item in dictObj.dictEnum__commDistri" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分配状态" prop="commState">
                <el-select v-model="data.queryParams.commState" value-key="" placeholder="请选择分配状态" clearable
                           filterable>
                  <el-option v-for="item in commStateDict" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
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

      <el-alert :title="`个人提成累计：${tableInfo?.totalMoney ?? 0} 元`" :show-icon="true" type="info" effect="dark"
                :closable="false"></el-alert>
      <el-card shadow="hover">
        <!-- <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableAttr.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template> -->
        <el-table v-loading="loading" :data="tableData" tooltip-effect="dark myTooltips">
          <el-table-column label="订单类型" align="center" prop="orderTypeLabel" show-overflow-tooltip />
          <el-table-column label="订单编号" align="center" prop="orderNo" show-overflow-tooltip />
          <el-table-column label="项目类型" align="center" prop="projectTypeLabel" show-overflow-tooltip />
          <el-table-column label="产品品牌" align="center" prop="productBrandLabel" show-overflow-tooltip />
          <el-table-column label="订单产品" align="center" prop="productIdLabel" show-overflow-tooltip />
          <el-table-column label="订单时间" align="center" prop="createTime" show-overflow-tooltip />
          <el-table-column label="提成总额" align="center" prop="commPrice" show-overflow-tooltip />
          <el-table-column label="个人提成" align="center" prop="personalCommPrice" show-overflow-tooltip />
          <el-table-column label="提成方式" align="center" prop="commDistriLabel" show-overflow-tooltip />
          <el-table-column label="分配状态" align="center" prop="commStateLabel" show-overflow-tooltip />
        </el-table>

        <pagination
          v-show="tableAttr.total > 0"
          v-model:page="data.queryParams.pageNum"
          v-model:limit="data.queryParams.pageSize"
          :total="tableAttr.total"
          @pagination="getTableData"
        />
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup name="commExt" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { FormData } from '@/api/store-management/staff/types';
import { orderCommExtlist } from '@/api/order-management/order';
import { commExtTableVO, commExtFormData, commExtTableQuery } from '@/api/order-management/order/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const dictObj = toReactive<any>(
  proxy?.useNewDict('dictEnum__orderType', 'configProject__configProject', 'dictEnum__orderIsCommission', 'dictEnum__commDistri')
);
// 提成分配状态字典
const commStateDict = [
  {
    value: 'Y',
    label: '已分配'
  },
  {
    value: 'N',
    label: '未分配'
  }
];
// 订单时间查询对象
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  pesronInfo: {
    type: Object as PropType<FormData>,
    default: () => {
      return {
        staffCode: '',
        name: '',
        configPostId: '',
        cardNum: '',
        telephone: '',
        state: ''
      };
    },
    required: true
  }
});

const tableData = ref<commExtTableVO[]>([]);
const tableInfo = reactive({
  totalMoney: 0,
  pageMoney: 0
});
const loading = ref(true);
const showSearch = ref(true);

const tableAttr = reactive<TableAttr>({
  total: 0,
  ids: [],
  multiple: true
});

const queryFormRef = ref<ElFormInstance>();

const FormDataRef = ref<ElFormInstance>();

const initFormData: commExtFormData = {
  id: undefined,
  orderNo: '',
  projectTypeLabel: '',
  productBrandLabel: '',
  productIdLabel: 0,
  createTime: '',
  commPrice: 0,
  constructionTeam: '',
  personalCommPrice: 0,
  commDistri: '',
  commState: '',
  projectType: ''
};

const data = reactive<PageData<commExtFormData, commExtTableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    id: ''
  },
  rules: {}
});

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await orderCommExtlist({
    ...proxy?.addDateRange(data.queryParams, dateRange.value),
    staffId: props.pesronInfo.id
  });
  tableData.value = res.rows;
  tableInfo.totalMoney = res.rows[0]?.totalMoney;
  // tableInfo.pageMoney = res.rows.reduce((a: any, b: any) => a.personalCommPrice + b.personalCommPrice, 1);
  tableAttr.total = res.total;
  loading.value = false;
};

watch(
  () => props.pesronInfo.id,
  (newValue: string) => {
    getTableData();
  }
);

/** 表单重置 */
const reset = () => {
  data.form = { ...initFormData };
  FormDataRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  data.queryParams.pageNum = 1;

  getTableData();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  data.queryParams.pageNum = 1;
  dateRange.value = ['', ''];
  handleQuery();
};

const init = async () => {
  getTableData();
};

init();
</script>
