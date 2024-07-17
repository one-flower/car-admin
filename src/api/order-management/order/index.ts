import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function orderList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/order/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function orderInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/order/' + id,
    method: 'get'
  });
}

// 新增
export function orderAdd(data: FormData) {
  return request({
    url: '/clyh/order',
    method: 'post',
    data: data
  });
}

// 修改
export function orderUp(data: FormData) {
  return request({
    url: '/clyh/order',
    method: 'put',
    data: data
  });
}

// 删除
export function orderDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/order/' + id,
    method: 'delete'
  });
}
