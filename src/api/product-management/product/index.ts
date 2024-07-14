import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function productList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/product/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function productInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/product/' + postId,
    method: 'get'
  });
}

// 新增
export function productAdd(data: FormData) {
  return request({
    url: '/clyh/product',
    method: 'post',
    data: data
  });
}

// 修改
export function productUp(data: FormData) {
  return request({
    url: '/clyh/product',
    method: 'put',
    data: data
  });
}

// 删除
export function productDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/product/' + postId,
    method: 'delete'
  });
}
