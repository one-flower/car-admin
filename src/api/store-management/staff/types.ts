export interface TableVO extends BaseEntity {
  id: string;
  cardNum: string; //身份证号
  configPostId: number; //员工岗位
  entryTime: string; //入职日期
  firstNum?: number;
  gender: string; //性别
  name: string; //员工名称
  remarks?: string; //备注
  snapshot: string; //员工简介
  staffCardUrl: string; //员工名片
  staffCode?: string; //员工编号
  state: string; //在职状态
  telephone: string; //联系电话
}

export interface FormData {
  id: string | undefined;
  staffCode?: string; //员工编号
  name: string; //员工名称
  configPostId: number | undefined; //员工岗位
  gender: string; //性别
  cardNum: string; //身份证号
  telephone: string; //联系电话
  entryTime: string; //入职日期
  state: string; //在职状态
  snapshot: string; //员工简介
  staffCardUrl: string; //员工名片
  remarks?: string; //备注
}

export interface TableQuery extends PageQuery {
  configPostId: number; //员工岗位
  entryTime: string; //入职日期
  gender: string; //性别
  name: string; //员工名称
  staffCode?: string; //员工编号
  telephone: string; //联系电话
}
