export function toAnimationObj(arr) {
  const newArr = [];
  let prev = {};
  arr.forEach(unit => {
    let obj = {...prev, ...unit}
    newArr.push(obj);
    prev = obj;
  });
  console.log('newArr', JSON.stringify(newArr, 2, null));
  return newArr
}

export function fromAnimationObj(arr) {
  const newArr = [];
  for (let i = arr.length-1; i > 0; i--){
    const obj = {...arr[i]};
    const prevObj = arr[i-1];
    Object.keys(obj).map((key, value) => {
      if(obj[key] === prevObj[key]) {
        delete obj[key];
      }
    })
    newArr.push(obj);
  }
  newArr.push(arr[0]);
  return newArr.reverse()
}