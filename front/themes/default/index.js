require('./style/main.scss');
require('./node_modules/octicons/build/octicons.css');
const octicons = require('octicons');
const $ = require('jquery');

let delaiShort = 45;

$('body').on('DOMNodeInserted', '#event-list', function(event) {
  const target = $(event.target);
  if (!$(target).is('.event')) {
    return;
  }

  if (target.is('.watch.started')) {
    target.find('.head').find('.title').before(octicons.star.toSVG());
  } else {
    target.hide();
  }

  target.addClass('animateShow');
  setTimeout(() => {
    target.removeClass('animateShow').addClass('animateHide');
  }, delaiShort * 1000);
});

module.exports.configuration = {
  max_events_displayed: 1,
  delay_between_events: 120,
};
