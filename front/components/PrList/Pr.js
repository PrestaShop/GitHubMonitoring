import React from 'react';
import configuration from '../../Configuration';

const delays = configuration.delays;
const ignoreUser = configuration.ignoreUser;
const team = configuration.team;

const Pr = React.createClass({
  render() {
    const data = this.props.data;
    const pull = data.pull;
    const comments = data.comments;
    const now = new Date().getTime();

    let assignee = Object.assign({}, pull.assignee);

    let pullRequestUser = pull.from;
    let lastCommentFromTeam = false;
    let lastComment = null;
    if (comments) {
      comments.forEach((comment) => {
        // Do not read the comments from ignored people
        if (ignoreUser.indexOf(comment.login) === -1) {
          lastComment = comment;
        }
      });
    };

    if (lastComment) {
      // If the last comment user is the creator of the pull request, he will not be included as a team reviewer (for
      // example when the creator is someone from the team)
      if (lastComment.login === pullRequestUser) {
        lastCommentFromTeam = false;
      } else {
        if (team.indexOf(lastComment.login) != -1) {
          lastCommentFromTeam = true;
        }
      }
    }

    // By default a PR is marked as an alert (no defined class)
    let status = ' error';

    // Green if:
    // - The creation date is less than x hours from the responseTimeWarning
    // - The last comment is from someone outside the team and the date is less than x hours from the
    //   responseTimeWarning
    // - The last comment is from someone from the team and the date is less than x hours from the
    //   waitingForUserResponseWarning
    if (
      (now < (pull.created_at + delays.responseTimeWarning))
      || (!lastCommentFromTeam && (lastComment && (now < (lastComment.created_at + delays.responseTimeWarning))))
      || (lastCommentFromTeam && (now < (lastComment.created_at + delays.waitingForUserResponseWarning)))
    ) {
      status = ' ok';
    }

    // Warn if:
    // - The creation date if less than x hours from the responseAlert if there is no comments
    // - The last comment is from someone outside the team and the date is less than x hours from the responseAlert
    // - The last comment is from someone from the team and the date is less than x hours from the
    //   waitingForUserResponseAlert
    else if (
      (now < (pull.created_at + delays.responseTimeAlert) && lastComment === null)
      || (!lastCommentFromTeam && (lastComment && (now < (lastComment.created_at + delays.responseTimeAlert))))
      || (lastCommentFromTeam && (now < (lastComment.created_at + delays.waitingForUserResponseAlert)))
    ) {
      status = ' warning';
    }

    let waitForUser = '';
    if (!lastCommentFromTeam && status != ' ok') {
      waitForUser = ' wait-for-user';
    }

    if (pull.merged_at) {
      status = ' merged';

      if (typeof assignee.avatar_url === 'undefined') {
        assignee = Object.assign({}, pull.merged_by);
      }
    }

    if (typeof assignee.avatar_url !== 'undefined') {
      return (
        <div className={`issue${status}${waitForUser}`}>
          <span className="number">{pull.number}</span>
          <img className="avatar" src={assignee.avatar_url} />
        </div>
      );
    };

    return (
      <div className={`issue not-assignee${status}`}>
        <span className="number">{pull.number}</span>
      </div>
    );
  },
});

export default Pr;
