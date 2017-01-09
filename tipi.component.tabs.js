(function(win, doc, $) {
	window.setTabs = function()
	{
		var data = {
			elements : {
				root : 'tabs',
				toggles : 'tabs-toggles',
				toggle : 'tabs-toggle',
				items : 'tabs-items',
				item : 'tabs-item'
			},
			states : {
				ready : '__tabs--ready',
				item_ready : '__tabs-item--ready',
				item_active : '__tabs-item--active',
				toggle_active : '__tabs-toggle--active'
			},
			attributes : {
				start_at : 'tabs-start-at',
				toggle_index : 'tabs-toggle-index'
			}
		}

		var tabs = $('.' + data.elements.root).not('.' + data.states.ready);

		if(tabs.length === 0)
		{
			return;
		}

		doc.on({
			'tipi.tabs.toggle' : function(event, tabs, index, options) {
				toggleTabsToggle(tabs, index, data, options);
				toggleTabsItem(tabs, index, data, options);
			}
		});

		tabs.each(function() {
			var tabs = $(this);
			var toggles = getTabsElement(tabs, 'toggles', data);
			var toggle = getTabsElement(tabs, 'toggle', data);
			var items = getTabsElement(tabs, 'items', data);
			var item = getTabsElement(tabs, 'item', data);

			if(toggle.length === 0 || item.length === 0)
			{
				return;
			}

			//Set the options for each accordion
			var options = getTabsOptions(tabs, data);

			toggle.each(function(index) {
				$(this).data(data.attributes.toggle_index, index);
			});

			toggle.on({
				click : function(event)
				{
					var toggle = $(this);
					var tabs = getTabsElement(toggle, 'root', data);

					//Don't proceed if the accordion is not ready
					if(!tabs.hasClass(data.states.ready))
					{
						return;
					}

					event.preventDefault();
					var index = toggle.data(data.attributes.toggle_index);

					doc.trigger('tipi.tabs.toggle', [tabs, index, options]);
				}
			});

			if(options.start_at >= 0) {
				doc.trigger('tipi.tabs.toggle', [tabs, options.start_at, options]);
			}

			//Add the ready classes
			tabs.addClass(data.states.ready);
			items.addClass(data.states.items_ready);
			item.addClass(data.states.item_ready);
		});
	}

	function toggleTabsToggle(tabs, index, data, options)
	{
		var toggle = getTabsElement(tabs, 'toggle', data);

		if(toggle.length === 0)
		{
			return;
		}

		toggle.removeClass(data.states.toggle_active).eq(index).addClass(data.states.toggle_active);
	}

	function toggleTabsItem(tabs, index, data, options)
	{
		var item = getTabsElement(tabs, 'item', data);

		if(item.length === 0)
		{
			return;
		}

		item.removeClass(data.states.item_active).eq(index).addClass(data.states.item_active);
	}

	function getTabsOptions(tabs, data)
	{
		var options = {
			start_at : 0
		}

		if(typeof tabs.data(data.attributes.start_at) != 'undefined')
		{
			var starting_index = tabs.data(data.attributes.start_at);

			if(!isNaN(parseFloat(starting_index)))
			{
				options.start_at = starting_index;
			}
		}

		return options;
	}

	function getTabsElement(origin, type, data)
	{
		if(typeof origin == 'undefined' || typeof data.elements == 'undefined')
		{
			return;
		}

		var element = $();

		switch(type) {
			case 'root' :
				element = origin.parents('.' + data.elements.root).first();
				break;
			case 'toggles' :
				var toggles = origin.find('.' + data.elements.toggles);

				toggles.each(function() {
					var tabs = $(this).parents('.' + data.elements.root).first();

					if(!tabs.is(origin))
					{
						return;
					}

					element = element.add($(this));
				});

				break;
			case 'toggle' :
				var toggle = origin.find('.' + data.elements.toggle);

				toggle.each(function() {
					var tabs = $(this).parents('.' + data.elements.root).first();

					if(!tabs.is(origin))
					{
						return;
					}

					element = element.add($(this));
				});

				break;
			case 'items' :
				element = origin.find('.' + data.elements.items).first();

				break;
			case 'item' :
				element = origin.find('.' + data.elements.item).first().siblings().addBack();

				break;
			default:
		}

		return element;
	}

})( window.jQuery(window), window.jQuery(document), window.jQuery);