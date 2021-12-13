/* global TW */
TW.IDE.Widgets.positionalgrid = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/PositionalGridWidget/ui/positionalgrid/positionalgrid.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'PositionalGrid',
      'description': 'Widget allowing to view a data grid where position is the fundamental component',
      'category': ['Common'],
      'defaultBindingTargetProperty': 'data',
      'iconImage': 'positionalgrid.png',
      'supportsAutoResize': true,
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 300
        },
        'Height': {
          'description': 'height',
          'defaultValue': 300
        },
        'background': {
          'isVisible': true,
          'baseType': 'HYPERLINK',
          'isBindingTarget': true,
          'isEditable': true,
          'description': 'The background image, raster (png, jpeg, etc.) or vectorial (svg, etc.)'
        },
        'data': {
          'isVisible': true,
          'baseType': 'INFOTABLE',
          'isBindingTarget': true,
          'isEditable': false,
          'description': 'The grid data source (use or duplicate & extend the Data Shape ds_PositionalGrid)',
          'warnIfNotBoundAsTarget': true
        },
        'editedData': {
          'isVisible': true,
          'baseType': 'INFOTABLE',
          'isBindingSource': true,
          'isEditable': false,
          'description': 'The (optional) edited data'
        },
        'editPositions': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'isBindingTarget': true,
          'defaultValue': false,
          'description': 'true to activate the position editing'
        },
        'rowSelection': {
          'isVisible': true,
          'baseType': 'STRING',
          'isEditable': true,
          'description': 'disable row selection, enable only single row selection, or enable multiple row selection',
          'defaultValue': 'None',
          'selectOptions': [
            {value: 'None', text: 'None'},
            {value: 'Single', text: 'Single'},
            {value: 'Multiple', text: 'Multiple'}
          ]
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        }
      }
    };
  };

  this.widgetServices = function () {
    return {
    };
  };

  this.widgetEvents = function () {
    return {
      'DoubleClicked': {}
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-positionalgrid">' + '<span class="positionalgrid-property">Positional Grid</span>' + '</div>';
  };
};