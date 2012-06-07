Docs = {
	base : 'http://php.net',
	functionList : {},
	functionDetails : {},
	getFunctions : function(callback) {

		var site = Docs.base + '/quickref.php';
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + site + '"') + '&format=xml';

		$.ajax({
			url : yql,
			dataType : 'jsonp',
			success : function(data) {
				if(data.results[0]) {
					$(data.results[0]).find('#quickref_functions a').each(function() {
						var functionName = $(this).text();
						Docs.functionList[functionName] = {
							name : functionName,
							link : Docs.base + $(this).attr('href')
						};
					});
					callback(Docs.functionList);
				}
			}
		});
	},
	getDetails : function(name, callback) {
		if(Docs.functionList[name]) {

			var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from html where url="' + Docs.functionList[name].link + '"') + '&format=xml';

			$.ajax({
				url : yql,
				dataType : 'jsonp',
				success : function(data) {
					$data = $(data.results[0]);
					$data = $data.find('.refentry');

					var para = [];
					$('.parameters .term .parameter', $data).each(function() {
						para.push($.trim($(this).text()));
					});
					var details = {
						synopsis : $.trim($('.methodsynopsis', $data).text()),
						description : $.trim($('.rdfs-comment', $data).text()),
						parameters : para,
						returnValues : $.trim($('.returnvalues .para', $data).text())
					};
					Docs.functionDetails = details;

					callback(Docs.functionDetails);
				}
			});
		}
	}
};
