import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import { getTGTalks } from '/@/api/page/tgRobotApi';

export function getHeadName(value) {
  if (value && value.length > 1) {
    return value.substr(0, 1);
  } else {
    return '';
  }
}

export function getNearlyThreeYears() {
  const eDatetime = `${dayjs().format('YYYY')}/12/31`;
  const sDatetime = `${dayjs().add(-2, 'year').format('YYYY')}/01/01`;
  return { sYear: sDatetime, eYear: eDatetime };
}

export async function getTalkList(model) {
  const data = await getTGTalks(model);
  return data;
}

export function getChatData(res, info) {
  const data = XEUtils.orderBy(res.data.result, [['id', 'asc']]);
  const list: any = [];
  data.forEach((item: any) => {
    const model = {
      id: item.id,
      source: info.tgId === item.fromTGId ? 'myself' : 'other',
      message: item.Content,
      files: [],
      datetime: dayjs(item.createAt).format('HH:mm A'),
      // datetime: dayjs(item.createAt).format('YYYY/MM/DD HH:mm:ss'),
      isSeach: false,
    };
    list.push(model);
  });
  return list;
}
