$(function () {
  var _starter = $('#getUM');
  var _doShoot = $('#takePicture').hide();
  if (!$("html").hasClass("raf") || !$("html").hasClass("getusermedia") || !$("html").hasClass("webp")) {
    _starter.on("click", function () {
      alert("Sorry, your browser is not featured enough to play with the photo booth...");
    });
  } else {
    var opts = {
      destEltId: 'gallery',
      videoEltId: 'booth',
      width: 200
    };
    var callbacks = visitorsBooth(opts);

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
            //console.log(resp);
          }
        });
      }
      var img = callbacks.shoot(_savePicture);
      positionPhoto(img);
      $(this).hide();
      _starter.show();

    });

    $.ajax({
      url: "https://api.mongolab.com/api/1/databases/blog/collections/photos?apiKey=50b6ab80e4b006ff16080259&l=10"
    }).done(function (data) {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      for (var i = 0; i < data.length; i++) {
        var img = callbacks.addShot();
        img.src = data[i].src;
        positionPhoto(img);
      }
    });

    var positionPhoto = function (img) {
      var angle = Math.floor(Math.random() * 36);
      var sign = Math.floor(Math.random() * 2) ? 1 : -1;

      var maxLeft = document.body.clientWidth - $('.mid-col').width() - img.width;
      var maxTop = $('.mid-col').height() - img.height;

      $('#shot').hide();
      $('#gallery').removeClass('blurred');
      img.style.top = Math.floor(Math.random() * maxTop) + 'px';
      img.style.left = Math.floor(Math.random() * maxLeft) + 'px';
      img.style.webkitTransform = 'rotateZ(' + (sign * angle) + 'deg)';
    };
  }
});
