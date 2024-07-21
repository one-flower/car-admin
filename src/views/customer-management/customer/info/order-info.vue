<template>
  <el-dialog :model-value="visible" :title="title" width="700px" append-to-body :before-close="cancel">
    <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
      <el-table-column label="项目类型" align="center" prop="projectTypeLabel" />
      <el-table-column label="产品品牌" align="center" prop="productBrandIdLabel" />
      <el-table-column label="产品名称" align="center" prop="productIdLabel" />
      <el-table-column label="保养时间" align="center" prop="frequencyDate" />
      <el-table-column label="质保时间" align="center" prop="warrantyDate" />
    </el-table>
    <pagination
      v-show="tableInfo.total > 0"
      v-model:page="tableInfo.queryParams.pageNum"
      v-model:limit="tableInfo.queryParams.pageSize"
      :total="tableInfo.total"
      @pagination="getTableData"
    />
    <template #footer>
      <el-button @click="cancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { fabricateList } from '@/api/customer-management/car';
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  basicData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const tableInfo = reactive({
  loading: false,
  queryParams: { pageNum: 1, pageSize: 10 },
  data: [],
  total: 0
});
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await fabricateList({
    ...tableInfo.queryParams,
    customId: props.basicData.customId
  });
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};
const cancel = () => {
  emit('update:visible', false);
};

const init = () => {
  getTableData();
};
watch(
  () => props.visible,
  () => {
    init();
  }
);
</script>
<style scoped lang="scss"></style>
