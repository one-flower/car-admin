<template>
  <el-drawer :model-value="visible" title="订单记录" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="p-2">
      <div class="mb10">
        <el-descriptions title="车辆信息" :column="3" border>
          <el-descriptions-item label="车辆品牌" min-width="100"> {{ targetInfo.brandIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="车牌号码" min-width="100"> {{ targetInfo.licensePlate }} </el-descriptions-item>
          <el-descriptions-item label="车架号码" min-width="100"> {{ targetInfo.vin }} </el-descriptions-item>
          <el-descriptions-item label="车辆归属" min-width="100"> {{ targetInfo.toTypeLabel }} </el-descriptions-item>
          <el-descriptions-item label="车主昵称" min-width="100"> {{ targetInfo.customIdObj.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话" min-width="100"> {{ targetInfo.customIdObj.telephone }} </el-descriptions-item>
        </el-descriptions>
      </div>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="tableInfo.showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="订单类型" prop="type">
                <el-select v-model="tableInfo.queryParams.projectType" placeholder="请选择订单类型" clearable filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目类型" prop="type">
                <el-select v-model="tableInfo.queryParams.projectType" placeholder="请选择项目类型" clearable filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单编号" prop="type">
                <el-input
                  v-model="tableInfo.queryParams.productBrandId"
                  placeholder="请输入订单编号"
                  clearable
                  @change=""
                  @keyup.enter="handleQuery"
                ></el-input>
              </el-form-item>
              <el-form-item label="产品品牌" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productBrandId" placeholder="请选择产品品牌" clearable filterable>
                  <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productId" placeholder="请选择产品名称" clearable filterable>
                  <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付状态" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productId" placeholder="请选择支付状态" clearable filterable>
                  <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单时间" prop="rechargeId">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="订单状态" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productId" placeholder="请选择订单状态" clearable filterable>
                  <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
            <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
          </el-row>
        </template>
        <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips">
          <el-table-column label="订单类型" align="center" prop="customName" />
          <el-table-column label="服务编号" align="center" prop="customTelephone" />
          <el-table-column label="项目类型" align="center" prop="rechargeName" />
          <el-table-column label="产品品牌" align="center" prop="realityMoney" />
          <el-table-column label="订单产品" align="center" prop="giveMoney" />
          <el-table-column label="订单状态" align="center" prop="" />
          <el-table-column label="订单更新时间" align="center" prop="" />
          <el-table-column label="订单价格(/元)" align="center" prop="" />
          <el-table-column label="实际支付(/元)" align="center" prop="" />
          <el-table-column label="支付状态" align="center" prop="" />
          <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
            <template #default="{ row }">
              <el-tooltip content="详情" placement="top">
                <el-button v-hasPermi="['system:post:detail']" link type="info" icon="InfoFilled" @click="handleDetail(row)"></el-button>
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
    </div>
  </el-drawer>

  <!-- 添加对话框 -->
  <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" append-to-body>
    <el-descriptions title="订单详情" :column="2" border>
      <el-descriptions-item label="车辆品牌"> {{ orderData.brand }} </el-descriptions-item>
      <el-descriptions-item label="车辆厂商"> {{ orderData.manufacturer }} </el-descriptions-item>
      <el-descriptions-item label="车辆系列"> {{ orderData.typename }} </el-descriptions-item>
      <el-descriptions-item label="车辆型号"> {{ orderData.vehicleModel }} </el-descriptions-item>
      <el-descriptions-item label="车辆级别"> {{ orderData.sizetype }} </el-descriptions-item>
      <el-descriptions-item label="车身结构"> {{ orderData.bodytype }} </el-descriptions-item>
      <el-descriptions-item label="驱动方式"> {{ orderData.drivemode }} </el-descriptions-item>
      <el-descriptions-item label="能源类型"> {{ orderData.fueltype }} </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="commExt" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { TableQuery, TableVO } from '@/api/store-management/recharge/types';
import UserRecharge from './user-recharge.vue';
import { rechargeLogList } from '@/api/store-management/recharge';
import { FormData } from '@/api/customer-management/customer/types';
import { customInfo } from '@/api/customer-management/customer';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy.useNewDict('configProject__configProject', 'configProductBrand__configProductBrand'));
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  // targetId: propTypes.string.def('').isRequired,
  targetInfo: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
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

/** 查询列表 */
const getTableData = async () => {
  tableInfo.loading = true;

  const res = await rechargeLogList(tableInfo.queryParams);
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};

/** 搜索按钮操作 */
const handleQuery = () => {
  tableInfo.queryParams.pageNum = 1;
  getTableData();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  tableInfo.queryParams.pageNum = 1;
  handleQuery();
};

const dialog = reactive({
  visible: false,
  title: '详情'
});
const orderData = reactive({});
const handleDetail = (row?: TableVO) => {
  Object.assign(orderData, {});
  dialog.visible = true;
};
const handleCancel = () => {
  emit('update:visible', false);
};

const init = async () => {
  tableInfo.queryParams.customId = props.targetId;

  getTableData();
};

watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    init();
  }
);
</script>
