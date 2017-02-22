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
      state.pulls.sort((a, b) => {
        return b.number - a.number;
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
      let indexToRemove = -1;
      state.pulls.forEach((pull, index) => {
        if (pull.number == pullToAdd.number) {
          indexToRemove = index;
        }
      });
      if (indexToRemove !== -1) {
        state.pulls.splice(indexToRemove, 1);
      }
      state.pulls.push(pullToAdd);
      state.pulls.sort((a, b) => {
        return b.number - a.number;
      });
    },
  }
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
    if (typeof update.event !== 'undefined') {

    }
    if (typeof update.issue !== 'undefined') {
      if (update.issue.state === 'closed' && !update.issue.merged) {
        store.commit('removePull', update.issue);
      } else {
        store.commit('addPull', update.issue);
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
