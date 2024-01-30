import { httpDF666 } from '/@/utils/http/axios';
import { parameters } from '/@/utils/parameters';

enum Api {
  list = '/history/list', //文章列表
  item = '/history/getArticle', //取得指定文章
  add = '/history/add', //新增文章
  update = '/history/update', //編輯文章
  delete = '/history/delete', //刪除文章
  browserCount = '/history/update/browserCount', //更新文章瀏覽數
  // games = '/history/game/list', //取得相關賽事設定(所有賽事清單)
  upload = '/basic-api/history/upload',
}

// 取得文章列表
export function getArticleList(params) {
  return httpDF666.get(
    {
      url: Api.list + `?${parameters(params)}`,
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

// 更新文章瀏覽數
export function updateBrowserCount(id: number) {
  return httpDF666.put(
    {
      url: `${Api.browserCount}/${id}`,
    },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}

// 文章上傳圖片
export function uploadHistoryImage(data: any) {
  console.log(data);
  return httpDF666.uploadFile(
    {
      url: Api.upload,
    },
    data,
  );
}

// 取得所有賽事清單
// export function getArticleGamesList() {
//   return httpDF666.get(
//     {
//       url: Api.games,
//     },
//     { errorMessageMode: 'message', isTransformResponse: false },
//   );
// }
