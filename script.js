var b1,
	b0,
	fx,

	x = [ 10,  11,  12,  13,  14,  15],
	y = [100, 112, 119, 130, 139, 142],
	p = 16,

	somaxy = 0,
	somax = 0,
	somay = 0,
	somax2 = 0,
	cnn,
	cttx,
	mtd = 10;

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

function drawPT(scale) {
    var canvas = document.getElementById('myCanvas'),
		ctx = canvas.getContext('2d'),
		pesoText,
		alturaText,
		nscale = 2.3;
	cnn = canvas;
	cttx = ctx;

	// #scale
	ctx.translate(0, -(canvas.height + (canvas.height / 3.3)));
	ctx.scale(nscale, nscale);

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

	createLinePath(
		ctx,
		{x: x[0], y: y[0]},
		{x: 500 - (500-x[x.length-1]), y: 500 - (500 - y[y.length-1])},
		"wine"
	);

 	for (var i = 0; i < x.length; i++) {
		// ctx.fillRect(x[i], canvas.y[i], 10, 10);
		createSquare(ctx, canvas, x[i], y[i]);
 	}

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

/////////////////
// CALL EVENTS //
/////////////////
drawPT(150);


/**
 * TODO: Criar função para calcular a regreção e a Reta.
 */

for(i = 0; i < x.length; i++) {
	somaxy += x[i] * y[i];
	somax += x[i];
	somay += y[i];
	somax2 += x[i] * x[i];
}

b1 = (somaxy - ((somax * somay) / x.length)) / (somax2 - (Math.pow(somax,2) / x.length));
b0 = (somay / y.length) - b1 * (somax / x.length);
fx = b0 + b1 * p;


document.querySelector(".valorA").innerHTML = b1;
document.querySelector(".valorB").innerHTML = b0;
document.querySelector(".valorFX").innerHTML = fx;
document.querySelector(".pointValue").innerHTML = p;

drawResults(b0, b1, p, fx);
