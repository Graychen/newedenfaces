import React form 'react';
import {Link} from 'react-router';
import FooterStore from '../stores/FooterStore'
import FooterActions from '../actions/FooterActions';

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = FooterStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        FooterStore.listen(this.onChange);
        FooterActions.getTopCharacters();
    }

    componentWillmount(){
        FooterStore.unlisten(this.onChange);
    }

    onChange(state){
        this.setState(state);
    }

    render(){
        let leaderboardCharacters = this.state.characters.map((character)=>{
            return(
                    <li key={character.characterId}>:
                        <Link to={'/characters/'+character.characterId}>
                            <img className='thumb-md' src={'http://image.eveonline.com/Char'}
                        </Link>
                    </li>
                  );
        });
    }

    return(
           <footer> 
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-5'>
                        <h3 className='lead'><strong>Information</strong></h3>
                        <p>Powered by <strong>Node.js</strong>,<strong>MongoDB</strong></p>
                        <p>you may view the <a href='https://github.com'>
                        <p>@2015</p>
                    </div>
                </div>
                <div className='col-sm-7 hidden-xs'>
                    <div className='lead'>
                    <strong>Leaderboard</strong>
                    <ul className='list-inline'>
                        {leaderboardCharacters}
                    </ul>
                    </div>
                </div>
            </div>
           </footer>
          );
}

export default Footer;
