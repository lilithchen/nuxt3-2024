import Modal from 'bootstrap/js/dist/modal';
import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bsModal: Modal,
      bsCollapse: Collapse,
      bsDropdown: Dropdown,
    },
  };
});
