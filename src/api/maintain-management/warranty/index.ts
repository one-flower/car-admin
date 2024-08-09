import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function warrantyList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/warranty/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function warrantyInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/warranty/' + id,
    method: 'get'
  });
}

// 新增
export function warrantyAdd(data: FormData) {
  return request({
    url: '/clyh/warranty',
    method: 'post',
    data: data
  });
}

// 修改
export function warrantyUp(data: FormData) {
  return request({
    url: '/clyh/warranty',
    method: 'put',
    data: data
  });
}

// 删除
export function warrantyDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/warranty/' + id,
    method: 'delete'
  });
}

// 切换状态
export function warrantyUpdatePending(data: any) {
  // id、pendingState、remarks
  return request({
    url: '/clyh/warranty/updatePending',
    method: 'put',
    data: data
  });
}
