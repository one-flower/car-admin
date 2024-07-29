<template>
  <el-descriptions title="车辆信息" :column="2" border>
    <el-descriptions-item v-if="basicData.id" label="vin" :span="2">
      {{ basicData.vin }}
    </el-descriptions-item>
    <el-descriptions-item label="车辆品牌"> {{ basicData.brandIdLabel }} </el-descriptions-item>
    <el-descriptions-item label="车辆厂商"> {{ basicData.manufacturer }} </el-descriptions-item>
    <el-descriptions-item label="车辆系列"> {{ basicData.typename }} </el-descriptions-item>
    <el-descriptions-item label="车辆型号"> {{ basicData.module }} </el-descriptions-item>
    <el-descriptions-item label="车辆级别"> {{ basicData.sizetype }} </el-descriptions-item>
    <el-descriptions-item label="车身结构"> {{ basicData.bodytype }} </el-descriptions-item>
    <el-descriptions-item label="驱动方式"> {{ basicData.drivemode }} </el-descriptions-item>
    <el-descriptions-item label="能源类型"> {{ basicData.fueltype }} </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
const props = defineProps({
  basicData: {
    type: Object,
    default: () => {}
  }
});
</script>
<style scoped lang="scss"></style>
