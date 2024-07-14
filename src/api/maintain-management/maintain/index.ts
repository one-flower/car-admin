import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function carManageList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/carManage/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function carManageInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/carManage/' + postId,
    method: 'get'
  });
}

// 新增
export function carManageAdd(data: FormData) {
  return request({
    url: '/clyh/carManage',
    method: 'post',
    data: data
  });
}

// 修改
export function carManageUp(data: FormData) {
  return request({
    url: '/clyh/carManage',
    method: 'put',
    data: data
  });
}

// 删除
export function carManageDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/carManage/' + postId,
    method: 'delete'
  });
}
