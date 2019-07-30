# tvmlmenubarcrash
This test project demonstrates some bugs that exists with using nowPlayingMenuItem in a menuBarTemplate with a TVML application.tvOS 13 beta

## Summary
When nowPlayingMenuItem element is used in menuBarTemplate, while playing audio "Now Playing" appears in the menu bar. Some interactions causes the nowPlayingMenuItem disappear and crash the app. 

## Steps to Reproduce

### Issue 1
1. Run the project. TVML JavaScript source is included in the bundle so you do not need an http server.
2. Start playing one of the tracks.
3. Press menu button a couple times to go back to the home screen of tvOS.
4. Open app again.
5. Observe that while audio is still playing, now playing menu dissappeared.
6. Furthermore, if you try to play another track App Will crash.

### Issue 2
1. Run the project. TVML JavaScript source is included in the bundle so you do not need an http server.
2. Start playing one of the tracks.
3. Select one of the buttons and press. Tjhese buttons update the text show in "Tracks" menuitem or "nowPlayingMenuItem"
4. Observe that the now playing menu item has disappeared.
5. Similar to issue 1, trying to play a track again crashes the app.




