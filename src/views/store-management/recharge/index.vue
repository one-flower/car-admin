<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.prevent>
            <el-form-item label="套餐名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入套餐名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" value-key="post" placeholder="请选择状态" clearable filterable>
                <el-option v-for="item in dictObj.clyh_recharge_state" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableAttr.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="loading" :data="tableData" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="套餐名称" align="center" prop="name" />
        <el-table-column label="充值金额" align="center" prop="realityMoney" />
        <el-table-column label="赠送金额" align="center" prop="giveMoney" />
        <el-table-column label="状态" align="center" prop="stateLabel" />
        <el-table-column label="备注" align="center" prop="remarks" show-overflow-tooltip />
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip v-if="row.state === '1'" content="充值" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="warning" @click="handleRecharge(row)">
                <svg-icon class-name="search-icon" icon-class="recharge" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="充值记录" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" @click="handleRechargeList(row)">
                <svg-icon class-name="search-icon" icon-class="recharge-log"
              /></el-button>
            </el-tooltip>
            <!-- <el-tooltip v-if="row.state === '1'" content="编辑" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleUpdate(row)"></el-button>
            </el-tooltip> -->
            <el-tooltip v-if="row.state === '0'" content="删除" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
            <el-tooltip :content="row.state === '0' ? '启用' : '禁用'" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link type="info" @click="handleState(row)">
                <svg-icon class-name="search-icon" :icon-class="row.state === '0' ? 'open' : 'close'" />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tableAttr.total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="tableAttr.total"
        @pagination="getTableData"
      />
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" append-to-body>
      <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="充值金额" prop="realityMoney">
          <el-input-number v-model="form.realityMoney as number" :precision="2" :min="0" :max="99999.99" />
        </el-form-item>
        <el-form-item label="赠送金额" prop="giveMoney">
          <el-input-number v-model="form.giveMoney as number" :precision="2" :min="0" :max="99999.99" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" row="auto" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 充值  -->
    <UserRecharge v-model:visible="userDialog.visible" :target-info="userDialog.form"></UserRecharge>
    <!-- 充值记录 -->
    <rechargeLog v-model:visible="logDialog.visible" :target-info="logDialog.form"></rechargeLog>
  </div>
</template>

<script setup name="Post" lang="ts">
import { rechargeList, rechargeAdd, rechargeDel, rechargeInfo, rechargeUp } from '@/api/store-management/recharge';
import { FormData, TableQuery, TableVO } from '@/api/store-management/recharge/types';
import UserRecharge from './user-recharge.vue';
import rechargeLog from './recharge-log.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableData = ref<TableVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);

const tableAttr = reactive<TableAttr>({
  total: 0,
  ids: [],
  multiple: true
});

const dictObj = toReactive<any>(proxy?.useDict('clyh_recharge_state'));

const queryFormRef = ref<ElFormInstance>();

const pageTitle = '渠道来源';
const FormDataRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  name: '',
  realityMoney: 0,
  giveMoney: 0,
  state: '1', // 1启用
  remarks: ''
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  rules: {
    name: [{ required: true, message: '套餐名称不能为空', trigger: 'blur' }],
    realityMoney: [{ required: true, message: '充值金额不能为空', trigger: ['change', 'blur'] }],
    giveMoney: [{ required: true, message: '赠送金额不能为空', trigger: ['change', 'blur'] }]
  }
});

const { queryParams, form, rules } = toRefs<PageData<FormData, TableQuery>>(data);

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await rechargeList(queryParams.value);
  tableData.value = res.rows;
  tableAttr.total = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  FormDataRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getTableData();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: TableVO[]) => {
  tableAttr.ids = selection.map((item) => item.id);
  tableAttr.multiple = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = `添加${pageTitle}`;
};

/** 启用禁用 */
const handleState = async (row?: TableVO) => {
  const title = row.state === '0' ? '启用' : '禁用';
  const state = row.state === '0' ? '1' : '0';
  await proxy?.$modal.confirm(`是否${title}？`);
  await rechargeUp({ ...row, state: state });
  row.state = state;
};
/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await rechargeInfo(postId);
  res.data.giveMoney = parseFloat(res.data.giveMoney as string);
  res.data.realityMoney = parseFloat(res.data.realityMoney as string);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = `修改${pageTitle}`;
};
/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.id ? await rechargeUp(form.value) : await rechargeAdd(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getTableData();
    }
  });
};
/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableAttr.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await rechargeDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

const userDialog = reactive({
  visible: false,
  title: '',
  form: <FormData>{}
});
/** 充值 */
const handleRecharge = async (row?: TableVO) => {
  const ids = row?.id || tableAttr.ids[0];
  const res = await rechargeInfo(ids);
  Object.assign(userDialog.form, res.data);
  userDialog.visible = true;
};

const logDialog = reactive({
  visible: false,
  title: '',
  form: <FormData>{}
});

/** 充值记录 */
const handleRechargeList = async (row?: TableVO) => {
  logDialog.visible = true;
  logDialog.form.id = row.id;
};

const init = async () => {
  getTableData();
};

init();
</script>
