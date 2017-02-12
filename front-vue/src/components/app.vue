<template>
  <div id="app">
    <div id="pr-list">
        <pr :key="pull.number" :pull="pull" :assignee="pull.pull.assignee" v-for="pull in orderedPulls"/>
    </div>
  </div>
</template>

<script>
const pr = require('./pr');
const fetch = require('../tools/fetch');
let initialized = false;

module.exports = {
  props: {
    pulls: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  mounted: function() {
    console.log('MOUNTED');
    setInterval(() => {
      this.updatePulls();
    }, 5000);
    this.updatePulls();
  },
  updated: function() {
    console.log('UPDATED');
  },
  computed: {
    orderedPulls: function() {
      let pulls = [];
      Object.keys(this.pulls).forEach((number) => {
        pulls.push(this.pulls[number]);
      });
      pulls.reverse();
      return pulls;
    },
  },
  methods: {
    updatePulls: function() {
      console.log('updatePulls');
      fetch((err, result) => {
        if (!err) {
          // Add new pull requests
          result.forEach((pull) => {
            this.$set(this.pulls, pull.number, {
              number: pull.number,
              pull: pull.pull,
              comments: pull.comments,
              lastUpdate: pull.lastUpdate,
            });
          });
          // Remove old pull requests
          Object.keys(this.pulls).forEach((number) => {
            let found = false;
            result.forEach((pull) => {
              if (pull.number == number) {
                found = true;
              }
            });
            if (!found) {
              delete this.pulls[number];
            }
          });
        }
      });
    },
  },
  components: {
    pr,
  }
};
</script>
