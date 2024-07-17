import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configProductBrandList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configProductBrand/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configProductBrandInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configProductBrand/' + id,
    method: 'get'
  });
}

// 新增
export function configProductBrandAdd(data: FormData) {
  return request({
    url: '/clyh/configProductBrand',
    method: 'post',
    data: data
  });
}

// 修改
export function configProductBrandUp(data: FormData) {
  return request({
    url: '/clyh/configProductBrand',
    method: 'put',
    data: data
  });
}

// 删除
export function configProductBrandDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configProductBrand/' + id,
    method: 'delete'
  });
}
