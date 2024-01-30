export interface ListItem {
  id: string;
  avatar: string;
  // 通知的标题内容
  title: string;
  // 是否在标题上显示删除线
  titleDelete?: boolean;
  dateTime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra?: string;
  color?: string;
  state?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  unReadList?: ListItem[];
}

export const theCount = 0;
export const tabListData: TabItem[] = [
  // {
  //   key: '1',
  //   name: '通知',
  //   list: [
  //     {
  //       id: '000000001',
  //       avatar: 'https://cdn-icons-png.flaticon.com/512/185/185977.png',
  //       title: '訊息通知',
  //       description: '有客戶提出問題',
  //       dateTime: '2023-01-03',
  //       type: '1',
  //     },
  //     {
  //       id: '000000002',
  //       avatar: 'https://cdn-icons-png.flaticon.com/512/185/185977.png',
  //       title: '訊息通知',
  //       description: '有客戶提出問題',
  //       dateTime: '2023-01-03',
  //       type: '1',
  //     },
  //   ],
  // },
];
