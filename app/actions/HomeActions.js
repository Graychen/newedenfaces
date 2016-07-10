import alt from '../alt';

class HomeActions{
    constructor(){
        this.generateActions(
                'getTwoCharactersSuccess',
                'getTwoCharactersFail',
                'voteFail',
                );
    }

    getTwoCharacters(){
        $.ajax({url:'/api/characters'})
            .done(data=>{
                this.actions.getTwoCharactersSuccess(data);
            })
        .fail(data=>{
            this.actions.getTwoCharactersFail(jqXhr.reponseJSON.message);
        });
    }

    vote(winner,loser){
        $.ajax({
            type:'PUT',
            url: '/api/characters',
            data:{winner:winner,loser:loser}
        })
        .done(()=>{
            this.actions.gerTwoCharacters();
        })
        .fail((jqXhr)=>{
            this.actions.voteFail(jqXhr.reponseJSON.message);
        });    
    }
}

export default alt.createActions(HomeActions);
