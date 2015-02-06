// Actually we can use SHIM & SHIV for DOM and ES
// but for now we wanted to get only IE capability 

//cheack dom ready 
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);


// Main function
function init() {

  var html = document.getElementsByTagName('html')[0];

  // Prevent default
  document.ondragstart = function () { return false; };

  html.attachEvent('onclick', function(e) { 
    if (e.srcElement.nodeName !== 'HTML') {
      return;
    }

    // If clicked on HTML create new Window
    return new Windows(e.clientX, e.clientY);
  });
}

// Window contructor
function Windows(x, y) {
  this.x = x;
  this.y = y;
  this.offsetX = 0; 
  this.offsetY = 0;

  // Create DOM Element
  this.el = this.createDOMElement();

  // Bind events for Windows object
  this.el.attachEvent('onmousedown', proxy(this, this.startMove));
  this.el.attachEvent('onmouseup', proxy(this, this.stopMove));

  // Append element to the page
  document.body.appendChild(this.el);

  Windows.zIndex++;
}

// Static variable for zIndexes
Windows.zIndex = 0;

// Create
Windows.prototype.createDOMElement = function createDOMElement(e) {
  var el = document.createElement('div');
    el.className = 'window';
    el.style.left = this.x - this.offsetX + 'px';
    el.style.top = this.y - this.offsetY + 'px';
    el.style.background  = this.x + this.y;
    el.style.zIndex = Windows.zIndex;

    return el;
}

Windows.prototype.startMove = function startMove(e) {

  if (!this.el) {
    alert('No element was created');
  }

  if (this.f) {
    document.detachEvent('onmousemove', this.f);
    this.f = null;
    return;
  }

  // Pass context;

  this.f = proxy(this, this.move);

  // Calculating offset
  this.offsetY = e.clientY - this.y;
  this.offsetX = e.clientX - this.x;
  
  // Call move element
  document.attachEvent('onmousemove', this.f);

  // Bring window forward;
  Windows.zIndex++;
  this.el.style.zIndex = Windows.zIndex;
}

Windows.prototype.stopMove = function stopMove(e) {
  // When something strange was happened, we should know about that
  if (!this.el) {
    alert('No element was created');
  }

  // Stop moving element
  document.detachEvent('onmousemove', this.f);
}

// Move element
Windows.prototype.move = function move(e) {

  this.x = e.clientX - this.offsetX;
  this.y = e.clientY - this.offsetY;

  this.el.style.left = this.x + 'px';
  this.el.style.top = this.y + 'px';
}

// Proxy helper, to pass context into function
function proxy (context, f) {
  if (typeof(f) !== "function") {
      return;
  }

    return function () { 
      return f.apply(context, arguments); 
    }
}
