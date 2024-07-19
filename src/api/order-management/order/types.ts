export interface TableVO extends BaseEntity {
  id: string;
  label: string;
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  typeLabel?: string; // 订单类型
  orderNo?: string; // 订单编号
  carBrandLabel?: string; // 车辆品牌
  vin?: string; // 车架号码
  licensePlate?: string; // 车牌号码
  projectTypeLabel?: string; // 项目类型
  productBrandLabel?: string; // 产品品牌
  productIdLabel?: string; // 订单产品
  isFlowLabel?: string; // 订单施工
  stateLabel?: string; // 订单状态
  commPrice?: string; // 订单提成
  updateBy?: string; // 订单更新时间
  orderPrice?: string; // 订单价格
  realityPrice?: string; // 实际支付
  payState?: string; // 支付状态
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
}

export interface OrderForm {
  id: string | undefined;
  noValue: any;
  type: string; // 订单类型
  projectType: string; // 项目类型
  carManageId: number; // 选择车辆
  brandId: string; // 产品名称
  productId: string; // 选择产品
  orderPrice: number; // 订单价格
  remarks: string; // 备注
}

export interface OrderBoForm {}
