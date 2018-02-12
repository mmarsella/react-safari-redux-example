# safari-react-redux
A safari implementation of chrome-react-redux

This is a simple example demonstrating the functionality of safari-react-redux.  

To get the extension up and running, please be in the root directory and do the following:

1)  `npm install`
2)  `gulp build`   --> Will create a build.safariextension directory.
3)  Open Safari    -->  In the 'Develop' tab, click on "show extension builder"
4)  In the bottom right corner of the extension builder, click the "+" and select "add extension.  Point 
    to build.safariextension.
5)  Once the build is loaded into extension builder, click "install" for this build.
6)  Once installed, click "Inspect Global Page" to view the extension's background page.


*** This extension uses redux-logger to display the current state of the store. ***

The store can be changed by:

-  Adding a new tab in the browser --> Add a tab object to the store
-  Removing a tab in the browser   --> Removes a tab object from the store.
-  Clicking on the toolbar button on any tab will increment a `count` field for that specific tab in the store
-  Toggling to a new tab will set the store's `currentTabId` to that specific tab's ID.


Note:

I wrote a helper library to attach IDs to Safari tabs which wrapStore.js relies on.
