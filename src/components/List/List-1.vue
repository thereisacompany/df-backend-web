<template>
  <div class="list">
    <div v-for="(item, index) in tableArray" :key="index" class="list-body">
      <div class="list-header row">
        <div class="col-lg-10 col-8">
          <h6 class="list-title fw-bolder">
            <span class="me-8">{{ index + 1 }}</span>
            {{ item[colName] }}
          </h6>
        </div>
        <div class="col-lg-2 col-4">
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle btn-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ translate('More') }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <a
                  class="dropdown-item"
                  role="button"
                  tabindex="0"
                  @click="openModal_Area('Edit', name, item[colName], item)"
                  >{{ translate('Edit') }}</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  role="button"
                  tabindex="0"
                  @click="deleteArea(name, item[colName], item)"
                  >{{ translate('Delete') }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: {},
    props: {
      tableArray: { type: Array, required: true },
      name: { type: String, required: true },
      colName: { type: String, required: true },
    },
    emits: ['open-modal-area'],
    setup() {
      const { t } = useI18n();

      return {
        t,
      };
    },
  });
</script>
