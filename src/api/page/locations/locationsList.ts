import { httpDF666 } from '/@/utils/http/axios';
import { combinationParams } from '/@/utils/parameters';
///api/v1/location/backend/list
enum Api {
  List = '/location/backend/list',
  add = '/location/backend/add', //新增文章
  update = '/location/backend/update', //編輯文章
  delete = '/location/backend/delete', //刪除文章
  item = '/location/backend/getArticle', //取得指定文章
}

// 列表
export function getArticleList(params) {
  // console.log('getNewsList', params);
  return httpDF666.get(
    {
      url: Api.List + `?${combinationParams(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 取得指定文章
export function getArticleItem(id: number) {
  return httpDF666.get(
    {
      url: `${Api.item}/${id}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 新增文章
export function addArticle(data: object) {
  return httpDF666.post(
    {
      url: Api.add,
      data,
    },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}

// 編輯文章
export function updateArticle(data: object) {
  return httpDF666.put(
    {
      url: Api.update,
      data,
    },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}

// 刪除文章
export function deleteArticle(id: number) {
  return httpDF666.delete(
    {
      url: Api.delete + `/${id}`,
    },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}
