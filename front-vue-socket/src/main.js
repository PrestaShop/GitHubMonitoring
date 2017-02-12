require('../style/main.scss');
const Vue = require('vue');
const Vuex = require('vuex');
const Nes = require('nes');
const app = require('./components/app');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    pulls: [],
  },
  mutations: {
    setPulls: (state, pulls) => {
      state.pulls = pulls;
    },
    updatePull: (state, pullUpdate) => {
      let indexToUpdate = -1;
      state.pulls.forEach((pull, index) => {
        if (pull.number == pullUpdate.number) {
          Object.keys(pullUpdate).forEach((key) => {
            Vue.set(state.pulls[index], key, pullUpdate[key]);
          });
        }
      });
    },
    removePull: (state, pullToRemove) => {
      let indexToRemove = -1;
      state.pulls.forEach((pull, index) => {
        if (pull.number == pullToRemove.number) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        state.pulls.splice(indexToRemove, 1);
      }
    },
    addPull: (state, pullToAdd) => {
      state.pulls.push(pullToAdd);
      state.pulls.sort((a, b) => {
        return b.number - a.number;
      });
    },
  },
});

const vm = new Vue({
  data: {
    pulls: {},
  },
  store,
  el: '#app',
  template: '<app/>',
  components: { app },
});

const host = 'localhost:3000';
const client = new Nes.Client(`ws://${host}/ws`);

client.connect((err) => {
  client.request('connection', (err, payload) => {
    store.commit('setPulls', payload);
  });

  let events = [];
  client.onUpdate = (update) => {
    if (update.is_event) {
      switch (update.type) {
        case 'opened':
          store.commit('addPull', update);
          break;
        case 'created':
        case 'assigned':
        case 'unassigned':
          store.commit('updatePull', update);
          break;
        case 'closed':
          if (update.merged) {
            store.commit('updatePull', update);
          } else {
            store.commit('removePull', update);
          }
          break;
      }
    }
  };

  const displayEvent = () => {
    let eventToDisplay = events.shift();
    if (eventToDisplay) {


      setTimeout(displayEvent, 10 * 1000);
    } else {
      setTimeout(displayEvent, 100);
    }
  }
  setTimeout(displayEvent, 100);
});
