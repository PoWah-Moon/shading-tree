<!DOCTYPE html>
<html>
<head>
<link href="solar.css" type="text/css" rel="stylesheet"/>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places"></script>
<script src="jquery-2.1.3.min.js"></script>

<script src="solar.js"></script>
<title>Solar</title>
</head>

<body>
<div id="dvPanel" >
	<input id="txtSearch"  type="text" placeholder="Enter a location"/>

	<button id="btnSearch" onclick="javascript:s.codeAddress();">
		<span id="spnImg">Search<!--<img src="/Images/search.png"></img>--></span>	
	</button>
</div>

<div id="ddControl" onclick="javascript:s.setDisplay('myddOptsDiv')">
	<div class="dvText">I would like to</div>
	<div class="arrow-down floatRight" ><span class="spnArrowDown"></span></div>
	<div class = "dropDownOptionsDiv" id="myddOptsDiv">
        	
	        
	</div>
</div>

<div id="ddResults" onclick="javascript:s.showResults();"><div class="dvText">View Results</div>
	<div class="arrow-down floatRight" style=""><span class="spnArrowDown"></span></div>
	<div id="dvArrayDetails" >
	</div>
</div>

<div id="ddPanel"><div class="dvText">Select Panel Type</div>
	<div class="arrow-down floatRight"><span class="spnArrowDown"></span></div>
	<div class = "dropDownOptionsDiv" id="myddOptsPanel" style="display:block">
        	<div class = "dropDownItemDiv" id="optPanelType" onclick="javascript:s.selPanelType('p270');">SolarWorld 270</div>
    		<div class = "dropDownItemDiv" id="optPanelType" onclick="javascript:s.selPanelType('p280');">SolarWorld 280</div>
    		<div class = "dropDownItemDiv" id="optPanelType" onclick="javascript:s.selPanelType('p325');">SolarWorld 325 (commercial)</div>    		<div class = "dropDownItemDiv" id="optPanelType" onclick="javascript:s.selPanelType('p365');">LG 365</div>
	</div>	
	
</div>

<div id="infoAdd">Click four corners of the array.<br>Be sure to trace the roof eave first.
	
	<div><button id="btnOK" onclick="javascript:s.drawPolygon();">
		<span id="spnOK">OK<!--<img src="/Images/search.png"></img>--></span>	
	</button></div>
</div>
<div id="infoConfirm"><div>Create this Array?</div><div>(You can reposition, drag the corners of the array </div><div>before clicking Yes)</div>
	
	<div><button id="btnYes" onclick="javascript:s.getDetails()">
		<span id="spnYes">Yes<!--<img src="/Images/search.png"></img>--></span>	
	</button><button id="btnNo" onclick="javascript:s.closeAndReset();" class="marginLeft10">
		<span id="spnNo">No<!--<img src="/Images/search.png"></img>--></span>	
	</button></div>
</div>
<div id="infoConfirmReload" style="z-index:100;">This will clear all the arrays from the screen, Continue?
	
	<div><button id="btnYesReload" onclick="javascript:s.reload('Y')">
		<span id="spnYes">Yes<!--<img src="/Images/search.png"></img>--></span>	
	</button><button id="btnNoReload" onclick="javascript:s.reload('N');" class="marginLeft10">
		<span id="spnNo">No<!--<img src="/Images/search.png"></img>--></span>	
	</button></div>
</div>

<div id="dvDetails">
	<div>Provide the pitch of the roof</div>
	<div style="margin-top:20px;">
		<div class="dvFloatLeft width50">Pitch (degrees)</div><div style="width:3%"></div><div  class="dvFloatLeft width48"><input id="txtPitch"  type="text"/></div>
		<!--<div class="dvFloatLeft width50">Shade Factor(%)</div><div style="width:3%"></div><div class="dvFloatLeft width37"><input id="txtShade"  type="text"/></div>-->
		<div class="dvFloatLeft width50">Orientation</div><div style="width:3%"></div>
		<div class="dvFloatLeft width48">
			<div id="txtOrient" onclick="javascript:s.setDisplay('dvOrientOptions')">
				<div class="dvText" id="dvOrient">Portrait</div>
				<div class="arrow-down floatRight"><span class="spnArrowDown"></span></div>
				<div class = "dropDownOptionsDiv" id="dvOrientOptions">
					<div class = "dropDownItemDiv" onclick="javascript:s.setLayoutType('Portrait')">Portrait</div>
					<div class = "dropDownItemDiv" onclick="javascript:s.setLayoutType('Landscape')">Landscape</div>
				</div>	
			</div>
		</div>
		
	</div>
	<div style="text-align:center;">
		<button id="btnDetails" onclick="javascript:s.calculate('','')" class="marginLeft10">
			<span id="spnDetails">OK<!--<img src="/Images/search.png"></img>--></span>
		</button>	
		<button id="btnEditDetails" onclick="javascript:s.editComplete()" class="marginLeft10" style="display:none">
			<span id="spnDetails">OK<!--<img src="/Images/search.png"></img>--></span>	
		</button>
	</div>

	
</div>
<div id="dvTrees">
	<div id="dvTreesText">Are there trees around the house that can cause shading factor??</div>

		
	<div style="text-align:center;">
		<button id="btnTree" onclick="javascript:s.DrawTrees()" class="marginLeft10">
			<span id="spnAgreeTree">Yes</span>
		</button>	
		<button id="btndisAgreeTree" onclick="javascript:s.ConfirmNoTrees();" class="marginLeft10" >
			<span id="spnDisAgreeTree">No</span>	
		</button>
	</div>

	
</div>

<div id="dvCircleTrees">
	<div>Circle the tree and then click OK</div>

		
	<div style="text-align:center;">
		<button id="btnCircleTree" onclick="javascript:s.drawCircle();s.setControlforTrees();" class="marginLeft10">
			<span id="spnCircleTree">OK</span>
		</button>	
		
	</div>

	
</div>
<div id="dvEstimatedShading">
	<div>The estimated shading is: <span id="spnShading"></span></div>
	<div style="text-align:center;">
		<button id="btnShading" onclick="javascript:s.confirmShading();" class="marginLeft10">
			<span id="spnCircleTree">OK</span>
		</button>	
		
	</div>


</div>
<div id="dvTreeHeight">
	<div style="width:83%" class="dvFloatLeft">Provide the height of the tree in feet</div>
	
	<div style="width:15%"class="dvFloatLeft"><input type="text" id="txtTreeHeight" maxlength="4" style="width:80%"/></div>
	<div style="width:83%;margin-top:2px;" class="dvFloatLeft">Provide the height of the building in feet</div>
	
	<div style="width:15%;margin-top:2px;"class="dvFloatLeft"><input type="text" id="txtBuildingHeight" maxlength="4" style="width:80%"/></div>	
	<div style="text-align:center;width:100%" class="dvFloatLeft">
		<button id="btnHeightTree" onclick="javascript:s.setTreeHeight();" class="marginLeft10">
			<span id="spnHeightTree">OK</span>
		</button>	
		
	</div>

	
</div>

<div id="dvNameDesign">Name the design
	
	<div><input id="txtName"  type="text"/></div>
	<div><button id="btnName" onclick="javascript:s.setDisplay('dvNameDesign');">
			<span id="spnName">OK<!--<img src="/Images/search.png"></img>--></span>	
	</button></div>
	
</div>


<!--div for loading the map-->
<div id="map-canvas"></div>

<script type="text/javascript">

google.maps.event.addDomListener(window, 'load', s.initialize());
</script>
</body>
</html>