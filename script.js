/**
 * Date: 06-11-2022
 * Author: MD Yaisn
 * Description: Color picker application with huge DOM functionalities
 */

// globals
var toastMessage = null;
var defultPresetColors = [
	'#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
	'#80B300', '#809900'
];
var clickAudio = new Audio("./copy.mp3");
let customColors = new Array(12);

// onload handler
window.onload = () => {
	main();
	inputDefultValues();
	//display preset color
	displayPresetColor(document.getElementById("preset-color-container"), defultPresetColors);
	const customColorsStirng = localStorage.getItem("custom-colors");
	if (customColorsStirng) {
		customColors = JSON.parse(customColorsStirng);
		displayPresetColor(document.getElementById("custom-color-container"), customColors);
	}
};

// main or boot fuction, this function will take care of getting all the DOM referances
function main() {

	// dom references
	var randomColorBtn = document.getElementById("random-color-btn");
	var hexInput = document.getElementById("hex-input");
	var colorSliderRed = document.getElementById("color-slider-red");
	var colorSliderGreen = document.getElementById("color-slider-green");
	var colorSliderBlue = document.getElementById("color-slider-blue");
	var copyBtn = document.getElementById("copy-btn");
	var saveToCuntomBtn = document.getElementById("save-btn");
	var presetColorContainer = document.getElementById("preset-color-container");
	var customColorContainer = document.getElementById("custom-color-container");
	var bgInput = document.getElementById("bg-file-input");
	var bgInputControl = document.getElementById("bg-input-control");
	var bgPreview = document.getElementById("bg-preview");
	var bgRemoveBtn = document.getElementById("bg-remove-btn")
	var bgCustomizationOptions = document.getElementById("bg-customization");

	// event listeners
	randomColorBtn.addEventListener("click", handleRandomColorBtn);
	hexInput.addEventListener("keyup", handleHexInpEvent);
	colorSliderRed.addEventListener("change", handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
	colorSliderGreen.addEventListener("change", handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
	colorSliderBlue.addEventListener("change", handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
	copyBtn.addEventListener("click", handleCopyBtn);
	presetColorContainer.addEventListener("click", handlePresetColorContainer);
	saveToCuntomBtn.addEventListener("click",handleSaveToCuntomBtn(customColorContainer, hexInput));
	customColorContainer.addEventListener("click", handlePresetColorContainer);
	bgInputControl.addEventListener("click", function() {
		bgInput.click();
	});
	bgInput.addEventListener("change", bgInputHandler(bgPreview, bgRemoveBtn, bgCustomizationOptions));
	bgRemoveBtn.addEventListener("click", bgRemoveBtnHandler(bgPreview, bgRemoveBtn, bgInput, bgCustomizationOptions));
	document.getElementById("bg-size").addEventListener("change", bgCustomize);
	document.getElementById("bg-repeat").addEventListener("change", bgCustomize);
	document.getElementById("bg-position").addEventListener("change", bgCustomize);
	document.getElementById("bg-attachment").addEventListener("change", bgCustomize);
};

// event handlers
function handleRandomColorBtn() {
	const color = generateColorDacimal();
	updateColorCodeToDom(color);
}
function handleHexInpEvent(e) {
	const inpHexColor = e.target.value;
	if (inpHexColor) {
		this.value = inpHexColor.toUpperCase();
		if(isValidHex(inpHexColor)){
			const color = hexToDecimal(inpHexColor);
			updateColorCodeToDom(color);
		}
	}
}
function handleColorSliders(red, green, blue) {
	return function() {
		const color = {
			red: parseInt(red.value),
			green: parseInt(green.value),
			blue: parseInt(blue.value)
		}
		updateColorCodeToDom(color);
	}
}
function handleCopyBtn() {
	var copyModeRadios = document.getElementsByName("color-mode");
	const mode =  getCheckedValueFromRadios(copyModeRadios);
	if (mode === null){
		alert("Select a copy mode!");
	}
	if (toastMessage !== null) {
		toastMessage.remove();
		toastMessage = null;
	}
	if (mode === "hex"){
		hexColor = document.getElementById("hex-input").value;
		if (hexColor && isValidHex(hexColor)) {
			window.navigator.clipboard.writeText(`#${hexColor}`);
			dynamicToastMsg(`#${hexColor}`)
		}else {
			alert("Invalid Hex!");
		}
	}else{
		rgbColor = document.getElementById("rgb-input").value;
		window.navigator.clipboard.writeText(rgbColor);
		dynamicToastMsg(rgbColor)
	}
	
}
function handlePresetColorContainer(event) {
	const child = event.target;
	if (toastMessage !== null) {
		toastMessage.remove();
		toastMessage = null;
	}
	if(event.target.className === "preset-color") {
		hex = child.getAttribute("data-color");
		navigator.clipboard.writeText(hex);
		clickAudio.volume = 0.2;
		clickAudio.play();
		dynamicToastMsg(hex);
	}
}
function handleSaveToCuntomBtn(customColorContainer, hexInput) {
	return function () {
		hexColor = hexInput.value;
		if (customColors.includes(`#${hexColor}`)) {
			alert("Already Saved!");
			return;
		}
		if (hexColor && isValidHex(hexColor)) {
			customColors.unshift(`#${hexColor}`);
		}else {
			alert("Invalid Hex!");
		}
		if (customColors.length > 12) {
			customColors = customColors.slice(0,12);
		}
		localStorage.setItem("custom-colors", JSON.stringify(customColors));
		removeAllChilds(customColorContainer);
		displayPresetColor(customColorContainer, customColors);
	} 
}
function bgInputHandler(bgPreview, bgRemoveBtn, bgCustomizationOptions) {
	return function(event) {
		const file = event.target.files[0];
		const imgUrl = URL.createObjectURL(file);
		bgPreview.style.background = `url(${imgUrl})`;
		document.body.style.background = `url(${imgUrl})`;
		bgRemoveBtn.style.display = "inline";
		bgCustomizationOptions.style.display = "block";
	}
}
function bgRemoveBtnHandler(bgPreview, bgRemoveBtn, bgInput, bgCustomizationOptions) {
	return function() {
		bgPreview.style.background = "none";
		bgPreview.style.background = "#bcd6f3";
		document.body.style.background = "none";
		document.body.style.background = "#bcd6f3";
		bgRemoveBtn.style.display = "none";
		bgInput.value = null;
		bgCustomizationOptions.style.display = "none";
	}
}

// DOM functions

/**
 * set defult values on input box
 */
function inputDefultValues() {
	color = {red: 221, green: 221, blue:221};
	updateColorCodeToDom(color);
}
/**
 * update dom elements with calculated values
 * @param {object} color 
 */
function updateColorCodeToDom(color) {
	const hexColor =  generateHexColor(color);
	const rgbColor =  generateRGBColor(color);

	document.getElementById("color-display").style.backgroundColor = `#${hexColor}`;
	document.getElementById("hex-input").value = hexColor;
	document.getElementById("rgb-input").value = rgbColor;
	document.getElementById("color-slider-red-label").innerText = color.red;
	document.getElementById("color-slider-red").value = color.red;
	document.getElementById("color-slider-green-label").innerText = color.green;
	document.getElementById("color-slider-green").value = color.green;
	document.getElementById("color-slider-blue-label").innerText = color.blue;
	document.getElementById("color-slider-blue").value = color.blue;
}
/**
 * find checked element form a list of radio buttons
 * @param {array} nodes
 * @returns {string / null}
 */
function getCheckedValueFromRadios(nodes) {
	let checkedValue = null;
	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].checked) {
			checkedValue = nodes[i].value;
			break;
		}
	}
	return checkedValue;
}

/**
 * generate a toast message
 * @param {string} msg 
 */
function dynamicToastMsg(colorCode) {
	toastMessage = document.createElement("div");
	toastMessage.className = "toast-message toast-animation-slide-in";
	toastMessage.innerText = colorCode;
	document.body.appendChild(toastMessage);
	toastMessage.addEventListener("click", function() {
		toastMessage.classList.remove("toast-animation-slide-in");
		toastMessage.classList.add("toast-animation-slide-out");
		
		toastMessage.addEventListener("animationend", function() {
			toastMessage.remove();
			toastMessage = null;
		});
	});
};

/**
 * create preset color element
 * @param {string} color 
 * @returns {object}
 */
function generatePresetColor(color) {
	const div = document.createElement("div");
	div.className = "preset-color";
	div.setAttribute("data-color", color);
	div.style.backgroundColor = color;

	return div
}

/**
 * create and append new color boxer to its parent
 * @param {object} parent 
 * @param {array} color 
 */
function displayPresetColor(parent, color) {
	color.forEach((color) => {
		if (color){
			const colorBox = generatePresetColor(color);
			parent.appendChild(colorBox)
		}
		
	});
}

/**
 * remove all child from parent
 * @param {object} color 
 */
function removeAllChilds(parent) {
	let child = parent.lastElementChild;
	while(child) {
		parent.removeChild(child);
		child = parent.lastElementChild;
	}
}

/**
 * update background style of fild
 * @param {object} fild 
 */
function bgCustomize() {
	document.body.style.backgroundSize = document.getElementById("bg-size").value;
	document.body.style.backgroundRepeat = document.getElementById("bg-repeat").value;
	document.body.style.backgroundPosition = document.getElementById("bg-position").value;
	document.body.style.backgroundAttachment = document.getElementById("bg-attachment").value;
}

// utilities

/**
 * generate three random decimal number for red, green and blue. return as an object
 * @returns {object}
 */
function generateColorDacimal() {
	const red = Math.floor(Math.random() * 255);
	const green = Math.floor(Math.random() * 255);
	const blue = Math.floor(Math.random() * 255);
		
	return {red, green, blue}
}


/**
 * take a color object of three decimal color and return as hex color code
 * @param {object} color 
 * @returns {string}
 */
function generateHexColor({red, green, blue}) {
	function getTwoCode(value) {
		const hex = value.toString(16);
		
		return hex.length == 1 ? `0${hex}` : hex;
	};
		
	return `${ getTwoCode(red)}${ getTwoCode(green)}${ getTwoCode(blue)}`.toUpperCase();
}

	
/**
 * take a color object of three decimal color and return as RGB color code
 * @param {object} color 
 * @returns {string}
 */
function generateRGBColor({red, green, blue}) {
	
	return `rgb(${red}, ${green}, ${blue})`;
}


/**
 * convert hex to decimal color and return as object
 * @param {string} hex
 * @returns {object} color
 */
function hexToDecimal(hex) {
	const red = parseInt(hex.slice(0, 2), 16);
	const green = parseInt(hex.slice(2, 4), 16);
	const blue = parseInt(hex.slice(4), 16);
	
	return {red, green, blue}
}


/**
 * validate hex color code
 * @param {string} color 
 * @returns {boolean}
*/

function isValidHex(color) {
	if (color.length !== 6) return false;
	
	return /[0-9A-Fa-f]{6}$/i.test(color);
};