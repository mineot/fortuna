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

    <Paginate />
  </div>
</template>

<script setup lang="ts">
import Paginate from './table-paginate.vue';
</script>
