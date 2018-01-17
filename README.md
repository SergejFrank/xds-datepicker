# custom-datepicker
A lightweight JavaScript library for custom HTML `datepicker` creation and managing.
No dependencies needed.


## Demos
[Example](https://sergejfrank.github.io/xds-datepicker/)



## How it works

In HTML with the `script` tag:
```html
<script src="xds-datepicker.js" type="text/javascript"></script>
```

In HTML with the `link` tag:
```html
<link rel="stylesheet" href="xds-normalize.css" type="text/css" >
<link rel="stylesheet" href="xds-datepicker" type="text/css" >
```

Start with a simple HTML `<select>`:
```html
<input placeholder="select a Date" class="datepicker" name="date">
```

In HTML with the `script` tag:
```js
var xdsDatepicker = Datepicker(document.querySelector(".datepicker"));
```


### Configuration

In HTML with the `script` tag:
```js
var dateFormat = function(date){
    return date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
};

var options = {
    weekdays: ['So','Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okr','Nov','Dez'],
    startingWeekDay: 1,
    startDate: new Date("2018/2/16"),
    disabledWeekdays: [0,6],
    customDateFormat: dateFormat
};


var xdsDatepicker = Datepicker(document.querySelector(".datepicker"),options);
```

As the examples demonstrate above
xds-datepicker has many useful options:

* `weekdays` language defaults for weekday names `['So','Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']`
* `months` language defaults for month names `['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okr','Nov','Dez']`
* `startingWeekDay` first day of the week (0: Sunday, 1: Monday, etc)
* `startDate` the initial date to view when first opened
* `disabledWeekdays`  disallow selection of Saturdays or Sundays (0: Sunday, 1: Monday, etc)
* `customDateFormat`  the default output format for `.toString()` and `field` value
* `minDate` the minimum/earliest date that can be selected (this should be a native Date object - e.g. `new Date()` )
* `maxDate` the maximum/latest date that can be selected (this should be a native Date object - e.g. `new Date()`)