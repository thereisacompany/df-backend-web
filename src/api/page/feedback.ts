import { httpDF666 } from '/@/utils/http/axios';
import { parameters } from '/@/utils/parameters';

enum Api {
  List = '/feedback/list',
  Feedback = '/feedback/getFeedback',
  Response = '/feedback/responseFeedback',
}

// 意見列表
export function getFeedbackList(params) {
  console.log('params', parameters(params));
  return httpDF666.get(
    {
      url: Api.List + `?${parameters(params)}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 取得單獨意見
export function getFeedback(id: number) {
  return httpDF666.get(
    {
      url: Api.Feedback + `/${id}`,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}

// 意見回覆
export function replayFeedback(params) {
  return httpDF666.put(
    {
      url: Api.Response,
      params,
    },
    { errorMessageMode: 'message', isTransformResponse: false },
  );
}
