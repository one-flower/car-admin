<template>
  <div class="p-2">
    {{ changeDialog.visible }}
    {{ changeDialog.form }}
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.prevent>
            <el-form-item label="客户标签" prop="tagId">
              <el-select v-model="queryParams.tagId" value-key="" placeholder="" clearable filterable @change="">
                <el-option v-for="item in dictObj.customerTag" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户昵称" prop="nickname">
              <el-input v-model="queryParams.nickname" placeholder="请输入客户昵称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="手机号码" prop="telephone">
              <el-input v-model="queryParams.telephone" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="绑定状态" prop="label"> </el-form-item>
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
        <el-table-column label="客户编号" align="center" prop="customNo" />
        <el-table-column label="客户标签" align="center" prop="tagIdLabel" />
        <el-table-column label="手机号码" align="center" prop="telephone" />
        <el-table-column label="客户昵称" align="center" prop="nickname" />
        <el-table-column label="账户余额" align="center" prop="accountBalance" />
        <el-table-column label="绑定状态" align="center" prop="" />
        <el-table-column label="操作" width="220" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="账户充值" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click=""></el-button>
            </el-tooltip>
            <el-tooltip content="更换号码" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleChangePhone(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="解绑" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click=""></el-button>
            </el-tooltip>
            <el-tooltip content="客户档案" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click=""></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleUpdate(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
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
      <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="80px" @submit.prevent>
        <template v-if="form.id !== undefined">
          <el-form-item label="客户编号">
            {{ form.customNo }}
          </el-form-item>
          <el-form-item label="手机号码"> {{ form.telephone }} </el-form-item>
        </template>
        <el-form-item label="客户标签" prop="tagId">
          <el-select v-model="form.tagId" placeholder="请选择客户标签" clearable filterable>
            <el-option v-for="item in dictObj.customerTag" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入客户昵称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号码" prop="telephone" v-if="form.id === undefined">
          <el-input v-model="form.telephone" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="渠道来源" prop="channel">
          <el-select v-model="form.channel" placeholder="请选择渠道来源" clearable filterable @change="">
            <el-option v-for="item in dictObj.channelSource" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
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

    <change-phone v-model:visible="changeDialog.visible" v-model:form="changeDialog.form"></change-phone>
  </div>
</template>
<script setup name="channelSource" lang="ts">
import { customList, customAdd, customDel, customInfo, customUp } from '@/api/customer-management/customer';
import { FormData, PhoneForm, TableQuery, TableVO } from '@/api/customer-management/customer/types';
import { configTagList } from '@/api/sys/custom-tag';
import { configChannelList } from '@/api/sys/channel-source';
import changePhone from './change-phone.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableData = ref<TableVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const tableAttr = reactive<TableAttr>({
  ids: [],
  multiple: true,
  total: 0
});

const queryFormRef = ref<ElFormInstance>();

const pageTitle = '渠道来源';
const FormDataRef = ref<ElFormInstance>();
const dictObj = {
  customerTag: [],
  bindState: [],
  channelSource: []
};

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  tagId: '',
  nickname: '',
  telephone: '',
  channel: '',
  remarks: ''
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tagId: '',
    nickname: '',
    telephone: ''
  },
  rules: {
    tagId: [{ required: true, message: '客户标签不能为空', trigger: ['blur', 'change'] }],
    nickname: [{ required: true, message: '客户昵称不能为空', trigger: 'blur' }],
    telephone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
    channel: [{ required: true, message: '渠道来源不能为空', trigger: ['blur', 'change'] }]
  }
});

const { queryParams, form, rules } = toRefs<PageData<FormData, TableQuery>>(data);

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await customList(queryParams.value);
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

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await customInfo(postId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = `修改${pageTitle}`;
};

/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.id ? await customUp(form.value) : await customAdd(form.value);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getTableData();
    }
  });
};

/** 账户充值 */

/** 修改手机号 */
type ChangeDialog = {
  visible: boolean;
  form: PhoneForm;
};
const changeDialog = reactive<ChangeDialog>({
  visible: false,
  form: {
    id: '',
    customNo: '',
    tagId: '',
    nickname: '',
    telephone: ''
  }
});
const handleChangePhone = async (row?: TableVO) => {
  const postId = row?.id || tableAttr.ids[0];
  const res = await customInfo(postId);
  Object.assign(changeDialog.form, res.data);
  changeDialog.visible = true;
};

/** 客户档案 */

/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableAttr.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await customDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};
const init = async () => {
  const tagRes = await configTagList({ pageNum: 1, pageSize: 99999 });
  const channelRes = await configChannelList({ pageNum: 1, pageSize: 99999 });

  dictObj.customerTag = tagRes.rows.map((item) => {
    return { label: item.label, value: item.id };
  });
  dictObj.channelSource = channelRes.rows.map((item) => {
    return { label: item.label, value: item.id };
  });

  getTableData();
};

init();
</script>
