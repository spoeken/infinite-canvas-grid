
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	 
	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	 
(function() {
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

//Clone function
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


	var dampener = 1;



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

		rects[i].trX = x + rectSize; //Top right left x
		rects[i].trY = y; //Top right left y

		rects[i].brX = x + rectSize; //Botton left x
		rects[i].brY = y + rectSize; //Bottom left y

		rects[i].blX = x; //Botton left x
		rects[i].blY = y + rectSize; //Bottom left y

		//Colors
		var hue1 = hues[Math.floor(Math.random()*hues.length)];
		var hue2 = hues[Math.floor(Math.random()*hues.length)];
		rects[i].color1 = '#'+hue1;
		rects[i].color2 = '#'+hue2;
	};

	originRects = rects.clone();

	function draw(){
		ctx.clearRect(0, 0, windowWidth, windowHeight); //Just clearing the screen

		for (var i = rects.length - 1; i >= 0; i--) { //Drawing them rects, I'm getting really good at this now
			ctx.beginPath();
			ctx.moveTo(rects[i].tlX, rects[i].tlY);
			ctx.lineTo(rects[i].trX, rects[i].trY);
			ctx.lineTo(rects[i].brX, rects[i].brY);
			ctx.lineTo(rects[i].blX, rects[i].blY);
			ctx.closePath();
			ctx.fillStyle = rects[i].color1;
			ctx.fill();
			ctx.stroke();
			
		};
	}

	//yh, I wanted to seperate the update and draw, cause We wont just draw stuff, we will update other things as well
	function update() { 

		draw(); //Does all of that drawing

		requestAnimationFrame(update);
	}



	requestAnimationFrame(update);


	//Mouse Controll
	// Hovering/Mouseover/Collisiondetection
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
	    	 nodeMover(id);
	    	 
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

	// Movement/Animation
	// Lets move them fuckin nodes
	// All we need is the id of the rect were on
	var currentId,
		prevId = 0;
	function nodeMover(i){
		//First reset all the nodes to its original
		//We dont want these changes to be permanent right?
			//Or maybe we can store the current id, and check if its the same as last time, and if not we reset the previous nodes
	

		currentId = i;
		if(currentId !== prevId){
			transformRect(prevId, 0);
		}

		transformRect(i, 20);
		//Then, lets find what nodes the rect consists of
		//We also need to determine what is tl tr bl br

		//Then, we offset the shit
		//All nodes moving outwards from the rect

		//We probably want to ease the transition of the offset
		prevId = currentId;
	}

	function transformRect(i, offset){
		var middle = i;
		//Middle
		rects[middle].tlX = originRects[i].tlX - offset; 
		rects[i].tlY = originRects[i].tlY - offset;

		rects[i].trX = originRects[i].trX + offset; 
		rects[i].trY = originRects[i].trY - offset;

		rects[i].brX = originRects[i].brX + offset; 
		rects[i].brY = originRects[i].brY + offset;
		
		rects[i].blX = originRects[i].blX - offset;
		rects[i].blY = originRects[i].blY + offset;

		// Top
			var top = i+cols;
			console.log(top);
			rects[top].brX = originRects[top].brX + offset; 
			rects[top].brY = originRects[top].brY - offset;
			
			rects[top].blX = originRects[top].blX - offset;
			rects[top].blY = originRects[top].blY - offset;
		//Top Right
			var topRight = top-1;
			rects[topRight].blX = originRects[topRight].blX + offset;
			rects[topRight].blY = originRects[topRight].blY - offset;
		// Right
			var right = i-1;
			console.log(right);
			//rects[right].tlX = originRects[right].tlX + offset;
			// rects[right].tlY = originRects[right].tlY - offset;

			// rects[right].blX = originRects[right].blX + offset;
			// rects[right].blY = originRects[right].blY + offset;
		// Bottom

		// Left
	}




	//Scroll functions
	window.onscroll = function(e){
		
			var x = ($('.container').scrollLeft() - 100) / dampener; //Getting the amount of scroll
				x *= -1 ;//Invert it, else it will look like we scroll in the oposite direction
			var y = ($('.container').scrollTop() - 100) / dampener;
				y *= -1 ;//Invert it
			console.log(x);
			$('.container').scrollLeft(100);
			$('.container').scrollTop(100); // Preventing scroll, and stopping the overscroll in chrome and such.
			

			$('.c').css({marginLeft:'+='+x+'px', marginTop: '+='+y+'px'});

			// We need to check the rects and restack them when needed. 
			// I mean, when the user scrolls the rects have to place themselves 
			// so that it looks like the grid just repeats itself



			//move them rects

			for (var i = rects.length - 1; i >= 0; i--) {
				//CornerPoints
				rects[i].tlX += x; //Top left x
				rects[i].tlY += y; //Top left y

				rects[i].trX += x; //Top right left x
				rects[i].trY += y; //Top right left y

				rects[i].brX += x; //Botton left x
				rects[i].brY += y; //Bottom left y

				rects[i].blX += x; //Botton left x
				rects[i].blY += y; //Bottom left y
			};


			//Scroll stop timer kashizle
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				// do something, anything!
				console.log("Haven't scrolled in 250ms!");
				
				$('html').removeClass('zoom');
				setTimeout(function() {
					
				}, 500);

			}, 250));
			e.preventDefault();
			return false;
		
	}


};


