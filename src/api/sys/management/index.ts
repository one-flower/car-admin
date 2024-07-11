import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configProjectList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configProject/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configProjectInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configProject/' + postId,
    method: 'get'
  });
}

// 新增
export function configProjectAdd(data: FormData) {
  return request({
    url: '/clyh/configProject',
    method: 'post',
    data: data
  });
}

// 修改
export function configProjectUp(data: FormData) {
  return request({
    url: '/clyh/configProject',
    method: 'put',
    data: data
  });
}

// 删除
export function configProjectDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configProject/' + postId,
    method: 'delete'
  });
}
