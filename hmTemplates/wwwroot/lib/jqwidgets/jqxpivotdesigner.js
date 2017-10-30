/*
jQWidgets v5.3.0 (2017-Sep)
Copyright (c) 2011-2017 jQWidgets.
License: https://jqwidgets.com/license/
*/

﻿(function ($) {
    $.jqx.jqxWidget("jqxPivotDesigner", "", {});

    $.extend($.jqx._jqxPivotDesigner.prototype, {

        defineInstance: function () {
            var _defaultSettings = {
                type: 'pivotGrid',
                target: null,
                dataFields: null
            }

            $.extend(true, this, _defaultSettings);

            return _defaultSettings;
        },

        _instanceId: 0,

        createInstance: function (args) {
            var element = this.element;
            var host = this.host;

            var self = this;

            if (this.target && this.target.getInstance) {
                this.target = this.target.getInstance();
            }

            var dependencies = [
                { widget: 'jqxWindow', src: 'jqxwindow.js' },
                { widget: 'jqxButton', src: 'jqxbuttons.js' },
                { widget: 'jqxCheckBox', src: 'jqxcheckbox.js' },
                { widget: 'jqxInput', src: 'jqxinput.js' },
                { widget: 'jqxScrollBar', src: 'jqxscrollbar.js' },
                { widget: 'jqxListBox', src: 'jqxlistbox.js' },
                { widget: 'jqxDropDownList', src: 'jqxdropdownlist.js' },
                { widget: 'jqxDragDrop', src: 'jqxdragdrop.js' }];

            for (var i in dependencies)
                if (!window[dependencies[i].widget])
                    throw new Error('Please include ' + dependencies[i].src);

            var touchClass = "";
            if (this._isTouchDevice()) {
                touchClass = "class='jqx-grid-menu-item-touch'";
            }

            var hostClass = 'jqx-rc-all jqx-widget jqx-pivotgrid jqx-designer-host' + this.toThemeProperty('jqx-widget-content');

            host.append(
            "<div class='" + hostClass + "' style='width: 100%; height: 100%; overflow:hidden; onselectstart=\'return false;\' oncontextmenu=\'return false;\''>"
            + "<div class='labelFields jqx-widget' style='position: absolute;'>Pivot Table Fields</div>"
            + "<div class='labelFilters jqx-widget' style='position: absolute;'>Filters</div>"
            + "<div class='labelColumns jqx-widget' style='position: absolute;'>Columns</div>"
            + "<div class='labelRows jqx-widget' style='position: absolute;'>Rows</div>"
            + "<div class='labelValues jqx-widget' style='position: absolute;'>Values</div>"
            + "<div class='divFields' style='position: absolute;'></div>"
            + "<div class='divFilters' style='position: absolute;'></div>"
            + "<div class='divColumns' style='position: absolute;'></div>"
            + "<div class='divRows' style='position: absolute;'></div>"
            + "<div class='divValues' style='position: absolute;'></div>"
            + "</div>"
            );

            this._listBoxes = {
                fields: self.host.find('.divFields'),
                rows: self.host.find('.divRows'),
                columns: self.host.find('.divColumns'),
                values: self.host.find('.divValues'),
                filters: self.host.find('.divFilters')
            };
            
            $.jqx.utilities.resize(
                self.host,
                function () {
                    self._resize();
                },
                false
            );

        }, // createInstance

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            if (self.target)
                delete self.target._pivotDesigner;

        },

        _getLocalizedString: function(str)
        {
            var localizedStrings = this.target ? this.target._localizedStrings : {};

            switch(str)
            {
                case 'fields':
                    return localizedStrings.fieldslabel || 'Pivot Fields';
                    break
                case 'calculation':
                    return localizedStrings.calculation || 'Calculation';
                    break
                case 'filters':
                    return localizedStrings.filterslabel || 'Filters';
                    break;
                case 'rows':
                    return localizedStrings.rowslabel || 'Rows';
                    break;
                case 'columns':
                    return localizedStrings.columnslabel || 'Columns';
                    break;
                case 'values':
                    return localizedStrings.valueslabel || 'Values';
                    break;
                case 'of':
                    return localizedStrings.of || 'of';
                    break;
                case 'to':
                    return localizedStrings.to || 'to';
                    break;
                case 'move':
                    return localizedStrings.move || 'Move';
                    break;
                case 'remove':
                    return localizedStrings.remove || 'Remove';
                    break;
                case 'count':
                    return localizedStrings.count || 'Count';
                    break;
                case 'sum':
                    return localizedStrings.sum || 'Sum';
                    break;
                case 'average':
                    return localizedStrings.avgerage || 'Average';
                    break;
                case 'product':
                    return localizedStrings.product || 'Product';
                    break;
                case 'min':
                    return localizedStrings.min || 'Min';
                    break;
                case 'max':
                    return localizedStrings.max || 'Max';
                    break;
            }

            if (localizedStrings[str])
                return localizedStrings[str];

            return str;
        },

        _isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            this.touchDevice = isTouchDevice;
            if (this.touchmode == true) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    this.enablehover = false;
                    return false;
                }

                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
                this.touchDevice = isTouchDevice;
            }
            else if (this.touchmode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
                this.touchDevice = true;
                this.host.addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-content').addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-header').addClass(this.toThemeProperty('jqx-touch'));
                this.scrollbarsize = this.touchscrollbarsize;
            }
            return isTouchDevice;
        },

        _resize: function()
        {
            var self = this;

            var lb = self._listBoxes;

            var padding = 5;
            var host = this.host;

            var height = host.height() - 2 * padding;
            var width = host.width() - 2 * padding;

            // get max text height
            var measureElement = $("<span style='white-space:nowrap;'></span>");
            this.host.append(measureElement);
            var textH = 0;
            var labelStrings = ['fields', 'filters', 'rows', 'columns', 'values'];
            for (var i = 0; i < labelStrings.length; i++)
            {
                measureElement.text(this._getLocalizedString(labelStrings[i]));
                var h = measureElement.height();
                if (h > textH)
                    textH = h;
            }
            measureElement.remove();

            var position = this.host.position();

            var x = position.left + padding,
                y = position.top + padding;

            y += padding;

            // fields label;
            var labelFields = host.find('.labelFields');
            labelFields.css({ left: x, top: y, width: width - 10, height: textH });
            
            y += textH;

            var boxHeight = (height - 3*(textH + 2*padding)) / 3;
            var boxWidth = (width - padding) / 2;

            // fields box
            lb.fields.css({ left: x, top: y, background: 'white'});
            lb.fields.jqxListBox({ width: width, height: boxHeight, allowDrop: true, allowDrag: true });

            y += boxHeight + 2 * padding;

            // filters label
            var labelFilters = host.find('.labelFilters');
            labelFilters.css({ left: x, top: y, width: boxWidth, height: textH });

            // columns label
            var labelColumns = host.find('.labelColumns');
            labelColumns.css({ left: x + boxWidth + padding, top: y, width: boxWidth, height: textH });

            y += textH;

            // filters box
            lb.filters.css({ left: x, top: y });
            lb.filters.jqxListBox({ width: boxWidth, height: boxHeight });

            // columns box
            lb.columns.css({ left: x + boxWidth + padding, top: y });
            lb.columns.jqxListBox({ width: boxWidth, height: boxHeight });

            y += boxHeight + 2 * padding;

            // rows label
            var labelRows = host.find('.labelRows');
            labelRows.css({ left: x, top: y, width: boxWidth, height: textH });

            // values label
            var labelValues = host.find('.labelValues');
            labelValues.css({ left: x + boxWidth + padding, top: y, width: boxWidth, height: textH });

            y += textH;

            // rows box
            host.find('.divRows').css({ left: x, top: y });
            host.find('.divRows').jqxListBox({ width: boxWidth, height: boxHeight });

            // values box
            host.find('.divValues').css({ left: x + boxWidth + padding, top: y});
            host.find('.divValues').jqxListBox({ width: boxWidth, height: boxHeight });
        },

        _setupListBoxes: function ()
        {
            var self = this;
            var host = self.host;

            var lb = self._listBoxes;

            for (var i in lb) {
                var listBox = lb[i];

                listBox.off();

                listBox.jqxListBox({ 
                    allowDrag: true, 
                    allowDrop: true,
                    renderer: function (index, label, value) {
                        return self._getCustomRendererElement(label, self._listBoxes['fields'][0] != this.host[0]);
                    }
                })
                    .on('dragStart', function (args) {
                        lb.rows.jqxListBox({ dropAction: 'copy' });
                        lb.columns.jqxListBox({ dropAction: 'copy' });
                        lb.filters.jqxListBox({ dropAction: 'copy' });
                        lb.values.jqxListBox({ dropAction: 'copy' });
                        lb.fields.jqxListBox({ dropAction: 'copy' });
                    })
                    .on('dragEnd', function (event) {
                        self._moveElement($(this), event.args.dropTargetElement, event.args.index, event.args.value);
                    });
            }
        },

        _moveElement: function(source, targetElement, elementIndex, elementValue)
        {
            var self = this;
            var lb = self._listBoxes;

            if (targetElement) {
                if (source[0] != lb.fields[0])
                    source.jqxListBox('removeAt', elementIndex);

                if (targetElement == lb.fields[0]) {
                    lb.fields.jqxListBox('clear');
                    self._populateListBox(lb.fields, self._allFields, 'all');
                }
                else {
                    // ensure the copied item exists only once among rows/columns/filters
                    if (source[0] != lb.fields[0] || targetElement != lb.values[0]) {
                        if (lb.rows[0] != targetElement)
                            self._removeItem(lb.rows, elementValue);

                        if (lb.columns[0] != targetElement)
                            self._removeItem(lb.columns, elementValue);

                        //if (lb.filters[0] != targetElement)
                        //    self._removeItem(lb.filters, elementValue);
                    }

                    if (targetElement == lb.values[0]) {
                        var items = lb.values.jqxListBox('getItems');
                        for (var i = 0; i < items.length; i++)
                            lb.values.jqxListBox('updateAt', { label: items[i].label, value: $.extend({}, items[i].value) }, i);

                        self._autoAssignAggregationFunctions();
                    }

                    self._removeDuplicates(lb['rows']);
                    self._removeDuplicates(lb['columns']);
                    self._removeDuplicates(lb['filters']);
                }

                self._updateCurrentSettings();
                self._updateListBoxLabels();

                // work around to refresh the h scrollbar in the listbox 
                var w = $(targetElement).jqxListBox('width');
                $(targetElement).jqxListBox('width', w + 1);
                $(targetElement).jqxListBox('width', w - 1);

                var w = source.jqxListBox('width');
                source.jqxListBox('width', w + 1);
                source.jqxListBox('width', w - 1);

                self._updateListBoxLabels();

                self._refreshPivotGrid(self._targetCurrentSettings);
            }
        },

        refresh: function()
        {
            var self = this;
            if (self.target)
                self.target._pivotDesigner = this;

            self._readPivotSettings();
            self._setupListBoxes();

            self._resize();
            self._updateListBoxLabels();
        },

        _updateCurrentSettings: function ()
        {
            var self = this;

            var lb = self._listBoxes;

            var pivotSourceSettings = $.extend({}, self._targetCurrentSettings);

            var savedFieldSettings = {};
            var types = ['rows', 'columns', 'values', 'filters'];
            for (var i in types)
            {
                var items = pivotSourceSettings[types[i]];

                for (var j = 0; j < items.length; j++)
                {
                    var key = items[j].dataField + '_' + (items[j]['function'] || '');
                    savedFieldSettings[key] = $.extend({}, items[j]);
                    delete savedFieldSettings[key].dataField;
                    delete savedFieldSettings[key].text;
                }
            }

            // apply initial settings
            pivotSourceSettings = $.extend({}, self._targetInitSettings);
            for (var i in types) {
                var items = pivotSourceSettings[types[i]];

                for (var j = 0; j < items.length; j++) {
                    var key = items[j].dataField + '_' + (items[j]['function'] || '');

                    savedFieldSettings[key] = $.extend(savedFieldSettings[key] || {}, items[j]);

                    delete savedFieldSettings[key].dataField;
                    delete savedFieldSettings[key].text;
                }
            }


            for (var i in lb)
            {
                var listBox = lb[i];

                var items = listBox.jqxListBox('getItems');

                pivotSourceSettings[i] = [];

                for (var j = 0; j < items.length; j++) {
                    var dataField = items[j].value.dataField;
                    var text = items[j].value.text;
                    var fn = (i == 'values') ? items[j].value['function'] : undefined;

                    var pivotItem = { dataField: dataField, text: text || dataField };
                    if (fn) {
                        pivotItem['function'] = fn;
                    }
                    pivotItem.text = self._getFieldLabel(fn, dataField);

                    var key = pivotItem.dataField + '_' + (fn || '');
                    var savedItemSetings = savedFieldSettings[key];
                    if (savedItemSetings)
                        $.extend(pivotItem, savedItemSetings);

                    pivotSourceSettings[i].push(pivotItem);
                }
            }

            self._targetCurrentSettings = pivotSourceSettings;
        },

        _refreshPivotGrid: function(pivotSourceSettings)
        {
            var self = this;

            var pivotDataSource = new $.jqx.pivot(self.target.source.dataAdapter, pivotSourceSettings);

            $(self.target.element).jqxPivotGrid({ source: pivotDataSource });
            var instance = $(self.target.element).jqxPivotGrid('getInstance');
            instance._pivotRows.autoResize();
            instance._pivotColumns.autoResize();
            instance.refresh();

            self._targetCurrentSettings = pivotSourceSettings;
        },

        _autoAssignAggregationFunctions: function()
        {
            var self = this;
            var valuesListBox = self.host.find('.divValues');

            var items = valuesListBox.jqxListBox('getItems');
            var fnUsed = {};

            // find used functions
            for (var i = 0; i < items.length; i++)
            {
                if (items[i].value['function']) {
                    if (!fnUsed[items[i].value.dataField])
                        fnUsed[items[i].value.dataField] = {};

                    fnUsed[items[i].value.dataField][items[i].value['function']] = true;
                }
            }

            // assign functions that are not used
            var availableFunctions = self.target.source.getFunctions();

            for (var i = 0; i < items.length; i++) {
                var matched = false;
                if (!items[i].value['function']) {
                    if (!fnUsed[items[i].value.dataField])
                        fnUsed[items[i].value.dataField] = {};

                    for (var j in availableFunctions)
                        if (!fnUsed[items[i].value.dataField][j])
                        {
                            fnUsed[items[i].value.dataField][j] = true;
                            items[i].value['function'] = j;
                            matched = true;
                            break;
                        }

                    if (!matched)
                    {
                        for (var j in availableFunctions) {
                            items[i].value['function'] = j;
                            break;
                        }
                    }
                    
                }
            }
        },

        _updateListBoxLabels: function()
        {
            var self = this;

            self.host.find('.pivot-designer-item-button').off();

            var lb = self._listBoxes;

            for (var i in lb) {
                var listBox = lb[i];
                var items = listBox.jqxListBox('getItems');
                if (!items)
                    continue;
                for (var j = 0; j < items.length; j++) {
                    var fn = undefined;
                    if (i == 'values') {
                        fn = items[j].value['function'];
                        if (!fn)
                            throw 'Unspecified pivot aggregation function';
                    }

                    items[j].label = self._getFieldLabel(fn, items[j].value.dataField);

                    listBox.jqxListBox('updateAt', { label: items[j].label, value: items[j].value }, j);
                }
            }
            
            self.host.find('.pivot-designer-item-button').off();
            self.host.find('.pivot-designer-item-button').on('click', function (event) {
                // find the corresponding listbox and item index
                for (var i in lb) {
                    var listBox = lb[i];
                    var items = listBox.jqxListBox('getItems');
                    for (var j = 0; j < items.length; j++) {
                        var itemMenuButton = $(items[j].element).find('.pivot-designer-item-button');
                        if (itemMenuButton.length > 0 && itemMenuButton[0] == this)
                        {
                            // Matched. Show the context menu.
                            self._showDesignerItemContextMenu(i, j);
                            return;
                        }
                    }
                }               
            });
        },

        _showDesignerItemContextMenu: function(type, itemIndex)
        {
            var self = this;

            if (self._isWindowOpen())
                return;

            var lb = self._listBoxes;

            var fieldSettings = {
                moveOperations: {}
            };

            for (var i in lb)
            {
                if (i == type)
                    continue;

                fieldSettings.moveOperations[self._getLocalizedString('move') + ' ' + self._getLocalizedString('to') + ' ' + self._getLocalizedString(i)] = { dropTarget: i };
            }

            if (type == 'values')
            {
                var availableFunctions = self.target.source.getFunctions();
                var funcItems = {};
                for (var i in availableFunctions)
                    funcItems[self._getLocalizedString(i)] = { 'function': i };

                fieldSettings['functions'] = funcItems;
            }

            self._windowData = { type: type, itemIndex: itemIndex, fieldSettings: fieldSettings };

            if (type == 'filters') {
                if (!this._filtersWindow)
                    this._createFiltersWindow();

                this._filtersWindow.jqxWindow('open');
                this._updateFiltersWindowData();
            }
            else {
                if (!this._settingsWindow)
                    this._createSettingsWindow();

                this._settingsWindow.jqxWindow('open');
                this._updateWindowData();
            }
        },

        _isWindowOpen: function()
        {
            return (this._settingsWindow && this._settingsWindow.jqxWindow('isOpen')) || (this._filtersWindow && this._filtersWindow.jqxWindow('isOpen'));
        },

        _getFieldLabel: function(fn, dataField)
        {
            if (fn)
                return this._getValueFieldLabel(fn, dataField);

            var initSettings = this._targetInitSettings;
            for (var i in initSettings)
            {
                if (i == 'values')
                    continue;

                var fieldList = initSettings[i];
                for (var j in fieldList)
                    if (fieldList[j].dataField == dataField && fieldList[j].text)
                        return fieldList[j].text;
            }

            return dataField;
        },

        _getValueFieldLabel: function(fn, dataField)
        {
            var self = this;
            var fnName = self._getLocalizedString(fn) || fn;

            var matchedText = undefined;
            var initSettings = self._targetInitSettings;
            if (initSettings.values) {
                for (var k in initSettings.values)
                    if (initSettings.values[k].dataField == dataField &&
                        initSettings.values[k]['function'] == fn) {
                        matchedText = initSettings.values[k].text;
                        if (matchedText != undefined)
                            break;
                    }
            }

            return matchedText || fnName + ' ' + self._getLocalizedString('of') + ' ' + dataField;
        },


        _removeItem: function(lb, itemValue)
        {
            var items = lb.jqxListBox('getItems');
            var removedCount = 0;
            for (var i = 0; i < items.length; i++)
            {
                var item = lb.jqxListBox('getItem', i);
                if (item.value.dataField == itemValue.dataField) {
                    lb.jqxListBox('removeAt', i - removedCount);
                    removedCount++;
                }
            }
        },

        _getCustomRendererElement: function(label, showButton)
        {
            if (!showButton)
                return "<div><div style='height: 16px; float:left; margin-top: 2px;'></div><div>" + label + "</div></div>";

            return "<div><div style='width: 16px;height: 16px; float:left; margin-top: 1px;' class='pivot-designer-item-button jqx-pivotgrid-settings-icon'></div><div>" + label + "</div></div>";
        },

        _readPivotSettings: function()
        {
            var self = this;
            if (!self.target)
                return;

            var pivotSource = self.target.source;
            if (!pivotSource)
                return;

            var dataAdapter = pivotSource.dataAdapter;
            if (!dataAdapter)
                return;

            var adapterSettings = dataAdapter._source;
            if (!adapterSettings)
                return;

            self._targetCurrentSettings = $.extend({}, self.target.source._initSettings);
            self._targetInitSettings = $.extend({}, self.target.source._initSettings);

            var allFields = {};

            var fieldSource = {
                dataFields: this.dataFields,
                adapterDataFields: adapterSettings.datafields,
                rows: self.target.source.rows,
                columns: self.target.source.columns,
                values: self.target.source.values,
                filters: self.target.source.filters
            };

            function addFields(fields, target, fieldType)
            {
                if (!Array.isArray(fields))
                    return;

                for (var i = 0; i < fields.length; i++) {
                    var dataField = fields[i].name || fields[i].dataField;
                    if (!dataField || dataField.length == 0)
                        continue;

                    if (!target[dataField])
                        target[dataField] = { text: dataField, dataField: dataField };

                    if (undefined != fields[i].text && fieldType != 'values')
                        target[dataField].text = fields[i].text;

                    target[dataField]['function'] = fields[i]['function'];
                }
            }

            // pull all fields in the dataFields if exist
            if (Array.isArray(fieldSource.dataFields))
            {
                addFields(fieldSource.dataFields, allFields);
            }
            else // otherwise pull all fields from the source
            {
                addFields(fieldSource.adapterDataFields, allFields);
            }
            
            // pull fields from the grid's rows, columns, filters and values fields
            addFields(fieldSource.filters, allFields, 'filters');
            addFields(fieldSource.rows, allFields, 'rows');
            addFields(fieldSource.columns, allFields, 'columns');
            addFields(fieldSource.values, allFields, 'values');

            this._allFields = allFields;

            var host = self.host;
            
            var lb = self._listBoxes;

            self._populateListBox(lb.fields, allFields, 'all');
            self._populateListBox(lb.filters, fieldSource.filters, 'filters');
            self._populateListBox(lb.rows, fieldSource.rows, 'rows');
            self._populateListBox(lb.columns, fieldSource.columns, 'columns');
            self._populateListBox(lb.values, fieldSource.values, 'values');
        },

        _populateListBox: function(listBox, fields, fieldType) {
            // flatten into an array
            var listBoxData = [];
            var pos = 0;
            for (var i in fields) {
                var dataField = fields[i].dataField;
                var text = fields[i].text || this._allFields[dataField].text || dataField;
                listBoxData[pos] = {
                    text: text,
                    value: {
                        text: text,
                        dataField: dataField,
                        'function': fields[i]['function'] || undefined
                    }
                };

                if (fieldType != 'values')
                    listBoxData[pos].value['function'] = undefined;

                pos++;
            }

            listBox.jqxListBox({ source: listBoxData, displayMember: 'text', valueMember: 'value' });
        },
        
        _removeDuplicates: function(listBox)
        {
            // remove previous instance of the item
            var items = listBox.jqxListBox('getItems');

            var labels = {};

            var found = false;
            for (var i = 0; i < items.length; i++) {
                var itemLabel = items[i].label;

                if (labels[itemLabel] != undefined) {
                    listBox.jqxListBox('removeAt', i);
                    items.splice(i, 1);
                    i--;
                }
                else
                {
                    labels[itemLabel] = true;
                }
            }
        },

        _createSettingsWindow: function()
        {
            var self = this;

            var windowElement = "<div id='pivotFieldSettingsWindow' style='width: 300px; height: 200px'>"
                + "<table style='width: 100%;'>"
                + "<tr>"
                + "<td style='height: 30px;'>" + self._getLocalizedString('move') + ' ' + self._getLocalizedString('to') + "</td>"
                + "<td>" + "<div style='width: 100%;' class='lbPivotFieldMoveTo'></div>" + "</td>"
                + "</tr>"

                + "<tr>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("alignment") + "</td>"
                + "<td>" + "<div style='width: 100%;' class='lbAlignment'></div>" + "</td>"
                + "</tr>"


                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString('calculation') + "</td>"
                + "<td>" + "<div style='width: 100%;' class='lbCalculation'></div>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("numberformat") + "</td>"
                + "<td>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("cellalignment") + "</td>"
                + "<td>" + "<div style='width: 100%;' class='lbCellsAlignment'></div>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("prefix") + "</td>"
                + "<td>" + "<input type='text' style='width: 100%;' class='txtPrefix'></input>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("decimalplacestext") + "</td>"
                + "<td>" + "<input type='text' style='width: 100%;' class='txtDecimalPlaces'></input>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("thousandsseparatortext") + "</td>"
                + "<td>" + "<input type='text' style='width: 100%;' class='txtThousandsSeparator'></input>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("decimalseparatortext") + "</td>"
                + "<td>" + "<input type='text' style='width: 100%;' class='txtDecimalSeparator'></input>" + "</td>"
                + "</tr>"

                + "<tr class='valueField'>"
                + "<td style='height: 30px;'>" + self._getLocalizedString("nagativebracketstext") + "</td>"
                + "<td>" + "<div style='width: 100%;' class='checkBoxNagativeWithBrackets'></input>" + "</td>"
                + "</tr>"

                + "<tr>"
                + "<td style='height: 30px;' colspan=2 align=middle>"
                + "<input class='btnOk' type='button' value='" + self._getLocalizedString("ok") + "'></input>"
                + "<input class='btnCancel' style='margin-left: 10px;' type='button' value='" + self._getLocalizedString("cancel") + "'></input>"
                + "</td>"
                + "</tr>"

                + "</table>";

            self.host.append(windowElement);

            var width = 380;
            var height = 360;

            self._settingsWindow = self.host.find('#pivotFieldSettingsWindow').jqxWindow({
                title: self._getLocalizedString("fieldsettings"),
                position: { x: 0, y: 0} ,
                showCollapseButton: true,
                autoOpen: false,
                minWidth: width, 
                maxWidth: width, 
                width: width,
                height: height, 
                initContent: function () {
                    self._updateWindowData();

                    var btnCancel = self._settingsWindow.find('.btnCancel').jqxButton({width: 80});
                    var btnOk = self._settingsWindow.find('.btnOk').jqxButton({ width: 80 });

                    btnCancel.on('click', function () {
                        self._settingsWindow.jqxWindow('close');
                    });

                    btnOk.on('click', function () {
                        self._applySettingsWindowChanges();
                        self._settingsWindow.jqxWindow('close');
                    })

                }
            });
        },

        _applySettingsWindowChanges: function()
        {
            var self = this;

            var itemIndex = self._windowData.itemIndex;
            var itemType = self._windowData.type;
            var source = self._listBoxes[itemType];
            var item = source.jqxListBox('getItem', itemIndex);

            // move to
            var lbMoveTo = self._settingsWindow.find('.lbPivotFieldMoveTo');
            var selectedIndex = lbMoveTo.jqxDropDownList('selectedIndex');
            if (selectedIndex != -1)
            {
                var targetType = undefined;
                for (var i in self._windowData.fieldSettings.moveOperations)
                {
                    targetType = self._windowData.fieldSettings.moveOperations[i].dropTarget;
                    if (--selectedIndex == -1)
                        break;
                }

                var target = self._listBoxes[targetType];
                var value = item.value;

                if (target != self._listBoxes['fields'])
                    target.jqxListBox('addItem', { label: item.label, value: value });

                self._moveElement(source, target[0], itemIndex, value);
                return;
            }

            // alignment
            var lbAlignment = self._settingsWindow.find('.lbAlignment');
            var selectedItem = lbAlignment.jqxDropDownList('getSelectedItem');
            self._targetCurrentSettings[itemType][itemIndex].align = selectedItem.value;

            delete self._targetCurrentSettings[itemType][itemIndex]['function'];

            // calculation
            if (itemType == 'values')
            {
                var lbCalculation = self._settingsWindow.find('.lbCalculation');
                var selectedItem = lbCalculation.jqxDropDownList('getSelectedItem');
                               
                self._targetCurrentSettings[itemType][itemIndex].text = item.value.text = item.label = self._getFieldLabel(selectedItem.value, item.value.dataField);
                self._targetCurrentSettings[itemType][itemIndex]['function'] = item.value['function'] = selectedItem.value;

                source.jqxListBox('updateAt', { label: item.value.text, value: item.value }, itemIndex);
                self._updateListBoxLabels();
            }

            // cell alignment
            if (itemType == 'values') {
                var lbCellsAlignment = self._settingsWindow.find('.lbCellsAlignment');
                var selectedItem = lbCellsAlignment.jqxDropDownList('getSelectedItem');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.align = selectedItem.value;
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // prefix
            if (itemType == 'values') {
                var txtPrefix = self._settingsWindow.find('.txtPrefix');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.prefix = txtPrefix.val();
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // decimal places
            if (itemType == 'values') {
                var txtDecimalPlaces = self._settingsWindow.find('.txtDecimalPlaces');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.decimalPlaces = txtDecimalPlaces.val();
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // thousands separator
            if (itemType == 'values') {
                var txtThousandsSeparator = self._settingsWindow.find('.txtThousandsSeparator');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.thousandsSeparator = txtThousandsSeparator.val();
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // decimal separator
            if (itemType == 'values') {
                var txtDecimalSeparator = self._settingsWindow.find('.txtDecimalSeparator');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.decimalSeparator = txtDecimalSeparator.val();
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // negatives with brackets
            if (itemType == 'values') {
                var checkBoxNagativeWithBrackets = self._settingsWindow.find('.checkBoxNagativeWithBrackets');
                var formatSettings = self._targetCurrentSettings[itemType][itemIndex].formatSettings || {};
                formatSettings.negativeWithBrackets = checkBoxNagativeWithBrackets.val();
                self._targetCurrentSettings[itemType][itemIndex].formatSettings = formatSettings;
            }

            // refresh with the latest settings
            self._refreshPivotGrid(self._targetCurrentSettings);
        }, //_applySettingsWindowChanges

        _updateWindowData: function () {
            var self = this;

            var fieldSettings = self._windowData.fieldSettings;
            var itemValue = self._listBoxes[self._windowData.type].jqxListBox('getItem', self._windowData.itemIndex).value;

            var sourceBoundItems = self.target.source[self._windowData.type];
            var sourceBoundItem = undefined;
            for (var i = 0; i < sourceBoundItems.length; i++) {
                if (sourceBoundItems[i]['dataField'] == itemValue.dataField && sourceBoundItems[i]['function'] == itemValue['function']) {
                    sourceBoundItem = sourceBoundItems[i];
                    break;
                }
            }

            // move operations
            var listBoxData = [];
            for (var i in fieldSettings.moveOperations)
                listBoxData.push({ text: i, value: fieldSettings.moveOperations[i] });

            var lbMoveTo = self._settingsWindow.find('.lbPivotFieldMoveTo');
            lbMoveTo.jqxDropDownList({ source: listBoxData, displayMember: 'text', selectedIndex: -1, valueMember: 'value', autoDropDownHeight: true });

            // alignment
            var listBoxAlignmentData = listBoxData = [
                { text: self._getLocalizedString("left"), value: 'left' },
                { text: self._getLocalizedString("center"), value: 'center' },
                { text: self._getLocalizedString("right"), value: 'right' }
            ];

            var selectedIndex = 0;
            if (sourceBoundItem)
            {
                for (var j = 0; j < listBoxData.length; j++) {
                    if (listBoxData[j].value == sourceBoundItem['align']) {
                        selectedIndex = j;
                        break;
                    }
                }
            }

            var lbAlignment = self._settingsWindow.find('.lbAlignment');
            lbAlignment.jqxDropDownList({ source: listBoxData, selectedIndex: selectedIndex, displayMember: 'text', valueMember: 'value', autoDropDownHeight: true });


            var windowHeight = 390;
            if (fieldSettings.functions) {
                var currentFunction = itemValue['function'];

                self._settingsWindow.find('.valueField').show();

                // calculations
                listBoxData = [];
                selectedIndex = -1;
                var k = 0;
                for (var i in fieldSettings.functions) {
                    var func = fieldSettings.functions[i]['function'];
                    listBoxData.push({ text: i, value: func });

                    if (currentFunction == func)
                        selectedIndex = k;

                    k++;
                }

                var lbCalculation = self._settingsWindow.find('.lbCalculation');
                lbCalculation.jqxDropDownList({ source: listBoxData, displayMember: 'text', valueMember: 'value', autoDropDownHeight: true, selectedIndex: selectedIndex });

                // cell alignment
                listBoxData = listBoxAlignmentData;

                // default for cells text alignment is 'right', index 2
                var selectedIndex = 2;
                var sourceBoundItemAlign = 'right';

                if (sourceBoundItem) {
                    if (sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.align)
                        sourceBoundItemAlign = sourceBoundItem.formatSettings.align;

                    for (var j = 0; j < listBoxData.length; j++) {
                        if (listBoxData[j].value == sourceBoundItemAlign) {
                            selectedIndex = j;
                            break;
                        }
                    }
                }

                var lbCellsAlignment = self._settingsWindow.find('.lbCellsAlignment');
                lbCellsAlignment.jqxDropDownList({ source: listBoxData, selectedIndex: selectedIndex, displayMember: 'text', valueMember: 'value', autoDropDownHeight: true });

                // number prefix
                var prefix = '';
                if (sourceBoundItem && sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.prefix != undefined)
                    prefix = sourceBoundItem.formatSettings.prefix;

                var inputPrefix = self._settingsWindow.find('.txtPrefix')
                inputPrefix.jqxInput({ value: prefix, height: 23, width: 195 });

                // decimal places
                var decimalPlaces = 2;
                try
                {
                    if (sourceBoundItem && sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.decimalPlaces != undefined)
                        decimalPlaces = parseInt(sourceBoundItem.formatSettings.decimalPlaces);
                }
                catch(e)
                {
                    decimalPlaces = 2;
                }

                var inputDecimalPlaces = self._settingsWindow.find('.txtDecimalPlaces')
                inputDecimalPlaces.jqxInput({ value: decimalPlaces, height: 23, width: 195 });

                // thousands separator
                var thousandsSeparator = self._getLocalizedString('thousandsseparator');
                if (sourceBoundItem && sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.thousandsSeparator != undefined)
                    thousandsSeparator = sourceBoundItem.formatSettings.thousandsSeparator;

                var inputThousandsSeparator = self._settingsWindow.find('.txtThousandsSeparator')
                inputThousandsSeparator.jqxInput({ value: thousandsSeparator, height: 23, width: 195 });

                // decimal separator
                var decimalSeparator = self._getLocalizedString('decimalseparator');
                if (sourceBoundItem && sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.decimalSeparator != undefined)
                    decimalSeparator = sourceBoundItem.formatSettings.decimalSeparator;

                var inputDecimalSeparator = self._settingsWindow.find('.txtDecimalSeparator')
                inputDecimalSeparator.jqxInput({ value: decimalSeparator, height: 23, width: 195 });

                // negative in brackets
                var negativeWithBrackets = false;
                if (sourceBoundItem && sourceBoundItem.formatSettings && sourceBoundItem.formatSettings.negativeWithBrackets != undefined)
                    negativeWithBrackets = sourceBoundItem.formatSettings.negativeWithBrackets == true;

                var checkBoxNagativeWithBrackets = self._settingsWindow.find('.checkBoxNagativeWithBrackets')
                checkBoxNagativeWithBrackets.jqxCheckBox({ checked: negativeWithBrackets });
            }
            else
            {
                windowHeight = 160;
                self._settingsWindow.find('.valueField').hide();
            }

            self._settingsWindow.jqxWindow({ height: windowHeight });
        },

        _createFiltersWindow: function () {
            var self = this;

            var windowElement = "<div id='pivotFieldFiltersWindow' style='width: 300px; height: 340px;'>"
                + "<div style='padding: 5; margin: 5; width: 100%; height: 100%;'>"
                + "<table style='width: 100%; height: 100%; margin:0; padding:0;' cellspacing=0; cellpadding=0>"
                + "<tr style='height: auto;'>"
                + "<td style='height: 100%;'>"
                + "<div style='padding: 0px; margin: 0px; display:inline-block;position:relative;' class='listBoxFilters'></div>"
                + "</td>"
                + "</tr>"
                + "<tr style='height: 5px;'><td></td></tr>"
                + "<tr style='height: 30px;'>"
                + "<td colspan=2 align=middle>"
                + "<input class='btnOk' type='button' value='" + self._getLocalizedString("ok") + "'></input>"
                + "<input class='btnCancel' style='margin-left: 10px;' type='button' value='" + self._getLocalizedString("cancel") + "'></input>"
                + "</td>"
                + "</tr></div>"

                + "</table>";

            self.host.append(windowElement);

            var width = 300;
            var height = 360;

            self._filtersWindow = self.host.find('#pivotFieldFiltersWindow').jqxWindow({
                title: self._getLocalizedString("fieldsettings"),
                position: { x: 0, y: 0 },
                showCollapseButton: true,
                autoOpen: false,
                minWidth: width,
                maxWidth: width,
                width: width,
                height: height,
                initContent: function () {
                    self._updateFiltersWindowData();

                    var btnCancel = self._filtersWindow.find('.btnCancel').jqxButton({ width: 80 });
                    var btnOk = self._filtersWindow.find('.btnOk').jqxButton({ width: 80 });

                    btnCancel.on('click', function () {
                        self._filtersWindow.jqxWindow('close');
                    });

                    btnOk.on('click', function () {
                        self._applyFiltersWindowChanges();
                        self._filtersWindow.jqxWindow('close');
                    })

                }
            });
        },

        _updateFiltersWindowData: function () {
            var self = this;

            var fieldSettings = self._windowData.fieldSettings;
            var itemValue = self._listBoxes[self._windowData.type].jqxListBox('getItem', self._windowData.itemIndex).value;

            var sourceBoundItems = self.target.source[self._windowData.type];
            var sourceBoundItem = undefined;
            for (var i = 0; i < sourceBoundItems.length; i++) {
                if (sourceBoundItems[i]['dataField'] == itemValue.dataField && sourceBoundItems[i]['function'] == itemValue['function']) {
                    sourceBoundItem = sourceBoundItems[i];
                    break;
                }
            }

            // move operations
            var listBoxData = [];
            for (var i in fieldSettings.moveOperations)
                listBoxData.push({ text: i, value: fieldSettings.moveOperations[i] });

            // filter status
            listBoxData = [];
            var itemsFilterStatus = self.target.source.getItemsFilterStatus(sourceBoundItem.dataField);
            for (var i in itemsFilterStatus)
            {
                listBoxData.push({ label: i, value: itemsFilterStatus[i] });
            }

            var lbFilters = self._filtersWindow.find('.listBoxFilters');
            lbFilters.jqxListBox({ source: listBoxData, checkBoxes: true, displayMember: 'label', selectedIndex: -1, valueMember: 'value', width: '100%', height: '100%'});
            lbFilters.jqxListBox('beginUpdate');
            lbFilters.jqxListBox('checkAll');
            for (var i = 0; i < listBoxData.length; i++)
            {
                if (listBoxData[i].value)
                    lbFilters.jqxListBox('uncheckIndex', i);
            }
            lbFilters.jqxListBox('endUpdate');
        },

        _applyFiltersWindowChanges: function()
        {
            var self = this;
            var lbFilters = self._filtersWindow.find('.listBoxFilters');
            var items = lbFilters.jqxListBox('getItems');

            var uncheckedItems = [];
            for (var i = 0; i < items.length; i++)
                if (!items[i].checked)
                    uncheckedItems.push(items[i].label);

            var fn = 'filterFunction = function(value) {';
            for (var i = 0; i < uncheckedItems.length; i++)
                fn += 'if (value == \'' + uncheckedItems[i] + '\') return true;';

            fn += 'return false;';
            fn += '}';

            var itemIndex = self._windowData.itemIndex;
            var itemType = self._windowData.type;
            var source = self._listBoxes[itemType];
            var item = source.jqxListBox('getItem', itemIndex);

            var targetCurrentSettings = self._targetCurrentSettings;
            for (var i = 0; i < targetCurrentSettings['filters'].length; i++)
            {
                if (targetCurrentSettings['filters'][i].dataField == item.value.dataField)
                    targetCurrentSettings['filters'][i].filterFunction = eval(fn);
            }

            self._refreshPivotGrid(self._targetCurrentSettings);

        }
    });

})(jqxBaseFramework);

