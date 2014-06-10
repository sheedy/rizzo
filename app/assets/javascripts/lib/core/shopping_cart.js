define([ "jquery" ], function($) {

  "use strict";

  return function ShoppingCart() {

    var cartData = window.lp.getCookie && window.lp.getCookie("shopCartCookie");

    if (!cartData) {
      return;
    }

    cartData = $.parseJSON(cartData);

    if (cartData.A && cartData.A.length) {
      $(".js-user-basket").append("<span class='notification-badge notification-badge--basket-items wv--inline-block js-basket-items'>" + cartData.A.length + "</span>");
    }
  };

});
