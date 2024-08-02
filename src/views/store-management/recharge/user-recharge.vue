<template>
  <div class="p-2">
    <el-dialog :model-value="visible" title="会员充值" width="600px" append-to-body :show-close="!saveLoading" :before-close="handleCancel">
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="选择客户" prop="customId">
          <el-select v-model="formData.customId" filterable placeholder="请选择" @change="change">
            <el-option v-for="item in dictObj.customList" :key="item.id" :label="`${item.nickname}/${item.telephone}`" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mb10">
        <el-descriptions title="充值套餐" :column="2" border>
          <el-descriptions-item label="套餐名称" :span="2"> {{ targetInfo.name }} </el-descriptions-item>
          <el-descriptions-item label="充值金额" :span="1"> {{ formData.realityMoney }} 元</el-descriptions-item>
          <el-descriptions-item label="赠送金额" :span="1"> {{ formData.giveMoney }} 元</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mb10">
        <el-descriptions title="会员信息" :column="2" border>
          <el-descriptions-item label="客户昵称"> {{ selectOption.form.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话"> {{ selectOption.form.telephone }} </el-descriptions-item>
          <el-descriptions-item label="客户标签"> {{ selectOption.form.tagIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户余额"> {{ selectOption.form.totalMoney ?? '0.00' }} 元</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mb10">
        <el-descriptions title="充值结果" :column="2" border>
          <el-descriptions-item label="账户余额">
            {{ countList([formData.realityMoney, formData.giveMoney, selectOption.form.totalMoney], 2) }} 元</el-descriptions-item
          >
          <el-descriptions-item label="经办人">{{ useUserStore().nickname }} </el-descriptions-item>
          <el-descriptions-item label="充值时间"> {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }} </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleNext">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { userRecharge } from '@/api/store-management/recharge';
import { FormData } from '@/api/store-management/recharge/types';
import { customDropdown, customList } from '@/api/customer-management/customer';
import { FormData as customerFormData } from '@/api/customer-management/customer/types';
import useUserStore from '@/store/modules/user';
import { countList } from '@/utils/index';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emit = defineEmits(['update:visible', 'confirm']);
const props = defineProps({
  // 显示隐藏
  visible: propTypes.bool.def(false).isRequired,
  targetInfo: {
    type: Object,
    default: () => {
      return {};
    },
    required: true
  }
});

const initFormData: FormData = {
  id: undefined,
  customId: undefined,
  realityMoney: 0,
  giveMoney: 0,
  remarks: '',
  name: '',
  state: '1'
};
const FormDataRef = ref<ElFormInstance>();
const formData = reactive<FormData>({ ...initFormData });

watch(
  () => props.visible,
  async (val) => {
    if (!val) return;
    Object.assign(formData, initFormData);
    FormDataRef.value?.resetFields();
    Object.assign(selectOption.form, initSelectOptionForm);

    dictObj.customList = await customDropdown();

    formData.id = props.targetInfo.id;
    formData.realityMoney = props.targetInfo.realityMoney ?? '0.00';
    formData.giveMoney = props.targetInfo.giveMoney ?? '0.00';
  }
);

const rules = {
  customId: [{ required: true, message: '客户不能为空', trigger: ['change', 'blur'] }]
};
const saveLoading = ref(false);
const handleNext = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      saveLoading.value = true;
      const res = await userRecharge(formData);
      saveLoading.value = false;
      proxy?.$modal.msgSuccess(res.msg);
      emit('confirm', false);
      emit('update:visible', false);
    }
  });
};
const handleCancel = () => {
  emit('update:visible', false);
};

type SelectOption = {
  loading: boolean;
  options: any;
  cache: any;
  form: customerFormData;
};
const initSelectOptionForm: customerFormData = {
  id: '',
  tagId: '',
  nickname: '',
  telephone: '',
  channel: '',
  remarks: '',
  tagIdLabel: ''
};
const selectOption = reactive<SelectOption>({
  loading: false,
  options: [],
  cache: [],
  form: { ...initSelectOptionForm }
});
const change = (val) => {
  selectOption.form = dictObj.customList.filter((item) => item.id === val)[0] ?? {};
};
const dictObj = reactive({
  customList: <any>[]
});
</script>
