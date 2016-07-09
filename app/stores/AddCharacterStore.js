import alt from '../alt';
import AddCharacterAction from '../actions/AddCharacterActions';

class AddCharacterStore{
    constructor(){
        this.bindActions(AddCharacterAction);
        this.name='';
        this.gender='';
        this.helpBlock='';
        this.nameValidationsState='';
        this.genderValidtionsState='';
    }

    onAddCharacterSuccess(){
        this.nameValidationState = 'has-success'; 
        this.helpBlock = successMessage;
    }

    onAddCharacterFail(errorMessage){
        this.nameValidationState = 'has-error'; 
        this.helpBlock = errorMessage;
    }

    onUpdateName(event){
        this.name = event.target.value;
        this.nameValidationState = '';
        this.helpBlock = '';
    }
    
    onUpdateGender(event){
        this.gender = event.target.value;
        this.genderValidationState = '';
    }

    onInvalidName(){
        this.nameValidationState = 'has-error';
        this.helpBlock = 'Please enter a character';
    }

    onInvalidGender(){
        this.genderValidationState = 'has-error';
    }
}

export default alt.createStore(AddCharacterStore);
