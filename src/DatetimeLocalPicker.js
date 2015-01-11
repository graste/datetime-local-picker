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

        // must be given per locale as moment doesn't include this
        // see https://github.com/moment/moment/issues/1947
        // see https://en.wikipedia.org/wiki/Workweek_and_weekend
        weekendDays: [6, 0], // based on 0 to 6 (Sunday to Saturday)
        notationWeekdays: '_weekdaysMin', // moment.localeData()[…]

        // positive integer of weeks to render for a calendar month;
        // anything lower than necessary number of weeks will be ignored
        minWeeksPerMonth: 0,

        // number of months to display at once
        numberOfMonths: {
            before: 0,
            after: 0
        },

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
            foo: '<pre><%= JSON.stringify(settings) %></pre>'
            //calendarHeader: '<span class="calendar-title"><%- date.format("MMMM YYYY") %></span>',
            //calendarWeekdays: '…',
        },

        htmlAttributes: {
        },

        cssPrefix: 'dtlp-',
        cssClasses: {
            dayName: 'weekday',
            weekend: 'weekend',
            week: 'week',
            weekNumber: 'calendar-week',
            day: 'day',
            dayPrevMonth: 'day--excess day--prevMonth',
            dayNextMonth: 'day--excess day--nextMonth',



            container: 'wrapper',

            head: 'head',
            body: 'body',
            foot: 'foot',

            title: 'title',
            label: 'label',

            calendar: 'calendar',
            multipleMonths: 'multiple-months',
            singleMonth: 'single-month',

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

        var $trigger_element = $(settings.triggerElement);
        var $input_element = $(settings.inputElement);

        var $container_element = settings.containerElement ? $(settings.containerElement) : null;
        if (_.isNull($container_element)) {
            $container_element = $('<div>').attr('id', 'container'+settings.logPrefix);
            $container_element.insertAfter($input_element);
        }

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

        if (settings.debug) {
            console.log('settings', settings);
        }

        // return public api
        return {
            getInputElement: function() {
                return $input_element;
            },
            getHiddenElement: function() {
                return $hidden_element;
            },
            getTriggerElement: function() {
                return $trigger_element;
            },
            getContainerElement: function() {
                return $container_element;
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
            },
            isWeekend: function(valid_moment) {
                return isWeekend(valid_moment);
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
                current_date = moment(date).local();
                setHiddenElementDate(date);
                setInputElementDate(date);
            } else {
                resetInputElementDate();
            }

            draw();
        }

        function isWeekend(valid_moment) {
            var m = moment(valid_moment).locale(settings.locale);
            return (settings.weekendDays.indexOf(m.day()) !== -1);
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
                $input_element.removeClass('is-invalid');
            } else {
                $input_element.addClass('is-invalid');
                throw new Error('Hidden input element contains an invalid moment: ' + m);
            }
        }

        function draw() {
            var html = '';
            var idx;

            // render N previous months
            for (idx = settings.numberOfMonths.before; idx > 0; idx--) {
                html += renderCalendarMonth(
                    moment(current_date).subtract(idx, 'months')
                );
            }

            // render current month
            html += renderCalendarMonth(moment(current_date));

            // render N next months
            for (idx = 1; idx <= settings.numberOfMonths.after; idx++) {
                html += renderCalendarMonth(
                    moment(current_date).add(idx, 'months')
                );
            }

            $container_element.html(html);
        }

        function renderCalendarMonth(date) {
            date = moment(date); // clone just in case someone modifies the date while rendering
            return settings.templates.calendar({
                calendarHeader: prepareCalendarHeader(date),
                calendarFooter: '',
                calendarWeekdays: prepareCalendarWeekdays(date),
                calendarWeeks: prepareCalendarWeeks(date),
                localeData: date.localeData(),
                settings: settings,
                currentDate: date
            });
        }

        function prepareCalendarHeader(date) {
            var data = {
                date: moment(date),
                year: date.format('YYYY'),
                month: date.format('MMMM'),
                content: date.format('MMMM YYYY')
            };

            // optionally use a compiled template for the content property
            if (settings.templates.calendarHeader && _.isFunction(settings.templates.calendarHeader)) {
                data.content = settings.templates.calendarHeader(data);
            }

            return data;
        }

        function prepareCalendarWeekdays(date) {
            var weekdays = [];
            var locale_data = date.localeData();
            var weekday_data = {};
            var fdow = locale_data.firstDayOfWeek();
            for (var idx = fdow, len = fdow + 7; idx < len; idx++) {
                // determine actual index to lookup in local_data as that is 0-6 based
                var day = idx;
                if (day >= 7) {
                    day -= 7;
                }

                var css_classes = settings.cssClasses.dayName;
                if (settings.weekendDays.indexOf(day) !== -1) {
                    css_classes += ' ' + settings.cssClasses.weekend;
                }

                weekday_data = {
                    content: locale_data[settings.notationWeekdays][day],
                    fullName: locale_data._weekdays[day],
                    shortName: locale_data._weekdaysShort[day],
                    minName: locale_data._weekdaysMin[day],
                    css: css_classes,
                    localeData: locale_data
                };

                // optionally use a compiled template for the content property
                if (settings.templates.calendarWeekdays && _.isFunction(settings.templates.calendarWeekdays)) {
                    weekday_data.content = settings.templates.calendarWeekdays(weekday_data);
                }

                weekdays.push(weekday_data);
            }

            return weekdays;
        }

        function prepareCalendarWeeks(date) {
            var weeks = [];
            var days_per_week = 7;
            var today = moment();
            var current_date = moment(date);
            var days_in_month = getDaysInMonth(date);
            var first_date_of_month = moment(date).startOf('month');
            var first_week_of_month = first_date_of_month.week();
            var last_date_of_month = moment(date).endOf('month');
            var last_week_of_month = last_date_of_month.week();

            var num_weeks = Math.ceil(Math.abs(last_date_of_month.diff(first_date_of_month, 'weeks', true)));
            if (settings.minWeeksPerMonth > num_weeks) {
                num_weeks = settings.minWeeksPerMonth;
            }

            var days_before = first_date_of_month.weekday(); // idx of first day of week
            var days_after = (num_weeks * days_per_week) - (days_before + days_in_month);
            if (days_after < 0) {
                days_after += days_per_week;
            }

            var num_days = days_before + days_in_month + days_after;
            var num_cells = num_days + num_weeks; // week numbers before each week

            if (settings.debug) {
                console.log('num_weeks='+num_weeks);
                console.log('first_week='+first_week_of_month, 'last_week='+last_week_of_month);
                console.log('days_before='+days_before, 'dim='+days_in_month, 'days_after='+days_after);
                console.log('days_to_render='+num_days, 'cells_to_render='+num_cells);
            }

            var start_date = moment(first_date_of_month).subtract(+days_before, 'days');
            var end_date = moment(last_date_of_month).add(days_after, 'days');
            if (settings.debug) {
                console.log('start=', start_date.toString());
                console.log('  end=', end_date.toString());
            }

            var day_css;
            var day_content;
            var day_data = {};
            var week_data = {};
            var render_date = moment(start_date);
            var idx;

            for (idx = 0; idx < num_days; idx++) {

                // initialize a new week's data
                if (idx%(days_per_week) === 0) {
                    week_data = {
                        css: settings.cssClasses.week,
                        weekNumberCSS: settings.cssClasses.weekNumber,
                        num: render_date.week(),
                        content: render_date.week(),
                        days: []
                    };
                }

                // css for one calendar day
                day_css = settings.cssClasses.day;
                if (isWeekend(render_date)) {
                    day_css += ' ' + settings.cssClasses.weekend;
                }
                if (idx < days_before) {
                    day_css += ' ' + settings.cssClasses.dayPrevMonth;
                } else if (idx >= (days_before + days_in_month)) {
                    day_css += ' ' + settings.cssClasses.dayNextMonth;
                }

                day_content = render_date.date();
                if (isDisabled(render_date)) {
                    day_content = settings.template.disabledDay({
                        date: render_date,
                        settings: settings
                    });
                }

                // data for one calendar day
                day_data = {
                    css: day_css,
                    date: moment(render_date),
                    content: day_content
                };

                // add day_data to current week's data
                week_data.days.push(day_data);

                // add whole week's data to weeks array
                if (week_data.days.length === days_per_week) {
                    weeks.push(week_data);
                }

                // advance one day
                render_date.add(1, 'day');
            }

            if (settings.debug) {
                console.log('weeks_data=', weeks);
            }

            return weeks;
        }

        function isDisabled(date) {
            return false;
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
            if (!_.isNull(fdow) && ((+fdow >= 0) && (+fdow <= 6))) {
                settings.firstDayOfWeek = fdow;
            } else {
                var l = m.localeData();
                settings.firstDayOfWeek = l.firstDayOfWeek();
            }

            if (!(_.isArray(settings.weekendDays) && _.min(settings.weekendDays) >= 0 && _.max(settings.weekendDays) <= 6)) {
                throw new Error('Setting weekendDays must be an array of positive integers that represent the index of weekdays to use as weekend (defaults to [0, 6] which is Sun/Sat).');
            }

            var valid_weekdays_notations = ['_weekdays', '_weekdaysShort', '_weekdaysMin'];
            if (!_.isString(settings.notationWeekdays) || (_.isString(settings.notationWeekdays) && valid_weekdays_notations.indexOf(settings.notationWeekdays) === -1)) {
                throw new Error('Setting notationWeekdays must be one of: ' + valid_weekdays_notations.join(', '));
            }
            settings.notationWeekdays = settings.notationWeekdays || '_weekdaysMin';

            settings.minWeeksPerMonth = Math.ceil(+settings.minWeeksPerMonth);
            if (_.isNaN(settings.minWeeksPerMonth) || (!_.isNaN(settings.minWeeksPerMonth) && (settings.minWeeksPerMonth < 0))) {
                throw new Error('Setting minWeeksPerMonth must be a positive integer value of minimum number of weeks to display.');
            }

            if (!_.isArray(settings.inputFormats)) {
                throw new Error('Setting inputFormats must be an array of acceptable date format strings for moment.');
            }
            settings.inputFormats.push(settings.displayFormat);

            settings.disableWeekends = !!settings.disableWeekends;
            settings.isRTL = !!settings.isRTL;

            var nom = settings.numberOfMonths;
            if (_.isNumber(nom) && !_.isNaN(nom)) {
                nom = Math.ceil(Math.abs(nom));
                if (nom > 1) {
                    settings.numberOfMonths = {
                        before: 0,
                        after: nom-1
                    };
                }
            } else if (_.isObject(nom) &&
                _.has(nom, 'before') && _.has(nom, 'after') &&
                _.isNumber(nom.before) && _.isNumber(nom.after) &&
                !_.isNaN(nom.before) && !_.isNaN(nom.after)
            ) {
                settings.numberOfMonths = {
                    before: Math.ceil(Math.abs(nom.before)),
                    after: Math.ceil(Math.abs(nom.after))
                };
            } else {
                throw new Error('Setting numberOfMonths must be a positive integer or an object with before/after properties with a positive number of months to display before or after the current calendar month.');
            }


            settings.debug = !!settings.debug;

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

