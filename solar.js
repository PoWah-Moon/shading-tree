//This is a test
//This is another test

var solar = function() {
  this.map;
  this.geocoder;
  this.arrayArea;
  this.coordinates;
  this.area;
  this.panelWidth = 3.28;
  this.panelHeight = 5.5;
  this.panelGap = 0.0833;
  this.chkCoordinates = [];
  this.circleCoordinates = {};
  this.test = [];
  this.infoWindow;
  this.x = 0;
  this.details = [];
  this.detailsCircle = []; // details of trees users have identified
  this.resetForm = false;
  this.ViewOpts = [];
  this.hdn = 0;
  this.defaultPitch = 30;
  this.LayoutType = "Portrait";
  this._hdnLayout = "Portrait";
  this._PanelType = 275;
  this.editPoly = null;
  this.radius = .3;
  this.treesRadius = 2; // another property of the trees. Why not make it a member of detailsCircle 
  this.manageCircle = null;
  this.manageLines = null;
  this.arrIndex = 0;
  this.circleIndex = 0; // What's its purpose? 
  this.crclinfoWindow;
  this.Crcle = null;
  this.CrclCheck;
  this.EditCircle = [];
  this.LatLong = []; //LatLong of what? 
  this.location = null;
  this.TMY3Info = null; 
  this.shadeResults = {
    time: [],
    day: [],
    iGHI: [],
    iDNI: [],
    iDHI: [],
    albedo: [],
    cosAOI: []
  };
  this.buildingHeight = 0;
  this.noShading = []; // Solar access #s when not shaded. Each roof has 4 noShading values
  this.shaded = [];
  this.arrayProp = [];
  this.EstimatedShading = []; // The average that gets returned to the front end 

  this.init();

}
solar.prototype = {
  init: function() {
    this.setLatLong();
  },
  setLatLong: function() {
    var details = {};
    details.TMY3Place = 'Atlantic';
    details.Lat = 39.45;
    details.Lan = -74.567;
    details.Others1 = -5;
    details.Others2 = 18;
    details.filename = "Atlantic City";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'Belmar';
    details.Lat = 40.183;
    details.Lan = -74.067;
    details.Others1 = -5;
    details.Others2 = 26;
    details.filename = "Belmar Asc";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'Cadwell';
    details.Lat = 40.883;
    details.Lan = -74.283;
    details.Others1 = -5;
    details.Others2 = 53;
    details.filename = "Caldwell Essex";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'CapeMay';
    details.Lat = 39;
    details.Lan = -74.567;
    details.Others1 = -5;
    details.Others2 = 7;
    this.LatLong.push(details);
    details.filename = "Cape May";
    details = {};
    details.TMY3Place = 'McGuire';
    details.Lat = 40.017;
    details.Lan = -74.6;
    details.Others1 = -5;
    details.Others2 = 45;
    details.distance = 0;
    details.filename = "McGuire AFB";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'MillVille';
    details.Lat = 39.367;
    details.Lan = -75.083;
    details.Others1 = -5;
    details.Others2 = 21;
    details.distance = 0;
    details.filename = "Millville";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'Newark';
    details.Lat = 40.717;
    details.Lan = -74.183;
    details.Others1 = -5;
    details.Others2 = 3;
    details.distance = 0;
    details.filename = "Newark Intl";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'Teterboro Airport';
    details.Lat = 40.85;
    details.Lan = -74.067;
    details.Others1 = -5;
    details.Others2 = 3;
    details.distance = 0;
    details.filename = "Teterboro";
    this.LatLong.push(details);
    details = {};
    details.TMY3Place = 'Trenton';
    details.Lat = 40.283;
    details.Lan = -74.817;
    details.Others1 = -5;
    details.Others2 = 65;
    details.distance = 0;
    details.filename = "Trenton";
    this.LatLong.push(details);
  },
  loadConstData: function() {

    var opt = {};
    opt.Id = "optCreate";
    opt.JSfun = "s.createNewDesign()";
    opt.Text = "Create New Design";
    s.ViewOpts.push(opt);
    var opt2 = {};
    opt2.Id = "optAdd";
    opt2.JSfun = "s.showAddDialog()";
    opt2.Text = "Add an Array";
    this.ViewOpts.push(opt2);

    // -------- In order for the "Add tree" function to work we need to 
    // link opt3.JSfun to another function. s.CheckForTrees is creating a new
    // array for every tree one adds... ---------------------------------- //

    var opt3 = {};
    opt3.Id = "optAddCircle";
    opt3.JSfun = "s.CheckForTrees(0,false)";
    opt3.Text = "Add Trees";
    this.ViewOpts.push(opt3);

  },
  generateViewDD: function() {
    var HTML = [];
    for (var p = 0; p < this.ViewOpts.length; p++) {
      var data = this.ViewOpts[p];
      var str = ['<div class = "dropDownItemDiv" id="',
        data.Id,
        '" onclick="javascript:',
        data.JSfun,
        '";>',
        data.Text,
        '</div>'
      ];
      HTML.push(str.join(''));
    }
    $("#myddOptsDiv").html(HTML.join(''));

  },
  addMarker: function(location) {
    s.map.marker = null;

    s.map.marker = new google.maps.Marker({
      map: s.map,
      position: location
    });
    google.maps.event.addListener(s.map.marker, 'rightclick', function() {
      s.map.marker.setMap(null);
    });




  },
  initialize: function() {

    var isReload = false;
    this.loadConstData();
    this.generateViewDD();
    this.geocoder = new google.maps.Geocoder();
    var vars = this.getUrlVars();
    var lat = 40.3571;
    var lon = -74.6702;
    if (vars != null && vars.length > 1) {
      // Add begins
      lat = (vars["lat"] == null ? lat : vars["lat"]);
      lon = (vars["lng"] == null ? lon : vars["lng"]);
      s.location = s.compareDistance(lat, lon);
      isReload = true;
    } else if (vars != null && vars.length == 1 && vars["st"] != null) {

      var tempAddr = vars["st"].split('+').join(' ');
      this.getAddr(tempAddr);
      isReload = true;
      //Fetch address from google API
    }
    // Add ends
    var myLatLng = new google.maps.LatLng(lat, lon);
    var mapOptions = {
      zoom: (isReload ? 22 : 10),
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: true,
      panControl: false,
      mapTypeControl: false


    };

    this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // Create the search box and link it to the UI element.
    //this.map.setTilt(45);
    var inputSearch = /** @type {HTMLInputElement} */ (
      document.getElementById('dvPanel'));
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);

    var opts = /** @type {HTMLInputElement} */ (
      document.getElementById('ddControl'));
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(opts);

    var viewResult = /** @type {HTMLInputElement} */ (
      document.getElementById('ddResults'));
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(viewResult);

    var ddPanelType = /** @type {HTMLInputElement} */ (
      document.getElementById('ddPanel'));
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(ddPanelType);

    var infoAdd = /** @type {HTMLInputElement} */ (
      document.getElementById('infoAdd'));
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(infoAdd);

    var infoConfirm = /** @type {HTMLInputElement} */ (
      document.getElementById('infoConfirm'));
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(infoConfirm);

    var infoConfirmReload = /** @type {HTMLInputElement} */ (
      document.getElementById('infoConfirmReload'));
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(infoConfirmReload);

    var dvDetails = /** @type {HTMLInputElement} */ (
      document.getElementById('dvDetails'));
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(dvDetails);

    var dvNameDesign = /** @type {HTMLInputElement} */ (
      document.getElementById('dvNameDesign'));
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(dvNameDesign);

    var dvTreeHeight = /** @type {HTMLInputElement} */ (
      document.getElementById('dvTreeHeight'));
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(dvTreeHeight);

    var dvCircleTrees = /** @type {HTMLInputElement} */ (
      document.getElementById('dvCircleTrees'));
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(dvCircleTrees);

    var dvTrees = /** @type {HTMLInputElement} */ (
      document.getElementById('dvTrees'));
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(dvTrees);

    var dvEstimatedShading = /** @type {HTMLInputElement} */ (
      document.getElementById('dvEstimatedShading'));
    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(dvEstimatedShading);

    $("#optAdd").hide();
    $("#optAddCircle").hide();

    var txt = /** @type {HTMLInputElement} */ (
      document.getElementById('txtSearch'));
    var autoComplete = new google.maps.places.Autocomplete(txt);
    var tempmap = this.map;

    //autocomplete.bindTo('bounds', tempmap);
    this.addMarker(myLatLng);
    google.maps.event.addListener(autoComplete, 'place_changed', function() {
      var place = autoComplete.getPlace();
      /*if (!place.geometry) {
      	return;
      }*/
      tempmap.setCenter(place.geometry.location);
      tempmap.setZoom(22);
      //tempmap.setTilt(45);
      tempmap.panTo(place.geometry.location);
      tempmap.setMapTypeId(google.maps.MapTypeId.HYBRID);
      tempmap.setTilt(0);
      s.addMarker(place.geometry.location);
      s.location = s.compareDistance(place.geometry.location.lat(), place.geometry.location.lng());
    });

    this.map.setOptions({
      draggableCursor: 'pointer'
    });

  },
  readTMY3file: function() {

    // **** Imports CSV file HERE ****
    // - Global Horizontal Irradiance (GHI) to results[i][4]
    // - Direct Normal Irradiance (DNI) to results[i][5]
    // - Direct Horizontal Irradiance (DHI) to results[i][6]
    // - albedo to results[i][7]

    // Determine which TMY3 data to use
    // One option to do this is to calculate the distance of the site to each of the TMY3 data and use the one that is closest to it

    $.ajax({
      type: "GET",
      url: s.location.filename + " TMY3.CSV",
      dataType: "text",
      success: function(data) {
        s.processData(data);
      }
    });

  },
  processData: function(data) {

    // the main function in processData method
    // Transfer data from TMY3 files ------------------------------------
    
    // ______________ Step 1 ______________ 

    // Define column 1 & 2, day and time of the year
    // day: between 1-365 days

    var i = 0;
    for (day = 1; day < 365 + 1; day++) {

      // time: between 0-23.5 hour
      for (var time = 0; time < 24; time++) {
        s.shadeResults.day.push(day);
        s.shadeResults.time.push(time);
        i++;
      }
    }

    var rows = data.split(/\r\n|\n/);
    // var cells = rows[8761].split(",");
    // s.shadeResults.iGHI[0] = parseInt(cells[4]);
    // s.shadeResults.iDNI[0] = parseInt(cells[7]);
    // s.shadeResults.iDHI[0] = parseInt(cells[10]);

    for (var i = 1; i < 8762; i++) {
      var cells = rows[i+1].split(",");
      s.shadeResults.iGHI[i - 1] = parseInt(cells[4]);
      s.shadeResults.iDNI[i - 1] = parseInt(cells[7]);
      s.shadeResults.iDHI[i - 1] = parseInt(cells[10]);
      s.shadeResults.albedo[i - 1] = parseInt(cells[61]);
    }

    //--------------------------------------------------------------------

  },

  shadingCalculate: function(){

    // Initialize array: calculate sun path, irradiance, corners' properties
    // and trees relative to corners 

    var arrayNumber = s.details.length - 1;
    var timeZone = s.location.Others1;
    var earthTilt = s.toRadians(23.45);
    var arrayDetails = {
      elevation: [],
      azimuth: [],
      totIrradiance: [],
      totDiffIrrad: [],
      cosAOI: [],
    };

    // s.details[0] should not be 0, but s.details[arrayNumber]
    // arrayNumber may be an input from the user since we may want to evaluate 

    var x = s.details[arrayNumber].ParentInfo.split('&')[0].split(',');
    var lon1 = parseFloat(x[0]);
    var lat1 = parseFloat(x[1]);
    var lat1Rad = s.toRadians(lat1);
    var albedo = 0.08;
    var sAzimuth = s.toRadians(s.details[arrayNumber].Azimuth);
    var sTilt = s.toRadians(s.details[arrayNumber].Pitch);
    var kappa = 5.534e-6;
    var perfectSA = 0;
    var shadedSA = 0;
    var perezC = [ 
      [-0.0083117, 0.5877285, -0.0620636, -0.0596012, 0.0721249, -0.0220216],
      [0.1299457, 0.682595, -0.1513752, -0.0189325, 0.065965, -0.0288748],
      [0.3296958, 0.4868735, -0.2210958, 0.055414, -0.0639588, -0.0260542],
      [0.5682053, 0.1874525, -0.295129, 0.1088631, -0.1519229, -0.0139754],

      [0.873028, -0.3920403, -0.3616149, 0.2255647, -0.4620442, 0.0012448],
      [1.1326077, -1.2367284, -0.4118494, 0.2877813, -0.8230357, 0.0558651],
      [1.0601591, -1.5999137, -0.3589221, 0.2642124, -1.127234, 0.1310694],
      [0.677747, -0.3272588, -0.2504286, 0.1561313, -1.3765031, 0.2506212]
    ];

    var i = 0;
    var diffSA = 0;
    var gndSA = 0;

    for (day = 1; day < 365 + 1; day++) {
      // time: between 0-23.5 hour
      for (time = 0.5; time < 24.5; time++) {
        var LSTM = 15 * timeZone;
        var B = s.toRadians(360 / 365 * (day - 81));
        var EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
        var TC = 4 * s.toRadians(lon1 - LSTM) + EoT;
        var LST = time + TC / 60;
        var HRA = 15 * (LST - 12);
        var HRA_rad = s.toRadians(HRA);
        var declination = Math.asin(Math.sin(earthTilt) * Math.sin(B));

        var elevation = s.elevation(declination, HRA_rad, lat1Rad);
        var azimuth = s.azimuth(declination, HRA_rad, elevation, lat1Rad);

        if (LST > 12 || HRA > 0)
          azimuth = 2 * Math.PI - azimuth;

        var cosAOI = Math.cos(sTilt)*Math.sin(declination)*Math.sin(lat1Rad) + Math.cos(sTilt)*Math.cos(declination)*Math.cos(lat1Rad)*Math.cos(HRA_rad) - Math.cos(declination)*Math.sin(HRA_rad)*Math.sin(sTilt)*Math.sin(sAzimuth) + Math.sin(sTilt)*Math.cos(sAzimuth)*Math.sin(declination)*Math.cos(lat1Rad) - Math.sin(sTilt)*Math.cos(sAzimuth)*Math.cos(HRA_rad)*Math.sin(lat1Rad);

        arrayDetails.cosAOI.push(cosAOI);

        if (cosAOI > 0)
          var iBeam = s.shadeResults.iDNI[i]* cosAOI;
        else 
          var iBeam = 0;

       // calculate E_d with Perez model
        var zenithR = Math.PI / 2 - elevation;
        var zenithD = 180 * elevation / Math.PI;

        a = Math.max(0, cosAOI);
        var b = Math.max(Math.cos(85 * Math.PI / 180), cosAOI);
        var AM_0 = Math.pow(Math.cos(b) + 0.15 * Math.pow(93.9 - zenithD, -1.253), -1);
        var delta = s.shadeResults.iDHI[i] * AM_0 / 1367;
        var epsilon = ((s.shadeResults.iDNI[i] + s.shadeResults.iDHI[i]) / s.shadeResults.iDHI[i] + kappa * Math.pow(zenithD, 3)) / (1 + kappa * Math.pow(zenithD, 3));
      
        // Find the corresponding Perez coefficients [checked]
        if (epsilon <= 1.065) {
          var epsValue = 0;
        } else if (epsilon <= 1.23) {
          var epsValue = 1;
        } else if (epsilon <= 1.5) {
          var epsValue = 2;
        } else if (epsilon <= 1.95) {
          var epsValue = 3;
        } else if (epsilon <= 2.8) {
          var epsValue = 4;
        } else if (epsilon <= 4.5) {
          var epsValue = 5;
        } else if (epsilon <= 6.2) {
          var epsValue = 6;
        } else {
          var epsValue = 7;
        }

        var F1 = Math.max(0, (perezC[epsValue][0] + perezC[epsValue][1] * delta + zenithR * perezC[epsValue][2]));
        var F2 = perezC[epsValue][3] + perezC[epsValue][4] * delta + zenithR * perezC[epsValue][5];

        // Compute D_i
        if (zenithD <= 87.5) {
          var D_i = s.shadeResults.iDHI[i] * (1 - F1) * (1 + Math.cos(sTilt)) / 2;
        } else {
          var D_i = (1 + Math.cos(sTilt)) / 2;
        }
        var D_c = s.shadeResults.iDHI[i] * F1 * a / b;
        var D_h = s.shadeResults.iDHI[i] * F2 * Math.sin(sTilt);

        var iDiffuse = D_i + D_c + D_h;
        var iGNDRef = s.shadeResults.albedo[i] * (s.shadeResults.iDNI[i] * Math.sin(elevation) + s.shadeResults.iDHI[i]) * (1 - Math.cos(sTilt)) / 2;
        arrayDetails.totDiffIrrad.push(iDiffuse + iGNDRef);           // total diffusive irradiance
        arrayDetails.totIrradiance.push(iBeam + iDiffuse + iGNDRef);  // add up to find the total irradiance
        perfectSA = perfectSA + iBeam + iDiffuse + iGNDRef;             // cumalative irradiance
        shadedSA = shadedSA + iDiffuse + iGNDRef; 
        diffSA = diffSA + iDiffuse;
        gndSA = gndSA + iGNDRef;

        arrayDetails.elevation.push(elevation);
        arrayDetails.azimuth.push(azimuth);

        i++;
      }
    }



    s.noShading.push(perfectSA);
    s.shaded.push(shadedSA)

    // ---- Properties of trees ----
    // Loop to make sure we traverse all the trees 
    
    // ---- Properties of array ---- //

    var corner1 = {
      cornerNum: 1,
      lon: lon1,
      lat: lat1,
      shadingTree: [], //make shadingTree an array of tree objects 
      qEave: 1
    };
    // Object of tree contains: distance, variables needed for equationof lines, shading number 

    var corner2 = {
      cornerNum: 2,
      lon: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[1].split(',')[0]),
      lat: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[1].split(',')[1]),
      shadingTree: [],
      qEave: 1
    };
   

    var corner3 = {
      cornerNum: 3,
      lon: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[2].split(',')[0]),
      lat: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[2].split(',')[1]),
      shadingTree: [],
      qEave: 0
    };
   
    var corner4 = {
      cornerNum: 4,
      lon: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[3].split(',')[0]),
      lat: parseFloat(s.details[arrayNumber].ParentInfo.split('&')[3].split(',')[1]),
      shadingTree: [],
      qEave: 0
    };
    

    // place at the top of the method
    var h_House = s.buildingHeight;
    var roofLength = s.distance(corner2.lon, corner2.lat, corner3.lon, corner3.lat) / Math.cos(sTilt);
    var hEave = h_House - Math.tan(sTilt) * roofLength;
    arrayDetails.roofLength = roofLength;
    arrayDetails.hEave = hEave;
    
    var treeEqn = function(corner, treeNum) {
      
      // qEave: Is the corner at the eave? 
      if (corner.qEave == 1) {
        var hPoint = hEave;
      } else {
        var hPoint = h_House;
      }

      var h_Tree = s.detailsCircle[treeNum].TreeHeight;
      var latTree = s.detailsCircle[treeNum].treeCoordinates.lat;
      var lonTree = s.detailsCircle[treeNum].treeCoordinates.lon;
      var dFromTree = s.distance(lonTree, latTree, corner.lon, corner.lat);
      var r_Tree = s.detailsCircle[treeNum].treeCoordinates.radius;
      var r_Trk = s.detailsCircle[treeNum].treeCoordinates.trunkRadius; 

      // Elevation of tree relative to point...X
      var El_A = Math.atan((h_Tree - r_Tree - hPoint) / dFromTree);
      var El_C = El_A;
      var El_B = Math.atan((h_Tree - hPoint) / dFromTree);
      var El_D = Math.atan((h_Tree - 2 * r_Tree - hPoint) / dFromTree); // break point here

      // Method to find azimuth, relative to each corner of the array 
      var Az_B = s.findAzimuth(lonTree, latTree, corner.lon, corner.lat);
      var Az_D = Az_B;
      var Az_A = Math.asin(r_Tree / dFromTree) + Az_B;
      	if (Az_A < 0)
      		Az_A = Az_A + Math.PI;
      var Az_C = Az_B - Math.asin(r_Tree / dFromTree);
      	if (Az_C < 0)
      		Az_C = Az_C + Math.PI;

      var Az_TrkR = Math.asin(r_Trk / dFromTree) + Az_B;
      	if (Az_TrkR < 0)
      		Az_TrkR = Az_TrkR + Math.PI;

      var Az_TrkL = Az_B - Math.asin(r_Trk / dFromTree);
      	if (Az_TrkL < 0)
      		Az_TrkL = Az_TrkL + Math.PI;

      var cirCenterX = (Az_A - Az_C) / 2 + Az_C; // y-center pt of the circle 
      var cirCenterY = (El_B - El_D) / 2 + El_D; // x-center pt of the circle 
      var cirRadius = ((El_B - El_D) / 2 + (Az_A - Az_C) / 2) / 2; // radius of circle 

      var withShading = 0;
      var shadedOrNot = [];

      for (var j = 0; j < 8760; j++) {
        var Az = arrayDetails.azimuth[j]; 
        var El = arrayDetails.elevation[j]; 
          if ((Az - cirCenterX) * (Az - cirCenterX) + (El - cirCenterY) * (El - cirCenterY) <= cirRadius * cirRadius) {
          shadedOrNot.push(0);

        } else if (Az > Az_TrkL && Az < Az_TrkR && El < El_D) {
          // Shadow of the tree trunk 
          shadedOrNot.push(0);

        } else { 
        // doesn't fall into the shade region
          shadedOrNot.push(1);
        }
      }

      return shadedOrNot;
    }
    
    var treeNumber = s.detailsCircle.length;
    for(k = 0; k < treeNumber; k++) {
      corner1.shadingTree.push(treeEqn(corner1, k));
      corner2.shadingTree.push(treeEqn(corner2, k)); 
      corner3.shadingTree.push(treeEqn(corner3, k)); 
      corner4.shadingTree.push(treeEqn(corner4, k));
    }

    // Create a counter called treeAccount that determines which tree is 
    // taken into account when performing shading calculations
    //Note: treeAccount.length = s.detailsCircle.length 
    var treeAccount = [];
    for(k = 0; k < s.detailsCircle.length; k++) {
      treeAccount.push(1);
    } 

    // Calculate the solar access # of each corner
    corner1.SolarAccess = s.evaluateShading(corner1, arrayDetails.totIrradiance, arrayDetails.totDiffIrrad, treeAccount, arrayNumber);   
    corner2.SolarAccess = s.evaluateShading(corner2, arrayDetails.totIrradiance, arrayDetails.totDiffIrrad, treeAccount, arrayNumber);  
    corner3.SolarAccess = s.evaluateShading(corner3, arrayDetails.totIrradiance, arrayDetails.totDiffIrrad, treeAccount, arrayNumber);  
    corner4.SolarAccess = s.evaluateShading(corner4, arrayDetails.totIrradiance, arrayDetails.totDiffIrrad, treeAccount, arrayNumber);  

    var avgArraySA = Math.round((corner1.SolarAccess + corner2.SolarAccess + corner3.SolarAccess + corner4.SolarAccess)/4);
    arrayDetails.corners = [corner1, corner2, corner3, corner4];
    arrayDetails.treeAccount = treeAccount;

    s.arrayProp.push(arrayDetails);
  
    s.EstimatedShading.push(avgArraySA); 
    $("#spnShading").html(s.EstimatedShading[arrayNumber]);


  },

  evaluateShading: function(corner, totIrradiance, totDiffIrrad, treeAccount, arrayNumber) { 
    // arrayInfo.[arrayNumber].corners --- array with 4 corners 

    // Create an array called newShadedOrNot that tells us the cumalative shading
    // from trees that we would like to take into account
    var newShadedOrNot = new Array(corner.shadingTree[0].length);
      for(k = 0; k < newShadedOrNot.length; k++) {
        newShadedOrNot[k] = 1;
      }

    // For each corner, go through the trees that causes shading on it. 
    for (treeNum = 0; treeNum < corner.shadingTree.length; treeNum++) {
      if (treeAccount[treeNum] == 1) {
        for (k = 0; k < newShadedOrNot.length; k++) {
          newShadedOrNot[k] = newShadedOrNot[k] * corner.shadingTree[treeNum][k];
        }
      } 
    }

    var withShading = 0;

    for(k = 0; k < newShadedOrNot.length; k++) {
      if(newShadedOrNot[k] == 1) //not shaded
        withShading = withShading + totIrradiance[k];
      else 
        withShading = withShading + 0.5*totDiffIrrad[k];
    }

    return withShading/s.noShading[arrayNumber] * 100;

  },

  getUrlVars: function() {
    var vars = [],
      hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  setLayoutType: function(layoutType) {

    if (layoutType == '') {
      layoutType = s.LayoutType;
    } else {
      //s.setDisplay('dvOrientOptions');
    }
    $("#dvOrient").html(layoutType);

  },


  getLayoutType: function() {

    return $("#dvOrient").html();
  },
  drawPolygon: function() {

    this.setDisplay('infoAdd');
    google.maps.event.addListener(this.map, 'click', this.validateClick);
    //google.maps.event.addListener(solarArray, 'polygonComplete', resetData);	 
  },
  addPoint: function(lon, lat) {
    var cntr = new google.maps.LatLng(lat, lon);
    var opts = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: s.map,
      center: cntr,
      radius: s.radius
    };
    var Crcl = new google.maps.Circle(opts);
    if (s.manageCircle === null) {
      s.manageCircle = [];
    }
    s.manageCircle.push(Crcl);
  },
  addLine: function(coord1, coord2) {


    var lineCoordinates = [
      new google.maps.LatLng(coord1[0], coord1[1]),
      new google.maps.LatLng(coord2[0], coord2[1])
    ];
    var linePath = new google.maps.Polyline({
      path: lineCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    linePath.setMap(s.map);
    if (s.manageLines === null) {
      s.manageLines = [];
    }
    s.manageLines.push(linePath);
  },
  removeLinesAndCircle: function() {

    if (s.manageCircle != null && s.manageCircle.length > 0) {

      for (var cx = 0; cx < s.manageCircle.length; cx++) {
        s.manageCircle[cx].setMap(null);
        s.manageCircle[cx] = null;
      }

    }
    if (s.manageLines != null && s.manageLines.length > 0) {
      for (var cx = 0; cx < s.manageLines.length; cx++) {
        s.manageLines[cx].setMap(null);
        s.manageLines[cx] = null;
      }

    }
    s.manageCircle = null;
    s.manageLines = null;
  },

  validateClick: function(event) {

    var flag = false;
    var coord = [];
    //var secFlag=false;
    var lat = event.latLng.lat();
    var lon = event.latLng.lng();

    if (s.chkCoordinates.length < 4) {
      for (var j = 0; j < s.chkCoordinates.length; j++) {
        var splitCoordinates = s.chkCoordinates[j];
        extLat = splitCoordinates[0];
        extLon = splitCoordinates[1];

        if (extLat == lat && extLon == lon) {
          flag = true;
          break;
        }
      }
      if (!flag && s.chkCoordinates.length <= 4) {

        var chk = [];
        chk[0] = lat;
        chk[1] = lon;
        s.chkCoordinates.push(chk);

        s.addPoint(lon, lat);

        //Draw line between two points
        if (s.chkCoordinates.length >= 2) {

          var len = s.chkCoordinates.length;
          s.addLine(s.chkCoordinates[len - 2], s.chkCoordinates[len - 1]);

        }
        if (s.chkCoordinates.length == 4) {
          for (var i = 0; i < s.chkCoordinates.length; i++) {
            coord.push(new google.maps.LatLng(s.chkCoordinates[i][0], s.chkCoordinates[i][1]));

          }


          s.arrayArea = new google.maps.Polygon({
            paths: coord,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#FF0000',
            fillOpacity: 0,
            draggable: true,
            editable: true
          });
          s.removeLinesAndCircle();
          s.arrayArea.setMap(s.map);
          s.confirmArray();

        }
      }
    }

  },

  confirmArray: function() {
    var control = $("#infoConfirm");
    this.calculatePosition(control);
    this.setDisplay('infoConfirm');

  },
  codeAddress: function() {
    var address = document.getElementById("txtSearch").value;

    s.geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        s.map.setCenter(results[0].geometry.location);
        s.addMarker(results[0].geometry.location);


      } else {

        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  },
  setDisplay: function(dvDisplay) {
    (document.getElementById(dvDisplay).style.display == 'block') ? document.getElementById(dvDisplay).style.display = 'none': document.getElementById(dvDisplay).style.display = 'block';
  },
  calculatePosition: function(control) {

    var lft = $("#ddControl").position().left;
    var calcValue = lft - 30;
    var tp = ($("#ddControl").position().top + 100);
    //alert(tp);
    $(control).css({
      left: calcValue,
      top: tp
    });
    //alert($(control).position().top);
  },
  reload: function(opt) {
    if (opt === "Y") {
      var locPts = this.map.getCenter();
      var lat = locPts.lat();
      var lon = locPts.lng();
      window.location.href += "?lat=" + lat + "&lng=" + lon;

    } else {
      this.setDisplay("infoConfirmReload");
    }
  },
  createNewDesign: function() {
    if (this.resetForm) {
      var control = $("#infoConfirmReload");
      this.calculatePosition(control);
      this.setDisplay("infoConfirmReload");
    } else {
      var control = $("#ddPanel");
      this.calculatePosition(control);
      $("#ddPanel").show();
      //this.setDisplay("optAdd");
      this.resetForm = true;
    }

    // User has decided to design a solar system
    s.readTMY3file();

  },
  selPanelType: function(panelType) {
    this.panelType = panelTypes[panelType];
    this.setDisplay("ddPanel");
    this.setDisplay("optAdd");
  },
  showAddDialog: function() {
    this.chkCoordinates = [];
    var control = $("#infoAdd");
    this.calculatePosition(control);
    this.setDisplay('infoAdd');
  },
  closeAndReset: function() {
    var control = $("#dvDetails");
    this.setDisplay('infoConfirm');
    this.chkCoordinates = [];
    this.arrayArea.setMap(null);
    this.arrayArea = null;
  },
  getDetails: function() {
    var control = $("#dvDetails");
    this.calculatePosition(control);
    this.setDisplay('dvDetails');
    this.setDisplay('infoConfirm');
    $("#optAddCircle").show();
    this.resetInfo();

  },
  resetInfo: function() {
    $("#txtPitch").val('');
    //$("#txtShade").val('');
    //$("#txtOrient").val('');
    s.setLayoutType('');
  },
  showResults: function() {

    this.generateDiv();

    this.setDisplay('dvArrayDetails');
  },


  removeArray: function(index) {
    this.remove(index);

    this.details.splice(index, 1);
    if (this.details.length === 0) {
      $("#optAddCircle").hide();
    }
    //this.generateDiv();



  },
  remove: function(index) {
    var itemArray = this.details[index];
    if (itemArray != null && itemArray.Panels != null && itemArray.Panels.length > 0) {
      for (var e = 0; e < itemArray.Panels.length; e++) {

        var panel = itemArray.Panels[e];
        if (panel != null) {
          panel.setMap(null);
          panel = null;
          itemArray.NumberOfPanels--;
        }
      }
    }

  },
  editDetails: function(index) {


    var control = $("#dvDetails");
    this.calculatePosition(control);
    this.setDisplay('dvDetails');
    $("#btnDetails").hide();
    $("#btnEditDetails").show();
    var tempData = this.details[index];
    $("#txtPitch").val(tempData.Pitch);
    //$("#txtOrient").val(tempData.Orientation);
    this.setLayoutType(tempData.Orientation);
    //$("#txtShade").val(tempData.Shade);
    $("#dvArrayDetails").hide();
    this.hdn = index;
    var tempData = this.details[this.hdn];
    var oldInfo = this.reconstructInfo(tempData.ParentInfo);
    var oldArr = [];
    s.EditCircle = [];
    for (var i = 0; i < oldInfo.length; i++) {
      oldArr.push(new google.maps.LatLng(oldInfo[i][1], oldInfo[i][0]));

    }


    this.editPoly = new google.maps.Polygon({
      paths: oldArr,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0,
      draggable: true,
      editable: true
    });

    this.editPoly.setMap(s.map);

    if (s.details !== null && s.details !== undefined) {

      /*for(var j=0;j<s.details[index].Circle.length;j++){
      		var t=s.details[index].Circle[j];
      		var crcl=t.Circle;
      		if(t!=null){	s.editTree(t,j+1,index,true);
      			
      		}
      		
      }*/
    }
  },
  editComplete: function() {

    $("#btnDetails").show();
    $("#btnEditDetails").hide();
    //DELETE this.editPoly.setMap(null);
    //DELETE this.editPoly=null;
    //this.setDisplay('dvDetails');
    var pitch = $("#txtPitch").val();
    var orient = this.getLayoutType();

    var tempData = this.details[this.hdn];
    //DELETE if(!(tempData.Pitch===pitch && tempData.Orientation===orient))
    //DELETE {
    this.remove(this.hdn);
    var oldInfo = this.reconstructInfo(tempData.ParentInfo);
    this.calculate("E", oldInfo, this.hdn);
    //DELETE }
    //DELETE else{this.setDisplay('dvDetails');}
    tempData.Pitch = pitch;
    //tempData.Shade=$("#txtShade").val();
    tempData.Orientation = orient;
    this.generateDiv();
    this.editPoly.setMap(null); //ADD BEGINS
    this.editPoly = null; //ADD ENDS

  },
  reconstructInfo: function(data) {
    var inner = [];
    if (data != null) {
      var outer = data.split('&');
      if (outer.length > 0) {
        for (var t = 0; t < outer.length; t++) {
          var x = [];
          x = outer[t].split(',');
          inner.push(x);

        }

      }
    }
    return inner;
  },
  generateDiv: function() {

    var totPanels = 0;
    var totWatts = 0;
    var tempHTML = [];
    for (var t = 0; t < this.details.length; t++) {
      var data = this.details[t];
      totPanels += data.NumberOfPanels;
      var watts = this.panelType.name * data.NumberOfPanels;
      totWatts += watts;
      var temp = ['<div class="">',
        '<div class="txtBold padBot3">Array', (t + 1),
        '<button id="btnEdit', t, '" onclick="javascript:s.editDetails(', t, ')" class="marginRt">',
        'Edit',
        '</button>',
        '<button id="btnRemove', t, '" onclick="javascript:s.removeArray(', t, ')" class="marginRt">',
        'Remove',
        '</button>',
        '</div>',


        '<div>Number of Panels: ', data.NumberOfPanels, '</div>',
        '<div>Pitch: ', data.Pitch, '</div>',
        '<div>Orientation: ', data.Orientation, '</div>',
        '<div>Shade Factor: ', s.EstimatedShading[t], '</div>',
        '<div>Azimuth: ', data.Azimuth.toFixed(4), '</div>',
        '<div>Watts: ', watts, '</div>',
        '<div style="display:none">Production</div>',

        '</div>'
      ]
      tempHTML.push(temp.join(''));



    }
    var panelType = ((s.panelType != null && s.panelType != undefined) ? s.panelType.name : '');
    var str = ['<div>',
      '<div class="txtBold padBot3">Total Array</div>',
      '<div>Number of Panels: ', totPanels, '</div>',
      '<div>Total Watts: ', totWatts, '</div>',
      '<div>Module rated power: ', panelType, '</div>',
      '<div style="display:none">Production</div>',
      '</div>'
    ]

    if (this.detailsCircle !== undefined && this.detailsCircle !== null) {
      var include = ['<div class="pad7px" style="margin-top:10px;">', 'Include/exclude trees</div></div> from calculation:', '</div>']
      tempHTML.push(include.join(''));
      for (var x = 0; x < this.detailsCircle.length; x++) {
        var treeDetails = this.detailsCircle[x];
        if (treeDetails !== null) {
          var trees = ['<div class="padBot3 pad7px">',
            '<div class="padBot3">Tree', (x + 1),
            '<button id="btnInclude', x, '" onclick="javascript:s.setInclude(', x, ')" class="marginRt buttonDiv btn ', (treeDetails.Include ? "Include" : "Exclude"), '">',
            'Include',
            '</button>',
            '<button id="btnExclude', x, '" onclick="javascript:s.setExclude(', x, ');" class="btn buttonDiv ', (treeDetails.Include ? "Exclude" : "Include"), '">',
            'Exclude',
            '</button>',
            '</div>'
          ];
          var treeDetails = ['<div class="padBot3">',
            '<div class="txtBold">Tree', (x + 1), '</div>',
            '<div><span style="width:100px;float:left;margin-top:9px;"> Height :', treeDetails.TreeHeight,
            '</span><button id="btnTreeDelete', x, '" onclick="javascript:s.DeleteTree(', x, ')" class="marginRt buttonDiv btn">',
            'Remove',
            '</button></div>',

            '</div>'
          ];
          tempHTML.push(trees.join(''));
          tempHTML.push(treeDetails.join(''));
        }
      }

    }
    var htmText = [str.join(''), tempHTML.join('')];


    $("#dvArrayDetails").html(htmText.join(''));

  },
  calculate: function(isEdit, oldArray, index) {
    //*********** calculate solar array ************************

    var control = $("#dvDetails");
    this.setDisplay('dvDetails');


    var corners = [];
    var latlng00 = [];
    var solarArray = [];
    var rotation;
    var azimuth;
    var pitchFactor1;
    var pitchFactor2;
    var numPanels = 0;
    var latlngback = [];
    var rotateBack;
    var tmpData;
    var arrayInfo = {};
    arrayInfo.Pitch = (($("#txtPitch").val().trim() != '') ? $("#txtPitch").val() : this.defaultPitch);
    //arrayInfo.Shade=$("#txtShade").val();
    arrayInfo.Orientation = this.getLayoutType(); //$("#txtOrient").val();


    if (isEdit != "E") {
      // Take coordinates from Google Maps
      tmpData = this.grabArray();

      this.arrayArea.setOptions({
        editable: false,
        draggable: false
      });
    } else {
      tmpData = oldArray;
    }
    corners = tmpData;
    arrayInfo.ParentInfo = tmpData.join('&');
    //corners = this.eave2RidgeMethod(corners); // **Change numbering system to starting with the ridge
    corners = this.cornersInvert(corners); // Lower right hand corner as point0, c[0][0] 

    var orientation = arrayInfo.Orientation;
    var slope = arrayInfo.Pitch * Math.PI / 180;

    latlng00[0] = corners[0][0];
    latlng00[1] = corners[0][1];
    pitchFactor1 = Math.cos(slope);
    pitchFactor2 = 1 / pitchFactor1;
    latlngback[0] = -latlng00[0];
    latlngback[1] = -latlng00[1];

    corners = this.moveArray(corners, latlng00);
    corners = this.latLng2Feet(corners, latlng00);
    corners = this.addPolar(corners);

    rotation = Math.PI - corners[1][3];
    rotateBack = -rotation;

    corners = this.rotate(corners, rotation);
    corners = this.pitchAdjust(corners, pitchFactor1);

    // azimuth calculation 
    var northFace = corners[2][1] > 0;
    var a = (180 / Math.PI * (Math.PI + rotation)) % 360;
    var b = (a + 180) % 360;
    azimuth = (northFace) ? a : b;

    //****************** (TBD) Now check if roof ridge or base is longer (TBD) **********

    corners = this.coordinatesInvert(corners, northFace);

    solarArray = this.fit(corners, orientation);

    arrayInfo.Panels = [];
    for (var i = 0; i < solarArray.length; i++) {
      for (var j = 1; j < solarArray[i].length; j++) {
        solarArray[i][j] = this.coordinatesInvert(solarArray[i][j], northFace);
        solarArray[i][j] = this.pitchAdjust(solarArray[i][j], pitchFactor2);
        solarArray[i][j] = this.addPolar(solarArray[i][j]);
        solarArray[i][j] = this.rotate(solarArray[i][j], rotateBack);
        solarArray[i][j] = this.feet2latLng(solarArray[i][j], latlng00);
        solarArray[i][j] = this.moveArray(solarArray[i][j], latlngback);
        if (isEdit != "E") {
          this.drawPanel(solarArray[i][j], arrayInfo, this.details.length);
        } else {
          this.drawPanel(solarArray[i][j], arrayInfo, index);
        }
        numPanels += 1;
      }
    }

    arrayInfo.Azimuth = azimuth;
    arrayInfo.NumberOfPanels = numPanels;

    if (isEdit != "E") {
      this.arrayArea.setMap(null);
      this.arrayArea = null;
      this.details.push(arrayInfo);
      this.arrIndex = this.details.length - 1;

    } else {
      this.details[index] = arrayInfo;
      this.arrIndex = index;
      for (var k = 0; k < s.EditCircle.length; k++) {

        var d = s.EditCircle[k];
        s.circleCoordinates.lat = d.lat;
        s.circleCoordinates.lon = d.lon;
        s.treesRadius = d.Circle.getRadius();
        d.Circle.setMap(null);
        d.Circle = null;

        s.drawCircle();


      }
      s.EditCircle = [];
    }


    this.generateDiv();



    this.CheckForTrees(this.arrIndex, false);
  },
  ConfirmNoTrees: function() {
    var control = $("#dvTrees");
    this.calculatePosition(control);
    this.setDisplay('dvTrees');
    if (!(s.detailsCircle !== null && s.detailsCircle !== "undefined")) {
      s.EsitmatedShading = 100; // 100% if there are no trees
    } else {

      s.shadingCalculate();
      // FUNCTION here that evaluates tree shading
      // s.readTMY3file();
    }
    var control = $("#dvEstimatedShading");
    this.calculatePosition(control);
    this.setDisplay('dvEstimatedShading');
    //s.generateDiv();
  },
  confirmShading: function() {

    var control = $("#dvEstimatedShading");
    this.calculatePosition(control);
    this.setDisplay('dvEstimatedShading');
    //s.generateDiv();

  },
  CheckForTrees: function(index, isEdit) {

    if (isEdit) {
      $("#dvTreesText").html('Any more trees?');
    } else $("#dvTreesText").html('Are there trees around the house that can cause shading factor??');
    var control = $("#dvTrees");
    this.calculatePosition(control);
    this.setDisplay('dvTrees');

  },
  DrawTrees: function() {
    var arrData = this.details[this.arrIndex];
    arrData.isTrees = true;
    var control = $("#dvTrees");
    this.calculatePosition(control);
    this.setDisplay('dvTrees');
    s.setControlforTrees();
    s.CrclCheck = true;
    s.checkForTree();

  },
  setControlforTrees: function() {
    var control = $("#dvCircleTrees");
    this.calculatePosition(control);
    this.setDisplay('dvCircleTrees');

  },
  checkForTree: function() {

    google.maps.event.addListener(this.map, 'click', this.getCircle);

  },
  getCircle: function(event) {
    if (s.CrclCheck) {
      s.CrclCheck = false;
      var lat = event.latLng.lat();
      var lon = event.latLng.lng();

      s.editableCircle(lat, lon, s.radius);

      //var cntr=new google.maps.LatLng(lat, lon);
    }
  },

  editableCircle: function(lat, lon, radius, isEdit, isInclude) {
    s.circleCoordinates.lat = lat;
    s.circleCoordinates.lon = lon;
    var cntr = new google.maps.LatLng(lat, lon);
    var opts = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: s.map,
      center: cntr,
      radius: radius,
      editable: true,
      draggable: true
    };
    s.Crcle = new google.maps.Circle(opts);
    s.Crcle.setMap(s.map);
    google.maps.event.addListener(s.Crcle, 'radius_changed', function() {
      s.treesRadius = s.Crcle.getRadius();
    });
    google.maps.event.addListener(s.Crcle, 'dragend', function(event) {
      s.circleCoordinates.lat = event.latLng.lat();
      s.circleCoordinates.lon = event.latLng.lng();
    });

    if (isEdit === true) {
      var editArrayCircle = {};
      editArrayCircle.Circle = s.Crcle;
      editArrayCircle.lat = lat;
      editArrayCircle.lon = lon;
      editArrayCircle.Include = isInclude;
      s.EditCircle.push(editArrayCircle);
    }

  },
  drawCircle: function() {


    var lat = s.circleCoordinates.lat;
    var lon = s.circleCoordinates.lon;
    if (s.Crcle !== null) {
      s.Crcle.setMap(null);
      s.Crcle = null;
    }
    var cntr = new google.maps.LatLng(lat, lon);
    var opts = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: s.map,
      center: cntr,
      radius: s.treesRadius,
      editable: true,
      draggable: true


    };

    var Circle = new google.maps.Circle(opts);



    ;
    var arrData = s.details[s.arrIndex];
    if ((arrData.Circle === undefined || arrData.Circle === null)) arrData.Circle = [];

    var cir = {};

    cir.treeCoordinates = {};
    cir.treeCoordinates.lat = lat;
    cir.treeCoordinates.lon = lon;
    cir.Include = true;
    cir.treeCoordinates.radius = s.treesRadius*3.28084; //convert from meters to feet
    cir.treeCoordinates.trunkRadius = s.treesRadius * 3.28084 * 0.3;
    cir.Circle = Circle;
    var len = 0;
    if (s._editTree) {
      s.detailsCircle[s.circleIndex] = cir;
      len = s.circleIndex;
    } else {
      s.detailsCircle.push(cir);
      len = s.detailsCircle.length;
    }
    s.circleCoordinates = {};


    var circleIndex = len;
    google.maps.event.addListener(Circle, 'click', function(event) {
      this.setOptions({
        strokeWeight: 1.0,
        fillColor: 'white'
      });
      this.crclinfoWindow = new google.maps.InfoWindow();


      var str = "<div class='infoText' style='width:200px'><button class='buttonCircleDelete' onclick='s.chkForCircleEdit(" + (circleIndex) + ")'>Edit</button>&nbsp;&nbsp;<button class='buttonCircleDelete' onclick='s.chkForCirlceDelete(" + (circleIndex) + ")'>Delete</button></div>";
      //alert(str);
      this.crclinfoWindow.setContent(str);

      this.crclinfoWindow.setPosition(event.latLng);
      this.crclinfoWindow.open(s.map);
      Circle.infoWindow = this.crclinfoWindow;
      //map.openInfoWindowHtml(event,'Test'); 
      google.maps.event.addListener(Circle.infoWindow, 'closeclick', function(poly) {

        Circle.setOptions({
          strokeWeight: 1.0,
          fillColor: '#404040'
        });
      });


    });
    //var Crcl = new google.maps.Circle(opts);
    Circle.setMap(s.map);
    if (!s._editTree) {
      s.getTreeHeight(len);
    }

    s._editTree = false;
    //s.generateDiv();
  },
  setTreeHeight: function() {

    var crcl = s.detailsCircle[s.circleIndex];
    crcl.TreeHeight = $("#txtTreeHeight").val();

    var control = $("#dvTreeHeight");
    this.calculatePosition(control);
    this.setDisplay('dvTreeHeight')

    s.CheckForTrees(s.arrIndex, true);
    $("#txtTreeHeight").val('');
    s.buildingHeight = $("#txtBuildingHeight").val();
  },
  getTreeHeight: function(len) {
    var control = $("#dvTreeHeight");
    this.calculatePosition(control);
    this.setDisplay('dvTreeHeight');
    s.circleIndex = len - 1;
    //do shading calculation
    // when you delete circles
    
  },
  setInclude: function(circleIndex) {
    var crcl = s.detailsCircle[circleIndex];
    crcl.Include = true;
    // update EstimatedShading
    var arrayNumber = s.arrayProp.length;

    for(j = 0; j < arrayNumber; j++) {

      var corner1 = s.arrayProp[j].corners[0];
      var corner2 = s.arrayProp[j].corners[1];
      var corner3 = s.arrayProp[j].corners[2];
      var corner4 = s.arrayProp[j].corners[3];
      var totIrradiance = s.arrayProp[j].totIrradiance;
      var totDiffIrrad = s.arrayProp[j].totDiffIrrad;

      // Do not calcuate the shading of this tree
      s.arrayProp[j].treeAccount[circleIndex] = 1;
      var treeAccount = s.arrayProp[j].treeAccount;

      s.arrayProp[j].corners[0].SolarAccess = s.evaluateShading(corner1, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[1].SolarAccess = s.evaluateShading(corner2, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[2].SolarAccess = s.evaluateShading(corner3, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[3].SolarAccess = s.evaluateShading(corner4, totIrradiance, totDiffIrrad, treeAccount, j);
      
      var avgArraySA = Math.round((s.arrayProp[j].corners[0].SolarAccess + s.arrayProp[j].corners[1].SolarAccess 
        + s.arrayProp[j].corners[2].SolarAccess + s.arrayProp[j].corners[3].SolarAccess)/4);

      s.EstimatedShading[j] = avgArraySA; 
    }

    $("#btnInclude" + circleIndex).removeClass('Exclude');
    $("#btnExclude" + circleIndex).removeClass('Include');
    $("#btnInclude" + circleIndex).addClass('Include');
    $("#btnExclude" + circleIndex).addClass('Exclude');

  },
  setExclude: function(circleIndex) {
    var crcl = s.detailsCircle[circleIndex];
    crcl.Include = false;
    var arrayNumber = s.arrayProp.length;

    for(j = 0; j < arrayNumber; j++) {

      var corner1 = s.arrayProp[j].corners[0];
      var corner2 = s.arrayProp[j].corners[1];
      var corner3 = s.arrayProp[j].corners[2];
      var corner4 = s.arrayProp[j].corners[3];
      var totIrradiance = s.arrayProp[j].totIrradiance;
      var totDiffIrrad = s.arrayProp[j].totDiffIrrad;

      // Do not calcuate the shading of this tree
      s.arrayProp[j].treeAccount[circleIndex] = 0;
      var treeAccount = s.arrayProp[j].treeAccount;

      s.arrayProp[j].corners[0].SolarAccess = s.evaluateShading(corner1, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[1].SolarAccess = s.evaluateShading(corner2, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[2].SolarAccess = s.evaluateShading(corner3, totIrradiance, totDiffIrrad, treeAccount, j);
      s.arrayProp[j].corners[3].SolarAccess = s.evaluateShading(corner4, totIrradiance, totDiffIrrad, treeAccount, j);
      
      var avgArraySA = Math.round((s.arrayProp[j].corners[0].SolarAccess + s.arrayProp[j].corners[1].SolarAccess 
        + s.arrayProp[j].corners[2].SolarAccess + s.arrayProp[j].corners[3].SolarAccess)/4);

      s.EstimatedShading[j] = avgArraySA; 

    }
    
    $("#btnInclude" + circleIndex).removeClass('Include');
    $("#btnExclude" + circleIndex).removeClass('Exclude');
    $("#btnInclude" + circleIndex).addClass('Exclude');
    $("#btnExclude" + circleIndex).addClass('Include');

  },
  chkForCircleEdit: function(circleIndex) {
    var crcl = this.detailsCircle[circleIndex - 1];
    crcl.Circle.infoWindow.close();
    s.editTree(crcl, circleIndex);
    s._editTree = true;
    s.circleIndex = circleIndex - 1;
    s.setControlforTrees();
    //s.generateDiv();
  },
  editTree: function(cir, circleIndex, isEdit) {
    this.editableCircle(cir.treeCoordinates.lat, cir.treeCoordinates.lon, cir.treeCoordinates.radius, isEdit, cir.Include);

    this.detailsCircle[circleIndex - 1] = null;
    cir.Circle.setMap(null);
    cir = null;

  },
  chkForCirlceDelete: function(circleIndex) {
    var crcl = s.detailsCircle[circleIndex - 1].Circle;
    crcl.infoWindow.close();
    this.crclinfoWindow = null;
    s.DeleteTree(circleIndex - 1);


  },
  DeleteTree: function(circleIndex) {
    var crcl = s.detailsCircle[circleIndex].Circle;
    s.detailsCircle.pop(circleIndex);
    crcl.setMap(null);
    crcl = null;
    s.generateDiv();
  },
  setEditDelete: function(circleIndex, Crcl) {
    //var len=arrayInfo.Panels.length-1;


  },

  grabArray: function() {
    //*********** determine lat and lng of corners of an array ************************

    var vertices = this.arrayArea.getPath();
    var c = [];

    for (var i = 0; i <= 3; i++) {
      y = vertices.getAt(i).lat();
      x = vertices.getAt(i).lng();
      c.push([x, y]);
    }
    return c;
  },

  eave2RidgeMethod: function(corners_E) {
    var corners_R = [];
    corners_R[0] = corners_E[3];
    corners_R[1] = corners_E[2];
    corners_R[2] = corners_E[1];
    corners_R[3] = corners_E[0];

    return corners_R;
  },

  cornersInvert: function(corners) {
    //******** takes an array of 4 lat and long coordinates and orders properly ********

    var corners2 = [];
    corners2[0] = corners[1];
    corners2[1] = corners[0];
    corners2[2] = corners[3];
    corners2[3] = corners[2];

    corners = (corners[1][0] > corners[0][0]) ? corners2 : corners;
    return corners;
  },

  drawPanel: function(p, arrayInfo, index) {
    //*********** draws a solar panel with corners p[][] ***********************

    var coords = [
      new google.maps.LatLng(p[0][1], p[0][0]),
      new google.maps.LatLng(p[1][1], p[1][0]),
      new google.maps.LatLng(p[2][1], p[2][0]),
      new google.maps.LatLng(p[3][1], p[3][0])
    ];

    var area1 = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#202020',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: '#404040',
      fillOpacity: 0.8,
      draggable: false,
      editable: false
    });
    arrayInfo.Panels.push(area1);
    var len = arrayInfo.Panels.length - 1;
    google.maps.event.addListener(area1, 'click', function(event) {
      this.setOptions({
        strokeWeight: 1.0,
        fillColor: 'white'
      });
      this.infoWindow = new google.maps.InfoWindow();


      var str = "<div class='infoText'>Delete??<div><button class='buttonDelete' onclick='s.chkForDelete(" + (len) + "," + index + ")'>OK</button></div></div>";
      //alert(str);
      this.infoWindow.setContent(str);

      this.infoWindow.setPosition(event.latLng);
      this.infoWindow.open(s.map);
      //map.openInfoWindowHtml(event,'Test'); 
      google.maps.event.addListener(area1.infoWindow, 'closeclick', function(poly) {

        area1.setOptions({
          strokeWeight: 1.0,
          fillColor: '#404040'
        });
      });


    });
    area1.setMap(this.map);

  },
  chkForDelete: function(panelIndex, itemIndex) {
    var itemArray = this.details[itemIndex];
    if (itemArray != null && itemArray.Panels != null && itemArray.Panels.length > 0) {
      var panel = itemArray.Panels[panelIndex];

      panel.infoWindow.close();
      panel.setMap(null);
      panel = null;
      itemArray.NumberOfPanels--;
      s.generateDiv();
    }

  },
  moveArray: function(c, latLng) {
    //*********** move 2d array by latLng ************************

    for (var i = 0; i <= 3; i++) {
      c[i][0] = c[i][0] - latLng[0];
      c[i][1] = c[i][1] - latLng[1];
    }
    return c;
  },


  latLng2Feet: function(c, latLng) {
    //*********** convert latlng to feet ****************************

    var lat_convert = 364605;
    var lng_convert = lat_convert * Math.cos(latLng[1] / 180 * Math.PI);

    for (var i = 0; i <= 3; i++) {
      c[i][0] = c[i][0] * lng_convert;
      c[i][1] = c[i][1] * lat_convert;
    }
    return c;
  },

  addPolar: function(c) {
    //*********** add polar coordinates to a 2d array *********************************

    for (var i = 0; i <= 3; i++) {
      c[i].push(Math.sqrt(Math.pow(c[i][0], 2) + Math.pow(c[i][1], 2)));
      c[i].push(Math.atan2(c[i][1], c[i][0]));
    }
    return c;
  },


  rotate: function(c, angle) {
    //*********** rotate a 2d array with polar coordinates ****************************

    for (var i = 0; i <= 3; i++) {
      c[i][3] = c[i][3] + angle;
      c[i][0] = c[i][2] * Math.cos(c[i][3]);
      c[i][1] = c[i][2] * Math.sin(c[i][3]);
    }
    return c;
  },


  pitchAdjust: function(c, adjust) {
    //*********** return contents of a 2D array ***********************************

    for (var i = 0; i <= 3; i++) {
      c[i][1] = c[i][1] / adjust;
    }
    return c;
  },

  coordinatesInvert: function(corners, northFace) {
    //******** insert just before fit function and first in line in double for loop ********

    if (northFace) {
      for (var i = 0; i <= 3; i++) {
        corners[i][1] = -corners[i][1];
      }
    }
    return corners;
  },

  fit: function(c, layout) {
    //*********** return contents of a 2D array ***********************************

    var array = [];

    /*-----------------------------
       ARRAY DEFINITION
    	  - array[0]... filled with row arrays corresponding to rows of panels
    	  - ROW ARRAYS:
    		- row[0] holds the excess space (a partial panel width) left over after fitting panels on the row
    		- row[1]... hold arrays for each panel
    		- PANEL ARRAYS:
    		  - 2-d array of coordinates for each corner
    -------------------------------*/

    var arrayHeight;
    var pX;
    var pY;
    var rowY;
    var rowY0;
    var rowX;
    var rowX0;
    var rowNum;
    var rowStart;
    var rowEnd;
    var start0;
    var start1;
    var end0;
    var end1;
    var slopeStart;
    var slopeEnd;

    // Check user's orientation input, determine pX and pY as panelHeight/panelWidth
    pX = (layout === this.LayoutType) ? this.panelType.panelWidth : this.panelType.panelHeight;
    pY = (layout === this.LayoutType) ? this.panelType.panelHeight : this.panelType.panelWidth;
    slopeStart = c[3][0] / c[3][1];
    slopeEnd = (c[2][0] - c[1][0]) / (c[2][1] - c[1][1]);
    arrayHeight = (c[2][1] + c[3][1]) / 2;

    rowY = -0.5; // margin at the edge
    rowNum = 1;
    start0 = c[0][0]; // add margin here? 
    end0 = c[1][0]; // same, add margin here? 

    // outer loop places rows
    // find starting point and ending point for row
    // inner loop places panels from starting point to ending point for each row

    while ((rowY - pY) >= arrayHeight) {
      start1 = start0 - slopeStart * pY;
      end1 = end0 - slopeEnd * pY;
      rowStart = (start0 <= start1) ? start0 : start1;
      rowEnd = (end0 >= end1) ? end0 : end1;
      var row = [];
      row[0] = 0;
      rowX = rowStart;
      while (rowX - pX >= rowEnd) {
        var panel = [];
        panel[0] = [rowX, rowY];
        panel[1] = [rowX - pX, rowY];
        panel[2] = [rowX - pX, rowY - pY];
        panel[3] = [rowX, rowY - pY];
        row.push(panel);
        row[0] = (rowEnd - rowX + pX);
        rowX = rowX - pX - this.panelType.panelGap;
      }
      array.push(row);

      start0 = start1;
      end0 = end1;
      rowY = rowY - pY;
      rowNum += 1;
    }
    return array;
  },
  feet2latLng: function(c, latLng) {
    //*********** convert coordinates from feet to latlng ****************************
  },
  feet2latLng: function(c, latLng) {
    var lat_convert = 364605;
    var lng_convert = lat_convert * Math.cos(latLng[1] / 180 * Math.PI);

    for (var i = 0; i <= 3; i++) {
      c[i][0] = c[i][0] / lng_convert;
      c[i][1] = c[i][1] / lat_convert;
    }
    return c;
  },
  toRadians: function(angle) {
    return angle * (Math.PI / 180);
  },
  distance: function(lon1, lat1, lon2, lat2) {

    var R = 6371000 * 3.28084; // [feet]
    var lat1 = this.toRadians(lat1);
    var lon1 = this.toRadians(lon1);
    var lat2 = this.toRadians(lat2);
    var lon2 = this.toRadians(lon2);

    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;

  },
  elevation: function(declination, HRA, latR) { // LT = local time; d = day
    return Math.asin(Math.sin(declination) * Math.sin(latR) + Math.cos(declination) * Math.cos(latR) * Math.cos(HRA));
  },
  azimuth: function(declination, HRA, elevation, latR) {
    return (Math.acos((Math.sin(declination) * Math.cos(latR) - Math.cos(declination) * Math.sin(latR) * Math.cos(HRA)) / Math.cos(elevation)));
  },

  findAzimuth: function(lonTree, latTree, lonPt, latPt) { 
    lonTree = s.toRadians(lonTree);
    latTree = s.toRadians(latTree);
    lonPt = s.toRadians(lonPt);
    latPt = s.toRadians(latPt);

    // Debug mode ----
    // lonTree = s.toRadians(lonTree);
    // latTree = s.toRadians(latTree);
    // lonPt = s.toRadians(corner.lon);
    // latPt = s.toRadians(corner.lat);

    var dLon = lonPt - lonTree;
    var y = Math.sin(dLon)*Math.cos(latPt);
    var x = Math.cos(latTree) * Math.sin(latPt) - Math.sin(latTree) * Math.cos(latPt) * Math.cos(dLon);

    var brng = Math.atan2(y,x);

    if (brng < 0) 
    	return Math.PI + brng;
    else return brng;

  },

  compareDistance: function(lat, lon) {
    var dist = [];
    if (this.LatLong != null) {
      for (var i = 0; i < this.LatLong.length; i++) {
        var details = this.LatLong[i];
        var x = this.distance(lat, lon, details.Lat, details.Lan);
        details.distance = x;
        dist.push(x);
      }
      var y = dist.sort();
      for (var j = 0; j < this.LatLong.length; j++) {
        var details = this.LatLong[j];
        if (details.distance === y[0]) {
          return details;
        }
      }
    }
  }



}
var panelTypes = {
  p270: {
    name: 270,
    panelWidth: 3.28,
    panelHeight: 5.5,
    panelGap: 0.0833962
  },
  p280: {
    name: 280,
    panelWidth: 3.28,
    panelHeight: 5.5,
    panelGap: 0.0833969
  },
  p325: {
    name: 325,
    panelWidth: 3.28,
    panelHeight: 6.54,
    panelGap: 0.0833976
  },
  p365: {
    name: 365,
    panelWidth: 3.28,
    panelHeight: 6.43,
    panelGap: 0.0833983
  }

};
var s = new solar();
