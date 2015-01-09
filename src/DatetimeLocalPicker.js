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
        parseStrict: true,
        //parseHuman: false,
        firstDayOfWeek: null,
        weekendDays: [5, 6],
        notationWeekdays: '_weekdaysMin',
        numberOfMonths: 1,

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

        //displayFormat: 'YYYY-MM-DD HH:mm:ss',
        displayFormat: 'L LTS',

        outputFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
        output: {
            element: null,
            format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
            forceHours: null,
            forceMinutes: null,
            forceSeconds: null,
            forceMilliseconds: null
        },

        constraints: {
            minDate: null,
            maxDate: null,
            minYear: 0,
            maxYear: 3000,
            minMonth: 0,
            maxMonth: 11
        },





        defaultDate: null,
        defaultHours: 0,
        defaultMinutes: 0,
        defaultSeconds: 0,
        defaultMilliseconds: 0,

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

        highlight: [
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
        //highlightFunctions: [],

        disable: [ new Date(), new Date() ],
        //disableFunctions: [],
        disableWeekends: false,

        disableInput: false,

        position: 'bottom left',
        autoReposition: true,
        shouldReflow: true,


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
            return moment_or_year.daysInMonth();
        }
        return moment(''+(+moment_or_year)+'-'+(+month), 'YYYY-MM').daysInMonth();
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

        bindEventHandlers();

        var initial_value = $input_element.val();
        var initial_date = parseDate(initial_value);
        if (moment.isMoment(initial_date) && initial_date.isValid()) {
            current_date = moment(initial_date);
            setCurrentDate(initial_date);
        } else {
            current_date = moment();
            current_date.locale(settings.locale);
        }

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
            },
            getCurrentDate: function() {
                return moment(current_date);
            }
        };

        function parseDate(mixed) {
            var d = moment(mixed, settings.inputFormats, settings.locale, settings.parseStrict);
            d.locale(settings.locale);
            return d;
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
                console.log('hidden value: ' + $hidden_element.val());
            });

            $input_element.on('change.' + settings.logPrefix, handleInputElementChange);

            $input_element.on(
                'pointerup.' + settings.logPrefix + ' ' +
                'keyup.' + settings.logPrefix + ' ',
                handleInputElementPointerUp
            );
        }

        function handleInputElementPointerUp(ev) {
            var date = parseDate($input_element.val());
            if (moment.isMoment(date) && date.isValid()) {
                $input_element.removeClass('is-invalid');
            } else {
                $input_element.addClass('is-invalid');
            }
        }

        function handleInputElementChange(ev) {
            setCurrentDate(parseDate($input_element.val()));
        }

        function setCurrentDate(date) {
            if (moment.isMoment(date) && date.isValid()) {
                setHiddenElementDate(date);
                setInputElementDate(date);
            } else {
                resetInputElementDate();
            }

            draw();
        }

        function setHiddenElementDate(valid_moment) {
            $hidden_element.val(
                //moment(valid_moment).utc().format(settings.outputFormat)
                moment(valid_moment).toISOString()
            );
        }

        function setInputElementDate(valid_moment) {
            $input_element.val(
                moment(valid_moment).local().format(settings.displayFormat)
            );
        }

        // set input element value to the last known valid date
        function resetInputElementDate() {
            var m = parseDate($hidden_element.val());
            if (moment.isMoment(m) && m.isValid()) {
                $input_element.val(
                    m.local().format(settings.displayFormat)
                );
            } else {
                throw new Error('Hidden input element contains an invalid moment: ' + m);
            }
        }

        function draw() {
            if ($container_element) {
                $container_element.html(
                    settings.templates.calendar({
                        date: moment(current_date).format('MMMM YYYY'),
                        weekdays: prepareWeekdays()
                    })
                );
            }
        }

        function prepareWeekdays() {
            var weekdays = [];
            var m = moment(current_date);
            var locale_data = m.localeData();
            var idx = 0;
            for (idx = 0; idx < 7; idx++) {
                // determine actual index (day number) to lookup in weekdaysShort
                var day = idx + settings.firstDayOfWeek;
                while (day >= 7) {
                     day -= 7;
                }

                var css_classes = 'weekday';
                if (settings.weekendDays.indexOf(idx) !== -1) {
                    css_classes += ' weekend ';
                }

                weekdays[idx] = {
                    content: locale_data[settings.notationWeekdays][day],
                    css: css_classes
                };
            }

            return weekdays;
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
            m.locale(settings.locale);
            settings.locale = m.locale(); // actual locale being used

            var fdow = settings.firstDayOfWeek;
            if (!_.isNull(fdow)) {
            }
            if (!_.isNull(fdow) && ((+fdow >= 0) && (+fdow <= 6))) {
                settings.firstDayOfWeek = fdow;
            } else {
                var l = m.localeData();
                settings.firstDayOfWeek = l.firstDayOfWeek();
            }

            if (!(_.isArray(settings.weekendDays) && _.min(settings.weekendDays) >= 0 && _.max(settings.weekendDays) <= 6)) {
                throw new Error('The weekendDays must be an array of integers that represent the index of weekdays to use as weekend (defaults to [5, 6]).');
            }

            var valid_weekdays_notations = ['_weekdays', '_weekdaysShort', '_weekdaysMin'];
            if (!_.isString(settings.notationWeekdays) || (_.isString(settings.notationWeekdays) && valid_weekdays_notations.indexOf(settings.notationWeekdays) === -1)) {
                throw new Error('The notationWeekdays must be one of: ' + valid_weekdays_notations.join(', '));
            }
            settings.notationWeekdays = settings.notationWeekdays || '_weekdaysMin';

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

