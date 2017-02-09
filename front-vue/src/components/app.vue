<template>
  <div id="app">
    <div id="pr-list">
        <pr :key="pull.number" :pull="pull" v-for="pull in orderedPulls"/>
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
    this.updatePulls();
  },
  updated: function() {
    setTimeout(() => {
      this.updatePulls();
    }, 5000);
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
      fetch((err, result) => {
        if (!err) {
          result.forEach((pull) => {
            this.$set(this.pulls, pull.number, {
              number: pull.number,
              pull: pull.pull,
              comments: pull.comments,
              lastUpdate: pull.lastUpdate,
            });
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
