import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询岗位列表
export function tableList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configPost/list',
    method: 'get',
    params: query
  });
}

// 查询岗位详细
export function getInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configPost/' + postId,
    method: 'get'
  });
}

// 新增岗位
export function addInfo(data: FormData) {
  return request({
    url: '/clyh/configPost',
    method: 'post',
    data: data
  });
}

// 修改岗位
export function updateInfo(data: FormData) {
  return request({
    url: '/clyh/configPost',
    method: 'put',
    data: data
  });
}

// 删除岗位
export function delInfo(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configPost/' + postId,
    method: 'delete'
  });
}
