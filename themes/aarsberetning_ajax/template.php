<?php
/**
 * @file
 * Preprocess and alter functions for the theme.
 */

/**
 * Implements template_menu_link().
 *
 * Adds classes based on menu level to nested menus.
 */
function aarsberetning_ajax_menu_link(array $variables) {

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

function aarsberetning_ajax_page_alter(&$page) {

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
