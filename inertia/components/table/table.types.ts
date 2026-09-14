import type { PropType } from 'vue';
import type { Meta } from '~/helpers/app.helper';

export type TableAlign = 'left' | 'center' | 'right';
export type TableActionSeverity = 'secondary' | 'danger';
export type TableDataAction = Record<string, any>;

export const PAGINATE_LIMITS = [5, 10, 20, 30, 40, 50, 100];
export const PAGINATE_DEFAULT_LIMIT = 5;
export const PAGINATE_FIRST_PAGE = 1;

export const tableHeaderProps = {
  label: {
    type: String,
    required: false,
    default: '',
  },
  fit: {
    type: Boolean,
    required: false,
    default: false,
  },
  align: {
    type: String as PropType<TableAlign>,
    required: false,
    default: 'left',
  },
};

export const tableColumnProps = {
  value: {
    type: Object as PropType<any>,
    required: false,
    default: null,
  },
  align: {
    type: String as PropType<TableAlign>,
    required: false,
    default: 'left',
  },
};

export const tableActionProps = {
  icon: {
    type: String,
    required: false,
    default: 'bi-ban-fill',
  },
  title: {
    type: String,
    required: false,
    default: '',
  },
  severity: {
    type: String as PropType<TableActionSeverity>,
    required: false,
    default: 'secondary',
  },
  data: {
    type: String as PropType<TableDataAction>,
    required: false,
    default: {},
  },
};

export const tablePaginateProps = {
  meta: {
    type: Object as PropType<Meta>,
    required: false,
    default: {},
  },
};

export const tablePaginateEmits = ['page-change', 'limit-change'];
