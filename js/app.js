
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


window.onload=function(){
	console.log('We are ready!');



	c = document.getElementById('c');
	ctx = c.getContext('2d');

	var windowWidth, 
		windowHeight;


	//Rect - Defining the rectangle shit
		var rects = []; //Just an array to hold the rects

		var rectSize = 80; //This sets both width and height
		var cols = 6;
		var rows = 6;
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

	function draw(){
		ctx.clearRect(0, 0, windowWidth, windowHeight); //Just clearing the screen

		for (var i = rects.length - 1; i >= 0; i--) {
			ctx.beginPath();
			ctx.moveTo(rects[i].tlX, rects[i].tlY);
			ctx.lineTo(rects[i].trX, rects[i].trY);
			ctx.lineTo(rects[i].blX, rects[i].blY);
			ctx.closePath();
			ctx.fillStyle = rects[i].color1;
			ctx.fill();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(rects[i].brX, rects[i].brY);
			ctx.lineTo(rects[i].trX, rects[i].trY);
			ctx.lineTo(rects[i].blX, rects[i].blY);
			ctx.closePath();
			ctx.fillStyle = rects[i].color2;
			ctx.fill();
			ctx.stroke();
		};
	}


	function update() {
		windowWidth  = window.innerWidth;
  		windowHeight = window.innerHeight;
		ctx.canvas.width  = windowWidth;
  		ctx.canvas.height = windowHeight;

		draw();

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
	var curretId,
		prevId;
	function nodeMover(i){
		//First reset all the nodes to its original
		//We dont want these changes to be permanent right?
			//Or maybe we can store the current id, and check if its the same as last time, and if not we reset the previous nodes
		i = (cols * rows) - i;
		console.log(cols * rows);
		curretId = rects[i];
		rects[i].tlX -= 20;
		rects[i].tlY -= 20;
		//Then, lets find what nodes the rect consists of
		//We also need to determine what is tl tr bl br

		//Then, we offset the shit
		//All nodes moving outwards from the rect

		//We probably want to ease the transition of the offset
		prevId = currentId;
	}


};


