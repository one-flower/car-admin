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
      @close="handleCancel"
    >
      <div class="mb-[20px]">
        <el-steps :active="active" finish-status="success">
          <el-step title="选择套餐" />
          <el-step title="充值核对" />
          <!-- <el-step title="完成" /> -->
        </el-steps>
      </div>

      <el-form v-if="active === 0" ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="选择套餐" prop="customId">
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
        <el-descriptions class="margin-top" title="" :column="2" border>
          <el-descriptions-item label="充值金额" min-width="100" :span="1"> {{ formData.realityMoney ?? 0 }} </el-descriptions-item>
          <el-descriptions-item label="赠送金额" min-width="100" :span="1"> {{ formData.giveMoney ?? 0 }} 元 </el-descriptions-item>
          <el-descriptions-item label="备注" min-width="100" :span="2"> {{ formData.remarks }} </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <el-form v-else-if="active === 1" ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <div class="mb10">
          <el-descriptions class="margin-top" title="充值套餐" :column="2" border>
            <el-descriptions-item label="套餐名称" min-width="100" :span="2"> {{ formData.name }} </el-descriptions-item>
            <el-descriptions-item label="充值金额" min-width="100" :span="1"> {{ formData.realityMoney }} 元</el-descriptions-item>
            <el-descriptions-item label="赠送金额" min-width="100" :span="1"> {{ formData.giveMoney }} 元</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="mb10">
          <el-descriptions class="margin-top" title="会员信息" :column="2" border>
            <el-descriptions-item label="客户昵称" min-width="100"> {{ targetInfo.nickname }} </el-descriptions-item>
            <el-descriptions-item label="预留电话" min-width="100"> {{ targetInfo.telephone }} </el-descriptions-item>
            <el-descriptions-item label="客户标签" min-width="100"> {{ targetInfo.tagIdLabel }} </el-descriptions-item>
            <el-descriptions-item label="账户余额" min-width="100"> {{ targetInfo.giveBalance }} 元</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="mb10">
          <el-descriptions class="margin-top" title="充值结果" :column="2" border>
            <el-descriptions-item label="账户余额" min-width="100">
              {{ countNum(formData.realityMoney, formData.giveMoney, targetInfo.giveBalance) }} 元</el-descriptions-item
            >
            <el-descriptions-item label="经办人" min-width="100">{{ useUserStore().nickname }} </el-descriptions-item>
            <el-descriptions-item label="充值时间" min-width="100">
              {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleNext">{{ active === 1 ? '确认' : '下一步' }}</el-button>
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

const active = ref(0);
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
  }
);

const rules = {
  id: [{ required: true, message: '套餐不能为空', trigger: ['change', 'blur'] }]
};
const saveLoading = ref(false);
const handleNext = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (active.value === 1) {
        saveLoading.value = true;
        Object.assign(formData, { customId: props.targetInfo.id });
        await userRecharge(formData);
        handleCancel();
        saveLoading.value = false;
      } else {
        active.value++;
      }
    }
  });
};
const handleCancel = () => {
  Object.assign(formData, initFormData);
  FormDataRef.value?.resetFields();
  active.value = 0;
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

const countNum = (a: string | number, b: string | number, c: string | number) => {
  return Number(a) + Number(b) + Number(c);
};
</script>
