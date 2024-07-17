export interface TableVO extends BaseEntity {
  id: string | undefined;
  customId: string; //车主id
  brandId: string; //车辆品牌id
  licensePlate: string; //车牌号
  vin: string; //vin
  manufacturer: string; //车辆厂商
  typename: string; //车辆系列
  vehicleModel: string; //车辆型号
  carState: string; //车辆状态
  // 客户昵称
  // 电话号码
}

export interface FormData {
  id: string | undefined;
  customId: string; //车主id
  toType: string; //车辆归属
  brandId: string; //车辆品牌id
  licensePlateState: string; //车牌情况

  licenseProvince: string; //车牌省份
  licenseOrg: string; //发牌机关
  licenseNum: string; //车牌序列号
  licenseBit: string; //车牌序列位

  licensePlate: string; //车牌号
  imgUrls: string; //车辆照片组
  remarks: string; //备注
  // 信息补全
  carState: string; //车辆状态
  vin: string; //vin
  manufacturer: string; //车辆厂商
  typename: string; //车辆系列
  vehicleModel: string; //车辆型号
  sizetype: string; //车辆级别
  bodytype: string; //车身结构
  drivemode: string; //驱动方式
  fueltype: string; //能源类型
}

export interface TableQuery extends PageQuery {
  brandId: string; //车辆品牌id
  manufacturer: string; //车辆厂商
  typename: string; //车辆系列
  vehicleModel: string; //车辆型号
  vin: string; //vin
  licensePlate: string; //车牌号
  customNickname?: string; // 客户昵称
  customtelephone?: string; // 电话号码
}
