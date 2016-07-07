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
                    <li key={}>:
                        <Link to=>
                            <img className=‘’ src={'http://image.eveonline.com/Char'}
                        </Link>
                    </li>
                  );
        });
    }
}
