/**
 *  ThreeJS test file using the ThreeRender class
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
			// Loads modules contained in includes and starts main function
			ModulesLoader.loadModules(start) ;
		}
) ;

function start()
{
	//	----------------------------------------------------------------------------
	//	MAR 2014 - TP Animation hélicoptère
	//	author(s) : Cozot, R. and Lamarche, F.
	//	----------------------------------------------------------------------------
	//	global vars
	//	----------------------------------------------------------------------------
	//	keyPressed
	var currentlyPressedKeys = {};


	//	rendering env
	var renderingEnvironment =  new ThreeRenderingEnv();

	//	lighting env
	var Lights = new ThreeLightingEnv('rembrandt','neutral','spot',renderingEnvironment,5000);

	//	Loading env
	var Loader = new ThreeLoadingEnv();

	// Camera setup
	renderingEnvironment.camera.position.x = 0 ;
	renderingEnvironment.camera.position.y = 0 ;
	renderingEnvironment.camera.position.z = 40 ;

	// **** Helico **** //

	var oHelico = new THREE.Object3D();

  var oTurbineLeft = new THREE.Object3D();
  var oTurbineRight = new THREE.Object3D();
  var oTurbineCentral = new THREE.Object3D();

  var oAxeLeft = new THREE.Object3D();
  var oAxeRight = new THREE.Object3D();
  var oAxeCentral = new THREE.Object3D();

	var oPaleLeft = new THREE.Object3D();
	var oPaleRight = new THREE.Object3D();


    renderingEnvironment.addToScene(oHelico);

    renderingEnvironment.addToScene(oTurbineLeft);
    renderingEnvironment.addToScene(oTurbineRight);
    renderingEnvironment.addToScene(oTurbineCentral);

    renderingEnvironment.addToScene(oAxeLeft);
    renderingEnvironment.addToScene(oAxeRight);
    renderingEnvironment.addToScene(oAxeCentral);

    renderingEnvironment.addToScene(oPaleLeft);
    renderingEnvironment.addToScene(oPaleRight);


	// Helico
    oHelico.position.x = 0;
    oHelico.position.y = 0;
    oHelico.position.z = 0;

    // Turbine Right
    oTurbineRight.position.x = 8.5;
    oTurbineRight.position.y = -3;
    oTurbineRight.position.z = 4;

    // Axe Right
    oAxeRight.position.x = 8.5;
    oAxeRight.position.y = -2;
    oAxeRight.position.z = 4;

    // Turbine Left
    oTurbineLeft.position.x = -8.5;
    oTurbineLeft.position.y = -3;
    oTurbineLeft.position.z = 4;

    // Axe Left
    oAxeLeft.position.x = -8.5;
    oAxeLeft.position.y = -2;
    oAxeLeft.position.z = 4;

    // Turbine Central
    oTurbineCentral.position.x = 0;
    oTurbineCentral.position.y = 3;
    oTurbineCentral.position.z = 4;
    oTurbineCentral.rotation.x = Math.PI / 2;

    // Axe Central
    oAxeCentral.position.x = 0;
    oAxeCentral.position.y = 3;
    oAxeCentral.position.z = 5;
    oAxeCentral.rotation.x = Math.PI / 2;


    var helico = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: oHelico, name: 'helico'});

    var turbineRight = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineRight, name: 'turbineR'});
    var axeRight = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeRight, name: 'axeR'});

    var turbineLeft = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineLeft, name: 'turbineL'});
    var axeLeft = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeLeft, name: 'axeL'});

    var turbineLeft = Loader.load({filename: 'assets/helico/turbine.obj', node: oTurbineCentral, name: 'turbineC'});
    var axeLeft = Loader.load({filename: 'assets/helico/axe.obj', node: oAxeCentral, name: 'axeC'});

    // 90° = MAth.PI / 4


	//	event listener
	//	---------------------------------------------------------------------------
	//	resize window
	window.addEventListener( 'resize', onWindowResize, false );
	//	keyboard callbacks
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	//	callback functions
	//	---------------------------------------------------------------------------
	function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true;}
	function handleKeyUp(event) {currentlyPressedKeys[event.keyCode] = false;}

	function handleKeys() {
		if (currentlyPressedKeys[67]) // (C) debug
		{
			// debug scene
			renderingEnvironment.scene.traverse(function(o){
				console.log('object:'+o.name+'>'+o.id+'::'+o.type);
			});
		}
		var rotationIncrement = 0.05 ;
		if (currentlyPressedKeys[68]) // (D) Right
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[81]) // (Q) Left
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(0.0,1.0,0.0), -rotationIncrement) ;
		}
		if (currentlyPressedKeys[90]) // (Z) Up
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), rotationIncrement) ;
		}
		if (currentlyPressedKeys[83]) // (S) Down
		{
			renderingEnvironment.scene.rotateOnAxis(new THREE.Vector3(1.0,0.0,0.0), -rotationIncrement) ;
		}
	}

	//	window resize
	function  onWindowResize()
	{
		renderingEnvironment.onWindowResize(window.innerWidth,window.innerHeight);
	}

	function render() {
		requestAnimationFrame( render );
		handleKeys();
		// Rendering
		renderingEnvironment.renderer.render(renderingEnvironment.scene, renderingEnvironment.camera);
	};

	render();
}
