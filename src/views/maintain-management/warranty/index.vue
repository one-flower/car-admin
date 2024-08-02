<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="tableInfo.queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="车架号码" prop="vin">
              <el-input v-model="tableInfo.queryParams.vin" placeholder="请输入车架号码" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item label="车牌号码" prop="licensePlate">
              <el-input v-model="tableInfo.queryParams.licensePlate" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品品牌" prop="productBrandId">
              <el-select
                v-model="tableInfo.queryParams.productBrandId"
                value-key=""
                placeholder="请选择产品品牌"
                clearable
                filterable
                @change="changeBrand"
              >
                <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="tableInfo.queryParams.productId"
                :disabled="productLoading"
                value-key=""
                placeholder="请选择产品名称"
                clearable
                filterable
              >
                <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.productName" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质保开始日期" prop="startDate">
              <el-date-picker
                v-model="tableInfo.queryParams.startDate"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="开始日期"
              />
            </el-form-item>
            <el-form-item label="质保结束日期" prop="endDate">
              <el-date-picker
                v-model="tableInfo.queryParams.endDate"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="质保状态" prop="state">
              <el-select v-model="tableInfo.queryParams.state" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__warrantyState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          <!-- <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableInfo.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col> -->
          <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="车辆品牌" align="center" prop="brandName" />
        <!-- <el-table-column label="车架号码" align="center" prop="vin" /> -->
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <el-table-column label="项目类型" align="center" prop="projectTypeLabel" />
        <el-table-column label="产品品牌" align="center" prop="productBrandName" />
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="质保开始" align="center" prop="startDate" show-overflow-tooltip />
        <el-table-column label="质保结束" align="center" prop="endDate" show-overflow-tooltip />
        <el-table-column label="质保状态" align="center" prop="stateLabel" />
        <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="保养记录" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link @click="handleLog(row)">
                <svg-icon class-name="search-icon" icon-class="order-log"></svg-icon>
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

    <!-- 添加或修改品牌对话框 -->
    <el-dialog v-model="formInfo.visible" :title="formInfo.title" width="700px" append-to-body>
      <el-form ref="FormDataRef" :model="formInfo.data" :rules="rules" label-width="80px" :disabled="formInfo.disabled" @submit.prevent> </el-form>
    </el-dialog>

    <FrequencyLogItem v-model:visible="frequencyInfo.visible" :basic-data="frequencyInfo.data"></FrequencyLogItem>
  </div>
</template>

<script setup name="Brand" lang="ts">
import { warrantyInfo, warrantyList } from '@/api/maintain-management/warranty';

import { FormData, TableQuery, TableVO } from '@/api/maintain-management/warranty/types';
import FrequencyLogItem from './frequency-log.vue';
import { productDropdown } from '@/api/product-management/product';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy?.useDict('configProject__configProject', 'configProductBrand__configProductBrand', 'dictEnum__warrantyState'));
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
  id: undefined
};
const formRef = ref<ElFormInstance>();
const formInfo = reactive<FormInfo<FormData>>({
  visible: false,
  title: '',
  disabled: true,
  data: { ...initFormData }
});

const rules = {
  name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  isOrg: [{ required: true, message: '上游机构不能为空', trigger: 'change' }],
  upOrg: [{ required: true, message: '上游机构不能为空', trigger: ['blur', 'change'] }]
};

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await warrantyList(tableInfo.queryParams);
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};

const productLoading = ref(false);
const changeBrand = async (val: string) => {
  tableInfo.queryParams.productId = '';
  productLoading.value = true;
  dictObj.productList = await productDropdown({
    productBrandId: val
  });
  productLoading.value = false;
};
/** 取消按钮 */
const cancel = () => {
  reset();
  formInfo.visible = false;
};

/** 表单重置 */
const reset = () => {
  formInfo.data = { ...initFormData };
  formRef.value?.resetFields();
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

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableInfo.ids[0];
  const res = await warrantyInfo(postId);
  formInfo.data = res.data;
  formInfo.visible = true;
  formInfo.title = '品牌详情';
};

const frequencyInfo = reactive({
  visible: false,
  title: '',
  data: {}
});
const handleLog = async (row?: TableVO) => {
  frequencyInfo.data = row;
  frequencyInfo.visible = true;
};

const init = async () => {
  getTableData();
};

init();
</script>
