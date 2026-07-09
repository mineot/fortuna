<template>
  <th
    scope="col"
    :class="[
      'px-2',
      'align-middle',
      {
        fit: props.fit,
        'text-center': props.align === 'center',
        'text-right': props.align === 'right',
      },
    ]"
  >
    <span>{{ props.label }}</span>
  </th>
</template>

<style scoped>
.fit {
  width: 1%;
}
</style>

<script setup lang="ts">
import { tableHeaderProps } from './table.types';

const props = defineProps(tableHeaderProps);
</script>
