<template>
  <div class="event" :class="getClasses">
    <div class="head">
      <div class="title">{{ eventTitle }}</div>
      <div class="user">
        <img class="avatar" :src="event.user.avatar_url">
        <div class="login">{{ event.user.login }}</div>
      </div>
    </div>
    <div class="body">
      <div class="title">
        <div class="number"></div>
        <div class="text"></div>
      </div>
      <div class="user">
        <img class="avatar" src="">
        <div class="login"></div>
      </div>
      <div class="lines">
        <div class="add"></div>
        <div class="sub"></div>
      </div>
      <div class="description"></div>
    </div>
  </div>
</template>

<script>
const pr = require('./pr');

module.exports = {
  props: ['event'],
  computed: {
    getClasses: function() {
      const classes = {};
      classes[this.event.name] = true;
      classes[this.event.action] = true;
      return classes;
    },
    eventTitle: function() {
      switch (`${this.event.name}.${this.event.action}`) {
        case 'watch.started':
          return 'New Star';
        case 'fork.forkee':
          return 'Repo forked';
      };
    },
  },
};
</script>
