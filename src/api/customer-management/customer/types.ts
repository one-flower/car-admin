export interface TableVO extends BaseEntity {
  id: string;
  customNo: string; //客户编号
  tagId: string; //客户标签
  nickname: string; //客户昵称
  telephone: string; //联系电话
  channel: string; //渠道来源
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  customNo?: string; //客户编号
  tagId: string; //客户标签
  nickname: string; //客户昵称
  telephone: string; //联系电话
  channel: string; //渠道来源
  remarks: string;
}

export interface TableQuery extends PageQuery {
  tagId: string; //客户标签
  nickname: string; //客户昵称
  telephone: string; //联系电话
}

export interface PhoneData {
  id: string;
  oldTelephone: string; //原联系电话
  newTelephone: string; //新联系电话
  imgCode: string; //图片验证码
  uuid: string; //图片验证码UUID
  smsCode: string;
}

export interface PhoneForm {
  id: string | undefined;
  customNo: string; //客户编号
  tagId: string; //客户标签
  nickname: string; //客户昵称
  telephone: string; //联系电话
  oldTelephone?: string; //原联系电话
  newTelephone?: string; //新联系电话
  imgCode?: string; //图片验证码
  uuid?: string; //图片验证码UUID
  smsCode?: string;
}

export interface customerInfo {}
