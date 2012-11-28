navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               window.oRequestAnimationFrame;
window.URL = window.URL || window.webkitURL;

function visitorsBooth(conf) {
  "use strict";
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var shots = document.getElementById(conf.destEltId);
  var video = document.getElementById(conf.videoEltId);
  video.width = conf.width;
  var ctx = canvas.getContext('2d');
  var stream;

  function getUM(fn) {
    fn = fn || function () {};
    if (!navigator.getUserMedia || !navigator.getUserMedia.call) {
      setTimeout(function () {
        fn(new Error('WebRTC not available'));
      }, 1);
      return;
    }
    navigator.getUserMedia({video: true}, function (localMediaStream) {
      stream = localMediaStream;
      video.autoplay = true;
      video.src = window.URL.createObjectURL(localMediaStream);

      // Too bad loadedmetadata event doesn't work :-/
      var _interval = setInterval(function () {
        if (video.videoWidth) {
          clearInterval(_interval);
          video.style.display = "block";
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          fn(null, localMediaStream);
        }
      }, 500);

    }, fn);
    return video;
  }

  function _shoot() {
    var _img = document.createElement('img');
    _img.className = 'shot';
    shots.appendChild(_img);
    requestAnimationFrame(function () {
      ctx.drawImage(video, 0, 0);
      _img.src = canvas.toDataURL('image/webp');
      _img.width = video.width;
      stream.stop();
      video.style.display = "none";
    });
    return _img;
  }

  return {
    start: getUM,
    shoot: _shoot
  };
}
