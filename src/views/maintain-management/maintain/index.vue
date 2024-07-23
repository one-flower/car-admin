<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="车辆品牌" prop="brandName">
              <el-select v-model="tableInfo.queryParams.productId" value-key="" placeholder="请选择车辆品牌" clearable filterable>
                <el-option v-for="item in dictObj.clyhBrand__clyhBrand" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车架号码" prop="vin">
              <el-input v-model="tableInfo.queryParams.vin" placeholder="请输入车架号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车牌号码" prop="brandId">
              <el-input v-model="tableInfo.queryParams.brandId" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品名称" prop="productId">
              <el-select v-model="tableInfo.queryParams.productId" value-key="" placeholder="请选择产品名称" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划日期" prop="planDate">
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
              <el-select v-model="tableInfo.queryParams.state" value-key="" placeholder="请选择质保状态" clearable filterable>
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
          <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="品牌名称" align="center" prop="brandName" />
        <el-table-column label="车架号码" align="center" prop="vin" />
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="产品品牌" align="center" prop="productBrandName" />
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="质保开始" align="center" prop="startDate" />
        <el-table-column label="质保结束" align="center" prop="endDate" />
        <el-table-column label="质保状态" align="center" prop="state" />
        <el-table-column label="更新时间" align="center" prop="updateTime" />
        <el-table-column label="操作" width="120" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="进店保养" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link @click="handleAdd(row, 'MAINTAIN')">
                <svg-icon icon-class="in-store"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="跨店保养" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link @click="handleAdd(row, 'CROSS_STORE')">
                <svg-icon icon-class="union-store"></svg-icon>
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

const dictObj = toReactive<any>(proxy?.useDict('clyhBrand__clyhBrand', 'configProject__configProject'));
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

  const res = await frequencyList(proxy?.addDateRange(tableInfo.queryParams, dateRange.value, 'planDate'));
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: TableVO[]) => {
  tableInfo.ids = selection.map((item) => item.id);
  tableInfo.multiple = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = (row, type) => {
  formInfo.data = {
    type: type,
    projectTypeLabel: row.projectTypeLabel,
    carManageId: row.carManageId,
    carManageIdLabel: row.carManageIdLabel,
    productBrandId: row.productBrandId,
    productBrandIdLabel: row.productBrandIdLabel,
    productId: row.productId,
    productIdLabel: row.productIdLabel,
    orderPrice: row.orderPrice
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
