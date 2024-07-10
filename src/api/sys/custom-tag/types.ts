export interface PostVO extends BaseEntity {
  id: number | string;
  postCode: string;
  name: string;
  remarks: string;
}

export interface PostForm {
  id: number | string | undefined;
  postCode: string;
  name: string;
  remarks: string;
}

export interface PostQuery extends PageQuery {
  postCode: string;
  name: string;
}
