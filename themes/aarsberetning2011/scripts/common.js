(function ($) {
  /**
  * This function slides in the next page in the menu. If the page is more than
  * one away it will slide faster. It loads content via ajax and saves a local 
  * copy to not ask the server more than once for content.
  * 
  * It assumes that the target for the animation is the ul with a tags inside 
  * li's.
  * 
  * Pattern: Revealing module
  * 
  * Functions:
  *   init - Init the object and takes an object litteral with menu 
  *          (css selector), content (css selector), speed (page transition 
  *          speed).
  *   start - Activate the animations (mostly for development).
  *   stop - End the animation (mostly for development).
  */
  var slider = (function() {
    var menu = null;
    var target = null;
    var pages = {};
    var options = {
      menu: '.menu-name-main-menu ul',
      content: '.region-content-inner',
      speed: 100
    };

    // Init the object and get options.
    function init(opt) {
      // @TODO: loop over options an ensure that only the one parsed is overridden.
      if (opt !== undefined) {
        options = opt;
      }

      // @TODO: Load page if location.hash is defined.

      // Save current page.
      saveData($(options.content).html(),  getHashKey());

      // Get menu as jquery object.
      menu = $(options.menu);

      // Get target.
      target = $(options.content);

      // Add navigation items.
      menu.prepend('<li><span class="arrow-nav prev"><a href="#previous">'+Drupal.t('Back')+'</a></span></li>');
      menu.append('<li><span class="arrow-nav next"><a href="#next">'+Drupal.t('Forward')+'</a></span></li>');
    }

    // Attache event listners to the target list.
    function start() {
      menu.delegate('.leaf a', 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var link = $(event.target); 
        loadPage(link.attr('href'), link);
      });

      // Add listerns to navigation arrows.
      menu.delegate('.arrow-nav', 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var link = $(event.target);
        if (link.attr('href') == '#previous') {
          prev();
        }
        else {
          next();
        }
      });
    }

    // Used to store page content.
    function saveData(data, key) {
      if (!$('body').hasClass('logged-in')) {
        pages[key] = data;
        addHashtag(key);
      }
    }

    // Return stored data based on key.
    function loadData(key) {
      if (pages[key] !== undefined) {
        return pages[key];
      }
      return null;
    }

    // Build hash key based on url, if non provied current path will be used.
    function getHashKey(url) {
      var hash = '';
      if (url === undefined) {
        url = window.location.pathname == '/' ? '/frontpage' : window.location.pathname;
        hash = url.substr(1);
      }
      else {
        if (url.charAt(0) == '/') {
          hash = url.substr(1);
          if (hash == '') {
            hash = 'frontpage';
          }
        }
        else {
          hash = url;
        }
      }
      return hash;
    }

    function addHashtag(hash) {
      window.location.hash = hash;
    }

    function loadPage(url, link) {
      // Try to get content from cache.
      var key = getHashKey(url);
      var content = loadData(key);
      if (content !== null) {
        animatePageLoad(content, link);
      }
      else {
        // The ajax query string is used to change theme in the backend.
        $.get(url + '?ajax=1', function(data) {
          animatePageLoad(data, link);
          saveData(data, key);
        });
      }
      addHashtag(key);
    }

    function animatePageLoad(content, link) {
      // Update active class in the menu.
      $('a', menu).removeClass('active');
      link.addClass('active');

      // @TODO: animate the whole thing.
      target.html(content);
    }

    // Find the next element in the menu to load (used by next link).
    function next() {
      var current = $('a.active', menu);
      if (current.length == 1) {
        var link = current;
        var list = current.parent().parent();
        if (list.hasClass('last')) {
          link = $('.first a', list.parent());
        }
        else {
          link = $('a', list.next());
        }
        loadPage(link.attr('href'), link);
      }
    }

    // Find the previous element in the menu to load (used by prev link).
    function prev() {
      var current = $('a.active', menu);
      if (current.length == 1) {
        var link = current;
        var list = current.parent().parent();
        if (list.hasClass('first')) {
          link = $('.last a', list.parent());
        }
        else {
          link = $('a', list.prev());
        }
        loadPage(link.attr('href'), link);
      }
    }

    // Return public methods.
    return {
      init : init,
      start: start
    };
  }());

  // Load the moduel and start the fun.
  $(document).ready(function() {
    slider.init();
    slider.start();
  });
}) (jQuery);