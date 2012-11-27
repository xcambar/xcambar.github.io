navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

function visitorsBooth (conf) {
  var canvas = document.createElement('canvas');
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
    navigator.getUserMedia({video: true}, function(localMediaStream) {
      stream = localMediaStream;
      video.autoplay = true;
      video.src = window.URL.createObjectURL(localMediaStream);

      // Too bad loadedmetadata event doesn't work :-/
      setTimeout(function(evt) {
        video.style.display = "block";
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        fn(null, localMediaStream);
      }, 2000);

    }, fn);
    return video;
  };

  function _shoot() {
    ctx.drawImage(video, 0, 0);
    var _img = document.createElement('img');
    _img.src = canvas.toDataURL('image/webp');
    _img.width = video.width;
    shots.appendChild(_img);
    _img.className = 'shot';
    stream.stop();
    video.style.display = "none";
    return _img;
  }

  return {
    start: getUM,
    shoot: _shoot
  }
}
