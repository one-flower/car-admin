import { getDicts, dictGetDictInfo } from '@/api/system/dict/data';
import { useDictStore } from '@/store/modules/dict';
/**
 * 获取字典数据
 */
export const useDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
  const res = ref<{
    [key: string]: DictDataOption[];
  }>({});
  return (() => {
    args.forEach(async (dictType) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        await getDicts(dictType).then((resp) => {
          res.value[dictType] = resp.data.map(
            (p): DictDataOption => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass })
          );
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return res.value;
  })();
};

/**
 * 获取字典数据--信息
 */
export const useNewDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
  const res = ref<{
    [key: string]: DictDataOption[];
  }>({});
  return (() => {
    args.forEach(async (dictType) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        await dictGetDictInfo(dictType).then((resp) => {
          res.value[dictType] = resp.data;
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return res.value;
  })();
};
