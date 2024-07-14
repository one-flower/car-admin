import request from '@/utils/request';
import { FormData, logTableQuery, TableQuery, TableVO, UserFormData } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function rechargeList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/recharge/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function rechargeInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/recharge/' + postId,
    method: 'get'
  });
}

// 新增
export function rechargeAdd(data: FormData) {
  return request({
    url: '/clyh/recharge',
    method: 'post',
    data: data
  });
}

// 修改
export function rechargeUp(data: FormData) {
  return request({
    url: '/clyh/recharge',
    method: 'put',
    data: data
  });
}

// 删除
export function rechargeDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/recharge/' + postId,
    method: 'delete'
  });
}

// 用户充值
export function userRecharge(data: UserFormData) {
  return request({
    url: '/clyh/recharge/userRecharge',
    method: 'post',
    data: data
  });
}

// 充值记录
export function rechargeLogList(query: logTableQuery) {
  return request({
    url: '/clyh/rechargeLog/list',
    method: 'get',
    params: query
  });
}
