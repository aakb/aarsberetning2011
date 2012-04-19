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
    var $menu = null;
    var $content = null;
    var cache = {};

    var options = {
      menu: '.menu-name-main-menu ul',
      content: '#zone-content-wrapper', // Slider container.
      outer: '#section-content', // Overflow container.
      speed: 600
    };

    // Init the object and get options.
    function init(opt) {
      // @TODO: loop over options an ensure that only the one parsed is overridden.
      if (opt !== undefined) {
        options = opt;
      }

      // Wrap target content in slider div and slide div.
      var outer = $(options.outer);
      outer.css('overflow-x', 'hidden');
      $content = $(options.content);
      $content.css('width', '200%');
      $content.css('position', 'relative');
      $content.wrapInner($('<div class="slide current" style="width:50%;float:left;"></div>'));

      // Get menu as jquery object.
      $menu = $(options.menu);

      // Get target.
      $content = $(options.content);

      // Add navigation items.
      $menu.prepend('<li><span class="arrow-nav prev"><a href="#previous">'+Drupal.t('Back')+'</a></span></li>');
      $menu.append('<li><span class="arrow-nav next"><a href="#next">'+Drupal.t('Forward')+'</a></span></li>');
    }
    
    // Start the application.
    function start() {
      // Load page if hash-tag is defined.
      var hash = getHashtag();
      if (hash != '') {
        var url = '/' + (hash == 'frontpage' ? '' : hash);
        if (url == '/' && !$('body').hasClass('front')) {
          var link = $('a[href="' + url + '"]', $menu);
          loadPage(url, link);
        }
      }
      else {
        // No hash-tag found, so we save current page in cache.
        saveData($(options.content).html(),  getHashKey());
      }
      
    // Attache event listners to the target list.       
      $menu.delegate('.leaf a', 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        var link = $(event.target); 
        loadPage(link.attr('href'), link);
      });

      // Add listerns to navigation arrows.
      $menu.delegate('.arrow-nav', 'click', function(event) {
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
        cache[key] = data;
        addHashtag(key);
      }
    }

    // Return stored data based on key.
    function loadData(key) {
      if (cache[key] !== undefined) {
        return cache[key];
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

    // Add hash tag to url.
    function addHashtag(hash) {
      window.location.hash = hash;
    }

    // Get hash tag from url.
    function getHashtag() {
      return window.location.hash.substr(1);
    }

    // Ajax call to get page content.
    function loadPage(url, link, direction) {
      // Try to get content from cache.
      var key = getHashKey(url);
      var content = loadData(key);
      if (content !== null) {
        // Found content in cache.
        animatePageLoad(content, link, direction);
      }
      else {
        // The ajax query string is used to change theme in the backend.
        $.get(url + '?ajax=1', function(data) {
          animatePageLoad(data, link, direction);
          saveData(data, key);
        });
      }
      addHashtag(key);
    }

    // Animate the page load (slide/fade).
    function animatePageLoad(content, link, direction) {
      // Update active class in the menu.
      $('a', $menu).removeClass('active');
      link.addClass('active');

      console.log(direction);

      // @TODO: animate the slide left/right.
      if (direction == 'left') {
        $content.prepend('<div class="slider left" style="width:50%;float:left;">' + content + '</div>');
        $content.css('left', '-100%').animate({left:'0%'}, 2000, function(){
          $('.current', $content).remove();
          $('.left', $content).removeClass('left').addClass('current');
        });
      }
      else if (direction == 'right') {
        
      }
      else {
        var current = $('.current', $content);
        current.hide(0, function() {
          current.html(content);
          current.fadeIn(options.speed, function() {
            // Work around when to faste menu clicks, which lead to 0.001232 opacity).
            current.css('filter', 'alpha(opacity=100)')
            current.css('opacity', '1');
          });
        });
      }
    }

    // Find the next element in the menu to load (used by next link).
    function next() {
      var current = $('a.active', $menu);
      if (current.length == 1) {
        var link = current;
        var list = current.parent().parent();
        if (list.hasClass('last')) {
          link = $('.first a', list.parent());
        }
        else {
          link = $('a', list.next());
        }
        loadPage(link.attr('href'), link, 'right');
      }
    }

    // Find the previous element in the menu to load (used by prev link).
    function prev() {
      var current = $('a.active', $menu);
      if (current.length == 1) {
        var link = current;
        var list = current.parent().parent();
        if (list.hasClass('first')) {
          link = $('.last a', list.parent());
        }
        else {
          link = $('a', list.prev());
        }
        loadPage(link.attr('href'), link, 'left');
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