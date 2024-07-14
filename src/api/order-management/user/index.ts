import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function registerList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/register/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function registerInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/register/' + postId,
    method: 'get'
  });
}

// 新增
export function registerAdd(data: FormData) {
  return request({
    url: '/clyh/register',
    method: 'post',
    data: data
  });
}

// 修改
export function registerUp(data: FormData) {
  return request({
    url: '/clyh/register',
    method: 'put',
    data: data
  });
}

// 删除
export function registerDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/register/' + postId,
    method: 'delete'
  });
}
