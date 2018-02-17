var tape = require("tape"),
	d3 = require("../");

tape("d3.tribin() has the expected defaults", function(test) {
	var b = d3.tribin();
	test.equal(b.x()([41, 42]), 41);
	test.equal(b.y()([41, 42]), 42);
	test.equal(b.side(), 1);
	test.end();
});

tape("tribin(points) bins the specified points into triangular bins", function(test) {
	var bins = d3.tribin()([
		[0, 0], [1, 0], [2, 0],
		[0, 0.5], [1, 0.5], [2, 0.5],
		[0, 1], [1, 1], [2, 1]
		]);
	test.deepEqual(noxy(bins), [
		[[0, 0], [0, 0.5]],
		[[1, 0], [1, 0.5]],
		[[2, 0], [2, 0.5]],
		[[0, 1]],
		[[1, 1]],
		[[2, 1]]
		]);
	test.deepEqual(xyr(bins), [
		{x: 0, y: 0.28867513459481287, r: 3.141592653589793},
		{x: 1, y: 0.28867513459481287, r: 3.141592653589793},
		{x: 2, y: 0.28867513459481287, r: 3.141592653589793},
		{x: 0, y: 1.4433756729740643, r: 0},
		{x: 1, y: 1.4433756729740643, r: 0},
		{x: 2, y: 1.4433756729740643, r: 0}
		]);
	test.end();
});

function noxy(bins) {
	return bins.map(function(bin) {
		return bin.slice();
	});
}

function xyr(bins) {
	return bins.map(function(bin) {
		return {x: bin.x, y: bin.y, r: bin.rotation};
	});
}