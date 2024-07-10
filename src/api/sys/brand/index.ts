import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function tableList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configProductBrand/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function getInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configProductBrand/' + postId,
    method: 'get'
  });
}

// 获取上有机构
export function getMechanismList(): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configUpOrg/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 99999
    }
  });
}

// 新增
export function addInfo(data: FormData) {
  return request({
    url: '/clyh/configProductBrand',
    method: 'post',
    data: data
  });
}

// 修改
export function updateInfo(data: FormData) {
  return request({
    url: '/clyh/configProductBrand',
    method: 'put',
    data: data
  });
}

// 删除
export function delInfo(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configProductBrand/' + postId,
    method: 'delete'
  });
}
