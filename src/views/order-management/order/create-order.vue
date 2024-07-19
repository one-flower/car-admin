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
      <el-steps :active="active" direction="horizontal" process-status="wait" finish-status="success">
        <el-step title="创建订单" />
        <el-step title="订单配置" />
        <el-step title="订单支付" />
        <el-step title="完成" />
      </el-steps>
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <template v-if="active === 0">
          <el-form-item label="订单类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择订单类型" clearable filterable>
              <el-option v-for="item in dictObj.dictEnum__orderType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType">
            <el-select v-model="formData.projectType" placeholder="请选择项目类型" clearable filterable>
              <el-option v-for="item in dictObj.configProject__configProject" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择车辆" prop="carManageId">
            <el-select v-model="formData.carManageId" placeholder="请选择车辆" clearable filterable>
              <el-option v-for="item in dictObj.carList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品品牌" prop="brandId">
            <el-select v-model="formData.brandId" placeholder="请选择产品品牌" clearable filterable>
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
              :disabled="!formData.brandId"
              @change="productChange"
            >
              <el-option v-for="item in pList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          <!-- </template>
        <template v-else-if="active === 1"> -->
          <el-descriptions title="" :column="2" border class="mb10">
            <el-descriptions-item label="订单类型" min-width="100"> {{ orderName }} </el-descriptions-item>
            <el-descriptions-item label="项目类型" min-width="100"> {{ brandName }} </el-descriptions-item>
            <el-descriptions-item label="品牌名称" min-width="100"> {{ productName }} </el-descriptions-item>
            <el-descriptions-item label="订单价格" min-width="100"> {{ formData.orderPrice }} </el-descriptions-item>
          </el-descriptions>
          <el-form-item label="负责人" prop="customId">
            <el-select v-model="formData.projectType" placeholder="请选择车辆" clearable filterable>
              <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业团队" prop="customId">
            <el-select v-model="formData.projectType" placeholder="请选择车辆" clearable filterable multiple :multiple-limit="4">
              <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单施工" prop="customId">
            <el-radio-group v-model="formData.specifyDesc" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsFlow" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单提成" prop="customId">
            <el-radio-group v-model="formData.specifyDesc" class="ml-4">
              <el-radio v-for="item in dictObj.dictEnum__orderIsCommission" :key="item.id" :value="item.value" :label="item.label" />
            </el-radio-group>
          </el-form-item>
          <template v-if="true">
            <el-form-item label="订单金额" prop="customId">
              <el-input v-model="formData.specifyDesc" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="提成分配" prop="customId">
              <el-radio-group v-model="formData.specifyDesc" class="ml-4">
                <el-radio v-for="item in []" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
          </template>
        </template>
        <template v-else-if="active === 2">
          <el-descriptions title="" :column="2" border class="mb10">
            <el-descriptions-item label="订单类型" min-width="100"> {{ formData.brandIdLabel }} </el-descriptions-item>
            <el-descriptions-item label="项目类型" min-width="100"> {{ formData.licensePlate }} </el-descriptions-item>
            <el-descriptions-item label="品牌名称" min-width="100"> {{ formData.vin }} </el-descriptions-item>
            <el-descriptions-item label="订单价格" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单车辆" min-width="100" :span="2"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="客户昵称" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="预留电话" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="客户标签" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="账户余额" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
          </el-descriptions>
          <template v-if="true">
            <el-form-item label="订单支付" prop="customId">
              <el-radio-group v-model="formData.specifyDesc" class="ml-4">
                <el-radio v-for="item in dictObj.dictEnum__orderPayType" :key="item.id" :value="item.value" :label="item.label" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="账户支付" prop="customId">
              <el-input-number v-model="formData.projectType" placeholder=" " :min="0" :max="99999.99" :precision="2"> </el-input-number>
            </el-form-item>
            <el-form-item label="现金支付" prop="customId">
              <el-input-number v-model="formData.projectType" placeholder=" " :min="0" :max="99999.99" :precision="2"> </el-input-number>
              <el-select v-model="formData.projectType" placeholder="请选择支付渠道" clearable filterable>
                <el-option v-for="item in dictObj.dictEnum___payChannel" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付合计" prop="customId">
              <el-input v-model="formData.projectType" disabled> </el-input>
            </el-form-item>
          </template>
        </template>
        <template v-else-if="active === 3">
          <el-descriptions title="订单信息" :column="2" border class="mb10">
            <el-descriptions-item label="订单类型" min-width="100"> {{ formData.brandIdLabel }} </el-descriptions-item>
            <el-descriptions-item label="项目类型" min-width="100"> {{ formData.licensePlate }} </el-descriptions-item>
            <el-descriptions-item label="品牌名称" min-width="100"> {{ formData.vin }} </el-descriptions-item>
            <el-descriptions-item label="订单价格" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单车辆" min-width="100" :span="2"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="客户昵称" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="预留电话" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="客户标签" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="账户余额" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="配置与支付" :column="2" border class="mb10">
            <el-descriptions-item label="负责人" min-width="100"> {{ formData.brandIdLabel }} </el-descriptions-item>
            <el-descriptions-item label="作业团队" min-width="100"> {{ formData.licensePlate }} </el-descriptions-item>
            <el-descriptions-item label="订单施工" min-width="100" :span="2"> {{ formData.vin }} </el-descriptions-item>
            <el-descriptions-item label="提成金额" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="提成分配" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单支付" min-width="100" :span="2"> {{ formData.toTypeLabel }} </el-descriptions-item>
            <el-descriptions-item label="订单备注" min-width="100"> {{ formData.toTypeLabel }} </el-descriptions-item>
          </el-descriptions>
          <el-descriptions title="实际支付xxx元" border class="mb10" />
        </template>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleNext">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="CreateOrder" lang="ts">
import { carManageList } from '@/api/customer-management/car';
import { productList } from '@/api/product-management/product';
import { OrderForm } from '@/api/order-management/order/type';
import propTypes from '@/utils/propTypes';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(
  proxy?.useNewDict(
    'dictEnum__orderType', // 订单类型
    'configProject__configProject', // 项目类型
    // 选择车辆
    'configProductBrand__configProductBrand', // 产品品牌
    // 选择产品
    // 'dictEnum__projectMode', //项目模式
    'dictEnum__orderIsFlow', //是否施工
    'dictEnum__orderIsCommission', //订单提成
    'dictEnum__commDistri', //提成分配
    'dictEnum__orderPayType', // 支付类型
    'dictEnum__payChannel' // 支付渠道
  )
);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);

const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: propTypes.bool.def(false).isRequired
});

// const initFormData: FormData = {
//   id: undefined
// };
const active = ref(0);
const FormDataRef = ref<ElFormInstance>();
const formInfo = reactive<FormInfo<any>>({
  title: '',
  visible: false
});
const formData = reactive<OrderForm>({});
const descripData = reactive({});
const rules = {
  name: [{ required: true, message: '品牌名称不能为空', trigger: 'blur' }],
  isOrg: [{ required: true, message: '上游机构不能为空', trigger: 'change' }],
  upOrg: [{ required: true, message: '上游机构不能为空', trigger: ['blur', 'change'] }]
};

// 选择产品，触发级联
const pList = computed(() => {
  return dictObj.productList?.filter((item) => {
    return item.brandId === formData.brandId;
  });
});
const productChange = (val) => {
  formData.orderPrice = pList.value.find((x: any) => x.value === val).price;
};

// 赋予选项对应的label
const orderName = computed(() => {
  return dictObj.dictEnum__orderType.find((x: any) => x.value === formData.type)?.label ?? '';
});
const productName = computed(() => {
  return dictObj.configProject__configProject.find((x: any) => x.value === formData.projectType)?.label ?? '';
});
const brandName = computed(() => {
  const first = dictObj.configProductBrand__configProductBrand.find((x: any) => x.value === formData.brandId)?.label ?? '';
  const secound = dictObj.productList?.find((x: any) => x.value === formData.productId)?.label ?? '';
  return `${first}/${secound}`;
});

const handleCancel = () => {
  emit('update:visible', false);
};

const handleNext = () => {
  active.value++;
};

const init = async () => {
  const carList = await carManageList({
    pageNum: 1,
    pageSize: 99999
  });
  dictObj.carList = carList.rows.map((item: any) => {
    return {
      value: item.id,
      label: `${item.brandIdLabel}/${item.licensePlate}${item.vin}`
    };
  });
  const pList = await productList({
    pageNum: 1,
    pageSize: 99999
  });
  dictObj.productList = pList.rows.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
      brandId: item.productBrandId,
      price: item.price
    };
  });
};
init();
</script>
