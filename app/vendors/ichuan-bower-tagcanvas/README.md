## Intro

This is a modified version of [tagcanvas](http://www.goat1000.com/tagcanvas.php) with `TagCanvas.Stop(id)` added.

## Why

In TagCanvas, there's a `TagCanvas.Start(id)` interface. When in SAP applications, according to template reloading, it's common for a name to be assigned to several different element. When calling `TagCanvas.Start()` on the same name repeatedly, those after the first one will not entering drawing loop correctly.

So I added a `TagCanvas.Stop(id)` interface, you just need to call it before you call `TagCanvas.Start(id)`, or just after route change.
