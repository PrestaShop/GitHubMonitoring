<template>
  <div id="app">
    <div id="pr-list">
      <pr :key="pull.number" :pull="pull" v-for="pull in pulls"/>
    </div>
    <div id="event-list">
      <event :key="event.number" :event="event" v-for="event in events"/>
    </div>
  </div>
</template>

<script>
const pr = require('./pr');
const event = require('./event');

module.exports = {
  computed: {
    pulls: function() {
      return this.$store.state.pulls;
    },
    events: function() {
      return this.$store.state.displayedEvents;
    },
  },
  components: {
    pr,
    event,
  },
};
</script>
