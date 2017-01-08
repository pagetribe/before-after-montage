// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var desktopCapturer = require('electron').desktopCapturer;
const remote = require('electron').remote;


function fullscreenScreenshot(callback, imageFormat) {
    hideWindow() //gets the window out of the way for the sceen shot
    var _this = this;
    this.callback = callback;
    imageFormat = imageFormat || 'image/jpeg';

    this.handleStream = (stream) => {
        // Create hidden video tag
        var video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
        // Event connected to stream
        video.onloadedmetadata = function () {
            // Set video ORIGINAL height (screenshot)
            video.style.height = this.videoHeight + 'px'; // videoHeight
            video.style.width = this.videoWidth + 'px'; // videoWidth

            // Create canvas
            var canvas = document.createElement('canvas');
            canvas.width = this.videoWidth;
            canvas.height = this.videoHeight;
            var ctx = canvas.getContext('2d');
            // Draw video on canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (_this.callback) {
                // Save screenshot to base64
                _this.callback(canvas.toDataURL(imageFormat));
                restoreWindow()
            } else {
                console.log('Need callback!');
            }

            // Remove hidden video tag
            video.remove();
            try {
                // Destroy connect to stream
                stream.getTracks()[0].stop();
            } catch (e) {}
        }
        video.src = URL.createObjectURL(stream);
        document.body.appendChild(video);
    };

    this.handleError = function(e) {
        console.log(e);
    };

    // Filter only screen type
    desktopCapturer.getSources({types: ['screen']}, (error, sources) => {
        if (error) throw error;
        // console.log(sources);
        for (let i = 0; i < sources.length; ++i) {
            console.log(sources);
            // Filter: main screen
            if (sources[i].name === "Entire screen" || sources[i].name === "Screen 1") {
                navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: sources[i].id,
                            minWidth: 1280,
                            maxWidth: 4000,
                            minHeight: 720,
                            maxHeight: 4000
                        }
                    }
                }, this.handleStream, this.handleError);

                return;
            }
        }
    });
}

function hideWindow(){
    var window = remote.getCurrentWindow();
    window.hide();  
}

function restoreWindow(){
    var window = remote.getCurrentWindow();
    window.restore();  
}


document.getElementById("trigger").addEventListener("click", function(){
    fullscreenScreenshot(function(base64data){
        // Draw image in the img tag
        document.getElementById("my-preview").setAttribute("src", base64data);
    },'image/png');
},false);




// var desktopCapturer = require('electron').desktopCapturer;


// document.getElementsByClassName("take-screen-shot")[0].addEventListener("click", takeScreenShot);

// function takeScreenShot(){
//   desktopCapturer.getSources({types: ['window', 'screen']}, function(error, sources) {
//     if (error) throw error;

//     for (var i = 0; i < sources.length; ++i) {
//         if (sources[i].name === "Entire screen" || sources[i].name === "Screen 1") {
//           console.log(sources[i].name)
//           navigator.webkitGetUserMedia({
//             audio: false,
//             video: {
//               mandatory: {
//                 chromeMediaSource: 'desktop',
//                 chromeMediaSourceId: sources[i].id,
//                 minWidth: 1280,
//                 maxWidth: 1280,
//                 minHeight: 720,
//                 maxHeight: 720
//               }
//             }
//           }, gotStream, getUserMediaError);
//           return;
//         }
//       }
//   })

//   function gotStream(stream) {
//     // Create hidden video tag
//            var video = document.createElement('video');
//            video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
//            // Event connected to stream
//            video.onloadedmetadata = function () {
//                // Set video ORIGINAL height (screenshot)
//                video.style.height = this.videoHeight + 'px'; // videoHeight
//                video.style.width = this.videoWidth + 'px'; // videoWidth

//                // Create canvas
//                var canvas = document.createElement('canvas');
//                canvas.width = this.videoWidth;
//                canvas.height = this.videoHeight;
//                var ctx = canvas.getContext('2d');
//                // Draw video on canvas
//                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//                document.getElementById("before-image").setAttribute("src", base64data(canvas.toDataURL('image/jpeg')));

//                // if (_this.callback) {
//                //     // Save screenshot to base64
//                //     _this.callback(canvas.toDataURL(imageFormat));
//                // } else {
//                //     console.log('Need callback!');
//                // }

//                // Remove hidden video tag
//                video.remove();
//                try {
//                    // Destroy connect to stream
//                    stream.getTracks()[0].stop();
//                } catch (e) {}
//            }
//            video.src = URL.createObjectURL(stream);
//            document.body.appendChild(video);
//     // document.getElementById("before-image").setAttribute("src");
//     // document.querySelector('video').src = URL.createObjectURL(stream);
//   }

//   function getUserMediaError(e) {
//     console.log('getUserMediaError');
//   }
// }
