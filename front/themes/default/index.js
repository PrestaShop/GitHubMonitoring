require('./style/main.scss');
require('./node_modules/octicons/build/octicons.css');

const octicons = require('octicons');
const $ = require('jquery');

let delaiShort = 45;

$('body').on('DOMNodeInserted', '#event-list', function(event) {
  const target = $(event.target);
  if (!target.is('.event')) {
    return;
  }

  if (target.is('.watch.started')) {
    target.find('.head').find('.title').before(octicons['star'].toSVG());
  } else if (target.is('.fork.forkee')) {
    target.find('.head').find('.title').before(octicons['repo-forked'].toSVG());
  } else if (target.is('.pull_request.opened')) {
    target.find('.head').find('.title').before(octicons['git-pull-request'].toSVG());
  } else if (target.is('.pull_request.merged')) {
    target.find('.head').find('.title').before(octicons['git-merge'].toSVG());
  } else if (target.is('.issue_comment.created')) {
    target.find('.head').find('.title').before(octicons['comment'].toSVG());
  } else {
    target.hide();
  }

  target.find('.lines').prepend(octicons['code'].toSVG());

  target.addClass('animateShow');
  setTimeout(() => {
    target.removeClass('animateShow').addClass('animateHide');
  }, delaiShort * 1000);
});

module.exports.configuration = {
  max_events_displayed: 1,
  delay_between_events: 90,
};
