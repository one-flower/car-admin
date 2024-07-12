<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="data.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="员工岗位" prop="configPostId">
              <el-select v-model="data.queryParams.configPostId" value-key="post" placeholder="请选择员工岗位" clearable filterable>
                <el-option v-for="item in configPost__configPost" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select v-model="data.queryParams.gender" value-key="" placeholder="请选择员工性别" clearable filterable>
                <el-option v-for="item in sys_user_sex" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="入职日期" prop="entryTime">
              <el-date-picker v-model="data.queryParams.entryTime" type="daterange" value-format="YYYY-MM-DD" placeholder="选择入职日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="员工编号" prop="staffCode">
              <el-input v-model="data.queryParams.staffCode" placeholder="请输入员工编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="员工姓名" prop="telephone">
              <el-input v-model="data.queryParams.name" placeholder="请输入员工姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="data.queryParams.telephone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="员工名片" align="center" prop="staffCardUrl" width="150px">
          <template #default="{ row }">
            <ImagePreview :width="100" :height="100" :src="row.staffCardUrl" />
          </template>
        </el-table-column>
        <el-table-column label="员工编号" align="center" prop="staffCode" show-overflow-tooltip />
        <el-table-column label="员工姓名" align="center" prop="name" />
        <el-table-column label="员工岗位" align="center" prop="configPostId" />
        <el-table-column label="员工性别" align="center" prop="gender" />
        <el-table-column label="身份证号" align="center" prop="cardNum" show-overflow-tooltip />
        <el-table-column label="联系电话" align="center" prop="telephone" show-overflow-tooltip />
        <el-table-column label="入职日期" align="center" prop="entryTime" show-overflow-tooltip />
        <el-table-column label="在职状态" align="center" prop="state">
          <template #default="{ row }">
            <dict-tag :options="clyh_staff_entry_state" :value="row.configType" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="提成明细" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="warning" icon="Document" @click="handleUpdate(row)"></el-button>
            </el-tooltip>
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
        v-model:page="data.queryParams.pageNum"
        v-model:limit="data.queryParams.pageSize"
        :total="tableAttr.total"
        @pagination="getTableData"
      />
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="FormDataRef" :model="data.form" :rules="data.rules" label-width="80px" @submit.prevent :disabled="formDetail">
        <el-form-item label="员工编号" prop="staffCode">
          <el-input v-model="data.form.staffCode" placeholder="请输入员工编号" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="data.form.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="员工岗位" prop="configPostId">
          <el-select v-model="data.form.configPostId" value-key="post" placeholder="请选择员工岗位" clearable filterable>
            <el-option v-for="item in configPost__configPost" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="data.form.gender" :disabled="data.form.id !== undefined">
            <el-radio-button v-for="item in sys_user_sex" :key="item.key" :label="item.label" :value="item.value"> </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardNum">
          <el-input v-model="data.form.cardNum" placeholder="请输入渠道来源" :disabled="data.form.id !== undefined" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="data.form.telephone" placeholder="请输入渠道来源" />
        </el-form-item>
        <el-form-item label="入职日期" prop="entryTime">
          <el-date-picker v-model="data.form.entryTime" type="date" value-format="YYYY-MM-DD hh:mm:ss" placeholder="选择日期时间"> </el-date-picker>
        </el-form-item>
        <el-form-item label="在职状态" prop="state">
          <el-radio-group v-model="data.form.state">
            <el-radio-button v-for="item in clyh_staff_entry_state" :key="item.key" :label="item.label" :value="item.value"> </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工简介" prop="snapshot">
          <el-input v-model="data.form.snapshot" type="textarea" row="auto" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="员工名片" prop="staffCardUrl">
          <imageUpload v-model="data.form.staffCardUrl" :file-size="50" :limit="1" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.form.remarks" type="textarea" row="auto" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer v-if="!formDetail">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post" lang="ts">
import { tableList, addInfo, delInfo, getInfo, updateInfo } from '@/api/store-management/staff';
import { FormData, TableQuery, TableVO } from '@/api/store-management/staff/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { configPost__configPost } = proxy?.useNewDict('configPost__configPost');
const { sys_user_sex, clyh_staff_entry_state } = toRefs<any>(proxy?.useDict('sys_user_sex', 'clyh_staff_entry_state'));

const tableData = ref<TableVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);

const tableAttr = reactive<TableAttr>({
  total: 0,
  ids: [],
  multiple: true
});

const queryFormRef = ref<ElFormInstance>();

const formDetail = ref(false);
const pageTitle = '渠道来源';
const FormDataRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  staffCode: '',
  name: '',
  configPostId: undefined,
  gender: '0',
  cardNum: '',
  telephone: '',
  entryTime: '',
  state: '0',
  snapshot: '',
  staffCardUrl: '',
  remarks: ''
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    configPostId: undefined,
    entryTime: undefined,
    gender: '',
    name: '',
    staffCode: '',
    telephone: ''
  },
  rules: {
    name: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }],
    configPostId: [{ required: true, message: '员工岗位不能为空', trigger: 'blur' }],
    gender: [{ required: true, message: '性别不能为空', trigger: 'change' }],
    cardNum: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
    entryTime: [{ required: true, message: '入职日期不能为空', trigger: 'change' }],
    state: [{ required: true, message: '在职状态不能为空', trigger: 'change' }],
    snapshot: [{ required: true, message: '员工简介不能为空', trigger: 'blur' }],
    staffCardUrl: [{ required: true, message: '员工名片不能为空', trigger: 'change' }]
  }
});

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await tableList(data.queryParams);
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
  dialog.title = `添加${pageTitle}`;
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await getInfo(postId);
  Object.assign(data.form, res.data);
  formDetail.value = false;
  dialog.visible = true;
  dialog.title = `修改${pageTitle}`;
};

/** 详情按钮操作 */
const handleDetail = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await getInfo(postId);
  Object.assign(data.form, res.data);
  formDetail.value = true;
  dialog.visible = true;
  dialog.title = `${pageTitle}详情`;
};

/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      data.form.id ? await updateInfo(data.form) : await addInfo(data.form);
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
  await delInfo(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};
const init = async () => {
  getTableData();
};

init();
</script>
