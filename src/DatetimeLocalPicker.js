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

        constraints: {
            minDate: null,
            maxDate: null,
            minYear: 0,
            maxYear: 3000,
            minMonth: 0,
            maxMonth: 11
        },

        yearRange: [0, 10],

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

    function cloneSpecialValues(value) {
        if (moment.isMoment(value)) {
            return moment(value);
        }
        return undefined;
    }

    function getDaysInMonth(moment_or_year, month) {
        if (moment.isMoment(moment_or_year)) {
            return moment_or_year.endOf('month').date(); // last day of given moment's month
        }
        // create ISO date from given year and month and determine last day of that date's month
        return moment(''+(+moment_or_year)+'-'+(+month)+'-01', 'YYYY-MM-DD').endOf('month').date();
    }

    // constructor function for DatetimeLocalPicker instances
    return function(instance_settings) {
        var settings = {};
        updateSettings(instance_settings || {});

        var $input_element = $(settings.inputElement);
        var $output_element = $(settings.outputElement);
        var $container_element = settings.containerElement ? $(settings.containerElement) : null;
        var $trigger_element = $(settings.triggerElement);

        bindEventHandlers();

        // return public api
        return {

            getContainerElement: function() {
                return $container_element;
            },
            getInputElement: function() {
                return $input_element;
            },
            getOutputElement: function() {
                return $output_element;
            },
            getTriggerElement: function() {
                return $trigger_element;
            },

            getMinDate: function() {
                return moment(settings.constraints.minDate);
            },
            getMaxDate: function() {
                return moment(settings.constraints.maxDate);
            },
            getSettings: function() {
                return _.cloneDeep(settings, cloneSpecialValues);
            }
        };

        function draw() {
            console.log('hello from draw', $trigger_element);
        }

        function bindEventHandlers() {
            console.log('hello from bindEventHandlers');

            var events = [
                'pointerdown',
                'pointerup',
                //'pointermove',
                //'pointerover',
                //'pointerout',
                //'pointerenter',
                //'pointerleave',
                'click'
            ].join(' ');

            var $output = $('#output');

            $trigger_element.on(events, function(ev) {
                console.log(ev.type);
                $output.html($output.html() + ev.type + '<br>');
            });

            $trigger_element.on('click.' + settings.logPrefix, function(ev) {
                draw();
            });

            $input_element.on(events, function(ev) {
                console.log(ev.type);
            });
        }

        function removeEventHandlers() {
            console.log('hello from removeEventHandlers');
        }

        function updateSettings(s) {
            settings = $.extend(true, {}, default_settings, s, settings);

            // add (randomized) log prefix to instance
            settings.logPrefix = settings.logPrefix || 'DatetimeLocalPicker';
            if (!settings.randomizeLogPrefix || settings.randomizeLogPrefix === true || settings.logPrefix === '') {
                settings.logPrefix += '#' + getRandomString();
            }

            // use the input element as trigger element when no specific trigger was given
            settings.triggerElement = settings.triggerElement || settings.inputElement;

            // use the input element as output element when no custom output element or format is needed/given
            settings.outputElement = settings.outputElement || settings.inputElement;

            settings.isRTL = !!settings.isRTL;

            // check for a valid given locale to use and store that in settings (as it might be invalid/unknown)
            var m = moment();
            var locale = m.locale(settings.locale);
            settings.locale = m.locale();

            //if (!_.isArray(settings.inputFormats)) {
            //    throw new Error('The inputFormats must be an array of acceptable date formats for moment.');
            //}

            settings.disableWeekends = !!settings.disableWeekends;

            settings.numberOfMonths = Math.abs(parseInt(settings.numberOfMonths, 10)) || 1;

            updateDateConstraints();
        }

        function updateDateConstraints() {
            var min_date = parseDate(settings.constraints.minDate);
            var max_date = parseDate(settings.constraints.maxDate);

            var min_year = default_settings.minYear;
            var min_month = default_settings.minMonth;

            var max_year = default_settings.maxYear;
            var max_month = default_settings.maxMonth;

            if ((min_date && max_date) && max_date.isBefore(min_date)) {
                var temp = max_date.clone();
                max_date = min_date.clone();
                min_date = temp;
            }

            if (min_date) {
                min_year = min_date.year();
                min_month = min_date.month();
            }

            if (max_date) {
                max_year = max_date.year();
                max_month = max_date.month();
            }

            settings.constraints = {
                minDate: min_date,
                maxDate: max_date,

                minYear: min_year,
                maxYear: max_year,

                minMonth: min_month,
                maxMonth: max_month
            };
        }

        function parseDate(mixed) {
            var new_date = moment(mixed).locale(settings.locale);
            return new_date.isValid() ? new_date : false;
        }

    }; // end of constructor function
}));

