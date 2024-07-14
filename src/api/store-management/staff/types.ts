export interface TableVO extends BaseEntity {
  id: string;
  cardNum: string; //身份证号
  configPostId: number; //员工岗位
  configPostIdLabel: string;
  entryTime: string; //入职日期
  firstNum: number;
  gender: string; //性别
  name: string; //员工名称
  remarks: string; //备注
  snapshot: string; //员工简介
  staffCardUrl: string; //员工名片
  staffCode: string; //员工编号
  state: string; //在职状态
  stateLabel: string;
  telephone: string; //联系电话
}

export interface FormData {
  id: string | undefined;
  staffCode: string; //员工编号
  name: string; //员工名称
  configPostId: number | undefined; //员工岗位
  configPostIdLabel?: string;
  gender: string; //性别
  genderLabel?: string;
  cardNum: string; //身份证号
  telephone: string; //联系电话
  entryTime: string; //入职日期
  state: string; //在职状态
  stateLabel?: string;
  snapshot: string; //员工简介
  staffCardUrl: string; //员工名片
  remarks: string; //备注
}

export interface TableQuery extends PageQuery {
  configPostId?: number; //员工岗位
  entryTime?: string; //入职日期
  gender?: string; //性别
  name?: string; //员工名称
  staffCode?: string; //员工编号
  telephone?: string; //联系电话
  state?: string; //在职状态
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
