export class Form {

    constructor(method, uri, data) {
        for (let field in data) {
            this[field] = data[field];
        }
        this.errors = new FormErrors();

        this.busy = false;
        this.successful = false;
        this.method = method.toLowerCase();
        this.uri = uri;
        this.timer = 0;
        this.initialState = data;
    }

    start() {
        clearTimeout(this.timer);
        this.errors.clearAll();
        this.busy = true;
        this.successful = false;
    }

    reset() {
        this.errors.clearAll();
        this.busy = false;
        this.successful = false;
        for (let field in this.initialState) {
            if (this.hasOwnProperty(field)) {
                this[field] = this.initialState[field];
            }
        }
    }

    updateInitialState() {
        let obj = {};
        for (let field in this.initialState) {
            obj[field] = this[field];
        }
        this.initialState = obj;
    }

    complete() {
        this.busy = false;
        this.successful = true;
        let vm = this;
        this.timer = setTimeout(() => {
            vm.successful = false;
        }, 2500)
    }

    submit(method, uri) {
        let form = this;
        if(this.busy) {
            console.warn("Attempting to submit a form that's already submitting");
            return;
        }
        return new Promise((resolve, reject) => {
            form.start();
            axios[method](uri, form).then(resp => {
                form.complete();
                resolve(resp);
            }).catch(error => {
                form.errors.record(error.response.data.errors);
                form.busy = false;
                reject(error);
            })
        })
    }

    save() {
        return this.submit(this.method, this.uri);
    }

    post(uri) {
        return this.submit('post', uri)
    }

    put(uri) {
        return this.submit('put', uri)
    }

    patch(uri) {
        return this.submit('patch', uri)
    }

    del(uri) {
        return this.submit('delete', uri)
    }
}

class FormErrors {
    constructor() {
        this.errors = {};
    }

    get(error) {
        if (this.errors[error])
            return this.errors[error][0];
    }

    record(errors) {
        this.errors = errors;
    }

    has(error) {
        return _.indexOf(_.keys(this.errors), error) > -1;
    }

    hasErrors() {
        return !_.isEmpty(this.errors);
    }

    all() {
        return this.errors
    }

    clear(error) {
        delete this.errors[error]
    }

    clearAll() {
        this.errors = {}
    }
}

export default Form;

window.Form = Form;