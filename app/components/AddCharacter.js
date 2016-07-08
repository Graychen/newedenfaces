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
                            <div className=''>
                         </form>
                        </div>
                    </div>
                </div>
              );
    }
}

