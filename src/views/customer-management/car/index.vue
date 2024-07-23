<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="data.queryParams" :inline="true" @submit.prevent>
            <el-form-item label="车辆品牌" prop="brandId">
              <el-select v-model="data.queryParams.brandId" placeholder="请选择车辆品牌" clearable filterable>
                <el-option v-for="item in dictObj.clyhBrand__clyhBrand" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆厂商" prop="manufacturer">
              <el-input v-model="data.queryParams.manufacturer" placeholder="请输入车辆厂商" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车辆系列" prop="typename">
              <el-input v-model="data.queryParams.typename" placeholder="请输入车辆系列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车辆型号" prop="module">
              <el-input v-model="data.queryParams.module" placeholder="请输入车辆型号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车架号码" prop="vin">
              <el-input v-model="data.queryParams.vin" placeholder="请输入车架号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="licensePlate">
              <el-input v-model="data.queryParams.licensePlate" placeholder="请输入车辆号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户昵称" prop="customNickname">
              <el-input v-model="data.queryParams.customNickname" placeholder="请输入客户昵称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="电话号码" prop="customtelephone">
              <el-input v-model="data.queryParams.customtelephone" placeholder="请输入电话号码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:add']" type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-hasPermi="['system:post:remove']" type="danger" plain icon="Delete" :disabled="tableAttr.multiple" @click="handleDelete()">
              删除
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @query-table="getTableData"></right-toolbar>
        </el-row>
      </template>
      <el-table v-loading="loading" :data="tableData" tooltip-effect="dark myTooltips" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="车辆品牌" align="left" prop="brandIdLabel" width="100" />
        <el-table-column label="车辆号码" align="left" prop="licensePlate" width="100" />
        <el-table-column label="车架号码" align="left" prop="vin" show-overflow-tooltip />
        <el-table-column label="车辆厂商" align="left" prop="manufacturer" show-overflow-tooltip />
        <el-table-column label="车辆系列" align="left" prop="typename" show-overflow-tooltip />
        <el-table-column label="车辆型号" align="left" prop="module" />
        <el-table-column label="车辆状态" align="left" prop="carStateLabel" />
        <el-table-column label="客户昵称" align="left" prop="nickname">
          <template #default="{ row }">{{ row.customIdObj?.nickname }}</template>
        </el-table-column>
        <el-table-column label="电话号码" align="left" prop="telephone" show-overflow-tooltip>
          <template #default="{ row }">{{ row.customIdObj?.telephone }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-tooltip content="装配情况" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link @click="handleFabricate(row)">
                <svg-icon class-name="search-icon" icon-class="car-change" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="订单记录" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link @click="handleOrderLog(row)">
                <svg-icon class-name="search-icon" icon-class="order-log"
              /></el-button>
            </el-tooltip>
            <el-tooltip content="变更车主" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link @click="handleUser(row)">
                <svg-icon class-name="search-icon" icon-class="car-user-change"
              /></el-button>
            </el-tooltip>
            <el-tooltip :content="row.carState === '0' ? '启用' : '禁用'" placement="top">
              <el-button v-hasPermi="['system:post:detail']" link type="info" @click="handleState(row)">
                <svg-icon class-name="search-icon" :icon-class="row.carState === '0' ? 'open' : 'close'" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button v-hasPermi="['system:post:edit']" link type="primary" icon="Edit" @click="handleUpdate(row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button v-hasPermi="['system:post:remove']" link type="danger" icon="Delete" @click="handleDelete(row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="tableAttr.total > 0"
        v-model:page="data.queryParams.pageNum"
        v-model:limit="data.queryParams.pageSize"
        :total="tableAttr.total"
        @pagination="getTableData"
      />
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" append-to-body>
      <el-form ref="FormDataRef" :model="data.form" :rules="data.rules" label-width="80px" @submit.prevent>
        <template v-if="data.form.id">
          <el-form-item label="车主昵称" prop="customId">{{ data.form.customIdObj?.nickname }} </el-form-item>
          <el-form-item label="预留电话" prop="customId"> {{ data.form.customIdObj?.telephone }}</el-form-item>
        </template>
        <template v-else>
          <el-form-item label="选择车主" prop="customId">
            <el-select v-model="data.form.customId" placeholder="请选择车主" clearable filterable>
              <el-option v-for="item in dictObj.customList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="车辆归属" prop="toType">
          <el-radio-group v-model="data.form.toType">
            <el-radio v-for="item in oldDictObj.clyh_to_type" :key="item.key" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆品牌" prop="brandId">
          <el-select v-model="data.form.brandId" placeholder="请选择车辆品牌" clearable filterable>
            <el-option v-for="item in dictObj.clyhBrand__clyhBrand" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌情况" prop="licensePlateState">
          <el-radio-group v-model="data.form.licensePlateState">
            <el-radio v-for="item in oldDictObj.clyh_license_plate_state" :key="item.key" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="data.form.licensePlateState === '0'">
          <template #label>
            <div class="carNoLabel">车辆号牌</div>
          </template>
          <div class="cardNo">
            <el-form-item prop="licenseProvince">
              <el-select v-model="data.form.licenseProvince" placeholder="京" clearable filterable class="cardNo--province">
                <el-option v-for="item in dictObj.carProvince" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="licenseOrg">
              <el-select v-model="data.form.licenseOrg" placeholder="A" clearable filterable class="cardNo--city">
                <el-option v-for="item in dictObj.carCity" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="licenseNum">
              <el-input v-model="data.form.licenseNum" placeholder="请输入内容" class="cardNo--number" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="车辆照片" prop="imgUrls">
          <image-upload v-model="data.form.imgUrls"></image-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="data.form.remarks" type="textarea" maxlength="255" show-word-limit row="auto" placeholder="请输入内容" />
        </el-form-item>
        <template v-if="!(data.form.id && data.form.manufacturer != '')">
          <el-form-item label="信息补全" prop="infoCompletion">
            <el-radio-group v-model="data.form.infoCompletion" :disabled="data.form.id && data.form.manufacturer != ''">
              <el-radio v-for="item in oldDictObj.clyh_info_completion" :key="item.key" :label="item.label" :value="item.value" />
            </el-radio-group>
          </el-form-item>
          <template v-if="data.form.infoCompletion === '1'">
            <el-form-item label="车架号码" prop="vin">
              <el-input v-model="data.form.vin" row="auto" placeholder="请输入内容" :disabled="data.form.id && data.form.manufacturer != ''">
                <template #append>
                  <el-button type="primary" :disabled="data.form.id && data.form.manufacturer != ''" @click="handleVinInfo">查询</el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </template>
        <el-descriptions v-if="data.form.manufacturer" title="车辆信息" :column="2" border>
          <el-descriptions-item label="车辆品牌"> {{ data.form.brandIdLabel }} </el-descriptions-item>
          <el-descriptions-item label="车辆厂商"> {{ data.form.manufacturer }} </el-descriptions-item>
          <el-descriptions-item label="车辆系列"> {{ data.form.typename }} </el-descriptions-item>
          <el-descriptions-item label="车辆型号"> {{ data.form.module }} </el-descriptions-item>
          <el-descriptions-item label="车辆级别"> {{ data.form.sizetype }} </el-descriptions-item>
          <el-descriptions-item label="车身结构"> {{ data.form.bodytype }} </el-descriptions-item>
          <el-descriptions-item label="驱动方式"> {{ data.form.drivemode }} </el-descriptions-item>
          <el-descriptions-item label="能源类型"> {{ data.form.fueltype }} </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 车辆装配 -->
    <CarFabricate v-model:visible="fabricateInfo.visible" :title="fabricateInfo.title" :basic-data="fabricateInfo.data"> </CarFabricate>

    <!-- 订单记录 -->
    <order-log-item v-model:visible="orderLogInfo.visible" :target-info="orderLogInfo.data"></order-log-item>

    <!-- 变更车主,后续分页 -->
    <el-dialog v-model="userInfo.visible" :title="userInfo.title" width="600px" append-to-body>
      <el-descriptions title="车辆信息" :column="2" border class="mb10">
        <el-descriptions-item label="车辆归属"> {{ userInfo.data.toTypeLabel }} </el-descriptions-item>
        <el-descriptions-item label="车牌号码"> {{ userInfo.data.licensePlate }} </el-descriptions-item>
        <el-descriptions-item label="车辆品牌"> {{ userInfo.data.brandIdLabel }} </el-descriptions-item>
        <el-descriptions-item label="车辆厂商"> {{ userInfo.data.manufacturer }} </el-descriptions-item>
        <el-descriptions-item label="车辆系列"> {{ userInfo.data.typename }} </el-descriptions-item>
        <el-descriptions-item label="车辆型号"> {{ userInfo.data.model }} </el-descriptions-item>
        <el-descriptions-item label="车辆级别"> {{ userInfo.data.sizetype }} </el-descriptions-item>
        <el-descriptions-item label="车身结构"> {{ userInfo.data.bodytype }} </el-descriptions-item>
        <el-descriptions-item label="驱动方式"> {{ userInfo.data.drivemode }} </el-descriptions-item>
        <el-descriptions-item label="能源类型"> {{ userInfo.data.fueltype }} </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2"> {{ userInfo.data.remarks }} </el-descriptions-item>
        <el-descriptions-item label="车辆照片" :span="2">
          <image-preview :height="100" :src="userInfo.data.imgUrls" :preview-src-list="[userInfo.data.imgUrls]"></image-preview>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="原车主信息" :column="2" border class="mb10">
        <el-descriptions-item label="车主昵称"> {{ userInfo.data.customIdObj.nickname }} </el-descriptions-item>
        <el-descriptions-item label="预留电话"> {{ userInfo.data.customIdObj.telephone }} </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="新车主" :column="2" border></el-descriptions>
      <el-form ref="UserFormRef" :model="userInfo.data" :rules="userRules" label-width="80px" @submit.prevent>
        <el-form-item label="选择车主" prop="newCustomId">
          <el-select v-model="userInfo.data.newCustomId" placeholder="请选择车主" clearable filterable>
            <el-option v-for="item in userInfo.customList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更原因" prop="reason">
          <el-input v-model="userInfo.data.reason" type="textarea" maxlength="255" show-word-limit row="auto" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="userSubmit">确 定</el-button>
          <el-button @click="userCanecl">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="carManage" lang="ts">
import {
  carManageList,
  carManageAdd,
  carManageDel,
  carManageInfo,
  carManageUp,
  carManageDropdown,
  vinInfo,
  carManageEditCusetom
} from '@/api/customer-management/car';
import { FormData, TableQuery, TableVO } from '@/api/customer-management/car/types';
import { carProvince, carCity } from '@/utils/static-dict';
import CarFabricate from '@/components/car-fabricate/index.vue';
import OrderLogItem from './order-log/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const dictObj = toReactive<any>(proxy?.useNewDict('clyhBrand__clyhBrand', 'dictEnum__carState'));
const oldDictObj = toReactive<any>(proxy?.useDict('clyh_to_type', 'clyh_license_plate_state', 'clyh_info_completion'));

dictObj.carProvince = carProvince;
dictObj.carCity = carCity;

const tableData = ref<TableVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const tableAttr = reactive<TableAttr>({
  ids: [],
  multiple: true,
  total: 0
});

const queryFormRef = ref<ElFormInstance>();

const pageTitle = '车辆信息';
const FormDataRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: FormData = {
  id: undefined,
  customId: '',
  toType: '0',
  brandId: '',
  licensePlateState: '0',
  licenseProvince: '',
  licenseOrg: '',
  licenseNum: '',
  licenseBit: '',
  licensePlate: '',
  imgUrls: '',
  remarks: '',
  infoCompletion: '0', // 信息补全
  carState: '1',
  vin: '',
  manufacturer: '',
  typename: '',
  module: '',
  sizetype: '',
  bodytype: '',
  drivemode: '',
  fueltype: '',
  brandIdLabel: ''
};
const data = reactive<PageData<FormData, TableQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    brandId: '',
    manufacturer: '',
    typename: '',
    model: '',
    vin: '',
    licensePlate: ''
  },
  rules: {
    customId: [{ required: true, message: '选择车主不能为空', trigger: ['blur', 'change'] }],
    toType: [{ required: true, message: '车辆归属不能为空', trigger: 'change' }],
    licensePlateState: [{ required: true, message: '车辆品牌不能为空', trigger: ['blur', 'change'] }],
    licenseProvince: [{ required: true, message: '不能为空', trigger: 'change' }],
    licenseOrg: [{ required: true, message: ' 不能为空', trigger: 'change' }],
    licenseNum: [
      { required: true, message: ' 不能为空', trigger: 'blur' },
      { message: '请填写真实车牌', type: 'string', min: 5, max: 6, trigger: 'blur' }
    ],
    infoCompletion: [{ required: true, message: '信息补全不能为空', trigger: 'change' }],
    vin: [
      { required: true, message: '车架号码不能为空', trigger: 'change' },
      { message: '请填写17位车架号码', len: 17, trigger: 'blur' }
    ]
  }
});

/** 查询列表 */
const getTableData = async () => {
  loading.value = true;
  const res = await carManageList(data.queryParams);
  tableData.value = res.rows;
  tableAttr.total = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  data.form = { ...initFormData };
  FormDataRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  data.queryParams.pageNum = 1;

  getTableData();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  data.queryParams.pageNum = 1;

  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: TableVO[]) => {
  tableAttr.ids = selection.map((item) => item.id);
  tableAttr.multiple = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = `添加${pageTitle}`;
};

/** 启用禁用 */
const handleState = async (row?: TableVO) => {
  const title = row.carState === '0' ? '启用' : '禁用';
  const state = row.carState === '0' ? '1' : '0';
  await proxy?.$modal.confirm(`是否${title}？`);
  await carManageUp({ ...row, carState: state });
  row.carState = state;
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TableVO) => {
  reset();
  const ids = row?.id || tableAttr.ids[0];
  const res = await carManageInfo(ids);
  data.form = res.data;
  dialog.visible = true;
  dialog.title = `修改${pageTitle}`;
};

// 查询车架号码
const handleVinInfo = async () => {
  if (!data.form.vin) {
    proxy?.$modal.msgError('请输入车架号码');
    return;
  }
  const res = await vinInfo(data.form.vin);
  delete res.data.brandId;
  data.form = res.data;
};
/** 提交按钮 */
const submitForm = () => {
  FormDataRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      data.form.id ? await carManageUp(data.form) : await carManageAdd(data.form);
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getTableData();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TableVO) => {
  const ids = row?.id || tableAttr.ids;
  await proxy?.$modal.confirm('是否删除选中项？');
  await carManageDel(ids);
  await getTableData();
  proxy?.$modal.msgSuccess('删除成功');
};

// 车辆装配
const fabricateInfo = reactive({
  visible: false,
  title: '车辆装配',
  data: <any>{}
});
const handleFabricate = async (row: TableVO) => {
  fabricateInfo.data = row;
  fabricateInfo.visible = true;
};

// 订单记录
const orderLogInfo = reactive({
  visible: false,
  title: '订单记录',
  data: {}
});
const handleOrderLog = async (row: TableVO) => {
  orderLogInfo.data = row;
  orderLogInfo.visible = true;
};

// 变更车主
const UserFormRef = ref<ElFormInstance>();
type UserInfo = {
  visible: boolean;
  title: string;

  data: any;
  customList: any;
};
const userInfo = reactive<UserInfo>({
  visible: false,
  title: '变更车主',

  data: {},
  customList: []
});
const userRules = {
  newCustomId: [{ required: true, message: '变成车主不能为空', trigger: ['blur', 'change'] }],
  reason: [{ required: true, message: '变更原因不能为空', trigger: ['blur', 'change'] }]
};
const UserReset = () => {
  userInfo.data = {};
  UserFormRef.value?.resetFields();
};
const handleUser = async (row: any) => {
  UserReset();
  const res = await carManageInfo(row?.id);
  try {
    delete res.data.customIdObj.id;
    delete res.data.customId;
  } catch (error) {
    console.log('handeleUsr error:' + error);
  }
  userInfo.data = res.data;

  userInfo.customList = dictObj.customList.filter((item: any) => {
    return item.id !== res.data.customIdObj.id;
  });

  userInfo.visible = true;
};
const userSubmit = () => {
  UserFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await carManageEditCusetom({
        id: userInfo.data.id,
        brandId: userInfo.data.brandId,
        licensePlateState: userInfo.data.licensePlateState,
        toType: userInfo.data.toType,
        imgUrls: userInfo.data.imgUrls,
        vin: userInfo.data.vin,
        infoCompletion: userInfo.data.infoCompletion,
        customId: userInfo.data.customId
      });
      proxy?.$modal.msgSuccess('操作成功');
      userInfo.visible = false;
      await getTableData();
    }
  });
};
const userCanecl = async () => {
  userInfo.visible = false;
};

const init = async () => {
  dictObj.customList = await carManageDropdown();
  getTableData();
};

init();
</script>
<style lang="scss" scoped>
.carNoLabel::before {
  color: var(--el-color-danger);
  content: '*';
  margin-right: 4px;
}
.cardNo {
  display: flex;
  &--city {
    width: 80px;
  }
  &--province {
    width: 80px;
  }
  &--number {
    flex: 1;
  }
}
</style>
