import React from 'react';
import configuration from '../../Configuration';

const delays = configuration.delays;
const ignoreUser = configuration.ignoreUser;
const team = configuration.team;
const debugPr = 0;

const Pr = React.createClass({
  render() {
    const data = this.props.data;
    const now = new Date().getTime();

    let pullRequestUser = data.from;
    let lastCommentFromTeam = false;
    let lastComment = null;
    if (data.comments) {
      data.comments.forEach((comment) => {
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
    let status = 'error';

    // Green if:
    // - The creation date is less than x hours from the responseTimeWarning
    // - The last comment is from someone outside the team and the date is less than x hours from the
    //   responseTimeWarning
    // - The last comment is from someone from the team and the date is less than x hours from the
    //   waitingForUserResponseWarning
    if (
      (now < (data.created_at + delays.responseTimeWarning))
      || (!lastCommentFromTeam && (lastComment && (now < (lastComment.created_at + delays.responseTimeWarning))))
      || (lastCommentFromTeam && (now < (lastComment.created_at + delays.waitingForUserResponseWarning)))
    ) {
      status = 'ok';
    }

    // Warn if:
    // - The creation date if less than x hours from the responseAlert if there is no comments
    // - The last comment is from someone outside the team and the date is less than x hours from the responseAlert
    // - The last comment is from someone from the team and the date is less than x hours from the
    //   waitingForUserResponseAlert
    else if (
      (now < (data.created_at + delays.responseTimeAlert) && lastComment === null)
      || (!lastCommentFromTeam && (lastComment && (now < (lastComment.created_at + delays.responseTimeAlert))))
      || (lastCommentFromTeam && (now < (lastComment.created_at + delays.waitingForUserResponseAlert)))
    ) {
      status = 'warning';
    }

    let waitForUser = '';
    if (!lastCommentFromTeam && status != 'ok') {
      waitForUser = 'wait-for-user';
    }

    if (data.assignee) {
      return (
        <div className={`issue ${status} ${waitForUser}`}>
          <span className="number">{data.number}</span>
          <img className="avatar" src={data.assignee.avatar_url} />
        </div>
      );
    };

    return (
      <div className={`issue not-assignee ${status}`}>
        <span className="number">{data.number}</span>
      </div>
    );
  },
});

export default Pr;
