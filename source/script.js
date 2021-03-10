"use strict";

function q(query){
	return document.querySelector(query);
}

function p(number){
	return number.toString().padStart(2, "0");
}

async function parsePaste(event){
	const regex = /(?<frontDelimiter>\b|\s|\D|^)(?<hour>[01]\d(?=[:;.,_ ])|2[0-3](?=[:;.,_ ])|\d(?=[:;.,_ ])|0(?=[0-5]\d)|[01]\d|2[0-3]|\d)[:;.,_\s]{0,3}(?<minute>[0-5]\d|\d?)(?<endDelimiter>\b|\s|\D|$)/mu;
	const match = (regex).exec(event.clipboardData.getData("Text"));
	const input = document.activeElement;
	
	if(input.tagName === "INPUT" && input.classList.contains("input") && match?.groups?.hour){
		input.value = `${p(match?.groups?.hour)}:${p(match?.groups?.minute || "00")}`;
		input.dispatchEvent(new Event("input"));
	}
}

async function togglePageState(validInput){
	if(validInput){
		document.body.classList.add("foutput");
		document.body.classList.remove("finput");
	}else{
		document.body.classList.remove("foutput");
		document.body.classList.add("finput");
	}
}

async function calculateHours(){
	const startInit = q("input#start").value.split(":", 2);
	const endInit = q("input#end").value.split(":", 2);
	const startRes = Number(startInit[0]) + (Number(startInit[1]) / 60);
	const endRes = Number(endInit[0]) + (Number(endInit[1]) / 60);
	let result = 0;
	if(startRes < endRes){
		result = endRes - startRes;
	}else{
		result = (24 - startRes) + endRes;
	}
	result = Math.round(result * 100) / 100;
	q("#result").value = result.toString().replace(".", ",");
}


async function prepareInputs(){
	const is = document.querySelectorAll("input.input");
	for(let i = 0; i < is.length; i++){
		is[i].addEventListener("input", () => {
			if(validateInputs()){
				calculateHours();
				togglePageState(true);
			}else{
				togglePageState(false);
			}
		});
	}
	document.addEventListener("paste", (event) => {
		event.preventDefault();
		parsePaste(event);
	});
	
	
	const as = [].slice.call(document.querySelectorAll("input.input"));
	const r = q("#result");
	as.push(r);
	for(const a of as){
		a.addEventListener("keydown", (event) => {
			if(event.key === "Enter"){
				event.preventDefault();
				copyResult();
			}
		});
	}
	q("#copy a").addEventListener("click", () => {
		copyResult();
	});
	
	r.addEventListener("input", () => {
		if(validateInputs()){
			calculateHours();
		}
	});
	r.addEventListener("mouseup", () => {
		setTimeout(() => {r.select();}, 10);
	});
}

async function copyResult(){
	if(!validateInputs()) return;
	
	q("#copy").classList.remove("pressed");
	setTimeout(() => {q("#copy").classList.add("pressed");}, 20);
	
	q("#result").select();
	document.execCommand("copy");
}

function validateInputs(){
	const is = document.querySelectorAll("input.input");
	let valid = true;
	for(let i = 0; i < is.length; i++){
		if(!is[i].value && !is[i].value.match(/^(?<timestamp>[01]\d|2[0123]|\d):\d{1,2}$/u)) valid = false;
	}
	return valid;
}

async function insertTime(){
	const d = new Date();
	d.setMinutes(d.getMinutes() + 1);
	
	q("input#end").value = `${p(d.getHours())}:${p(d.getMinutes())}`;
}
async function registerServiceWorker(){
	if ("serviceWorker" in navigator){
		navigator.serviceWorker.register("/serviceworker.js");
	}
}



document.addEventListener("DOMContentLoaded", () => {
	prepareInputs();
	insertTime();
	registerServiceWorker();
});
