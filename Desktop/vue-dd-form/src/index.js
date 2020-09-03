import ddForm from "./DdForm.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("dd-form", ddForm);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

ddForm.install = install;

export default ddForm;