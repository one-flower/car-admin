<template>
  <div class="p-2">
    <el-dialog
      :model-value="visible"
      title="新建订单"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleCancel"
    >
      <el-steps :active="active" direction="horizontal" process-status="process" finish-status="success" class="mb10">
        <el-step title="创建订单" />
        <el-step title="订单配置" />
        <el-step title="订单支付" />
        <el-step title="完成" />
      </el-steps>
      <el-form ref="FormDataRef" v-loading="loading" :model="formInfo.data" :rules="rules" label-width="80px" @submit.prevent>
        <template v-if="active === 0">
          <el-form-item label="订单类型" prop="type">
            {{ dictToLabel(dictObj.dictEnum__orderType, formInfo.data.type).label ?? '-' }}
            <!-- <el-select v-model="formInfo.data.type" placeholder="订单类型" disabled>
              <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" disabled :label="item.label" :value="item.value"> </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="项目类型" prop="projectTypeLabel">
            {{ formInfo.data.projectTypeLabel !== '' ? formInfo.data.projectTypeLabel : '-' }}
            <!-- <el-input v-model="formInfo.data.projectTypeLabel" placeholder="项目类型" disabled></el-input> -->
          </el-form-item>
          <el-form-item label="选择车辆" prop="carManageId">
            <el-select v-model="formInfo.data.carManageId" placeholder="请选择车辆" clearable filterable :disabled="formInfo.data.type !== 'SERVER'">
              <el-option v-for="item in dictObj.carList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品品牌" prop="productBrandId">
            <el-select
              v-model="formInfo.data.productBrandId"
              placeholder="请选择产品品牌"
              clearable
              filterable
              :disabled="formInfo.data.type !== 'SERVER'"
              @change="changeBrand"
            >
              <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择产品" prop="productId">
            <el-select
              v-model="formInfo.data.productId"
              placeholder="请选择产品"
              clearable
              filterable
              :disabled="!formInfo.data.productBrandId || productLoading || formInfo.data.type !== 'SERVER'"
              @change="productChange"
            >
              <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.productName" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单价格" prop="orderPrice">
            <el-input-number
              v-model="formInfo.data.orderPrice"
              :disabled="!formInfo.data.productId"
              placeholder="订单价格"
              :min="0"
              :max="99999.99"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="formInfo.data.remarks"
              placeholder="请输入"
              type="textarea"
              row="auto"
              maxlength="255"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </template>
        <template v-else-if="active === 1">
          <el-descriptions title="" :column="2" border class="mb10">
            <el-descriptions-item label="订单类型"> {{ formInfo.data.typeLabel }} </el-descriptions-item>
            <el-descriptions-item label="项目类型"> {{ formInfo.data.projectTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="品牌名称"> {{ formInfo.data.productLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单价格"> {{ towPriLabel(formInfo.data.orderPrice) }} </el-descriptions-item>
          </el-descriptions>
          <el-form-item label="负责人" prop="directorId">
            <el-select v-model="formInfo.data.directorId" placeholder="负责人" clearable filterable>
              <el-option v-for="item in postPersonList" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业团队" prop="workTeam">
            <el-select v-model="formInfo.data.workTeam" placeholder="请选择作业团队" clearable filterable multiple :multiple-limit="4">
              <el-option v-for="item in postTeamList" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单施工" prop="isFlow">
            <el-radio-group v-model="formInfo.data.isFlow" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsFlow" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单提成" prop="isCommission">
            <el-radio-group v-model="formInfo.data.isCommission" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsCommission" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <template v-if="formInfo.data.isCommission === '1'">
            <el-form-item label="提成金额" prop="commPrice">
              <el-input-number v-model="formInfo.data.commPrice" placeholder="" :min="0" :max="99999.99" :precision="2"> </el-input-number>
            </el-form-item>
            <el-form-item label="提成分配" prop="commDistri">
              <el-radio-group v-model="formInfo.data.commDistri" class="ml-4" :disabled="postNum < 2">
                <el-radio v-for="item in dictObj.dictEnum__commDistri" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
          </template>
        </template>
        <template v-else-if="active === 2">
          <order-detail :order-data="orderDetail" :config-pay-show="false" @change-money="getCarDict"></order-detail>
          <template v-if="true">
            <el-form-item label="订单支付" prop="orderPayType">
              <el-radio-group v-model="formInfo.data.orderPayType" class="ml-4">
                <el-radio v-for="item in dictObj.dictEnum__orderPayType" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
            <template v-if="formInfo.data.orderPayType === 'PROMPTLY_PAY'">
              <el-form-item label="账户支付" prop="accountPrice">
                <div class="formItemBox">
                  <el-input-number v-model="formInfo.data.accountPrice" placeholder="" :min="0" :max="99999.99" :precision="2"> </el-input-number>
                  <div class="formItemBox__right">
                    <el-button type="primary" @click="setPay">快速分配</el-button>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="现金支付" prop="cashPrice">
                <div class="formItemBox">
                  <el-form-item prop="cashPrice">
                    <el-input-number v-model="formInfo.data.cashPrice" :min="0" :max="99999.99" :precision="2"> </el-input-number>
                  </el-form-item>
                  <el-form-item v-if="formInfo.data.cashPrice !== 0" prop="payChannel">
                    <el-select v-model="formInfo.data.payChannel" placeholder="请选择支付方式" clearable filterable class="formItemBox__right">
                      <el-option v-for="item in dictObj.dictEnum__payChannel" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="支付合计" prop="customId">
                <div :class="{ 'warn': !isEqual }">{{ countList([formInfo.data.accountPrice, formInfo.data.cashPrice]) }} 元</div>
              </el-form-item>
            </template>
          </template>
        </template>
        <template v-else-if="active === 3">
          <order-detail :order-data="orderDetail" :readonly="true" :config-pay-show="true" :config-pya-data="configPayDetail"></order-detail>
        </template>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button v-if="active !== 0" type="primary" @click="handleNext(-1)">上一步</el-button>
          <el-button v-if="active !== 3" type="primary" @click="handleNext(1)">下一步</el-button>
          <el-button v-else type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="CreateOrder" lang="ts">
import { staffDropdown } from '@/api/store-management/staff';
import { productDropdown } from '@/api/product-management/product';
import { carManageDropdown } from '@/api/customer-management/car';
import { orderAdd } from '@/api/order-management/order';
import { OrderForm, OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import OrderDetail from '@/components/order-detail/index.vue';
import propTypes from '@/utils/propTypes';
import { countList, towPriLabel } from '@/utils/index';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy?.useNewDict(
    'dictEnum__orderType', // 订单类型
    // 'configProject__configProject', // 项目类型
    'configProductBrand__configProductBrand', // 产品品牌
    'dictEnum__orderIsFlow', //是否施工
    'dictEnum__orderIsCommission', //订单提成
    'dictEnum__commDistri', //提成分配
    'dictEnum__orderPayType', // 支付类型
    'dictEnum__payChannel' // 支付渠道
  )
);
const emit = defineEmits(['update:visible', 'confirm', 'cancel']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired,
  title: propTypes.string.def(''),
  basicData: {
    type: Object,
    default: () => {
      return {};
    },
    required: true
  }
});
const loading = ref(false);
const initFormData: OrderForm = {
  id: undefined,
  type: 'SERVER',
  projectType: '',
  carManageId: undefined,
  productBrandId: '',
  productId: '',
  orderPrice: 0,
  remarks: '',
  directorId: undefined,
  workTeam: [],
  isFlow: '0',
  isCommission: '0',
  commDistri: 'AVERAGE',
  orderPayType: 'LATER_ON_PAY',
  accountPrice: 0,
  cashPrice: 0,
  payChannel: 'CASH',
  commPrice: 0,
  typeLabel: '',
  projectTypeLabel: '',
  productLabel: '',
  productBrandIdLabel: ''
};
const active = ref(0);
const FormDataRef = ref<ElFormInstance>();
const formInfo = reactive<FormInfo<any>>({
  title: '',
  visible: false,
  data: { ...initFormData }
});

const rules = {
  // projectTypeLabel: [{ required: true, message: '', trigger: 'change' }],
  carManageId: [{ required: true, message: '车辆不能为空', trigger: 'change' }],
  productBrandId: [{ required: true, message: '产品品牌不能为空', trigger: 'change' }],
  productId: [{ required: true, message: '产品不能为空', trigger: 'change' }],
  orderPrice: [{ required: true, message: '订单价格不能为空', trigger: ['blur', 'change'] }],
  directorId: [{ required: true, message: '负责人不能为空', trigger: 'change' }],
  isFlow: [{ required: true, message: '订单施工不能为空', trigger: 'change' }],
  isCommission: [{ required: true, message: '订单提成不能为空', trigger: 'change' }],
  commPrice: [
    { required: true, message: '提成金额不能为空', trigger: 'blur' },
    { type: 'number', message: '提成金额最小为1', min: 1 }
  ],
  commDistri: [{ required: true, message: '提成分配不能为空', trigger: 'change' }],
  payChannel: [{ required: true, message: '支付方式不能为空', trigger: 'change' }]
};

//获取客户信息
const productLoading = ref(false);
const changeBrand = async (val: string) => {
  formInfo.data.projectType = undefined;
  formInfo.data.projectTypeLabel = '';
  formInfo.data.productId = undefined;
  formInfo.data.orderPrice = '0.00';
  productLoading.value = true;
  dictObj.productList = await productDropdown({
    productBrandId: val
  });
  productLoading.value = false;
  FormDataRef.value.clearValidate();
};
// 字典遍历当前label 通用
const dictToLabel = (data: any, value: string | number) => {
  return data?.find((x: any) => x.value === value) ?? {};
};
// 选择产品，触发级联
const productChange = (val: string) => {
  const data = dictToLabel(dictObj.productList, val);

  formInfo.data.projectType = data.projectType;
  formInfo.data.projectTypeLabel = data.projectTypeLabel ? data.projectTypeLabel + '-' + data.modeLabel : '-';
  formInfo.data.productLabel = data.brandName + '-' + data.productName;
  if (formInfo.data.type === 'SERVER') {
    formInfo.data.orderPrice = data.productPrice;
  }
  FormDataRef.value.clearValidate();
};
// 获取car字典
const getCarDict = async () => {
  dictObj.carList = await carManageDropdown();
};
// 车辆相关信息
const carData = computed(() => {
  return (
    dictObj.carList?.find((x: any) => x.value === formInfo.data.carManageId) ?? {
      label: '',
      customIdObj: {
        nickname: '',
        telephone: '',
        tagIdLabel: '',
        totalMoney: ''
      }
    }
  );
});
// 订单信息
const orderDetail = computed((): OrderDesc => {
  return {
    typeLabel: formInfo.data.typeLabel,
    projectTypeLabel: formInfo.data.projectTypeLabel,
    productBrandIdLabel: formInfo.data.productLabel,
    carBrandLabel: carData.value.label,
    orderPrice: formInfo.data.orderPrice,
    customId: carData.value.customId,
    nickname: carData.value.customIdObj.nickname,
    telephone: carData.value.customIdObj.telephone,
    tagIdLabel: carData.value.customIdObj.tagIdLabel,
    totalMoney: carData.value.customIdObj.totalMoney
  };
});
// 支付详情
const configPayDetail = computed((): ConfigPayDesc => {
  // 负责人 工作团队
  let directorIdLabel = '',
    workTeamLabellist = [];
  dictObj.cunstomList.forEach((item: any) => {
    if (formInfo.data.directorId === item.value) {
      directorIdLabel = item.label;
    } else if (formInfo.data.workTeam.includes(item.value)) {
      workTeamLabellist.push(item.label);
    }
  });
  return {
    directorIdLabel: directorIdLabel,
    workTeamLabel: workTeamLabellist.join(','),
    isFlow: formInfo.data.isFlow,
    isFlowLabel: dictToLabel(dictObj.dictEnum__orderIsFlow, formInfo.data.isFlow).label,
    isCommission: formInfo.data.isCommission,
    isCommissionLabel: dictToLabel(dictObj.dictEnum__orderIsCommission, formInfo.data.isCommission).label,
    commPrice: formInfo.data.commPrice,
    commDistriLabel: dictToLabel(dictObj.dictEnum__commDistri, formInfo.data.commDistri).label,
    orderPayType: formInfo.data.orderPayType,
    orderPayTypeLabel: dictToLabel(dictObj.dictEnum__orderPayType, formInfo.data.orderPayType).label,
    accountPrice: formInfo.data.accountPrice,
    cashPrice: formInfo.data.cashPrice,
    realityPrice: countList([formInfo.data.accountPrice, formInfo.data.cashPrice]),
    remarks: formInfo.data.remarks
  };
});
// 负责人 作业团队的disabled
const postPersonList = computed(() => {
  return dictObj.cunstomList.filter((item) => {
    return !formInfo.data.workTeam.includes(item.value);
  });
});
const postTeamList = computed(() => {
  return dictObj.cunstomList.filter((item) => {
    return item.value !== formInfo.data.directorId;
  });
});
const postNum = computed(() => {
  const count = formInfo.data.workTeam.length + (formInfo.data.directorId !== undefined ? 1 : 0);
  console.log(count);
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  if (count < 2) formInfo.data.commDistri = 'AVERAGE';
  return count;
});

const handleCancel = () => {
  active.value = 0;
  formInfo.data = { ...initFormData };
  FormDataRef.value.resetFields();
  emit('update:visible', false);
};
const setPay = () => {
  // 账户余额 - 订单价格 > 0  订单价格 ：账户余额
  if (orderDetail.value.totalMoney - Number(formInfo.data.orderPrice) >= 0) {
    formInfo.data.accountPrice = Number(formInfo.data.orderPrice);
    formInfo.data.cashPrice = 0;
  } else {
    formInfo.data.accountPrice = orderDetail.value.totalMoney;
    formInfo.data.cashPrice = Number(formInfo.data.orderPrice) - orderDetail.value.totalMoney;
  }
};
const isEqual = computed(() => {
  return Number(countList([formInfo.data.accountPrice, formInfo.data.cashPrice])) === formInfo.data.orderPrice;
});
const handleNext = (step: number) => {
  formInfo.data.orderPrice = Number(formInfo.data.orderPrice).toFixed(2);
  if (step === -1) {
    active.value += step;
    return;
  }
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (active.value === 2 && formInfo.data.orderPayType === 'PROMPTLY_PAY' && !isEqual.value) {
        await proxy?.$modal.confirm('订单价格与支付金额不一致，是否继续下一步?');
      }
      active.value += step;
    }
  });
};

const handleSubmit = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      let data = formInfo.data;
      if (formInfo.data.type !== 'SERVER') {
        data.otherId = props.basicData.otherId;
      }
      await orderAdd(data);
      proxy?.$modal.msgSuccess('操作成功');
      handleCancel();
      emit('confirm');
    }
  });
};

const init = async () => {
  loading.value = true;
  const cunstomList = await staffDropdown();
  dictObj.cunstomList = cunstomList.map((item) => {
    return {
      value: item.id,
      label: item.name
    };
  });
  getCarDict();
  formInfo.data.typeLabel = dictObj.dictEnum__orderType.find((x: any) => x.value === props.basicData.type).label ?? '';
  if (props.basicData.type !== 'SERVER') {
    nextTick(async () => {
      Object.assign(formInfo.data, { ...props.basicData });
      dictObj.productList = await productDropdown({
        productBrandId: props.basicData.productBrandId
      });
      productChange(formInfo.data.productId);
    });
  }

  FormDataRef.value?.resetFields();
  loading.value = false;
};

watch(
  () => props.visible,
  (v) => {
    if (!v) return;
    init();
  }
);
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
