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
        direction: 'ltr', //isRTL: false,
        parseStrict: true,
        hideOnSelect: false,

        // must be given per locale as moment doesn't include this
        // see https://github.com/moment/moment/issues/1947
        // see https://en.wikipedia.org/wiki/Workweek_and_weekend
        weekendDays: [6, 0], // based on 0 to 6 (Sunday to Saturday)
        notationWeekdays: '_weekdaysMin', // moment.localeData()[…]

        // positive integer of weeks to render for a calendar month;
        // anything lower than necessary number of weeks will be ignored
        minWeeksPerMonth: 6,

        // number of months to display at once; integer value or object
        // - negative integer values will set the number of months before
        // - positive integer values will set the number of months after
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
        outputElement: null,
        output: {
            forceHours: null,
            forceMinutes: null,
            forceSeconds: null,
            forceMilliseconds: null
        },

        constraints: {
            minDate: null, // must be new Date(…) or a string compatible to inputFormats
            maxDate: null, // must be new Date(…) or a string compatible to inputFormats
            // alternative:
            minMonth: 0,
            minYear: 1800,
            maxMonth: 11,
            maxYear: 2100,
        },

        disableWeekends: false,
        disabledDates: [],

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
            //calendarContent: '',
            //calendarHeader: '<span class="calendar-title"><%- date.format("MMMM YYYY") %></span>',
            //calendarWeekday: '…',
            //calendarWeek: '…',
            //calendarDay: '…',
            //calendarFooter: '…',
        },

        cssPrefix: 'dtlp-',
        cssClasses: {
            dayName: 'weekday',
            weekend: 'weekend',
            week: 'week',
            weekNumber: 'calendar-week',
            day: 'day',
            dayPrevMonth: 'day--excess day--prev-month',
            dayNextMonth: 'day--excess day--next-month',

            isVisible: 'is-visible',
            isDisabled: 'day--disabled',
            isSelected: 'day--selected',
            isCurrent: 'day--current',
            isToday: 'day--today',
            isEmpty: 'is-empty',
            inputInvalid: 'is-invalid',

            selectToday: 'select-today',
            gotoPrevMonth: 'goto-prev-month',
            gotoNextMonth: 'goto-next-month',
            gotoPrevYear: 'goto-prev-year',
            gotoNextYear: 'goto-next-year',

            container: 'calendars-wrapper',

            calendars: 'calendars',
            calendarsHeader: 'calendars__header',
            calendarsBody: 'calendars__body',
            calendarsFooter: 'calendars__footer',
            calendarsSingle: 'calendars--single',
            calendarsMultiple: 'calendars--multiple',

            calendar: 'calendar',
            calendarHeader: 'calendar__header',
            calendarBody: 'calendar__body',
            calendarFooter: 'calendar__footer'
        },

        i18n: {
            de: {
                selectToday: 'Heute',
                prevMonth: 'vorheriger Monat',
                nextMonth: 'nächster Monat',
                week: 'Kalenderwoche',
                gotoPrevMonthTitle: 'vorherigen Monat anzeigen',
                gotoNextMonthTitle: 'nächsten Monat anzeigen',
                gotoPrevYearTitle: 'ein Jahr zurück',
                gotoNextYearTitle: 'ein Jahr vorwärts'
            },
            en: {
                selectToday: 'select today',
                prevMonth: 'previous month',
                nextMonth: 'next month',
                week: 'Calendar Week',
                gotoPrevMonthTitle: 'show previous month',
                gotoNextMonthTitle: 'show next month',
                gotoPrevYearTitle: 'jump back one year',
                gotoNextYearTitle: 'jump forward one year'
            }
        },

        // from here on: TBD

        defaultDate: null,
        defaultHours: 0,
        defaultMinutes: 0,
        defaultSeconds: 0,
        defaultMilliseconds: 0,
        yearRange: [0, 10],
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

        disableInput: false,
        position: 'bottom left',
        autoReposition: true,
        shouldReflow: true,
        use24hour: true,
        hourFormat: '',
        meridiem: '',
        yearSuffix: '',
        showMonthAfterYear: false,
        htmlAttributes: {
        }
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

    function isModifierKey(key) {
        return key === 'ctrl' || key === 'meta' || key === 'alt' || key === 'shift';
    }

    // constructor function for DatetimeLocalPicker instances
    return function(instance_settings) {
        // define some internal state
        var state = {
            currentDate: null,
            selectedDate: null,
            isVisible: false
        };

        var settings = {};
        updateSettings(instance_settings || {});

        // TODO validate given HTML elements or selector strings

        var $elements = {
            trigger: null,
            container: null,
            input: null,
            output: null
        };
        updateElements();

        var initial_value = $elements.input.val();
        var initial_moment = parseDate(initial_value);
        if (isValidDate(initial_moment)) {
            setDate(initial_moment);
        } else {
            var initial_select_moment = moment();
            initial_select_moment.locale(settings.locale);
            selectDate(initial_select_moment);
        }

        if (settings.debug) { console.log('settings', settings); }

        // return public api
        return {
            getInputElement: function() {
                return $elements.input;
            },
            getOutputElement: function() {
                return $elements.output;
            },
            getTriggerElement: function() {
                return $elements.trigger;
            },
            getContainerElement: function() {
                return $elements.container;
            },
            getCurrentDate: function() {
                return moment(getCurrentDate());
            },
            getMinDate: function() {
                return moment(settings.constraints.minDate);
            },
            getMaxDate: function() {
                return moment(settings.constraints.maxDate);
            },
            getSelectedDate: function() {
                return moment(getSelectedDate());
            },
            getSettings: function() {
                return _.cloneDeep(settings, cloneSpecialValues);
            },
            isValidDate: function(mixed) {
                return isValidDate(parseDate(mixed));
            },
            isVisible: function() {
                return isVisible();
            },
            isWeekend: function(valid_moment) {
                return isWeekend(valid_moment);
            },
            parseDate: function(mixed, input_formats, locale) {
                return parseDate(mixed, input_formats, locale);
            },
            selectDate: function(mixed) {
                if (selectDate(mixed)) {
                    updateViewOrRedraw();
                }
                return this;
            },
            selectDay: function(mixed) {
                if (selectDay(mixed)) {
                    updateViewOrRedraw();
                }
                return this;
            },
            setDate: function(mixed) {
                if (setDate(mixed)) {
                    updateViewOrRedraw();
                }
                return this;
            },
            setDay: function(mixed) {
                if (setDay(mixed)) {
                    updateViewOrRedraw();
                }
                return this;
            },
            setNumberOfMonths: function(nom) {
                updateNumberOfMonths(nom);
                return this;
            },
            unbind: function() {
                unbindEventHandlers();
                return this;
            },
            bind: function() {
                bindEventHandlers();
                return this;
            },
            toggle: function() {
                toggleContainer();
                return this;
            },
            show: function() {
                showContainer();
                return this;
            },
            hide: function() {
                hideContainer();
                return this;
            },
            redraw: function() {
                redraw();
                return this;
            },
            toLocaleString: function() {
                return getCurrentDate().toString();
            },
            toString: function() {
                return getCurrentDate().toISOString();
            }
        };

        /**
         * Creates a new moment instance from the given argument.
         *
         * All styles mentioned in the moment docs are supported – except
         * for ASP.net style strings as those won't work because of strict
         * "settings.inputFormats" based parsing in the settings' locale..
         *
         * @param {mixed} mixed string or anything moment accepts to create a valid moment instance
         * @param {string|array} input formats to use for strict parsing; defaults to settings.inputFormats
         * @param {string} locale locale to use instead of settings.locale
         *
         * @return {moment} instance
         */
        function parseDate(mixed, input_formats, locale) {
            var parsed_date;

            if (_.isString(mixed)) {
                parsed_date = moment(mixed, input_formats || settings.inputFormats, settings.parseStrict);
            } else {
                parsed_date = moment(mixed);
            }
            parsed_date.locale(locale || settings.locale);

            return parsed_date;
        }

        function parseDay(mixed, input_formats, locale) {
            var parsed_date = parseDate(mixed, input_formats, locale);

            if (getCurrentDate()) {
                parsed_date.hours(getCurrentDate().hours());
                parsed_date.minutes(getCurrentDate().minutes());
                parsed_date.seconds(getCurrentDate().seconds());
                parsed_date.milliseconds(getCurrentDate().milliseconds());
            }

            return parsed_date;
        }

        function bindEventHandlers() {
            //var pointerevents = ['pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'click'].join(' ');

            $elements.input.on('change.' + settings.logPrefix, handleInputElementChange);
            $elements.input.on('keydown.' + settings.logPrefix, handleInputElementKeydown);
            $elements.input.on(
                'pointerup.' + settings.logPrefix + ' ' +
                'keyup.' + settings.logPrefix + ' ',
                handleInputElementPointerUp
            );

            $elements.output.on('change.' + settings.logPrefix, function(ev) {
                // TODO prevent invalid dates here? store last output date for restore?
                if (settings.debug) { console.log('output element value: ' + $elements.output_element.val()); }
            });

            $elements.trigger.on('click.' + settings.logPrefix, function(ev) {
                toggleContainer();
                focusSelectedDate();
            });
        }

        function unbindEventHandlers() {
            if (!_.isNull($elements.trigger)) {
                $elements.trigger.off('.' + settings.logPrefix);
            }

            if (!_.isNull($elements.output)) {
                $elements.output.off('.' + settings.logPrefix);
            }

            if (!_.isNull($elements.input)) {
                $elements.input.off('.' + settings.logPrefix);
            }

            unbindContainerEventHandlers();
        }

        function bindContainerEventHandlers() {
            $elements.container.on('keydown.' + settings.logPrefix, 'button', handleContainerKeydown);
            $elements.container.on('click.' + settings.logPrefix, 'button', handleContainerClick);
        }

        function unbindContainerEventHandlers() {
            if (!_.isNull($elements.container)) {
                $elements.container.off('.'+settings.logPrefix);
            }
        }

        function rebindContainerEventHandlers() {
            unbindContainerEventHandlers();
            bindContainerEventHandlers();
        }

        function handleContainerClick(ev) {
            if (settings.debug) { console.log('handleContainerClick', ev); }
            var set;
            var selected_day;
            var parsed_date;
            var $target = $(ev.target);

            if ($target.hasClass(settings.cssClasses.selectToday)) {
                selectToday();
            } else if ($target.parents('.'+settings.cssClasses.calendarHeader).length > 0) {
                //click event came from some button in the calendar header
                if ($target.hasClass(settings.cssClasses.gotoPrevMonth)) {
                    set = gotoPreviousSelectableDate('month');
                } else if ($target.hasClass(settings.cssClasses.gotoNextMonth)) {
                    set = gotoNextSelectableDate('month');
                } else if ($target.hasClass(settings.cssClasses.gotoPrevYear)) {
                    set = gotoPreviousSelectableDate('year');
                } else if ($target.hasClass(settings.cssClasses.gotoNextYear)) {
                    set = gotoNextSelectableDate('year');
                }

                if (set) {
                    updateViewOrRedraw();
                }
            } else {
                // probably a click on a day button; is there a day cell involved?
                selected_day = $target.parents('[data-iso-date]');
                if (selected_day.length > 0) {
                    parsed_date = parseDate(selected_day.attr('data-iso-date'));
                    if (setDay(parsed_date)) {
                        if (settings.hideOnSelect) {
                            hideContainer();
                            $elements.input.focus();
                        } else {
                            updateViewOrRedraw();
                        }
                    }
                } else {
                    if (settings.debug) { console.log('click on something that is not in a .day'); }
                }
            }
        }

        function handleContainerKeydown(ev) {
            if (settings.debug) { console.log('handleContainerKeydown', ev); }
            switch (ev.keyCode) {
                case 37: // left
                    if (settings.debug) { console.log('LEFT'); }
                    ev.preventDefault(); // prevent viewport scrolling
                    if (gotoPreviousSelectableDate('day')) {
                        updateViewOrRedraw();
                    }
                    break;
                case 39: // right
                    if (settings.debug) { console.log('RIGHT'); }
                    ev.preventDefault(); // prevent viewport scrolling
                    if (gotoNextSelectableDate('day')) {
                        updateViewOrRedraw();
                    }
                    break;
                case 38: // up
                    if (settings.debug) { console.log('UP'); }
                    ev.preventDefault(); // prevent viewport scrolling
                    if (gotoPreviousSelectableDate('week')) {
                        updateViewOrRedraw();
                    }
                    break;
                case 40: // down
                    if (settings.debug) { console.log('DOWN'); }
                    ev.preventDefault(); // prevent viewport scrolling
                    if (gotoNextSelectableDate('week')) {
                        updateViewOrRedraw();
                    }
                    break;
                case 27: // escape
                    if (settings.debug) { console.log('ESCAPE'); }
                    ev.preventDefault();
                    hideContainer();
                    $elements.input.focus();
                    break;
                default:
                    break;
            }
        }

        function handleInputElementPointerUp(ev) {
            var parsed_date = parseDate($elements.input.val());
            if (isValidDate(parsed_date)) {
                $elements.input.removeClass(settings.cssClasses.inputInvalid);
            } else {
                $elements.input.addClass(settings.cssClasses.inputInvalid);
            }
        }

        function handleInputElementKeydown(ev) {
            if (ev.keyCode === 13) { // enter
                if (settings.debug) { console.log('RETURN'); }
                ev.preventDefault(); // otherwise the focusSelectedDate() would close the dialog again ;-)
                toggleContainer();
                focusSelectedDate();
            }
        }

        function handleInputElementChange(ev) {
            var parsed_date = parseDate($elements.input.val());
            if (!setDate(parsed_date)) {
                resetInputElementDate(getCurrentDate());
            }
            updateViewOrRedraw();
        }

        function updateViewOrRedraw() {
            if ($elements.container.find("[data-ymd='"+getSelectedDate().format('YYYYMMDD')+"']").length < 1) {
                redraw();
            } else {
                updateView();
            }
        }

        function redraw() {
            if (isVisible()) {
                showContainer();
            } else {
                hideContainer();
            }
        }

        function updateView() {
            highlightToday();
            highlightCurrentDate();
            focusSelectedDate();
            highlightInputElement();
        }

        function gotoPreviousSelectableDate(period) {
            var prev = moment(getSelectedDate());
            period = period || 'day';
            do {
                // TODO this should jump of disabled week ends etc by decreasing the unit etc.
                if (settings.isRTL && period === 'day') {
                    prev.add(1, period);
                } else {
                    prev.subtract(1, period);
                }
            } while (isDisabled(prev) && prev.isAfter(settings.constraints.minDate));

            if (isValidDate(prev)) {
                return selectDay(prev);
            }

            return false;
        }

        function gotoNextSelectableDate(period) {
            var next = moment(getSelectedDate());
            period = period || 'day';
            do {
                // TODO this should jump of disabled week ends etc by increasing the unit etc.
                if (settings.isRTL && period === 'day') {
                    next.subtract(1, period);
                } else {
                    next.add(1, period);
                }
            } while (isDisabled(next) && next.isBefore(settings.constraints.maxDate));

            if (isValidDate(next)) {
                return selectDay(next);
            }

            return false;
        }

        function toggleContainer() {
            setVisible(!isVisible());
            if (isVisible()) {
                showContainer();
            } else {
                hideContainer();
            }
        }

        function showContainer() {
            unbindContainerEventHandlers();
            draw();
            bindContainerEventHandlers();
            updateView();
            $elements.container.show().addClass(settings.cssClasses.isVisible);
            setVisible(true);
        }

        function hideContainer() {
            unbindContainerEventHandlers();
            $elements.container.hide().removeClass(settings.cssClasses.isVisible);
            setVisible(false);
        }

        function highlightInputElement() {
            if (isValidDate(getCurrentDate())) {
                $elements.input.removeClass(settings.cssClasses.inputInvalid);
            } else {
                $elements.input.addClass(settings.cssClasses.inputInvalid);
            }
        }

        function highlightToday() {
            var ymd = moment().format('YYYYMMDD');
            $elements.container.find('.'+settings.cssClasses.isToday).removeClass(settings.cssClasses.isToday);
            $elements.container.find("[data-ymd='"+ymd+"']").addClass(settings.cssClasses.isToday);
        }

        function highlightCurrentDate() {
            var ymd = moment(getCurrentDate()).format('YYYYMMDD');
            $elements.container.find('.'+settings.cssClasses.isCurrent).removeClass(settings.cssClasses.isCurrent);
            $elements.container.find("[data-ymd='"+ymd+"']").addClass(settings.cssClasses.isCurrent);
        }

        function blurSelectedDate() {
            $elements.container.find('.'+settings.cssClasses.isSelected).removeClass(settings.cssClasses.isSelected);
        }

        function focusSelectedDate() {
            blurSelectedDate();
            var ymd = moment(getSelectedDate()).format('YYYYMMDD');
            $elements.container.find("[data-ymd='"+ymd+"']").addClass(settings.cssClasses.isSelected);
            // TODO must be the button in the calendar view that was actually triggered
            $elements.container.find("[data-ymd='"+ymd+"']").first().find('button').focus();
        }

        function selectToday() {
            if (setDay(moment())) {
                if (settings.hideOnSelect) {
                    hideContainer();
                    $elements.input.focus();
                } else {
                    updateViewOrRedraw();
                }
                return true;
            } else {
                if (settings.debug) { console.log('Seems today is not a valid date?'); }
            }
            return false;
        }

        function setDay(date) {
            var parsed_date = parseDay(date);
            if (isValidDate(parsed_date)) {
                setSelectedDate(parsed_date);
                setCurrentDate(parsed_date);
                return true;
            }
            return false;
        }

        function setDate(date) {
            var parsed_date = parseDate(date);
            if (isValidDate(parsed_date)) {
                setSelectedDate(parsed_date);
                setCurrentDate(parsed_date);
            }
            return false;
        }

        function selectDay(date) {
            return selectDate(parseDay(date));
        }

        function selectDate(date) {
            var parsed_date = parseDate(date);
            if (isValidDate(parsed_date)) {
                setSelectedDate(parsed_date);
                return true;
            }
            return false;
        }

        function setSelectedDate(date) {
            if (isValidDate(date)) {
                if (settings.debug) { console.log('selectedDate is now: '+date.toISOString()); }
                state.selectedDate = moment(date);
                return true;
            }
            return false;
        }

        function setCurrentDate(date) {
            if (isValidDate(date)) {
                if (settings.debug) { console.log('currentDate is now: '+date.toISOString()); }
                state.currentDate = moment(date);
                setOutputElementDate(date);
                setInputElementDate(date);
                return true;
            } else {
                if (settings.debug) { console.log('resetting from setCurrentDate as date is invalid: '+date.toISOString()); }
                resetInputElementDate(getCurrentDate());
                return false;
            }
        }

        function getSelectedDate() {
            return state.selectedDate;
        }

        function getCurrentDate() {
            return state.currentDate;
        }

        function setVisible(flag) {
            return state.isVisible = flag;
        }

        function isVisible() {
            return state.isVisible;
        }

        function isWeekend(valid_moment) {
            var m = moment(valid_moment).locale(settings.locale);
            return (settings.weekendDays.indexOf(m.day()) !== -1);
        }

        function setOutputElementDate(valid_moment) {
            $elements.output.val(
                //moment(valid_moment).utc().format(settings.outputFormat)
                moment(valid_moment).toISOString()
            );
        }

        function setInputElementDate(valid_moment) {
            $elements.input.val(
                moment(valid_moment).local().format(settings.displayFormat)
            );
        }

        // set input element value to the last known valid date
        function resetInputElementDate(date) {
            var parsed_date = parseDate(date || $elements.output.val());
            if (isValidDate(parsed_date)) {
                $elements.input.val(parsed_date.format(settings.displayFormat));
                $elements.input.removeClass(settings.cssClasses.inputInvalid);
            } else {
                $elements.input.addClass(settings.cssClasses.inputInvalid);
                throw new Error('Output element contains an invalid moment: ' + m);
            }
        }

        function draw() {
            var template_data = prepareCalendar();
            $elements.container.html(
                settings.templates.containerContent(template_data)
            );
        }

        function prepareCalendar(date) {
            var idx;

            // TODO use current date when selected date is far away and reopening picker wouldn't show the current date?
            var date = getSelectedDate() || getCurrentDate();

            var nom = settings.numberOfMonths.before + settings.numberOfMonths.after + 1;

            var css = settings.cssClasses.calendarsSingle;
            if (nom > 1) {
                css = settings.cssClasses.calendarsMultiple;
            }

            var calendar_data = {
                settings: settings,
                localeData: date.localeData(),
                currentDate: getCurrentDate(),
                selectedDate: getSelectedDate(),
                i18n: settings.i18n[settings.locale] || 'en',
                css: css,
                numberOfMonths: nom,
                calendars: []
            };

            // render N previous months
            for (idx = settings.numberOfMonths.before; idx > 0; idx--) {
                calendar_data.calendars.push(prepareCalendarMonth(moment(date).subtract(idx, 'months')));
            }

            // render currently selected month
            calendar_data.calendars.push(prepareCalendarMonth(date));

            // render N next months
            for (idx = 1; idx <= settings.numberOfMonths.after; idx++) {
                calendar_data.calendars.push(prepareCalendarMonth(moment(date).add(idx, 'months')));
            }

            return calendar_data;
        }

        function prepareCalendarMonth(date) {
            date = moment(date).startOf('month'); // clone just in case someone modifies the date while rendering
            return {
                header: prepareHeader(date),
                footer: prepareFooter(date),
                weekdays: prepareWeekdays(date),
                weeks: prepareWeeks(date),
                currentMonth: date
            };
        }

        function prepareHeader(date) {
            var header_data = {
                date: moment(date),
                year: date.format('YYYY'),
                month: date.format('MMMM'),
                content: date.format('MMMM YYYY')
            };

            // optionally use a compiled template for the content property
            if (settings.templates.calendarHeader && _.isFunction(settings.templates.calendarHeader)) {
                header_data.content = settings.templates.calendarHeader(header_data);
            }

            return header_data;
        }

        function prepareFooter(date) {
            var footer_data = {
                date: moment(date),
                year: date.format('YYYY'),
                month: date.format('MMMM'),
                title: date.format('MMMM YYYY'),
                content: ''
            };

            // optionally use a compiled template for the content property
            if (settings.templates.calendarFooter && _.isFunction(settings.templates.calendarFooter)) {
                footer_data.content = settings.templates.calendarFooter(footer_data);
            }

            return footer_data;
        }

        function prepareWeekdays(date) {
            var weekdays_data = [];
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
                    css: css_classes
                };

                // optionally use a compiled template for the content property
                if (settings.templates.calendarWeekday && _.isFunction(settings.templates.calendarWeekday)) {
                    weekday_data.content = settings.templates.calendarWeekday(weekday_data);
                }

                weekdays_data.push(weekday_data);
            }

            /* unneccessary when container element has html attribute dir="rtl" set
            if (settings.isRTL) {
                weekdays_data.reverse();
            }*/

            return weekdays_data;
        }

        function prepareWeeks(date) {
            date = moment(date);
            var weeks_data = [];
            var days_per_week = 7;
            var today = moment();
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
            var day_valid = true;
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
                        date: moment(render_date),
                        num: render_date.week(),
                        nameMin: render_date.format('WW'),
                        nameLong: render_date.format('['+settings.i18n[settings.locale].week+'] W'),
                        nameLongYear: render_date.format('['+settings.i18n[settings.locale].week+'] W YYYY'),
                        content: render_date.format('WW'),
                        days: []
                    };
                }

                day_valid = true;
                day_content = render_date.date();

                // css for one calendar day
                day_css = settings.cssClasses.day || '';
                if (isWeekend(render_date)) {
                    day_css += ' ' + settings.cssClasses.weekend;
                }
                if (idx < days_before) {
                    day_css += ' ' + settings.cssClasses.dayPrevMonth;
                } else if (idx >= (days_before + days_in_month)) {
                    day_css += ' ' + settings.cssClasses.dayNextMonth;
                }
                if (isDisabled(render_date)) {
                    day_css += ' ' + settings.cssClasses.isDisabled;
                    day_valid = false;
                }
                /*
                if (today.isSame(render_date, 'day')) {
                    day_css += ' ' + settings.cssClasses.isToday;
                }*/
                /*
                if (render_date.isSame(getSelectedDate(), 'day')) {
                    day_css += ' ' + settings.cssClasses.isSelected;
                }
                if (render_date.isSame(getCurrentDate(), 'day')) {
                    day_css += ' ' + settings.cssClasses.isCurrent;
                }*/

                // data for one calendar day
                day_data = {
                    css: day_css,
                    date: moment(render_date),
                    isoDate: render_date.toISOString(),
                    ymd: moment(render_date).format('YYYYMMDD'),
                    dayValid: day_valid,
                    content: day_content
                };

                // optionally use a compiled template for the content property
                if (settings.templates.calendarDay && _.isFunction(settings.templates.calendarDay)) {
                    day_data.content = settings.templates.calendarDay(day_data);
                }

                // add day_data to current week's data
                week_data.days.push(day_data);

                // add whole week's data to weeks_data array
                if (week_data.days.length === days_per_week) {
                    if (settings.templates.calendarWeek && _.isFunction(settings.templates.calendarWeek)) {
                        week_data.content = settings.templates.calendarWeek(week_data);
                    }
                    weeks_data.push(week_data);
                }

                // advance one day
                render_date.add(1, 'day');
            }

            /* unneccessary when html or container element has attribute dir="rtl" set
            if (settings.isRTL) {
                _.forEach(weeks_data, function(week_data, index, collection) {
                    week_data.days.reverse();
                });
            }*/

            if (settings.debug) { console.log('weeks_data=', weeks_data); }

            return weeks_data;
        }

        function isValidDate(date) {
            if (!date || !moment.isMoment(date) || (moment.isMoment(date) && !date.isValid())) {
                return false;
            }
            return !isDisabled(date);
        }

        function isDisabled(date) {
            var min_date = moment(settings.constraints.minDate).subtract(1, 'millisecond');
            var max_date = moment(settings.constraints.maxDate).add(1, 'millisecond');

            if (!date.isBetween(min_date, max_date)) {
                return true;
            }

            if (settings.disableWeekends && isWeekend(date)) {
                return true;
            }

            /*
            _.forEach(settings.disabledDates, function(value, index, collection) {
                if (_.isFunction(value)) {
                    if (value(moment(date)) === true) {
                        return true;
                    }
                } else if (value.isSame(date, 'day')) {
                    return true;
                }
            });
            */

            return false;
        }

        function updateElements() {
            $elements.trigger = $(settings.triggerElement);
            $elements.input = $(settings.inputElement);

            $elements.container = settings.containerElement ? $(settings.containerElement) : null;
            if (_.isNull($elements.container)) {
                $elements.container = $('<div>');
                $elements.container.attr('id', 'container'+settings.logPrefix);
                $elements.container.insertAfter($elements.input);
            }
            $elements.container.addClass(settings.cssClasses.container);

            $elements.output = $elements.input.clone();
            $elements.output.attr('id', $elements.output.attr('id') + settings.logPrefix);
            $elements.output.attr('type', 'search');
            $elements.output.insertBefore($elements.input);
            $elements.output.hide();
            $elements.input.removeAttr('name');

            bindEventHandlers();
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

            settings.hideOnSelect = !!settings.hideOnSelect;
            settings.disableWeekends = !!settings.disableWeekends;
            settings.debug = !!settings.debug;

            if (!_.isString(settings.direction) || (_.isString(settings.direction) && ['rtl', 'ltr'].indexOf(settings.direction) === -1)) {
                throw new Error('Setting direction must be "ltr" or "rtl". To render correctly try to set the "dir" attribute on the HTML element and provide it as the direction setting value.');
            }
            settings.isRTL = settings.direction === 'rtl' ? true : false;

            updateNumberOfMonths(settings.numberOfMonths);
            updateDateConstraints();
            compileTemplates();
        }

        function updateNumberOfMonths(nom) {
            nom = nom || 1;
            if (_.isNumber(nom) && !_.isNaN(nom)) {
                nom = Math.ceil(nom);
                if (nom > 0) {
                    settings.numberOfMonths = {
                        before: 0,
                        after: nom-1
                    };
                } else if (nom < 0) {
                    settings.numberOfMonths = {
                        before: Math.abs(nom),
                        after: 0
                    };
                } else {
                    settings.numberOfMonths = {
                        before: 0,
                        after: 0
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
        }

        function updateDateConstraints() {
            var min_date = parseDate(settings.constraints.minDate);
            var max_date = parseDate(settings.constraints.maxDate);

            var min_year = settings.constraints.minYear || default_settings.constraints.minYear;
            var min_month = settings.constraints.minMonth || default_settings.constraints.minMonth;

            var max_year = settings.constraints.maxYear || default_settings.constraints.maxYear;
            var max_month = settings.constraints.maxMonth || default_settings.constraints.maxMonth;

            if ((min_date.isValid() && max_date.isValid()) && max_date.isBefore(min_date)) {
                var temp = max_date.clone();
                max_date = min_date.clone();
                min_date = temp;
            }

            if (!_.isNumber(min_year) || !_.isNumber(max_year) || !_.isNumber(min_month) || !_.isNumber(max_month) ||
                _.isNaN(min_year) || _.isNaN(max_year) || _.isNaN(min_month) || _.isNaN(max_year)
            ) {
                throw new Error('Setting constraints.minYear/maxYear/minMonth/maxMonth must be positive integer values.');
            }

            if (!min_date.isValid()) {
                min_date = moment(min_year, 'YYYY', settings.locale, true);
                min_date.startOf('year').month(min_month);
            }

            if (!max_date.isValid()) {
                max_date = moment(max_year, 'YYYY', settings.locale, true);
                max_date.endOf('year').month(max_month);
            }

            settings.constraints = {
                minDate: min_date,
                maxDate: max_date
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

        function getDaysInMonth(moment_or_year, month) {
            if (moment.isMoment(moment_or_year)) {
                return moment_or_year.daysInMonth();
            }
            return moment(''+(+moment_or_year)+'-'+(+month), 'YYYY-MM').daysInMonth();
        }
    }; // end of constructor function
}));

