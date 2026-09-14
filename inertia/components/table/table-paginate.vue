<template>
  <div
    class="d-flex flex-wrap align-items-center justify-content-between gap-2 text-secondary-emphasis text-size"
  >
    <div class="d-flex gap-1">
      <button
        class="btn btn-sm btn-dark"
        :disabled="props.meta.currentPage === props.meta.firstPage"
        @click="$emit('page-change', meta.firstPage)"
      >
        <i class="bi bi-chevron-double-left" />
      </button>
      <button
        class="btn btn-sm btn-dark"
        :disabled="props.meta.currentPage === props.meta.firstPage"
        @click="$emit('page-change', props.meta.currentPage - 1)"
      >
        <i class="bi bi-chevron-left" />
      </button>

      <button
        class="btn btn-sm btn-dark"
        :disabled="props.meta.currentPage === props.meta.lastPage"
        @click="$emit('page-change', props.meta.currentPage + 1)"
      >
        <i class="bi bi-chevron-right" />
      </button>
      <button
        class="btn btn-sm btn-dark"
        :disabled="props.meta.currentPage === props.meta.lastPage"
        @click="$emit('page-change', props.meta.lastPage)"
      >
        <i class="bi bi-chevron-double-right" />
      </button>

      <select
        class="form-select form-select-sm"
        :value="props.meta.currentPage"
        @change="$emit('page-change', +($event.target as HTMLSelectElement).value)"
      >
        <option v-for="numPage in props.meta.lastPage" :key="numPage" :value="numPage">
          {{ t('app.terms.page', [String(numPage)]) }}
        </option>
      </select>

      <select
        class="form-select form-select-sm"
        :value="props.meta.perPage"
        @change="$emit('limit-change', +($event.target as HTMLSelectElement).value)"
      >
        <option :value="5">{{ t('app.terms.perPage', ['5']) }}</option>
        <option :value="10">{{ t('app.terms.perPage', ['10']) }}</option>
        <option :value="20">{{ t('app.terms.perPage', ['20']) }}</option>
        <option :value="30">{{ t('app.terms.perPage', ['30']) }}</option>
        <option :value="40">{{ t('app.terms.perPage', ['40']) }}</option>
        <option :value="50">{{ t('app.terms.perPage', ['50']) }}</option>
        <option :value="100">{{ t('app.terms.perPage', ['100']) }}</option>
      </select>
    </div>
    <div class="d-flex align-items-center gap-1">
      <span>{{ props.meta.currentPage }}</span>
      <span>/</span>
      <span>{{ props.meta.total }}</span>
    </div>
  </div>
</template>

<style scoped>
.text-size {
  font-size: 0.85rem;
}
</style>

<script setup lang="ts">
import { tablePaginateEmits, tablePaginateProps } from './table.types';
import { useI18n } from '~/lib/i18n';
const { t } = useI18n();
const props = defineProps(tablePaginateProps);
defineEmits(tablePaginateEmits);
</script>
