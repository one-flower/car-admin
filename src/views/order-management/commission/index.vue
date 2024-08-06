<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="订单类型" prop="type">
              <el-select v-model="tableInfo.queryParams.type" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="tableInfo.queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号" prop="orderNo">
              <el-input v-model="tableInfo.queryParams.orderNo" placeholder="请输入项目编号" clearable @keyup.enter="handleQuery"></el-input>
            </el-form-item>
            <el-form-item label="产品品牌" prop="productBrandId">
              <el-select
                v-model="tableInfo.queryParams.productBrandId"
                value-key=""
                placeholder="请选择产品品牌"
                clearable
                filterable
                @change="changeBrand"
              >
                <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称" prop="productId">
              <el-select
                v-model="tableInfo.queryParams.productId"
                :disabled="productLoading"
                value-key=""
                placeholder="请选择产品品牌"
                clearable
                filterable
              >
                <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.productName" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="directorId">
              <el-select v-model="tableInfo.queryParams.directorId" value-key="" placeholder="请选择产品名称" clearable filterable>
                <el-option v-for="item in dictObj.cunstomList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分配状态" prop="commState">
              <el-select v-model="tableInfo.queryParams.commState" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option label="已分配" value="Y" />
                <el-option label="未分配" value="N" />
                <!-- <el-option v-for="item in dictObj.dictEnum__commDistri" :key="item.value" :label="item.label" :value="item.value"> </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="payState">
              <el-select v-model="tableInfo.queryParams.payState" value-key="" placeholder="请选择支付状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__payState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
        <el-table-column label="订单类型" align="left" prop="typeLabel" />
        <el-table-column label="订单编号" align="left" prop="orderNo" show-overflow-tooltip />
        <el-table-column label="项目类型" align="left" prop="projectTypeLabel" />
        <el-table-column label="产品品牌" align="left" prop="productBrandLabel" />
        <el-table-column label="订单产品" align="left" prop="productIdLabel" />
        <el-table-column label="订单价格(/元)" align="left" prop="orderPrice" />
        <el-table-column label="订单提成(/元)" align="left" prop="commPrice" />
        <el-table-column label="负责人" align="center" prop="directorLabel" />
        <el-table-column label="支付状态" align="center" prop="payStateLabel" />
        <el-table-column label="分配状态" align="center" prop="commStateLabel" />
        <el-table-column label="操作" width="100" header-align="center" align="left" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button v-hasPermi="['clyh:comm:detail']" link @click="handlePay(row, false)">
                <svg-icon class-name="search-icon" icon-class="detail"></svg-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="row.commState !== 'Y'" content="立即分配" placement="top">
              <el-button v-hasPermi="['clyh:comm:pay']" link @click="handlePay(row, true)">
                <svg-icon icon-class="commission"></svg-icon>
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

    <!-- 立即分配 -->
    <el-dialog v-model="payInfo.visible" :title="payInfo.title" width="700px" append-to-body>
      <order-detail :readonly="true" :order-data="payInfo.orderData" :config-pya-data="payInfo.configPayData"></order-detail>
      <el-descriptions title="提成分配" :column="2" border class="mb10">
        <el-descriptions-item label="提成金额" :span="2"> {{ payInfo.commPrice }}</el-descriptions-item>
      </el-descriptions>
      <el-table v-loading="payInfo.tableLoading" :data="payInfo.tableData" tooltip-effect="dark myTooltips" style="width: 600px">
        <el-table-column label="角色" align="center" prop="isDirectorLabel" />
        <el-table-column label="员工岗位" align="center" prop="postIdLabel" />
        <el-table-column label="员工姓名" align="center" prop="staffIdLabel" />
        <el-table-column label="个人提成" align="center" prop="commPrice" />
        <el-table-column
          v-if="payInfo.commDistri !== 'AVERAGE'"
          label="提成比例(%)"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="{ row }">
            <el-input-number v-model="row.ratio" :disabled="!payInfo.isEdit" :min="0" :max="100" style="width: 100%" @change="preChange(row)">
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div v-if="payInfo.isEdit" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Brand" lang="ts">
import { orderAdd, orderDel, orderUp, orderInfo, orderList, orderUpState, orderPay, orderEditComm } from '@/api/order-management/order';
import { OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import { TableQuery, TableVO } from '@/api/order-management/order/types';
import { productDropdown } from '@/api/product-management/product';
import OrderDetail from '@/components/order-detail/index.vue';
import { staffDropdown } from '@/api/store-management/staff';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy?.useNewDict(
    'dictEnum__orderType', // 订单类型
    'configProject__configProject', // 项目类型
    'configProductBrand__configProductBrand', // 产品品牌
    'dictEnum__payState'
  )
);

const queryFormRef = ref<ElFormInstance>();
const tableInfo = reactive<TableInfo<TableQuery, TableVO[]>>({
  ids: [],
  multiple: true,
  loading: false,
  showSearch: true,
  queryParams: { pageNum: 1, pageSize: 20, commDistri: 'CUSTOM', isCommission: '1', orderState: 'ORDER_COMPLETED' },
  data: [],
  total: 0
});

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await orderList(tableInfo.queryParams);
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
};
const productLoading = ref(false);
const changeBrand = async (val: string) => {
  productLoading.value = true;
  tableInfo.queryParams.productId = null;
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

const payInfo = reactive({
  visible: false,
  title: '提成分配',
  loading: false,
  orderData: <OrderDesc>{},
  configPayData: <ConfigPayDesc>{},
  isEdit: false,
  orderId: undefined,
  commPrice: 0,
  tableData: [],
  tableLoading: false,
  commDistri: 'AVERAGE'
});

// 立即分配
const handlePay = async (row: TableVO, flag: boolean) => {
  const res = await orderInfo(row?.id);
  payInfo.orderData = {
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
  payInfo.configPayData = {
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
  payInfo.orderId = res.data.id;
  payInfo.commPrice = res.data.commPrice;

  if (row.commState !== 'Y') {
    payInfo.tableData = res.data.commExtObj.map((item) => {
      const ratio =
        item.isDirector === 'Y'
          ? 100 - Math.floor(100 / res.data.commExtObj.length) * (res.data.commExtObj.length - 1)
          : Math.floor(100 / res.data.commExtObj.length);

      return {
        ...item,
        commPrice: (ratio * 100 * res.data.commPrice) / 10000,
        ratio: item.ratio ?? ratio
      };
    });
  } else {
    payInfo.tableData = res.data.commExtObj;
  }

  payInfo.commDistri = row.commDistri;
  payInfo.isEdit = flag;
  payInfo.visible = true;
};

const preChange = (data: any) => {
  data.commPrice = (payInfo.commPrice * 100 * data.ratio) / 100 / 100;
};
const submit = async () => {
  let ratioSum = 0;
  payInfo.tableData.forEach((item) => {
    ratioSum += item.ratio;
  });
  if (ratioSum !== 100) {
    proxy?.$modal.msgWarning('提成比例总和必须为100%');
    return;
  }

  await orderEditComm({
    orderId: payInfo.orderId,
    commExts: payInfo.tableData
  });
  proxy?.$modal.msgSuccess('操作成功');
  getTableData();
  payInfo.visible = false;
};
const cancel = () => {
  payInfo.tableData = [];
  payInfo.visible = false;
};

const init = async () => {
  const cunstomList = await staffDropdown();
  dictObj.cunstomList = cunstomList.map((item) => {
    return {
      value: item.id,
      label: item.name
    };
  });
  getTableData();
};

init();
</script>
