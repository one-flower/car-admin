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
export function carManageInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/carManage/' + id,
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
export function carManageDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/carManage/' + id,
    method: 'delete'
  });
}

// 更换车主
export function carManageEditCusetom(data: any) {
  return request({
    url: '/clyh/carManage/editCustom',
    method: 'put',
    data: data
  });
}

// 查询车主 套餐名称
export function customDropdown(id?: string | number) {
  return request({
    url: '/clyh/custom/dropdown',
    method: 'get'
  });
}

// 查询vin吗
export function vinInfo(id: string | number) {
  return request({
    url: '/clyh/vin/' + id,
    method: 'get'
  });
}

// 车辆装配
export function fabricateList(query: any) {
  return request({
    url: '/clyh/fabricate/list',
    method: 'get',
    params: query
  });
}
