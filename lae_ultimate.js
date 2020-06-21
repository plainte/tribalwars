let url = window.location.href;
if (!url.includes("am_farm")) {
    let id = window.game_data.village.id;
    window.location.href = "https://" + window.location.host + "/game.php?village=" + id.toString() + "&screen=am_farm";
}

const errorThreshold = 10;

let avoidStuck = 0;
let nextVilla = false;

function enhancer() {
  console.log('get script');
  $.get('https://plainte.github.io/tribalwars/la_enhancer.js');
}


function lightCAmount() {
  return window.top.Accountmanager.farm.current_units["light"];
}


function resetStuckCounter() {
    avoidStuck = 0;
}

function avoidGettingStuck() {
    if (lightCAmount() < 4) {
        ++avoidStuck;
        console.log('Warning: ' + avoidStuck + '/' + errorThreshold);
        if (avoidStuck == errorThreshold) {
            console.log('Avoiding stuck...');
            nextVilla = true;
        }
    } else {
        resetStuckCounter();
    }
}

function allRowsHidden() {
	let t = window.top.$("#plunder_list tr").filter(":visible").eq(1);
	let hasVisible = t.html();
	if (!hasVisible) {
			console.log("All rows hidden...");
			nextVilla = true;
			resetStuckCounter();
	}
}


async function nextVillage() {
    resetStuckCounter();
    await getNewVillage("n");
	  nextVilla = false;
		await new Promise(r => setTimeout(r, 10000));
}

async function run() {    
    await enhancer();
    console.log('loaded, enchanced');
	  await new Promise(r => setTimeout(r, 10000));
     
    while (true) {
			if (nextVilla) {
					await nextVillage();
			} 
			avoidGettingStuck();
			allRowsHidden();
			await new Promise(r => setTimeout(r, 250));
    }
}

run();