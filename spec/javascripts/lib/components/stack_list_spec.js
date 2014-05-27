require([ "public/assets/javascripts/lib/page/left_nav.js" ], function(StackList) {

  describe("StackList", function() {

    var config = {
      el: "#js-stack-list-aside",
      list: ".js-neighbourhood-item,.js-facet,.js-descendant-item,.js-stack-collection"
    };

    describe("Object", function() {
      it("is defined", function() {
        expect(StackList).toBeDefined();
      });
    });

    describe("Initialising", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.stackList = new StackList(config);
      });

      it("has default options", function() {
        expect(stackList.config).toBeDefined();
      });
    });

    describe("Not initialising", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.stackList = new StackList({
          el: ".foo"
        });
        spyOn(stackList, "_init");
      });

      it("When the parent element does not exist", function() {
        expect(stackList._init).not.toHaveBeenCalled();
      });
    });

    describe("when the user clicks on a stack", function() {
      beforeEach(function() {
        loadFixtures("stack_list.html");
        window.stackList = new StackList(config);
      });

      it("triggers the page request event", function() {
        var element = stackList.$el.find(".js-neighbourhood-item");
        var params = {
          url: element.attr("href")
        };
        var spyEvent = spyOnEvent(stackList.$el, ":page/request");
        element.trigger("click");
        expect(":page/request").toHaveBeenTriggeredOnAndWith(stackList.$el, params);
      });

      describe("when the user clicks on a stack", function() {
        beforeEach(function() {
          loadFixtures("stack_list.html");
          window.stackList = new StackList(config);
        });

        it("sets the nav item as current", function() {
          var element = $(".js-neighbourhood-item");
          stackList._select(element);
          expect(element).toHaveClass("is-active");
          expect($(".js-facet")).not.toHaveClass("is-active");
        });
      });

    });

  });

});
