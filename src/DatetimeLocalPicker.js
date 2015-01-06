// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(
            [
                'jquery',
                'lodash',
                'moment'
            ],
            factory,
            function (error) {
                // error has err.requireType (timeout, nodefine, scripterror)
                // and error.requireModules (an array of module ids/paths)
            }
        );
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
        module.exports = factory(
            require('jquery'),
            require('lodash'),
            require('moment')
        );
    } else {
        // Browser globals (root is window)
        root.DatetimeLocalPicker = factory(
            root.jQuery,
            root._,
            root.moment
        );
    }
}(this, function ($, _, moment) {

    'use strict';

    var default_settings = {
        inputElement: null,
        containerElement: null,
        utcOffsetElement: null,

        inputFormats: null,
        outputFormats: null,
        parseStrict: false,
        parseHuman: false,

        defaultDate: null,

        defaultHours: 0,
        defaultMinutes: 0,
        defaultSeconds: 0,
        defaultMilliseconds: 0,

        firstDayOfWeek: 0,
        numberOfMonths: 1,

        minDate: null,
        maxDate: null,
        minYear: 0,
        maxYear: 3000,
        yearRange: [0, 10],
        minMonth: undefined,
        maxMonth: undefined,

        isRTL: false,

        showOnFocus: true,
        showOnAutofocus: true,
        showYearSelect: true,
        showMonthSelect: true,
        showWeekNumbers: true,
        showExcessDays: true,
        showTime: true,
        showSeconds: false,
        showMilliseconds: false,

        highlightDays: [
            {
                date: '2015-01-24',
                css: 'holidays',
                title: 'some short title'
            },
            {
                date: '2015-01-24T12:45:00.000',
                css: 'event'
            }
        ],
        highlightDayFunctions: [],

        disabledDays: [ new Date(), new Date() ],
        disableDayFunctions: [],

        validDayFunctions: [],

        disableWeekends: false,

        position: 'bottom left',
        autoReposition: true,
        shouldReflow: true,

        disableInput: false,
        clearOnInvalidInput: false,

        use24hour: true,
        hourFormat: '',
        meridiem: '',
        yearSuffix: '',
        showMonthAfterYear: false,

        onBeforeShow: null,
        onBeforeHide: null,
        onShow: null,
        onHide: null,
        onSelect: null,
        onClear: null,
        onBeforeDraw: null,
        onDraw: null,

        templates: {
            head: '',
            body: '',
            foot: '',
            row: '',
            day: '',
        },

        htmlAttributes: {
        },

        cssPrefix: 'dtlp-',
        cssClasses: {
            container: 'wrapper',

            head: 'head',
            body: 'body',
            foot: 'foot',

            title: 'title',
            label: 'label',

            calendar: 'calendar',
            multipleMonths: 'multiple-months',
            singleMonth: 'single-month',

            day: 'day',
            dayName: 'dayname',
            week: 'week',
            month: 'month',
            year: 'year',

            table: 'table',
            row: 'row',

            isVisible: 'is-visible',
            isToday: 'is-today',
            isEmpty: 'is-empty',
            isDisabled: 'is-disabled',
            isSelected: 'is-selected',
            isBound: 'is-bound',

            button: 'button',
            prevMonth: 'prev-month',
            nextMonth: 'next-month',

            select: 'select',
            selectMonth: 'select-month',
            selectYear: 'select-year',

            selectTime: 'select-time',
            timePicker: 'time-picker'
        },

        i18n: {
            prevMonth: '',
            nextMonth: '',

            months: [],
            monthsMedium: [],
            monthsShort: [],

            weekdays: [],
            weekdaysShort: [],
            weekdaysMedium: [],

            midnight: '',
            noon: '',

            clear: '',
            today: '',

            someMore: ''
        },

        even: 'more'
    };

    function getRandomString() {
        return (Math.random().toString(36)+'00000000000000000').slice(2, 10);
    }

    var DatetimeLocalPicker = function(settings) {
        this.configure(settings || {});
    };

    DatetimeLocalPicker.prototype.configure = function(settings) {
        if (!this.settings) {
            this.settings = $.extend(true, {}, defaults);
        }

        this.settings = $.extend(true, {}, default_settings, this.settings, settings);

        // add (randomized) log prefix to instance
        this.log_prefix = this.settings.log_prefix || 'DatetimeLocalPicker';
        if (!this.settings.randomize_log_prefix || this.settings.randomize_log_prefix === true || this.settings.log_prefix === "") {
            this.log_prefix += "#" + getRandomString();
        }

    };

    return DatetimeLocalPicker;
}));

