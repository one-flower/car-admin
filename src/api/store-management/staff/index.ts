import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function tableList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/staff/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function getInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/staff/' + id,
    method: 'get'
  });
}

// 新增
export function addInfo(data: FormData) {
  return request({
    url: '/clyh/staff',
    method: 'post',
    data: data
  });
}

// 修改
export function updateInfo(data: FormData) {
  return request({
    url: '/clyh/staff',
    method: 'put',
    data: data
  });
}

// 删除
export function delInfo(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/staff/' + id,
    method: 'delete'
  });
}

// 查询提成
// export function orderCommExtlist(query: commExtTableQuery): AxiosPromise<commExtTableVO[]> {
//   return request({
//     url: '/clyh/order/commExtlist',
//     method: 'get',
//     params: query
//   });
// }

export function staffDropdown(data?: any) {
  return request({
    url: '/clyh/staff/dropdown',
    method: 'post',
    data: data
  });
}
