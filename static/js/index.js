
$(document).ready(function () {
    let cTC = "container text-center";
    let formGroup= "form-group";
    let controlLabel= "control-label col-sm-2";
    let colSM = "col-sm-10";
    let formControll = "form-control";
    let panelBody="panel-body";
    let panelDefault= "panel panel-default";
    let panelHeading="panel-heading";
    let nextSongs=3;
    $("#home").click(function (e) { 
      $("#fs").empty();
      let h3= document.createElement("h3");
      h3.innerText= "Wünsch dir was...";
      let p = document.createElement("p");
      p.innerText="Da wir nicht immer Lust haben einen auf DJ zu machen, könnt nun auch ihr Musik, die gerne gespielt werden soll,"+
                  "in die aktuelle Warteschlange/Playlist zu packen!"
      
      $("#fs").append(h3);
      $("#fs").append(p);
        
    });
    $("#wishList").click(function (e) { 
        
        $("#fs").empty();
        let divWishList= document.createElement("div");
        divWishList.setAttribute("class",cTC);

        let form = document.createElement("form");
        form.setAttribute("method","post");
        form.setAttribute("class","form-horizontal");
//----------------------------------------------------------
// interpret elements
        let interpretDiv = document.createElement("div");
        interpretDiv.setAttribute("class",formGroup);

        createLabl("interpret",controlLabel,"Interpret:",interpretDiv);

        let interpretenInputDiv = document.createElement("div");
        interpretenInputDiv.setAttribute("class",colSM);

        createInput("text","Track","interpret","Interpret",formControll,interpretenInputDiv);
        interpretDiv.append(interpretenInputDiv);
//-------------------------------------------------------------------
//track elements
        let trackDiv= document.createElement("div");
        trackDiv.setAttribute("class",formGroup);
        createLabl("track",controlLabel,"Track:",trackDiv);
        let trackInputDiv= document.createElement("div");
        trackInputDiv.setAttribute("class",colSM);
        createInput("text","Track","track","Track",formControll,trackInputDiv);
        trackDiv.append(trackInputDiv);

        let submitDiv= document.createElement("div");
        submitDiv.setAttribute("class",formGroup);
        let submitButtonDiv= document.createElement("div");
        submitButtonDiv.setAttribute("class","col-sm-offset-2 col-sm-10");
        let button = document.createElement("Button");
        button.setAttribute("type","submit");
        button.setAttribute("class","btn btn-default");
        button.innerText="submit";
        submitButtonDiv.append(button);
        submitDiv.append(submitButtonDiv);
        form.append(interpretDiv);
        form.append(trackDiv);
        form.append(submitDiv);
        $("#fs").append(form);
        
    });

    $("#playList").click(function (e) {
        // clear only the mein div,fs, childs
        $("#fs").empty();
        let parrentDiv = document.createElement("div");
        parrentDiv.setAttribute("class",panelDefault);
        createHeaderDiv(panelHeading,"aktuelles Lied",parrentDiv);
        let currentTrackDiv = document.createElement("div");
        currentTrackDiv.setAttribute("class","panel-body");
        currentTrackDiv.setAttribute("id","currentTrack");
        currentTrackDiv.innerText= "CurrentSong";
        parrentDiv.append(currentTrackDiv);

        let queueDiv= document.createElement("div");
        queueDiv.setAttribute("class",panelDefault);
      
        createHeaderDiv(panelHeading,"In der Warteschlange",queueDiv);
        let playListDiv= document.createElement("div");
        playListDiv.setAttribute("class",panelBody);
        for (let i = 0; i < nextSongs; i++) {
            createNextTrackDiv(panelBody,"track"+i,"nächstes Lied"+i,playListDiv);   
        }
        

        queueDiv.append(playListDiv);
        $("#fs").append(parrentDiv);
        $("#fs").append(queueDiv);
        
    });

    function createLabl(forTag,classTag,innerHTML,appendDiv){
        
        let label = document.createElement("label");
        label.setAttribute("class", classTag);
        label.setAttribute("for",forTag)
        label.innerText = innerHTML;
        appendDiv.append(label);

    }
    function createInput(typeTag,nameTag,idTag,playeholderTag,classTag,appendDiv){
        let input= document.createElement("input");
        input.setAttribute("type",typeTag);
        input.setAttribute("name",nameTag);
        input.setAttribute("id",idTag);
        input.setAttribute("placeholder",playeholderTag);
        input.setAttribute("class",classTag);
        appendDiv.append(input);
       
    }
    function createHeaderDiv(classTag,innerHTML,appendDiv){
        let headerDiv=document.createElement("div");
        headerDiv.setAttribute("class",classTag);
        headerDiv.innerText=innerHTML;
        appendDiv.append(headerDiv);
    }
    function createNextTrackDiv(classTag,idTag,innerHTML,appendDiv){
        let div = document.createElement("div");
        div.setAttribute("class",classTag);
        div.setAttribute("id",idTag);
        div.innerText = innerHTML;
        appendDiv.append(div);
    }
    //socket.io verbindung

    let socket = io();
    //event wird serverseitig ausgelöst, wenn sich der client verbindet
    socket.on('playListUpdate',(msg)=>{
       //console.log('playListUpdate '+JSON.stringify(msg));
    });
    socket.on('searchData',(msg)=>{
       console.log('searchData '+JSON.stringify(msg));
    });
    //track hinzufügen
    let id='1301WleyT98MSxVHPZCA6M';
    //socket.emit('addTrack',{trackId:id});
    //nach artistName, trackName oder beidem suchen
    let artistName=$("#interpret").innerHTML;
    let trackName=$("#track").innerHTML;
    socket.emit('search',{artistName:artistName,trackName:trackName})
    /////
});