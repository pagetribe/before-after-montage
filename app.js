import React from 'react'
import ReactDOM from 'react-dom'
import renderer from './renderer.js'

// import test from './test.js'
// test()

var HelloBox = React.createClass({

  render: function() {
    return (
      <div className="helloTag">
      Hello world from ReactJS ... working
      </div>
    );
  }
});

// ReactDOM.render(<HelloBox/>, document.getElementById('helloTag'));

document.getElementById("before-screenshot-button").addEventListener("click", function(){
    renderer.fullscreenScreenshot(function(base64data){
    	ReactDOM.render(<HelloBox/>, document.getElementById('helloTag'));
        // Draw image in the img tag
        document.getElementById("before-image").setAttribute("src", base64data);
    },'image/png');
}, false);

document.getElementById("after-screenshot-button").addEventListener("click", function(){
    renderer.fullscreenScreenshot(function(base64data){
        // Draw image in the img tag
        document.getElementById("after-image").setAttribute("src", base64data);
    },'image/png');
}, false);
