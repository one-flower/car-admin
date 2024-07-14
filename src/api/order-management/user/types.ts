export interface TableVO extends BaseEntity {
  id: string;
  // 数据来源
}

export interface FormData {
  id: string | undefined;
}

export interface TableQuery extends PageQuery {
  // label?: string; //姓名
  // label?: string; //性别
  // label?: string; //手机号码
  // label?: string; //数据来源
  // label?: string; //复核状态
  // label?: string; //公众号
  // label?: string; //小程序
}
