// Put this file in Program Files\Adobe\Photoshop\Presets\Scripts\
// In PhotoShop menu File > Automate > Scripts: layersToSprite.js

// Arrange layers into a sprite sheet. 

main();

function main()
{
	// quit if no documents
	if (documents.length <= 0) 
	{
		alert("No document opened!");
		return;
	}
	
	// grab active document
	var docRef = activeDocument;    
	var activeLayer = docRef.activeLayer;
	var numLayers = docRef.artLayers.length; 

	// save it, because we will discard the change made here
	try
	{
		docRef.save();
	}
	catch(err) // can fail if the file has never been saved
	{
		// TODO: we could instead continue by prompt a save as dialog
		alert("The document must have been saved at least once to proceed!");
		return;
	}
	

 	//layertext = "There are " + numLayers + " layers.";
 	//dialog{text:'Script Interface',bounds:[100,100,420,240],panel1:Panel{bounds:[10,10,310,100] , text:'Layers To Sprite' ,properties:{borderStyle:'etched',su1PanelCoordinates:true},			edittext0:EditText{bounds:[170,50,220,70] , text:cols ,properties:{multiline:false,noecho:false,readonly:false}}, statictext0:StaticText{bounds:[60,50,161,67] , text:'Number of Columns' ,properties:{scrolling:undefined,multiline:undefined}},layernumtext:StaticText{bounds:[30,20,270,37] , text:layertext ,properties:{scrolling:undefined,multiline:undefined}}},okay:Button{bounds:[210,110,310,130] , text:'Okay' },cancel:Button{bounds:[100,110,200,130] , text:'Cancel' }	};

	// dialog to set the #cols
	var dialogDef = 
		"dialog{text:'Script Interface',bounds:[100,100,270,210],\
			panel:Panel{bounds:[10,10,160,100] , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true},\
				colsText:StaticText{bounds:[10,12,80,30] , text:'# Columns:' ,properties:{scrolling:undefined,multiline:undefined}},\
				cols:EditText{bounds:[80,10,140,28] , text:'8' ,properties:{multiline:false,noecho:false,readonly:false}},\
				run:Button{bounds:[10,46,100,72] , text:'Run' },\
			}\
		};"
	
	var dialog = new Window(dialogDef, "Layers To Sprite");

	// run button
	var resultRun = 1;
	dialog.panel.run.onClick = function()
	{
		var d = this;
		while (d.type != 'dialog') {
			d = d.parent;
		}
		d.close(resultRun); 
	};
	
	dialog.center();
	
	// if not canceled continue
	if (dialog.show() == resultRun)
	{
		// parse the #cols
		var cols = parseInt(dialog.panel.cols.text);		
		if (cols <= 0)
		{
			alert("# Columns must be greater than 0, given: " + cols);
			return;
		}
		
		var rows = Math.ceil(numLayers/cols);
		
		var spriteX = docRef.width;
		var spriteY = docRef.height;	
		
		// now rasterize and crop the image, so everything is within the bounds (no bleeding out)
		for (i = 0; i < numLayers; i++)
		{
			docRef.artLayers[i].rasterize(RasterizeType.ENTIRELAYER);
		}
		docRef.crop([0, 0, spriteX, spriteY])

		// must set to move per pixels
		var oldUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		
		// resize the canvas
		newX = spriteX * cols;
		newY = spriteY * rows;
		
		docRef.resizeCanvas( newX, newY, AnchorPosition.TOPLEFT );
			
		// move the layers around
		var rowi = 0;
		var coli = 0;
		
		for (i=(numLayers - 1); i >= 0; i--) 
		{ 	
			docRef.artLayers[i].visible = 1;
			
			var movX = spriteX*coli;
			var movY = spriteY*rowi;
			
			docRef.artLayers[i].translate(movX, movY);
			
			coli++;
			if (coli > (cols - 1)) 
			{
				rowi++;
				coli = 0;
			}
		}
		
		// now save the processed sprite to a png file
		var selFile = File.saveDialog("Save Sprite To", "PNG:*.png");
		if ( selFile != null ) 
		{
			docRef.saveAs(selFile, new PNGSaveOptions(), true, Extension.LOWERCASE);

		}
		else // if not saved, everything will be reverted regardless
		{
			alert("Process canceled");
		}
		
		// now revert change by closing and reopen the document
		var oldFile = docRef.fullName;
		docRef.close(SaveOptions.DONOTSAVECHANGES);
		open(oldFile);
		
		// resume the ruler units setting
		app.preferences.rulerUnits = oldUnits;
	}
}