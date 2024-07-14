<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" @submit.prevent>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.project" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌名称" prop="productBrandId">
              <el-select v-model="queryParams.productBrandId" value-key="" placeholder="请选择品牌名称" clearable filterable>
                <el-option v-for="item in dictObj.brand" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入产品名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品代码" prop="model">
              <el-input v-model="queryParams.model" placeholder="请输入产品代码" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="项目类型" align="center" prop="projectTypeLabel" />
        <el-table-column label="产品品牌" align="center" prop="productBrandIdLabel" />
        <el-table-column label="产品名称" align="center" prop="name" />
        <el-table-column label="产品型号" align="center" prop="model" />
        <el-table-column label="产品定价(/元)" align="center" prop="price" />
        <el-table-column label="质保周期(/月)" align="center" prop="warranty" />
        <el-table-column label="保养频率(月/次)" align="center" prop="frequency" />
        <el-table-column label="跨店保养" align="center" prop="isCrossStoreLabel" />
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="修改" placement="top">
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

    <!-- 添加或修改品牌对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" append-to-body>
      <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="form.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
            <el-option v-for="item in dictObj.project" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品品牌" prop="productBrandId">
          <el-select v-model="form.productBrandId" value-key="" placeholder="请选择产品品牌" clearable filterable>
            <el-option v-for="item in dictObj.brand" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入产品型号" />
        </el-form-item>
        <el-form-item label="产品定价" prop="price">
          <el-input-number v-model="form.price" :min="0" :max="99999.99" :step="1" :controls="true" placeholder="请输入产品定价" />
        </el-form-item>
        <el-form-item label="质保服务" prop="isWarranty">
          <el-radio-group v-model="form.isWarranty">
            <el-radio v-for="item in dictObj.states" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>

        <template v-if="form.isWarranty === '1'">
          <el-form-item label="质保周期" prop="warranty">
            <el-input v-model.number="form.warranty" placeholder="请输入质保周期">
              <template #append>月</template>
            </el-input>
          </el-form-item>
          <el-form-item label="保养服务" prop="isFrequency">
            <el-radio-group v-model="form.isFrequency">
              <el-radio v-for="item in dictObj.states" :key="item.value" :label="item.label" :value="item.value" />
            </el-radio-group>
          </el-form-item>

          <template v-if="form.isFrequency === '1'">
            <el-form-item label="保养频率" prop="frequency">
              <el-input v-model.number="form.frequency" placeholder="请输入保养频率">
                <template #append>月/次</template>
              </el-input>
            </el-form-item>
            <el-form-item label="跨店保养" prop="isCrossStore">
              <el-radio-group v-model="form.isCrossStore">
                <el-radio v-for="item in dictObj.states" :key="item.value" :label="item.lanel2" :value="item.value" />
              </el-radio-group>
            </el-form-item>
          </template>
        </template>

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
  </div>
</template>
<!-- 定价 / 备注/跨店/型号 可编辑 -->
<script setup name="product" lang="ts">
import { productList, productAdd, productDel, productInfo, productUp } from '@/api/product-management/product';
import { FormData, TableQuery, TableVO } from '@/api/product-management/product/types';
import { configProjectList } from '@/api/sys/management';
import { configProductBrandList } from '@/api/sys/brand';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tableData = ref<TableVO[]>([]);
const tableAttr = reactive<TableAttr>({
  ids: [],
  multiple: true,
  total: 0
});
const loading = ref(true);
const showSearch = ref(true);

const pageTitle = '产品';
const FormDataRef = ref<ElFormInstance>();
const queryFormRef = ref<ElFormInstance>();
const dictObj = reactive({
  project: [],
  brand: [],
  states: [
    { label: '开启', value: '1', lanel2: '支持' },
    { label: '关闭', value: '0', lanel2: '不支持' }
  ]
});

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  projectType: '', //项目类型
  productBrandId: '', //产品品牌
  name: '', //产品名称
  model: '', //产品型号
  price: 0, //产品定价
  isWarranty: '0', //质保服务
  warranty: 0, //质保周期
  isFrequency: '0', //保养服务
  frequency: 0, //保养频率
  isCrossStore: '0', //跨店保养
  remarks: ''
};

const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectType: undefined,
    productBrandId: undefined,
    name: undefined,
    model: undefined
  },
  rules: {
    projectType: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
    productBrandId: [{ required: true, message: '产品品牌不能为空', trigger: 'change' }],
    name: [{ required: true, message: '产品名称不能为空', trigger: ['blur', 'change'] }],
    price: [{ required: true, message: '产品定价不能为空', trigger: 'change' }],
    isWarranty: [{ required: true, message: '质保服务不能为空', trigger: 'change' }],
    warranty: [
      { required: true, message: '质保周期不能为空', trigger: 'change' },
      { type: 'number', min: 0, max: 600, message: '请填写0~600区间的数值', trigger: 'change' }
    ],
    isFrequency: [{ required: true, message: '保养服务不能为空', trigger: 'change' }],
    frequency: [
      { required: true, message: '保养频率不能为空', trigger: 'change' },
      { type: 'number', min: 0, max: 12, message: '请填写0~12区间的数值', trigger: 'change' }
    ],
    isCrossStore: [{ required: true, message: '跨店保养不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs<PageData<FormData, TableQuery>>(data);

/** 查询品牌列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await productList(queryParams.value);
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
  const res = await productInfo(postId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = `添加${pageTitle}`;
};

/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.id ? await productUp(form.value) : await productAdd(form.value);
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
  await productDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

const handleDetail = async (row?: TableVO) => {
  const postId = row?.id || tableAttr.ids[0];
  const res = await productInfo(postId);
  Object.assign(form.value, res.data);
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
  const projectRes = await configProjectList({ pageNum: 1, pageSize: 99999 });
  const brandRes = await configProductBrandList({ pageNum: 1, pageSize: 99999 });
  dictObj.project = projectRes.rows.map((item) => {
    return { label: item.name, value: item.id };
  });
  dictObj.brand = brandRes.rows.map((item) => {
    return { label: item.name, value: item.id };
  });

  getTableData();
};

init();
</script>
