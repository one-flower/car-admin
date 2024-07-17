<template>
  <div class="p-2">
    <el-dialog
      :model-value="visible"
      title="套餐充值"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!saveLoading"
      :before-close="handleCancel"
    >
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="选择客户" prop="customId">
          <el-select
            v-model="formData.customId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="selectOption.loading"
            @change="change"
          >
            <el-option v-for="item in selectOption.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mb10">
        <el-descriptions class="margin-top" title="充值套餐" :column="2" border>
          <el-descriptions-item label="套餐名称" min-width="100" :span="2"> {{ targetInfo.name }} </el-descriptions-item>
          <el-descriptions-item label="充值金额" min-width="100" :span="1"> {{ formData.realityMoney }} 元</el-descriptions-item>
          <el-descriptions-item label="赠送金额" min-width="100" :span="1"> {{ formData.giveMoney }} 元</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mb10">
        <el-descriptions class="margin-top" title="会员信息" :column="2" border>
          <el-descriptions-item label="客户昵称" min-width="100"> {{ selectOption.form.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话" min-width="100"> {{ selectOption.form.telephone }} </el-descriptions-item>
          <el-descriptions-item label="客户标签" min-width="100"> {{ selectOption.form.tagIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户余额" min-width="100"> {{ selectOption.form.accountBalance ?? '0.00' }} 元</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mb10">
        <el-descriptions class="margin-top" title="充值结果" :column="2" border>
          <el-descriptions-item label="账户余额" min-width="100">
            {{ countNum(formData.realityMoney, formData.giveMoney, selectOption.form.accountBalance) }} 元</el-descriptions-item
          >
          <el-descriptions-item label="经办人" min-width="100">{{ useUserStore().nickname }} </el-descriptions-item>
          <el-descriptions-item label="充值时间" min-width="100">
            {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }}
          </el-descriptions-item>
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
import { customList } from '@/api/customer-management/customer';
import { FormData as customerFormData } from '@/api/customer-management/customer/types';
import useUserStore from '@/store/modules/user';

const emit = defineEmits(['update:visible', 'confirmCallBack']);
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
  (val) => {
    if (!val) return;
    remoteMethod();
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
      await userRecharge(formData);
      handleCancel();
      saveLoading.value = false;
    }
  });
};
const handleCancel = () => {
  Object.assign(formData, initFormData);
  FormDataRef.value?.resetFields();
  Object.assign(selectOption.form, initSelectOptionForm);

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
const remoteMethod = async (query?: string) => {
  // if (query) {
  selectOption.loading = true;
  const res = await customList({
    pageNum: 1,
    pageSize: 10
  });
  selectOption.cache = res.rows.map((item) => {
    return {
      ...item,
      label: item.nickname,
      value: item.id
    };
  });
  selectOption.options = res.rows.map((item) => {
    return {
      ...item,
      label: item.nickname,
      value: item.id
    };
  });
  selectOption.loading = false;
  // } else {
  //   selectOption.options = [];
  // }
};
const change = () => {
  selectOption.form = selectOption.options.filter((item) => item.id === formData.customId)[0] ?? {};
};

const countNum = (a: string | number, b: string | number, c: string | number) => {
  return (Number(a ?? 0) + Number(b ?? 0) + Number(c ?? 0)).toFixed(2);
};
</script>
