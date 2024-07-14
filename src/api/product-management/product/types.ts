export interface TableVO extends BaseEntity {
  id: string;
  projectTypeLabel: string; //项目类型
  productBrandIdLabel: string; //产品品牌id
  name: string; //产品名称
  model: string; //产品型号
  price: number; //定价
  warranty: number; //质保
  frequency: number; //频率
  isCrossStoreLabel: string; //跨店
}

export interface FormData {
  id: string | undefined;
  projectType: string; //项目类型
  productBrandId: string; //产品品牌
  name: string; //产品名称
  model: string; //产品型号
  price: number; //产品定价
  isWarranty: string; //质保服务
  warranty: number; //质保周期
  isFrequency: string; //保养服务
  frequency: number; //保养频率
  isCrossStore: string; //跨店保养
  remarks: string;
}

export interface TableQuery extends PageQuery {
  projectType?: string; //项目类型
  productBrandId?: string; //产品品牌id
  name?: string; //产品名称
  model?: string; //产品型号
}
