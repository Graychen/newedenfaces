import alt from '../alt';
import NavbarActions from '../actions/NavbarAction';

class NavbarStore{
    construct(){
        this.bindAction(NavbarActions);
        this.totalCharacters=0;
        this.onlineUsers=0;
        this.searchQuery='';
        this.ajaxAnimationClass='';
    }

    onFindCharacterSuccess(payload){
        payload.router.transitionTo('/characters/'+payload.characterId);
    }
}
