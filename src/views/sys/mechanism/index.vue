<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.prevent>
            <el-form-item label="机构名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入机构名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="统一社会代码" prop="postCode">
              <el-input v-model="queryParams.postCode" placeholder="请输入统一社会代码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model="queryParams.contacts" placeholder="请输入联系人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactUs">
              <el-input v-model="queryParams.contactUs" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="机构名称" align="left" prop="name" width="150" show-overflow-tooltip />
        <el-table-column label="机构代码" align="left" prop="orgCode" width="150" show-overflow-tooltip />
        <el-table-column label="机构地址" align="left" prop="orgAddr" width="150" show-overflow-tooltip />
        <el-table-column label="联系人" align="center" prop="contacts" width="150" />
        <el-table-column label="联系电话" align="center" prop="contactUs" width="150" />
        <el-table-column label="备注" align="center" prop="remarks" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleUpdate(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="详情" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link type="info" icon="InfoFilled" @click="handleDetail(row)"></el-button>
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
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="80px" :disabled="formDetail" @submit.prevent>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构代码" prop="orgCode">
          <el-input v-model="form.orgCode" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="机构地址" prop="orgAddr">
          <el-input v-model="form.orgAddr" placeholder="请输入机构地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactUs">
          <el-input v-model="form.contactUs" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" row="auto" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template v-if="!formDetail" #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="mechanism" lang="ts">
import { configUpOrgList, configUpOrgAdd, configUpOrgDel, configUpOrgInfo, configUpOrgUp } from '@/api/sys/mechanism';
import { FormData, TableQuery, TableVO } from '@/api/sys/mechanism/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableData = ref<TableVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const tableAttr = reactive<TableAttr>({
  ids: [],
  multiple: true,
  total: 0
});

const formDetail = ref(false);
const FormDataRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  name: '',
  remarks: '',
  orgCode: '',
  orgAddr: '',
  contacts: '',
  contactUs: '',
  postCode: undefined
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    postCode: '',
    name: '',
    orgCode: '',
    contacts: '',
    contactUs: ''
  },
  rules: {
    name: [{ required: true, message: '机构名称不能为空', trigger: 'blur' }],
    contacts: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    contactUs: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs<PageData<FormData, TableQuery>>(data);

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await configUpOrgList(queryParams.value);
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
  formDetail.value = false;
  dialog.visible = true;
  dialog.title = '添加上游机构';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await configUpOrgInfo(postId);
  Object.assign(form.value, res.data);
  formDetail.value = false;
  dialog.visible = true;
  dialog.title = '修改上游机构';
};

/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.id ? await configUpOrgUp(form.value) : await configUpOrgAdd(form.value);
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
  await configUpOrgDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableAttr.ids[0];
  const res = await configUpOrgInfo(postId);
  Object.assign(form.value, res.data);
  formDetail.value = true;
  dialog.visible = true;
  dialog.title = '上游机构详情';
};

getTableData();
</script>
