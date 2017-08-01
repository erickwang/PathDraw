const utils = require('./segUtils.js');

const prevObj = {
	type: 'M',
	x: 100,
	y: 100
}

const line = {
	type: 'L',
	x: 400,
	y: 100
} 

const quad = {
	type: 'Q',
	x: 400,
	y: 100,
	ctx: 250,
	cty: 100
}

const curve = {
	type: 'C',
	x: 400,
	y: 100,
	ctx: 200,
	cty: 100,
	ct2x: 300,
	ct2y: 100
}

describe('Path segment type chang', () => {
	test('From line to quadratic curve', () => { expect(utils.changeType(prevObj, line, 'Q')).toEqual(quad) });
	test('From line to bezier curve', () => { expect(utils.changeType(prevObj, line, 'C')).toEqual(curve) });
	test('From quadratic curve to line ', () => { expect(utils.changeType(prevObj, quad, 'L')).toEqual(line) });
	test('From quadratic curve to bezier curve', () => { expect(utils.changeType(prevObj, quad, 'C')).toEqual(curve) });
	test('From bezier curve to line ', () => { expect(utils.changeType(prevObj, curve, 'L')).toEqual(line) });
	test('From bezier curve to quadratic curve', () => { expect(utils.changeType(prevObj, curve, 'Q')).toEqual(quad) });
})
