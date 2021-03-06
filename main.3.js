/**
 *  ThreeJS engine file using the ThreeRender class
 */

//Loads all dependencies
requirejs(['ModulesLoaderV2.js'], function() {
	// Level 0 includes
	// ModulesLoader.requireModules(["lib/dat.gui.js"]) ;
	ModulesLoader.requireModules(["threejs/three.min.js"]) ;
	ModulesLoader.requireModules(["myJS/ThreeRenderingEnv.js",
								  "myJS/ThreeLightingEnv.js",
								  "myJS/ThreeLoadingEnv.js",
								  "myJS/navZ.js",
								  "FlyingVehicle.js"]) ;
	ModulesLoader.requireModules(["ParticleSystem.js"]) ;
	ModulesLoader.requireModules(["Interpolators.js", "MathExt.js"]) ;
	ModulesLoader.requireModules(["constants.js"]);
	// Loads modules contained in includes and starts main function
	ModulesLoader.loadModules(start);
});

// camera mode
var embeddedCamera = true;

//
var isCar = false;
// vehicle
var vehicle;
var rotationZ; //tout hélico
var geometry; //que body helico
var position;
var floorSlope;
var engine; //particle system
var enginebis;

// Axe
var oAxeLeft;
var oAxeRight;
var oAxeCentral;

// Turbine
var oTurbineLeft;
var oTurbineRight;
var oTurbineCentral;



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
	//	MAR 2014 - nav engine
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

	// Rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	// Lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	// Loading env
	var Loader = new ThreeLoadingEnv();

	// Init the vehicule to start with
    if (isCar) {
        initCar(CARx,CARy,CARz,CARtheta,renderingEnvironment,Loader);
    } else {
        initHelico(CARx,CARy,CARz,CARtheta,renderingEnvironment,Loader);
    }


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




	//	Skybox
	Loader.loadSkyBox('assets/maps',['px','nx','py','ny','pz','nz'],'jpg', renderingEnvironment.scene, 'sky',4000);

    //	Planes Set for Navigation
	// 	z up
	var NAV = getNavPlaneSet();
	NAV.setPos(CARx,CARy,CARz);
	NAV.initActive();

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

        // (P) Change camera mode
        if (event.keyCode === 80 && !currentlyPressedKeys[event.keyCode] ) {
          changeCameraMode();
        }
        // (<--) Backspace - reset game
		if (event.keyCode === 8 && !currentlyPressedKeys[event.keyCode] ) {
        	resetGame();
		}
		// (Space) for Jumping
		if (event.keyCode === 32 && !currentlyPressedKeys[event.keyCode] ) {
        	jump();
		}
		// (N) for change vehicle + reset game
		if (event.keyCode === 78 && !currentlyPressedKeys[event.keyCode] ) {
          changeVehicleUsed(renderingEnvironment, Loader);
		}

		if(event.keyCode === 81 && !currentlyPressedKeys[event.keyCode]) { // (Q) Left

			var intervalRight = setInterval(function(){

				if(Math.round(oTurbineLeft.rotation.z*100)/100 > -0.20 && currentlyPressedKeys[81]){
					oTurbineLeft.rotation.z -= 0.01;
					oTurbineRight.rotation.z -= 0.01;

				}else if(!currentlyPressedKeys[81] && Math.round(oTurbineLeft.rotation.z*100)/100 <= 0){
					if(Math.round(oTurbineLeft.rotation.z*100)/100 < 0.20) {
						oTurbineLeft.rotation.z +=  0.01;
						oTurbineRight.rotation.z += 0.01;
					}
				}else if(!currentlyPressedKeys[81]){

					clearInterval(intervalRight);
				}
			}, 50);
		}

		if(event.keyCode === 68 && !currentlyPressedKeys[event.keyCode]) { // (D) Right

			var intervalLeft = setInterval(function(){

				if(Math.round(oTurbineLeft.rotation.z*100)/100 < 0.20 && currentlyPressedKeys[68] ){
					oTurbineLeft.rotation.z +=  0.01;
					oTurbineRight.rotation.z += 0.01;

				}else if(!currentlyPressedKeys[68] && Math.round(oTurbineLeft.rotation.z*100)/100 !== 0){
					if(Math.round(oTurbineLeft.rotation.z*100)/100 > -0.20){
						oTurbineLeft.rotation.z -= 0.01;
						oTurbineRight.rotation.z -= 0.01;
					}
				}else if(!currentlyPressedKeys[68]){

					clearInterval(intervalLeft);
				}
			}, 50);
		}
		currentlyPressedKeys[event.keyCode] = true;
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
			vehicle.turnRight(1000);

		}
		if (currentlyPressedKeys[81]) { // (Q) Left
			vehicle.turnLeft(1000);

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
        console.log("rotationZ.position.z: " + rotationZ.position.z);
        rotationZ.position.z += 10;
        setTimeout(function(){ rotationZ.position.z -= 10; }, 1000); //1 seconde d'attente

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
    var items = getPositionCamera();



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
		// OHelico
		// oHelico.position.set(NAV.x, NAV.y, NAV.z) ;
		// position
		if(isCar) {
			position.position.set(NAV.x, NAV.y, NAV.z) ;
		} else {
			position.position.set(NAV.x, NAV.y, NAV.z + 20);
		}
		// Updates the vehicle
		vehicle.position.x = NAV.x ;
		vehicle.position.y = NAV.y ;

		// update helico
		// vehicleHelico.position.x = NAV.x ;
		// vehicleHelico.position.y = NAV.y ;
		// Updates floorSlope
		floorSlope.matrixAutoUpdate = false;
		floorSlope.matrix.copy(NAV.localMatrix(CARx,CARy));
		// Updates rotationZ
		rotationZ.rotation.z = vehicle.angles.z-Math.PI/2.0;

		//HelicoRotationZ.rotation.z = vehicleHelico.angles.z-Math.PI/2.0;
        // console.log(vehicle.speed.z) ;

		if (!raceEnd) {
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
			// helico.add(renderingEnvironment.camera);
			geometry.add(renderingEnvironment.camera);
			renderingEnvironment.camera.position.x = 0.0;
			renderingEnvironment.camera.position.z = 10.0;
			renderingEnvironment.camera.position.y = -25.0;
			renderingEnvironment.camera.rotation.x = 85.0*3.14159/180.0;
			renderingEnvironment.camera.rotation.y = 0;
			renderingEnvironment.camera.rotation.z = 0;
		} else {
			geometry.remove(renderingEnvironment.camera);
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
        //engine = addParticleSystem();
        engine.animate(0.4, render);
        enginebis.animate(0.4,render);

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
		var speedOfVehicle;
    setInterval(function() {
        var x_vector_dep = current_position[0] - old_position[0];
        var y_vector_dep = current_position[1] - old_position[1];
        var norm = Math.sqrt(Math.pow(x_vector_dep, 2) + Math.pow(y_vector_dep, 2));
		// Update speedometer
		    speedOfVehicle = Math.round(norm/(time/1000));
        speedChartData.setValue(0, 1,speedOfVehicle );
        speedChart.draw(speedChartData, speedChartOptions);
		// Update position
        old_position = current_position;
        current_position = [NAV.x, NAV.y];
        // Update z angle of vehicle
		if (!isCar) {
            position.rotation.x = Math.PI / 15 + speedOfVehicle / 300;
		}
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
						if(speedOfVehicle !== undefined){
	            oAxeLeft.rotation.y = oAxeLeft.rotation.y + 2 * Math.PI * (speedOfVehicle/10)/100;
	            oAxeRight.rotation.y = oAxeRight.rotation.y + 2 * Math.PI * (speedOfVehicle/10)/100;
							}
	            oAxeCentral.rotation.y = oAxeCentral.rotation.y + 2 * Math.PI * 6/100;

        }, 10);
    }

    function changeVehicleUsed(renderingEnvironment, Loader) {

			renderingEnvironment.removeToScene(position);
			renderingEnvironment.removeToScene(floorSlope);
			renderingEnvironment.removeToScene(rotationZ);

			if (isCar) {
				initHelico(CARx,CARy,CARz,CARtheta,renderingEnvironment, Loader);
			} else {
				initCar(CARx,CARy,CARz,CARtheta,renderingEnvironment, Loader);
			}
			isCar = !isCar;
			resetGame();
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
 * Load Particle system
 */
function addParticleSystem(enginex){

    //Configurations
    var conf = {
        textureFile:"assets/particles/particle.png",
        particlesCount: 10000,
        blendingMode:THREE.AdditiveBlending
    };

    // Particle System
    enginex = new ParticleSystem.Engine_Class(conf);

    // Modificateurs pour gérer les caractéristiques des particules
        // Gère la durée de vie des particules
    enginex.addModifier(new ParticleSystem.LifeTimeModifier_Class());
        // prise en compte de la vitesse
    enginex.addModifier(new ParticleSystem.ForceModifier_Weight_Class());
    enginex.addModifier(new ParticleSystem.PositionModifier_EulerItegration_Class());

    // Empêche les particules de traverser le plan
    //engine.addModifier(new ParticleSystem.PositionModifier_PlaneLimit_Class(THREE.Vector3( 0, 0, 0 ), 0));

    enginex.addModifier(new ParticleSystem.OpacityModifier_TimeToDeath_Class(new Interpolators.Linear_Class(2,0)));
    enginex.addModifier(new ParticleSystem.SizeModifier_TimeToDeath_Class(new Interpolators.Linear_Class(1,0)));

    // Change la couleur des particules avec la durée de vie
    enginex.addModifier(new ParticleSystem.ColorModifier_TimeToDeath_Class(new THREE.Color("white"), new THREE.Color("red")));

    return enginex;
}

/**
 * Load Car
 */
function initCar(x, y, z, theta, renderingEnvironment, Loader){
	vehicle = new FlyingVehicle({
		position: new THREE.Vector3(x, y, z),
		zAngle : theta + Math.PI/2.0
	});

	position = new THREE.Object3D();
	position.name = 'car0';
	renderingEnvironment.addToScene(position);
	// initial POS
	position.position.x = x;
	position.position.y = y;
	position.position.z = z;
	// car Rotation floor slope follow
	floorSlope = new THREE.Object3D();
	floorSlope.name = 'car1';
	position.add(floorSlope);
	// car vertical rotation
	rotationZ = new THREE.Object3D();
	rotationZ.name = 'car2';
	floorSlope.add(rotationZ);
	rotationZ.rotation.z = theta;
	// the car itself
	// simple method to load an object
	geometry = Loader.load({filename: 'assets/car_Zup_01.obj', node: rotationZ, name: 'car3'});
	geometry.position.z = + 2;

	// Particles

        //conf
    var confEmitterD = {
        cone: {
            center: new THREE.Vector3(2.65,-6,2), //  gauche/ profondeur / hauteur
            height: new THREE.Vector3(0,-0.5,0), //
            radius: 0.9,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5, 10),
            mass: new MathExt.Interval_Class(0.1 , 0.3),
            size: new MathExt.Interval_Class(0.1 ,1),
            lifeTime: new MathExt.Interval_Class(1, 7),
        }
    };
    var confEmitterG = {
        cone: {
            center: new THREE.Vector3(-2.65,-6,2), //-3.2,-7,2
            height: new THREE.Vector3(0,-0.5,0), //(1.5,-4,0.3) 1.5,-15,1
            radius: 0.9,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5, 10),
            mass: new MathExt.Interval_Class(0.1 , 0.3),
            size: new MathExt.Interval_Class(0.1 ,1),
            lifeTime: new MathExt.Interval_Class(1, 7),
        }
    };
    var emitD = new ParticleSystem.ConeEmitter_Class(confEmitterD);
    var emitG = new ParticleSystem.ConeEmitter_Class(confEmitterG);
	engine = addParticleSystem(engine);
    engine.addEmitter(emitD);
    engine.addEmitter(emitG);
    rotationZ.add(engine.particleSystem);

}

/**
 * Load Helico
 */
function initHelico(x, y, z, theta, renderingEnvironment, Loader){
	// ******* START HELICO *******
		vehicle = new FlyingVehicle({
			position: new THREE.Vector3(x, y, z),
			zAngle : theta+Math.PI/2.0
		} );

		position = new THREE.Object3D();

		oTurbineLeft = new THREE.Object3D();
		oTurbineRight = new THREE.Object3D();
		oTurbineCentral = new THREE.Object3D();

		oAxeLeft = new THREE.Object3D();
		oAxeRight = new THREE.Object3D();
		oAxeCentral = new THREE.Object3D();

		var oPaleLeft1 = new THREE.Object3D();
		var oPaleLeft2 = new THREE.Object3D();
		var oPaleLeft3 = new THREE.Object3D();

		var oPaleRight1 = new THREE.Object3D();
		var oPaleRight2 = new THREE.Object3D();
		var oPaleRight3 = new THREE.Object3D();

		var oPaleCentral1 = new THREE.Object3D();
		var oPaleCentral2 = new THREE.Object3D();
		var oPaleCentral3 = new THREE.Object3D();

		floorSlope = new THREE.Object3D();
		floorSlope.name = 'helico1';
		position.add(floorSlope);
		// car vertical rotation
		rotationZ = new THREE.Object3D();
		rotationZ.name = 'helico2';
		floorSlope.add(rotationZ);
		rotationZ.rotation.z = theta;

		renderingEnvironment.addToScene(position);

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
		position.position.x = x;
		position.position.y = y;
		position.position.z = z;

		// Turbine Right
		oTurbineRight.position.x = 8.5;
		oTurbineRight.position.y = -3;
		oTurbineRight.position.z = 4;

		rotationZ.add(oTurbineRight);

		// Axe Right
		oAxeRight.position.x = 0;
		oAxeRight.position.y = 1.5;
		oAxeRight.position.z = 0;

		oTurbineRight.add(oAxeRight);

		// Turbine Left
		oTurbineLeft.position.x = -8.5;
		oTurbineLeft.position.y = -3;
		oTurbineLeft.position.z = 4;

		rotationZ.add(oTurbineLeft);

		// Axe Left
		oAxeLeft.position.x = 0;
		oAxeLeft.position.y = 1.5;
		oAxeLeft.position.z = 0;

		oTurbineLeft.add(oAxeLeft);

		// Turbine Central
		oTurbineCentral.position.x = 0;
		oTurbineCentral.position.y = 3;
		oTurbineCentral.position.z = 4;
		oTurbineCentral.rotation.x = Math.PI / 2;

		rotationZ.add(oTurbineCentral);

		// Axe Central
		oAxeCentral.position.x = 0;
		oAxeCentral.position.y = 3;
		oAxeCentral.position.z = 5;
		oAxeCentral.rotation.x = Math.PI / 2;

		rotationZ.add(oAxeCentral);

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



		geometry = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: rotationZ, name: 'helico'});

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

    //Particles

    // conf emitters
    var confEmitterD = {
        cone: {
            center: new THREE.Vector3(0,0,0), // 9,-4,4  gauche/ profondeur / hauteur
            height: new THREE.Vector3(0,-0.5,0), //(0.5,-15,0.5) 1.5,-15,1
            radius: 0.4,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5, 10),
            mass: new MathExt.Interval_Class(0.1 , 0.3),
            size: new MathExt.Interval_Class(0.1 ,1), // à 5
            lifeTime: new MathExt.Interval_Class(0.5, 1.5),
        }
    };
    var confEmitterG = {
        cone: {
            center: new THREE.Vector3(0,0,0), //-3.2,-7,2
            height: new THREE.Vector3(0,-0.5,0), //(1.5,-4,0.3) 1.5,-15,1
            radius: 0.4,
            flow: 100,
        },
        particle: {
            speed: new MathExt.Interval_Class(5, 10),
            mass: new MathExt.Interval_Class(0.1, 0.3),
            size: new MathExt.Interval_Class(0.1 ,1),
            lifeTime: new MathExt.Interval_Class(0.5, 1.5),
        }
    };
    var emitD = new ParticleSystem.ConeEmitter_Class(confEmitterD);
    var emitG = new ParticleSystem.ConeEmitter_Class(confEmitterG);
    engine = addParticleSystem(engine);
    engine.addEmitter(emitD);
    enginebis = addParticleSystem(enginebis);
    enginebis.addEmitter(emitG);
    oTurbineRight.add(engine.particleSystem);
    oTurbineLeft.add(enginebis.particleSystem);


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
