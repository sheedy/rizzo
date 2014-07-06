// ------------------------------------------------------------------------------
//
// Authenticator
//
// This script handles checking whether the user is signed in and generating
// the sign in/join links OR profile pic with sub menu (along with the right hand
// nav that appears on mobile).
//
// ------------------------------------------------------------------------------

define([ "jquery", "lib/utils/template" ], function($, Template) {
  "use strict";

  var Authenticator = function() {
    this.statusUrl = "https://auth.lonelyplanet.com/users/status";

    this.init();
  },
  _this;

  // -------------------------------------------------------------------------
  // Initialise
  // -------------------------------------------------------------------------
  Authenticator.prototype.init = function() {
    _this = this;

    if (!this.$template) {
      this.templateContainer = $("#js-user-nav-template");
      this.$template = $(this.templateContainer.html());
    }

    var bearer = this._getBearer();

    if (bearer) {
      $.ajax({
        url: this.statusUrl,
        dataType: "json",
        data: { claims: "sub preferred_username picture current_sign_in_at unread_message_count" },
        headers: { Authorization: "Bearer ".concat(bearer) },
        crossDomain: true,
        error: this._updateStatus,
        success: this._updateStatus
      });
    } else {
      this._createUserLinks();
    }
  };

  // -------------------------------------------------------------------------
  // Private Functions
  // -------------------------------------------------------------------------
  Authenticator.prototype._getBearer = function() {
    if (window.lp.getCookie) {
      return window.lp.getCookie("lpBearer");
    } else {
      return null;
    }
  };

  Authenticator.prototype._createUserLinks = function() {
    var template = _this.$template.filter(".js-user-signed-out-template").html();

    // Remove any previously generated user navigation.
    $(".js-user-signed-in, .js-user-signed-out").remove();
    _this.templateContainer.after(template);
  };

  Authenticator.prototype._createUserMenu = function() {
    var template = _this.$template.filter(".js-user-signed-in-template").html(),
        $rendered = $(Template.render(template, window.lp.user)),
        $userAvatar;

    if (window.lp.user.unread_message_count > 0) {
      $rendered.find(".js-unread-messages").removeClass("is-hidden");
    }

    // Remove any previously generated user navigation.
    $(".js-user-signed-in, .js-user-signed-out").remove();
    _this.templateContainer.after($rendered);

    $userAvatar = $(".js-user-avatar");
    $userAvatar.attr("src", $userAvatar.data("src"));
  };

  Authenticator.prototype._updateStatus = function(userStatus) {
    if (_this._updateStatusValid(userStatus)) {
      window.lp.user = userStatus;
      _this._createUserMenu();
    } else {
      _this._createUserLinks();
    }
  };

  Authenticator.prototype._updateStatusValid = function(userStatus) {
    return (userStatus && userStatus.current_sign_in_at && userStatus.preferred_username);
  };

  // Self instantiate
  new Authenticator();

  return Authenticator;

});
