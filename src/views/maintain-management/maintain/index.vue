<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="车辆品牌" prop="brandName">
              <el-select v-model="tableInfo.queryParams.productId" value-key="" placeholder="请选择车辆品牌" clearable filterable>
                <el-option v-for="item in dictObj.clyhBrand__clyhBrand" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="车架号码" prop="vin">
              <el-input v-model="tableInfo.queryParams.vin" placeholder="请输入车架号码" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="车牌号码" prop="brandId">
              <el-input v-model="tableInfo.queryParams.brandId" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品名称" prop="productId">
              <el-select v-model="tableInfo.queryParams.productId" value-key="" placeholder="请选择产品名称" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划保养日期" prop="planDateDateRange">
              <el-date-picker
                v-model="planDateDateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="实际保养日期" prop="realityDateDateRange">
              <el-date-picker
                v-model="realityDateDateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="保养状态" prop="state">
              <el-select v-model="tableInfo.queryParams.state" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__frequencyState" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
          <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="项目类型" align="center" prop="projectTypeName" />
        <el-table-column label="车辆品牌" align="center" prop="brandName" />
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <!-- <el-table-column label="车架号码" align="center" prop="vin" /> -->
        <el-table-column label="产品品牌" align="center" prop="productBrandName" />
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="保养记录" align="center" prop="currentNum">
          <template #default="{ row }">
            {{ row.currentNum ? `第 ${row.currentNum} 次` : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="计划保养日期" align="center" prop="planDate" show-overflow-tooltip />
        <el-table-column label="实际保养日期" align="center" prop="realityDate" show-overflow-tooltip />
        <el-table-column label="保养状态" align="center" prop="stateLabel" />
        <el-table-column label="操作" width="100" header-align="center" align="left" class-name="small-padding fixed-width" fixed="right">
          <template #default="{ row }">
            <template v-if="!['IN_MAINTAIN', 'ALREADY_MAINTAIN'].includes(row.state)">
              <el-tooltip v-if="row.isExpire === 'N'" content="进店保养" placement="top">
                <el-button v-hasPermi="['clyh:frequency:inStore']" link @click="handleAdd(row, 'MAINTAIN')">
                  <svg-icon icon-class="in-store"></svg-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="row.isCrossStore === 'Y' && row.isExpire === 'N'" content="跨店保养" placement="top">
                <el-button v-hasPermi="['clyh:frequency:unionStore']" link @click="handleAdd(row, 'CROSS_STORE')">
                  <svg-icon icon-class="union-store"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
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
    </el-card>

    <!-- 添加 -->
    <order-add v-model:visible="formInfo.visible" :title="formInfo.title" :basic-data="formInfo.data" @confirm="getTableData"></order-add>
  </div>
</template>

<script setup name="maintain" lang="ts">
import { frequencyAdd, frequencyDel, frequencyUp, frequencyInfo, frequencyList } from '@/api/maintain-management/maintain';
import { FormData, TableQuery, TableVO } from '@/api/maintain-management/maintain/types';
import OrderAdd from '@/components/order-add/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const dictObj = toReactive<any>(proxy?.useNewDict('clyhBrand__clyhBrand', 'configProject__configProject', 'dictEnum__frequencyState'));
const realityDateDateRange = ref<[DateModelType, DateModelType]>(['', '']);
const planDateDateRange = ref<[DateModelType, DateModelType]>(['', '']);
const queryFormRef = ref<ElFormInstance>();
const tableInfo = reactive<TableInfo<TableQuery, TableVO[]>>({
  ids: [],
  multiple: true,
  loading: false,
  showSearch: true,
  queryParams: { pageNum: 1, pageSize: 20 },
  data: [],
  total: 0
});

const initFormData: FormData = {
  id: undefined,
  brandName: '',
  vin: '',
  licensePlate: '',
  projectType: '',
  productBrandName: '',
  productName: '',
  currentNum: '',
  planDate: '',
  state: '',
  orderNo: ''
};
const formRef = ref<ElFormInstance>();
const formInfo = reactive({
  visible: false,
  title: '',
  disabled: true,
  data: {}
});

const rules = {
  name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  isOrg: [{ required: true, message: '上游机构不能为空', trigger: 'change' }],
  upOrg: [{ required: true, message: '上游机构不能为空', trigger: ['blur', 'change'] }]
};

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;

  let queryParams = proxy?.addDateRange(tableInfo.queryParams, realityDateDateRange.value, 'realityDate');
  queryParams = proxy?.addDateRange(queryParams, planDateDateRange.value, 'planDate');
  const res = await frequencyList({ ...queryParams, isExpire: 'N' });
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
  realityDateDateRange.value = ['', ''];
  planDateDateRange.value = ['', ''];
  tableInfo.queryParams.pageNum = 1;
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: TableVO[]) => {
  tableInfo.ids = selection.map((item) => item.id);
  tableInfo.multiple = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = (row, type) => {
  formInfo.data = {
    otherId: row.id,
    type: type,
    projectTypeLabel: row.projectTypeLabel,
    carManageId: row.carManageId,
    carManageIdLabel: row.carManageIdLabel,
    productBrandId: row.productBrandId,
    productBrandIdLabel: row.productBrandIdLabel,
    productId: row.productId,
    productIdLabel: row.productIdLabel,
    orderPrice: row.orderPrice ?? 0
  };
  formInfo.visible = true;
};

/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableInfo.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await frequencyDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableInfo.ids[0];
  const res = await frequencyInfo(postId);
  formInfo.data = res.data;
  formInfo.visible = true;
  formInfo.title = '品牌详情';
};

const init = async () => {
  getTableData();
};

init();
</script>
