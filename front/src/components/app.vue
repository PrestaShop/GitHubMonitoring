<template>
  <div id="app">
    <div id="pr-list">
        <pr :key="pull.number" :pull="pull" v-for="pull in pulls"/>
    </div>
  </div>
</template>

<script>
const pr = require('./pr');

module.exports = {
  computed: {
    pulls: function() {
      return this.$store.state.pulls;
    },
  },
  components: {
    pr,
  },
};
</script>
