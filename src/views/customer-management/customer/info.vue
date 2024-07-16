<template>
  <el-drawer :model-value="visible" title="客户档案" direction="rtl" size="80%" close-on-click-modal @close="handleCancel">
    <div class="mb10">
      <el-descriptions class="margin-top" title="客户信息" :column="2" border>
        <el-descriptions-item label="客户编号" min-width="100" column="2"> {{ targetInfo.customNo }} </el-descriptions-item>
        <el-descriptions-item label="客户标签" min-width="100"> {{ targetInfo.tagIdLabel }} </el-descriptions-item>
        <el-descriptions-item label="客户昵称" min-width="100"> {{ targetInfo.nickname }} </el-descriptions-item>
        <el-descriptions-item label="手机号码" min-width="100"> {{ targetInfo.telephone }} </el-descriptions-item>
        <el-descriptions-item label="客户来源" min-width="100"> {{ targetInfo.channel }} </el-descriptions-item>
        <el-descriptions-item label="账户余额" min-width="100"> {{ targetInfo.accountBalance }} </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- <el-descriptions class="margin-top" title="个人信息" :column="2" border>
      <el-descriptions-item label="数据来源" min-width="100" column="2"> {{}} </el-descriptions-item>
      <el-descriptions-item label="注册时间" min-width="100"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户姓名" min-width="100"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户性别" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="出生日期" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="常驻地址" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="公众号关注" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="最后更新时间" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="小程序注册" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="上次登录时间" min-width="100"> {{}} 元</el-descriptions-item>
    </el-descriptions> -->
    <div class="mb10">
      <el-descriptions class="margin-top" title="车辆信息" :column="2" border></el-descriptions>

      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="车辆品牌" align="center" prop="brandName" />
        <el-table-column label="车牌号码" align="center" prop="licensePlate" />
        <el-table-column label="车架号码" align="center" prop="vin" />
        <el-table-column label="车辆归属" align="center" prop="state" />
        <el-table-column label="车辆状态" align="center" prop="updateTime" />
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="装配情况" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link @click="handleDetail(row)">
                <svg-icon class-name="search-icon" icon-class="car-change" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="订单记录" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link @click="handleDelete(row)">
                <svg-icon class-name="search-icon" icon-class="order-log" />
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
    </div>
    <template #footer>
      <div class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="handleCancel">关闭</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { carManageList } from '@/api/customer-management/car';
import { warrantyAdd, warrantyDel, warrantyUp, warrantyInfo, warrantyList } from '@/api/maintain-management/warranty';
import { FormData, TableQuery, TableVO } from '@/api/maintain-management/warranty/types';

const emit = defineEmits(['update:visible', 'update:form']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  targetInfo: {
    type: Object as PropType<FormData>,
    default: () => {
      return {};
    },
    required: true
  }
});
const handleCancel = () => {
  emit('update:visible', false);
};
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
// const dictObj = toReactive<any>(proxy?.useDict('configProject__configProject', 'configProductBrand__configProductBrand', 'dictEnum__warrantyState'));

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

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await warrantyList(tableInfo.queryParams);
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

watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    formInfo.data.customId = props.targetInfo.id;
    init();
  }
);
</script>
<style scoped lang="scss">
.login-code {
  width: 33%;
  height: 35px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.login-code-img {
  height: 35px;
  padding-left: 12px;
}
</style>
