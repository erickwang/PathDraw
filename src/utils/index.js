import React from 'react';
import { List } from 'immutable';

let counter = 1;

export function nodeToData(svgStr) {
  const dom = document.createElement('DIV');
  dom.innerHTML = svgStr;
  const root = dom.querySelector('svg');
  let a = new List();
  for (let i = 0; i < root.childNodes.length; i++) {
    const node = root.childNodes[i];
    if (node.nodeType != 1) {
      continue;
    }
    const type = node.nodeName.toLowerCase();
    let id = node.getAttribute('id');
    if (!id) {
      id = `temp_${counter}`;
      counter++;
    }
    const obj = {
      type,
      id,
      visible: true
    };
    switch (type) {
      case 'path':
        obj.d = node.getAttribute('d');
        break;
      case 'circle':
        obj.cx = node.getAttribute('cx');
        obj.cy = node.getAttribute('cy');
        obj.r = node.getAttribute('r');
        break;
      case 'line':
        obj.x1 = node.getAttribute('x1');
        obj.y1 = node.getAttribute('y1');
        obj.x2 = node.getAttribute('x2');
        obj.y2 = node.getAttribute('y2');
        break;
    }
    a = a.push(obj);
  }

  const ids = [];
  for (let i = 0; i < a.size; i++) {
    if (ids.indexOf(a.get(i).id) != -1) {
      const item = a.get(i);
      item.id = `${item.id}_dup_${i}`;
      a.set(i, item);
    }
    ids.push(a.get(i).id);
  }
  return a;
}

export function dataToNode(data) {
  const dom = data.map((item) => {
    let arr;
    switch (item.loopType) {
      case 'loop':
        arr = constructArr(item);
        return (
          <g>
            {
                arr.map((o, i) => getUnit(item.type, o, i))
              }
          </g>
        );
      case '2dLoop':
        arr = construct2DArr(item);
        return (
          <g>
            {
                arr.map((a) => {
                  return (
                    a.map((o, i) => getUnit(item.type, o, i))
                    );
                })
              }
          </g>
        );
      case 'circular':
        arr = rotationArr(item);
        return (
          <g>
            {
                arr.map((deg, i) => {
                  const rotObj = {
                    rotation: deg,
                    cx: item.loopInfo.centerX,
                    cy: item.loopInfo.centerY
                  };
                  return getRotatedUnit(item.type, item, rotObj, i);
                })
              }
          </g>
        );
      default:
        return getUnit(item.type, item);

    }
  });
  return dom;

  function getUnit(type, obj, i) {
    let str = '';
    const addObj = {};
    if (obj.strokeWidth) {
      addObj.strokeWidth = obj.strokeWidth;
    }
    if (obj.stroke) {
      addObj.stroke = obj.stroke;
    }
    if (obj.fill) {
      addObj.fill = obj.fill;
    }
    if(!obj.visible){
      addObj.display = 'none';
    }
    let id = obj.id;
    if (i) {
      id += `_${i}`;
    }
    addObj.key = id;
    addObj.id = id;
    return <path d={obj.d} className={obj.class} {...addObj} />;
  }

  
  function getRotatedUnit(type, obj, rotObj, i) {
    let str = '';
    const addObj = {};
    if (obj.strokeWidth) {
      addObj.strokeWidth = obj.strokeWidth;
    }
    if (obj.stroke) {
      addObj.stroke = obj.stroke;
    }
    if (obj.fill) {
      addObj.fill = obj.fill;
    }
    let id = obj.id;
    if (i) {
      id += `_${i}`;
    }
    addObj.key = id;
    addObj.id = id;
    switch (type) {
      case 'line':
        str = (<line
          x1={obj.x1}
          y1={obj.y1}
          x2={obj.x2}
          y2={obj.y2}
          transform={`rotate(${rotObj.rotation},${rotObj.cx},${rotObj.cy})`}
          {...addObj}
        />);
        break;
      case 'circle':
        str = (<circle
          cx={obj.cx}
          cy={obj.cy}
          r={obj.r}
          transform={`rotate(${rotObj.rotation},${rotObj.cx},${rotObj.cy})`}
          {...addObj}
        />);
        break;
      case 'ellipse':
        str = (<ellipse
          cx={obj.cx}
          cy={obj.cy}
          rx={obj.rx}
          ry={obj.ry}
          transform={`rotate(${rotObj.rotation},${rotObj.cx},${rotObj.cy})`}
          {...addObj}
        />);
        break;
      case 'path':
        str = (<path
          d={obj.d}
          transform={rotObj.rotation === 0 ? '' : `rotate(${rotObj.rotation},${rotObj.cx},${rotObj.cy})`}
          {...addObj}
        />);
        break;
    }
    return str;
  }

/*
  function constructArr(obj) {
    const a = [];
    for (let i = 0; i < obj.loopInfo.count; i++) {
      const o = {};
      for (const prop in obj) {
        if (['x1', 'x2', 'y1', 'y2', 'cx', 'cy', 'r', 'rx', 'ry'].indexOf(prop) != -1) {
          if (obj[prop] == 'x') {
            o[prop] = Number(obj.loopInfo.offset) + (Number(obj.loopInfo.step) * i);
          } else {
            o[prop] = obj[prop];
          }
        }
        if (obj.d) {
          const x = Number(obj.loopInfo.offset) + (Number(obj.loopInfo.step) * i);
          o.d = obj.d.replace(/x/g, `${x}`);
          while (o.d.indexOf('(') != -1) {
            const start = o.d.indexOf('(');
            const end = o.d.indexOf(')');
            o.d = o.d.substr(0, start) + eval(o.d.substr(start + 1, end)) + o.d.substr(end + 1);
          }
        }
      }
      a.push(o);
    }
    return a;
  }
  */

  function constructArr(obj) {
    const a = [];
    for (let i = 0; i < obj.loopInfo.count; i++) {
      if(i === 0){
        a.push({...obj});
      }else{
        let list = dataToObj(obj.d);
        let newList = translate(list, obj.loopInfo.stepX * i , obj.loopInfo.stepY * i);
        a.push({...obj, d:objToData(newList)})
      }
    }
    return a;
  }

  function construct2DArr(obj) {
    const a = [];
    for (let i = 0; i < obj.loopInfo.count; i++) {
      const arr = [];
      for (let j = 0; j < obj.loopInfo.county; j++) {
        const o = {};
        for (const prop in obj) {
          if (obj[prop] == 'x') {
            o[prop] = Number(obj.loopInfo.offset) + (Number(obj.loopInfo.step) * i);
          } else if (obj[prop] == 'y') {
            o[prop] = Number(obj.loopInfo.offsety) + (Number(obj.loopInfo.stepy) * j);
          } else {
            o[prop] = obj[prop];
          }
        }
        arr.push(o);
      }
      a.push(arr);
    }
    return a;
  }

  function rotationArr(obj) {
    const a = [];
    for (let i = 0; i < obj.loopInfo.count; i++) {
      a.push(360 / obj.loopInfo.count * i);
    }
    return a;
  }
}

export function dataToObj(str) {
  // let str = 'M 100 100 L 100 200 L 200 200 Q 100 250 200 300 L 300 300 L 300 400 L 400 400 C 400 300 450 300 450 450';
  const reg = /[MLCQSTHVAZ][\-?0-9\s]+/ig;
  const arr = [];
  while (true) {
    const val = reg.exec(str);
    if (!val || val.length == 0) {
      break;
    } else {
      arr.push(val[0]);
    }
  }
  const data = [];
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i].split(' ');
    const obj = dataToObjUnit(arr[i]);
    if (obj) {
      data.push(obj);
    }
  }
  return data;
}

export function dataToObjUnit(str) {
  str = str.trim();
  str = str.replace(/\s+/, ' ');
  const a = str.split(' ');
  let obj;
  switch (a[0].toUpperCase()) {
    case 'M':
    case 'L':
    case 'T':
      obj = {
        type: a[0],
        x: parseInt(a[1]),
        y: parseInt(a[2])
      };
      if (a.length != 3 || obj.x == NaN || obj.y == NaN) {
          return null;
      }
      break;
    case 'H':
    case 'V':
      obj = {
        type: a[0],
        val: parseInt(a[1])
      }
      if (a.length != 2 || obj.val == NaN ) {
          return null;
      }
      break;
    case 'C':
      obj = {
        type: a[0],
        ctx: parseInt(a[1]),
        cty: parseInt(a[2]),
        ct2x: parseInt(a[3]),
        ct2y: parseInt(a[4]),
        x: parseInt(a[5]),
        y: parseInt(a[6])
      };
      if (a.length != 7 || obj.x == NaN || obj.y == NaN) {
          return null;
      }
      break;
    case 'Q':
    case 'S':
      obj = {
        type: a[0],
        ctx: parseInt(a[1]),
        cty: parseInt(a[2]),
        x: parseInt(a[3]),
        y: parseInt(a[4])
      };
      if (a.length != 5 || obj.x == NaN || obj.y == NaN) {
          return null;
      }
      break;
    case 'Z':
      obj = {
        type: a[0]
      }
      if (a.length != 1){
        return  null;
      }
  }
  return obj;
}

// d is a List
export function objToData(d) {
  let str = '';
  for (let i = 0; i < d.length; i++) {
    const obj = d[i];
    switch (obj.type.toUpperCase()) {
      case 'M':
      case 'L':
      case 'T':
        str += `${obj.type} ${obj.x} ${obj.y} `;
        break;
      case 'H':
      case 'V':
        str += `${obj.type} ${obj.val} `;
        break;
      case 'C':
        str += `${obj.type} ${obj.ctx} ${obj.cty} ${obj.ct2x} ${obj.ct2y} ${obj.x} ${obj.y} `;
        break;
      case 'Q':
      case 'S':
        str += `${obj.type} ${obj.ctx} ${obj.cty} ${obj.x} ${obj.y} `;
        break;
      case 'Z':
        str += `${obj.type} `;
        break;
    }
  }
  return str;
}

export function translate(d, tx, ty) {
  let list = [];
  for (let i = 0; i < d.length; i++) {
    const obj = Object.assign({}, d[i]);
    switch (obj.type.toUpperCase()) {
      case 'M':
      case 'L':
      case 'T':
        obj.x += tx;
        obj.y += ty;
        break;
      case 'C':
        obj.x += tx;
        obj.ctx += tx;
        obj.ct2x += tx;
        obj.y += ty;
        obj.cty += ty;
        obj.ct2y += ty;
        break;
      case 'Q':
      case 'S':
        obj.x += tx;
        obj.ctx += tx;
        obj.y += ty;
        obj.cty += ty;
        break;
      case 'H':
        obj.val += tx;
        break;
      case 'V':
        obj.val += ty;
        break;
    }
    list.push(obj);
  }
  return list;
}

export function resize(d, ox, oy, sx, sy) {
  let list = [];
  for (let i = 0; i < d.length; i++) {
    const obj = Object.assign({}, d[i]);
    switch (obj.type.toUpperCase()) {
      case 'M':
      case 'L':
      case 'T':
        obj.x = parseInt(ox + (obj.x - ox) * sx);
        obj.y = parseInt(oy + (obj.y - oy) * sy);
        break;
      case 'C':
        obj.x = parseInt(ox + (obj.x - ox) * sx);
        obj.ctx = parseInt(ox + (obj.ctx - ox) * sx);
        obj.ct2x = parseInt(ox + (obj.ct2x - ox) * sx);
        obj.y = parseInt(oy + (obj.y - oy) * sy);
        obj.cty = parseInt(oy + (obj.cty - oy) * sy);
        obj.ct2y = parseInt(oy + (obj.ct2y - oy) * sy);
        break;
      case 'Q':
      case 'S':
        obj.x = parseInt(ox + (obj.x - ox) * sx);
        obj.ctx = parseInt(ox + (obj.ctx - ox) * sx);
        obj.y = parseInt(oy + (obj.y - oy) * sy);
        obj.cty = parseInt(oy + (obj.cty - oy) * sy);
        break;
      case 'H':
        obj.val += parseInt(ox + (obj.val - ox) * sx);
        break;
      case 'V':
        obj.val += parseInt(oy + (obj.val - oy) * sy);
        break;
    }
    list.push(obj);
  }
  return list;
}


export function rotate(d, ox, oy, r) {
  r = r * Math.PI / 180 * -1;
  let list = [];
  for (let i = 0; i < d.length; i++) {
    const obj = Object.assign({}, d[i]);
    let dx,
      dy,
      x,
      y;
    switch (obj.type.toUpperCase()) {
      case 'M':
      case 'L':
      case 'T':
        dx = obj.x - ox;
        dy = obj.y - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.x = parseInt(x);
        obj.y = parseInt(y);
        break;
      case 'C':
        dx = obj.x - ox;
        dy = obj.y - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.x = parseInt(x);
        obj.y = parseInt(y);

        dx = obj.ctx - ox;
        dy = obj.cty - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.ctx = parseInt(x);
        obj.cty = parseInt(y);

        dx = obj.ct2x - ox;
        dy = obj.ct2y - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.ct2x = parseInt(x);
        obj.ct2y = parseInt(y);
        break;
      case 'Q':
      case 'S':
        dx = obj.x - ox;
        dy = obj.y - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.x = parseInt(x);
        obj.y = parseInt(y);

        dx = obj.ctx - ox;
        dy = obj.cty - oy;
        x = ox + dx * Math.cos(r) + dy * Math.sin(r);
        y = oy + dy * Math.cos(r) - dx * Math.sin(r);
        obj.ctx = parseInt(x);
        obj.cty = parseInt(y);
        break;
    }
    list.push(obj);
  }
  return list;
}

export function getSmoothPath(arr){
    fillMorePts(arr);
    var str = "M " + arr[0] + " " + arr[1] + " ";
    var firstCtrlX = arr[2];
    var firstCtrlY = arr[3];
    var secCtrlX = 0;
    var secCtrlY = 0;
    var nextFirstX;
    var nextFirstY;
    for(var i = 2; i < arr.length; i+= 6){
        if(nextFirstX){
            firstCtrlX = nextFirstX;
            firstCtrlY = nextFirstY;
        }

        if(i + 7 < arr.length){
            var x1 = arr[i+2] - arr[i+4],
                y1 = arr[i+3] - arr[i+5],
                x2 = arr[i+6] - arr[i+4],
                y2 = arr[i+7] - arr[i+5];

            var anglea = Math.atan2(y1, x1),
                angleb = Math.atan2(y2, x2),
                r1 = Math.sqrt(x1*x1+y1*y1),
                r2 = Math.sqrt(x2*x2+y2*y2);
            if (anglea < 0) { anglea += 2*Math.PI; }
            if (angleb < 0) { angleb += 2*Math.PI; }

            var angleBetween = Math.abs(anglea - angleb),
                angleDiff = Math.abs(Math.PI - angleBetween)/2;

            var new_anglea, new_angleb;
            if (anglea - angleb > 0) {
                new_anglea = angleBetween < Math.PI ? (anglea + angleDiff) : (anglea - angleDiff);
                new_angleb = angleBetween < Math.PI ? (angleb - angleDiff) : (angleb + angleDiff);
            }
            else {
                new_anglea = angleBetween < Math.PI ? (anglea - angleDiff) : (anglea + angleDiff);
                new_angleb = angleBetween < Math.PI ? (angleb + angleDiff) : (angleb - angleDiff);
            }

            // rotate the points

            secCtrlX = r1 * Math.cos(new_anglea) + arr[i+4];
            secCtrlY = r1 * Math.sin(new_anglea) + arr[i+5];


            nextFirstX = r2 * Math.cos(new_angleb) + arr[i+4];
            nextFirstY = r2 * Math.sin(new_angleb) + arr[i+5];
        }else{
            secCtrlX = arr[i+2];
            secCtrlY = arr[i+3];
        }
        if(i === 2){
          str += "C " + Math.round(firstCtrlX) + " " + Math.round(firstCtrlY) + " " + Math.round(secCtrlX) + " " + Math.round(secCtrlY) 
                    + " " + Math.round(arr[i+4]) + " " + Math.round(arr[i+5]) + " ";
        }else{
          str += `S ${Math.round(secCtrlX)} ${Math.round(secCtrlY)} ${Math.round(arr[i+4])} ${Math.round(arr[i+5])} `
        }
        
   };

    return str;

  function fillMorePts(arr) {
      var len = arr.length / 2;
      var xpos, ypos;
      if (len % 3 != 1) {
          var lp = arr.length - 1;
          xpos = (arr[lp - 1] + arr[lp - 3]) / 2;
          ypos = (arr[lp] + arr[lp - 2]) / 2;
          arr.splice(lp - 1, 0, xpos, ypos);
      }
      if (len % 3 == 2) {
          var lp = arr.length - 1;
          xpos = (arr[lp - 1] + arr[lp - 3]) / 2;
          ypos = (arr[lp] + arr[lp - 2]) / 2;
          arr.splice(lp - 1, 0, xpos, ypos);
      }
      return arr;
  }
}

//not working as expected
export function getSmoothPath2(arr){
  fillMorePts(arr);
  var str = "M " + arr[0] + " " + arr[1] + " ";
  str += `C ${arr[2]} ${arr[3]} ${arr[4]} ${arr[5]} ${arr[6]} ${arr[7]} `
  var firstCtrlX = arr[2];
  var firstCtrlY = arr[3];
  var secCtrlX = 0;
  var secCtrlY = 0;
  var nextFirstX;
  var nextFirstY;
  for(var i = 8; i < arr.length; i+= 4){
    str += `S ${arr[i]} ${arr[i+1]} ${arr[i+2]} ${arr[i+3]} `
  }
  return str;
  function fillMorePts(arr) {
      var len = arr.length / 2;
      if(len <= 4){
        return arr;
      }
      var xpos, ypos;
      if (len % 2 == 1) {
          var lp = arr.length - 1;
          xpos = (arr[lp - 1] + arr[lp - 3]) / 2;
          ypos = (arr[lp] + arr[lp - 2]) / 2;
          arr.splice(lp - 1, 0, xpos, ypos);
      }
      return arr;
  }
}
  

export function toData(pt, domRef, zoom) {
  if (!domRef) {
    domRef = document.getElementById('contentSvg');
  }
  let rect = domRef.getBoundingClientRect();
  let rootRect = document.getElementById('rootSvg').getBoundingClientRect();
  return {
    x: parseInt((pt.x - rect.left )/zoom),
    y: parseInt((pt.y  - rect.top )/zoom)
  };

  /*
  return {
    x: parseInt((pt.x - parseInt(domRef.getAttribute('x'))) / zoom),
    y: parseInt((pt.y - parseInt(domRef.getAttribute('y'))) / zoom)
  };*/
}

// form co-ords to ctrl pts to data
export function toData2(pt, domRef, zoom) {
  if (!domRef) {
    domRef = document.getElementById('contentSvg');
  }
  let rect = domRef.getBoundingClientRect();
  let rootRect = document.getElementById('rootSvg').getBoundingClientRect();
  return {
    x: parseInt((pt.x - domRef.getAttribute('x')) / zoom),
    y: parseInt((pt.y - domRef.getAttribute('y')) / zoom)
  };
}

export function toActual(pt, domRef, zoom) {
  if (!domRef) {
    domRef = document.getElementById('contentSvg');
  }
  let rect = domRef.getBoundingClientRect();
  let rootRect = document.getElementById('rootSvg').getBoundingClientRect();
  return {
    x: parseInt(pt.x * zoom + rect.left - rootRect.left),
    y: parseInt(pt.y * zoom + rect.top - rootRect.top)
  };
  /*
  return {
    x: parseInt(pt.x * zoom + parseInt(domRef.getAttribute('x'))),
    y: parseInt(pt.y * zoom + parseInt(domRef.getAttribute('y')))
  };
  */
}

export function toActual2(pt, domRef, zoom) {
  if (!domRef) {
    domRef = document.getElementById('contentSvg');
  }
  return {
    x: parseInt(pt.x * zoom + parseInt(domRef.getAttribute('x'))),
    y: parseInt(pt.y * zoom + parseInt(domRef.getAttribute('y')))
  };
}

export function attr(node, obj) {
  for (const i of Object.keys(obj)) {
    node.setAttribute(i, obj[i]);
  }
}