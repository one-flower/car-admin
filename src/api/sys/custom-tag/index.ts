import request from '@/utils/request';
import { FormData, TableQuery, TableVO } from './types';
import { AxiosPromise } from 'axios';

// 查询列表
export function configTagList(query: TableQuery): AxiosPromise<TableVO[]> {
  return request({
    url: '/clyh/configTag/list',
    method: 'get',
    params: query
  });
}

// 查询详细
export function configTagInfo(postId: string | number): AxiosPromise<TableVO> {
  return request({
    url: '/clyh/configTag/' + postId,
    method: 'get'
  });
}

// 新增
export function configTagAdd(data: FormData) {
  return request({
    url: '/clyh/configTag',
    method: 'post',
    data: data
  });
}

// 修改
export function configTagUp(data: FormData) {
  return request({
    url: '/clyh/configTag',
    method: 'put',
    data: data
  });
}

// 删除
export function configTagDel(postId: string | number | (string | number)[]) {
  return request({
    url: '/clyh/configTag/' + postId,
    method: 'delete'
  });
}
