/*!
 * Copyright 2017 Justinmind. All rights reserved.
 */

(function (window, undefined) {
  var $simulation = jQuery("#simulation");
  $simulation
  .bind("renderresponsive", function(event) {
	 $("#simulation .non-processed").each(function(){
	 	if($(this).attr("datasizewidth")){
		 	$(this).data("width", parseInt($(this).attr("datasizewidth")));
		 	$(this).data("width-unit", ($(this).attr("datasizewidth").endsWith("%")) ? "%" : "px");
		 	$(this).removeAttr("datasizewidth");
	 	}
	 	if($(this).attr("datasizeheight")){
		 	$(this).data("height", parseInt($(this).attr("datasizeheight")));
		 	$(this).data("height-unit", ($(this).attr("datasizeheight").endsWith("%")) ? "%" : "px");
		 	$(this).removeAttr("datasizeheight");
	 	}
	 	if($(this).attr("dataX")){
	 		$(this).data("offsetX", parseInt($(this).attr("dataX")));
	 		if(!$(this).parent().is(".layout.horizontal") && !$(this).parent().is(".layout.vertical"))
	 			$(this).css("left", parseInt($(this).attr("dataX"))+"px");
		 	$(this).removeAttr("dataX");
	 	}
	 	if($(this).attr("dataY")){
	 		$(this).data("offsetY", parseInt($(this).attr("dataY")));
	 		if(!$(this).parent().is(".layout.horizontal") && !$(this).parent().is(".layout.vertical"))
	 			$(this).css("top", parseInt($(this).attr("dataY"))+"px");
		 	$(this).removeAttr("dataY");
	 	}
	 	if($(this).attr("originalwidth")){
	 		$(this).data("originalWidth", parseInt($(this).attr("originalwidth")));
		 	$(this).removeAttr("originalwidth");
	 	}
	 	if($(this).attr("originalheight")){
	 		$(this).data("originalHeight", parseInt($(this).attr("originalheight")));
		 	$(this).removeAttr("originalheight");
	 	}
    	if($(this).attr("aspectRatio")){
      		$(this).data("aspectRatio", parseFloat($(this).attr("aspectRatio")));
		 	$(this).removeAttr("aspectRatio");
    	}
	 	$(this).removeClass("non-processed");
	 });
  });

  var jimResponsive = {
  	"setNewWidth": function($target, width, unit) {
  		if($target && $target.data("width")) {
  			$target.data("width", width);
  			$target.data("widthUnit", unit);
  		}
  	},
  	"setNewHeight": function($target, height, unit) {
  		if($target && $target.data("height")) {
  			$target.data("height", height);
  			$target.data("heightUnit", unit);
  		}
  	},
	"resetOriginalTableSize" : function($table,resetWidth,resetHeight){
    if(resetHeight)
		  $table.data("originalHeight", parseInt($table.css("height"),10));
    if(resetWidth)
		  $table.data("originalWidth", parseInt($table.css("width"),10));

        var $cells = $table.children("table").children("tbody, thead").children("tr").children(".cellcontainer, .datacell, .textcell");
        if($table.is(".datagrid")) {
        	$cells = $table.children("table").children("tbody, thead").children("tr").children("td");
        }

        var $currentCell;
        for(var i=0, iLen = $cells.length; i < iLen; i += 1) {
          $currentCell = jQuery($cells[i]);
          if(resetHeight)
            $currentCell.data("originalHeight",parseInt($currentCell.css("height"),10));
          if(resetWidth)
            $currentCell.data("originalWidth",parseInt($currentCell.css("width"),10));
        }
	},
  	"getTextWidth": function($target) {
  		var oldStyle = $target.css('white-space');
      	$target.css('white-space', 'nowrap');

      	var w = 0;
      	$target.find("span").each(function( index ) {
      		var rect = $(this)[0].getBoundingClientRect();
  			w = Math.max(w, rect.width);
  			w = Math.max(w, $(this).width());
		});

		$target.css('white-space', oldStyle);
  		return w;
  	},
  	"redoWidthValue" : function($component) {
  		if($component.hasClass("autofit")) {
      		var cWidth = ($component.data("width") * jimResponsive.getParentComponent($component).width() / 100) - jimEvent.fn.getCurrentStyle("padding-right", $component) - jimEvent.fn.getCurrentStyle("padding-left", $component);
      		var textWidth = jimResponsive.getTextWidth($component);
      		if(cWidth > textWidth) {
      			$component.css("max-width", textWidth);
			}
			else {
				$component.css("max-width", "");
			}
      	}
  	},
  	"refreshResponsiveComponents": function($component, onlySynced, sizeChange, updatePercentage) {
  		var i, iLen, $t, $target = $newTarget = ($component===undefined) ? $("#simulation") : $component;
  		updatePercentage = (updatePercentage === undefined) ? true : updatePercentage;
  		$newTarget = $newTarget.find(".percentage");
  		if($target.hasClass("percentage") && updatePercentage)
  			$newTarget = $newTarget.add($target);
  		
  		for(i=0, iLen=$newTarget.length; i<iLen; i+=1) {
  			$t = jQuery($newTarget[i]);
  			var isHidden = $t.hasClass("hidden");
  			$t.jimForceVisibility();
			
  			switch($t.jimGetType()) {
  				case itemType.datalist:
  				case itemType.datagrid:
  					if(onlySynced!==undefined && !onlySynced) {
  						break;
  					}
  					jimResponsive.refreshResponsiveTables($t);
  					break;
  				case itemType.table:
  					jimResponsive.refreshResponsiveTables($t);
  					break;
  				case itemType.panel:
  					if(!isHidden)
  						jimResponsive.refreshResponsivePanels($t);
  					break;
  				case itemType.shapewrapper:
  					jimResponsive.refreshResponsiveShapes($t);
  					break;
  				case itemType.image:
  					jimResponsive.refreshResponsiveOther($t);
  					if($t.is(".lockH, .lockV"))
  						jimResponsive.refreshLockAspectImages($t);
  					break;
  				default:
  					jimResponsive.refreshResponsiveOther($t);
  					if (!($t.jimGetType() == itemType.dynamicpanel))
  					  jimUtil.adaptItemToNewSize($t, undefined, undefined, !($t.hasClass("autofit")));
  					break;
  			}
  			$t.jimUndoVisibility();
  		}

        jQuery.each($target.find(".horizontal:not(.verticalWrap)"), function (index, value) { jimUtil.wrapHorizontalLayout(value); });
        jQuery.each($target.find(".verticalWrap"), function (index, value) { jimUtil.wrapVerticalLayout(value); });
        

	      	if(sizeChange!==undefined && !sizeChange) {
	      		jimPin.init();
	      	}
	      	else if ($component !== undefined){
	      		for(i=0, iLen=$component.length; i<iLen; i+=1) {
	      			$t = jQuery($component[i]);
	      			jimPin.notifySizeChange($t,true);
	      		}
	      	}
	      	else{
	      		jimPin.notifySizeChange(undefined,true);
	      	}
      	
      	//masters and groups and wraps
        var listGroups = $target.find(".masterinstance, .group").reverse();
        listGroups.each(function(){
        var $group = jQuery($(this));
        if($group.hasClass("group"))
        	jimResponsive.refreshResponsiveGroups($group);
        if($group.hasClass("masterinstance"))
        	jimResponsive.refreshResponsiveMasters($group);
        });

  		//refresh
  		jimUtil.forceReflow();
      	jimUtil.refreshPageMinSize();

      	jQuery(window).trigger("reloadScrollBars");
      },
	  "getParentBounds" : function($component, $parent){
		  //hide to avoid undesired scrollbars
	  	  var originalDisplay = $component[0].style['display'];
	  	  $component[0].style['display'] = 'none';
		  var parentBounds = $parent[0].getBoundingClientRect();
		  $component[0].style['display'] = originalDisplay;
		  return parentBounds;
	  },
	  "getValueAsPercentage" : function(value, $item, isWidth) {
		var parentBounds = jimResponsive.getParentBounds($item, jimResponsive.getParentComponent($item));
		
		return (100.0 * value) / (((isWidth) ? parentBounds.width : parentBounds.height)* (1/jimUtil.getTotalScale()));
	  },
      "refreshResponsiveShapes": function($shape) {
      	var $parent, cWidth, cHeight, shapeStyle;
      	cWidth = $shape.data('width');
      	cHeight = $shape.data('height');
      	if($shape.data('widthUnit') === "%" || $shape.data('heightUnit') === "%") {
      		$parent = jimResponsive.getParentComponent($shape);
        	if($parent.hasClass("center"))
            	$parent = $("#simulation");
        	var parentBounds = jimResponsive.getParentBounds($shape,$parent);
      		cWidth = ($shape.data('widthUnit') === "%") ? (parentBounds.width * (1/jimUtil.getTotalScale()) * parseFloat(cWidth)/100) : cWidth;
      		cHeight = ($shape.data('heightUnit') === "%") ? (parentBounds.height * (1/jimUtil.getTotalScale()) * parseFloat(cHeight)/100) : cHeight;

      		shapeStyle = {};
            shapeStyle.attributes = {"width": cWidth, "height": cHeight};
            jimShapes.updateStyle($shape.find(".shape")[0], shapeStyle);
        }
      },
      "refreshResponsivePanels": function($panel) {
      	var $parent, cWidth, cHeight;
      	var border = jimUtil.getItemBorderWidth($panel); 
      	cWidth = $panel.data('width');
      	cHeight = $panel.data('height');
      	if($panel.data('widthUnit') === "%" || $panel.data('heightUnit') === "%") {
      		$parent = $panel.parent();
        	if($parent.hasClass("center"))
            	$parent = $("#simulation");
        	var parentBounds = jimResponsive.getParentBounds($panel,jimResponsive.getParentComponent($parent));
      		cWidth = ($panel.data('widthUnit') === "%") ? (parentBounds.width * (1/jimUtil.getTotalScale()) * parseFloat(cWidth)/100) - jimEvent.fn.getCurrentStyle("padding-right", $panel) - jimEvent.fn.getCurrentStyle("padding-left", $panel) + border.left + border.right : cWidth;
      		cHeight = ($panel.data('heightUnit') === "%") ? (parentBounds.height * (1/jimUtil.getTotalScale()) * parseFloat(cHeight)/100) - jimEvent.fn.getCurrentStyle("padding-top", $panel) - jimEvent.fn.getCurrentStyle("padding-bottom", $panel) + border.top + border.bottom : cHeight;

      		var $bgLayer = $panel.children(".backgroundLayer");
      		if($panel.data('widthUnit') === "%") {
      			$parent.width((parseInt(cWidth))+"px");
      			$panel.width("100%");
      			$panel.children(".layoutWrapper").width((parseInt(cWidth) - border.left - border.right)+"px")
      		}
      		if($panel.data('heightUnit') === "%") {
      			$parent.height((parseInt(cHeight))+"px");
      			$panel.height("100%");
      			$panel.children(".layoutWrapper").height((parseInt(cHeight) - border.top - border.bottom)+"px")
      		}
      	}
      },
      "refreshResponsiveTables": function($table) {
      	var $parent, cWidth, cHeight;
      	cWidth = $table.data('width');
      	cHeight = $table.data('height');
      	if($table.data('widthUnit') === "%" || $table.data('heightUnit') === "%") {
      		$parent = jimResponsive.getParentComponent($table);
      		var borderWidth = jimUtil.getItemBorderWidth($table);
        	if($parent.hasClass("center"))
            	$parent = $("#simulation");
        	
        	var parentBounds = jimResponsive.getParentBounds($table,$parent);
      		cWidth = ($table.data('widthUnit') === "%") ? (parentBounds.width * (1/jimUtil.getTotalScale()) * parseFloat(cWidth)/100) : cWidth;
      		cHeight = ($table.data('heightUnit') === "%") ? (parentBounds.height * (1/jimUtil.getTotalScale()) * parseFloat(cHeight)/100) : cHeight;

      		if($table.data('widthUnit') === "%")
	         	cWidth = cWidth + borderWidth.left + borderWidth.right;
      		if($table.data('heightUnit') === "%")
	            cHeight = cHeight +  borderWidth.top +  borderWidth.bottom;
      		
      		jimUtil.resizeTable($table, cWidth, cHeight, false, null);
      	}
      },
      "refreshResponsiveOther": function($component) {
      	var cWidth, cHeight, $parent = jimResponsive.getParentComponent($component);
      	var border = jimUtil.getItemBorderWidth($component);
      	cWidth=undefined;
      	cHeight=undefined;
      	if($component.data('widthUnit') === "%") {
      		switch($component.jimGetType()) {
      			case itemType.file:
      				cWidth = ($parent.width()*(1/jimUtil.getTotalScale()) * parseFloat($component.data("width")) / 100) - 71 - jimEvent.fn.getCurrentStyle("padding-right", $component) - jimEvent.fn.getCurrentStyle("padding-left", $component) + border.left + border.right;
      				break;
      			case itemType.richtext:
      			case itemType.button:
      			case itemType.label:
      				jimResponsive.redoWidthValue($component);
      			default:
      			 	var parentBounds = jimResponsive.getParentBounds($component,$parent);
      			 	cWidth = (parentBounds.width * (1/jimUtil.getTotalScale()) * parseFloat($component.data("width") / 100)) - jimEvent.fn.getCurrentStyle("padding-right", $component) - jimEvent.fn.getCurrentStyle("padding-left", $component) + border.left + border.right;
      				break;
      		}
            $component.css("width",cWidth);
       	}
        if($component.data('heightUnit') === "%") {
        	var parentBounds = jimResponsive.getParentBounds($component,$parent);
        	cHeight = (parentBounds.height * (1/jimUtil.getTotalScale()) * parseFloat($component.data("height") / 100)) - jimEvent.fn.getCurrentStyle("padding-top", $component) - jimEvent.fn.getCurrentStyle("padding-bottom", $component) + border.top + border.bottom;
            $component.css("height",cHeight);
        }

        if($component.data('widthUnit') === "%") {
        	if($parent.hasClass("center")) {
            	cWidth = ($("#simulation").width() * (1/jimUtil.getTotalScale()) * $component.data("width") / 100) - jimEvent.fn.getCurrentStyle("padding-left", $component) - jimEvent.fn.getCurrentStyle("padding-right", $component) + border.left + border.right;
                $component.width(cWidth);
            }
            else if($parent.hasClass("horizontal")){
                cWidth = ($parent.width() * (1/jimUtil.getTotalScale()) * $component.data("width") / 100) - jimEvent.fn.getCurrentStyle("padding-left", $component) - jimEvent.fn.getCurrentStyle("padding-right", $component) + border.left + border.right;
              	$component.width(cWidth);
            }
        }
        if($component.data('heightUnit') === "%") {
        	if($parent.hasClass("center")) {
            	cHeight = ($("#simulation").height() * (1/jimUtil.getTotalScale()) * $component.data("height") / 100) - jimEvent.fn.getCurrentStyle("padding-top", $component) - jimEvent.fn.getCurrentStyle("padding-bottom", $component) + border.top + border.bottom;
                $component.height(cHeight);
            }
            else if($parent.is(".vertical, .horizontal")){
                cHeight = ($parent.height() * (1/jimUtil.getTotalScale()) * $component.data("height") / 100) - jimEvent.fn.getCurrentStyle("padding-top", $component) - jimEvent.fn.getCurrentStyle("padding-bottom", $component) + border.top + border.bottom;
              	$component.height(cHeight);
            }
        }

        if ($component.hasClass("image") && $component.children().length > 0)
        	jimUtil.adaptItemToNewSize($component);
      },
      "refreshResponsiveMasters": function($masterinstances) {
      	var $masterinstance, $parent;
      	for(var i=0, iLen = $masterinstances.length; i < iLen; i += 1) {
      		$masterinstance = jQuery($masterinstances[i]);
     			if(jimResponsive.getResponsiveChildren($masterinstance.find("#alignmentBox")).length>0){
      				jimUtil.calculateMasterMinSize($masterinstance.find(".master"));
      			}
      	}
      },
       "refreshLockAspectImages": function($image) {
          var ratio = $image.data('aspectRatio');
          if($image.hasClass("lockV")) {
         	 $image.height($image.width()*ratio);
         	 $image.children("svg, img").height($image.width()*ratio);
          }
          else if($image.hasClass("lockH")) {
         	 $image.width($image.height()*ratio);
         	 $image.children("svg, img").width($image.height()*ratio);
          }
      },
      "refreshResponsiveGroups": function($groups) {
        	var $group, $parent, size;
  			$.each($groups, function () {
     			$group = jQuery($(this));
     			//$parent = $group.closest(".layout");
     			//if($parent!==undefined && ($parent.hasClass("horizontal") || $parent.hasClass("vertical"))) {
     			if(jimResponsive.getResponsiveChildren($group).length>0)
					jimUtil.calculateGroupMinSize($group);
     			//}
  			});
       },
	   "getResponsiveChildren" : function($container){
		   //get first level responsive children
		   var responsiveChildren = new Array();
		   var $current;
		   function getResponsiveChildrenRecurse(elem){
			   elem.children().each(function(){
				   $current = jQuery($(this));
				   if($current.hasClass("percentage") || $current.hasClass("pin"))
					   responsiveChildren.push($current);
				   else if($current.hasClass("group"))
					   getResponsiveChildrenRecurse($current);
				   else if($current.hasClass("masterinstance"))
					   getResponsiveChildrenRecurse($current.find("#alignmentBox"));
			   });
		   }
		   getResponsiveChildrenRecurse($container);
		   return responsiveChildren;
	   },
       "getParentComponent": function($component) {
    	   var $closestContainer = jimPin.getClosestContainerNoGroups($component);
    	   if($closestContainer.attr('id') == "alignmentBox" && $closestContainer.closest(".masterinstance").length>0){
       			//prototyper model restriction
       			return $component.closest(".ui-page");
       		}

       		var $notGroup = $component.parents(".firer").not(".group").first();
       		if($notGroup)
       			return $notGroup;
       		else
       			return $component.parent();
       }
  };

  /* expose utilities to the global object */
  window.jimResponsive = jimResponsive;
})(window);
