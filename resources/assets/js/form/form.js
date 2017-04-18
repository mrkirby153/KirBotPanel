window.FormErrors = function () {
    this.errors = {};

    /**
     * Determine if the collection has any errors.
     */
    this.hasErrors = function () {
        return !_.isEmpty(this.errors);
    };


    /**
     * Determine if the collection has errors for a given field.
     */
    this.has = function (field) {
        return _.indexOf(_.keys(this.errors), field) > -1;
    };


    /**
     * Get all of the raw errors for the collection.
     */
    this.all = function () {
        return this.errors;
    };


    /**
     * Get all of the errors for the collection in a flat array.
     */
    this.flatten = function () {
        return _.flatten(_.toArray(this.errors));
    };


    /**
     * Get the first error message for a given field.
     */
    this.get = function (field) {
        if (this.has(field)) {
            if (Array.isArray(this.errors[field]))
                return this.errors[field][0];
            else
                return this.errors[field];
        }
    };


    /**
     * Set the raw errors for the collection.
     */
    this.set = function (errors) {
        if (typeof errors === 'object') {
            this.errors = errors;
        } else {
            this.errors = {'field': ['Something went wrong. Please try again.']};
        }
    };


    /**
     * Forget all of the errors currently in the collection.
     */
    this.forget = function () {
        this.errors = {};
    };
};

window.Form = function (data) {
    var form = this;

    $.extend(this, data);

    this.errors = new FormErrors();
    this.busy = false;
    this.successful = false;

    this.start = function () {
        form.errors.forget();
        form.busy = true;
        form.successful = false;
    };

    this.finish = function () {
        form.busy = false;
        form.successful = true;
    };
};