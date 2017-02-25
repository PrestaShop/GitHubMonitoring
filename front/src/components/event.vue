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
        <div class="number">{{ event.number }}</div>
        <div class="text">{{ event.title }}</div>
      </div>
      <div v-if="event.merged_by" class="merged_by">
        <img class="avatar" :src="event.merged_by.avatar_url">
        <div class="login">{{ event.merged_by.login }}</div>
      </div>
      <div class="lines">
        <div class="add">{{ event.additions }}</div>
        <div class="sub">{{ event.deletions }}</div>
      </div>
      <div v-html="event.body" class="description"></div>
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
        case 'pull_request.opened':
          return 'New pull request';
        case 'pull_request.merged':
          return 'Pull request merged';
        case 'issue_comment.created':
          return 'New comment';
      };
    },
  },
};
</script>
