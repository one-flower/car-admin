export interface TableVO extends BaseEntity {
  id: string;
  brandName: string; // 车辆品牌
  vin: string; // 车架号码
  licensePlate: string; // 车牌号码
  projectType: string; // 项目类型
  productBrandName: string; // 产品品牌
  productName: string; // 产品名称
  startDate: string; // 质保开始
  endDate: string; // 质保结束
  state: string; // 质保状态
  updateTime: string; // 更新时间
}

export interface FormData {
  id: string | undefined;
  customId?: string;
  customNo: string;
  tagIdLabel: string;
  nickname: string;
  telephone: string;
  channel: string;
  totalMoney: string;
}

export interface TableQuery extends PageQuery {
  projectType?: string; // 项目类型
  vin?: string; // 车架号码
  licensePlate?: string; // 车牌号码
  productBrandId?: string; // 产品品牌
  productId?: string; // 产品名称
  startDate?: string; // 质保开始
  endDate?: string; // 质保结束
  state?: string; // 质保状态

  customId?: string;
}
