<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.native.prevent>
            <el-form-item label="上游机构" prop="upOrg">
              <el-select v-model="queryParams.upOrg" value-key="" placeholder="请选择上游机构" clearable filterable>
                <el-option v-for="item in mechanismList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入品牌名称" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="LOGO" align="center" prop="logoUrl">
          <template #default="{ row }">
            <ImagePreview :width="100" :height="100" :src="row.logoUrl" />
          </template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center" prop="name" />
        <el-table-column label="上游机构" align="center" prop="upOrg" />
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

    <!-- 添加或修改品牌对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="700px" append-to-body>
      <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="80px" :disabled="formDetails" @submit.native.prevent>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <!-- <el-form-item label="上游机构" prop="isOrg">
          <el-radio-group v-model="form.isOrg" class="ml-4">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- v-if="form.isOrg === 1" -->
        <el-form-item label="上游机构" prop="upOrg">
          <el-select v-model="form.upOrg" value-key="" placeholder="请选择上游机构" clearable filterable>
            <el-option v-for="item in mechanismList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <imageUpload v-model="form.logoUrl" :file-size="50" :limit="1" />
        </el-form-item>
        <el-form-item label="其他资质" prop="otherCredentialUrl">
          <imageUpload v-model="form.otherCredentialUrl" :file-size="50" :limit="3" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" row="auto" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template v-if="!formDetails" #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Brand" lang="ts">
import { tableList, addInfo, delInfo, getInfo, updateInfo, getMechanismList } from '@/api/sys/brand';
import { FormData, TableQuery, TableVO } from '@/api/sys/brand/types';
import ImagePreview from '@/components/ImagePreview/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableData = ref<TableVO[]>([]);
const tableAttr = reactive<TableAttr>({
  ids: [],
  multiple: true,
  total: 0
});
const loading = ref(true);
const showSearch = ref(true);

const formDetails = ref(false);
const FormDataRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const mechanismList = ref([]);

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  name: '',
  upOrg: '',
  isOrg: 0,
  logoUrl: '',
  otherCredentialUrl: '',
  remarks: ''
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    upOrg: '',
    name: ''
  },
  rules: {
    name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
    isOrg: [{ required: true, message: '上游机构不能为空', trigger: 'change' }],
    upOrg: [{ required: true, message: '上游机构不能为空', trigger: ['blur', 'change'] }]
  }
});

const { queryParams, form, rules } = toRefs<PageData<FormData, TableQuery>>(data);

/** 查询品牌列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await tableList(queryParams.value);
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
  formDetails.value = false;
  dialog.visible = true;
  dialog.title = '添加品牌';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const postId = row?.id || tableAttr.ids[0];
  const res = await getInfo(postId);
  Object.assign(form.value, res.data);
  formDetails.value = false;
  dialog.visible = true;
  dialog.title = '修改品牌';
};

/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.id ? await updateInfo(form.value) : await addInfo(form.value);
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

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableAttr.ids[0];
  const res = await getInfo(postId);
  Object.assign(form.value, res.data);
  formDetails.value = true;
  dialog.visible = true;
  dialog.title = '品牌详情';
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/post/export',
    {
      ...queryParams.value
    },
    `post_${new Date().getTime()}.xlsx`
  );
};

const init = async () => {
  const res = await getMechanismList();
  mechanismList.value = res.rows.map((item) => {
    return { label: item.name, value: item.id };
  });

  getTableData();
};

init();
</script>
