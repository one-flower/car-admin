import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configUpOrgList(query?: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configUpOrg/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configUpOrgInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configUpOrg/' + id,
    method: 'get'
  });
}

// 新增
export function configUpOrgAdd(data: FormData) {
  return request({
    url: '/clyh/configUpOrg',
    method: 'post',
    data: data
  });
}

// 修改
export function configUpOrgUp(data: FormData) {
  return request({
    url: '/clyh/configUpOrg',
    method: 'put',
    data: data
  });
}

// 删除
export function configUpOrgDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configUpOrg/' + id,
    method: 'delete'
  });
}
