# datetime-local-picker

Early goal was to use the HTML5 input types `dateime-local`, `date` and `time` for environments with disabled javascript (or failed loading due to network issues etc.). On that basis the usage of the native input types on e.g. mobile devices could be done with a fallback to custom styled calendars or list on bigger viewports or devices where native HTML5 input type support is bad. Turns out, that native HTML5 input types are badly supported (even on mobile) as they e.g. set random seconds when setting a time or they disallow users to set seconds (and milliseconds) at all. Additionally they tend to have a lack of GUI support for seconds and milliseconds even on desktop browsers. That's why this datepicker is suggested to be used on a plain ```input[type="text"]```. :\

## Dependencies

At the moment:

- requirejs
- momentjs
- jquery
- lodash (plus lodash-template-loader plugin)

## Usage

See [index.html](index.html) for the moment. Available settings can be seen in the ``default_settings`` on top of the [src/DatetimeLocalPicker.js](src/DatetimeLocalPicker.js) file. The public API can be found there too (or use the browser's console on the index page with ``foo.``).

## License

MIT - see [LICENSE file](LICENSE).

