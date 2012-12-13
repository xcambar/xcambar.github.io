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
        var _clone = $('<span class="pictureButton">');
        video = callbacks.start(function (err, stream) {
          if (err) {
            var msg = err.message;
            if (Object.prototype.toString.call(err) === '[object NavigatorUserMediaError]') {
              msg = 'Ooops...';
            }
           _starter.show();
           _clone.remove();
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
    //Save to MongoLab
    function _savePicture (_img) {
      var _photoData = {
        src: _img.src,
        date: Date.now()
      };
      $.ajax({
        url: 'https://api.mongolab.com/api/1/databases/blog/collections/photos?apiKey=50b6ab80e4b006ff16080259',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(_photoData),
        success: function (resp) {
          console.log(resp);
        }
      });
    }
    var img = callbacks.shoot(_savePicture);
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
