export interface TableVO extends BaseEntity {
  id: string;
  label: string;
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  label: string;
  remarks: string;
}

export interface TableQuery extends PageQuery {
  label: string;
}
