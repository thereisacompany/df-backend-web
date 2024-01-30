import { httpDF666 } from '/@/utils/http/axios';
import { parameters } from '/@/utils/parameters';

enum Api {
  Category = '/other/category',
  Upload = '/basic-api/news/category/upload',
}

// 所有分類列表
export function getAllCategoryList() {
  return httpDF666.get(
    {
      url: Api.Category + `/allList`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 分類列表
export function getCategoryList(params) {
  return httpDF666.get(
    {
      url: Api.Category + `/list?${parameters(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 新增分類
export function addCategory(params: object) {
  return httpDF666.post(
    {
      url: Api.Category + `/add`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 修改分類
export function updateCategory(params: object) {
  return httpDF666.put(
    {
      url: Api.Category + `/update`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 刪除分類
export function deleteCategory(id: number) {
  return httpDF666.delete(
    {
      url: Api.Category + `/delete/${id}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 分類上傳圖片
export function uploadCategoryImage(data: any) {
  console.log('* API-uploadCategoryImage', data);
  return httpDF666.uploadFile(
    {
      url: Api.Upload,
    },
    data,
  );
}

// 刪除圖片 // !待api完成
export function deleteCategoryImage(func: string, file) {
  const fileName = file.url.split(`${func}/`).pop();
  return httpDF666.delete(
    {
      url: Api.Upload + `?function=${func}&name=${fileName}`,
    },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
}
