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
export function customInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/custom/' + id,
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
export function customDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/custom/' + id,
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
// 图形验证码
export function authCode() {
  return request({
    url: '/auth/code',
    method: 'get'
  });
}
// 短信验证码
export function smsCode(query: { phonenumber: string }) {
  return request({
    url: '/resource/sms/code',
    method: 'get',
    params: query
  });
}
// 查询车主 套餐名称
export function customDropdown(id?: string | number) {
  return request({
    url: '/clyh/custom/dropdown',
    method: 'get'
  });
}
