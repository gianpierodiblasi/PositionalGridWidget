/* global TW */
TW.Runtime.Widgets.positionalgrid = function () {
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());

  var images = [];
  var currentSelectedRows = [];

  var backgroundRect;
  var markers = [];
  var scale;

  var editing = false;
  var markerIndex = -1;
  var boundingClientRect;

  this.runtimeProperties = function () {
    return {
      'supportsAutoResize': true,
      'needsDataLoadingAndError': false
    };
  };

  this.renderHtml = function () {
    var html = '';
    html =
            '<div class="widget-content widget-positionalgrid widget-positionalgrid-' + uid + '">' +
            '  <canvas class="widget-positionalgrid-canvas widget-positionalgrid-canvas-' + uid + '"></canvas>' +
            '</div>';
    return html;
  };

  this.afterRender = function () {
    var debugMode = thisWidget.getProperty('debugMode');
    var rowSelection = thisWidget.getProperty('rowSelection');

    var div = $('.widget-positionalgrid-' + uid)[0];
    new ResizeObserver(thisWidget.draw).observe(div);

    var canvas = $('.widget-positionalgrid-canvas-' + uid)[0];
    canvas.onmousemove = function (event) {
      if (editing) {
        var data = thisWidget.getProperty('editedData');
        data.rows[markerIndex].centerX = (event.pageX - boundingClientRect.left - backgroundRect.x) / scale;
        data.rows[markerIndex].centerY = (event.pageY - boundingClientRect.top - backgroundRect.y) / scale;

        thisWidget.setProperty("editedData", TW.InfoTableUtilities.CloneInfoTable({
          "dataShape": data.dataShape,
          "rows": data.rows
        }));
        thisWidget.draw();
      } else {
        markerIndex = -1;

        canvas.style.cursor = "default";
        var editPositions = thisWidget.getProperty('editPositions');

        if (editPositions || rowSelection !== "None") {
          var data = thisWidget.getProperty('data');

          for (var index = 0; index < data.rows.length; index++) {
            var inside = markers[data.rows[index].id].top <= event.offsetY && event.offsetY <= markers[data.rows[index].id].bottom && markers[data.rows[index].id].left <= event.offsetX && event.offsetX <= markers[data.rows[index].id].right;
            if (inside) {
              markerIndex = index;
              canvas.style.cursor = editPositions ? "move" : "pointer";
            }
          }
        }
      }
    };

    canvas.onmousedown = function (event) {
      if (markerIndex !== -1) {
        var editPositions = thisWidget.getProperty('editPositions');

        if (editPositions) {
          if (backgroundRect && markers.length) {
            editing = true;
            boundingClientRect = event.target.getBoundingClientRect();
          }
        } else if (rowSelection === "Single") {
          currentSelectedRows = [];
          currentSelectedRows[markerIndex] = true;

          thisWidget.updateSelection('data', [markerIndex]);
          thisWidget.draw();
        } else if (rowSelection === "Multiple") {
          currentSelectedRows[markerIndex] = !currentSelectedRows[markerIndex];

          var selectedRowIndices = [];
          for (var index = 0; index < currentSelectedRows.length; index++) {
            if (currentSelectedRows[index]) {
              selectedRowIndices.push(index);
            }
          }

          thisWidget.updateSelection('data', selectedRowIndices);
          thisWidget.draw();
        }
      }
    };

    canvas.onmouseup = function (event) {
      editing = false;
    };

    canvas.ondblclick = function (event) {
      if (markerIndex !== -1) {
        var editPositions = thisWidget.getProperty('editPositions');

        if (!editPositions && backgroundRect && markers.length) {
          thisWidget.jqElement.triggerHandler('DoubleClicked');
        }
      }
    };

    this.loadImages();
  };

  this.serviceInvoked = function (serviceName) {
  };

  this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
    if (propertyName === "data") {
      currentSelectedRows = [];
      if (selectedRowIndices) {
        for (var index = 0; index < selectedRowIndices.length; index++) {
          currentSelectedRows[selectedRowIndices[index]] = true;
        }
      }

      this.draw();
    }
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === 'data') {
      this.setProperty("data", updatePropertyInfo.RawSinglePropertyValue);

      this.setProperty("editedData", TW.InfoTableUtilities.CloneInfoTable({
        "dataShape": updatePropertyInfo.RawSinglePropertyValue.dataShape,
        "rows": updatePropertyInfo.RawSinglePropertyValue.rows
      }));

      var data = thisWidget.getProperty('data');
      var debugMode = thisWidget.getProperty('debugMode');

      if (debugMode) {
        console.log("PositionalGrid - infotable = ");
        console.log(data);
      }

      currentSelectedRows = [];
      if (updatePropertyInfo.SelectedRowIndices) {
        for (var index = 0; index < updatePropertyInfo.SelectedRowIndices.length; index++) {
          currentSelectedRows[updatePropertyInfo.SelectedRowIndices[index]] = true;
        }
      }
      this.loadImages();
    } else if (updatePropertyInfo.TargetProperty === 'background') {
      this.setProperty("background", updatePropertyInfo.RawSinglePropertyValue);
      this.loadImages();
    } else if (updatePropertyInfo.TargetProperty === 'editPositions') {
      this.setProperty("editPositions", updatePropertyInfo.RawSinglePropertyValue);
    }
  };

  this.loadImages = function () {
    var background = thisWidget.getProperty('background');
    var data = thisWidget.getProperty('data');
    var debugMode = thisWidget.getProperty('debugMode');

    if (background && !images[background]) {
      if (debugMode) {
        console.log("PositionalGrid - loading background = " + background);
      }

      images[background] = new Image();
      images[background].onload = thisWidget.loadImages;
      images[background].onerror = function () {
        var message = 'PositionalGrid - unabled to load the background = ' + background;
        TW.log.error(message);
        console.error(message);
      };
      images[background].src = background;
      return;
    }

    if (data) {
      for (var index = 0; index < data.rows.length; index++) {
        if (data.rows[index].image && !images[data.rows[index].image]) {
          if (debugMode) {
            console.log("PositionalGrid - loading image = " + data.rows[index].image);
          }

          images[data.rows[index].image] = new Image();
          images[data.rows[index].image].onload = thisWidget.loadImages;
          images[data.rows[index].image].onerror = function () {
            var message = 'PositionalGrid - unabled to load the image = ' + data.rows[index].image;
            TW.log.error(message);
            console.error(message);
          };
          images[data.rows[index].image].src = data.rows[index].image;
          return;
        } else if (data.rows[index].selectedImage && !images[data.rows[index].selectedImage]) {
          if (debugMode) {
            console.log("PositionalGrid - loading selectedImage = " + data.rows[index].selectedImage);
          }

          images[data.rows[index].selectedImage] = new Image();
          images[data.rows[index].selectedImage].onload = thisWidget.loadImages;
          images[data.rows[index].selectedImage].onerror = function () {
            var message = 'PositionalGrid - unabled to load the selectedImage = ' + data.rows[index].selectedImage;
            TW.log.error(message);
            console.error(message);
          };
          images[data.rows[index].selectedImage].src = data.rows[index].selectedImage;
          return;
        }
      }
    }

    thisWidget.draw();
  };

  this.draw = function () {
    var background = thisWidget.getProperty('background');
    var data = thisWidget.getProperty('editedData');

    backgroundRect = null;
    markers = [];
    var div = $('.widget-positionalgrid-' + uid)[0];
    var canvas = $('.widget-positionalgrid-canvas-' + uid)[0];

    if (background) {
      canvas.width = div.offsetWidth;
      canvas.height = div.offsetHeight;

      var ctx = canvas.getContext('2d');
      scale = Math.min(canvas.width / images[background].width, canvas.height / images[background].height);

      backgroundRect = {
        w: scale * images[background].width,
        h: scale * images[background].height
      };
      backgroundRect.x = canvas.width > backgroundRect.w ? (canvas.width - backgroundRect.w) / 2 : 0;
      backgroundRect.y = canvas.height > backgroundRect.h ? (canvas.height - backgroundRect.h) / 2 : 0;
      ctx.drawImage(images[background], backgroundRect.x, backgroundRect.y, backgroundRect.w, backgroundRect.h);

      if (data) {
        for (var index = 0; index < data.rows.length; index++) {
          var dataW = scale * images[data.rows[index].image].width;
          var dataH = scale * images[data.rows[index].image].height;
          var dataX = backgroundRect.x + scale * data.rows[index].centerX - dataW / 2;
          var dataY = backgroundRect.y + scale * data.rows[index].centerY - dataH / 2;

          var image = currentSelectedRows[index] && data.rows[index].selectedImage ? images[data.rows[index].selectedImage] : images[data.rows[index].image];
          ctx.drawImage(image, dataX, dataY, dataW, dataH);

          markers[data.rows[index].id] = {top: dataY, left: dataX, bottom: dataY + dataH, right: dataX + dataW};
        }
      }
    }
  };
};