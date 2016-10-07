function setTabs() {
	var tabsElements = {
		root : 'tabs',
		toggles : 'tabs-toggles',
		toggle : 'tabs-toggle',
		items : 'tabs-items',
		item : 'tabs-item'
	}

	var tabsStates = {
		ready : '__tabs--ready',
		itemsReady : '__tabs-items--ready',
		itemReady : '__tabs-item--ready',
		itemActive : '__tabs-item--active',
		toggleReady : '__tabs-toggle--ready',
		toggleActive : '__tabs-toggle--active',
	}

	var tabsDataAttributes = {
		startingIndex : 'tabs-starting-index',
		itemIndex : 'tabs-item-index',
		toggleIndex : 'tabs-toggle-index',
		toggleDestination : 'tabs-toggle-destination'
	}

	var tabs = $('.' + tabsElements.root).not('.' + tabsStates.ready);

	if(tabs.length > 0) {
		var hash = window.location.hash;

		tabs.each(function() {
			var tabsEach = $(this);

			var tabsToggles = getTabsElement(tabsEach, 'toggles', tabsElements, tabsStates);
			var tabsToggle = getTabsElement(tabsEach, 'toggle', tabsElements, tabsStates);
			var tabsItems = getTabsElement(tabsEach, 'items', tabsElements, tabsStates);
			var tabsItem = getTabsElement(tabsEach, 'item', tabsElements, tabsStates);

			if(tabsToggle.length > 0 && tabsItem.length > 0) {
				tabsEach.on({
					'tipi.tabs.switch' : function(event, tabs, index) {
						switchTabsItem(tabs, tabsElements, tabsStates, index)
					}
				});

				tabsEach.addClass(tabsStates.ready);
				tabsToggle.addClass(tabsStates.toggleReady);
				tabsItems.addClass(tabsStates.itemsReady);
				tabsItem.addClass(tabsStates.itemReady);

				var startingIndex = tabsEach.data(tabsDataAttributes.startingIndex);
				if(typeof startingIndex == 'undefined') {
					startingIndex = 0;
				} else if(isNaN(startingIndex)) {
					startingIndex = 0;
				}

				//Overrule the startingIndex if we have a hash after the page load
				if(typeof hash != 'undefined') {
					var hashElement = tabsItem.filter(hash);

					if(hashElement.length > 0 ) {
						startingIndex = hashElement.index();
					}
				}

				//Loop through all toggles and an index to it so we can select the correct item
				tabsToggle.each(function(index) {
					$(this).data(tabsDataAttributes.toggleIndex, index);
				});

				tabsToggle.on({
					click : function(event) {
						event.preventDefault();

						var toggle = $(this);
						var index = toggle.data(tabsDataAttributes.toggleIndex);
						var tabs = getTabsElement(toggle, 'root', tabsElements, tabsStates);

						if(typeof tabs != 'undefined' && typeof index != 'undefined') {
							if (tabs.length > 0) {
								tabs.trigger('tipi.tabs.switch', [tabs, index]);
							}
						}
					}
				});

				tabsEach.trigger('tipi.tabs.switch', [tabsEach, startingIndex, true]);
			}
		});
	}
}

function switchTabsItem(tabs, tabsElements, tabsStates, index) {
	var tabsToggles = getTabsElement(tabs, 'toggles', tabsElements, tabsStates);
	var tabsToggle = getTabsElement(tabs, 'toggle', tabsElements, tabsStates);
	var tabsItems = getTabsElement(tabs, 'items', tabsElements, tabsStates);
	var tabsItem = getTabsElement(tabs, 'item', tabsElements, tabsStates);

	if(typeof tabsToggle != 'undefined' && typeof tabsItem != 'undefined') {
		if(tabsToggle.length > 0 && tabsItem.length > 0) {
			tabsToggle.removeClass(tabsStates.toggleActive).eq(index).addClass(tabsStates.toggleActive);
			tabsItem.removeClass(tabsStates.itemActive).eq(index).addClass(tabsStates.itemActive);
		}
	}
}

function getTabsElement(origin, type, tabsElements, tabsStates) {
	if(typeof origin != 'undefined' && typeof type != 'undefined') {
		var element;

		switch(type) {
			case 'root' :
				element = origin.parents('.' + tabsElements.root).first();
				break;
			case 'toggles' :
				element = origin.find('.' + tabsElements.toggles).first();
			case 'toggle' :
				element = origin.find('.' + tabsElements.toggles).first().find('.' + tabsElements.toggle);
				break;
			case 'items' :
				element = origin.find('.' + tabsElements.items).first();
				break;
			case 'item' :
				element = origin.find('.' + tabsElements.items).first().find('.' + tabsElements.item).first().siblings().addBack();
				break;
			default:
				return;
		}

		return element;
	}
}