(function(a){function c(){a(".menu-dropdown").click(function(){var b=a(this).children(".menu");b.css("display",b.css("display")=="none"?"block":"none")})}function d(b){if(a(b).find("ul").length){a("<div />",{"class":"mobile-menu"}).appendTo(b);a("<select />",{}).appendTo(".mobile-menu",a(b));a("<option />",{selected:"selected",value:"",text:Drupal.t("Select page")}).appendTo(a("select",b));a(b).each(function(){var b=a(this);children=b.find("li");a("<option />",{value:b.find("> h2 > a").attr("href"),text:b.find("> h2 > a").text()}).appendTo("select:last");children.find("a").each(function(){a("<option />",{value:a(this).attr("href"),text:" - "+a(this).text()}).appendTo("select:last")})})}}var b=function(){function i(e){e!==undefined&&(h=e);j();c=a(h.content);var f=c.css("backgroundImage").replace(/url\("(.+)"\)/,"$1");d=a(h.outer);d.css({"overflow-x":"hidden"});d.css("background-image","url('"+f+"')");c.css({width:"200%",position:"absolute"});c.wrapInner('<div class="slide current" style="width: 50%"></div>');g=c.clone();a("#region-content .content",g).html("");a("#region-sidebar .region-inner",g).html("");a(".slide",g).removeClass("current");c.css("backgroundImage","none");b=a(h.menu);c=a(h.content);b.prepend('<li><span class="arrow-nav prev"><a href="#previous">'+Drupal.t("Back")+"</a></span></li>");b.append('<li><span class="arrow-nav next"><a href="#next">'+Drupal.t("Forward")+"</a></span></li>")}function j(){a.get("node2json/preload",function(b){a(b).each(function(){a("<img/>")[0].src=this})})}function k(){var c=q();if(c!=""){var d="/"+(c=="frontpage"?"":c);if(d!="/"||!a("body").hasClass("front")){var f=a('a[href="'+d+'"]',b);n(d,f,"fade")}}b.delegate(".leaf a","click",function(b){b.stopPropagation();b.preventDefault();if(e)return;e=!0;var c=a(b.target);n(c.attr("href"),c,"fade")});b.delegate(".arrow-nav","click",function(b){b.stopPropagation();b.preventDefault();if(e)return;e=!0;var c=a(b.target);c.attr("href")=="#previous"?x():w()})}function l(a,b){var c={page_title:a.page_title,content:a.field_body,sidebar:a.field_video_custom,background:a.image,translations:a.translations,language:a.language};f[b]=c;return c}function m(a){return f[a]!==undefined?f[a]:null}function n(b,c,d){var e=b=="/"?"/radmandens-forord":b,f=o(e),g=m(f);g!==null?v(g,c,d):a.get("node2json"+e,function(a){a=l(a,f);v(a,c,d)});p(f)}function o(a){var b="";if(a===undefined){a=window.location.pathname=="/"?"/frontpage":window.location.pathname;b=a.substr(1)}else if(a.charAt(0)=="/"){b=a.substr(1);b==""&&(b="frontpage")}else b=a;return b}function p(a){window.location.hash=a}function q(){return window.location.hash.substr(1)}function r(c){a("a",b).removeClass("active").removeClass("active-trail");a("li.active",b).removeClass("active").removeClass("active-trail");c.addClass("active").addClass("active-trail");c.parent().parent().addClass("active").addClass("active-trail")}function s(b,c){var d=g.clone();a("#region-content .content",d).html(b.content);a("#region-sidebar .region-inner",d).html(b.sidebar);a("#page-title",d).html(b.page_title);a(".slide",d).removeClass(c).css("backgroundImage","url('"+b.background+"')");return a(".slide",d)}function t(){a(".file-video").fitVids({customSelector:"iframe[src^='']"});a(".field-name-field-video").fitVids({customSelector:"iframe[src^='']"});a(".field-name-field-video-custom").fitVids({customSelector:"iframe[src^='']"})}function u(b){var c;if(b!=null){var d=a(".language-switcher-locale-url li");d.hasClass("en")?c="en/node/"+b.en.nid:c="da/node/"+b.da.nid;a(".language-link").attr("href",c)}}function v(b,f,g){var i=a(".current",c),j=s(b,g);if(g=="left"){i.css("right","0%");c.prepend(j.css("left","0%"));t();u(b.translations);c.css("right","0%").animate({right:"-100%"},{duration:h.slideSpeed,easing:"easeOutCubic",complete:function(){i.remove();c.css("right","auto");j.css("left","auto");j.removeClass("left").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1}})}else if(g=="right"){c.css("right","-100%");c.append(j.css("left","50%"));t();u(b.translations);c.animate({right:"0%"},{duration:h.slideSpeed,easing:"easeOutCubic",complete:function(){i.remove();c.css("right","auto");j.css("left","auto");j.removeClass("right").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1}})}else{i.remove();j.hide();c.append(j);t();u(b.translations);j.fadeIn(h.fadeSpeed,function(){j.css("filter","alpha(opacity=100)");j.css("opacity","1");j.removeClass("fade").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1})}r(f);p(o(f.attr("href")));a(".content .field-name-field-body").jTruncate({length:1e3,moreText:Drupal.t("Read more"),lessText:Drupal.t("Hide")})}function w(){var c=a("a.active",b);if(c.length==1){var d=c,e=c.parent().parent();e.hasClass("last")?d=a(".first a",e.parent()):d=a("a",e.next());n(d.attr("href"),d,"right")}}function x(){var c=a("a.active",b);if(c.length==1){var d=c,e=c.parent().parent();e.hasClass("first")?d=a(".last a",e.parent()):d=a("a",e.prev());n(d.attr("href"),d,"left")}}var b,c,d,e=!1,f={},g,h={menu:".region-menu ul",content:"#zone-content-wrapper",outer:"#section-content",fadeSpeed:600,slideSpeed:800};return{init:i,start:k}}();a(document).ready(function(){if(!a("body").hasClass("logged-in")){b.init();b.start()}c();d(".region-secondary-menu-inner")})})(jQuery);