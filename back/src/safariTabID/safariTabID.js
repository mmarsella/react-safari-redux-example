let ID_COUNTER = 1;
export default {
	checkAllTabsForID: function(){
		if(safari.application.activeBrowserWindow){
			safari.application.activeBrowserWindow.tabs.forEach(function(tab,i){
				if(!safari.application.activeBrowserWindow.tabs[i].id){
					tab.id = ID_COUNTER;
					ID_COUNTER++;
				}
			})
		}
	},
	getTab: function(tabID, cb){
		const tabs = safari.application.activeBrowserWindow.tabs;
		for(let i=0; i < tabs.length; i++){
			if(tabs[i].id === tabID){
				if(cb){
					cb(tabs[i]);
				}
				return tabs[i];
			}	
		}
	}
}