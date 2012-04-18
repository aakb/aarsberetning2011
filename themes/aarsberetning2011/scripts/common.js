(function ($) {
  /**
  * This function slides in the next page in the menu. If the page is more than
  * one away it will slide faster. It loads content via ajax and saves a local 
  * copy to not ask the server more than once for content.
  * 
  * It assumes that the target for the animation is the ul with a tags inside 
  * li's.
  * 
  * Pattern: Revealig module
  * 
  * Functions:
  *   init - Init the object and takes an object litteral with menu 
  *          (css selector), content (css selector), speed (page transition 
  *          speed).
  *   start - Activate the animations (mostly for development).
  *   stop - End the animation (mostly for development).
  */
  var slider = (function() {
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

      // Save current page.
      saveData($(options.content),  getHashKey());

      // Get menu as jquery object.
      target = $(options.menu);
    }

    // Attache event listners to the target list.
    function start() {
      $(target, 'a').live('click', function(event) {
        event.stopPropagation();
        loadPage($(event.target).attr('href'));
        return false;
      });
    }

    function stop() {
      // @TODO: remove the event binding form the taget list.
    }

    // Used to store page content.
    function saveData(data, key) {
      pages[key] = data;
      addHashtag(key);
    }

    // Return stored data based on key.
    function loadData(key) {
      return pages[key];
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
        }
        else {
          hash = url; 
        }
      }      
      return hash;
    }

    function addHashtag(hash) {
      hash = hash.substr(1);
      window.location.hash = hash;
    }

    function loadPage(url) {
      console.log(url);
    }

    function animate() {
      
    }

    return {
      init : init,
      start: start,
      stop: stop
    };
  }());

  $(document).ready(function() {


    // Set variables.
    var menu = $('.region-menu nav .menu');
    var menuItems = $('a', menu).not('.arrow-nav');
    var content = $('.region-content-inner');

    //----- Add previous and next arrows.
    var arrow = menu.find('.arrow-nav');

    if (!arrow.lenght) {
      menu.prepend('<li><span class="arrow-nav prev"><a href="#previous">'+Drupal.t('Back')+'</a></span></li>');
      menu.append('<li><span class="arrow-nav next"><a href="#next">'+Drupal.t('Forward')+'</a></span></li>');    
    }

    slider.init();
    slider.start();


    //----- Define functions.

    // Function for click event.
  //  function gotoIndex(elem, target, index) {
  //    elem.click(function() {
  //      if (target.contents().length) {
  //        content.trigger('goto', index);
  //      } else {
  //        $.get($(this).attr('href'), function(data) {
  //          target.append(data);
  //          content.trigger('goto', index);
  //        });
  //      }
  //
  //      // Remove active classes.
  //      menuItems.removeClass('active');
  //
  //      // Add active class.
  //      $(this).addClass('active');
  //
  //      return false;
  //    });
  //  }
  //
  //  // Create List.
  //  content.append('<ul>');
  //
  //  menuItems.each(function(index) {
  //
  //    // Create list items.
  //    $('ul', content).append('<li rel=' + index + '>');
  //
  //    // Set element.
  //    var elem = $('.content ul [rel=' + index + ']');
  //
  //    $(this).click(function() {
  //      if (elem.contents().length) {
  //        $('.content').trigger('goto', index);
  //      } else {
  //        $.get($(this).attr('href'), function(data) {
  //          elem.append(data);
  //          $('.content').trigger('goto', index);
  //        });
  //      }
  //
  //      return false;
  //    });
  //
  //  });
  //
  //  // Set width on list so the slide effect to works.
  //  $('ul', content).css('width', 1256 * $('ul li', content).length)
  //
  //  // Previous/next click events.
  //  $('a.prev', menu).click(function() {
  //    $('.content').trigger('prev');
  //  });
  //
  //  $('a.next', menu).click(function() {
  //
  //    var activeElem = $('.active',menu);
  //
  //    if (activeElem.parent().next().contents().length) {
  //      $('.content').trigger('goto', activeElem.parent().next().attr('rel'));
  //    } else {
  //      $.get(activeElem.parent().next().find('a').attr('href'), function(data) {
  //        activeElem.parent().next().append(data);
  //        $('.content').trigger('goto', activeElem.parent().next().attr('rel'));
  //      });
  //    }
  //
  //    return false;
  //
  //  });
  //
  //  // Load default content.
  //  $('ul li[rel=0]', content).load('page1.html');
  //
  //  // Add serialScroll (http://flesler.blogspot.com/2008/02/jqueryserialscroll.html).
  //  $('.wrapper').serialScroll({
  //		target:'.content',
  //		items:'li',
  //		next:'a.next',
  //		prev:'a.prev',
  //		force:true,
  //		stop:true,
  //		lock:false,
  //		cycle:false,
  //		jump: true,
  //    lazy: true,
  //		onAfter:function(pos,pane){
  //      // Remove active classes.
  //      menuItems.removeClass('active');
  //
  //      // Add active class.
  //      $(menuItems[$(pos).attr('rel')]).addClass('active');
  //		}
  //	});

  });
}) (jQuery);