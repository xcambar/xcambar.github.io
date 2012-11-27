$(function () {
  var callbacks = visitorsBooth({
    destEltId: 'gallery',
    videoEltId: 'booth',
    width: 200
  });

  var _doShoot = $('#takePicture');
  var _starter = $('#getUM');
  var video;
  _starter
      .on('click', function () {
        var _clone = $(this).clone();
        video = callbacks.start(function (err, stream) {
          if (err) {
            console.log(err)
            _clone.html(err.message);
            return;
          }
          // It would be much preferable to use loadedmetadata... if it were reliable.
          $('#shot').show();
          $('#gallery').addClass('blurred');
          _clone.remove();
          _doShoot.show();
        });
        _clone.text('Please wait...');
        $(this)
          .after(_clone)
          .hide();
      });
  _doShoot.hide().on('click', function () {
    var img = callbacks.shoot();
    $(this).hide();
    _starter.show();

    var angle = Math.floor(Math.random() * 36);
    var sign = Math.floor(Math.random() * 2) ? 1 : -1;

    var maxLeft = document.body.clientWidth - $('.mid-col').width() - Math.floor(video.width);
    var maxTop = $('.mid-col').height() - 200;

    $('#shot').hide();
    $('#gallery').removeClass('blurred');
    img.style.top = Math.floor(video.height + Math.random() * maxTop) + 'px';
    img.style.left = Math.floor(Math.random() * maxLeft) + 'px';
    img.style.webkitTransform = 'rotateZ(' + (sign * angle) + 'deg)';
  });
});