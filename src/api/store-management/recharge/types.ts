export interface TableVO extends BaseEntity {
  id: string;
  name: string; // 套餐名称
  realityMoney: string; //充值金额
  giveMoney: string; //赠送金额
  remarks: string;
  state: string; //状态
}

export interface FormData {
  id: string | undefined;
  name: string; //name
  realityMoney: string; //充值金额
  giveMoney: string; //赠送金额
  remarks: string;
  state: string; //状态
}

export interface TableQuery extends PageQuery {
  name: string;
  state: string | undefined;
}
