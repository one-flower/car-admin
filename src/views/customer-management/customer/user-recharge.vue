<template>
  <div class="p-2">
    <el-dialog
      :model-value="visible"
      title="创建订单"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!saveLoading"
      :before-close="handleCancel"
    >
      <el-form ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item ref="FormDataRef" label="选择套餐" prop="id">
          <el-select
            v-model="formData.id"
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
          <el-descriptions-item label="账户余额"> {{ targetInfo.accountBalance }} 元</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="mb10">
        <el-descriptions title="充值结果" :column="2" border>
          <el-descriptions-item label="账户余额">
            {{ countList([formData.realityMoney, formData.giveMoney, targetInfo.accountBalance], 2) }} 元</el-descriptions-item
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
import { rechargeList } from '@/api/store-management/recharge';
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
    remoteMethod();
  }
);

const rules = {
  id: [{ required: true, message: '套餐不能为空', trigger: ['change', 'blur'] }]
};
const saveLoading = ref(false);
const handleNext = () => {
  console.log('sdfa');
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
  Object.assign(formData, initFormData);
  FormDataRef.value?.resetFields();
  emit('update:visible', false);
  emit('confirmCallBack');
};

type SelectOption = {
  loading: boolean;
  options: any;
  cache: any;
};

const selectOption = reactive<SelectOption>({
  loading: false,
  options: [],
  cache: []
});
const remoteMethod = async (query?: string) => {
  // if (query) {
  selectOption.loading = true;
  const res = await rechargeList({
    pageNum: 1,
    pageSize: 99999
  });
  selectOption.cache = res.rows.map((item) => {
    return {
      ...item,
      label: item.name,
      value: item.id
    };
  });
  selectOption.options = res.rows.map((item) => {
    return {
      ...item,
      label: item.name,
      value: item.id
    };
  });
  selectOption.loading = false;
  // } else {
  //   selectOption.options = [];
  // }
};
const change = () => {
  Object.assign(formData, selectOption.options.filter((item) => item.id === formData.id)[0] ?? {});
};
</script>
