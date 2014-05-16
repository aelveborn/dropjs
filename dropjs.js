/* Dropjs
 *
 * Created by Andreas Älveborn, http://aelveborn.com
 * Fork it on Github https://github.com/aelveborn/dropjs
 *
 * Licensed under MIT
 */

/*
 * File types:
 * HTML 		text/html
 * MD 			text/x-markdown
 * Javascipt 	application/javascript
 */

 (function () {

	/* Default settings
	 * ====================== */

 	var settings = { 		
 		debug: false,						// Debug mode, prints to console
 		//readFiles: true,					// If all files should be read
 		fileTypes: [],						// Sepcify allowed file types, empty array allows all
 		fileSize: undefined,				// Max file size in bytes
 		hoverClass: "hover",				// Class added to the element on hover
 		onDrop: onDrop,						// Triggers when files are dropped
 		//onRead: onRead,						// Triggers when files has been read
 		onHover: onHover,					// Triggers when you hover the drop area
 		onHoverEnd: onHoverEnd				// Triggers when you stop hover or cancel with excape
 	};

	function setSettings(args) {
 		if(args.debug != undefined)			settings.debug = args.debug;
 		if(args.readFiles != undefined)		settings.readFiles = args.readFiles;
 		if(args.fileTypes != undefined)		settings.fileTypes = args.fileTypes; 		
 		if(args.fileSize != undefined)		settings.fileSize = args.fileSize;
 		if(args.hoverClass != undefined)	settings.hoverClass = args.hoverClass;
 		if(args.onDrop != undefined)		settings.onDrop = args.onDrop;
 		//if(args.onRead != undefined)		settings.onRead = args.onRead;
 		if(args.onHover != undefined)		settings.onHover = args.onHover;
 		if(args.onHoverEnd != undefined)	settings.onHoverEnd = args.onHoverEnd;
 	};	


 	/* Overridable functions
	 * ====================== */

	function onDrop(files) {
		if(settings.debug) console.log("onDrop has not been overrided");
	};
	/*function onRead(files) {
		if(settings.debug) console.log("onRead has not been overrided");
	};*/
	function onHover(element) {
		if(settings.debug) console.log("onHover has not been overrided");
	};
	function onHoverEnd(element) {
		if(settings.debug) console.log("onHoverEnd has not been overrided");
	};


	/* Constructor functions
	 * ====================== */
/*
	File.prototype.readAsDataUrl = function() {
		var reader = new FileReader();
		reader.onload = function(e) {
			settings.onRead(reader.result);
		}
		reader.readAsDataURL(this);
	};
	File.prototype.readAsBinary = function() {
		var reader = new FileReader();
		reader.onload = function(e) {
			settings.onRead(reader.result);
		}
		reader.readAsBinaryString(this);
	};
	File.prototype.readAsText = function() {
		var reader = new FileReader();
		reader.onload = function(e) {
			settings.onRead(reader.result);
		}
		reader.readAsText(this);
	};
	File.prototype.readAsArrayBuffer = function() {
		var reader = new FileReader();
		reader.onload = function(e) {
			settings.onRead(reader.result);
		}
		reader.readAsArrayBuffer(this);
	};
	*/


	/* Dropjs
	 * ====================== */

 	$.fn.dropjs = function(args) { 
 		setSettings(args);

 		$(this).each(function () {
 			$(this).on('dragstart', dragStart);
 			$(this).on('dragover', dragEnter);
			$(this).on('dragenter', dragEnter);
			$(this).on('dragend', dragEnd);
			$(this).on('drop', drop);
 		});
 	};

 	function dragStart(e){
    	e.dataTransfer.setData('text/plain', 'This file may be dragged')
	};

 	function dragEnter(e) {
 		e.preventDefault();
		e.stopPropagation();

		$(e.currentTarget).addClass(settings.hoverClass);
		settings.onHover(e);
 	};

	function dragEnd(e) {
 		e.preventDefault();
		e.stopPropagation();
		
		$(e.currentTarget).removeClass(settings.hoverClass);
		settings.onHoverEnd(e);
 	};

	function drop(e) {
		if(e.originalEvent.dataTransfer && 
			e.originalEvent.dataTransfer.files.length) {
			e.preventDefault();
			e.stopPropagation();

			processFiles(e.originalEvent.dataTransfer.files);
		}
		$(e.currentTarget).removeClass(settings.hoverClass);
	};

	function processFiles(files) {

		// Debug
		if(settings.debug) {
			console.log("All dropped files:");
			write(files);
		}
		
		// Removes files of wrong file type and size
		files = fileTypes(files);
		files = fileSize(files);

		// Debug
		if(settings.debug) {
			console.log("Accepted files:");
			write(files);
		}	

		// Read the files
		//readFiles(files);

		// Function after drop
		settings.onDrop(files);
	}


	// Reads the files and invokes onRead with the file
	/*
	function readFiles(files) {
		$.each(files, function(index, file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				settings.onRead(reader.result);
			}
			reader.readAsText(file);
		});
	};
	*/

	// Removes wrong file types
	function fileTypes(items) {
		if(settings.fileTypes.length == 0)
			return items;

		var result = [];
		for (var i = 0; i < items.length; i++) {
			for (var j = 0; j < settings.filetypes.length; j++) {

				if(settings.fileTypes[j] == items[i].type) {
					result.push(items[i]);
					j = settings.fileTypes.length;
				}

			}
		}
		
		return result;
	};

	// Removes files that's too big
	function fileSize(items) {
		if(settings.fileSize == undefined ||
			settings.fileSize <= 0)
			return items;

		var result = [];
		for (var i = 0; i < items.length; i++)
			if(items[i].size <= settings.fileSize)
				result.push(items[i]);
		return result;			
	};

	// Writes out the files, used for debug
	function write(items) {
		if(items === undefined) return;
		$.each(items, function(index, item) {
			console.log(item.size + " bytes\t" + item.name + "\t" + item.type);
		});
	};

 })();