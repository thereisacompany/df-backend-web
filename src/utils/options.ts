import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const statusOptions = [
  { label: t('common.yes'), value: 1, tagClass: 'tag-green' },
  { label: t('common.no'), value: 0, tagClass: 'tag-border-black' },
];

export const categoryOptions = [
  { label: t('component.gamesManagement.soccer'), value: 1 },
  { label: t('component.gamesManagement.basketball'), value: 2 },
  { label: t('component.gamesManagement.esports'), value: 3 },
];

export const filterOptions = [
  { label: t('component.articleManagement.latest'), value: 'latest' },
  { label: t('component.articleManagement.featured'), value: 'featured' },
  { label: t('component.articleManagement.publishing'), value: 'publish' },
  { label: t('component.articleManagement.pinToTop'), value: 'top' },
];

//職位清單
export const positionOptions = [
  { label: t('component.backend.director'), value: 1 },
  { label: t('component.backend.employee'), value: 2 },
];

//import { statusOptions, categoryOptions } from '/@/utils/options';
