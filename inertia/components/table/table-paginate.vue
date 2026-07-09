<template>
  <div
    class="d-flex flex-wrap lign-items-center justify-content-between gap-2 text-secondary-emphasis text-size"
  >
    <div class="d-flex gap-1">
      <button class="btn btn-sm btn-dark">
        <i class="bi bi-chevron-double-left" />
      </button>
      <button class="btn btn-sm btn-dark">
        <i class="bi bi-chevron-left" />
      </button>

      <button class="btn btn-sm btn-dark">
        <i class="bi bi-chevron-right" />
      </button>
      <button class="btn btn-sm btn-dark">
        <i class="bi bi-chevron-double-right" />
      </button>

      <select class="form-select form-select-sm" area-label="Full size of visualization pages">
        <option value="1" selected>Page 1</option>
        <option value="2">Page 2</option>
        <option value="3">Page 3</option>
      </select>

      <select class="form-select form-select-sm" area-label="Full size of visualization per pages">
        <option value="5" selected>5 per page</option>
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="30">30 per page</option>
        <option value="40">40 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>
    <div class="d-flex align-items-center gap-1">
      <span>0</span>
      <span>/</span>
      <span>0000</span>
    </div>
  </div>
</template>

<style scoped>
.text-size {
  font-size: 0.85rem;
}
</style>
