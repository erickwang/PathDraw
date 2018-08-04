import * as anim from './animation'

const input1 = [
  {
    translateX: 100
  },
  {
    translateY: 100
  },
  {
    translateX: 0
  },
  {
    translateY: 0
  }
]

const output1 = [
  {
    translateX: 100
  },
  {
    translateX: 100,
    translateY: 100
  },
  {
    translateX: 0,
    translateY: 100
  },
  {
    translateX: 0,
    translateY: 0,
  }
]

describe('Convert Animation Object', () => {
	test('From user input to animation oject', () => { expect(anim.toAnimationObj(input1)).toEqual(output1) });
	test('From animation object to user input', () => { expect(anim.fromAnimationObj(output1)).toEqual(input1) });
})

