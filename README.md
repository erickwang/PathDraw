# PathDraw - SVG Pattern Creator

This project is a prototype to demonstrate the immense possibility, React and SVG offers to build a robostic vector generator/editor.

[Click here](http://pathdraw.s3-website-ap-southeast-1.amazonaws.com/) to demo the application.

## Why??
At first, I build this took for personal use. Being a hardcore developer, I am bad at using designing tools like photoshop, illustrator or inkscape. And most of the time, my design jobs are very plain and simple. I prefer to draw my icons using code (svg) and hence I build this tool. The primary solution this tool provides, is the ability to draw, simple and mathematically accurate svg images.

## Feature List:

**Freehand drawing:** By default, freehand drawing is selected and we can start drawing on the canvas. You may notice, the drawing does not follow the mouse accurately, but only approximately. We kept it this way for two purpose
1. To generate a smooth path.
2. To generate minimum number of path data.

**Transform Path:** We can select a particular draw from 'All Draws' panel. We can move(translate), resize(scale) and rotate any draws. For moving, we also provide keyboard shortcuts (ctrl + arrow, ctrl + shift+ arrow) which are easily predictable.

**Micro-edit Path:** When you select a draw from 'All Draws' panel, 'Editor' panel will show up. It lists all the constituent segments of the path. We can click any of them and edit-in-place through text field. Also we can edit in the canvas through control points.

**Loop:** We can create a circular pattern around a point, or linear pattern with x-y offset. This is the fun part of the tool.

**Guide:** Guide provides an option to trace an image, which is a very common usecase where we recreate some graphics from raster to svg.

**Source:** Source panel can be used to retrieve the svg and you can save it as a file. Ofcourse we can directly edit the svg in 'Source' panel, but unfortunately, currently we are supporting only a subset of svg.

**Zoom, Reset, Panning:** Though zoom and 'exact fit' are obvious in the tool bar, panning feature is not visible anywhere. We can ctrl+drag the canvas area to view hidden drawings.

**Stroke & Fill:** Through 'Properties' panel, we can set the stroke and fill properties.

**All Draws:** This panel is used to select a draw. Also we can hide any draw by toggling the 'eye' icon. We can also change the stacking order of the draws, by using the 'up' and 'down' arrow keys.

_(*Note:* This is the first version, and so there are a few bugs and some imcomplete features. Bear with us for now.)_

This quick video will show the USP of this tool.


[![Youtube Video](http://img.youtube.com/vi/6uBprLxyAdg/0.jpg)](https://youtu.be/6uBprLxyAdg)

### Tech Notes

This tool is build using React, Redux, Immutable & Webpack. There is no unit testing for now and there wont be much helping comments. But the code is written in declarative and understandable manner.
