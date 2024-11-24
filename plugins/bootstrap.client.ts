import Modal from 'bootstrap/js/dist/modal';
import Collapse from 'bootstrap/js/dist/collapse';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bsModal: Modal,
      bsCollapse: Collapse,
    },
  };
});
