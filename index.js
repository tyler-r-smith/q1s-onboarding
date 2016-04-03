class _Event {
    constructor(name, run, callback) {
        this.name = name;
        this.run  = run;
        this.callback = callback;
    }
    execute() {
        if (typeof this.callback === 'function') {
            var _run = this.run.apply(this, arguments);
            if (Array.isArray(_run))
                this.callback.apply(this, _run);
            else
                this.callback(_run);
        }
        else
            return this.run.apply(this, arguments);
    }
}

class Emphasis extends _Event {
    constructor(name, run, remove, callback, elements){
        super(name, run, callback);
        this.elements = (Array.isArray(elements)) ? elements : [elements];
        this.remove = remove;
        this.elements = [];
    }
    hard_remove_emphasis() {
        for (var n = this.elements.length -1; n < 0; n--) {
            if (typeof this.elements[n] === 'string') {
                var element = document.getElementById(this.elements[n]);
                if (typeof element === "object")
                    element.parentNode.removeChild(element);
            }
        }
    }
}

class Trigger extends _Event {
    constructor(name, run, callback, remove) {
        super(name, run, callback);
        this.remove_emphasis = remove;
    }

    execute(element, emphasis) {
        var _run = this.run(element, emphasis);
        if (_run !== false)
            this.callback(element, emphasis);
    }
    
    start_emphasis(element, emphasis){
        this.callback(element, emphasis)
    }
}

class Element extends _Event {
    constructor(name, run, emphasis, callback){
        super(name, run, callback);
        this.emphasis = emphasis;
    }

    run_trigger(){
        this.callback(true);
    }
}

class Onboarding {
    constructor (){
        this.emphases = {};
        this.triggers = {};
        this.elements = {};
    }
    new_emphasis(name, run, remove, callback, elements) {
        this.emphases[name] = new Emphasis(name, run, remove, callback, elements);
    }
    new_trigger(name, run) {
        this.triggers[name] = new Trigger(name, run, (element, emphasis) => {
            if (typeof element === 'string' && typeof emphasis === 'string')
                this.emphases[emphasis].execute(element);
        }, (element, emphasis) => {
            this.emphases[emphasis].remove(element);
        });
    }
    new_element(element_id, trigger, emphasis, initialize) {
        let start = (typeof initialize === 'function') ? false : true;
        this.elements[element_id] =  new Element(element_id, initialize, emphasis, (e) =>{
            if (e)
               this.triggers[trigger].execute(element_id, emphasis);
        });
        if (start) {
            this.elements[element_id].run_trigger();
        } else {
            this.elements[element_id].execute();
        }
    }

    get emphases_names() {
        var arg = [];
        for (var n in this.emphases) {
            arg.push(n);
        }
        return arg
    }
}

module.exports = {
  Onboarding: Onboarding
}