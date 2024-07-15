export interface TableVO extends BaseEntity {
  id: number;
  brandName: string; //车辆品牌
  vin: string; //车架号码
  licensePlate: string; //车牌号码
  projectType: string; //项目类型
  productBrandName: string; //产品品牌
  productName: string; //保养产品
  currentNum: string; //保养记录
  planDate: string; //计划保养日期
  state: string; //保养状态
  orderNo: string; //订单编号
}

export interface FormData {
  id: number | undefined;
  brandName: string; //车辆品牌
  vin: string; //车架号码
  licensePlate: string; //车牌号码
  projectType: string; //项目类型
  productBrandName: string; //产品品牌
  productName: string; //保养产品
  currentNum: string; //保养记录
  planDate: string; //计划保养日期
  state: string; //保养状态
  orderNo: string; //订单编号
}

export interface TableQuery extends PageQuery {
  brandName?: string; //车辆品牌
  vin?: string; //车架号码
  brandId?: string; //车牌号码
  productId?: number; //产品名称
  planDate?: string; //计划日期
  state?: string; //保养状态
}
