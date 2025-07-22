(function() {
  var $doc;

  $doc = $(document);

  $doc.on('click', '.envelope', function() {
    return $(this).toggleClass('open');
  });

  /*$doc.on 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', '.open .flap-outside', ->
$(this).css
  'z-index': 0*/

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsUUFBRjs7RUFFUCxJQUFJLENBQUMsRUFBTCxDQUFRLE9BQVIsRUFBaUIsV0FBakIsRUFBOEIsUUFBQSxDQUFBLENBQUE7V0FDNUIsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBcEI7RUFENEIsQ0FBOUI7O0VBRkE7OztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJGRvYyA9ICQoZG9jdW1lbnQpXG5cbiRkb2Mub24gJ2NsaWNrJywgJy5lbnZlbG9wZScsIC0+XG4gICQodGhpcykudG9nZ2xlQ2xhc3MgJ29wZW4nXG4gIFxuIyMjJGRvYy5vbiAnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCcsICcub3BlbiAuZmxhcC1vdXRzaWRlJywgLT5cbiAgJCh0aGlzKS5jc3NcbiAgICAnei1pbmRleCc6IDAjIyMiXX0=
//# sourceURL=coffeescript