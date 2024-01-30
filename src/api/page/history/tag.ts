import { httpDF666 } from '/@/utils/http/axios';
import { parameters } from '/@/utils/parameters';

enum Api {
  Tag = '/article/tag',
}

// 所有關鍵字標籤列表
export function getAllTagList() {
  return httpDF666.get(
    {
      url: Api.Tag + `/allList`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 關鍵字標籤列表
export function getTagList(params) {
  return httpDF666.get(
    {
      url: Api.Tag + `/list?${parameters(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 新增關鍵字標籤
export function addTag(params: object) {
  return httpDF666.post(
    {
      url: Api.Tag + `/add`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 修改關鍵字標籤
export function updateTag(params: object) {
  return httpDF666.put(
    {
      url: Api.Tag + `/update`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 刪除關鍵字標籤
export function deleteTag(id: number) {
  return httpDF666.delete(
    {
      url: Api.Tag + `/delete/${id}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}
