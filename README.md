#Onboarding

Define some basic functions 
Write a function to initialize the trigger
```js
//A trigger function which will start an emphasis if an element has not been clicked on within 5 seconds
function _timed_trigger (element, emphasis) {
    //Creates an array to allow for delayed checks on multiple elements.
    this.check = this.check || {};
    this.check[element] = this.check[element] || false;
    
    //If the triggered has already fired, we don't need to go further.
    if (this.check[element])
        return false;
    
    //Stop the trigger from triggering if the element is clicked on
    //And call the remove emphasis if it has started
    $(document).on('click', '#'+element, ()=> {
        console.log(this);
        //If the trigger is running, we want to stop the emphasis.
        if (this.check[element] === "started")
            this.remove_emphasis(element, emphasis);
        
        //The condition has been met, so we set this to true;
        this.check[element] = true;
    });

    //Check after 5 Seconds if the element has been clicked
    Meteor.setTimeout(() => {
        if (!this.check[element]) {
            //If the element has not been clicked run the callback for the trigger
            //This will trigger the emphasis
            this.start_emphasis(element, emphasis);

            this.check[element] = 'started';
        }
    }, 5000);

    //If a trigger function returns true it will start the emphasis immediately after running
    //So we return false to stop the chain.
    return false;
}

var emphasis = {};
//A simple emphasis that will pulse an element on start, and remove the pulse on stop
emphasis._pluse = {
    add: function (e) {
        $('#' + e).addClass('pulse animated infinite');
    },
    remove: function(e) {
        $('#' + e).removeClass('pulse animated infinite');
    }
};

//The initialization function for the element,
//this is how we tell the trigger to run.
function _element(){
    Template.upload.rendered = () => {
        this.run_trigger();
    }
}

_onboard = new Onboarding();
//We pass the name of the emphasis, this is how we will reference it in the element
//Then we pass the emphasis start function, and then the emphasis  stop function
_onboard.new_emphasis("emphasis_name", emphasis._pluse.add, emphasis._pluse.remove);

//We pass the trigger name, and then the trigger function,
_onboard.new_trigger("trigger_name", _timed_trigger);

//We pass the id of the element, the trigger, and the emphasis.
//Optionally we pass an initialization function (_element) to new element
//This function must start the trigger other wise the trigger will never initialize.
//If we leave this field empty the trigger will immediately initialize
_onboard.new_element("Rectangle_6", "trigger_name", "emphasis_name", _element);

_onboard.new_element("title", "trigger_name", "emphasis_name");
```
