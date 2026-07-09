<template>
  <td
    :class="[
      'px-2',
      'align-middle',
      {
        'py-2': props.value === null,
        'text-center': props.align === 'center',
        'text-right': props.align === 'right',
      },
    ]"
  >
    <span v-if="props.value" class="text-truncate">
      {{ props.value }}
    </span>
    <div
      v-if="!props.value"
      class="d-flex align-items-center justify-content-between flex-nowrap gap-2"
    >
      <slot></slot>
    </div>
  </td>
</template>

<script setup lang="ts">
import { tableColumnProps } from './table.types';

const props = defineProps(tableColumnProps);
</script>
