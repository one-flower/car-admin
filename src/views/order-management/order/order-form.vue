<template>
  <div class="p-2">
    <el-dialog
      :model-value="visible"
      title="新建订单"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!formInfo.visible"
      :before-close="handleCancel"
    >
      <el-steps :active="active" direction="horizontal" process-status="process" finish-status="success" class="mb10">
        <el-step title="创建订单" />
        <el-step title="订单配置" />
        <el-step title="订单支付" />
        <el-step title="完成" />
      </el-steps>
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <template v-if="active === 0">
          <el-form-item label="订单类型" prop="type">
            <el-select v-model="formData.type" placeholder="订单类型" disabled>
              <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" disabled :label="item.label" :value="item.value">
              </el-option> </el-select
          ></el-form-item>
          <el-form-item label="项目类型" prop="projectTypeLabel">
            <el-input v-model="formData.projectTypeLabel" placeholder="项目类型" disabled></el-input>
          </el-form-item>
          <el-form-item label="选择车辆" prop="carManageId">
            <el-select v-model="formData.carManageId" placeholder="请选择车辆" clearable filterable>
              <el-option v-for="item in dictObj.carList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品品牌" prop="productBrandId">
            <el-select v-model="formData.productBrandId" placeholder="请选择产品品牌" clearable filterable @change="changeBrand">
              <el-option v-for="item in dictObj.configProductBrand__configProductBrand" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择产品" prop="productId">
            <el-select
              v-model="formData.productId"
              placeholder="请选择产品"
              clearable
              filterable
              :disabled="!formData.productBrandId || productLoading"
              @change="productChange"
            >
              <el-option v-for="item in dictObj.productList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单价格" prop="orderPrice">
            <el-input-number
              v-model="formData.orderPrice"
              :disabled="!formData.productId"
              placeholder="订单价格"
              :min="0"
              :max="99999.99"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="formData.remarks" placeholder="请输入" type="textarea" row="auto" maxlength="255" show-word-limit clearable></el-input>
          </el-form-item>
        </template>
        <template v-else-if="active === 1">
          <el-descriptions title="" :column="2" border class="mb10">
            <el-descriptions-item label="订单类型"> 服务订单 </el-descriptions-item>
            <el-descriptions-item label="项目类型"> {{ formData.projectTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="品牌名称"> {{ formData.productLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单价格"> {{ formData.orderPrice }} </el-descriptions-item>
          </el-descriptions>
          <el-form-item label="负责人" prop="directorId">
            <el-select v-model="formData.directorId" placeholder="负责人" clearable filterable>
              <el-option v-for="item in postPersonList" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业团队" prop="workTeam">
            <el-select v-model="formData.workTeam" placeholder="请选择作业团队" clearable filterable multiple :multiple-limit="4">
              <el-option v-for="item in postTeamList" :key="item.value" :disabled="item.disabled" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单施工" prop="isFlow">
            <el-radio-group v-model="formData.isFlow" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsFlow" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单提成" prop="isCommission">
            <el-radio-group v-model="formData.isCommission" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsCommission" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.isCommission === '1'">
            <el-form-item label="提成金额" prop="commPrice">
              <el-input-number v-model="formData.commPrice" placeholder="" :min="0" :max="99999.99" :precision="2"> </el-input-number>
            </el-form-item>
            <el-form-item label="提成分配" prop="commDistri">
              <el-radio-group v-model="formData.commDistri" class="ml-4">
                <el-radio v-for="item in dictObj.dictEnum__commDistri" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
          </template>
        </template>
        <template v-else-if="active === 2">
          <order-pay-desc-item :readonly="true" :order-data="orderDetail"></order-pay-desc-item>
          <template v-if="true">
            <el-form-item label="订单支付" prop="orderPayType">
              <el-radio-group v-model="formData.orderPayType" class="ml-4">
                <el-radio v-for="item in dictObj.dictEnum__orderPayType" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
            <template v-if="formData.orderPayType === 'PROMPTLY_PAY'">
              <el-form-item label="账户支付" prop="accountPrice">
                <el-input-number v-model="formData.accountPrice" placeholder="" :min="0" :max="99999.99" :precision="2"> </el-input-number>
              </el-form-item>
              <el-form-item label="现金支付" prop="cashPrice">
                <div class="formItemBox">
                  <el-form-item prop="cashPrice">
                    <el-input-number v-model="formData.cashPrice" placeholder=" " :min="0" :max="99999.99" :precision="2"> </el-input-number>
                  </el-form-item>
                  <el-form-item v-if="formData.cashPrice !== 0" prop="payChannel">
                    <el-select v-model="formData.payChannel" placeholder="请选择支付渠道" clearable filterable class="formItemBox__right">
                      <el-option v-for="item in dictObj.dictEnum__payChannel" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="支付合计" prop="customId">
                <div :class="{ 'warn': countList([formData.accountPrice, formData.cashPrice]) !== formData.orderPrice.toFixed(2) }">
                  {{ countList([formData.accountPrice, formData.cashPrice]) }} 元
                </div>
              </el-form-item>
            </template>
          </template>
        </template>
        <template v-else-if="active === 3">
          <order-desc-item :order-data="orderDetail" :config-pya-data="configPayDetail"></order-desc-item>
        </template>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button v-if="active === 3" type="primary" @click="handleSubmit">提交</el-button>
          <el-button v-else type="primary" @click="handleNext">下一步</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="CreateOrder" lang="ts">
import { productDropdown } from '@/api/product-management/product';
import { carManageDropdown } from '@/api/customer-management/car';
import { orderAdd } from '@/api/order-management/order';
import { OrderForm, OrderDesc, ConfigPayDesc } from '@/api/order-management/order/types';
import propTypes from '@/utils/propTypes';
import OrderPayDescItem from './order-pay-desc.vue';
import OrderDescItem from './order-desc.vue';
import { countList } from '@/utils/index';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy?.useNewDict(
    'dictEnum__orderType', // 订单类型
    // 'configProject__configProject', // 项目类型
    'configProductBrand__configProductBrand', // 产品品牌
    'configPost__configPost', // 负责人 作业团队
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
  targetData: {
    type: Object,
    default: () => {
      return {};
    },
    required: true
  }
});

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
  orderPayType: 'PROMPTLY_PAY',
  accountPrice: 0,
  cashPrice: 0,
  payChannel: '',
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
  loading: false
});
const formData = reactive<OrderForm>({
  ...initFormData
});
const rules = {
  projectTypeLabel: [{ required: true, message: '项目类型不能为空', trigger: 'change' }],
  carManageId: [{ required: true, message: '车辆不能为空', trigger: 'change' }],
  productBrandId: [{ required: true, message: '产品品牌不能为空', trigger: 'change' }],
  productId: [{ required: true, message: '产品不能为空', trigger: 'change' }],
  orderPrice: [{ required: true, message: '订单价格不能为空', trigger: ['blur', 'change'] }],
  directorId: [{ required: true, message: '负责人不能为空', trigger: 'change' }],
  isFlow: [{ required: true, message: '订单施工不能为空', trigger: 'change' }],
  isCommission: [{ required: true, message: '订单提成不能为空', trigger: 'change' }],
  commPrice: [{ required: true, message: '订单金额不能为空', trigger: 'blur' }],
  commDistri: [{ required: true, message: '提成分配不能为空', trigger: 'change' }]
};

//获取客户信息
const productLoading = ref(false);
const changeBrand = async (val: string) => {
  productLoading.value = true;
  dictObj.productList = await productDropdown({
    productBrandId: val
  });
  productLoading.value = false;
};
// 字典遍历当前label 通用
const dictToLabel = (data: any, value: string | number) => {
  return data?.find((x: any) => x.value === value) ?? {};
};
// 选择产品，触发级联
const productChange = (val) => {
  const data = dictToLabel(dictObj.productList, val);
  formData.orderPrice = parseFloat(data.productPrice);
  formData.projectType = data.projectType;
  formData.projectTypeLabel = data.projectTypeLabel + '-' + data.modeLabel;
  formData.productLabel = data.label;
};

// 赋予选项对应的label

// 车辆相关信息
const carData = computed(() => {
  return (
    dictObj.carList?.find((x: any) => x.value === formData.carManageId) ?? {
      label: '',
      customIdObj: {
        nickname: '',
        telephone: '',
        tagIdLabel: '',
        accountBalance: ''
      }
    }
  );
});
// 订单信息
const orderDetail = computed((): OrderDesc => {
  return {
    typeLabel: formData.typeLabel,
    projectTypeLabel: formData.projectTypeLabel,
    productBrandIdLabel: formData.productLabel,
    carBrandLabel: carData.value.label,
    orderPrice: formData.orderPrice,
    nickname: carData.value.customIdObj.nickname,
    telephone: carData.value.customIdObj.telephone,
    tagIdLabel: carData.value.customIdObj.tagIdLabel,
    accountBalance: carData.value.customIdObj.accountBalance
  };
});
const configPayDetail = computed((): ConfigPayDesc => {
  // 负责人 工作团队
  let directorIdLabel = '',
    workTeamLabellist = [];
  dictObj.configPost__configPost.forEach((item: any) => {
    if (formData.directorId === item.value) {
      directorIdLabel = item.label;
    } else if (formData.workTeam.includes(item.value)) {
      workTeamLabellist.push(item.label);
    }
  });
  return {
    directorIdLabel: directorIdLabel,
    workTeamLabel: workTeamLabellist.join(','),
    isFlow: formData.isFlow,
    isFlowLabel: dictToLabel(dictObj.dictEnum__orderIsFlow, formData.isFlow).label,
    isCommission: formData.isCommission,
    isCommissionLabel: dictToLabel(dictObj.dictEnum__orderIsCommission, formData.isCommission).label,
    commPrice: formData.commPrice,
    commDistriLabel: dictToLabel(dictObj.dictEnum__commDistri, formData.commDistri).label,
    orderPayType: formData.orderPayType,
    orderPayTypeLabel: dictToLabel(dictObj.dictEnum__orderPayType, formData.orderPayType).label,
    accountPrice: formData.accountPrice,
    cashPrice: formData.cashPrice,
    realityPrice: countList([formData.accountPrice, formData.cashPrice]),
    remarks: formData.remarks
  };
});
// 负责人 作业团队的disabled
const postPersonList = computed(() => {
  return dictObj.configPost__configPost.filter((item) => {
    return !formData.workTeam.includes(item.value);
  });
});
const postTeamList = computed(() => {
  return dictObj.configPost__configPost.filter((item) => {
    return item.value !== formData.directorId;
  });
});

const handleCancel = () => {
  active.value = 0;
  Object.assign(formData, initFormData);
  FormDataRef.value.resetFields();
  emit('update:visible', false);
};

const handleNext = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (active.value === 2 && countList([formData.accountPrice, formData.cashPrice]) !== formData.orderPrice.toFixed(2)) {
        await proxy?.$modal.confirm('订单价格与支付金额不一致，是否继续下一步?');
        active.value++;
      } else {
        active.value++;
      }
    }
  });
};
const handleSubmit = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      formInfo.loading = true;
      await orderAdd(formData);
      proxy?.$modal.msgSuccess('操作成功');
      formInfo.loading = false;
      handleCancel();
      emit('confirm');
    }
  });
};

const init = async () => {
  dictObj.carList = await carManageDropdown();
  Object.assign(formData, props.targetData);
};

watch(
  () => props.visible,
  () => {
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
