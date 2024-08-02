<template>
  <el-dialog :model-value="visible" title="更换手机号" width="600px" append-to-body :before-close="cancel">
    <el-form ref="FormDataRef" v-loading="loading" :model="changeForm" :rules="rules" label-width="100px" @submit.prevent>
      <el-form-item label="客户编号"> {{ targetInfo.customNo }} </el-form-item>
      <el-form-item label="客户标签"> {{ targetInfo.tagIdLabel }} </el-form-item>
      <el-form-item label="客户昵称"> {{ targetInfo.nickname }} </el-form-item>
      <!-- <el-form-item label="绑定状态"> {{ '未绑定' }} </el-form-item> -->
      <el-form-item label="原手机号码"> {{ targetInfo.telephone }} </el-form-item>
      <el-form-item label="新手机号码" prop="newTelephone">
        <el-input v-model="changeForm.newTelephone" placeholder="请输入新手机号码" clearable />
      </el-form-item>
      <el-form-item label="图形验证码" prop="imgCode">
        <el-input v-model="changeForm.imgCode" auto-complete="off" placeholder="图形验证码" style="width: 63%"> </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" @click="getCode" />
        </div>
      </el-form-item>
      <el-form-item label="短信验证码" prop="smsCode">
        <el-input v-model="changeForm.smsCode" auto-complete="off" placeholder="短信验证码" style="width: 63%"> </el-input>
        <div class="login-code">
          <el-button type="primary" size="default" style="margin-left: 10px" :disabled="!smsInfo.showSend" @click="getSms">
            {{ smsInfo.showSend ? '获取验证码' : `${smsInfo.count}秒后重试` }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { customEditTelephone, authCode, smsCode } from '@/api/customer-management/customer';
import { PhoneForm, PhoneData, ChangePhoneForm } from '@/api/customer-management/customer/types';
import { PropType } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emit = defineEmits(['update:visible', 'confirm']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  targetInfo: {
    type: Object as PropType<PhoneForm>,
    default: () => {
      return {};
    },
    required: true
  }
});

const loading = ref(false);
const FormDataRef = ref<ElFormInstance>();
const initFromData = {
  newTelephone: undefined,
  imgCode: undefined,
  smsCode: undefined
};
let changeForm = reactive<ChangePhoneForm>({
  ...initFromData
});
const rules = {
  // oldTelephone: [{ required: true, message: '原手机号码不能为空', trigger: 'blur' }],
  newTelephone: [{ required: true, message: '新手机号码不能为空', trigger: 'blur' }],
  imgCode: [{ required: true, message: '图形验证码不能为空', trigger: 'blur' }],
  smsCode: [{ required: true, message: '短信验证码不能为空', trigger: 'blur' }]
};

const codeUrl = ref('');

/** 获取验证码 */
const getCode = async () => {
  loading.value = true;
  const res = await authCode();
  const { data } = res;
  codeUrl.value = 'data:image/gif;base64,' + data.img;
  changeForm.uuid = data.uuid;
  loading.value = false;
};

/** 表单重置 */
const reset = () => {
  Object.assign(changeForm, { ...initFromData });
  FormDataRef.value?.resetFields();
};

const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await customEditTelephone({
        oldTelephone: props.targetInfo.telephone,
        ...changeForm,
        id: props.targetInfo.id
      });
      proxy?.$modal.msgSuccess('操作成功');
      cancel();
      emit('confirm');
    }
  });
};

const cancel = () => {
  reset();
  emit('update:visible', false);
};

watch(
  () => props.visible,
  (val) => {
    if (!val) return;
    getCode();
  }
);

const smsInfo = reactive({
  timer: null,
  count: 0,
  showSend: true
});
const endTime = 30;
const getSmsCodeLocal = () => {
  const oldSmsTime: number = Number(localStorage.getItem('smscode')) ?? 0;
  if (oldSmsTime === 0) {
    return 0;
  } else {
    const time = Math.floor((new Date().getTime() - oldSmsTime) / 1000);
    if (time >= 30) {
      return 0;
    } else {
      return endTime - time;
    }
  }
};

const getSms = async () => {
  if (!changeForm.imgCode) {
    proxy?.$modal.msgWarning('请填写图形验证码!');
    return;
  }

  if (!changeForm.newTelephone) {
    proxy?.$modal.msgWarning('请填写新手机号码!');
    return;
  }

  smsInfo.count = getSmsCodeLocal();
  // 后期做到session中
  if (smsInfo.count === 0) {
    const res = await smsCode({
      imgCode: changeForm.imgCode,
      phonenumber: changeForm.newTelephone
    });
    localStorage.setItem('smscode', new Date().getTime().toString());
    proxy?.$modal.msgSuccess('发送成功');

    // 验证码倒计时
    smsInfo.count = endTime;
    smsInfo.showSend = false;
    let timer = setInterval(() => {
      if (smsInfo.count > 0 && smsInfo.count <= endTime) {
        smsInfo.count = getSmsCodeLocal();
      } else {
        smsInfo.showSend = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};
</script>
<style scoped lang="scss">
.login-code {
  width: 33%;
  height: 35px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.login-code-img {
  height: 35px;
  padding-left: 12px;
}
</style>
