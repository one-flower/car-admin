export interface TableVO extends BaseEntity {
  id: string;
  name: string;
  orgCode: string;
  orgAddr: string;
  contacts: string;
  contactUs: string;
  remarks: string;
}

export interface FormData {
  postCode: any;
  id: string;
  name: string;
  orgCode: string;
  orgAddr: string;
  contacts: string;
  contactUs: string;
  remarks: string;
}

export interface TableQuery extends PageQuery {
  postCode: any;
  name: string;
  orgCode: string;
  contacts: string;
  contactUs: string;
}
