
	 
(function() {
	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

//Clone function, damn I gotta remember them sources
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (var i in this) {
    if (i === 'clone') {continue;}
    if (this[i] && typeof this[i] === "object") {
      newObj[i] = this[i].clone();
    } else {newObj[i] = this[i];}
  } return newObj;
};


window.onload=function(){
	console.log('We are ready!');

	//Get some intel


	var currentScale = 1;
	var dampener = 1;

	$('.container').scrollLeft(100); //We will constantly do this on scroll, so lets do it right aways aswell
	$('.container').scrollTop(100); // Preventing scroll, and stopping the overscroll in chrome and such.

	c = document.getElementById('c');
	ctx = c.getContext('2d');

	var windowWidth  = window.innerWidth;
	var windowHeight = window.innerHeight;
	ctx.canvas.width  = windowWidth;
	ctx.canvas.height = windowHeight;
	window.onresize = function(e) {
		windowWidth  = window.innerWidth;
		windowHeight = window.innerHeight;
		ctx.canvas.width  = windowWidth;
		ctx.canvas.height = windowHeight;
	}


	//Rect - Defining the rectangle shit
		var rects = []; //Just an array to hold the rects

		var rectSize = 300; //This sets both width and height
		var cols = 10;
		var rows = 10
		var nOfRects = cols*rows; //We get the number of rects

	
		var hues = ['105B63', 'F4FFBE', 'FFD34E', 'DB7004', 'BD342D']; //Just so that we can see a difference
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';

	//Add rect nodes with X and Y according to the cols and rows
	for (var i = nOfRects - 1; i >= 0; i--) {
		rects[i] = {};
		var x = (cols-i%cols)*rectSize - rectSize;
		var y = (rows-Math.floor(i/cols))*rectSize - rectSize;
		
		//CornerPoints
		rects[i].tlX = x; //Top left x
		rects[i].tlY = y; //Top left y

		//Colors
		var hue1 = hues[Math.floor(Math.random()*hues.length)];
		rects[i].color1 = '#'+hue1;
	};

	var rectsClone = rects.clone();

	function draw(){
		ctx.clearRect(0, 0, windowWidth, windowHeight); //Just clearing the screen

		for (var i = rects.length - 1; i >= 0; i--) { //Drawing them rects, I'm getting really good at this now
			ctx.beginPath();
			ctx.moveTo(rects[i].tlX, rects[i].tlY);
			ctx.rect(rects[i].tlX, rects[i].tlY, rectSize, rectSize);
			ctx.closePath();
			ctx.fillStyle = rects[i].color1;
			ctx.fill();
			
		};
	}

	//yh, I wanted to seperate the update and draw, cause We wont just draw stuff, we will update other things as well
	function update() { 

		zoom();

		draw(); //Does all of that drawing

		restack();

		// if(scrollFlag){
		// 	rectSize = 100;
		// }

		//Need an easing function here:
		for (var i = rects.length - 1; i >= 0; i--) {
			//CornerPoints
			rects[i].tlX = easeCustom(1, rectsClone[i].tlX, rects[i].tlX, 60); //Top left x
			rects[i].tlY = easeCustom(1, rectsClone[i].tlY , rects[i].tlY, 60); //Top left y
		};

		requestAnimationFrame(update);
	}



	requestAnimationFrame(update);


//Mouse Controll
	// Hovering/Mouseover/Collisiondetection
	// Doesnt work now since the rects are moving when you scroll
	var flag = 0; 
	var mousedown = false;
	var rectHits = [];
	c.addEventListener("mousedown", function(){
	    flag = 0;
	    mousedown = true;
	}, false);
	c.addEventListener("mousemove", function(e){
	    flag = 1;
	    if(mousedown){

	    	 //Determine what col and row we are on
	    	 var colPos = e.x/rectSize; 
	    	 var rowPos = e.y/rectSize;
	    	 //Determine which side of teh rect we are on
	    	 var decY = colPos%1;
	    	 var decX = rowPos%1;
	    	 var sidePos = Math.ceil(decY + decX); //Will be 1 on middle line
	    	 //Find the id of the rect we are on
	    	 var id = (Math.floor(rowPos)*cols)+Math.ceil(colPos);
	    	 id = (cols * rows) - id;
	    	 console.log('Id: '+ id + 'Side:'+ sidePos);
	    	 // nodeMover(id);
	    	 
	    }
	}, false);
	c.addEventListener("mouseup", function(){
	    mousedown = false;
	    if(flag === 0){
	        console.log("click");
	    }
	    else if(flag === 1){
	        console.log("drag done");
	    }
	}, false);






//Scroll functions
	var scrollFlag = false;
	$('.container').on('scroll' ,function(e){
			var scrollFlag = true;

			var x = ($('.container').scrollLeft() - 100) / dampener; //Getting the amount of scroll
				x *= -1 ;//Invert it, else it will look like we scroll in the oposite direction
			var y = ($('.container').scrollTop() - 100) / dampener;
				y *= -1 ;//Invert it

			$('.container').scrollLeft(100);
			$('.container').scrollTop(100); // Preventing scroll, and stopping the overscroll in chrome and such.
			


			// We need to check the rects and restack them when needed. 
			// I mean, when the user scrolls the rects have to place themselves 
			// so that it looks like the grid just repeats itself

	
			zoomAdd([x, y]);
			//$('.c').css({marginLeft:'+='+x+'px', marginTop: '+='+y+'px'}); //Keeping it just for reference

			//Update position of the rect points

			for (var i = rects.length - 1; i >= 0; i--) {
				//CornerPoints
				rectsClone[i].tlX += x; //Top left x
				rectsClone[i].tlY += y; //Top left y
			};


			

			//Scroll stop timer kashizle, copied from somewhere
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				// do something, anything!
				var scrollFlag = false;
				console.log("Haven't scrolled in 100ms!");


			}, 50));
			e.preventDefault();
			return false;
		
	});
// Zoom function
	var zoomSpeed = 0.01;
	var zoomBuffer = 0.00000001;
	var targetZoom = 0;
	var prevScale = 0;
	function zoomAdd(zoomAmount){
		var amount = (Math.abs(zoomAmount[0]) + Math.abs(zoomAmount[1]))/2000;
		if(zoomBuffer < 0.06){
			//console.log('buffer:'+zoomBuffer);
			zoomBuffer += amount;
		}
	}
	function zoom () {
		var neg = 0;
		var pos = 0;
		if(zoomBuffer > 0 && currentScale > 0.6){
			neg = zoomBuffer/2;
			zoomBuffer -= neg;
			
		}
		if(currentScale < 1){
			pos = 0.02;
		}
		
		targetZoom += neg-pos;
		var scale = easeOutQuart(currentScale, prevScale, targetZoom, 20); //Trying to ease some here
		prevScale = scale;
		currentScale = currentScale + pos - neg;
		targetZoom -= scale;
		ctx.scale((1-scale), (1-scale));
	}
	


// Restack function - it made sence when I was having a bunch of floating divs ok.
	//Setting the points where it should restack
	var restackPointL = -rectSize;
	var restackPointR = (rectSize * cols) - rectSize;
	var restackPointT = -rectSize;
	var restackPointB = rectSize * cols - rectSize - 2;

	function restack () {
		var outToCons = [];
		// Lets loop through the rects and check their position
			for (var i = rects.length - 1; i >= 0; i--) {
				var x = rects[i].tlX;
				var y = rects[i].tlY;
				// Check x and y seperatly, and if they are less than -rectSize, we throw them over to the other side
				if(x < restackPointL){
					moveRectRight(i);
				} else if(x > restackPointR){
					moveRectLeft(i);
				}
				if(y < -rectSize){
					moveRectDown(i);
				} else if(y > restackPointB){
					moveRectUp(i);
				}
				// If they are not, we gotta check if they are far off the positive way
				// So if they are rectSize more than screensize, we throw them to the other side. 
				// You can imagine there will be a lot of throwing around.

				//outToCons[i] = {x: x, y: y}; //Remember, the rects are in reverse order
			};
		//console.log(outToCons);
	}

	function moveRectRight(i){
		var offset = rectSize * cols;
		rects[i].tlX += offset; //Top left x
		rectsClone[i].tlX += offset; //Top left x
	}

	function moveRectLeft(i){
		var offset = rectSize * cols;
		rects[i].tlX -= offset; //Top left x
		rectsClone[i].tlX -= offset; //Top left x
	}

	function moveRectDown(i){
		var offset = rectSize * cols;
		rects[i].tlY += offset; //Top left Y
		rectsClone[i].tlY += offset; //Top left Y
	}

	function moveRectUp(i){
		var offset = rectSize * cols;
		rects[i].tlY -= offset; //Top left Y
		rectsClone[i].tlY -= offset; //Top left Y
	}

//Easing Functions

	function easeOutCubic(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
	function easeOutQuart(t, b, c, d) {
	    t /= d;
	    t--;
	    return -c * (t*t*t*t - 1) + b;
	};
	function easeInOutSine(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	function easeCustom(t, b, c, d) {
		return c + Math.floor((b - c) /20);
		
	}


};


