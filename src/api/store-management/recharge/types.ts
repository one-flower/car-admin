export interface TableVO extends BaseEntity {
  id: string;
  name: string; // 套餐名称
  realityMoney: string | number; //充值金额
  giveMoney: string | number; //赠送金额
  remarks: string;
  state: string; //状态
}

export interface FormData {
  id: string | undefined;
  name: string; //name
  realityMoney: string | number; //充值金额
  giveMoney: string | number; //赠送金额
  remarks: string;
  state: '0' | '1'; //状态 0禁用
  customId?: string; // 可客户id
}

export interface TableQuery extends PageQuery {
  name?: string;
  state?: string;
  customId?: string;
}

export interface logTableVO extends BaseEntity {
  id?: number; //
  customId?: number; //客户id
  customName?: string; //客户名称
  customTelephone?: string; //联系电话
  giveMoney?: number; //赠送金额
  realityMoney?: number; //充值金额
  rechargeId?: number; //充值套餐id
  rechargeName?: string; //套餐名称
  remainingSum?: number; //余额
  remarks?: string; //备注
}
export interface logTableQuery extends PageQuery {
  customId?: number; // 客户id
  rechargeId?: number; // 套餐id
  createTime?: string;
  customName?: string; //客户昵称
  customTelephone?: string;
}
