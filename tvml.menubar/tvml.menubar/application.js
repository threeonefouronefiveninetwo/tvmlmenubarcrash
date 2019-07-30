//# sourceURL=application.js

//
//  application.js
//  tvml.menubar
//  Music from: https://freepd.com/

/*
 * This file provides an example skeletal stub for the server-side implementation 
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is 
 * configured in the AppDelegate of the TVML application. Note that  the various 
 * javascript functions here are referenced by name in the AppDelegate. This skeletal 
 * implementation shows the basic entry points that you will want to handle 
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */

var baseURL;

App.onLaunch = function(options) {
    var alert = createAlert("Hello World!", "Welcome to tvOS");
    var menu = createMenuTemplate()
    baseURL = options.BASEURL
    navigationDocument.pushDocument(menu);
}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}


/**
 * This convenience function returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc
}

var createTracksDocument = function() {
    var xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <!--
    Copyright (C) 2016 Apple Inc. All Rights Reserved.
    See LICENSE.txt for this sample’s licensing information
        -->
        <document>
            <stackTemplate>
                <banner>
                    <title>Tracks</title>
                </banner>
                <collectionList>
                    <grid>
                        <section>
                            <lockup audioURL="${baseURL}/audio/Chronos.mp3">
                                <img width="308" height="308" style="tv-placeholder: music;" src="" />
                                <title>Chronos</title>
                                <subtitle>Alexander Nakarada</subtitle>
                            </lockup>
                            <lockup audioURL="${baseURL}/audio/Meditating_Beat.mp3">
                                <img width="308" height="308" style="tv-placeholder: music;" src="" />
                                <title>Meditating Beat</title>
                                <subtitle>Kevin MacLeod</subtitle>
                            </lockup>
                            <lockup audioURL="${baseURL}/audio/The_Range.mp3">
                               <img width="308" height="308" style="tv-placeholder: music;" src="" />
                               <title>The Range</title>
                               <subtitle>Rafael Krux</subtitle>
                            </lockup>
                        </section>
                       
                        
                    </grid>
                    <separator>
                        <button id="titleButton1" style="color: rgba(20,20,20,1);">
                            <title style="color: black;"> Change NowPlaying Title</title>
                        </button>
                    </separator>
                    <separator>
                       <button id="titleButton2" style="color: rgba(20,20,20,1);">
                            <title style="color: black;"> Change MenuBar Title</title>
                       </button>
                   </separator>
                </collectionList>
            </stackTemplate>
        </document>`;
    
    var parser = new DOMParser();
    
    var doc = parser.parseFromString(xml, "application/xml");
    
    doc.addEventListener("play", playSelectedLockup);
    doc.addEventListener("select", playSelectedLockup);
    var button = doc.getElementById("titleButton2");
    button.addEventListener("select", changeMenuItemTitle);
    var button = doc.getElementById("titleButton1");
    button.addEventListener("select", changeNowPlayingTitle);
    
    return doc;
}

// Create a menu template with now playing
// and add handler for menuItem select events.
var createMenuTemplate = function() {
    var menuTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
            <menuBarTemplate>
                <menuBar id="menu">
                    <!-- Only appears during audio playback -->
                    <nowPlayingMenuItem id="nowPlaying">
                        <title>Now Playing</title>
                    </nowPlayingMenuItem>
                    <menuItem id="tracks">
                        <title>Tracks</title>
                    </menuItem>
                </menuBar>
            </menuBarTemplate>
        </document>
    `;
    
    var parser = new DOMParser();
    
    var menuDoc = parser.parseFromString(menuTemplate, "application/xml");
    menuDoc.addEventListener("select", printSelectedMenuItem);
    
    // MenuBarDocument:setDocument
    // Uncomment following line to see how the bug affects setting documents for a menuItem
    menuDoc.addEventListener("select", updateDocumentForSelectedMenuItem);
    
    
    menuBarDocument = menuDoc;
    return menuDoc;
}

function printSelectedMenuItem(event) {
    const targetElem = event.target;
    
    console.log("Select Event: ", event);
    console.log(targetElem.nodeName);
    console.log(targetElem.innerHTML);
}

function updateDocumentForSelectedMenuItem(event) {
    const targetElem = event.target;
    
    //const title = targetElem.getElementsByTagName().item(0).textContent;
    var title = targetElem.textContent;
    var tabDocument;
    const description = `Description for ${title}`;
    
    var menuId = targetElem.getAttribute("id");
        // Don't update tab content for now playing or tracks tabs.
    if (menuId === "nowPlaying") {
        return
    } else if (menuId === "tracks") {
        tabDocument = createTracksDocument();
    } else {
        tabDocument = createAlert(title, description);
    }
    
    
    const menuBarElem = menuBarDocument.getElementsByTagName("menuBar").item(0);
    const menuItemElem = event.target;
    const menuBarFeature = menuBarElem.getFeature("MenuBarDocument");
    
    menuBarFeature.setDocument(tabDocument, menuItemElem);
}


function playSelectedLockup(event) {
    const targetElem = event.target;
    // Convert the URL on the lockup from relative to absolute with the DocumentLoader
    const audioURL = targetElem.getAttribute("audioURL");
    if (audioURL) {
        // Prepare an Audio MediaItem with metadata from the lockup...
        const mediaItem = new MediaItem("audio", audioURL);
        // Assign the artwork metadata
        const imgElem = targetElem.getElementsByTagName("img").item(0);
        if (imgElem && imgElem.hasAttribute("src")) {
            mediaItem.artworkImageURL = imgElem.getAttribute("src");
        }
        // Assign the title metadata
        const titleElem = targetElem.getElementsByTagName("title").item(0);
        if (titleElem) {
            mediaItem.title = titleElem.textContent;
        }
        // Create a Player and assign the MediaItem to its Playlist
   
        const player = new Player();
        player.playlist = new Playlist();
        player.playlist.push(mediaItem);
        // Present the player and start playback
        player.play();
    }
}

function changeMenuItemTitle(event) {
    const menuItemElem = menuBarDocument.getElementById("tracks");
    const titleElem = menuItemElem.getElementsByTagName("title").item(0);
    titleElem.textContent = "Updated Title for Tracks"; // "Updated Title for Tracks";
}

function changeNowPlayingTitle(event) {
    const menuItemElem = menuBarDocument.getElementById("nowPlaying");
    const titleElem = menuItemElem.getElementsByTagName("title").item(0);
    titleElem.textContent = "Updated Title for NowPlaying"; // "Updated Title for Tracks";
}
