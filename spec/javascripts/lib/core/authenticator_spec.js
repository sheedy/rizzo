require([ "jquery", "public/assets/javascripts/lib/core/authenticator" ], function($, Authenticator) {

  "use strict";

  describe("Authenticator", function() {

    var auth,
        lp = {},
        loggedInStatus;

    loggedInStatus = {
      sub: 1,
      preferred_username: "foobar",
      picture: "/foo.jpg",
      unread_message_count: 5,
      current_sign_in_at: '2014-07-06 15:05:35 +0100'
    };

    $("body").append("<div id='js-user-nav-template' />");

    beforeEach(function() {
      var $fixtures;

      loadFixtures("authenticator.html");
      $("#js-user-nav-template").html($("#jasmine-fixtures").html());

      auth = new Authenticator();
    });

    describe("config", function() {

      it("always checks the status from the live site", function() {
        expect(auth.statusUrl).toBe("https://auth.lonelyplanet.com/users/info");
      });
    });

    describe("userinfo request", function() {
      beforeEach(function() {
        window.lp.getCookie = null;
        spyOn($, 'ajax');
      });

      it('performed when bearer exists', function() {
        spyOn(window.lp, 'getCookie').andReturn('foo');
        auth.init();
        expect($.ajax).toHaveBeenCalled();
      });

      it('not performed when bearer missing', function() {
        spyOn(window.lp, 'getCookie').andReturn(null);
        auth.init();
        expect($.ajax).not.toHaveBeenCalled();
      });
    });

    describe("signed out", function() {

      beforeEach(function() {
        auth._updateStatus();
      });

      it("generates the sign in / join links for both mobile and wide views", function() {
        expect($(".js-user-sign_in").length).toBe(2);
        expect($(".js-user-sign_up").length).toBe(2);
      });

      it("defines all link urls correctly", function() {
        expect($(".js-user-sign_in").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_in");
        expect($(".js-user-sign_up").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_up");
      });
    });

    describe("updating signed in status", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("sets up window.lp.user", function() {
        expect(window.lp.user).toBe(loggedInStatus);
      });
    });

    describe("signed in", function() {

      beforeEach(function() {
        auth._updateStatus(loggedInStatus);
      });

      it("shows the user's avatar", function() {
        expect($(".nav__item--user-avatar").attr("src")).toBe("https://auth.lonelyplanet.com/foo.jpg");
      });

      it("adds the username to the dropdown menu", function() {
        expect($(".nav__submenu__title").text()).toBe("foobar");
      });

      it("adds the username to the responsive menu", function() {
        expect($(".nav--offscreen__title").text()).toBe("foobar");
      });

      it("adds all the dropdown menu items", function() {
        expect($(".nav__submenu__link").length).toBe(5);
      });

      it("adds the responsive menu items", function() {
        expect($(".wv--nav--inline .nav__item").length).toBe(5);
      });

      it("defines all link urls correctly", function() {
        expect($(".js-user-activities").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/1/activities");
        expect($(".js-user-messages").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/profiles/1/messages");
        expect($(".js-user-profile").attr("href")).toBe("https://auth.lonelyplanet.com/profiles/1");
        expect($(".js-user-settings").attr("href")).toBe("https://www.lonelyplanet.com/thorntree/forums/settings");
        expect($(".js-user-sign_out").attr("href")).toBe("https://auth.lonelyplanet.com/users/sign_out");
      });
    });

    describe("unread message", function() {

      beforeEach(function() {
        loggedInStatus.unreadMessageCount = 5;
        auth._updateStatus(loggedInStatus);
      });

      it("shows the notification badge with the number of unread messages in it", function() {
        expect($(".notification-badge:visible").text()).toBe("5");
      });

      it("shows the number of unread messages on the submenu item", function() {
        expect($(".nav__submenu__notification:visible").text()).toBe("(5)");
      });
    });
  });
});
