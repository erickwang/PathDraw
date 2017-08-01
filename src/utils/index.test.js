const utils = require('./index.js');

const input = [
	{
		type: 'M',
		x: 100,
		y: 200
	},
	{
		type: 'L',
		x: 200,
		y: 300
	},
	{
		type: 'C',
		x: 400,
		y: 400,
		ctx: 0,
		cty: 0,
		ct2x: 100,
		ct2y: 100
	}
]

const output = [
	{
		type: 'M',
		x: 150,
		y: 250
	},
	{
		type: 'L',
		x: 250,
		y: 350
	},
	{
		type: 'C',
		x: 450,
		y: 450,
		ctx: 50,
		cty: 50,
		ct2x: 150,
		ct2y: 150
	}
]

const output2 = [
	{
		type: 'M',
		x: 150,
		y: 150
	},
	{
		type: 'L',
		x: 250,
		y: 250
	},
	{
		type: 'C',
		x: 450,
		y: 350,
		ctx: 50,
		cty: -50,
		ct2x: 150,
		ct2y: 50
	}
]

describe('Translate, Resize and Rotate', () => {
	test('translate path object ', () => { expect(utils.translate(input, 50, 50)).toEqual(output) });
	test('translate path object for negative offset ', () => { expect(utils.translate(input, 50, -50)).toEqual(output2) });
})
