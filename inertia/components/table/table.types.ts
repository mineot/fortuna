import { type PropType } from 'vue';

export type TableAlign = 'left' | 'center' | 'right';
export type TableActionSeverity = 'secondary' | 'danger';
export type TableDataAction = Record<string, any>;

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
