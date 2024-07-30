interface CustomIdObj {
  totalMoney: string;
  channel: string;
  customNo: string;
  giveBalance: string;
  id: string;
  nickname: string;
  remarks: string;
  tagId: string;
  tagIdLabel: string;
  telephone: string;
}

export interface TableVO extends BaseEntity {
  isCommissionLabel: any;
  id: string;
  typeLabel: string; // 订单类型
  orderNo: string; // 订单编码
  carBrandLabel: string; // 车辆品牌
  vin: string; // 车架号码
  licensePlate: string; // 车牌号码
  projectTypeLabel: string; // 项目类型
  productBrandLabel: string; // 产品品牌
  productIdLabel: string; // 订单产品
  isFlow: string; // 订单施工
  isFlowLabel: string; // 订单施工
  stateLabel: string; // 订单状态
  commPrice: number; // 提成价格
  orderPrice: number; // 订单价格
  realityPrice: string; // 实际支付
  payStateLabel: string; // 支付状态
  remarks: string;
  customIdObj: CustomIdObj; // 客户信息
  directorLabel: string; //负责人
  isCommission: string; // 订单提成
  commDistriLabel: string; // 订单提成
  payState: 'PROMPTLY_PAY' | 'LATER_ON_PAY'; // 订单支付
  payTypeLabel: string; // 订单支付
  accountPrice: string; // 账户支付
  cashPrice: string; // 现金支付
  orderLogObj: any[]; //日志
  constructionTeam: string; //作业团队label
  state: OrderState;
  orderLogList: any;
  commExtObj: any; // 员工详情
}

export type OrderState =
  'WAIT_CONSTRUCTED'
  | 'DURING_CONSTRUCTION'
  | 'CONSTRUCTED_COMPLETE'
  | 'WAIT_DELIVERED'
  | 'ORDER_COMPLETED'
  | 'CANCEL_ORDER';

export interface FormData {
  id: string | undefined;

  typeLabel: string; // 订单类型
  orderNo: string; // 订单编号
  carBrandLabel: string; // 车辆品牌
  vin: string; // 车架号码
  licensePlate: string; // 车牌号码
  projectTypeLabel: string; // 项目类型
  productBrandLabel: string; // 产品品牌
  productIdLabel: string; // 订单产品
  isFlowLabel: string; // 订单施工
  stateLabel: string; // 订单状态
  commPrice: string; // 提成价格
  updateBy: string; // 订单更新时间
  orderPrice?: number; // 订单价格
  realityPrice?: string; // 实际支付
  payState: string; // 支付状态
}

export interface TableQuery extends PageQuery {
  type?: string; // 订单类型
  projectType?: string; // 项目类型
  orderNo?: string; // 订单编号
  vin?: string; // 车架号码
  licensePlate?: string; // 车牌号码
  label?: string; // 产品名称
  createTime?: string; // 订单时间
  commState?: string; // 订单状态
  isCommission?: string; // 订单提成
  payState?: string; // 支付状态
  orderState?: string; // 订单状态
  commDistri?: 'AVERAGE' | 'CUSTOM'; // 提成分配
  productBrandId?: string; //产品品牌
  directorId?: string; // 负责人
  customId?: string; // 客户id
}

export interface OrderForm {
  id: string | undefined;
  type: 'SERVER' | 'MAINTAIN' | 'CROSS_STORE'; // 订单类型
  typeLabel: string;
  projectType: string; // 项目类型
  projectTypeLabel: string;
  carManageId: number | undefined; // 选择车辆
  productBrandId: string; // 产品品牌
  productBrandIdLabel: string; //
  productId: string; // 选择产品
  productLabel: string; //产品全称
  orderPrice: number; // 订单价格
  remarks: string; // 备注
  directorId: number | undefined; // 负责人
  workTeam: number[]; // 作业团队
  isFlow: string; // 订单施工
  isCommission: string; // 订单提成
  commPrice: number; // 提成价格
  commDistri: 'AVERAGE' | 'CUSTOM'; // 提成分配
  orderPayType: 'PROMPTLY_PAY' | 'LATER_ON_PAY'; //订单支付
  accountPrice: number; //账户支付
  cashPrice: number; //现金支付
  payChannel: string; //支付渠道
}

export interface OrderDesc {
  typeLabel: string; //订单类型
  projectTypeLabel: string; //项目类型
  productBrandIdLabel: string; //品牌名称
  orderPrice: number; //订单价格
  carBrandLabel: string; //订单车辆
  nickname: string; //客户昵称
  telephone: string; //预留电话
  tagIdLabel: string; //客户标签
  totalMoney: string; //账户余额
}

export interface ConfigPayDesc {
  directorIdLabel: string; //负责人
  workTeamLabel: string; //作业团队
  isFlow: string; //订单施工
  isFlowLabel: string; //订单施工
  isCommission: string; // 订单提成
  isCommissionLabel: string; //
  commDistriLabel: string; // 提成分配
  commPrice: number; // 提成价格
  orderPayType: 'PROMPTLY_PAY' | 'LATER_ON_PAY'; // 订单出伏
  orderPayTypeLabel: string; //
  accountPrice: number | string; // 账户余额
  cashPrice: number | string; // 现金支付
  realityPrice: string; // 最终支付
  remarks: string;
}

export interface payForm {
  orderId: number;
  accMoney: number;
  cashMoney: number;
  payChannel?: string;
  remarks?: string;
}

export interface commExtTableVO extends BaseEntity {
  id: string;
  projectTypeLabel: string; //项目类型
  productBrandIdLabel: string; //产品品牌id
  name: string; //产品名称
  model: string; //产品型号
  price: number; //定价
  warranty: number; //质保
  frequency: number; //频率
  isCrossStoreLabel: string; //跨店
  totalMoney: number; //总金额
}

export interface commExtFormData {
  id: string | undefined;
  projectType: string; //订单类型
  orderNo: string; //订单编号
  projectTypeLabel: string; //项目类型
  productBrandLabel: string; //产品品牌
  productIdLabel: number; //订单产品
  createTime: string; //订单创建时间
  commPrice: number; //订单提成
  constructionTeam: string; //作业团队
  personalCommPrice: number; //个人提成
  commDistri: string; //提成方式
  commState: string; //分配状态
}

export interface commExtTableQuery extends PageQuery {
  id: string;
  type?: string; //订单类型
  projectType?: string; //项目类型
  createTime?: string; //订单时间
  commDistri?: string; //提成方式
  commState?: string; //分配状态
}
