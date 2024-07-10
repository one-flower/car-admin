export interface TableVO extends BaseEntity {
  id: string;
  logoUrl: string;
  upOrg: string;
  name: string;
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  name: string;
  isOrg?: number;
  upOrg: string;
  logoUrl: string;
  otherCredentialUrl: string;
  remarks: string;
}

export interface TableQuery extends PageQuery {
  upOrg: string;
  name: string;
}
