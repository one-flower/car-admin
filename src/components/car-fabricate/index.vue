<template>
  <el-drawer :model-value="visible" title="车辆装配" direction="rtl" size="800px" close-on-click-modal :before-close="handleCancel">
    <div class="p-2">
      <el-descriptions title="车辆信息" :column="3" border class="mb10">
        <el-descriptions-item label="车辆归属"> {{ basicData.toTypeLabel }} </el-descriptions-item>
        <el-descriptions-item label="车牌号码"> {{ basicData.licensePlate }} </el-descriptions-item>
        <el-descriptions-item label="车辆品牌"> {{ basicData.brandIdLabel }} </el-descriptions-item>
        <!-- <el-descriptions-item label="车辆厂商"> {{ basicData.manufacturer }} </el-descriptions-item>
        <el-descriptions-item label="车辆系列"> {{ basicData.typename }} </el-descriptions-item>
        <el-descriptions-item label="车辆型号"> {{ basicData.module }} </el-descriptions-item>
        <el-descriptions-item label="车辆级别"> {{ basicData.sizetype }} </el-descriptions-item>
        <el-descriptions-item label="车身结构"> {{ basicData.bodytype }} </el-descriptions-item>
        <el-descriptions-item label="驱动方式"> {{ basicData.drivemode }} </el-descriptions-item>
        <el-descriptions-item label="能源类型"> {{ basicData.fueltype }} </el-descriptions-item> -->
        <el-descriptions-item label="备注" :span="3"> {{ basicData.remarks }} </el-descriptions-item>
        <el-descriptions-item label="车辆照片" :span="3">
          <image-preview
            v-if="basicData.imgUrls"
            :width="100"
            :height="100"
            :src="basicData.imgUrls"
            :preview-src-list="[basicData.imgUrls]"
          ></image-preview>
        </el-descriptions-item>
      </el-descriptions>

      <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
        <div v-show="tableInfo.showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
              <el-form-item label="项目类型" prop="type">
                <el-select v-model="tableInfo.queryParams.projectType" placeholder="请选择项目类型" clearable filterable>
                  <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品品牌" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productBrandId" placeholder="请选择产品品牌" clearable filterable @change="changeBrand">
                  <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品名称" prop="rechargeId">
                <el-select v-model="tableInfo.queryParams.productId" :disabled="productLoading" placeholder="请选择产品名称" clearable filterable>
                  <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.productName" :value="item.value"> </el-option>
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
          <el-table-column label="项目类型" align="center" prop="projectTypeLabel" />
          <el-table-column label="产品品牌" align="center" prop="productBrandIdLabel" />
          <el-table-column label="产品名称" align="center" prop="productIdLabel" />
          <el-table-column label="装配时间" align="center" prop="createTime" />
<!--          <el-table-column label="订单编号" align="center" prop="orderNum" width="210">
            <template #default="{ row }">
              <el-button text type="primary" @click="handleDetail(row)"> {{ row.id }}</el-button>
            </template>
          </el-table-column>-->
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

  <!-- 详情 -->
  <el-dialog v-model="detailInfo.visible" :title="detailInfo.title" width="600px" append-to-body>
    <OrderDetail
      :readonly="true"
      :order-data="detailInfo.orderData"
      :config-pya-data="detailInfo.configPayData"
      :order-log-list="detailInfo.orderLogList"
    ></OrderDetail>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes';
import { fabricateList } from '@/api/customer-management/car';
import { TableQuery, TableVO } from '@/api/customer-management/car/types';
import { orderInfo } from '@/api/order-management/order';
import { productDropdown } from '@/api/product-management/product';
import { ConfigPayDesc, OrderDesc } from '@/api/order-management/order/types';
import OrderDetail from '@/components/order-detail/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy.useNewDict('configProject__configProject', 'configProductBrand__configProductBrand'));
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  basicData: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

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
  const res = await fabricateList({
    ...tableInfo.queryParams,
    carManageId: props.basicData.id
  });
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
  queryFormRef.value?.resetFields();
  tableInfo.queryParams.pageNum = 1;
  handleQuery();
};

// 详情
const detailInfo = reactive({
  visible: false,
  title: '详情',
  orderData: <OrderDesc>{},
  configPayData: <ConfigPayDesc>{},
  orderLogList: []
});
const handleDetail = async (row?: TableVO) => {
  const res = await orderInfo(row?.orderId);
  detailInfo.orderData = {
    typeLabel: res.data.typeLabel,
    projectTypeLabel: res.data.projectTypeLabel, //项目类型
    productBrandIdLabel: res.data.productBrandLabel + '-' + res.data.productIdLabel, //品牌名称
    orderPrice: res.data.orderPrice, //订单价格
    carBrandLabel: res.data.carBrandLabel + '/' + res.data.licensePlate, //订单车辆
    nickname: props.basicData.customIdObj?.nickname, //客户昵称
    telephone: props.basicData.customIdObj?.telephone, //预留电话
    tagIdLabel: props.basicData.customIdObj?.tagIdLabel, //客户标签
    totalMoney: props.basicData.customIdObj?.totalMoney //账户余额
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
  detailInfo.orderLogList = res.data.orderLogList;
  detailInfo.visible = true;
};
const cancel = () => {
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
