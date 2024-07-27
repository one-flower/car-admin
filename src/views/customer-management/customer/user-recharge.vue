<template>
  <div class="p-2">
    <el-dialog
      :model-value="visible"
      title="会员充值"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!saveLoading"
      :before-close="handleCancel"
    >
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item ref="FormDataRef" label="选择套餐" prop="id">
          <el-select v-model="formData.id" filterable placeholder="请输入" @change="change">
            <el-option v-for="item in dictObj.rechargeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mb10">
        <el-descriptions title="充值套餐" :column="2" border>
          <el-descriptions-item label="套餐名称" :span="2"> {{ formData.name }} </el-descriptions-item>
          <el-descriptions-item label="充值金额" :span="1"> {{ formData.realityMoney }} 元</el-descriptions-item>
          <el-descriptions-item label="赠送金额" :span="1"> {{ formData.giveMoney }} 元</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="mb10">
        <el-descriptions title="会员信息" :column="2" border>
          <el-descriptions-item label="客户昵称"> {{ targetInfo.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话"> {{ targetInfo.telephone }} </el-descriptions-item>
          <el-descriptions-item label="客户标签"> {{ targetInfo.tagIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户余额"> {{ targetInfo.totalMoney }} 元</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="mb10">
        <el-descriptions title="充值结果" :column="2" border>
          <el-descriptions-item label="账户余额"> {{ nowPrice }} 元</el-descriptions-item>
          <el-descriptions-item label="经办人">{{ useUserStore().nickname }} </el-descriptions-item>
          <el-descriptions-item label="充值时间"> {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }} </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { userRecharge } from '@/api/store-management/recharge';
import { FormData } from '@/api/store-management/recharge/types';
import { rechargeList, rechargeDropdown } from '@/api/store-management/recharge';
import useUserStore from '@/store/modules/user';
import { countList } from '@/utils/index';

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
  realityMoney: '0.00',
  giveMoney: '0.00',
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
  }
);

const rules = {
  id: [{ required: true, message: '套餐不能为空', trigger: ['change', 'blur'] }]
};
const saveLoading = ref(false);
// 余额
const nowPrice = computed(() => {
  return countList([formData.realityMoney, formData.giveMoney, props.targetInfo.totalMoney], 2);
});
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      saveLoading.value = true;
      Object.assign(formData, { customId: props.targetInfo.id });
      await userRecharge(formData);
      handleCancel();
      saveLoading.value = false;
    }
  });
};
const handleCancel = () => {
  emit('confirmCallBack', nowPrice.value);
  Object.assign(formData, initFormData);
  FormDataRef.value?.resetFields();
  emit('update:visible', false);
};

const change = (val) => {
  Object.assign(formData, dictObj.rechargeList.filter((item) => item.id === val)[0] ?? {});
};
const dictObj = reactive({
  rechargeList: <any>[]
});
const init = async () => {
  const res = await rechargeDropdown();
  dictObj.rechargeList = res.data;
};
init();
</script>
