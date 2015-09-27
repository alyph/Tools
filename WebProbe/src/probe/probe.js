var Probe = new (function(global)
{
	this.searchTableColumnOne = function(url, selector, callback)
	{
		gethtml(url, function(doc)
		{
			// var elems = doc.querySelectorAll("td:first-child");
			// var matches = [];
			// for (var i = 0; i < elems.length; i++) 
			// {
			// 	matches.push(elems[i].textContent.trim());
			// };

			var matches = $(selector, doc).map(function(){ return this.textContent.trim(); }).get();

			callback(matches);
		});
	};

	function gethtml(url, callback)
	{
		var iframe = document.createElement('iframe');
		iframe.src = encodeURI(url);
		iframe.onload = function()
		{
			callback(iframe.contentWindow.document);
			document.body.removeChild(iframe);
		};
		document.body.appendChild(iframe);

		// $.get('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data)
		// {
		// 	var doc = document.implementation.createHTMLDocument("sample");
		// 	doc.documentElement.innerHTML = data;
		// 	callback(doc);
		// });

		// $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
		// 	var doc = document.implementation.createHTMLDocument("sample");
		// 	doc.documentElement.innerHTML = data;
		// 	callback(doc);
		// });

		// var xhr = createCORSRequest('GET', 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?');
		// if (!xhr) 
		// {
		// 	alert('CORS not supported');
		// 	return;
		// }

		// xhr.onload = function()
		// {
		// 	var data = xhr.responseText;
		// 	var doc = document.implementation.createHTMLDocument("sample");
		// 	doc.documentElement.innerHTML = data;
		// 	callback(doc);
		// };

		// xhr.onerror = function() 
		// {
	 //    	alert('Woops, there was an error making the request.');
		// };

		// xhr.send();
	};

	// Create the XHR object.
	function createCORSRequest(method, url) 
	{
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) 
		{
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
		} 
		else if (typeof XDomainRequest != "undefined") 
		{
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} 
		else 
		{
			// CORS not supported.
			xhr = null;
		}
		return xhr;
	}

})(this);