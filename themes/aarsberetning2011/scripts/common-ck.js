(function(a){function c(){a(".menu-dropdown").click(function(){var b=a(this).children(".menu");b.css("display",b.css("display")=="none"?"block":"none")})}function d(b){if(a(b).find("ul").length){a("<div />",{"class":"mobile-menu"}).prependTo(b);a("<select />",{}).appendTo(".mobile-menu",a(b));a("<option />",{selected:"selected",value:"",text:Drupal.t("Menu")}).appendTo(a("select",b));a(b).each(function(){var c=a(this);children=c.find("li");a("<option />",{value:c.find("> h2 > a").attr("href"),text:c.find("> h2 > a").text()}).appendTo("select:last");children.find("a").each(function(){a("<option />",{value:a(this).attr("href"),text:" - "+a(this).text()}).appendTo("select:last")});a("select",b).change(function(){window.location=a(this).find("option:selected").val()})})}}var b=function(){function i(e){e!==undefined&&(h=e);j();c=a(h.content);var f=c.css("backgroundImage").replace(/url\((.+)\)/,"$1").replace(/"/g,"");d=a(h.outer);d.css({"overflow-x":"hidden"});d.css("background-image","url('"+f+"')");c.css({width:"200%",position:"absolute"});c.wrapInner('<div class="slide current" style="width: 50%"></div>');var i=document.getElementById("zone-content-wrapper").cloneNode(!0),k=a(i);a("#region-content .content",k).html("");a("#region-sidebar .region-inner",k).html("");a(".slide",k).removeClass("current");g=k[0];c.css("backgroundImage","none");b=a(h.menu);c=a(h.content);b.prepend('<li><span class="arrow-nav prev"><a href="#previous">'+Drupal.t("Back")+"</a></span></li>");b.append('<li><span class="arrow-nav next"><a href="#next">'+Drupal.t("Forward")+"</a></span></li>");t();y()}function j(){a.get("/node2json/preload",function(b){a(b).each(function(){a("<img/>")[0].src=this})})}function k(){var c=q();if(c!=""){var d="/"+(c=="frontpage"?"":c);if(d!="/"||!a("body").hasClass("front")){var f=a('a[href="'+d+'"]',b);n(d,f,"fade")}}b.delegate(".leaf a","click",function(b){b.stopPropagation();b.preventDefault();if(e)return;e=!0;var c=a(b.target);n(c.attr("href"),c,"fade")});b.delegate(".arrow-nav","click",function(b){b.stopPropagation();b.preventDefault();if(e)return;e=!0;var c=a(b.target);c.attr("href")=="#previous"?x():w()})}function l(a,b){var c={page_title:a.page_title,content:(a.field_title_image==undefined?"":a.field_title_image+"\n")+a.field_body,sidebar:a.field_video_custom,background:a.image?a.image:"/misc/druplicon.png",translations:a.translations,language:a.language};f[b]=c;return c}function m(a){return f[a]!==undefined?f[a]:null}function n(b,c,d){var e=b=="/"?"/home":b,f=o(e),g=m(f);g!==null?v(g,c,d):a.post("/node2json",{node2json_path:e},function(a){a=l(a,f);v(a,c,d)});p(f)}function o(a){var b="";if(a===undefined){a=window.location.pathname=="/"?"/home":window.location.pathname;b=a.substr(1)}else if(a.charAt(0)=="/"){b=a.substr(1);b==""&&(b="home")}else b=a;return b}function p(a){window.location.hash=a}function q(){return window.location.hash.substr(1)}function r(c){a("a",b).removeClass("active active-trail");a("li",b).removeClass("active active-trail");c.addClass("active active-trail");c.parent().parent().addClass("active active-trail")}function s(b,c){var e=g.cloneNode(!0),f=a(e);a(".slide",f).width(d.width()+"px");a("#region-content .content",f).html(b.content);a("#region-sidebar .region-inner",f).html(b.sidebar);a("#page-title",f).html(b.page_title);a(".slide",f).removeClass(c).css("backgroundImage","url('"+b.background+"')");return a(".slide",f)}function t(){a(".field-name-field-video-custom").fitVids({customSelector:"iframe[src^='']"});a.browser.msie||a(".inline-video").fitVids({customSelector:"iframe[src^='']"})}function u(b){var c,d=a(".language-switcher-locale-url li");if(b!=null){var c,e=null;if(d.hasClass("en")){e="english";c="en/node/"+b.en.nid}else{e="dansk";c="node/"+b.da.nid}d.html('<a class="language-link" href="'+c+'">'+e+"</a>")}else{var e=a("a",d).text();d.html('<span class="locale-untranslated">'+e+"</span>")}}function v(b,f,g){var i=a(".current",c),j=s(b,g);if(g=="left"){i.css("right","0%");c.prepend(j.css("left","0%"));t();u(b.translations);c.css("right","0%").animate({right:"-100%"},{duration:h.slideSpeed,easing:"easeOutCubic",complete:function(){i.remove();c.css("right","auto");j.css("left","auto");j.removeClass("left").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1;y()}})}else if(g=="right"){c.css("right","-100%");c.append(j.css("left","50%"));t();u(b.translations);c.animate({right:"0%"},{duration:h.slideSpeed,easing:"easeOutCubic",complete:function(){i.remove();c.css("right","auto");j.css("left","auto");j.removeClass("right").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1;y()}})}else{i.remove();j.hide();c.append(j);t();u(b.translations);j.fadeIn(h.fadeSpeed,function(){j.css("filter","alpha(opacity=100)");j.css("opacity","1");j.removeClass("fade").addClass("current");j.css("backgroundImage","none");d.css("backgroundImage","url('"+b.background+"')");e=!1;y()})}r(f);p(o(f.attr("href")))}function w(){var c=a("a.active, a.active-trail",b);if(c.length==1){var d=c,e=c.parent().parent();e.hasClass("last")?d=a(".first a",e.parent()):d=a("a",e.next());n(d.attr("href"),d,"right")}}function x(){var c=a("a.active, a.active-trail",b);if(c.length==1){var d=c,e=c.parent().parent();e.hasClass("first")?d=a(".last a",e.parent()):d=a("a",e.prev());n(d.attr("href"),d,"left")}}function y(){a.browser.msie&&a("#section-content").height(a("#region-content").height()+200)}var b,c,d,e=!1,f={},g,h={menu:".region-menu ul",content:"#zone-content-wrapper",outer:"#section-content",fadeSpeed:600,slideSpeed:800};return{init:i,start:k,fixVideos:t}}();a(document).ready(function(){if(!a("body").hasClass("logged-in")){b.init();b.start()}b.fixVideos();c();d(".region-secondary-menu-inner")})})(jQuery);