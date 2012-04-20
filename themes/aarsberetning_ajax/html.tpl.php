<?php

$json = array(
  'content' => trim($page),
  'background' => trim($dynamic_background),
);

header('Content-type: application/json');
print json_encode($json);

