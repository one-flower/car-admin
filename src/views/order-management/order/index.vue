<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="订单类型" prop="type">
              <el-select v-model="tableInfo.queryParams.type" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="tableInfo.queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号" prop="orderNo">
              <el-input v-model="tableInfo.queryParams.orderNo" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车架号码" prop="vin">
              <el-input v-model="tableInfo.queryParams.vin" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车牌号码" prop="licensePlate">
              <el-input v-model="tableInfo.queryParams.licensePlate" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品名称" prop="label">
              <el-select v-model="tableInfo.queryParams.label" value-key="" placeholder="请选择产品品牌" clearable filterable>
                <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单时间" prop="createTime">
              <el-date-picker v-model="dateRangeStar" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="订单状态" prop="commState">
              <el-select v-model="tableInfo.queryParams.commState" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__warrantyState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单提成" prop="isCommission">
              <el-select v-model="tableInfo.queryParams.isCommission" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__warrantyState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质保状态" prop="payState">
              <el-select v-model="tableInfo.queryParams.payState" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__warrantyState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="state">
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
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableInfo.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col>
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
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link type="info" icon="InfoFilled" @click="handleDetail(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="保养记录" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link type="primary" icon="Delete" @click="handleDelete(row)"></el-button>
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
      <template v-if="!formInfo.disabled" #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Brand" lang="ts">
import { warrantyAdd, warrantyDel, warrantyUp, warrantyInfo, warrantyList } from '@/api/maintain-management/warranty';
import { FormData, TableQuery, TableVO } from '@/api/maintain-management/warranty/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy?.useDict('configProject__configProject', 'configProductBrand__configProductBrand', 'dictEnum__warrantyState'));
const dateRangeStar = ref<[DateModelType, DateModelType]>(['', '']);
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
  const params1 = proxy?.addDateRange(tableInfo.queryParams, dateRangeStar.value, 'startDate');
  const params2 = proxy?.addDateRange(params1, dateRangeStar.value, 'endDate');
  const res = await warrantyList(params2);
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: TableVO[]) => {
  tableInfo.ids = selection.map((item) => item.id);
  tableInfo.multiple = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  formInfo.visible = true;
  formInfo.title = '添加品牌';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableInfo.ids[0];
  const res = await warrantyInfo(postId);
  Object.assign(formInfo.data, res.data);

  formInfo.visible = true;
  formInfo.title = '修改品牌';
};

/** 提交按钮 */
const submitForm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      formInfo.data.id ? await warrantyUp(formInfo.data) : await warrantyAdd(formInfo.data);
      proxy?.$modal.msgSuccess('操作成功');
      formInfo.visible = false;
      await getTableData();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableInfo.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await warrantyDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableInfo.ids[0];
  const res = await warrantyInfo(postId);
  Object.assign(formInfo.data, res.data);
  formInfo.visible = true;
  formInfo.title = '品牌详情';
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/post/export',
    {
      ...tableInfo.queryParams
    },
    `post_${new Date().getTime()}.xlsx`
  );
};

const init = async () => {
  getTableData();
};

init();
</script>
