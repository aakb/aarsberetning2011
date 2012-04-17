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
