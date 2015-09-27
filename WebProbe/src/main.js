(function()
{
	head.ready(function()
	{
		//ck2.getProperties();
		//ck2.getConditions();
		//ck2.getCommands();
		ck2.getScopes();
	});

	var libs = "src/libs/";
	var probe = "src/probe/"

	head.load(
		libs + "jquery-2.0.3.js",
		libs + "jsface.js",
		probe + "probe.js",
		probe + "ck2.js");	

})();

