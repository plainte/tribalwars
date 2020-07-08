javascript:
var supp_data;
var progress = 0;
var units = game_data.units;
var total_units = {};
for (let key in units) {
	let unit_type = units[key];
	total_units[unit_type] = 0;
}

alw_check_commands();
get_incomming_supports();

function createTable(){
    let body = document.getElementById("content_value");
        tbl  = document.createElement('table');
        tbl.className = "vis";
        tbl.id = "incomings_summary";
        tbl.style = "margin-left:auto; margin-right:auto;"
		debugger;
    for(let i = 0; i < 2; i++){
        let tr = tbl.insertRow();
        debugger;
        for(let key = 0; key < units.length; key++){
        	if (i == 0) {
        		let td = tr.insertCell();
        		td.style = "text-align:center";
        		td.width = "35";
        		let img = document.createElement('img');
						img.src = "https://dshu.innogamescdn.com/asset/cf618eb/graphic/unit/unit_" + units[key] + ".png";
						td.appendChild(img);
					} else {
						let td = tr.insertCell();
						td.appendChild(document.createTextNode(total_units[units[key]]));
					}
        }
    }
    body.prepend(tbl);
    let inc = document.getElementById("incomings_summary");
    inc.scrollIntoView(false);
}


//---->INCOMMING_SUPPORTS<----
function get_incomming_supports(){
	if(progress == 0){
		supp_data = $("span[data-command-type='support']");
	}
	if(progress >= supp_data.length){
		createTable();
		return;
	}

	$.ajax({url: "https://" + document.location.host + "/game.php?village=" + game_data.village.id + "&screen=info_command&ajax=details&id=" + $(supp_data).eq(progress).attr("data-command-id"), async: true, success: function(result){
		if (result != '{"no_authorization":true}'){
			let data = JSON.parse(result);
			let sp_d_cont = $(supp_data[progress]).parent().siblings(".quickedit-label").eq(0);
			let html = "";
			for(let x = 0; x < units.length; x++){
				let unit_type = units[x];
				let unit_count = data.units[units[x]].count;
				if(unit_type == "militia" || unit_count == "0")
					continue;
				html += `<img src="https://dshu.innogamescdn.com/asset/cf618eb/graphic/unit/unit_${unit_type}.png">${unit_count} `;
				total_units[unit_type] += parseInt(unit_count);
			}
			$(sp_d_cont).html(html);
		}
		++progress;
		setTimeout(get_incomming_supports, 25);
	}})
}

function alw_check_commands(){
	$("span").each(function(){
		if($(this).text().indexOf("0:00:1") > -1 || $(this).text().indexOf("0:00:0") > -1){
			$(this).parent().parent().remove();
		}
	});
	setTimeout(alw_check_commands, 6000);
}