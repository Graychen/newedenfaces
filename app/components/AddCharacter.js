import React from 'react';
import AddCharacterStore from '../stores/AddCharacterStore';
import AddCharacterAction from '../stores/AddCharacterAction';

class AddCharacter extends React.Component{
    constructor(props){
        super(props);
        this.state = AddCharacterStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        AddCharacterStore.listen(this.onChange);
    }

    componentWillUnmount(){
        AddCharacterStore.unlisten(this.onChange);
    }
    
    onChange(state){
        this.setState(state);
    }

    handleSubmit(event){
        event.preventDefault();

        var name = this.state.name.trim();
        var gender = this.state.gender;

        if(!name){
            AddCharacterActions.invalidName();
            this.refs.nameTextField.getDOMNode().focus();
        }

        if(!geneder){
            AddCharacterActions.invalidGender();
        }

        if(name && gender){
            AddCharacterAction.addCharacter(name,gender);
        }
    }

    render(){
        return(
                <div clasName='container'>
                    <div className='col-sm-8'>
                        <div className='panel panel-default'>
                         <div className='panel-body'>
                         <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className='form-group'>Character Name</label>
                                <label className='control-label'></label>
                                <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                                       onChange={AddCharacterAction.updateName} autoFocus />
                                <span className='help-block'>{this.state.helpBlock}</span>    
                            </div>
                            <div className='form-group' + this.state.genderValidationState>
                                <div className='redio radio-inline'>
                                    <input type='radio' name='gender' id='male' value='Male'
                                           checked={this.state.gender==='Male'}  
                                           onChange={AddCharacterActions.updateGender}/>
                                    <label htmlFor='male'>Male</span>    
                                </div>
                            </div>
                            <button type='submit' className='btn btn-primary'></button>

                         </form>
                        </div>
                    </div>
                </div>
              );
    }
}

export default AddCharacter;
