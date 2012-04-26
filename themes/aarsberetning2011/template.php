<?php
/**
 * @file
 * Preprocess and alter functions for the theme.
 */

function aarsberetning2011_preprocess_block(&$vars) {
 if($vars['elements']['#block']->module == 'menu_block') {
   $vars['attributes_array']['class'][] = 'menu-dropdown';
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
 * Implements template_links__locale_block();
 * 
 * Removes the active language from the language menu
 * 
 */
function aarsberetning2011_links__locale_block($variables) {
  global $language;
  unset($variables['links'][$language->language]);

  return theme('links', $variables);
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
  
  // Adds the depth class just for main-menu.
  if ($element['#original_link']['menu_name'] == 'main-menu') {
    $element['#attributes']['class'][] = 'level-' . $element['#original_link']['depth'];
    return '<li' . drupal_attributes($element['#attributes']) . '><span>' . $output . $sub_menu . "</span></li>\n";
  }
  else {
    return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
  }
}

function aarsberetning2011_page_alter(&$page) {

 // Check if we are on a node page.
  if ($node = menu_get_object()) {
    
    // Check if we are on a static_page
    if ($node->type == 'page') {
      // Move video sidebar.
      
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
      
    }
    
  }
  
}
