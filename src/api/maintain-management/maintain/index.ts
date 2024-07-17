import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function frequencyList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/frequency/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function frequencyInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/frequency/' + id,
    method: 'get'
  });
}

// 新增
export function frequencyAdd(data: FormData) {
  return request({
    url: '/clyh/frequency',
    method: 'post',
    data: data
  });
}

// 修改
export function frequencyUp(data: FormData) {
  return request({
    url: '/clyh/frequency',
    method: 'put',
    data: data
  });
}

// 删除
export function frequencyDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/frequency/' + id,
    method: 'delete'
  });
}
