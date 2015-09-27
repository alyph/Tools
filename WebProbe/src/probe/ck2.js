// Module("CK2 Modding",
// {
// 	eventTypes:
// 	{
// 		url: "http://www.ckiiwiki.com/Event_modding"
// 		tableHeaders: ["Type"]
// 	},

// 	onActionTriggers:
// 	{

// 	},

// 	headers:
// 	{
// 		extra: ["namespace"],
// 		include: ["eventTypes", "onActionTriggers"]
// 	}
// });


var ck2 = new (function()
{
	var collector = [];
	var waiting = 0;
	var finished = null;

	this.getProperties = function()
	{
		add("id, name, trigger, major_trigger, mean_time_to_happen, weight_multiplier, immediate, option, limit, ai_chance, flag, days, months, years, factor, who, modifier, than, which, value, hidden, duration, chance, tooltip_info, custom_tooltip, text");
		search("http://www.ckiiwiki.com/Event_modding", ["Flag"]);
		finalize();
	};

	this.getScopes = function()
	{
		search("http://www.ckiiwiki.com/Scopes", ["Scope"]);
		finalize();
	};

	this.getConditions = function()
	{
		search("http://www.ckiiwiki.com/Event_modding", ["Trigger"]);
		search("http://www.ckiiwiki.com/Conditions", ["Condition"]);
		finalize();
	};

	this.getCommands = function()
	{
		add("if, trigger_switch, break");
		search("http://www.ckiiwiki.com/Commands", ["Command"]);
		finalize();
	};

	function add(names)
	{
		collector.push(names.split(/\s*,\s*/));
	};

	function search(url, headers)
	{
		var selectors = [];
		for (var i = 0; i < headers.length; i++) 
		{
			selectors.push("table:has(th:first-child:contains(" + headers[i] + ")) > tbody > tr > td:first-child");
		};				

		var index = collector.length;
		var names = collector[index] = [];
		waiting++;
		Probe.searchTableColumnOne(url, selectors.join(", "), function(matches) 
		{ 
			for (var i = 0; i < matches.length; i++) 
			{
				var tokens = matches[i].split(/\s+/);
				for (var j = 0; j < tokens.length; j++) 
				{
					names.push(tokens[j]);
				};
			};

			waiting--;
			if (waiting <= 0 && finished !== null)
			{
				finished();
			}
		});
	};

	function finalize()
	{
		ready(function(){ print();});
	}

	function ready(callback)
	{
		if (waiting <= 0)
		{
			callback();
		}
		else
		{
			finished = callback;
		}
	};

	function print()
	{
		for (var i = 0; i < collector.length; i++) 
		{
			console.log(collector[i]);
		};

		var list = collect();

		console.log(list.join("|"));
	};

	function collect()
	{
		var list = [];
		for (var i = 0; i < collector.length; i++) 
		{
			var matches = collector[i];
			if (matches)
			{
				for (var j = 0; j < matches.length; j++) 
				{
					var match = matches[j];
					if (match && match[0] === '%')
						continue;

					if (list.indexOf(match) === -1)
					{
						list.push(match);
					}
				};
			}
		};

		collector = [];
		return list;
	};

})();