require('../style/main.scss');

const Vue = require('vue');
const app = require('./components/app');

const vm = new Vue({
  data: {
    pulls: {},
  },
  el: '#app',
  template: '<app/>',
  components: { app },
});
