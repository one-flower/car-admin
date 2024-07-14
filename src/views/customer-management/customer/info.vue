<template>
  <el-dialog :model-value="visible" title="客户档案" width="600px" append-to-body @close="handleCancel">
    <div class="mb10">
      <el-descriptions class="margin-top" title="客户信息" :column="2" border>
        <el-descriptions-item label="客户编号" min-width="100" column="2"> {{ targetInfo.customNo }} </el-descriptions-item>
        <el-descriptions-item label="客户标签" min-width="100"> {{ targetInfo.tagIdLabel }} </el-descriptions-item>
        <el-descriptions-item label="客户昵称" min-width="100"> {{ targetInfo.nickname }} </el-descriptions-item>
        <el-descriptions-item label="手机号码" min-width="100"> {{ targetInfo.telephone }} </el-descriptions-item>
        <el-descriptions-item label="客户来源" min-width="100"> {{ targetInfo.channel }} </el-descriptions-item>
        <el-descriptions-item label="账户余额" min-width="100"> {{ targetInfo.accountBalance }} </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- <el-descriptions class="margin-top" title="个人信息" :column="2" border>
      <el-descriptions-item label="数据来源" min-width="100" column="2"> {{}} </el-descriptions-item>
      <el-descriptions-item label="注册时间" min-width="100"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户姓名" min-width="100"> {{}} </el-descriptions-item>
      <el-descriptions-item label="客户性别" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="出生日期" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="常驻地址" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="公众号关注" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="最后更新时间" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="小程序注册" min-width="100"> {{}} 元</el-descriptions-item>
      <el-descriptions-item label="上次登录时间" min-width="100"> {{}} 元</el-descriptions-item>
    </el-descriptions> -->
    <!-- <div class="mb10">
      <el-descriptions class="margin-top" title="车辆信息" :column="2" border></el-descriptions>
      <el-table v-loading="data.loading" :data="data.tableData" tooltip-effect="dark myTooltips">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="客户编号" align="center" prop="customNo" />
        <el-table-column label="客户标签" align="center" prop="tagIdLabel" />
        <el-table-column label="手机号码" align="center" prop="telephone" />
        <el-table-column label="客户昵称" align="center" prop="nickname" />
        <el-table-column label="账户余额" align="center" prop="accountBalance" />
        <el-table-column label="绑定状态" align="center" prop="" />
        <el-table-column label="操作" width="220" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="账户充值" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click=""></el-button>
            </el-tooltip>
            <el-tooltip content="更换号码" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleChangePhone(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tableAttr.total > 0"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        :total="tableAttr.total"
        @pagination="getTableData"
      />
    </div> -->
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
import { PhoneForm, PhoneData, ChangePhoneForm, FormData } from '@/api/customer-management/customer/types';
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
    type: Object as PropType<FormData>,
    default: () => {
      return {};
    },
    required: true
  }
});

type Data = {
  loading: boolean;
  queryParams: any;
  tableData: any;
};
const data = reactive<Data>({
  loading: false,
  queryParams: {},
  tableData: []
});

const getTableData = async () => {
  loading.value = true;
  const res = await customList(queryParams.value);
  data.tableData = res.rows;
  data.queryParams.total = res.total;
  loading.value = false;
};

const handleCancel = () => {
  reset();
  emit('update:visible', false);
};

const init = () => {};
watch(
  () => props.visible,
  (val) => {},
  { deep: true }
);
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
