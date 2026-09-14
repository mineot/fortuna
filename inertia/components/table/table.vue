<template>
  <div class="d-flex flex-column gap-1">
    <table class="table table-bordered table-striped table-hover m-0">
      <thead>
        <tr>
          <slot name="headers" />
        </tr>
      </thead>
      <tbody>
        <slot name="rows" />
      </tbody>
    </table>

    <Paginate
      :meta="props.meta"
      @page-change="$emit('page-change', $event)"
      @limit-change="$emit('limit-change', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import Paginate from './table-paginate.vue';
import { tablePaginateEmits, tablePaginateProps } from './table.types.js';
const props = defineProps(tablePaginateProps);
defineEmits(tablePaginateEmits);
</script>
