/**
 *  ThreeJS test file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{
			// Level 0 includes
			// ModulesLoader.requireModules(["lib/dat.gui.js"]) ;
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules(["myJS/ThreeRenderingEnv.js",
			                              "myJS/ThreeLightingEnv.js",
			                              "myJS/ThreeLoadingEnv.js",
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;

			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
);

// camera mode
var embeddedCamera = true;


// laps
var laps;
var maxLaps = 3;
var lastPlaneCheck = 0;
var raceEnd = false;

var clock;
// Array of minimum plane to check to validate lap
var planeCheckpoints = [0, 1, 5, 10, 14, 21, 29];

// Array of all plane check for this lap
var currentPlaneCheckpointsLap = [];


// Speedometer
var speedChart;
var speedChartData;
var speedChartOptions = {
    width: 400, height: 120,
    yellowFrom: 120, yellowTo: 160,
    redFrom: 160, redTo: 180,
    minorTicks: 5, max: 180
};

function start() {
	//	----------------------------------------------------------------------------
	//	MAR 2014 - nav test
	//	author(s) : Cozot, R. and Lamarche, F.
	//	date : 11/16/2014
	//	last : 11/25/2014
	//	----------------------------------------------------------------------------
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed

	document.getElementsByClassName("time")[0].style.display = 'block';
	var currentlyPressedKeys = {};
	// car Position
	var CARx = -220;
	var CARy = 0;
	var CARz = 0;
	var CARtheta = 0;

	//var gui = new dat.GUI();
	// Creates the vehicle (handled by physics)
	var vehicle = new FlyingVehicle({
		position: new THREE.Vector3(CARx, CARy, CARz),
		zAngle : CARtheta+Math.PI/2.0
	});

	var vehicleHelico = new FlyingVehicle({
		position: new THREE.Vector3(CARx, CARy, CARz),
		zAngle : CARtheta+Math.PI/2.0
	});

	// Rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	// Lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	// Loading env
	var Loader = new ThreeLoadingEnv();

	// init chart speed
  initSpeedometerChart();

  // init laps
	initLaps();

	// initTimerLaps
	initTimerLaps();

	//Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	renderingEnvironment.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	renderingEnvironment.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',renderingEnvironment.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	renderingEnvironment.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	renderingEnvironment.scene,'decors',	-340,-340,0,'front');

	// Car
	// car Translation
	var carPosition = new THREE.Object3D();
	carPosition.name = 'car0';
	renderingEnvironment.addToScene(carPosition);
	// initial POS
	carPosition.position.x = CARx;
	carPosition.position.y = CARy;
	carPosition.position.z = CARz;
	// car Rotation floor slope follow
	var carFloorSlope = new THREE.Object3D();
	carFloorSlope.name = 'car1';
	carPosition.add(carFloorSlope);
	// car vertical rotation
	var carRotationZ = new THREE.Object3D();
	carRotationZ.name = 'car2';
	carFloorSlope.add(carRotationZ);
	carRotationZ.rotation.z = CARtheta ;
	// the car itself
	// simple method to load an object
	var carGeometry = Loader.load({filename: 'assets/car_Zup_01.obj', node: carRotationZ, name: 'car3'}) ;
	carGeometry.position.z= + 2 ;
	// attach the scene camera to car
//	carGeometry.add(renderingEnvironment.camera) ;
//	renderingEnvironment.camera.position.x = 0.0 ;
//	renderingEnvironment.camera.position.z = 10.0 ;
//	renderingEnvironment.camera.position.y = -25.0 ;
//	renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0 ;

	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);





	// ******* START HELICO *******


    var oHelico = new THREE.Object3D();

    var oTurbineLeft = new THREE.Object3D();
    var oTurbineRight = new THREE.Object3D();
    var oTurbineCentral = new THREE.Object3D();

    var oAxeLeft = new THREE.Object3D();
    var oAxeRight = new THREE.Object3D();
    var oAxeCentral = new THREE.Object3D();

    var oPaleLeft1 = new THREE.Object3D();
    var oPaleLeft2 = new THREE.Object3D();
    var oPaleLeft3 = new THREE.Object3D();

    var oPaleRight1 = new THREE.Object3D();
    var oPaleRight2 = new THREE.Object3D();
    var oPaleRight3 = new THREE.Object3D();

    var oPaleCentral1 = new THREE.Object3D();
    var oPaleCentral2 = new THREE.Object3D();
    var oPaleCentral3 = new THREE.Object3D();

		var HelicoFloorSlope = new THREE.Object3D();
		HelicoFloorSlope.name = 'helico1';
		oHelico.add(HelicoFloorSlope);
		// car vertical rotation
		var HelicoRotationZ = new THREE.Object3D();
		HelicoRotationZ.name = 'helico2';
		HelicoFloorSlope.add(HelicoRotationZ);
		HelicoRotationZ.rotation.z = CARtheta ;

    renderingEnvironment.addToScene(oHelico);

    renderingEnvironment.addToScene(oTurbineLeft);
    renderingEnvironment.addToScene(oTurbineRight);
    renderingEnvironment.addToScene(oTurbineCentral);

    renderingEnvironment.addToScene(oAxeLeft);
    renderingEnvironment.addToScene(oAxeRight);
    renderingEnvironment.addToScene(oAxeCentral);

    renderingEnvironment.addToScene(oPaleLeft1);
    renderingEnvironment.addToScene(oPaleLeft2);
    renderingEnvironment.addToScene(oPaleLeft3);

    renderingEnvironment.addToScene(oPaleRight1);
    renderingEnvironment.addToScene(oPaleRight2);
    renderingEnvironment.addToScene(oPaleRight3);

    renderingEnvironment.addToScene(oPaleCentral1);
    renderingEnvironment.addToScene(oPaleCentral2);
    renderingEnvironment.addToScene(oPaleCentral3);


    // Helico
    oHelico.position.x = CARx;
    oHelico.position.y = CARy;
    oHelico.position.z = CARz + 20;

    // Turbine Right
    oTurbineRight.position.x = 8.5;
    oTurbineRight.position.y = -3;
    oTurbineRight.position.z = 4;

    HelicoRotationZ.add(oTurbineRight);

    // Axe Right
    oAxeRight.position.x = 8.5;
    oAxeRight.position.y = -2;
    oAxeRight.position.z = 4;

    HelicoRotationZ.add(oAxeRight);

    // Turbine Left
    oTurbineLeft.position.x = -8.5;
    oTurbineLeft.position.y = -3;
    oTurbineLeft.position.z = 4;

    HelicoRotationZ.add(oTurbineLeft);

    // Axe Left
    oAxeLeft.position.x = -8.5;
    oAxeLeft.position.y = -2;
    oAxeLeft.position.z = 4;

    HelicoRotationZ.add(oAxeLeft);

    // Turbine Central
    oTurbineCentral.position.x = 0;
    oTurbineCentral.position.y = 3;
    oTurbineCentral.position.z = 4;
    oTurbineCentral.rotation.x = Math.PI / 2;

    HelicoRotationZ.add(oTurbineCentral);

    // Axe Central
    oAxeCentral.position.x = 0;
    oAxeCentral.position.y = 3;
    oAxeCentral.position.z = 5;
    oAxeCentral.rotation.x = Math.PI / 2;

    HelicoRotationZ.add(oAxeCentral);

    // Pale Left 1
    oPaleLeft1.position.x = 0;
    oPaleLeft1.position.y = 2;
    oPaleLeft1.position.z = 0;
    oPaleLeft2.rotation.y = 0;

    // Pale Left 2
    oPaleLeft2.position.x = 0;
    oPaleLeft2.position.y = 2;
    oPaleLeft2.position.z = 0;
    oPaleLeft2.rotation.y = 90;

    // Pale Left 3
    oPaleLeft3.position.x = 0;
    oPaleLeft3.position.y = 2;
    oPaleLeft3.position.z = 0;
    oPaleLeft3.rotation.y = 180;

    // Pale Right 1
    oPaleRight1.position.x = 0;
    oPaleRight1.position.y = 2;
    oPaleRight1.position.z = 0;
    oPaleRight1.rotation.y = 0;

    // Pale Right 2
    oPaleRight2.position.x = 0;
    oPaleRight2.position.y = 2;
    oPaleRight2.position.z = 0;
    oPaleRight2.rotation.y = 90;

    // Pale Right 3
    oPaleRight3.position.x = 0;
    oPaleRight3.position.y = 2;
    oPaleRight3.position.z = 0;
    oPaleRight3.rotation.y = 180;

    oAxeLeft.add(oPaleLeft1);
    oAxeLeft.add(oPaleLeft2);
    oAxeLeft.add(oPaleLeft3);

    oAxeRight.add(oPaleRight1);
    oAxeRight.add(oPaleRight2);
    oAxeRight.add(oPaleRight3);

    // Pale Central 1
    oPaleCentral1.position.x = 0;
    oPaleCentral1.position.y = 2;
    oPaleCentral1.position.z = 0;
    oPaleCentral1.rotation.y = 0;

    // Pale Central 2
    oPaleCentral2.position.x = 0;
    oPaleCentral2.position.y = 2;
    oPaleCentral2.position.z = 0;
    oPaleCentral2.rotation.y = 90;

    // Pale Central 3
    oPaleCentral3.position.x = 0;
    oPaleCentral3.position.y = 2;
    oPaleCentral3.position.z = 0;
    oPaleCentral3.rotation.y = 180;

    oAxeCentral.add(oPaleCentral1);
    oAxeCentral.add(oPaleCentral2);
    oAxeCentral.add(oPaleCentral3);



    var helico = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: HelicoRotationZ, name: 'helico'});

    var turbineRight = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineRight, name: 'turbineR'});
    var axeRight = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeRight, name: 'axeR'});

    var turbineLeft = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineLeft, name: 'turbineL'});
    var axeLeft = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeLeft, name: 'axeL'});

    var turbineCentral = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineCentral, name: 'turbineC'});
    var axeCentral = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeCentral, name: 'axeC'});

    var paleLeft1 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleLeft1, name: 'oPaleLeft1'});
    var paleLeft2 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleLeft2, name: 'oPaleLeft2'});
    var paleLeft3 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleLeft3, name: 'oPaleLeft3'});

    var paleRight1 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleRight1, name: 'oPaleRight1'});
    var paleRight2 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleRight2, name: 'oPaleRight2'});
    var paleRight3 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleRight3, name: 'oPaleRight3'});

    var paleCentral1 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleCentral1, name: 'oPaleCentral1'});
    var paleCentral2 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleCentral2, name: 'oPaleCentral2'});
    var paleCentral3 = Loader.load({filename: 'assets/helico/pale.obj', node: oPaleCentral3, name: 'oPaleCentral3'});





    // ******* END HELICO *******





    //	Planes Set for Navigation
	// 	z up
	var NAV = new navPlaneSet(
					new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); 		// 01
	NAV.addPlane(	new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 		// 02
	NAV.addPlane(	new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); 	// 03
	NAV.addPlane(	new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04
	NAV.addPlane(	new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05
	NAV.addPlane(	new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06
	NAV.addPlane(	new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07
	NAV.addPlane(	new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08
	NAV.addPlane(	new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09
	NAV.addPlane(	new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10
	NAV.addPlane(	new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11
	NAV.addPlane(	new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12
	NAV.addPlane(	new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13
	NAV.addPlane(	new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14
	NAV.addPlane(	new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15
	NAV.addPlane(	new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16
	NAV.addPlane(	new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17
	NAV.addPlane(	new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18
	NAV.addPlane(	new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19
	NAV.addPlane(	new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20
	NAV.addPlane(	new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21
	NAV.addPlane(	new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22
	NAV.addPlane(	new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23
	NAV.addPlane(	new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24
	NAV.addPlane(	new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25
	NAV.addPlane(	new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26
	NAV.addPlane(	new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27
	NAV.addPlane(	new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28
	NAV.addPlane(	new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29
	NAV.addPlane(	new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30
	NAV.setPos(CARx,CARy,CARz);
	NAV.initActive();
	// DEBUG
	// NAV.debug();
	// var navMesh = NAV.toMesh();
	// renderingEnvironment.addToScene(navMesh);
	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) {
		currentlyPressedKeys[event.keyCode] = true;
        // (P) Change camera mode
        if (event.keyCode === 80) {
            changeCameraMode();
        }
        // (<--) Backspace - reset game
		if (event.keyCode === 8) {
        	resetGame();
		}
		// (Space) for Jumping
		if (event.keyCode === 32) {
        	jump();
		}
		// (Esc) for returning to the menu --> 27
	}

	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
	}

	function handleKeys() {
		if (currentlyPressedKeys[67]) { // (C) debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}
		if (currentlyPressedKeys[68]) { // (D) Right
			vehicleHelico.turnRight(1000) ;
			//vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) { // (Q) Left
			vehicleHelico.turnLeft(1000) ;
			//vehicle.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) { // (Z) Up
			vehicleHelico.goFront(1200, 1200) ;
			//vehicle.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) { // (S) Down
			vehicleHelico.brake(100) ;
			//vehicle.brake(100) ;
		}
	}

    /**
	 * Change camera mode !
     */
	function changeCameraMode() {
		embeddedCamera = !embeddedCamera;
		console.log('camera mode: ' + (embeddedCamera ? 'embedded' : 'fixed'));
	}

	function jump() {
        console.log("Jumping");
        console.log("carGeometry.position.z: " + carGeometry.position.z);
        carGeometry.position.z += 10;
        setTimeout(function(){ carGeometry.position.z -= 10; }, 1000); //1 seconde d'attente

    }

	//	window resize
	function  onWindowResize() {
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}

    //          y
    //          |
    // x -------|---------
    //          |
    //          |

    // camera position X, camera position Y
    var items = [
        [-220, -40], // P1
        [-260, 280], // P2
        [-260, 280], // P3
        [-260, 280], // P4
        [-260, 280], // P5
        [65, 285],   // P6
        [65, 245],   // P7
        [5, 225],    // P8
        [50, 90],    // P9
        [50, 90],    // P10
        [160, 50],   // P11
        [160, 50],   // P12
        [160, 50],   // P13
        [225, -20],  // P14
        [225, -20],  // P15
        [210, -165], // P16
        [210, -165], // P17
        [210, -165], // P18
        [210, -165], // P19
        [210, -165], // P20
        [210, -165], // P21
        [210, -165], // P22
        [-107, -71], // P23
        [-107, -71], // P24
        [-107, -71], // P25
        [-171, -230],// P26
        [-171, -230],// P27
        [-171, -230],// P28
        [-171, -230],// P29
        [-171, -230] // P30
    ];



    function render(chart, data) {
		requestAnimationFrame( render );
		handleKeys();

		// Vehicle stabilization
		vehicle.goUp(vehicle.weight()/4.0, vehicle.weight()/4.0, vehicle.weight()/4.0, vehicle.weight()/4.0) ;
		vehicle.stopAngularSpeedsXY() ;
		vehicle.stabilizeSkid(50) ;
		vehicle.stabilizeTurn(1000) ;
		var oldPosition = vehicle.position.clone();
		vehicle.update(1.0/60);
		var newPosition = vehicle.position.clone();

		// helico stabilization
		vehicleHelico.goUp(vehicleHelico.weight()/4.0, vehicleHelico.weight()/4.0, vehicleHelico.weight()/4.0, vehicleHelico.weight()/4.0) ;
		vehicleHelico.stopAngularSpeedsXY() ;
		vehicleHelico.stabilizeSkid(50) ;
		vehicleHelico.stabilizeTurn(1000) ;

		var oldPosition = vehicleHelico.position.clone();
		vehicleHelico.update(1.0/60);
		var newPosition = vehicleHelico.position.clone();



		newPosition.sub(oldPosition);
		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;
		// OHelico
		oHelico.position.set(NAV.x, NAV.y, NAV.z) ;
		// carPosition
		carPosition.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.y ;

		// update helico
		vehicleHelico.position.x = NAV.x ;
		vehicleHelico.position.y = NAV.y ;
		// Updates carFloorSlope
		carFloorSlope.matrixAutoUpdate = false;
		carFloorSlope.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates carRotationZ
		carRotationZ.rotation.z = vehicle.angles.z-Math.PI/2.0;

		HelicoRotationZ.rotation.z = vehicleHelico.angles.z-Math.PI/2.0;
        // console.log(vehicle.speed.z) ;

		if (!raceEnd){
	  	updateTimer(clock.getElapsedTime());
		}
		// console.log('x: ' + NAV.x);
		// console.log('y: ' + NAV.y);
		// console.log('plane active: ' + items[NAV.findActive(NAV.x, NAV.y)]);
		var currentPlane = parseInt(NAV.findActive(NAV.x, NAV.y));


        // check laps
        if (lastPlaneCheck !== currentPlane) {
        	// Check if lap is done
        	if (currentPlane === 1 && lastPlaneCheck === 0 && allCheckpointsDone()) { // error can't use ===
                oneLapDone();
			}
			// Check right way
            if (currentPlane < lastPlaneCheck) {
        		if (currentPlane === 0 && lastPlaneCheck === 29) {
        			// do nothing
        		} else {
                document.getElementsByClassName("warning")[0].style.display = 'block';
				}
            } else {
                document.getElementsByClassName("warning")[0].style.display = 'none';
            }
            // add this plane to plane checked for this lap
            currentPlaneCheckpointsLap.push(currentPlane);
            // set currentPlane as lastPlaneCheck
            lastPlaneCheck = currentPlane;
        }

		if (embeddedCamera) {
			helico.add(renderingEnvironment.camera);
			//carGeometry.add(renderingEnvironment.camera);
			renderingEnvironment.camera.position.x = 0.0;
			renderingEnvironment.camera.position.z = 10.0;
			renderingEnvironment.camera.position.y = -25.0;
			renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0;
			renderingEnvironment.camera.rotation.y = 0;
			renderingEnvironment.camera.rotation.z = 0;
		} else {
			carGeometry.remove(renderingEnvironment.camera);
            // Camera position
            renderingEnvironment.camera.position.x = items[currentPlane][0];
            renderingEnvironment.camera.position.y = items[currentPlane][1];
            renderingEnvironment.camera.position.z = NAV.z + 40; // +vehicle.speed.length()*2

            // Camera rotation
            renderingEnvironment.camera.up = new THREE.Vector3(0,0,1);
            renderingEnvironment.camera.lookAt( NAV );
            // renderingEnvironment.camera.rotation.x = 1;
            // renderingEnvironment.camera.rotation.y = NAV.y*3.14159/180.0;
            // renderingEnvironment.camera.rotation.z = Math.PI*2;
		}

		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);

        //console.log("old_pos" + old_position)
	};

	function resetGame() {
		console.log('resetGame');
		// reset position vehicle
		vehicle.angles.z = Math.PI/2;
		NAV.setPos(-220,0,0);

		NAV.initActive();
		vehicle.speed = new THREE.Vector3(0.0,0.0,0.0);


		// reset camera position
	  embeddedCamera = true;

		// reset tour
		initLaps();
    currentPlaneCheckpointsLap = [];
    lastPlaneCheck = 0;
    hideRaceEnd();
		initTimerLaps();

		// reset speed
    speedChartData.setValue(0, 1, 0);
    speedChart.draw(speedChartData, speedChartOptions);


	}

    var old_position = [NAV.x, NAV.y];
    var current_position = [NAV.x, NAV.y];
    var time = 500; // ms
    setInterval(function() {
        var x_vector_dep = current_position[0] - old_position[0];
        var y_vector_dep = current_position[1] - old_position[1];
        var norm = Math.sqrt(Math.pow(x_vector_dep, 2) + Math.pow(y_vector_dep, 2));
		// Update speedometer
        speedChartData.setValue(0, 1, Math.round(norm/(time/1000)));
        speedChart.draw(speedChartData, speedChartOptions);
		// Update position
        old_position = current_position;
        current_position = [NAV.x, NAV.y]
    }, time);


    rotateAxe();

	render();

    /**
	 * Return true if all checkpoints is in currentPlaneCheckpointsLap
     * @returns {boolean}
     */
	function allCheckpointsDone() {
        return planeCheckpoints.every(function(val) {
            return currentPlaneCheckpointsLap.indexOf(parseInt(val)) !== -1;
        });
	}

    /**
	 * Call when one lap is done
     */
	function oneLapDone() {
		// reset checkpoints done in previous lap
    currentPlaneCheckpointsLap = [];

		// Set to end or increment laps

		if (laps === maxLaps) {
			showRaceEnd();
			updateTimerLaps(clock.getElapsedTime(),laps);
			updateLaps(laps);
		} else if(laps < maxLaps){

			updateTimerLaps(clock.getElapsedTime(),laps);
			laps += 1;
      updateLaps(laps);
		}

	}

    function rotateAxe() {
        setInterval(function() {
            oAxeLeft.rotation.y = oAxeLeft.rotation.y + 2 * Math.PI * 3/100;
            oAxeRight.rotation.y = oAxeRight.rotation.y + 2 * Math.PI * 3/100;
            oAxeCentral.rotation.y = oAxeCentral.rotation.y + 2 * Math.PI * 3/100;
        }, 10);
    }
}

/**
 * Init Google chart for speedometer
 */
function initSpeedometerChart() {
    google.charts.load('current', {'packages':['gauge']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        speedChart = new google.visualization.Gauge(document.getElementById('chart_speed'));
        speedChartData = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            ['Speed', 0]
        ]);
        speedChart.draw(speedChartData, speedChartOptions);
    }
}

/**
 * Init laps
 */
function initLaps() {
	laps = 1;
	updateLaps(laps);
}

/**
 *
 * @param newLapsValue
 */
function updateLaps(newLapsValue) {
    document.getElementsByClassName("laps")[0].innerHTML = newLapsValue + " / " + maxLaps;
}
/**
 * Show div for race end
 */
function showRaceEnd() {
	raceEnd = true;
    document.getElementsByClassName("finish")[0].style.display = 'block';
}

/**
 * Hide div for race end
 */
function hideRaceEnd() {
	raceEnd = false;
    document.getElementsByClassName("finish")[0].style.display = 'none';
}

function updateTimer(time) {

    document.getElementsByClassName("time")[0].innerHTML = time.toFixed(2) ;
}

function updateTimerLaps(time,laps) {
	document.getElementsByClassName("timelaps"+laps)[0].style.display = 'block';
	document.getElementsByClassName("timelaps"+laps)[0].innerHTML = "Tour "+laps + " : "+time.toFixed(2);
	clock = new THREE.Clock;
	if(laps<3){
		clock.start();
	}else{
		document.getElementsByClassName("time")[0].innerHTML = "0.00" ;
	}

}

function initTimerLaps(){
	  clock = new THREE.Clock;
		clock.start();
		document.getElementsByClassName("timelaps1")[0].style.display = 'none';
		document.getElementsByClassName("timelaps2")[0].style.display = 'none';
		document.getElementsByClassName("timelaps3")[0].style.display = 'none';
}
