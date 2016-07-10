import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import {first,without,findWhere} from 'underscore';

class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = Homestore.getState();
        this.onChange = this.onChange.bind(this);
    }

    compomnentMount(){
        HomeStore.listen(this.onChange);
        HomeActions.getTwoCharacters();
    }

    componentWillUnmount(){
        HomeStore.unlisten(this.onChange);
    }

    onChange(state){
        this.setState(state);
    }

    handleClick(character){
        var winner = character.characterId;
        var loser = first(without(this.state.characters,findWhere(this.state.characters,{characterId:winner}))).characterId;
        HomeAction.vote(winner,loser);
    }

    render(){
        var characterNodes = this.state.characters.map((character,index)=>{
            return (
                <div key={character.characterId} className={index===0?'col-xs-6 col-sm-6 col-md-offset-1':'col-xs-6 col-sm-6 col-md-5'}
                    <div className = 'thumbnail fadeInUp animated'>
                        <img onClick={this.handleClick.bind(this,character)} src={'http://image.eveonline.com/Character/'+character.characterId+'_512.jpg'}/>
                        <div className='caption text-center'>
                            <ul className = 'caption text-center'>
                                <li><strong>Race:<strong>{character.rece}</li>
                                <li><strong>Bloodline:<strong>{character.bloodline}<strong></li>
                            </ul>
                            <h4>
                                <Link to={'/characters/' + character.charaterId}><strong>
                            </h4>
                        </div>
                    </div>
                </div>
                );
        });

        return (
                <div className='container'>
                    <h3 className='text-center'></h3>
                    <div className='row'>
                        {characterNodes}
                    </div>
                <div>
               )
    }
}

export default Home;
