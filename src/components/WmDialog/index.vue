<template>
  <el-dialog v-bind="$attrs" :title="title" :width="width" append-to-body v-on="$attrs" @before-close="onCancel">
    <slot name="default"></slot>
    <template #footer>
      <span>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:visiable', 'cancel', 'submit']);
const props = defineProps({
  visiable: { type: Boolean, default: false, required: true },
  title: { type: String, default: '提示' },
  width: { type: String, default: '700px' }
});

const show = ref(false);

const onCancel = () => {
  emit('cancel');
};

const onSubmit = () => {
  emit('submit');
};
</script>
<style scoped lang="scss"></style>
