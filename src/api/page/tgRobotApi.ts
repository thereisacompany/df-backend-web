import { TGRobotHttp } from '/@/utils/http/axios';
enum Api {
  TGFriends = '/TGFriends',
  TGTalks = '/TGTalks',
}
//取得朋友清單
export function getTGFriends(jobId: string) {
  const model: any = {};
  if (jobId) model['jobId'] = jobId; //自己的帳號
  const parameters = new URLSearchParams(model).toString();
  return TGRobotHttp.get(
    { url: `${Api.TGFriends}?${parameters}` },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

//取得聊天紀錄
export function getTGTalks(data: any) {
  const model: any = {};
  if (data.jobId) model['jobId'] = data.jobId; //自己的帳號
  if (data.content) model['content'] = data.content; //訊息
  if (data.SDateTime) model['SDateTime'] = data.SDateTime; //開始日期
  if (data.EDatetime) model['EDatetime'] = data.EDatetime; //結束日期
  if (data.toTGid) model['toTGid'] = data.toTGid; //發話tgId
  if (data.fromTGid) model['fromTGid'] = data.fromTGid; //收到tgId
  const parameters = new URLSearchParams(model).toString();
  return TGRobotHttp.get(
    { url: `${Api.TGTalks}?${parameters}` },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

//新增聊天紀錄
export function createTGTalks(data: object) {
  return TGRobotHttp.post(
    { url: Api.TGTalks, data },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}

//異動指定朋友
export function updateTGFriends(tgFriendId: string, data: object) {
  return TGRobotHttp.put(
    { url: `${Api.TGFriends}/${tgFriendId}`, data },
    { errorMessageMode: 'modal', isTransformResponse: false },
  );
}
