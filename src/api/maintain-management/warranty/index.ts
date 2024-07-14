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
export function warrantyInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/warranty/' + postId,
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
export function warrantyDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/warranty/' + postId,
    method: 'delete'
  });
}
