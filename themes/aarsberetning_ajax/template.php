<?php
/**
 * @file
 * Preprocess and alter functions for the theme.
 */


/**
 * Page preprocess function used to create the $background variable, so it
 * can be used in html.tpl.php. If selected have selected to use custom CSS.
 *
 */
function aarsberetning_ajax_preprocess_html(&$vars) {
  // Load image configuration.
  $image_conf = dynamic_background_load_image_configuration($vars);

  // Generate the css and add it to the site.
  if (isset($image_conf)) {
    $css = aarsberetning_build_background_style($image_conf);
    if ($css) {
      $vars['dynamic_background'] = $css;
    }
  }
}

/**
 * Copy from dynamic background, which is modified to return the css as a single
 * string that can be used as inline style.  
 *
 * @param array $images_conf
 * @param boolean $reset optional
 * @return string $css or FALSE if custom CSS have not been defined
 */
function aarsberetning_build_background_style($images_conf, $reset = FALSE) {
  static $css;
  if (!isset($css) || $reset) {
    // Build style array based on weight, this will allow weight base override
    // at the same time allowing different selectors.
    $style_array = array();
    foreach ($images_conf as $image_conf) {
      // Add image style, if one have been defined.
      $image = $image_conf['image'];
      if (isset($image_conf['image_style']) && $image_conf['image_style']) {
        // Image style found, so update the image path with an image style
        // based one.
        $image->uri = image_style_path($image_conf['image_style'], $image->uri);
      }

      // Only use image if css behaviour have be set.
      if (!empty($image_conf['configuration'])) {
        // Check if selector have been used, if it have and has a higher weight
        // override it.
        if (isset($style_array[$image_conf['configuration']['selector']])) {
          if ($style_array[$image_conf['configuration']['selector']]['weight'] > $image_conf['weight']) {
            $style_array[$image_conf['configuration']['selector']] = array(
              'css' => $image_conf['configuration']['css'],
              'image' => $image,
              'weight' => $image_conf['weight'],
            );
          }
        }
        else {
          $style_array[$image_conf['configuration']['selector']] = array(
            'css' => $image_conf['configuration']['css'],
            'image' => $image,
            'weight' => $image_conf['weight'],
          );
        }
      }
    }

    // Build css based on weighted style array.
    $css = '';
    foreach ($style_array as $selector => $style) {
      $css .= file_create_url($style['image']->uri);
    }
  }
  return $css;
}

/**
 * Implements hook_page_alter().
 * 
 * Moved movie field into another region.
 * 
 * @param type $page 
 */
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
