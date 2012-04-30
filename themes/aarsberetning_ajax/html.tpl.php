<?php

$json = array(
  'content' => trim($page),
  'background' => isser($dynamic_background) ? trim($dynamic_background) : '',
);

header('Content-type: application/json');
print json_encode($json);

