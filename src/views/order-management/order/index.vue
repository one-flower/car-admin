<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="tableInfo.showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="tableInfo.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="订单类型" prop="type">
              <el-select v-model="tableInfo.queryParams.type" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="tableInfo.queryParams.projectType" value-key="" placeholder="请选择项目类型" clearable filterable>
                <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单编号" prop="orderNo">
              <el-input v-model="tableInfo.queryParams.orderNo" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车架号码" prop="vin">
              <el-input v-model="tableInfo.queryParams.vin" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车牌号码" prop="licensePlate">
              <el-input v-model="tableInfo.queryParams.licensePlate" placeholder="请输入车牌号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="产品名称" prop="label">
              <el-select v-model="tableInfo.queryParams.label" value-key="" placeholder="请选择产品品牌" clearable filterable>
                <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单时间" prop="createTime">
              <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="订单状态" prop="commState">
              <el-select v-model="tableInfo.queryParams.commState" value-key="" placeholder="请选择订单状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__orderState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单提成" prop="isCommission">
              <el-select v-model="tableInfo.queryParams.isCommission" value-key="" placeholder="请选择订单提成" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__orderIsCommission" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="质保状态" prop="payState">
              <el-select v-model="tableInfo.queryParams.payState" value-key="" placeholder="请选择质保状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__warrantyState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="state">
              <el-select v-model="tableInfo.queryParams.payState" value-key="" placeholder="请选择支付状态" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum__orderPayType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableInfo.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col> -->
          <right-toolbar v-model:showSearch="tableInfo.showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="tableInfo.loading" :data="tableInfo.data" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="订单类型" align="left" prop="typeLabel" />
        <el-table-column label="订单编号" align="left" prop="orderNo" show-overflow-tooltip />
        <el-table-column label="车辆品牌" align="left" prop="carBrandLabel" />
        <el-table-column label="车架号码" align="left" prop="vin" show-overflow-tooltip />
        <el-table-column label="车牌号码" align="left" prop="licensePlate" show-overflow-tooltip />
        <el-table-column label="项目类型" align="left" prop="projectTypeLabel" />
        <el-table-column label="产品品牌" align="left" prop="productBrandLabel" />
        <el-table-column label="订单产品" align="left" prop="productIdLabel" />
        <el-table-column label="订单施工" align="left" prop="isFlowLabel" />
        <el-table-column label="订单状态" align="left" prop="stateLabel" />
        <el-table-column label="订单提成" align="left" prop="commPrice" />
        <el-table-column label="订单价格(/元)" align="left" prop="orderPrice" />
        <el-table-column label="实际支付(/元)" align="left" prop="realityPrice" />
        <el-table-column label="支付状态" align="left" prop="payStateLabel" />
        <el-table-column label="更新时间" align="left" prop="updateTime" show-overflow-tooltip width="120" />
        <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link type="info" icon="InfoFilled" @click="handleDetail(row)"></el-button>
            </el-tooltip>
            <template v-if="row.state !== 'CANCEL_ORDER'">
              <el-tooltip v-if="row.payState !== 'PAID'" content="支付" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handlePay(row)">
                  <svg-icon icon-class="payment"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
            <template v-if="row.state === 'WAIT_CONSTRUCTED'">
              <el-tooltip content="开始施工" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handleUpState(row.id, 'DURING_CONSTRUCTION')">
                  <svg-icon icon-class="during-construction"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
            <template v-else-if="row.state === 'DURING_CONSTRUCTION'">
              <el-tooltip content="完成施工" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handleUpState(row.id, 'CONSTRUCTED_COMPLETE')">
                  <svg-icon icon-class="constructed-complete"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
            <template v-else-if="row.state === 'CONSTRUCTED_COMPLETE'">
              <el-tooltip content="订单交付" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handleUpState(row.id, 'WAIT_DELIVERED')">
                  <svg-icon icon-class="wait-delivered"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
            <template v-else-if="row.state === 'WAIT_DELIVERED'">
              <el-tooltip content="订单完成" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handleUpState(row.id, 'ORDER_COMPLETED')">
                  <svg-icon icon-class="order-completed"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
            <template v-else-if="row.state === 'CANCEL_ORDER'">
              <el-tooltip content="删除订单" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link type="warning" icon="Delete" @click="handleDelete(row)"></el-button>
              </el-tooltip>
            </template>
            <template v-if="['WAIT_CONSTRUCTED', 'DURING_CONSTRUCTION'].includes(row.state) || (row.state === 'WAIT_DELIVERED' && row.isFlow === 0)">
              <el-tooltip content="取消订单" placement="top">
                <el-button v-hasPermi="['system:post:remove']" link @click="handleUpState(row.id, 'CANCEL_ORDER')">
                  <svg-icon icon-class="cancel-order"></svg-icon>
                </el-button>
              </el-tooltip>
            </template>
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

    <!-- 添加 -->
    <order-add v-model:visible="formInfo.visible" :title="formInfo.title" :basic-data="formInfo.data" @confirm="getTableData"></order-add>

    <!-- 详情 -->
    <el-dialog v-model="detailInfo.visible" :title="detailInfo.title" width="700px" append-to-body>
      <order-detail
        :readonly="true"
        :orderData="detailInfo.orderData"
        :configPyaData="detailInfo.configPayData"
        :order-log-list="detailInfo.orderLogObj"
      ></order-detail>
      <template v-if="!formInfo.disabled" #footer>
        <div class="dialog-footer">
          <el-button @click="detailCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 支付 -->
    <el-dialog v-model="payInfo.visible" :title="payInfo.title" width="700px" append-to-body>
      <order-detail :orderData="payInfo.orderData" :config-pay-show="false"></order-detail>
      <el-form ref="PayFormRef" :model="payInfo.data" :rules="payRules" label-width="80px" @submit.prevent>
        <el-form-item label="账户支付" prop="accMoney">
          <el-input-number v-model="payInfo.data.accMoney" :min="0" :max="99999.99" :precision="2"> </el-input-number>
        </el-form-item>
        <el-form-item label="现金支付" prop="cashMoney">
          <div class="formItemBox">
            <el-form-item prop="cashMoney">
              <el-input-number v-model="payInfo.data.cashMoney" :min="0" :max="99999.99" :precision="2"> </el-input-number>
            </el-form-item>
            <el-form-item v-if="payInfo.data.cashMoney !== 0" prop="payChannel">
              <el-select v-model="payInfo.data.payChannel" placeholder="请选择支付渠道" clearable filterable class="formItemBox__right">
                <el-option v-for="item in dictObj.dictEnum__payChannel" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="payInfo.data.remarks"
            placeholder="请输入"
            type="textarea"
            row="auto"
            maxlength="255"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="支付合计" prop="customId">
          <div
            :class="{ 'warn': countList([payInfo.data.accMoney, payInfo.data.cashMoney]) !== (payInfo.orderData?.orderPrice as unknown as string) }"
          >
            {{ countList([payInfo.data.accMoney, payInfo.data.cashMoney]) }} 元
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="payCancel">取 消</el-button>
          <el-button type="primary" @click="payConfirm">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Order" lang="ts">
import { orderAdd, orderDel, orderInfo, orderList, orderUpState, orderPay } from '@/api/order-management/order';
import { FormData, TableQuery, TableVO, OrderState, payForm } from '@/api/order-management/order/types';
import OrderAdd from '@/components/order-add/index.vue';
import { OrderForm, OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import { countList } from '@/utils/index';
import OrderDetail from '@/components/order-detail/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy?.useNewDict(
    'dictEnum__orderState',
    'dictEnum__orderType', // 订单类型
    'configProject__configProject', // 项目类型
    'configProductBrand__configProductBrand', // 产品品牌
    'configPost__configPost', // 负责人 作业团队
    'dictEnum__orderIsFlow', //是否施工
    'dictEnum__orderIsCommission', //订单提成
    'dictEnum__commDistri', //提成分配
    'dictEnum__orderPayType', // 支付类型
    'dictEnum__payChannel', // 支付渠道
    'dictEnum__warrantyState'
  )
);

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

const initFormData: FormData = {
  id: undefined,
  customNo: '',
  tagIdLabel: '',
  nickname: '',
  telephone: '',
  channel: '',
  accountBalance: ''
};
const formRef = ref<ElFormInstance>();
const formInfo = reactive<FormInfo<any>>({
  visible: false,
  title: '',
  disabled: true,
  data: {}
});

/** 查询品牌列表 */
const getTableData = async () => {
  tableInfo.loading = true;
  const res = await orderList(proxy?.addDateRange(tableInfo.queryParams, dateRange.value, 'startDate'));
  tableInfo.data = res.rows;
  tableInfo.total = res.total;
  tableInfo.loading = false;
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
  dateRange.value = ['', ''];
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
  formInfo.title = '新增订单';
  formInfo.data = {
    type: 'SERVER',
    typeLabel: '服务订单'
  };
};

// 更改订单状态
const handleUpState = async (id: string, state: OrderState) => {
  const res = dictObj.dictEnum__orderState.find((x: any) => x.value === state);
  await proxy?.$modal.confirm(`状态是否变更为${res.label}？`);
  await orderUpState({
    id: id,
    state: state
  });
  await getTableData();
  proxy?.$modal.msgSuccess('更改成功');
};

/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableInfo.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await orderDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

// 详情
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
    productBrandIdLabel: res.data.projectTypeLabel + '-' + res.data.productBrandLabel + '-' + res.data.productIdLabel, //品牌名称
    orderPrice: res.data.orderPrice, //订单价格
    carBrandLabel: res.data.carBrandLabel + '/' + res.data.vin + '/' + res.data.licensePlate, //订单车辆
    customId: res.data.customId,
    nickname: res.data.customIdObj.nickname, //客户昵称
    telephone: res.data.customIdObj.telephone, //预留电话
    tagIdLabel: res.data.customIdObj.tagIdLabel, //客户标签
    accountBalance: res.data.customIdObj.accountBalance //账户余额
  };
  detailInfo.configPayData = {
    directorIdLabel: res.data.directorLabel, //负责人
    workTeamLabel: res.data.constructionTeam, //作业团队
    isFlow: res.data.isFlow, //订单施工
    isFlowLabel: res.data.isFlowLabel, //订单施工
    isCommission: res.data.isCommission, // 订单提成
    isCommissionLabel: res.data.isCommissionLabel, //
    commDistriLabel: res.data.isCommission, // 提成分配
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

// 支付
const payInfo = reactive({
  visible: false,
  title: '支付',
  orderData: <OrderDesc>{},
  data: {
    orderId: undefined,
    accMoney: 0,
    cashMoney: 0,
    payChannel: '',
    remarks: ''
  }
});
const PayFormRef = ref<ElFormInstance>();
const payRules = {
  accMoney: [{ required: true, message: '账户支付不能为空', trigger: ['change', 'blur'] }],
  cashMoney: [{ required: true, message: '现金支付不能为空', trigger: ['change', 'blur'] }],
  payChannel: [{ required: true, message: '支付渠道不能为空', trigger: ['change', 'blur'] }]
};
const handlePay = async (row: TableVO) => {
  PayFormRef.value?.resetFields();
  const res = await orderInfo(row?.id);
  payInfo.orderData = {
    typeLabel: res.data.typeLabel,
    projectTypeLabel: res.data.projectTypeLabel, //项目类型
    productBrandIdLabel: res.data.projectTypeLabel + '-' + res.data.productBrandLabel + '-' + res.data.productIdLabel, //品牌名称
    orderPrice: res.data.orderPrice, //订单价格
    carBrandLabel: res.data.carBrandLabel + '/' + res.data.vin + '/' + res.data.licensePlate, //订单车辆
    customId: res.data.customId,
    nickname: res.data.customIdObj.nickname, //客户昵称
    telephone: res.data.customIdObj.telephone, //预留电话
    tagIdLabel: res.data.customIdObj.tagIdLabel, //客户标签
    accountBalance: res.data.customIdObj.accountBalance //账户余额
  };
  payInfo.data = {
    orderId: res.data.id,
    accMoney: res.data.accountPrice,
    cashMoney: res.data.cashPrice,
    payChannel: ''
  };
  payInfo.visible = true;
};
const payConfirm = async () => {
  PayFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (countList([payInfo.data.accMoney, payInfo.data.cashMoney]) !== (payInfo.orderData?.orderPrice as unknown as string))
        await proxy?.$modal.confirm('订单价格与支付金额不一致，是否继续下一步?');
      await orderPay(payInfo.data);
      proxy?.$modal.msgSuccess('操作成功');
      payInfo.visible = false;
      getTableData();
    }
  });
};
const payCancel = () => {
  payInfo.visible = false;
};

const init = async () => {
  getTableData();
};

init();
</script>
<style lang="scss" scoped>
.formItemBox {
  display: flex;
  &__right {
    flex: 1;
    min-width: 200px;
    margin-left: 10px;
  }
}
.warn {
  color: red;
}
</style>
