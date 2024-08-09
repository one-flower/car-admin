<template>
  <el-drawer :model-value="visible" title="车辆订单" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="p-2">
      <div class="mb10">
        <el-descriptions title="车辆信息" :column="2" border>
          <el-descriptions-item label="车辆品牌"> {{ targetInfo.brandIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="车牌号码"> {{ targetInfo.licensePlate }} </el-descriptions-item>
          <!-- <el-descriptions-item label="车架号码"> {{ targetInfo.vin }} </el-descriptions-item> -->
          <!-- <el-descriptions-item label="车辆归属"> {{ targetInfo.toTypeLabel }} </el-descriptions-item> -->
          <el-descriptions-item label="车主昵称"> {{ targetInfo.customIdObj?.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话"> {{ targetInfo.customIdObj?.telephone }} </el-descriptions-item>
        </el-descriptions>
      </div>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="tableInfo.showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="订单类型" prop="type">
                <el-select v-model="tableInfo.queryParams.type" placeholder="请选择订单类型" clearable filterable>
                  <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="tableInfo.queryParams.projectType" placeholder="请选择项目类型" clearable filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单编号" prop="orderNo">
                <el-input v-model="tableInfo.queryParams.orderNo" placeholder="请输入订单编号" clearable @keyup.enter="handleQuery"></el-input>
              </el-form-item>
              <el-form-item label="产品品牌" prop="productBrandId">
                <el-select v-model="tableInfo.queryParams.productBrandId" placeholder="请选择产品品牌" clearable filterable @change="changeBrand">
                  <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="productId">
                <el-select v-model="tableInfo.queryParams.productId" :disabled="productLoading" placeholder="请选择产品名称" clearable filterable>
                  <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.productName" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="支付状态" prop="payState">
                <el-select v-model="tableInfo.queryParams.payState" placeholder="请选择支付状态" clearable filterable>
                  <el-option v-for="item in dictObj.dictEnum__payState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="订单时间" prop="daterange">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="订单状态" prop="commState">
                <el-select v-model="tableInfo.queryParams.commState" placeholder="请选择订单状态" clearable filterable>
                  <el-option v-for="item in dictObj.dictEnum__orderState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          <el-table-column label="订单类型" align="center" prop="typeLabel" />
          <el-table-column label="服务编号" align="center" prop="orderNo" show-overflow-tooltip />
          <el-table-column label="项目类型" align="center" prop="projectTypeLabel" />
          <el-table-column label="产品品牌" align="center" prop="productBrandLabel" />
          <el-table-column label="订单产品" align="center" prop="productIdLabel" />
          <el-table-column label="订单状态" align="center" prop="stateLabel" />
          <el-table-column label="订单更新时间" align="center" prop="updateTime" show-overflow-tooltip width="120" />
          <el-table-column label="订单价格" align="center" prop="orderPrice" />
          <el-table-column label="实际支付" align="center" prop="realityPrice" />
          <el-table-column label="支付状态" align="center" prop="payStateLabel" />
          <el-table-column label="操作" width="100" align="center" class-name="small-padding fixed-width">
            <template #default="{ row }">
              <el-tooltip content="详情" placement="top">
                <el-button v-hasPermi="['system:post:detail']" link @click="handleDetail(row)">
                  <svg-icon class-name="search-icon" icon-class="detail"></svg-icon>
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
      </el-card>
    </div>
  </el-drawer>

  <!-- 添加对话框 -->
  <el-dialog v-model="detailInfo.visible" :title="detailInfo.title" width="600px" append-to-body>
    <OrderDetail
      :readonly="true"
      :order-data="detailInfo.orderData"
      :config-pya-data="detailInfo.configPayData"
      :order-log-obj="detailInfo.orderLogObj"
    ></OrderDetail>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="detailCancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="commExt" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { TableQuery, TableVO, OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import { orderList, orderInfo } from '@/api/order-management/order';
import OrderDetail from '@/components/order-detail/index.vue';
import { productDropdown } from '@/api/product-management/product';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy.useNewDict(
    'dictEnum__orderType',
    'configProject__configProject',
    'configProductBrand__configProductBrand',
    'dictEnum__payState',
    'dictEnum__orderState'
  )
);
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
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
  queryParams: { pageNum: 1, pageSize: 20 },
  data: [],
  total: 0
});

/** 查询列表 */
const getTableData = async () => {
  tableInfo.loading = true;

  const res = await orderList(
    proxy?.addDateRange(
      {
        ...tableInfo.queryParams,
        carManageId: props.targetInfo.id
      },
      dateRange.value
    )
  );
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};

const productLoading = ref(false);
const changeBrand = async (val: string) => {
  tableInfo.queryParams.productId = '';
  productLoading.value = true;
  dictObj.productList = await productDropdown({
    productBrandId: val
  });
  productLoading.value = false;
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

const detailInfo = reactive({
  visible: false,
  title: '详情',
  orderData: <OrderDesc>{},
  configPayData: <ConfigPayDesc>{},
  orderLogObj: []
});
const handleDetail = async (row?: TableVO) => {
  const res = await orderInfo(row?.id);
  detailInfo.orderData = {
    typeLabel: res.data.typeLabel,
    projectTypeLabel: res.data.projectTypeLabel, //项目类型
    productBrandIdLabel: res.data.productBrandLabel + '-' + res.data.productIdLabel, //品牌名称
    orderPrice: res.data.orderPrice, //订单价格
    carBrandLabel: res.data.carBrandLabel + '/' + res.data.licensePlate, //订单车辆
    nickname: res.data.customIdObj?.nickname, //客户昵称
    telephone: res.data.customIdObj?.telephone, //预留电话
    tagIdLabel: res.data.customIdObj?.tagIdLabel, //客户标签
    totalMoney: res.data.customIdObj?.totalMoney //账户余额
  };
  detailInfo.configPayData = {
    directorIdLabel: res.data.directorLabel, //负责人
    workTeamLabel: res.data.constructionTeamLabel, //作业团队
    isFlow: res.data.isFlow, //订单施工
    isFlowLabel: res.data.isFlowLabel, //订单施工
    isCommission: res.data.isCommission, // 订单提成
    isCommissionLabel: res.data.isCommissionLabel, //
    commDistriLabel: res.data.commDistriLabel, // 提成分配
    commPrice: res.data.commPrice, // 提成价格
    orderPayType: res.data.payState, // 订单出伏
    orderPayTypeLabel: res.data.payStateLabel, //
    accountPrice: res.data.accountPrice, // 账号支付
    cashPrice: res.data.cashPrice, // 现金支付
    realityPrice: res.data.realityPrice, // 最终支付
    remarks: res.data.remarks
  };
  detailInfo.orderLogObj = res.data.orderLogObj;
  detailInfo.visible = true;
};
const detailCancel = () => {
  detailInfo.visible = false;
};

const handleCancel = () => {
  emit('update:visible', false);
};

const init = async () => {
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
