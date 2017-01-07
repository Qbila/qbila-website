/**
 * The global namespace for Qbila utils.
 * @namespace DG.utils
 */

var DG = DG || {};

DG.utils = {};

/**
 * Convert a camelCase string to dash-separated string
 * @param {String} str
 */
DG.utils.camelToDash = function (str) {
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Convert an underscore-separated string to dash-separated string
 * @param {String} str
 */
DG.utils.underscoreToDash = function (str) {
  return str.replace('_', '-');
};

/**
 * Convert a dash separated string to camelCase.
 * @param {String} str
 */
DG.utils.dashToCamel = function (str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

/**
 * Convert a string to camelCase and remove spaces.
 * @param {String} str
 */
DG.utils.camelCaseify = function(str) {
  str = this.dashToCamel(str.replace(' ', '-'));
  str = str.slice(0,1).toLowerCase() + str.slice(1);
  return str;
};

/**
 * Trim a sentence to a specified amount of words and append an ellipsis.
 * @param {String} s - Sentence to trim.
 * @param {Number} numWords - Number of words to trim sentence to.
 */
DG.utils.trimWords = function(s, numWords) {

  if (!s)
    return s;

  var expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
};

/**
 * Trim a block of HTML code to get a clean text excerpt
 * @param {String} html - HTML to trim.
 */
DG.utils.trimHTML = function (html, numWords) {
  var text = DG.utils.stripHTML(html);
  return DG.utils.trimWords(text, numWords);
};

/**
 * Capitalize a string.
 * @param {String} str
 */
DG.utils.capitalise = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

DG.utils.t = function(message) {
  var d = new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
};

DG.utils.nl2br = function(str) {
  var breakTag = '<br />';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};

DG.utils.scrollPageTo = function(selector) {
  $('body').scrollTop($(selector).offset().top);
};

DG.utils.getDateRange = function(pageNumber) {
  var now = moment(new Date());
  var dayToDisplay=now.subtract(pageNumber-1, 'days');
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
};

//////////////////////////
// URL Helper Functions //
//////////////////////////

/**
 * Returns the user defined site URL or Meteor.absoluteUrl
 */
DG.utils.getSiteUrl = function () {
  return Settings.get('siteUrl', Meteor.absoluteUrl());
};

/**
 * The global namespace for Qbila utils.
 * @param {String} url - the URL to redirect
 */
DG.utils.getOutgoingUrl = function (url) {
  return DG.utils.getSiteUrl() + "out?url=" + encodeURIComponent(url);
};

// This function should only ever really be necessary server side
// Client side using .path() is a better option since it's relative
// and shouldn't care about the siteUrl.
DG.utils.getRouteUrl = function (routeName, params, options) {
  options = options || {};
  var route = FlowRouter.path(
    routeName,
    params || {},
    options
  );
  return route;
};

DG.utils.getSignupUrl = function() {
  return this.getRouteUrl('atSignUp');
};

DG.utils.getSigninUrl = function() {
  return this.getRouteUrl('atSignIn');
};

//TODO: fix this
DG.utils.getPostCommentUrl = function(postId, commentId) {
  // get link to a comment on a post page
  return this.getRouteUrl('post_page_comment', {
    _id: postId,
    commentId: commentId
  });
};

DG.utils.slugify = function (s) {
  var slug = getSlug(s, {
    truncate: 60
  });

  // can't have posts with an "edit" slug
  if (slug === "edit") {
    slug = "edit-1";
  }

  return slug;
};

DG.utils.getUnusedSlug = function (collection, slug) {
  var suffix = "";
  var index = 0;

  // test if slug is already in use
  while (!!collection.findOne({slug: slug+suffix})) {
    index++;
    suffix = "-"+index;
  }

  return slug+suffix;
};

DG.utils.getShortUrl = function(post) {
  return post.shortUrl || post.url;
};

DG.utils.getDomain = function(url) {
  var urlObject = Npm.require('url');
  return urlObject.parse(url).hostname.replace('www.', '');
};

DG.utils.invitesEnabled = function() {
  return Settings.get("requireViewInvite") || Settings.get("requirePostInvite");
};

// add http: if missing
DG.utils.addHttp = function (url) {
  if (url.substring(0, 5) !== "http:" && url.substring(0, 6) !== "https:") {
    url = "http:"+url;
  }
  return url;
};

/////////////////////////////
// String Helper Functions //
/////////////////////////////

DG.utils.cleanUp = function(s) {
  return this.stripHTML(s);
};

DG.utils.sanitize = function(s) {
  // console.log('// before sanitization:')
  // console.log(s)
  if(Meteor.isServer){
    s = sanitizeHtml(s, {
      allowedTags: [
        'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',
        'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',
        'tbody', 'tr', 'th', 'td', 'pre', 'img'
      ]
    });
    // console.log('// after sanitization:')
    // console.log(s)
  }
  return s;
};

DG.utils.stripHTML = function(s) {
  return s.replace(/<(?:.|\n)*?>/gm, '');
};

DG.utils.stripMarkdown = function(s) {
  var htmlBody = marked(s);
  return DG.utils.stripHTML(htmlBody);
};

// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
DG.utils.checkNested = function(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments);
  obj = args.shift();

  for (var i = 0; i < args.length; i++) {
    if (!obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
};

DG.log = function (s) {
  if(Settings.get('debug', false))
    console.log(s);
};

// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
DG.getNestedProperty = function (obj, desc) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
};

DG.isSmallScreen = function(){
  if(!!window.matchMedia){
    return window.matchMedia("only screen and (max-width: 760px)");
  } else {
    return {matches: true};
  }
};


DG.utils.modalMessages = function(message, type, timeout){
  // append modal code the dom
  if( _.isEmpty( document.getElementById( 'modalMessages' ) ) ) {
    $("body")
      .append('<div class="modal fade a-modalMessages" id="modalMessages" tabindex="-1" role="dialog" aria-labelledby="modalMessagesLabel">'+
                '<div class="modal-dialog">'+
                  '<div class="modal-content">'+
                  '</div>'+
                '</div>'+
              '</div>');
  }

  // change the content
  $("#modalMessages .modal-content").html("<div class='alert alert-" + type + "'>" + message + "</div>");

  $('#modalMessages').modal();

  if (!!timeout){
    setTimeout(function(){
      $('#modalMessages').modal('hide');
    }, timeout);
  }
  // render
};


DG.utils.addCommasAsPerIndianNumberSystem = function(inputValue) {
  // coerce to string
  inputValue = inputValue + "";
  var value = inputValue.split('.')[0];
  var decimalPart = inputValue.split('.')[1];
  var length = value.length;
  var resultString = "";

  while(value.length > 0) {
    if(length == value.length && value.length > 3) {
      resultString = "," + value.substring(value.length-3, value.length) + resultString;
      value = value.substring(0, value.length-3);
    } else if(value.length > 2 && length > 3) {
      resultString = "," + value.substring(value.length-2, value.length) + resultString;
      value = value.substring(0, value.length-2);
    } else {
      resultString = value + resultString;
      value = '';
    }
  }

  if(_.isUndefined(decimalPart)){
    return resultString;
  }

  return resultString + '.' + decimalPart;
}
