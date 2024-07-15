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
      @close="handleCancel"
    >
      <div class="mb-[20px]">
        <el-steps :active="active" finish-status="success">
          <el-step title="充值套餐" />
          <el-step title="选择客户" />
          <el-step title="充值核对" />
          <el-step title="完成" />
        </el-steps>
      </div>

      <el-form v-if="active === 0" ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="套餐名称" prop="name"> {{ targetInfo.name }} </el-form-item>
        <el-form-item label="充值金额" prop="realityMoney">
          <el-input-number v-model.number="formData.realityMoney as number" :precision="2" :min="0" :max="99999.99" />
        </el-form-item>
        <el-form-item label="赠送金额" prop="giveMoney">
          <el-input-number v-model.number="formData.giveMoney as number" :precision="2" :min="0" :max="99999.99" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="formData.remarks" type="textarea" row="auto" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <el-form v-else-if="active === 1" ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
        <el-form-item label="选择客户" prop="customId">
          <el-select
            v-model="formData.customId"
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="selectOption.loading"
            @change="change"
          >
            <el-option v-for="item in selectOption.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-descriptions class="margin-top" title="" :column="2" border>
          <el-descriptions-item label="客户昵称" min-width="100" column="2"> {{ selectOption.form.nickname }} </el-descriptions-item>
          <el-descriptions-item label="预留电话" min-width="100"> {{ selectOption.form.telephone }} </el-descriptions-item>
          <el-descriptions-item label="客户标签" min-width="100"> {{ selectOption.form.tagIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="账户余额" min-width="100"> {{ selectOption.form.giveBalance }} 元</el-descriptions-item>
        </el-descriptions>
      </el-form>
      <el-form v-else-if="active === 2" ref="FormDataRef" :model="formData" :rules="rules" label-width="80px" @submit.prevent>
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
            <el-descriptions-item label="账户余额" min-width="100"> {{ selectOption.form.giveBalance }} 元</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="mb10">
          <el-descriptions class="margin-top" title="充值结果" :column="2" border>
            <el-descriptions-item label="账户余额" min-width="100">
              {{ countNum(formData.realityMoney, formData.giveMoney, selectOption.form.giveBalance) }} 元</el-descriptions-item
            >
            <el-descriptions-item label="经办人" min-width="100">{{ useUserStore().nickname }} </el-descriptions-item>
            <el-descriptions-item label="充值时间" min-width="100">
              {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-form>
      <div v-else-if="active === 3">
        <div style="text-align: center">
          <el-progress type="dashboard" :percentage="100" status="success">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">完成</span>
            </template>
          </el-progress>
        </div>
      </div>
      <template #footer>
        <div v-if="active !== 3" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleNext">{{ active === 2 ? '下一步' : '下一步' }}</el-button>
        </div>
        <div v-else style="text-align: center">
          <el-button type="success" @click="handleCancel">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Post" lang="ts">
import { propTypes } from '@/utils/propTypes';
import { userRecharge } from '@/api/store-management/recharge';
import { UserFormData } from '@/api/store-management/recharge/types';
import { customList } from '@/api/customer-management/customer';
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

const FormDataRef = ref<ElFormInstance>();
const formData = reactive<UserFormData>({
  id: undefined,
  customId: undefined,
  realityMoney: 0,
  giveMoney: 0,
  remarks: ''
});

watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    formData.id = props.targetInfo.id;
    formData.realityMoney = parseFloat(props.targetInfo.realityMoney ?? '0');
    formData.giveMoney = parseFloat(props.targetInfo.giveMoney ?? '0');
  }
);

const rules = {
  realityMoney: [{ required: true, message: '充值金额不能为空', trigger: ['change', 'blur'] }],
  giveMoney: [{ required: true, message: '赠送金额不能为空', trigger: ['change', 'blur'] }],
  customId: [{ required: true, message: '选择客户', trigger: ['change', 'blur'] }]
};
const saveLoading = ref(false);
const handleNext = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (active.value === 2) {
        saveLoading.value = true;
        await userRecharge(formData);
        saveLoading.value = false;
        active.value++;
      } else {
        active.value++;
      }
    }
  });
};
const handleCancel = () => {
  active.value = 0;
  emit('update:visible', false);
};

type SelectOption = {
  loading: boolean;
  options: any;
  cache: any;
  form: {
    nickname: string;
    telephone: string;
    tagIdLabel: string;
    giveBalance: string;
  };
};
const selectOption = reactive<SelectOption>({
  loading: false,
  options: [],
  cache: [],
  form: {
    nickname: '',
    telephone: '',
    tagIdLabel: '',
    giveBalance: ''
  }
});
const remoteMethod = async (query: string) => {
  if (query) {
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
  } else {
    selectOption.options = [];
  }
};
const change = () => {
  selectOption.form = selectOption.options.filter((item) => item.id === formData.customId)[0] ?? {};
};

const countNum = (a: string | number, b: string | number, c: string | number) => {
  return Number(a) + Number(b) + Number(c);
};
</script>
