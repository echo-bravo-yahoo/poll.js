/**
* optionHandler holds all the charts data and functions for
* updating and adding options
*/
var optionHandler = function(){
this.myDefault = null;
this.chartOptions = null;
this.chartID = "charty";
this.array = [];
this.size = 0;
this.pointer = 0;
this.visTypes = null;
this.addChart = function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	// c.container = container;
	this.array.push(c);
	var chartyID = this.chartID + (this.size);
	visframes.addBasic(container,"item","topid","tumbchart", chartyID);
	this.array[this.size].container = "#"+chartyID;
	this.size++;
	return this.array.length-1;
},
this.addGridChart = function(container){
	var c = JSON.parse(JSON.stringify(defaultOptions));
	c.container = container;
	this.array.push(c);
	this.size++;
	return this.array.length-1;
},
this.updateOption = function(index, opt, value ){
	this.array[index][opt] = value;
},
this.addOptions = function(id,options){
/*	if(this.myDefault ==null){
		this.myDefault = defaultOptions;
	}*/

	for(key in options){
		this.array[id][key]= options[key];
	}
},
this.isMobile = function(){
	if(window.innerWidth<400){
		defaultOptions.mobile=true;
		defaultOptions.legendOffset = 40;
	}
},
this.getOption = function(index){
	return this.array[index];
}
this.checkTitle = function(id){
	console.log("CHECK CHECK");
	if(this.array[id].title!=null){
		console.log("ADDING");
				console.log($(this.array[id].container).parent());
		$(this.array[id].container).parent().prepend("<h2>"+this.array[id].title+"</h2>");
	}
}
}
/**
* if no option is specified default options are used
*/
var defaultOptions = {
	div : null,
	c3 : null,
	classname : null,
	chart : null,
	id: null,
	chartOptions : null,
	container: null,
	orgmatrix : null,
	matrix: null,
	tooltip : true,
	legend : true,
	axis : true,
	colorscheme : 0,
	ylabel: null,
	xlabel: null,
	mobile:false,
	legendOffset : 80,
	visualization: null,
	color:0,
	interaction : true,
	transformation : null,
	answer : null,
	questions : [],
	title:  null,
	info : null,
	title2 : null,
	info2 : null,
	norm : false,
	norm2 : false,
	correlation : null,
	independence: null,
  	legendMargin : 0,
   	swap: false,
}