# PositionalGridWidget
An extension allowing to view a data grid where position is the fundamental component.

## Description
This extension provides a widget allowing to view a data grid where position is the fundamental component (the name is freely inspired by 'Pep Guardiola's Positional Soccer Grid'). The grid is described by the ds_PositionalGrid DataShape (see below); the DataShape structure is mandatory, but it can be extended with additional fields.

## Properties
- debugMode - BOOLEAN (default = false): if set to true it sends to the browser's JS console a set of information useful for debugging the widget
- background - HYPERLINK (no default value): the background image, raster (png, jpeg, etc.) or vectorial (svg, etc.)
- data - INFOTABLE (no default value): the grid data source (use or duplicate & extend the Data Shape ds_PositionalGrid, see below)
- editedData - INFOTABLE (no default value): the (optional) edited data
- editPositions - BOOLEAN (default = false): true to activate the position editing
- rowSelection - STRING (default = 'None'): disable row selection, enable only single row selection, or enable multiple row selection (options: None, Single, Multiple)

## Events
- DoubleClicked: event to notify that a data image has been double clicked

## DataShapes
- ds_PositionalGrid
  - id: an unique id to identify the item - STRING
  - centerX: the center X of the image - NUMBER
  - centerY: the center Y of the image - NUMBER
  - image: the image, raster (png, jpeg, etc.) or vectorial (svg, etc.) - HYPERLINK
  - selectedImage: the selected image, raster (png, jpeg, etc.) or vectorial (svg, etc.) - HYPERLINK

## Donate
If you would like to support the development of this and/or other extensions, consider making a [donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).
