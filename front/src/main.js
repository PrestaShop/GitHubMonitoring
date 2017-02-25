const theme = require('../themes/default');
const Vue = require('vue');
const Vuex = require('vuex');
const Nes = require('nes');
const app = require('./components/app');

Vue.use(Vuex);

let configuration = {
  max_events_displayed: 10,
  delay_between_events: 1,
};
if (typeof theme.configuration !== 'undefined') {
  configuration = Object.assign(configuration, theme.configuration);
}

const store = new Vuex.Store({
  state: {
    pulls: [],
    events: [],
    displayedEvents: [],
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
    addEvent: (state, event) => {
      state.events.push(event);
    },
    displayEvent: (state) => {
      state.displayedEvents.push(state.events.shift());
    },
  },
  actions: {
    displayEvent(context) {
      if (context.state.displayedEvents.length === configuration.max_events_displayed) {
        context.state.displayedEvents.pop();
      }
      setTimeout(() => {
        context.commit('displayEvent');
      });
    },
  },
});

const vm = new Vue({
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
      if (
        update.event.name === 'pull_request'
        && update.event.action === 'closed'
      ) {
        if (update.event.merged_by !== null) {
          store.commit('addEvent', Object.assign({}, update.event, { action: 'merged' }));
        }
      } else {
        store.commit('addEvent', update.event);
      }
    }
    if (typeof update.issue !== 'undefined') {
      if (update.issue.state === 'closed' && !update.issue.merged) {
        store.commit('removePull', update.issue);
      } else {
        store.commit('addPull', update.issue);
      }
    }
  };

  const initNextEventDisplay = (timeout) => {
    setTimeout(() => {
      if (store.state.events.length > 0) {
        store.dispatch('displayEvent');
        initNextEventDisplay(configuration.delay_between_events * 1000);
      } else {
        initNextEventDisplay(100);
      }
    }, timeout);
  };
  initNextEventDisplay();

});
