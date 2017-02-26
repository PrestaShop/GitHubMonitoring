<template>
  <div :key="pull.number" class="issue" :class="status">
    <img class="avatar" v-if="avatar_url" :src="avatar_url"/>
    <i class="material-icons not-assignee"v-if="!avatar_url">error_outline</i>
    <div class="number">{{ pull.number }}</div>
  </div>
</template>

<script>
const configuration = require('../configuration');

const delays = configuration.delays;
const ignoreUser = configuration.ignoreUser;

module.exports = {
  props: ['pull'],
  computed: {
    avatar_url: function() {
      return this.pull.assignee.avatar_url
        ? this.pull.assignee.avatar_url
        : this.pull.merged ? this.pull.merged_by.avatar_url : null;
    },
    status: function() {
      const pull = this.pull;
      const timeSinceCreation = Date.now() - (new Date(pull.created_at)).getTime();
      const timeSinceLastComment = pull.last_comment.created_at
        ? Date.now() - (new Date(pull.last_comment.created_at)).getTime()
        : Date.now();

      let status;
      if (pull.merged) {
        status = 'merged';
      } else if (
        timeSinceCreation < delays.responseTimeWarning
        || timeSinceLastComment < delays.responseTimeWarning
      ) {
        status = 'ok';
      } else if (
        timeSinceCreation < delays.responseTimeAlert
        || timeSinceLastComment < delays.responseTimeAlert
      ) {
        status = 'warning';
      } else {
        status = 'error';
      }

      return {
        ok: status == 'ok',
        warning: status == 'warning',
        error: status == 'error',
        merged: status == 'merged',
      }
    },
  },
};
</script>
