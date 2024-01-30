import { httpDF666 } from '/@/utils/http/axios';
import { combinationParams } from '/@/utils/parameters';

enum Api {
  News = '/news',
  List = '/news/getNewsList',
  AddNews = '/news/addNews',
  updateNews = '/news/updateNews',
}

// 最新消息列表
export function getNewsList(params) {
  console.log('getNewsList', params);
  return httpDF666.get(
    {
      url: Api.List + `?${combinationParams(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 新增最新消息
export function addNews(params: object, userId: number) {
  return httpDF666.post(
    {
      url: Api.AddNews + `?userId=${userId}`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 修改消息
export function updateNews(params: object, userId: number) {
  return httpDF666.put(
    {
      url: Api.updateNews + `?userId=${userId}`,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 刪除消息
export function deleteNews(id: number) {
  return httpDF666.delete(
    {
      url: Api.News + `/${id}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}
