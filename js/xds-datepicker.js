
function Datepicker(options) {

    var mod = function(n, m) {
        return ((n % m) + m) % m;
    };

    var isInRange = function (date) {
        return !((instance.minDate && date < instance.minDate) || (instance.maxDate && date > instance.maxDate));
    };

    var isDisabledWeekDay = function (date) {
        return instance.disabledWeekdays.indexOf(date.getDay())>=0;
    };

    var isSelectable = function (date) {
        return isInRange(date) && !isDisabledWeekDay(date)
    };

    var sanitizeOptions = function() {
        if(typeof options !== 'object'){
            throw new Error("\"options\" is needed.");
        }

        if(options.hasOwnProperty("weekdays") && options.weekdays.length !== 7){
            console.error("\"weekdays\" must be an array with 7 elements.");
            options.weekdays = false;
        }

        if(options.hasOwnProperty("months") && options.months.length !== 12){
            console.error("\"months\" must be an array with 12 elements.");
            options.months = false;
        }

        return options;
    };

    var updateCal = function () {
        [].forEach.call(instance.calenders, function(cal) {
            cal.monthYear.textContent = instance.months[instance.startDate.getMonth()]+" "+instance.startDate.getFullYear();
            createTableHead(cal);
            createDays(cal);
            changeSelectedDate(cal.date,cal);
        });
    };


    var createTableHead = function(cal){
        cal.tableHead.innerHTML = "";
        [].forEach.call(instance.weekdays, function(day) {
            var th = document.createElement("div");
            th.classList.add("th");
            th.textContent = day;
            cal.tableHead.appendChild(th);
        });
    };

    var changeMonth = function (interval) {
        var newDate = new Date(instance.startDate.valueOf());
        newDate.setMonth(instance.startDate.getMonth()+interval);

        if(!isInRange(newDate)){
            return
        }

        instance.startDate = newDate;
        updateCal();
    };


    var createDays = function(cal){
        cal.tableBody.innerHTML = "";
        var dateIterator = new Date(instance.startDate.getFullYear() + "/" + (instance.startDate.getMonth()+1) + "-01");
        var skipDays = mod((dateIterator.getDay()-instance.startingWeekDay),7);


        var dayCount = 1;
        var tr = null;
        var sameMonth = true;

        do {
            //new row for every week;
            if(dayCount%7 === 1){
                tr = document.createElement("div");
                tr.classList.add("tr");
                cal.tableBody.appendChild(tr);
            }
            var td = document.createElement("div");
            td.classList.add("disabled");
            td.classList.add("td");

            //start at first weekday of Month
            if(dayCount>skipDays && sameMonth){

                //get day with leading zero
                td.textContent = ("0"+dateIterator.getDate()).slice(-2);

                td.setAttribute("data-value",dateIterator.toDateString());

                // check if day is selectable
                if(isSelectable(dateIterator)){
                    td.classList.remove("disabled");
                }

                // check if current value is today
                var now = new Date();
                now.setHours(0,0,0,0);
                if(now.valueOf() === dateIterator.valueOf()){
                    td.classList.add("today");
                }

                // add click listener to change date
                td.addEventListener("click",function () {
                    if(this.classList.contains("disabled")) return;
                    var val = this.getAttribute("data-value");
                    changeSelectedDate(new Date(val),cal);
                    addClasses();
                });

                dateIterator.setDate(dateIterator.getDate() + 1);
            }
            tr.appendChild(td);
            dayCount++;
            sameMonth = dateIterator.getMonth() === instance.startDate.getMonth();
        }
        while (sameMonth || !(dayCount%7 === 1));
    };

    var bothRangesSelected = function () {
        return instance.calenders[0].date instanceof Date && instance.calenders[1] && instance.calenders[1].date instanceof Date;
    };

    var addClasses = function () {

        [].forEach.call(instance.calenders,function (cal) {
            var tds = cal.tableBody.querySelectorAll('.td');

            [].forEach.call(tds, function(td) {
                td.classList.remove("selected");
                td.classList.remove("range");

                var dateVal = td.getAttribute("data-value");
                var tmpDate = new Date(dateVal);

                // check if current value is selected value
                if((instance.calenders[0].date && instance.calenders[0].date.valueOf() === tmpDate.valueOf()) || (instance.calenders[1] && instance.calenders[1].date && instance.calenders[1].date.valueOf() === tmpDate.valueOf())){
                    td.classList.add("selected");
                }

                if(cal == instance.calenders[0] &&  instance.calenders[1] && instance.calenders[1].date && tmpDate > instance.calenders[1].date ){
                    td.classList.add("disabled");
                }

                if(cal == instance.calenders[1] && tmpDate < instance.calenders[0].date ){
                    td.classList.add("disabled");
                }

                if(bothRangesSelected() && instance.calenders[0].date < tmpDate && instance.calenders[1].date > tmpDate){
                    td.classList.add("range");
                }
            });
        });

    };

    var changeSelectedDate = function(date,cal){
        cal.date = date;

        var val = "";
        cal.inputFieldValue.classList.add("placeholder");

        if(date instanceof Date){
            val = date.toDateString();
            if(instance.toString){
                val = instance.toString(date);
            }
            cal.inputFieldValue.classList.remove("placeholder");
        }

        cal.input.value = val;
        cal.inputFieldValue.innerText = val || instance.placeholder;

        addClasses();
    };


    var defaults = {
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        classes: {
            wrapper: "xds-datepicker",
            calendar: "xds-calendar",
            header: "header",
            leftButton: "left",
            rightButton: "right",
            button: "button",
            inputField: "xds-datepicker-input",
            inputFieldIcon: "xds-datepicker-icon",
            monthYear: "month-year"
        }
    };


    var instance = {
        weekdays: options.weekdays || defaults.weekdays,
        months: options.months || defaults.months,
        startDate: options.startDate || new Date(),
        selectedDate: options.selectedDate || null,
        classes: defaults.classes,
        startingWeekDay: options.startingWeekDay || 0,
        input: options.elem || null,
        calenders: [],
        disabledWeekdays: options.disabledWeekdays || [],
        changeMonth: changeMonth,
        toString: options.customDateFormat || false,
        minDate: options.minDate || false,
        maxDate: options.maxDate || false,
        placeholder: options.placeholder || "Select date",
        range: options.range || false,
    };

    options = sanitizeOptions();


    var createCal = function () {
        var cal = {
            wrapper: document.createElement('div'),
            calendar: document.createElement('div'),
            header: document.createElement('div'),
            leftButton: document.createElement('span'),
            rightButton: document.createElement('span'),
            monthYear: document.createElement('span'),
            table: document.createElement('div'),
            tableHead: document.createElement('div'),
            tableBody: document.createElement('div'),
            inputField: document.createElement('div'),
            inputFieldValue: document.createElement('span'),
            inputFieldIcon: document.createElement('div'),
            close: function () {this.wrapper.classList.remove("open")},
            date: null,
            input: null,
        };

        cal.wrapper.classList.add(instance.classes.wrapper);
        cal.calendar.classList.add(instance.classes.calendar);
        cal.inputField.classList.add(instance.classes.inputField);
        cal.inputFieldIcon.classList.add(instance.classes.inputFieldIcon);


        cal.header.classList.add(instance.classes.header);
        cal.leftButton.classList.add(instance.classes.leftButton);
        cal.leftButton.classList.add(instance.classes.button);
        cal.rightButton.classList.add(instance.classes.rightButton);
        cal.rightButton.classList.add(instance.classes.button);
        cal.monthYear.classList.add(instance.classes.monthYear);
        cal.table.classList.add("table");
        cal.tableHead.classList.add("tableHead");
        cal.tableBody.classList.add("tableBody");

        cal.wrapper.appendChild(cal.inputField);
        cal.wrapper.appendChild(cal.calendar);
        cal.inputField.appendChild(cal.inputFieldValue);
        cal.inputField.appendChild(cal.inputFieldIcon);
        cal.calendar.appendChild(cal.header);
        cal.header.appendChild(cal.leftButton);
        cal.header.appendChild(cal.rightButton);
        cal.header.appendChild(cal.monthYear);
        cal.calendar.appendChild(cal.table);
        cal.table.appendChild(cal.tableHead);
        cal.table.appendChild(cal.tableBody);

        cal.leftButton.addEventListener('click', function () {
            changeMonth(-1);
        });

        cal.rightButton.addEventListener('click', function () {
            instance.changeMonth(1);
        });

        cal.inputFieldIcon.addEventListener('click', function () {
            cal.wrapper.classList.toggle("open");
        });

        // close xds-datepicker if clicked outside
        window.addEventListener('click', function (e) {
            if (!cal.wrapper.contains(e.target)) {
                cal.close();
            }
        });

        return cal
    }

    var initialize = function () {

        for(var i = 0; i<instance.startingWeekDay; i++){
            var tmp = instance.weekdays.shift();
            instance.weekdays.push(tmp);
        }

        instance.calenders.push(createCal());


        if(instance.range){
            instance.calenders.push(createCal());
            instance.selectedDate = null;

            instance.range.start.parentNode.insertBefore(instance.calenders[0].wrapper, instance.range.start.nextSibling);
            instance.calenders[0].input = instance.range.start;
            instance.range.start.style.display = 'none';

            instance.range.end.parentNode.insertBefore(instance.calenders[1].wrapper, instance.range.end.nextSibling);
            instance.calenders[1].input = instance.range.end;
            instance.range.end.style.display = 'none';
        }else{
            instance.input.parentNode.insertBefore(instance.calenders[0].wrapper, instance.input.nextSibling);
            instance.calenders[0].input = instance.input;
            instance.input.style.display = 'none';
        }

        updateCal();

    };

    initialize();

    return instance;
}
