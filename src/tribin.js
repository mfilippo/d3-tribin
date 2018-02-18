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
		y = pointY;

	function tribin(points) {
		var binsById = {},
			bins = [],
			i,
			n = points.length;

		for (i = 0; i < n; ++i) {
			if (isNaN(px = +x.call(null, point = points[i], i, points)) || isNaN(py = +y.call(null, point, i, points))) continue;

			var point,
				px,
				py,
				row = Math.floor(py / h),
				rowIsOdd = row % 2 == 1,
				col = (rowIsOdd ? Math.floor((px + s / 2) / s) : Math.floor(px / s)),
				offY = row * h,
				offX = (rowIsOdd ? col * s - s / 2 : col * s),
				relY = py - offY,
				relX = px - offX,
	        	binX = offX + s / 2,
	        	binY = offY + outR,
	        	binRotation = 0,
	        	triangleCol = col * 2 + 1,
	        	triangleRow = row,
	        	m = h / (s / 2);

        	if (relY < (-m * relX) + h) {
        		triangleCol--;
        		binX = offX;
        		binY = offY + inR;
        		binRotation = Math.PI;
        	} else if (relY < (m * relX) - h) {
        		triangleCol++;
        		binX = offX + s;
        		binY = offY + inR;
        		binRotation = Math.PI;
        	}
	        
        	var id = triangleRow + "-" + triangleCol,
        		bin = binsById[id];
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
		side = (side == null ? s : +side),
		rotation = (rotation == null ? 0 : +rotation);
		var moveCenter = (center == null ? "" : "M" + center[0] + "," + center[1]);
		return moveCenter + "m" + triangle(side, rotation).join("l") + "z";
	}

	tribin.triangleFromBin = function(d, side) {
		side = (side == null ? s : +side);
		return tribin.triangle(side, d.rotation, [d.x, d.y]);
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

	return tribin.side(1);
};
