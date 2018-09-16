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
    let divWishList = document.createElement("div");
    let resultDiv = document.createElement("div");
    resultDiv.setAttribute("id", "resultDiv");
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

        divWishList.setAttribute("class", cTC);
        let liveSearchDiv = document.createElement("div");
        liveSearchDiv.setAttribute("id", "liveSearchDiv");
        //----------------------------------------------------------
        // interpret elements
        let searchDiv = document.createElement("div");
        searchDiv.setAttribute("class", formGroup);

        createLabl("Search", controlLabel, "Suche:", searchDiv);

        let searchInputDiv = document.createElement("div");
        searchInputDiv.setAttribute("class", colSM);

        createInput("text", "Search", "search", "Artist,Track", formControll, searchInputDiv);
        searchDiv.append(searchInputDiv);
        //-------------------------------------------------------------------


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

        divWishList.append(searchDiv);
        divWishList.append(liveSearchDiv);

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
            socket.emit('addTrack', {artistName: artistName, trackName: trackName});
        });

        $("#search").keyup(function (e) {

            socket.emit('searchTrack', {keyWord: e.target.value});

            //console.log("Item:"+artistsNameArr[0]);
            $("#Search").autocomplete(
                {
                    source: artistsNameArr

                }
            );

        });


    });

    $("#playList").click(function (e) {
        // clear only the main div,fs, childs
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

        console.log(msg, "artistName");

        for (let item in msg.body.artists.items) {
            let element = msg.body.artists.items[item];
            // console.log("Artist Name: "+element.name);
            if (!(artistsNameArr.includes(element.name))) {
                console.log("in if in artistData" + element.name);
                artistsNameArr.push(element.name);
            }
        }
    });
    socket.on('trackData', (msg) => {
        artistsNameArr.length = 0;
        //Todo remove console.log
        console.log("track Response", msg);
        for (let item in msg.body.tracks.items) {
            let element = msg.body.tracks.items[item];
            if (!(tracksArr.includes(element.name))) {
                tracksArr.push(element.name);
            }
        }
        //hier wurde über artists iteriert zeile 215 dann nochmal auf artist zugegriffen
        if (resultDiv.firstChild) {
            while (resultDiv.firstChild.nextSibling) {
                resultDiv.removeChild(resultDiv.firstChild);
            }
            resultDiv.removeChild(resultDiv.firstChild);
        }
        for (let item in msg.body.tracks.items) {
            let p = document.createElement("p");
            p.setAttribute("class", "artistName");
            //artist array wurde nicht benutzt
            let element = msg.body.tracks.items[item];
            console.log('element');

            console.log(element);

            for (let aName in element.artists) {
                let name = document.createTextNode(element.artists[aName].name + "-" + element.name);

                p.appendChild(name);
                resultDiv.appendChild(p);
            }
            console.log("element", element);
            $(".artistName").click(function (e) {
                e.preventDefault();
                console.log("click");

            });
        }
        divWishList.append(resultDiv);

    });
});