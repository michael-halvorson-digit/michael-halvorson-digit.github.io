var serialize = (function (slice) {
    return function (form) {
        //no form, no serialization
        if (form == null)
            return null;

        //get the form elements and convert to an array
        return slice.call(form.elements)
            .filter(function (element) {
                //remove disabled elements
                return !element.disabled;
            }).filter(function (element) {
                //remove unchecked checkboxes and radio buttons
                return !/^input$/i.test(element.tagName) || !/^(?:checkbox|radio)$/i.test(element.type) || element.checked;
            }).filter(function (element) {
                //remove <select multiple> elements with no values selected
                return !/^select$/i.test(element.tagName) || element.selectedOptions.length > 0;
            }).filter(function (element) {
                //remove empty name & value elemnts
                return !(element.name == '' && element.value == '');
            }).map(function (element) {
                switch (element.tagName.toLowerCase()) {
                    case 'checkbox':
                    case 'radio':
                        return {
                            name: element.name,
                            value: element.value === null ? 'on' : element.value
                        };
                    case 'select':
                        if (element.multiple) {
                            return {
                                name: element.name,
                                value: slice.call(element.selectedOptions)
                                    .map(function (option) {
                                        return option.value;
                                    })
                            };
                        }
                        return {
                            name: element.name,
                            value: element.value
                        };
                    default:
                        return {
                            name: element.name,
                            value: element.value || ''
                        };
                }
            });
    }
}(Array.prototype.slice));

function submit_handler(event) {
    var localClickProperties = window.trackingProperties;
    localClickProperties.formData = serialize(this);
    window.analytics.track('Submitted Waitlist Form', localClickProperties);
}

  // Add tracking to form links
Array.prototype.map.call(document.querySelectorAll('form'), function (a) {
    return a.addEventListener("submit", submit_handler);
});


//var waitlistForm = document.querySelectorAll('form');
//analytics.trackForm(waitlistForm, 'Submitted Waitlist Form');