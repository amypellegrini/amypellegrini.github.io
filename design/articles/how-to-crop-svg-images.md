# How to crop SVG images

Last week I had to assist some of my colleagues regarding SVG adjustments which would have been a bit exensive to fix --in human-hours of work, involving a requirement to desingers to provide new SVG assets and wait until they provide it-- hadn't I trained to know a bit more about SVGs.

In this ocassion we'll learn about a most common use case, namely to crop existing SVG images to fit a certain content area within the same SVG.

## SVGs vs Raster images

SVGs are a very approachable image format in that they present a balanced counterpoint between coding and visual design.

For the most part, images are represented as a matrix of pixels with a specific colour assigned to each pixel, called _raster graphics_ which observed at a proper distance give the illusion of an actual image. If we scale the image further in order to see closer, the image itself loses its meaning and starts to look more like a grid of square blocks in different colours. This is done so given the digital architecture of computers which can only handle binary values.

<img src="https://en.wikipedia.org/wiki/Raster_graphics#/media/File:Rgb-raster-image.svg" alt="Raster image example" />

Such technique presents certain limitations which become relevant as soon as we start to re-use image assets in different devices which employ varied sceren sizes and resolutions, wich results in the same image not being suitable to scale properly in all possible cases.

However, SVGs overcome this limitation by using an abstract coordinate system with relative units of measument, to produce what we refer to as _vector graphics_. While it is very difficult to encode an actual image in terms of vectors (the complexity of a real life image is very difficult to emulate with pure code), it is very easy to use vector graphics to draw simple images which are more conceptual than photographic, with the added advantage of the image being agonstic of the device in use, therefore being able to scale up to any size regardless of the unit of measurement: hence the name Scalable Vector Graphics.

## Using the `viewBox` property

The `viewBox` property in an SVG defines the visible region, or "frame" where the image is shown.
