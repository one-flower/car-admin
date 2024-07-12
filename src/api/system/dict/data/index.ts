import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DictDataForm, DictDataQuery, DictDataVO } from './types';
// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): AxiosPromise<DictDataVO[]> {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  });
}

// 查询字典数据列表
export function listData(query: DictDataQuery): AxiosPromise<DictDataVO[]> {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  });
}

// 查询字典数据详细
export function getData(dictCode: string | number): AxiosPromise<DictDataVO> {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  });
}

// 新增字典数据
export function addData(data: DictDataForm) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  });
}

// 修改字典数据
export function updateData(data: DictDataForm) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  });
}

// 删除字典数据
export function delData(dictCode: string | number | Array<string | number>) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  });
}

// 查看字典类型--新
export function dictGetDictModel() {
  return request({
    url: '/clyh/dict/getDictModel',
    method: 'get'
  });
}
// 查查看字典--新
export function dictGetDictInfo(xxx: string) {
  const module = xxx.split('__')[0];
  const dictType = xxx.split('__')[1];
  return request({
    url: `/clyh/dict/${module}/${dictType}`,
    method: 'get'
  });
}
