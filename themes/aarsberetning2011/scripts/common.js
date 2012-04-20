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
    var $menu = undefined;
    var $content = undefined;
    var isRunningAnimating = false;
    var cache = {};

    var options = {
      menu: '.menu-name-main-menu ul',
      content: '#zone-content-wrapper', // Slider container.
      outer: '#section-content', // Overflow container.
      fadeSpeed: 600,
      slideSpeed: 1000
    };

    // Init the object and get options.
    function init(opt) {
      // @TODO: loop over options an ensure that only the one parsed is overridden.
      if (opt !== undefined) {
        options = opt;
      }

      // Extract background information.
      $content = $(options.content);
      var bgStyle = 'background-image:' + $content.css('background-image').replace('"', "'") + ';background-size:' + $content.css('background-size') + ';';

      // Build wrapper content.
      var outer = $(options.outer);
      outer.css({'overflow-x':'hidden','overflow-y':'auto'});      
      $content.css({'width': '200%', 'position': 'relative'});
   
      var slide = buildSlide($content.html(), bgStyle);
      saveData($content.html(), bgStyle, getHashKey());
      $content.html(slide);
      
      // Add information to current slide.
      $('.slide', $content).addClass('current');

      // Remove old background.
      $content.css('background-image', 'none');

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
        if (!(url == '/' && $('body').hasClass('front'))) {
          var link = $('a[href="' + url + '"]', $menu);
          fetchPage(url, link, 'fade');
        }
      }

      // Attache event listners to the target list.       
      $menu.delegate('.leaf a', 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (isRunningAnimating) {return;}
        isRunningAnimating = true;
        var link = $(event.target); 
        fetchPage(link.attr('href'), link, 'fade');
      });

      // Add listerns to navigation arrows.
      $menu.delegate('.arrow-nav', 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (isRunningAnimating) {return;}
        isRunningAnimating = true;
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
    function saveData(content, bgStyle, key) {
      console.log(bgStyle);
      var data = {'background': bgStyle, 'content' : content};
      cache[key] = data;
      return data;
    }

    // Return stored data based on key.
    function loadData(key) {
      if (cache[key] !== undefined) {
        return cache[key];
      }
      return null;
    }

    // Ajax call to get page content.
    function fetchPage(url, link, direction) {
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
          data = saveData(data.content, data.background, key);
          animatePageLoad(data, link, direction);
        });
      }
      addHashtag(key);
    }

    // Build slide div.
    function buildSlide(content, bgStyle) {
      console.log(bgStyle);
      if (bgStyle === undefined) {bgStyle = '';}
      return '<div class="slide" style="width:50%;float:left;' + bgStyle + '">' + content + '</div>';
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

    // Update active class in the menu.
    function updateActiveMenu(link) {
      $('a', $menu).removeClass('active');
      link.addClass('active');
    }
    
    // Animate the page load (slide/fade).
    function animatePageLoad(data, link, direction) {
      var currentPage = $('.current', $content);
      
      // Fix content by wrapping in slide div.
      var slide = $(buildSlide(data.content, data.background)).addClass(direction);

      if (direction == 'left') {
        $content.prepend(slide);
        $content.css('left', '-100%').animate({left:'0%'}, options.slideSpeed, function(){
          currentPage.remove();
          slide.removeClass('left').addClass('current');
          isRunningAnimating = false;
        });
      }
      else if (direction == 'right') {
        $content.append(slide);
        $content.animate({left:'-100%'}, options.slideSpeed, function(){
          currentPage.remove();
          $content.css('left', '0')
          slide.removeClass('right').addClass('current');
          isRunningAnimating = false;
        });
      }
      else {
        // Remove current slide.
        currentPage.remove();
        
        // Hide slide, append and fade in the slide.
        slide.hide();
        $content.append(slide);
        slide.fadeIn(options.fadeSpeed, function() {
          // Work around when to faste menu clicks, which lead to 0.001232 opacity).
          slide.css('filter', 'alpha(opacity=100)')
          slide.css('opacity', '1');
          slide.removeClass('fade').addClass('current');
          isRunningAnimating = false;
        });
      }
      updateActiveMenu(link);
      addHashtag(getHashKey(link.attr('href')));
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
        fetchPage(link.attr('href'), link, 'right');
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
        fetchPage(link.attr('href'), link, 'left');
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
    // Don't run code for logged in users, as it give problems with node edit
    // and messages from the system.
    if (!$('body').hasClass('logged-in')) {
      slider.init();
      slider.start();
    }
  });
}) (jQuery);