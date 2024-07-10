export interface TableVO extends BaseEntity {
  id: string;
  name: string;
  mode: number;
  remarks: string;
}

export interface FormData {
  id: string | undefined;
  name: string;
  mode: number;
  remarks: string;
}

export interface TableQuery extends PageQuery {
  name: string;
}
