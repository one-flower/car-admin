import request from '@/utils/request';
import { FormData, TableQuery, TableVO, PhoneData } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function customList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/custom/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function customInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/custom/' + postId,
    method: 'get'
  });
}

// 新增
export function customAdd(data: FormData) {
  return request({
    url: '/clyh/custom',
    method: 'post',
    data: data
  });
}

// 修改
export function customUp(data: FormData) {
  return request({
    url: '/clyh/custom',
    method: 'put',
    data: data
  });
}

// 删除
export function customDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/custom/' + postId,
    method: 'delete'
  });
}

// 变更手机号
export function customEditTelephone(data: PhoneData) {
  return request({
    url: '/clyh/custom/editTelephone',
    method: 'put',
    data: data
  });
}
