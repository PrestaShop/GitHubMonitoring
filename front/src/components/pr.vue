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
const team = configuration.team;

const DEBUG_PR = 7439;

module.exports = {
  props: ['pull'],
  computed: {
    avatar_url: function() {
      return this.pull.assignee_avatar ? this.pull.assignee_avatar : this.pull.merged_by_avatar;
    },
    status: function() {
      const pull = this.pull;
      const lastCommentFromTeam = team.indexOf(pull.last_comment_user) != -1
        && pull.last_comment_user !== pull.user;
      const timeSinceCreation = Date.now() - (new Date(pull.created_at)).getTime();
      const timeSinceLastComment = pull.last_comment_date
        ? Date.now() - (new Date(pull.last_comment_date)).getTime()
        : Date.now();

      // By default a PR is marked as an alert (no defined class)
      let status = 'error';

      // Green if:
      // - The creation date is less than x hours from the responseTimeWarning
      // - The last comment is from someone outside the team and the date is less than x hours from the
      //   responseTimeWarning
      // - The last comment is from someone from the team and the date is less than x hours from the
      //   waitingForUserResponseWarning

      if (
        timeSinceCreation < delays.responseTimeWarning
        || (!lastCommentFromTeam && timeSinceLastComment < delays.responseTimeWarning)
        || (lastCommentFromTeam && timeSinceLastComment < delays.waitingForUserResponseWarning)
      ) {
        status = 'ok';
      }

      // Warn if:
      // - The creation date if less than x hours from the responseAlert if there is no comments
      // - The last comment is from someone outside the team and the date is less than x hours from the responseAlert
      // - The last comment is from someone from the team and the date is less than x hours from the
      //   waitingForUserResponseAlert
      else if (
        (pull.last_comment_user === '' && timeSinceCreation < delays.responseTimeAlert)
        || (!lastCommentFromTeam && timeSinceLastComment < delays.responseTimeAlert)
        || (lastCommentFromTeam && timeSinceLastComment < delays.waitingForUserResponseAlert)
      ) {
        status = 'warning';
      }

      if (pull.merged) {
        status = 'merged';
      }

      if (pull.number == DEBUG_PR) {
        console.log('Statuses:', {
          ok: status == 'ok',
          warning: status == 'warning',
          error: status == 'error',
          merged: status == 'merged',
          'wait-for-user': lastCommentFromTeam && status !== 'merged',
        });
      }

      return {
        ok: status == 'ok',
        warning: status == 'warning',
        error: status == 'error',
        merged: status == 'merged',
        'wait-for-user': lastCommentFromTeam && status !== 'merged',
      }
    },
  },
};
</script>
