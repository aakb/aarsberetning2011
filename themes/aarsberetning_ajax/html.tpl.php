<?php

$json = array(
  'content' => trim($page),
  'background' => isset($dynamic_background) ? trim($dynamic_background) : '',
);

header('Content-type: application/json');
print json_encode($json);

