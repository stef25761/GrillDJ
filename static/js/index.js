$(document).ready(function () {

    let cTC = "container text-center";
    let formGroup = "form-group";
    let controlLabel = "control-label col-sm-2";
    let colSM = "col-sm-10";
    let formControll = "form-control";
    let panelBody = "panel-body";
    let panelDefault = "panel panel-default";
    let panelHeading = "panel-heading";

    //socket.io verbindung
    let socket = io();
    let currentSongName;
    let currentInterpredName;
    let currentSong;
    let currentSongID;
    let artistsNameArr = [];
    let playlist = JSON.parse(localStorage.getItem("playlist"));
    let resultUl = document.createElement("ul");
    let trackPosNumber;
    let artistPID;
    let nextSong;
   
    resultUl.setAttribute("id", "resultUl");
    resultUl.setAttribute("class", "list-group");
    $("#home").click(function (e) {
        $("#fs").empty();
        $("#wishListDiv").empty();
        $("#wishListDiv").remove();
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
        divWishList.setAttribute("id", "wishListDiv");
        let resultDiv = document.createElement("div");

        resultDiv.setAttribute("id", "resultDiv");
        resultDiv.setAttribute("class", "row");

        //----------------------------------------------------------
        // interpret elements
        let searchDiv = document.createElement("div");
        searchDiv.setAttribute("class", formGroup + " row");

        createLabl("Search", controlLabel, "Suche:", searchDiv);

        let searchInputDiv = document.createElement("div");
        searchInputDiv.setAttribute("class", colSM);

        createInput("text", "Search", "search", "Artist,Track", formControll, searchInputDiv);

        searchDiv.append(searchInputDiv);

        divWishList.append(searchDiv);

        divWishList.append(resultDiv);
        $("#fs").append(divWishList);


        $("#search").keyup(function (e) {

            socket.emit('searchTrack', { keyWord: e.target.value });
        });

    });

    $("#playList").click(function (e) {
        //clear only the main div,fs, childs
        $("#fs").empty();
        $("#wishListDiv").empty();
       // $("#wishListDiv").remove();

        let parrentDiv = document.createElement("div");

        parrentDiv.setAttribute("class", panelDefault);
        createHeaderDiv(panelHeading, "aktuelles Lied", parrentDiv);
        let currentTrackDiv = document.createElement("div");
        let playListDiv = document.createElement("div");
        createNextTrackDiv(panelBody, "secondSong",
            "", playListDiv);
        createNextTrackDiv(panelBody, "thirdSong",
            "", playListDiv);
        currentTrackDiv.setAttribute("class", "panel-body");
        currentTrackDiv.setAttribute("id", "currentTrack");


        parrentDiv.append(currentTrackDiv);
        let queueDiv = document.createElement("div");

        queueDiv.setAttribute("class", panelDefault);
        createHeaderDiv(panelHeading, "In der Warteschlange", queueDiv);
        playListDiv.setAttribute("class", panelBody);
        playListDiv.setAttribute("id","playListDiv");
        queueDiv.append(playListDiv);


        $("#fs").append(parrentDiv);
        $("#fs").append(queueDiv);
        fillPlaylist();
    });
    function fillPlaylist(){
console.log('fillPlaylist');

        let playListDiv=$("#playListDiv");
        let currentTrackDiv=$("#currentTrack");
        let secondSong=$("#secondSong");
        let thirdSong=$("#thirdSong");
        currentTrackDiv.empty();
        secondSong.empty();
        thirdSong.empty();
        console.log('currentSongElement ',$("#currentTrack"));
        let text=document.createTextNode(currentSong);
        currentTrackDiv.append(text);
        for (let item in playlist.items) {
            let playListSize = playlist.items.length;

            let foundIt = false;
            if (currentSongID != null) {
                foundIt = currentSongID == playlist.items[item].track.id;
            }

            if (foundIt) {

                let placeTwo = parseInt(item, 10) + 1;
                let thirdPlace = parseInt(item, 10) + 2;

                if (thirdPlace >= playListSize) {
                    if (!(placeTwo >= playListSize)) {
                        nextSong = playlist.items[placeTwo].track.artists[0].name + '-'
                            + playlist.items[placeTwo].track.name;
                        let text=document.createTextNode(nextSong);
                        secondSong.append(nextSong);




                    }

                    let errMessage =document.createTextNode( " Das Ende der Playlist ist fast erreicht!");
                    thirdSong.append(errMessage)


                } else {
                    nextSong = playlist.items[placeTwo].track.artists[0].name + '-'
                        + playlist.items[placeTwo].track.name;
                    let songAfterNext = playlist.items[thirdPlace].track.artists[0].name + '-'
                        + playlist.items[thirdPlace].track.name;
                    let text=document.createTextNode(nextSong);
                    secondSong.append(text);
                    text=document.createTextNode(songAfterNext);
                    thirdSong.append(text);

                    console.log('secondSong ',nextSong);
                    console.log('thirdSong ',songAfterNext);


                }
            }

        }
    }


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
    function createModal(appendDiv, artistName, trackName, albumName, spotifyUri) {
        /*Create the modal */
        let modalDiv = document.createElement("div");
        modalDiv.setAttribute("id", "modal");
        modalDiv.setAttribute("class", "modal fade");
        let modalDialog = document.createElement("div");
        modalDialog.setAttribute("class", "modal-dialog");
        let modalContent = document.createElement("div");
        modalContent.setAttribute("class", "modal-content");
        //-------------------------------------------
        /*create the modal header */
        let modalHeader = document.createElement("div");
        modalHeader.setAttribute("class", "modal-header");
        let h = document.createElement("h4");
        h.innerText = "Lied hinzufügen";
        h.setAttribute("class", "modal-title");
        h.setAttribute("class", "color: #9d9d9d");
        /*let xButton = document.createElement("button");
        xButton.setAttribute("class", "close");
        xButton.setAttribute("data-dismiss", "modal");
        let t = document.createTextNode("x");
        xButton.appendChild(t);
        
        modalHeader.append(xButton);
        */
        modalHeader.append(h);
        //-------------------------------------------
        /*modal body */
        let modalBody = document.createElement("div");
        modalBody.setAttribute("class", "modal-body");
        let artistNameDiv = document.createElement("div");
        let artistNameP = document.createElement("p");
        let artistNameL = document.createElement("label");
        artistNameP.innerText = artistName;
        artistNameL.innerText = "Interpret/en:";
        artistNameDiv.append(artistNameL);
        artistNameDiv.append(artistNameP);

        let TrackNameDiv = document.createElement("div");
        let TrackNameP = document.createElement("p");
        let TrackNameL = document.createElement("label");
        TrackNameP.innerText = trackName;
        TrackNameL.innerText = "Song:";
        TrackNameDiv.append(TrackNameL);
        TrackNameDiv.append(TrackNameP);

        let albumNameDiv = document.createElement("div");
        let albumNameP = document.createElement("p");
        let albumNameL = document.createElement("label");
        albumNameP.innerText = albumName;
        albumNameL.innerText = "Album:";

        albumNameDiv.append(albumNameL);
        albumNameDiv.append(albumNameP);

        modalBody.append(artistNameDiv);
        modalBody.append(TrackNameDiv);
        modalBody.append(albumNameDiv);
        //---------------------------------------------
        /*modal footer */
        let modalFooter = document.createElement("div");
        modalFooter.setAttribute("class", "modal-footer");
        let acceptBtn = document.createElement("button");
        let closeBtn = document.createElement("button");
        acceptBtn.setAttribute("class", "btn btn-success");
        acceptBtn.setAttribute("id", "submit");
        let accept = document.createTextNode("Ok");
        acceptBtn.appendChild(accept);
        closeBtn.setAttribute("class", "btn btn-danger");
        closeBtn.setAttribute("data-dismiss", "modal");
        let close = document.createTextNode("Abbruch");
        closeBtn.appendChild(close);

        modalFooter.append(closeBtn);
        modalFooter.append(acceptBtn);
        //--------------------------------------------
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(modalFooter);
        modalDialog.append(modalContent);
        modalDiv.append(modalDialog);
        appendDiv.append(modalDiv);
        $("#submit").click(function (e) {
            e.preventDefault();

           
            let exist = false;

            let playlistSize = playlist.items.length;
            for (let item in playlist.items) {
                if (spotifyUri === playlist.items[item].track.uri) exist = true;
            }


            if (exist) {
                $("#modal").modal("hide");
                $("#resultUl").empty();
                $("#resultUl").removeClass("panel-body");
                let failP = document.createElement("p");
                failP.setAttribute("class", "bg-danger");
                failP.innerText = "Songwunsch wurde schon hinzugefügt";
                $("#resultUl").append(failP);
            } else {
                if (playlistSize != 0) {
                    socket.emit('addTrack', spotifyUri, parseInt(playlistSize) - 1);
                } else {
                    socket.emit('addTrack', spotifyUri, parseInt(playlistSize));
                }

                $("#modal").modal("hide");
                $("#resultUl").empty();
                $("#search").val('');
                $("#resultUl").removeClass("panel-body");
                let successP = document.createElement("p");
                successP.setAttribute("class", "bg-success")
                successP.innerText = "Songwunsch wurde hinzugefügt";
                $("#resultUl").append(successP);
            }
            console.log("Submit the spotify uri", { uri: spotifyUri });

        });
    }


    socket.on('playListUpdate', (msg) => {
        console.log('playListUpdate '+JSON.stringify(msg));
        console.log('playListUpdate ', msg);

        //check browser compatibility
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("playlist", JSON.stringify(msg.body));
        } else {
            alert("not Supportet!");
            // Sorry! No Web Storage support..
        }
    });


    //event wird serverseitig ausgelöst, wenn sich der client verbindet
    socket.on('playbackState', (msg) => {
        console.log('playbackstate', msg);

        if (msg.body.item) {
            currentSongName = msg.body.item.name;
            currentSongID = msg.body.item.id;


            for (let item in msg.body.item.artists) {
                if (item == 0) {
                    currentInterpredName = msg.body.item.artists[item].name
                }

            }
            currentSong = currentInterpredName + " - " + currentSongName;
        }
        fillPlaylist();
    });




    //track hinzufügen
    let id = '1301WleyT98MSxVHPZCA6M';


    socket.on('trackData', (msg) => {
        //TODO: clear local storage!!!
        artistsNameArr.length = 0;

        $("#resultUl").empty();
        //check browser compatibility
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("TrackData", JSON.stringify(msg.body.tracks.items));
        } else {
            alert("not Supportet!");
            // Sorry! No Web Storage support..
        }
        //Todo remove console.log



        for (let item in msg.body.tracks.items) {
            let li = document.createElement("li");
            li.setAttribute("class", "artistName list-group-item");
            //artist array wurde nicht benutzt
            let element = msg.body.tracks.items[item];
            for (let aName in element.artists) {
                artistPID = element.id;
                let name = document.createTextNode(element.artists[aName].name + "-" + element.name);
                li.appendChild(name);
                li.setAttribute("id", artistPID);
                resultUl.appendChild(li);
            }
        }

        $(".artistName").click(function (e) {
            e.preventDefault();
            $("#modal").remove();
            $("#modal").empty();
            //TODO: pop up modal window send uri to spotify API
            let trackData = JSON.parse(localStorage.getItem("TrackData"));
            let trackName;
            let tmpArtistName = "";
            let albumName;
            let spotifyUri = "";
            for (let item in trackData) {

                if (trackData[item].id == e.target.id) {
                    trackName = trackData[item].name;
                    albumName = trackData[item].album.name;
                    spotifyUri = trackData[item].uri;
                    for (let name in trackData[item].artists) {

                        if (name == ((trackData[item].artists.length) - 1)) {
                            tmpArtistName += trackData[item].artists[name].name;

                        } else {

                            tmpArtistName += trackData[item].artists[name].name;
                            tmpArtistName += ",";
                        }
                    }

                }
            }
            let getDivWIshList = $("#wishListDiv");
            createModal(getDivWIshList, tmpArtistName, trackName, albumName, spotifyUri);
            $("#modal").modal();
        });
        $("#resultDiv").append(resultUl);

    });

});

