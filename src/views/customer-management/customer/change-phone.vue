<template>
  <el-dialog :model-value="visible" title="更换手机号" width="600px" append-to-body>
    <el-form ref="FormDataRef" :model="form" :rules="rules" label-width="100px" @submit.prevent>
      <el-form-item label="客户编号"> {{ form.customNo }} </el-form-item>
      <el-form-item label="客户标签"> {{ form.tagId }} </el-form-item>
      <el-form-item label="客户昵称"> {{ form.nickname }} </el-form-item>
      <el-form-item label="绑定状态"> {{}} </el-form-item>
      <el-form-item label="手机号码"> {{ form.telephone }} </el-form-item>
      <el-form-item label="新手机号码" prop="tagId">
        <el-input v-model="form.telephone" placeholder="请输入手机号码" clearable />
      </el-form-item>
      <!-- <el-form-item label="图像验证码" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入客户昵称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="短信验证码" prop="telephone" v-if="form.id === undefined">
        <el-input v-model="form.telephone" placeholder="请输入手机号码" clearable @keyup.enter="handleQuery" />
      </el-form-item> -->
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
import { customEditTelephone } from '@/api/customer-management/customer';
import { PhoneForm, PhoneData } from '@/api/customer-management/customer/types';
import { PropType } from 'vue';

const emit = defineEmits(['update:visible', 'update:form']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  form: {
    type: Object as PropType<PhoneForm>,
    default: false,
    required: true
  }
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const rules = {
  tagId: [{ required: true, message: '客户标签不能为空', trigger: ['blur', 'change'] }],
  nickname: [{ required: true, message: '客户昵称不能为空', trigger: 'blur' }],
  telephone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
  channel: [{ required: true, message: '渠道来源不能为空', trigger: ['blur', 'change'] }]
};

const submitForm = () => {
  emit('update:visible', false);
};

const cancel = () => {
  emit('update:visible', false);
};
</script>
<style scoped lang="scss"></style>
