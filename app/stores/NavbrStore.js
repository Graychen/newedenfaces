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

    onFindCharacterFail(payload){
        payload.searchForm.classList.add('shake');
        setTimeout(()=>{
            payload.searchForm.classList.remove('shake');
        });

        onUpdatelineUsers(data){
            this.onlineUsers = data.onlineUsers;
        }

        onUpdateAjaxAnimation(className){
            this.searchQuery = event.target.value;
        }

        onGetCharacterCountSuccess(data){
            this.totalCharacters = data.count;
        }

        onGetCharacterCountFail(jqXhr){
            toastr.err(jqXhr.reponseJSON.message);
        }
        
    }
}

export default alt.createStore(NavbarStore);
