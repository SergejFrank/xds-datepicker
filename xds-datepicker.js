
function Datepicker(elem, options) {

    var mod = function(n, m) {
        return ((n % m) + m) % m;
    };

    var sanitizeOptions = function() {
        if(typeof options !== 'object'){
            return {}
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
        instance.cal.monthYear.textContent = instance.months[instance.startDate.getMonth()]+" "+instance.startDate.getFullYear();
        createTableHead();
        createDays();
    };


    var createTableHead = function(){
        instance.cal.tableHead.innerHTML = "";
        [].forEach.call(instance.weekdays, function(day) {
            var th = document.createElement("th");
            th.textContent = day;
            instance.cal.tableHead.appendChild(th);
        });
    };


    var createDays = function(){
        instance.cal.tableBody.innerHTML = "";
        var dateIterator = new Date(instance.startDate.getFullYear() + "/" + (instance.startDate.getMonth()+1) + "-01");
        var skipDays = mod((dateIterator.getDay()-instance.startingWeekDay),7);


        var dayCount = 1;
        var tr = null;
        var sameMonth = true;

        do {
            //new row for every week;
            if(dayCount%7 === 1){
                tr = document.createElement("tr");
                instance.cal.tableBody.appendChild(tr);
            }
            var td = document.createElement("td");

            //start at first weekday of Month
            if(dayCount>skipDays && sameMonth){
                td.textContent = dateIterator.getDate();

                td.setAttribute("data-value",dateIterator.toDateString());

                // check if weekday is disabled
                if(instance.disabledWeekdays.indexOf(dateIterator.getDay())>=0){
                    td.classList.add("disabled");
                }

                // check if current value is selected value
                if(instance.selectedDate.valueOf() === dateIterator.valueOf()){
                    td.classList.add("selected");
                }

                // add click listener to change date
                td.addEventListener("click",function () {
                    if(this.classList.contains("disabled")) return;
                    var val = this.getAttribute("data-value");
                    instance.changeSelectedDate(new Date(val));
                });

                dateIterator.setDate(dateIterator.getDate() + 1);
            }
            tr.appendChild(td);
            dayCount++;
            sameMonth = dateIterator.getMonth() === instance.startDate.getMonth();
        }
        while (sameMonth || !(dayCount%7 === 1));
    };


    var changeSelectedDate = function(date){
        instance.selectedDate = date;
        var val = date.toDateString();
        if(instance.toString){
            val = instance.toString(date);
        }
        instance.input.value = val;
        updateCal();
    };


    var defaults = {
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['January','February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        classes: {
            wrapper: "xds-calendar",
            header: "header",
            leftButton: "left",
            rightButton: "right",
            button: "button",
            monthYear: "month-year"
        }
    };


    var instance = {
        weekdays: options.weekdays || defaults.weekdays,
        months: options.months || defaults.months,
        startDate: options.startDate || new Date(),
        selectedDate: options.selectedDate || new Date(options.startDate.getTime()) || new Date(),
        classes: defaults.classes,
        startingWeekDay: options.startingWeekDay || 0,
        input: elem,
        cal: null,
        disabledWeekdays: options.disabledWeekdays || [],
        changeSelectedDate: changeSelectedDate,
        toString: options.customDateFormat || false
    };

    options = sanitizeOptions();


    var initialize = function () {
        instance.cal = {
            wrapper: document.createElement('div'),
            header: document.createElement('div'),
            leftButton: document.createElement('span'),
            rightButton: document.createElement('span'),
            monthYear: document.createElement('span'),
            table: document.createElement('table'),
            tableHead: document.createElement('thead'),
            tableBody: document.createElement('tbody')
        };

        instance.cal.wrapper.classList.add(instance.classes.wrapper);
        instance.cal.header.classList.add(instance.classes.header);
        instance.cal.leftButton.classList.add(instance.classes.leftButton);
        instance.cal.leftButton.classList.add(instance.classes.button);
        instance.cal.leftButton.innerHTML = "&lang;";
        instance.cal.rightButton.classList.add(instance.classes.rightButton);
        instance.cal.rightButton.classList.add(instance.classes.button);
        instance.cal.rightButton.innerHTML = "&rang;";
        instance.cal.monthYear.classList.add(instance.classes.monthYear);

        instance.cal.wrapper.appendChild(instance.cal.header);
        instance.cal.header.appendChild(instance.cal.leftButton);
        instance.cal.header.appendChild(instance.cal.rightButton);
        instance.cal.header.appendChild(instance.cal.monthYear);
        instance.cal.wrapper.appendChild(instance.cal.table);
        instance.cal.table.appendChild(instance.cal.tableHead);
        instance.cal.table.appendChild(instance.cal.tableBody);

        instance.cal.leftButton.addEventListener('click', function () {
            instance.startDate.setMonth(instance.startDate.getMonth()-1);
            updateCal();
        });

        instance.cal.rightButton.addEventListener('click', function () {
            instance.startDate.setMonth(instance.startDate.getMonth()+1);
            updateCal();
        });

        //insert after input
        instance.input.parentNode.insertBefore(instance.cal.wrapper, instance.input.nextSibling);

        console.log(instance.startingWeekDay);
        for(var i = 0; i<instance.startingWeekDay; i++){
            var tmp = instance.weekdays.shift();
            instance.weekdays.push(tmp);
        }

        instance.changeSelectedDate(instance.selectedDate);
    };

    initialize();

    return instance;
}
