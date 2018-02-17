var sqrt3 = Math.sqrt(3),
	thirdPi = Math.PI / 3,
	angles = [0, thirdPi * 2, thirdPi * 4];

function pointX(d) {
  return d[0];
}

function pointY(d) {
  return d[1];
}

export default function() {
	var s,
		inR,
		outR,
		h,
		x = pointX,
		y = pointY,
		x0 = 0,
		y0 = 0,
		x1 = 1,
		y1 = 1;

	function tribin(points) {
		var binsById = {}, bins = [], i, n = points.length;

		for (i = 0; i < n; ++i) {
			if (isNaN(px = +x.call(null, point = points[i], i, points)) || isNaN(py = +y.call(null, point, i, points))) continue;

			var point, px, py,
				row = Math.floor(py / h),
				col,
				rowIsOdd = row % 2 == 1;

			if (rowIsOdd) {
	            col = Math.floor((px + s / 2) / s);
	        } else {
	            col = Math.floor(px / s);
	        }

	        var offY = row * h;
	        var offX;

	        if (rowIsOdd) {
	            offX = col * s - s / 2;
	        } else {
	            offX = col * s;
	        }

	        var relY = py - offY;
	        var relX = px - offX;

	        var binX = offX + s / 2;
	        var binY = offY + outR;
	        var binRotation = 0;

	        var c = h;
        	var m = c / (s / 2);

        	var triangleCol = col * 2 + 1, triangleRow = row;

        	if (relY < (-m * relX) + c) {
        		triangleCol--;
        		binX = offX;
        		binY = offY + inR;
        		binRotation = Math.PI;
        	} else if (relY < (m * relX) - c) {
        		triangleCol++;
        		binX = offX + s;
        		binY = offY + inR;
        		binRotation = Math.PI;
        	}
	        
        	var id = triangleRow + "-" + triangleCol, bin = binsById[id];
        	if (bin) bin.push(point);
        	else {
        		bins.push(bin = binsById[id] = [point]);
        		bin.x = binX;
        		bin.y = binY;
        		bin.rotation = binRotation;
        	}
		}

		return bins;
	}

	function triangle(side, rotation) {
		var x0 = 0, y0 = 0, r = side * sqrt3 / 3;
		return angles.map(function(angle) {
			var x1 = Math.sin(angle + rotation) * r,
				y1 = -Math.cos(angle + rotation) * r,
				dx = x1 - x0,
				dy = y1 - y0;
				x0 = x1, y0 = y1;
			return [dx, dy];
		});
	}

	tribin.triangle = function(side, rotation, center) {
		var moveCenter = (center == null ? "" : "M" + center[0] + "," + center[1]);
		return moveCenter + "m" + triangle(side == null ? s : +side, rotation == null ? 0 : +rotation).join("l") + "z";
	}

	tribin.triangleBin = function(d) {
		return tribin.triangle(s, d.rotation, [d.x, d.y]);
	}

	tribin.centers = function() {
		// TODO
	}

	tribin.mesh = function() {
		// TODO
	}

	tribin.x = function(_) {
		return arguments.length ? (x = _, tribin) : x;
	};

	tribin.y = function(_) {
		return arguments.length ? (y = _, tribin) : y;
	};

	tribin.side = function(_) {
		return arguments.length ? (s = +_, inR = s * sqrt3 / 6, outR = s * sqrt3 / 3, h = inR + outR, tribin) : s;
	};

	tribin.size = function(_) {
		return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], tribin) : [x1 - x0, y1 - y0];
	};

	tribin.extent = function(_) {
		return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], tribin) : [[x0, y0], [x1, y1]];
	};

	return tribin.side(1);
};
