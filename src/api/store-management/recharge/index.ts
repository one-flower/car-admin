import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function tableList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/recharge/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function getInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/recharge/' + postId,
    method: 'get'
  });
}

// 新增
export function addInfo(data: FormData) {
  return request({
    url: '/clyh/recharge',
    method: 'post',
    data: data
  });
}

// 修改
export function updateInfo(data: FormData) {
  return request({
    url: '/clyh/recharge',
    method: 'put',
    data: data
  });
}

// 删除
export function delInfo(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/recharge/' + postId,
    method: 'delete'
  });
}
