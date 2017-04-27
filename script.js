var el = function (element) { return document.querySelector(element); },
	els = function (element) { return document.querySelectorAll(element); },
	b1,
	b0,
	fx,

	x = [],
	y = [],
	p,

	somaxy = 0,
	somax = 0,
	somay = 0,
	somax2 = 0,
	somay2 = 0,
	cnn,
	cttx,
	mtd = 10,
	lineThinkness = 1;

function createLinePath(ctx, start, end, color = "gray") {
	ctx.beginPath();
	ctx.strokeStyle = color;
	// ctx.lineWidth=0.5;
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
};

function makeGrid(ctx, cv) {
	var wAux = cv.width,
		hAux = cv.height,
		idx = 0,
		scaleText = "0";

	ctx.font = "5px Arial";
	ctx.fillStyle = "#aaa";
	ctx.fillText("0", 1, cv.height-1);
	ctx.lineWidth = 0.5;

	while (wAux >= -10) {
		scaleText = (wAux/mtd) + 10;
		if (scaleText == 10) {
			scaleText = "0";
		}
		else {
			scaleText = scaleText-1;
		}

		ctx.fillText(scaleText, wAux+1, cv.height-1);
		ctx.fillText((cv.height-(hAux) + 90), 1, hAux-1);

		// V
		createLinePath(
			ctx,
			{x: wAux, y: cv.height},
			{x: wAux, y: 0},
			"#efefef"
		);

		// H
		createLinePath(
			ctx,
			{x: cv.width, y: hAux},
			{x: 0, y: hAux},
			"#efefef"
		);

		hAux -= mtd;
		wAux -= mtd;
	}

	ctx.lineWidth = 1;
}


function createSquare(ctx, cv, xPos, yPos, color = "red") {
	var xp,
		yp,
		cvHeight = cv.height,
		dotScale = 2;

	xp = xPos;
	if (xPos > 20) {
		xp = (10*(xPos-10));
	}
	else if (xPos > 10) {
		xp = (10*(xPos-10)) + 10;
	}

	yp = (cvHeight - yPos) + 90;

	ctx.fillStyle = color;
	ctx.fillRect(xp, yp, dotScale, dotScale);
}
var ct = 0;
function drawPlanGraph(scale) {
    var canvas = document.getElementById('myCanvas'),
		ctx = canvas.getContext('2d'),
		pesoText,
		alturaText,
		nscale = 3;
	cnn = canvas;
	cttx = ctx;

	if (ct === 0) {
		// #scale
		ctx.translate(0, -(canvas.height + (canvas.height)));
		ctx.scale(nscale, nscale);
		ct++;
	}

	ctx.fillStyle = '#fafafa';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	makeGrid(ctx, canvas);

	createLinePath(
		ctx,
		{x:0, y:canvas.height},
		{x:0, y:0},
		"green"
	);

	createLinePath(
		ctx,
		{x: canvas.width, y: canvas.height},
		{x: 0, y: canvas.height},
		"blue"
	);

	// createLinePath(
	// 	ctx,
	// 	{x: x[0], y: y[0]},
	// 	{x: 500 - (500-x[x.length-1]), y: 500 - (500 - y[y.length-1])},
	// 	"wine"
	// );

	ctx.font = "12px Arial";
	ctx.fillStyle = "#333";

	pesoText = "peso";
	ctx.fillText(pesoText, 12, 20);

	alturaText = "altura";
	ctx.fillText(alturaText, canvas.width-ctx.measureText(alturaText).width-10 , canvas.height-10);
}

function drawResults(b0, b1, point, fx) {
	var xNormalized = point,
		resultText = fx;

	if (point > 10) {
		xNormalized = ((10*(point-10)) + 10);
	}
	if (point > 20) {
		xNormalized = (10*(point-10));
	}


 	for (var i = 0; i < x.length; i++) {
		createSquare(cttx, cnn, x[i], y[i]);
 	}

	createLinePath(
		cttx,
		{x: b1, y: ((cnn.height+10) - b0)},
		{x: xNormalized, y: (cnn.height - fx) + 90},
		"magenta"
	);

	createSquare(cttx, cnn, point, fx, "blue");
	cttx.font = "5px Arial";
	cttx.fillStyle = "#aaa";
	cttx.fillText(resultText, p + cttx.measureText(resultText).width + 5,  (cnn.height - fx) + 90);
}

// var sXX = 0,
// 	sYY = 0,
// 	sXY = 0;

function calcRegressao() {
	b1 = 0;
	b0 = 0;
	fx = 0;
	somax = 0;
	somay = 0;
	somax2 = 0;
	somay2 = 0;
	somaxy = 0;

	for(i = 0; i < x.length; i++) {
		somax += x[i];
		somay += y[i];
		somax2 += x[i] * x[i];
		somay2 += y[i] * y[i];
		somaxy += x[i] * y[i];
	}

	// sXX = somax2 - (p * (Math.pow(somax,2)));
	// sXY = somaxy - (p * (somax*somay));
	// sYY = somay2 - (p * (Math.pow(somay,2)));

	// b1 = sXY / sXX;
	b1 = (somaxy - ((somax * somay) / x.length)) / (somax2 - (Math.pow(somax,2) / x.length));
	// b0 = somay - (b1 * somax);
	b0 = (somay / y.length) - b1 * (somax / x.length);
	fx = b0 + b1 * p;

	var r2 = ((x.length * somaxy) - (somax * somay)) / Math.sqrt((x.length * somax2 - Math.pow(somax, 2)) * (x.length * somay2 - Math.pow(somay, 2)));

	el(".valorDeX").innerHTML = "[" + x.join(", ") + "]";
	el(".valorDeY").innerHTML = "[" + y.join(", ") + "]";
	el(".valorDeP").innerHTML = p;
	el(".valorDeR2").innerHTML = r2;

	el(".valorA").innerHTML = b1;
	el(".valorB").innerHTML = b0;
	el(".valorFX").innerHTML = fx;
	// el(".pointValue").innerHTML = p;


	drawResults(b0, b1, p, fx);
}

/*************************
 * 		# EVENTS
 *************************/

drawPlanGraph(150);

function executarAcao () {
	// cttx.clearRect(0, 0, cnn.width, cnn.height);
	var valoresDeX = el("#xValues").value.split(",").map(function(item) {
		    return parseInt(item, 10);
		}),
		valoresDeY = el("#yValues").value.split(",").map(function(item) {
		    return parseInt(item, 10);
		}),
		valorDeP = el("#pValue").value.split(",");

	x = valoresDeX;
	y = valoresDeY;
	p = valorDeP;

	cttx.clearRect(0, 0, cnn.width, cnn.height);
	drawPlanGraph();
	calcRegressao();
}
