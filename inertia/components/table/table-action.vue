<template>
  <button
    @click="emit('click', props.data)"
    :title="props.title"
    :class="[
      'btn',
      'btn-sm',
      {
        'btn-secondary': props.severity === 'secondary',
        'btn-danger': props.severity === 'danger',
      },
    ]"
  >
    <i :class="['bi', props.icon]" />
  </button>
</template>

<script setup lang="ts">
import { tableActionProps } from './table.types';

const emit = defineEmits(['click']);
const props = defineProps(tableActionProps);
</script>
