<?php
/**
 * @file
 * Preprocess and alter functions for the theme.
 */

/**
 * Implements template_preprocess_block();
 * 
 * Add class 'menu-dropdown' to block of the menu in the header.
 */
function aarsberetning2011_preprocess_block(&$vars) {
 if(isset($vars['elements']['#block']->module) && $vars['elements']['#block']->module == 'menu_block') {
   if ($vars['elements']['#delta'] == 2 || $vars['elements']['#delta'] == 4) {
    $vars['attributes_array']['class'][] = 'menu-dropdown';
   }
 }
}

/**
 *
 * Add IE css.
 */

function aarsberetning2011_preprocess_html(&$variables) { 
  // Add css for using background-size: cover in IE.
  drupal_add_css(path_to_theme() . '/css/flexi-background.css', array('group' => CSS_THEME, 'browsers' => array('IE' => 'IE', '!IE' => FALSE), 'weight' => 999, 'preprocess' => FALSE));
  
  // Add IE specific css.
  drupal_add_css(path_to_theme() . '/css/ie.css', array('group' => CSS_THEME, 'browsers' => array('IE' => 'IE', '!IE' => FALSE), 'weight' => 999, 'preprocess' => FALSE));
}


/**
 * Implements template_menu_link().
 *
 * Adds classes based on menu level to nested menus.
 */
function aarsberetning2011_menu_link(array $variables) {

  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  
  // Adds the span to main menus.
  if ($element['#original_link']['menu_name'] == 'main-menu' || $element['#original_link']['menu_name'] == 'menu-main-menu-english-') {
    $element['#attributes']['class'][] = 'level-' . $element['#original_link']['depth'];
    return '<li' . drupal_attributes($element['#attributes']) . '><span>' . $output . $sub_menu . "</span></li>\n";
  }
  else {
    return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
  }
}

/**
 *
 * Implements function for removing the link to the active language in the language block.
 *  
 */

function aarsberetning2011_links__locale_block($variables) {
  global $language;
  unset($variables['links'][$language->language]);

  return theme('links', $variables);
}

function aarsberetning2011_page_alter(&$page) {

 // Check if we are on a node page.
  if ($node = menu_get_object()) {
    
    // Check if we are on a static_page
    if ($node->type == 'page') {
      
      // Move video to sidebar (media field, we'll keep it here for use later).      
      if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video'])) {

        // Save video to a variable.
        $video = $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video'];

        // Remove video from the system_main block.
        unset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video']);

        // Insert the video into another region instead.
        $video['#weight'] = 0;
        $page['content']['content']['sidebar']['field_video'] = $video;

        if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video'])) {
          
          // if caption exists, move it to header_first too.
          $caption = $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video'];
          // Place below title_image in markup.
          $caption['#weight'] = 1;
          $page['header']['header']['header_first']['field_image_caption'] = $caption;
          $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video']['#access'] = FALSE;
        }

        // Check if standard properties of the region exists and add them as necessary.
        if (!isset($page['content']['content']['sidebar']['#region']) && !isset($page['content']['content']['sidebar']['#theme_wrapper'])) {
          $page['content']['content']['sidebar']['#region'] = 'sidebar';
          $page['content']['content']['sidebar']['#theme_wrappers'] = array('region');
        }
        
      } else if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video'])) {
        
        // If no image present, hide caption
        $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video']['#access'] = FALSE;
      }
      
      // Move video to sidebar (this is the temporary video field used because of bug in Media).      
      if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom'])) {

        // Save video to a variable.
        $video = $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom'];

        // Remove video from the system_main block.
        unset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom']);

        // Insert the video into another region instead.
        $video['#weight'] = 0;
        $page['content']['content']['sidebar']['field_video_custom'] = $video;

        if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom'])) {
          
          // if caption exists, move it to header_first too.
          $caption = $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom'];
          // Place below title_image in markup.
          $caption['#weight'] = 1;
          $page['header']['header']['header_first']['field_image_caption'] = $caption;
          $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom']['#access'] = FALSE;
        }

        // Check if standard properties of the region exists and add them as necessary.
        if (!isset($page['content']['content']['sidebar']['#region']) && !isset($page['content']['content']['sidebar']['#theme_wrapper'])) {
          $page['content']['content']['sidebar']['#region'] = 'sidebar';
          $page['content']['content']['sidebar']['#theme_wrappers'] = array('region');
        }
        
      } else if (isset($page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom'])) {
        
        // If no image present, hide caption
        $page['content']['content']['content']['system_main']['nodes'][$node->nid]['field_video_custom']['#access'] = FALSE;
      }      
      
    }
    
  }
  
	/* handle the sites presentation in IE10 */
  $compatible = array(
    '#type' => 'html_tag',
    '#tag' => 'meta',
    '#attributes' => array(
    'http-equiv' => 'X-UA-Compatible',
    'content' => 'IE=9'
    ));
  drupal_add_html_head( $compatible, 'ie10compat' );
}
