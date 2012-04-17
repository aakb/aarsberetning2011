jQuery(document).ready(function($) {

  // Set variables.
  var menu = $('.region-menu nav .menu');
  var menuItems = $('a', menu).not('.arrow-nav');
  var content = $('.region-content-inner');

  //----- Add previous and next arrows.
  menu.prepend('<li><span class="arrow-nav prev"><a href="#previous">Back</a></span></li>');
  menu.append('<li><span class="arrow-nav next"><a href="#next">Forward</a></span></li>');

  //----- Define functions.

  // Function for click event.
  function gotoIndex(elem, target, index) {
    elem.click(function() {
      if (target.contents().length) {
        content.trigger('goto', index);
      } else {
        $.get($(this).attr('href'), function(data) {
          target.append(data);
          content.trigger('goto', index);
        });
      }

      // Remove active classes.
      menuItems.removeClass('active');

      // Add active class.
      $(this).addClass('active');

      return false;
    });
  }

  // Create List.
  content.append('<ul>');

  menuItems.each(function(index) {

    // Create list items.
    $('ul', content).append('<li rel=' + index + '>');

    // Set element.
    var elem = $('.content ul [rel=' + index + ']');

    $(this).click(function() {
      if (elem.contents().length) {
        $('.content').trigger('goto', index);
      } else {
        $.get($(this).attr('href'), function(data) {
          elem.append(data);
          $('.content').trigger('goto', index);
        });
      }

      return false;
    });

  });

  // Set width on list so the slide effect to works.
  $('ul', content).css('width', 1256 * $('ul li', content).length)

  // Previous/next click events.
  $('a.prev', menu).click(function() {
    $('.content').trigger('prev');
  });

  $('a.next', menu).click(function() {

    var activeElem = $('.active',menu);

    if (activeElem.parent().next().contents().length) {
      $('.content').trigger('goto', activeElem.parent().next().attr('rel'));
    } else {
      $.get(activeElem.parent().next().find('a').attr('href'), function(data) {
        activeElem.parent().next().append(data);
        $('.content').trigger('goto', activeElem.parent().next().attr('rel'));
      });
    }

    return false;

  });

  // Load default content.
  $('ul li[rel=0]', content).load('page1.html');

  // Add serialScroll (http://flesler.blogspot.com/2008/02/jqueryserialscroll.html).
  $('.wrapper').serialScroll({
		target:'.content',
		items:'li',
		next:'a.next',
		prev:'a.prev',
		force:true,
		stop:true,
		lock:false,
		cycle:false,
		jump: true,
    lazy: true,
		onAfter:function(pos,pane){
      // Remove active classes.
      menuItems.removeClass('active');

      // Add active class.
      $(menuItems[$(pos).attr('rel')]).addClass('active');
		}
	});

});
