export interface TableVO extends BaseEntity {
  id: string;
  postCode: string;
  name: string;
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  postCode: string;
  name: string;
  remarks: string;
}

export interface TableQuery extends PageQuery {
  postCode: string;
  name: string;
}
