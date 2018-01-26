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

    var oPaleLeft1 = new THREE.Object3D();
    var oPaleLeft2 = new THREE.Object3D();
    var oPaleLeft3 = new THREE.Object3D();

    var oPaleRight1 = new THREE.Object3D();
    var oPaleRight2 = new THREE.Object3D();
    var oPaleRight3 = new THREE.Object3D();

    var oPaleCentral1 = new THREE.Object3D();
    var oPaleCentral2 = new THREE.Object3D();
    var oPaleCentral3 = new THREE.Object3D();


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

    var helico = Loader.load({filename: 'assets/helico/helicoCorp.obj', node: oHelico, name: 'helico'});

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
