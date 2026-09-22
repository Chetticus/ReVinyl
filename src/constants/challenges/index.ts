import { ERouteTable } from '../route';

export const challengeCategories = [
  {
    id: 'cau-hoi-vui',
    name: 'Câu hỏi vui',
    active: false,
    route: ERouteTable.CHALLENGE_QUIZ,
  },
  {
    route: ERouteTable.CHALLENGE_TIMELINE,
    id: 'sap-xep',
    name: 'Sắp xếp',
    active: false,
  },
  {
    route: ERouteTable.CHALLENGE_PUZZLE,
    id: 'ghep-hinh',
    name: 'Ghép hình',
    active: false,
  },
  {
    route: ERouteTable.CHALLENGE_FILL_STORY,
    id: 'dien-khuyet',
    name: 'Điền từ',
    active: false,
  },
];
