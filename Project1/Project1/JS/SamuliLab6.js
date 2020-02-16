///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: February 14, 2020
//Filename: Samuli.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let stats;
//lights
let directionalLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;
//lights' colors
let directionalLightColor = 0x404040;
let hemiSphereSkyLightColor = 0x0000ff;
let hemiSphereGroundLightColor = 0x00ff00;


let axesHelper;
let control;

//Geometry
let ferrisWheel;
let baseContainer, wheelContainer, wheelContainerChild, spokeContainer,spokeContainerChild,
    casketContainer,casketContainerChild;
let axle;
let plane;
let spoke;
let wheelAmount = 1;
let numberOfSpokes = 1;
let outerRadiusRim = 10;
let innerRadiusRim = 9;
let xPosition = 0;
let yPosition = 0; 
let zPosition = 0;

//rotation angle
let wheelAngle = 0;
let spokeAngle = 0;
let sceneAngle = 0;
let casketAngle = 0;

let distanceBetweenWheels = 10;

//define javascript functions

//init
function init() {

    //create the scene
    scene = new THREE.Scene();
    //create the renderer
    renderer = new THREE.WebGLRenderer();
    //set its size
    renderer.setSize(window.innerWidth, window.innerHeight);
    //set the color
    renderer.setClearColor(0x00ff00);

    renderer.shadowMap.enabled = true;
    //add it to the DOM
    document.body.appendChild(renderer.domElement);
    //create axes
    //axesHelper = new THREE.AxesHelper(20);
    //scene.add(axesHelper);


    //create stats
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

//createCameraAndLights
function createCameraAndLights() {
    //create the camera
    camera = new THREE.PerspectiveCamera(
        60,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        10000                                         //far point
    );
    //set its position
    camera.position.set(0, 30, 50);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    //lights

    //Directional light
    directionalLight = new THREE.DirectionalLight(directionalLightColor, 3.0);
    directionalLight.position.set(20, 30, 10);
    directionalLight.receiveShadow = true;
    directionalLight.castShadow = true
    directionalLight.shadow.camera.top = -30
    directionalLight.shadow.camera.right = 30
    directionalLight.shadow.camera.left = -30
    directionalLight.shadow.camera.bottom = 30
    let directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    directionalLight.add(directionalLightHelper)
    directionalLight.visible = true;
    scene.add(directionalLight);
}

//createGeometry
function createGeometry() {
    //plane
    let mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    let geo = new THREE.PlaneGeometry(100, 100);
    plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);
    //plane.add(hemiSphereLight);
    //create containers
    createContainers();
    //creates wheels and attaches them to variable after created
    createWheel(wheelAmount,numberOfSpokes,10,9,0,0,2);
   
}

function createContainers(){
    //Create the base container to hold the objects
    baseContainer = new THREE.Object3D();
    baseContainer.position.set(0, 15, 0);
    scene.add(baseContainer);

    //create the wheelContainer to hold wheels' child containers
    wheelContainer = new THREE.Object3D();
    wheelContainer.position.set(0, 0, 0);
    baseContainer.add(wheelContainer);

    //create the wheelContainerChild to hold wheels
    wheelContainerChild = new THREE.Object3D();
    wheelContainerChild.position.set(0, 0, 0);
    wheelContainer.add(wheelContainerChild);

    //create the spokeContainer to hold spokes's child containers
    spokeContainer = new THREE.Object3D();
    spokeContainer.position.set(0, 0, 0);
    wheelContainerChild.add(spokeContainer);

    //create the wheelContainer to hold casket's child containers
    spokeContainerChild = new THREE.Object3D();
    spokeContainerChild.position.set(0,0,0);
    spokeContainer.add(spokeContainerChild);
}

function createWheel(numberOfFerrisWheels,numberOfSpokes,outerRadiusRim,innerRadiusRim,xPositionRim,yPositionRim,zPositionRim){
    //check if wheelcontainer doesn't have child
   if(wheelContainer.wheelContainerChild == undefined){
    //add the wheelContainerChild to hold wheels
    wheelContainerChild = new THREE.Object3D();
    wheelContainerChild.position.set(0, 0, 0);
    wheelContainer.add(wheelContainerChild);

   }

    for(let w = 0; w<numberOfFerrisWheels*distanceBetweenWheels; w+=distanceBetweenWheels){

        //create the cylinder for the wheel
        let geo = new THREE.CylinderGeometry( 2, 2, 8, 32 );
        let mat = new THREE.MeshLambertMaterial({ color: 0xbb0000 });
        axle = new THREE.Mesh(geo, mat);
        axle.position.set(0,0,w);
        axle.rotation.x=Math.PI/2;
        axle.castShadow = true;
        axle.receiveShadow = true;
        wheelContainerChild.add(axle);

        
        //create absellipse
        let absellipse = new THREE.Shape();
        absellipse.absellipse(0, 0, outerRadiusRim, outerRadiusRim);
        //create hole on the absellipse
        let absellipseHole = new THREE.Shape();
        absellipseHole.absellipse(0, 0, innerRadiusRim, innerRadiusRim)
        absellipse.holes.push(absellipseHole);


        //define settings for extrudegeometry
        let extrudeSettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };
        //create the ExtrudeGeometry
        geo = new THREE.ExtrudeGeometry(absellipse, extrudeSettings);
        mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        let rimMesh = new THREE.Mesh(geo, mat);
        rimMesh.castShadow = true;
        rimMesh.receiveShadow = true;
        wheelContainerChild.add(rimMesh);
        rimMesh.position.set(xPositionRim,yPositionRim,zPositionRim+w);

        //Create and rotate the spokes
        let rotationMultiplier = 1;
        for(let y = 0; y<numberOfSpokes; y++){
            createSpokesAndCaskets(Math.PI*rotationMultiplier,xPositionRim,yPositionRim,zPositionRim+w);
            rotationMultiplier -= 2/numberOfSpokes;
            
        }
    }

}
  
//function that creates Spokes
function createSpokesAndCaskets(rotationAngle,xPositionSpoke,yPositionSpoke,zPositionSpoke){
    
  //create the spokeContainer to hold spokes's child containers
  spokeContainer = new THREE.Object3D();
  spokeContainer.position.set(0, 0, 0);
  wheelContainerChild.add(spokeContainer);

  //create the wheelContainer to hold casket's child containers
  spokeContainerChild = new THREE.Object3D();
  spokeContainerChild.position.set(0,0,0);
  spokeContainer.add(spokeContainerChild);

    

    let geometry = new THREE.BoxGeometry( 1, 13.5, 0.5, 32,32,32 );
    geometry.translate(0.5,5,0);
    let material = new THREE.MeshNormalMaterial();
    spoke = new THREE.Mesh( geometry, material );
    spoke.position.set(xPositionSpoke,yPositionSpoke,zPositionSpoke+0.5)
    spoke.rotation.z = rotationAngle;
    spoke.castShadow = true;
    spoke.receiveShadow = true;
    //spoke.add(casketContainer);
    spokeContainerChild.add(spoke);
    

    geometry = new THREE.BoxGeometry( 0.5, 5, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    casketSpoke = new THREE.Mesh( geometry, material );
    casketSpoke.position.set(xPositionSpoke, yPositionSpoke+11.5,2.5)
    casketSpoke.rotation.x = Math.PI*0.5;
    casketSpoke.castShadow = true;
    casketSpoke.receiveShadow = true;
    //casketContainerChild.add(casketSpoke);


    geometry = new THREE.BoxGeometry( 0.5, 5, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    let casketHolder = new THREE.Mesh( geometry, material );
    casketHolder.position.set(0, 0,2.5)
    casketHolder.rotation.x = Math.PI*0.5;

    // casketSpoke.add(casketHolder);
    // casketContainer.add(casketSpoke);
    // spoke.add(casketContainer);
    // spokeContainer.add(spoke);
    // wheelContainerChild.add( spokeContainer );
    // wheelcontainer.add(wheelContainerChild);
}




function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.OuterRadiusRim = 1;
        this.InnerRadiusRim = 1;
        this.RimWidth = 1;
        this.AxleRadius = 1;
        this.SpokeLength = 1;
        this.NumberOfSpokes = numberOfSpokes;
        this.ToggleSceneRotation = false;
        this.ToggleWheelRotation = true;


    }
    let gui = new dat.GUI();

    gui.add(control, "OuterRadiusRim");
    gui.add(control, "InnerRadiusRim");
    gui.add(control, "RimWidth");
    gui.add(control, "AxleRadius");
    gui.add(control, "SpokeLength");
    gui.add(control, "NumberOfSpokes",1,20,1)
            .onChange(() => {
                wheelContainer.remove(wheelContainerChild);

                createWheel(wheelAmount,control.NumberOfSpokes,10,9,0,0,2);
            });
    gui.add(control, "ToggleSceneRotation");
    gui.add(control, "ToggleWheelRotation");
}

//render
function render() {
    stats.begin();
    stats.end();
   
   //Rotation of the scene//
    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
    }
     //Rotation of the wheels//
    if (control.ToggleWheelRotation) {
        wheelContainer.rotation.z = wheelAngle += 0.02;
        //spokeContainer.rotation.z = spokeAngle += 0.02;
        //casketSpoke.rotation.y = casketAngle -=0.02;
    }
    // render using requestAnimationFrame
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}
