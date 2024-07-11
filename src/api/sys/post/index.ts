import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configPostList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configPost/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configPostInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configPost/' + postId,
    method: 'get'
  });
}

// 新增
export function configPostAdd(data: FormData) {
  return request({
    url: '/clyh/configPost',
    method: 'post',
    data: data
  });
}

// 修改
export function configPostUp(data: FormData) {
  return request({
    url: '/clyh/configPost',
    method: 'put',
    data: data
  });
}

// 删除
export function configPostDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configPost/' + postId,
    method: 'delete'
  });
}
