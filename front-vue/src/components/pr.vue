<template>
  <div :key="number" class="issue" :class="status">
    <img class="avatar" v-if="assignee" :src="assignee.avatar_url"/>
    <i class="material-icons not-assignee"v-if="!assignee">error_outline</i>
    <div class="number">{{ number }}</div>
  </div>
</template>

<script>
const configuration = require('../../configuration');

const delays = configuration.delays;
const ignoreUser = configuration.ignoreUser;
const team = configuration.team;

const DEBUG_PR = 7439;

module.exports = {
  props: ['pull', 'assignee'],
  data: function() {
    return this.getDetails();
  },
  methods: {
    getLastComment: function() {
      const comments = this.$options.propsData.pull.comments;
      let lastComment = null;
      if (comments) {
        comments.forEach((comment) => {
          // Do not read the comments from ignored people
          if (ignoreUser.indexOf(comment.login) === -1) {
            lastComment = comment;
          }
        });
        return lastComment;
      }
      return null;
    },
    lastCommentIsFromTeam: function() {
      const pullRequestUser = this.$options.propsData.pull.pull.user.login;
      const comment = this.getLastComment();
      if (comment) {
        if (this.$options.propsData.pull.pull.number == DEBUG_PR) {
          console.log('Last comment user', comment.user.login);
          console.log('Last comment user from team', team.indexOf(comment.user.login) != -1);
          console.log(
            team.indexOf(comment.user.login) != -1
            && comment.user.login !== pullRequestUser
          );
        }
        // If the last comment user is the creator of the pull request, he will not be included as a team reviewer (for
        // example when the creator is someone from the team)
        if (
          team.indexOf(comment.user.login) != -1
          && comment.user.login !== pullRequestUser
        ) {
            return true;
        }
      }
      return false;
    },
    getDetails: function() {
      const pull = this.$options.propsData.pull.pull;

      let assignee = pull.assignee;
      if (pull.merged_at) {
        status = 'merged';
        if (!assignee) {
          assignee = pull.merged_by;
        }
      }

      return {
        number: pull.number,
      };
    },
  },
  computed: {
    status: function() {
      const pull = this.$options.propsData.pull.pull;
      const lastComment = this.getLastComment();
      const lastCommentFromTeam = this.lastCommentIsFromTeam();
      const timeSinceCreation = Date.now() - (new Date(pull.created_at)).getTime();
      const timeSinceLastComment = lastComment
        ? Date.now() - (new Date(lastComment.created_at)).getTime()
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
        (lastComment === null && timeSinceCreation < delays.responseTimeAlert)
        || (!lastCommentFromTeam && timeSinceLastComment < delays.responseTimeAlert)
        || (lastCommentFromTeam && timeSinceLastComment < delays.waitingForUserResponseAlert)
      ) {
        status = 'warning';
      }

      if (pull.merged_at) {
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
