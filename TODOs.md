# TODOs

- add year selection support (goto specific year, dropdown or similar)
    - input type number + datalist would be awesome, but is poorly supported in non-blink browsers
- add support for separate timezone offset input field
- add support for "modes" (date, time, datetime-local, datetime with timezone offset, week etc.)
    - add settings, templates and styles for those
    - add support for week selection as that's not implemented atm
- add support for html5 native input types (datetime-local…)
    - only when support is good
    - only on certain devices/breakpoints (hook?)
- add datalist support to input to have events of the currently selected month in a dropdown?
    - update datalist options when changing months
- cleanup scss/popup code and prevent scrolling on popup
- add inline popup without backdrop and position it depending on screen estate/position/size etc.
- add some demos (for sensible settings combinations)
- add ARIA support and test it somehow (add some more semantics anywhere?)
- add more docs and comments
- add (non-private) bower.json
- check different possibilities for template loading
    - from a DOM script element or via string works already
    - have localized templates?
- check API usefulness and missing capabilities
- check supplied events for usefulness and add/remove some as appropriate
- check for rendering alternatives to html(…) (ractivejs, react etc.)
    - performance testing and improvements (esp. with multiple months)
