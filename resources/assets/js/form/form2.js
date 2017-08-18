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
    }

    start() {
        this.errors.clearAll();
        this.busy = true;
        this.successful = false;
    }

    complete() {
        this.busy = false;
        this.successful = true;
    }

    submit(method, uri) {
        let form = this;
        return new Promise((resolve, reject) => {
            form.start();
            axios[method](uri, form).then(resp => {
                form.complete();
                resolve(resp);
            }).catch(error => {
                form.errors.record(error.response.data);
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

    all(){
        return this.errors;
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