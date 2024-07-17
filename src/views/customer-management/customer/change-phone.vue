<template>
  <el-dialog :model-value="visible" title="更换手机号" width="600px" append-to-body>
    <el-form ref="FormDataRef" v-loading="loading" :model="changeForm" :rules="rules" label-width="100px" @submit.prevent>
      <el-form-item label="客户编号"> {{ targetInfo.customNo }} </el-form-item>
      <el-form-item label="客户标签"> {{ targetInfo.tagId }} </el-form-item>
      <el-form-item label="客户昵称"> {{ targetInfo.nickname }} </el-form-item>
      <el-form-item label="绑定状态"> {{ '未绑定' }} </el-form-item>
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
          <el-button type="primary" size="default" style="margin-left: 10px" @click="getSms">{{
            smsInfo.showSend ? '获取验证码' : smsInfo.count
          }}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div style="background-color: #fdf6ec; color: #e6a23c; padding: 10px">
      <p>更换手机号说明！</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;1. 同时更新客户多终端手机号；</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;2. 更新成功后，公众号无需重新登记，小程序请使用新手机号重新登录；</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { customEditTelephone, authCode, smsCode } from '@/api/customer-management/customer';
import { PhoneForm, PhoneData, ChangePhoneForm } from '@/api/customer-management/customer/types';
import { PropType } from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emit = defineEmits(['update:visible', 'update:form']);
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
const changeForm = reactive<ChangePhoneForm>({});
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
  Object.assign(changeForm, {});
  FormDataRef.value?.resetFields();
};

const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await customEditTelephone(changeForm);
      proxy?.$modal.msgSuccess('操作成功');
      emit('update:visible', false);
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
    changeForm.oldoldTelephone = val.telephone;
  }
);

const smsInfo = reactive({
  timer: null,
  count: 0,
  showSend: true
});
const getSms = () => {
  // 后期做到session中
  if (smsInfo.count === 0) {
    const res = smsCode({ phonenumber: targetInfo.telephone });
    if (res.data === null) return;
    // 验证码倒计时
    smsInfo.count = 60;
    smsInfo.showSend = false;
    let timer = setInterval(() => {
      if (smsInfo.count > 0 && smsInfo.count <= 60) {
        smsInfo.count--;
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
