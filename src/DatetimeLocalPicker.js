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

    var $output = $('#output');

    var default_settings = {
        inputElement: null,
        triggerElement: null,
        containerElement: null,
        utcOffsetElement: null,

        locale: 'en',

        inputFormats: [
            moment.ISO_8601,
            'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
            'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
            "YYYY-MM-DD[T]HH:mm:ssZ",
            "YYYY-MM-DD[T]HH:mm:ss[Z]",
            "YYYY-MM-DD",
            "DD.MM.YYYY HH:mm:ss.SSSZ",
            "DD.MM.YYYY HH:mm:ss.SSS",
            "DD.MM.YYYY HH:mm:ss",
            "DD.MM.YYYY HH:mm",
            "DD.MM.YYYY",
            "DD/MM/YYYY HH:mm:ss.SSSZ",
            "DD/MM/YYYY HH:mm:ss.SSS",
            "DD/MM/YYYY HH:mm:ss",
            "DD/MM/YYYY HH:mm",
            "DD/MM/YYYY"
        ],
        // displayFormat: 'YYYY-MM-DD HH:mm:ss',
        displayFormat: 'L LTS',
        outputFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
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
            calendar: '',
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
        var current_date;
        var settings = {};
        updateSettings(instance_settings || {});

        var $container_element = settings.containerElement ? $(settings.containerElement) : null;
        var $trigger_element = $(settings.triggerElement);
        var $input_element = $(settings.inputElement);

        var $hidden_element = $input_element.clone();
        $hidden_element.attr('id', $hidden_element.attr('id') + settings.logPrefix);
        $hidden_element.attr('type', 'search');
        $hidden_element.insertBefore($input_element);

        $input_element.removeAttr('name');

        setCurrentDate(parseDate($input_element.val()));
        console.log('utc', moment(current_date).utc().format());
        console.log('local', moment(current_date).local().format());
        current_date.local();
        $input_element.val(moment(current_date).format(settings.displayFormat));

        bindEventHandlers();

        // return public api
        return {

            getContainerElement: function() {
                return $container_element;
            },
            getInputElement: function() {
                return $input_element;
            },
            getHiddenElement: function() {
                return $hidden_element;
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

        function parseDate(mixed) {
            return moment(mixed, settings.inputFormats).locale(settings.locale);
        }

        function draw() {
            if ($container_element) {
                $container_element.html(
                    settings.templates.calendar({
                        date: moment(current_date).format('MMMM YYYY')
                    })
                );
            }
        }

        function bindEventHandlers() {
            /*
            var events = [
                'pointerdown',
                'pointerup',
                'pointermove',
                'pointerover',
                'pointerout',
                'pointerenter',
                'pointerleave',
                'click'
            ].join(' ');
            */

            $trigger_element.on('click.' + settings.logPrefix, function(ev) {
                draw();
            });

            $hidden_element.on('change.' + settings.logPrefix, function(ev) {
                console.log($hidden_element.val());
            });
            $input_element.on('change.' + settings.logPrefix, handleInputElementChange);
            //$input_element.on('keyup.' + settings.logPrefix, handleInputElementChange);
        }

        function handleInputElementChange(ev) {
            setCurrentDate(parseDate($input_element.val()));
        }

        function setCurrentDate(date) {
            if (moment.isMoment(date) && date.isValid()) {
                current_date = moment(date);
                $hidden_element.val(moment(current_date).utc().format(settings.outputFormat));
                draw();
            }
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

            // check for a valid given locale to use and store that in settings (as it might be invalid/unknown)
            var m = moment();
            var locale = m.locale(settings.locale);
            settings.locale = m.locale();

            if (!_.isArray(settings.inputFormats)) {
                throw new Error('The inputFormats must be an array of acceptable date formats for moment.');
            }
            settings.inputFormats.push(settings.displayFormat);

            settings.disableWeekends = !!settings.disableWeekends;
            settings.isRTL = !!settings.isRTL;
            settings.numberOfMonths = Math.abs(parseInt(settings.numberOfMonths, 10)) || 1;

            updateDateConstraints();
            compileTemplates();
        }

        function updateDateConstraints() {
            var min_date = parseDate(settings.constraints.minDate);
            var max_date = parseDate(settings.constraints.maxDate);

            var min_year = default_settings.minYear;
            var min_month = default_settings.minMonth;

            var max_year = default_settings.maxYear;
            var max_month = default_settings.maxMonth;

            if ((min_date.isValid() && max_date.isValid()) && max_date.isBefore(min_date)) {
                var temp = max_date.clone();
                max_date = min_date.clone();
                min_date = temp;
            }

            if (min_date.isValid()) {
                min_year = min_date.year();
                min_month = min_date.month();
            }

            if (max_date.isValid()) {
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

        function compileTemplates() {
            if (!_.isPlainObject(settings.templates)) {
                throw new Error('Settings must have a "templates" object with lodash templates (compiled or not).');
            }

            _.forIn(settings.templates, function(value, key, templates) {
                if (!_.isFunction(templates[key]) && _.isString(value)) {
                    templates[key] = _.template(value); // compile template string
                }
            });
        }

    }; // end of constructor function
}));

