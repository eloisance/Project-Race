/**
 *  ThreeJS engine file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function()
		{
			// Level 0 includes
			ModulesLoader.requireModules(["threejs/three.min.js"]) ;
			ModulesLoader.requireModules([ "myJS/ThreeRenderingEnv.js",
			                              "myJS/ThreeLightingEnv.js",
			                              "myJS/ThreeLoadingEnv.js",
			                              "myJS/navZ.js",
			                              "FlyingVehicle.js"]) ;
            ModulesLoader.requireModules(["ParticleSystem.js"]) ;
            ModulesLoader.requireModules(["Interpolators.js", "MathExt.js"]) ;
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
);

// camera mode
var embeddedCamera = true;

// laps
var laps;
var lastPlaneCheck;

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
	//	MAR 2014 - nav engine
	//	author(s) : Cozot, R. and Lamarche, F.
	//	date : 11/16/2014
	//	last : 11/25/2014
	//	----------------------------------------------------------------------------
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};
	// car Position
	var CARx = -220;
	var CARy = 0;
	var CARz = 0;
	var CARtheta = 0;

	// Creates the vehicle (handled by physics)
	var vehicle = new FlyingVehicle({
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

	//Meshes
	Loader.loadMesh('assets','border_Zup_02','obj',	renderingEnvironment.scene,'border',	-340,-340,0,'front');
	Loader.loadMesh('assets','ground_Zup_03','obj',	renderingEnvironment.scene,'ground',	-340,-340,0,'front');
	Loader.loadMesh('assets','circuit_Zup_02','obj',renderingEnvironment.scene,'circuit',	-340,-340,0,'front');
	//Loader.loadMesh('assets','tree_Zup_02','obj',	renderingEnvironment.scene,'trees',	-340,-340,0,'double');
	Loader.loadMesh('assets','arrivee_Zup_01','obj',	renderingEnvironment.scene,'decors',	-340,-340,0,'front');

	// Système à particules : fumée des pots d'échappement
    var conf = {
        textureFile:"assets/particles/particle.png",
        particlesCount: 10000,
        blendingMode:THREE.AdditiveBlending
    };

    var confEmitterD = {
        cone: {
            center: new THREE.Vector3(2.65,-8,2), // 2.5,-7,2  gauche/ profondeur / hauteur
            height: new THREE.Vector3(0,-0.5,0), //(0.5,-15,0.5) 1.5,-15,1
            radius: 0.9,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5 , 10),
            mass: new MathExt.Interval_Class(0.1 , 0.3),
            size: new MathExt.Interval_Class(0.1 ,1),
            lifeTime: new MathExt.Interval_Class(1 , 7),
        }
    };
    var confEmitterG = {
        cone: {
            center: new THREE.Vector3(-2.65,-8,2), //-3.2,-7,2
            height: new THREE.Vector3(0,-0.5,0), //(1.5,-4,0.3) 1.5,-15,1
            radius: 0.9,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5 , 10),
            mass: new MathExt.Interval_Class(0.1 , 0.3),
            size: new MathExt.Interval_Class(0.1 ,1),
            lifeTime: new MathExt.Interval_Class(1 , 7),
        }
    };
    var engine = new ParticleSystem.Engine_Class(conf);
    var emitD = new ParticleSystem.ConeEmitter_Class(confEmitterD);
    var emitG = new ParticleSystem.ConeEmitter_Class(confEmitterG);

    // Modificateurs pour gérer les caractéristiques des particules
        // Gère la durée de vie des particules
    engine.addModifier(new ParticleSystem.LifeTimeModifier_Class());
        // prise en compte de la vitesse
    //engine.addModifier(new ParticleSystem.ForceModifier_ResetForce_Class());
    engine.addModifier(new ParticleSystem.ForceModifier_Weight_Class());
    engine.addModifier(new ParticleSystem.PositionModifier_EulerItegration_Class());

        // Empêche les particules de traverser le plan
    //engine.addModifier(new ParticleSystem.PositionModifier_PlaneLimit_Class(THREE.Vector3( 0, 0, 0 ), 0));

     //engine.addModifier(new ParticleSystem.ForceModifier_ResetForce_Class())
      //engine.addModifier(new ParticleSystem.ForceModifier_Weight_Class());
    //
     engine.addModifier(new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(0,2)));
     engine.addModifier(new ParticleSystem.SizeModifier_TimeToDeath_Class(new Interpolators.Linear_Class(0,2)));

        // Change la couleur des particules avec la durée de vie
     engine.addModifier(new ParticleSystem.ColorModifier_TimeToDeath_Class(new THREE.Color("white"), new THREE.Color("red")));

    engine.addEmitter(emitD);
    engine.addEmitter(emitG);

    //applyaxisangle


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
    carGeometry.add(engine.particleSystem);
	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);

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
	//NAV.debug();
	//var navMesh = NAV.toMesh();
	//renderingEnvironment.addToScene(navMesh);
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
			vehicle.turnRight(1000) ;
		}
		if (currentlyPressedKeys[81]) { // (Q) Left
			vehicle.turnLeft(1000) ;
		}
		if (currentlyPressedKeys[90]) { // (Z) Up
			vehicle.goFront(1200, 1200) ;
		}
		if (currentlyPressedKeys[83]) { // (S) Down
			vehicle.brake(100) ;
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
        [-220, -40],  // P1
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
		newPosition.sub(oldPosition);
		// NAV
		NAV.move(newPosition.x, newPosition.y, 150,10) ;
		// carPosition
		carPosition.position.set(NAV.x, NAV.y, NAV.z) ;
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.Y ;
		// Updates carFloorSlope
		carFloorSlope.matrixAutoUpdate = false;
		carFloorSlope.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates carRotationZ
		carRotationZ.rotation.z = vehicle.angles.z-Math.PI/2.0;
        // console.log(vehicle.speed.z) ;

		// console.log('x: ' + NAV.x);
		// console.log('y: ' + NAV.y);
		// console.log('plane active: ' + items[NAV.findActive(NAV.x, NAV.y)]);
		var currentPlane = NAV.findActive(NAV.x, NAV.y);

		if (embeddedCamera) {
			carGeometry.add(renderingEnvironment.camera);
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
        engine.animate(0.5, render);

        //console.log("old_pos" + old_position)
	};

    var old_position = [NAV.x, NAV.y];
    var current_position = [NAV.x, NAV.y];
    var time = 500; // ms
    setInterval(function(){
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

	render();
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
	document.getElementsByClassName("laps")[0].innerHTML = "1 / 3";
}

function resetGame() {
	console.log('resetGame');

	// reset camera
    embeddedCamera = true;

    // reset position vehicle

	// reset camera position
}