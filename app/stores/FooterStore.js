import alt from '../alt';
import FooterActions from '../actions/FooterActions';

class FooterStore{
    constructor(){
        this.bindActions(FooterActions);
        this.characters = [];
    }

    onGetTopCharactersSuccess(data){
        this.characters = data.slice(0,5);
    }

    onGetTopCharactersFail(jqxhr){
        toastr.error(jqXhr.reponseJSON && jqxhr.reponseJSON.message || jqXhr.reponseText || jqXhr.statusText);
    }
}

export default alt.createStore(FooterStore);
