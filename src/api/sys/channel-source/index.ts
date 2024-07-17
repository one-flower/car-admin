import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configChannelList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configChannel/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configChannelInfo(id: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configChannel/' + id,
    method: 'get'
  });
}

// 新增
export function configChannelAdd(data: FormData) {
  return request({
    url: '/clyh/configChannel',
    method: 'post',
    data: data
  });
}

// 修改
export function configChannelUp(data: FormData) {
  return request({
    url: '/clyh/configChannel',
    method: 'put',
    data: data
  });
}

// 删除
export function configChannelDel(id: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configChannel/' + id,
    method: 'delete'
  });
}
