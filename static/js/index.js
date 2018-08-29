
$(document).ready(function () {
    let cTC = "container text-center";
    let formGroup = "form-group";
    let controlLabel = "control-label col-sm-2";
    let colSM = "col-sm-10";
    let formControll = "form-control";
    let panelBody = "panel-body";
    let panelDefault = "panel panel-default";
    let panelHeading = "panel-heading";
    let nextSongs = 3;
    //socket.io verbindung
    let socket = io();
    let artistName;
    let trackName;
    let searchLimit = 3;
    let artistNameSet = new Set();
    let trackNameSet = new Set();
    let artistsNameArr = [];
    let tracksArr = [];

    $("#home").click(function (e) {
        $("#fs").empty();
        let h3 = document.createElement("h3");
        h3.innerText = "Wünsch dir was...";
        let p = document.createElement("p");
        p.innerText = "Da wir nicht immer Lust haben einen auf DJ zu machen, könnt nun auch ihr Musik, die gerne gespielt werden soll," +
            "in die aktuelle Warteschlange/Playlist zu packen!"

        $("#fs").append(h3);
        $("#fs").append(p);

    });
    $("#wishList").click(function (e) {

        $("#fs").empty();
        let divWishList = document.createElement("div");
        divWishList.setAttribute("class", cTC);
        let liveSearchDiv = document.createElement("div");
        liveSearchDiv.setAttribute("id", "liveSearchDiv");
        //----------------------------------------------------------
        // interpret elements
        let interpretDiv = document.createElement("div");
        interpretDiv.setAttribute("class", formGroup);

        createLabl("interpret", controlLabel, "Interpret:", interpretDiv);

        let interpretenInputDiv = document.createElement("div");
        interpretenInputDiv.setAttribute("class", colSM);

        createInput("text", "Interpret", "interpret", "Interpret", formControll, interpretenInputDiv);
        interpretDiv.append(interpretenInputDiv);
        //-------------------------------------------------------------------
        //track elements
        let trackDiv = document.createElement("div");
        trackDiv.setAttribute("class", formGroup);
        createLabl("track", controlLabel, "Track:", trackDiv);
        let trackInputDiv = document.createElement("div");
        trackInputDiv.setAttribute("class", colSM);
        createInput("text", "Track", "track", "Track", formControll, trackInputDiv);
        trackDiv.append(trackInputDiv);
        /*
        let submitDiv = document.createElement("div");
        submitDiv.setAttribute("class", formGroup);
        let submitButtonDiv = document.createElement("div");
        submitButtonDiv.setAttribute("class", "col-sm-offset-2 col-sm-10");
        let button = document.createElement("Button");
        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-default");
        button.setAttribute("id", "submit");
        button.innerText = "suchen";
        
        submitButtonDiv.append(button);
        
        submitDiv.append(submitButtonDiv);
        */
        let resultDiv = document.createElement("div");
        for (let i = 0; i < artistsNameArr.length; i++) {
            let p=document.createElement("p");
            p.setAttribute("class","artistName");
            let name = document.createTextNode(artistsNameArr[i]);
            p.appendChild(name);
            $(".artistName").click(function (e) { 
                alert("Gedrückt");
                // add playlist
            });
            resultDiv.appendChild(p);
        }
        resultDiv.setAttribute("id","resultDiv");
        divWishList.append(resultDiv);
        divWishList.append(interpretDiv);
        divWishList.append(liveSearchDiv);
        divWishList.append(trackDiv);
        //divWishList.append(submitDiv);
        $("#fs").append(divWishList);
        // unterdrückt submit und baut eigenen
      
        $("#submit").click(function (e) {
            e.preventDefault();
            artistName = $("#interpret").val();
            trackName = $("#track").val();
            //console.log(artistName,trackName);
            // TODO:hier müsste dann dei Add Methode rein und nicht mehr die search!
            artistsNameArr.length = 0;
            tracksArr.length = 0;
            socket.emit('addTrack', { artistName: artistName, trackName: trackName });
        });

        $("#interpret").keyup(function (e) {

            socket.emit('searchArtist', { artistName: e.target.value });

            //console.log("Item:"+artistsNameArr[0]);
            $("#interpret").autocomplete(
                {
                    source: artistsNameArr

                }

            );

        });
        $("#track").keyup(function (e) {
            socket.emit('searchTrack', { trackName: e.target.value });

            $("#track").autocomplete(
                {
                    source: tracksArr
                }
            );
        });

    });

    $("#playList").click(function (e) {
        // clear only the mein div,fs, childs
        $("#fs").empty();
        let parrentDiv = document.createElement("div");
        parrentDiv.setAttribute("class", panelDefault);
        createHeaderDiv(panelHeading, "aktuelles Lied", parrentDiv);
        let currentTrackDiv = document.createElement("div");
        currentTrackDiv.setAttribute("class", "panel-body");
        currentTrackDiv.setAttribute("id", "currentTrack");
        currentTrackDiv.innerText = "CurrentSong";
        parrentDiv.append(currentTrackDiv);

        let queueDiv = document.createElement("div");
        queueDiv.setAttribute("class", panelDefault);

        createHeaderDiv(panelHeading, "In der Warteschlange", queueDiv);
        let playListDiv = document.createElement("div");
        playListDiv.setAttribute("class", panelBody);
        for (let i = 0; i < nextSongs; i++) {
            createNextTrackDiv(panelBody, "track" + i, "nächstes Lied" + i, playListDiv);
        }


        queueDiv.append(playListDiv);
        $("#fs").append(parrentDiv);
        $("#fs").append(queueDiv);

    });

    function createLabl(forTag, classTag, innerHTML, appendDiv) {

        let label = document.createElement("label");
        label.setAttribute("class", classTag);
        label.setAttribute("for", forTag)
        label.innerText = innerHTML;
        appendDiv.append(label);

    }
    function createInput(typeTag, nameTag, idTag, playeholderTag, classTag, appendDiv) {
        let input = document.createElement("input");
        input.setAttribute("type", typeTag);
        input.setAttribute("name", nameTag);
        input.setAttribute("id", idTag);
        input.setAttribute("placeholder", playeholderTag);
        input.setAttribute("class", classTag);
        appendDiv.append(input);

    }
    function createHeaderDiv(classTag, innerHTML, appendDiv) {
        let headerDiv = document.createElement("div");
        headerDiv.setAttribute("class", classTag);
        headerDiv.innerText = innerHTML;
        appendDiv.append(headerDiv);
    }
    function createNextTrackDiv(classTag, idTag, innerHTML, appendDiv) {
        let div = document.createElement("div");
        div.setAttribute("class", classTag);
        div.setAttribute("id", idTag);
        div.innerText = innerHTML;
        appendDiv.append(div);
    }



    //event wird serverseitig ausgelöst, wenn sich der client verbindet
    socket.on('playListUpdate', (msg) => {
        //console.log('playListUpdate '+JSON.stringify(msg));
    });

    //track hinzufügen
    let id = '1301WleyT98MSxVHPZCA6M';
    //socket.emit('addTrack',{trackId:id});
    //nach artistName, trackName oder beidem suchen
    socket.on('artistData', (msg) => {
        
         console.log(msg,"artistName");
        for (let item in msg.body.artists.items) {
            let element = msg.body.artists.items[item];
            // console.log("Artist Name: "+element.name);
            if (!(artistsNameArr.includes(element.name))) {
                console.log("in if in artistData" + element.name);
                artistsNameArr.push(element.name);
            }
            //artistNameSet.add(element.name);
            //artistsNameArr=[...artistNameSet];
            // console.log(artistsNameArr.length);
        }

    });
    socket.on('trackData', (msg) => {
        console.log("trackNAme");
        console.log(msg);
        for (let item in msg.body.tracks.items) {
            let element = msg.body.tracks.items[item];
            if (!(tracksArr.includes(element.name))) {
                tracksArr.push(element.name);

            }

        }

    });

    /////
});