var tegels = [];
$(document).ready(()=>{

	$("#testType").css("font-family", $("#font").val());

	$("#font").change(function(){
		$("#testType").css("font-family", this.value);
	});


	$("#maak").click(()=>{
		var qoute = $("#qoute").val();
		var name = $("#naam").val();
		var tegel = $("#tegel").val();
		var kleur = $("#kleur").val();
		var type = $("#font").val();
		var tegelObj = {
			qoute:qoute,
			naam:name,
			tegel:tegel,
			kleur:kleur,
			type:type
		}
		console.log(tegelObj);
		$.post("/tegelfabriek/nieuweTegel", tegelObj, (data)=>{
			console.log(data);
			window.location += data;
		});
	});


	$(document).on("click", ".removeListItem", function(){
		$(this).parent().parent().remove();
	});


	$("#toevoegen").click(()=>{
		var qoute = $("#qoute").val();
		var name = $("#naam").val();
		var tegel = $("#tegel").val();
		var kleur = $("#kleur").val();
		var type = $("#font").val();
		var tegelObj = {
			"qoute":qoute,
			"naam":name,
			"tegel":tegel,
			"kleur":kleur,
			"type":type
		}
		tegels.push(tegelObj);
		$("#qoutes tbody").append(`
			<tr><td id="qouteRow">${qoute}</td><td id="nameRow">${name}</td><td id="removeRow"><button class="removeListItem" onclick="tegels.splice(${tegels.length-1},1)">x</button></td></tr>
			`);
	});


	$("#maakLinked").click(()=>{
		$.ajax({
	    type: 'POST',
	    url: '/tegelfabriek/nieuweTegelLinked/',
	    data: JSON.stringify({tegels:tegels}),
	    success: (data)=>{
				console.log(data);
				window.location += data
			},
	    contentType: "application/json",
	    dataType: 'json',
			error: (err) =>{
				console.log("Error");
				console.log(err);
			}
		});
	});
});
