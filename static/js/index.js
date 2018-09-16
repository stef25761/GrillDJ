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
   
    let artistsNameArr = [];
   
    let divWishList = document.createElement("div");
    let resultDiv = document.createElement("div");

    let artistPID;

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

        divWishList.append(searchDiv);
        divWishList.append(liveSearchDiv);

        $("#fs").append(divWishList);


        $("#search").keyup(function (e) {

            socket.emit('searchTrack', { keyWord: e.target.value });
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
    function createModal(appendDiv, artistName, trackName, albumName) {
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
        let xButton = document.createElement("button");
        xButton.setAttribute("class", "close");
        xButton.setAttribute("data-dismiss", "modal");
        let t = document.createTextNode("x");
        xButton.appendChild(t);
        modalHeader.append(h);
        modalHeader.append(xButton);
        //-------------------------------------------
        /*modal body */
        let modalBody = document.createElement("div");
        modalBody.setAttribute("class", "modal-body");
        let artistNameDiv = document.createElement("div");
        let artistNameP = document.createElement("p");
        let artistNameL = document.createElement("label");
        artistNameP.innerText = artistName;
        artistNameL.innerText = "Interpret/en";
        artistNameDiv.append(artistNameL);
        artistNameDiv.append(artistNameP);

        let TrackNameDiv = document.createElement("div");
        let TrackNameP = document.createElement("p");
        let TrackNameL = document.createElement("label");
        TrackNameP.innerText = trackName;
        TrackNameL.innerText = "Song";
        TrackNameDiv.append(TrackNameL);
        TrackNameDiv.append(TrackNameP);

        let albumNameDiv = document.createElement("div");
        let albumNameP = document.createElement("p");
        let albumNameL = document.createElement("label");
        albumNameP.innerText = albumName;
        albumNameL.innerText = "Album";

        albumNameDiv.append(albumNameL);
        albumNameDiv.append(albumNameP);

        modalBody.append(albumNameDiv);
        modalBody.append(artistNameDiv);
        modalBody.append(TrackNameDiv);
        //---------------------------------------------
        /*modal footer */
        let modalFooter = document.createElement("div");
        modalFooter.setAttribute("class", "modal-footer");
        let acceptBtn = document.createElement("button");
        let closeBtn = document.createElement("button");
        acceptBtn.setAttribute("class","btn btn-success");
        acceptBtn.setAttribute("id","submit");
        let accept = document.createTextNode("Ok");
        acceptBtn.appendChild(accept);
        closeBtn.setAttribute("class","btn btn-danger");
        closeBtn.setAttribute("data-dismiss","modal");
        let close = document.createTextNode("Abbruch");
        closeBtn.appendChild(close);
        modalFooter.append(acceptBtn);
        modalFooter.append(closeBtn);
        //--------------------------------------------
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(modalFooter);
        modalDialog.append(modalContent);
        modalDiv.append(modalDialog);
        appendDiv.append(modalDiv);
    }


    //event wird serverseitig ausgelöst, wenn sich der client verbindet
    socket.on('playListUpdate', (msg) => {
        //console.log('playListUpdate '+JSON.stringify(msg));
    });

    //track hinzufügen
    let id = '1301WleyT98MSxVHPZCA6M';


    socket.on('trackData', (msg) => {
        //TODO: clear local storage!!!
        artistsNameArr.length = 0;
        $("#resultDiv").empty();
        //check browser compatibility
        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            localStorage.setItem("TrackData", JSON.stringify(msg.body.tracks.items));
        } else {
            alert("not Supportet!");
            // Sorry! No Web Storage support..
        }
        //Todo remove console.log
        // console.log("track Response", msg);


        for (let item in msg.body.tracks.items) {
            let p = document.createElement("p");
            p.setAttribute("class", "artistName");
            //artist array wurde nicht benutzt
            let element = msg.body.tracks.items[item];

            // console.log('element', element);

            for (let aName in element.artists) {
                artistPID = element.id;
                let name = document.createTextNode(element.artists[aName].name + "-" + element.name);

                p.appendChild(name);
                p.setAttribute("id", artistPID);
                resultDiv.appendChild(p);


            }
            //console.log("element", element);

        }

        $(".artistName").click(function (e) {
            e.preventDefault();
            //TODO: pop up modal window send uri to spotify API
            let trackData = JSON.parse(localStorage.getItem("TrackData"));
            let trackName;
            let tmpArtistName = "";
            let albumName;
            for (let item in trackData) {

                if (trackData[item].id == e.target.id) {
                    trackName = trackData[item].name;
                    albumName = trackData[item].album.name;
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
            createModal(divWishList,tmpArtistName,trackName,albumName);
            $("#modal").modal();
            //console.log(JSON.parse(localStorage.getItem("TrackData")));
            //console.log(e.target.id);

        });

        divWishList.append(resultDiv);

    });
});