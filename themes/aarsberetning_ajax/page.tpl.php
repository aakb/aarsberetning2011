<?php

?>

<?php print $messages; ?>
<div id="main-wrapper"><div id="main" class="clearfix">
  <div id="content" class="column"><div class="section">
    <?php if ($tabs): ?><div class="tabs"><?php print render($tabs); ?></div><?php endif; ?>
    <?php print render($title_prefix); ?>
    <?php if ($title): ?><h1 class="title" id="page-title"><?php print $title; ?></h1><?php endif; ?>
    <?php print render($title_suffix); ?>
    <?php print render($page['content']); ?>
    <?php print $feed_icons; ?>
  </div></div> <!-- /.section, /#content -->
</div></div> <!-- /#main, /#main-wrapper -->
