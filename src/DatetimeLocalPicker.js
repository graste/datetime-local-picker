;(function (factory) {
    // register as anonymous module, AMD style
    if (typeof define === 'function' && define.amd) {
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
    }
}(function ($, _, moment) {

    'use strict';

    var default_settings = {
        inputElement: null,
        triggerElement: null,
        containerElement: null,
        utcOffsetElement: null,

        locale: 'en',

        //inputFormats: null,
        inputFormats: [
            moment.ISO_8601,
            "YYYY-MM-DD[T]HH:mm:ss.SSSZ",
            "YYYY-MM-DD[T]HH:mm:ssZ",
            "YYYY-MM-DD",
            "HH:mm:ss.SSS",
            "HH:mm:ss"
        ],
        displayFormat: moment.ISO_8601,
        outputFormat: moment.ISO_8601,
        parseStrict: false,
        //parseHuman: false,

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
        minMonth: 0,
        maxMonth: 11,

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
            monthsShort: [],

            weekdays: [],
            weekdaysShort: [],

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

    function DatetimeLocalPicker(settings) {
        this.configure(settings || {});
    }

    DatetimeLocalPicker.prototype = {

        parseDate: function(mixed) {
            var new_date = moment(mixed).locale(this.settings.locale);
            return new_date.isValid() ? new_date : false;
        },

        setMinDate: function(mixed) {
            this.settings.minDate = this.parseDate(this.settings.minDate);
            return this.consolidateMinMaxDates();
        },

        setMaxDate: function(mixed) {
            this.settings.maxDate = this.parseDate(this.settings.maxDate);
            return this.consolidateMinMaxDates();
        },

        consolidateMinMaxDates: function() {
            // swap min/max dates if they are in "wrong" order
            if ((this.settings.minDate && this.settings.maxDate) && this.settings.maxDate.isBefore(this.settings.minDate)) {
                var temp = this.settings.maxDate.clone();
                this.settings.maxDate = this.settings.minDate.clone();
                this.settings.minDate = temp;
            }

            if (this.settings.minDate) {
                this.settings.minYear = this.settings.minDate.year();
                this.settings.minMonth = this.settings.minDate.month();
            } else {
                this.settings.minYear = default_settings.minYear;
                this.settings.minMonth = default_settings.minMonth;
            }

            if (this.settings.maxDate) {
                this.settings.maxYear = this.settings.maxDate.year();
                this.settings.maxMonth = this.settings.maxDate.month();
            } else {
                this.settings.maxYear = default_settings.maxYear;
                this.settings.maxMonth = default_settings.maxMonth;
            }

            return this;
        },

        configure: function(settings) {
            if (!this.settings) {
                this.settings = $.extend(true, {}, defaults);
            }

            this.settings = $.extend(true, {}, default_settings, this.settings, settings);

            // add (randomized) log prefix to instance
            this.settings.logPrefix = this.settings.logPrefix || 'DatetimeLocalPicker';
            if (!this.settings.randomizeLogPrefix || this.settings.randomizeLogPrefix === true || this.settings.logPrefix === '') {
                this.settings.logPrefix += '#' + getRandomString();
            }

            this.settings.isRTL = !!this.settings.isRTL;

            // check for a valid given locale to use and store that in settings (as it might be invalid/unknown)
            this.settings.locale = moment().locale(this.settings.locale);

            // use the input element as trigger element when no specific trigger was given
            this.settings.triggerElement = this.triggerElement || this.settings.inputElement;

            //if (!_.isArray(this.settings.inputFormats)) {
            //    throw new Error('The inputFormats must be an array of dates or date strings.');
            //}

            this.settings.disableWeekends = !!this.settings.disableWeekends;

            var nom = parseInt(this.settings.numberOfMonths, 10) || 1;
            this.settings.numberOfMonths = nom > 12 ? 12 : nom;

            this.setMinDate(this.settings.minDate);
            this.setMaxDate(this.settings.maxDate);
        }

    };

    return DatetimeLocalPicker;
}));

