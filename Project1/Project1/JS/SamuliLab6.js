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
let spotLight;
//lights' colors
let spotLightColor = 0x404040;

let control;

//Geometry
let baseContainer, wheelContainer, wheelContainerPlaceholder,ferrisWheelContainer, spokeContainer,spokeContainerChild,
    casketContainer,casketContainerChild;
    //objects
let axle,plane,spoke,rimMesh,casketHolderSpoke, casket;
//arrays for objects
let spokeArr = [];
let casketArr = [];
let rimMeshArr = [];
let ferrishWheelArr = [];
let axleArray = [];
//initial parameters for the ferris wheel
let wheelAmount = 3;
let numberOfSpokes = 14;
let outerRadiusRim = 10;
let innerRadiusRim = 9;
let xPosition = 0;
let yPosition = 0; 
let zPosition = 0;
let axleRadius = 2;
let spokeLength = 13.5;
let wheelRadius = 20;

//Scene rotation angle
let sceneAngle = 0;


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
        1000                                         //far point
    );
    //set its position
    camera.position.set(0, 40, 80);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    //lights

    //Directional light
    spotLight = new THREE.SpotLight(spotLightColor, 3.0);
    spotLight.position.set(0, 50, 0);
    spotLight.receiveShadow = true;
    spotLight.castShadow = true
    spotLight.visible = true;
    
    scene.add(spotLight);
    
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
    //create containers
    createContainers();
    //creates wheels and attaches them to variable after created
    createWheel(wheelAmount,numberOfSpokes,outerRadiusRim,innerRadiusRim,xPosition,yPosition,zPosition);
    
   
}

function createContainers(){
    //Create the base container to hold the objects
    baseContainer = new THREE.Object3D();
    baseContainer.position.set(0, 25, 0);
    baseContainer.rotation.x = Math.PI;
    baseContainer.rotation.y =Math.PI;
    scene.add(baseContainer);

    //create the wheelContainer to hold wheels' child containers
    wheelContainer = new THREE.Object3D();
    wheelContainer.position.set(0, 0, 0);
    baseContainer.add(wheelContainer);

    

}

function createWheel(numberOfFerrisWheels,numberOfSpokes,outerRadiusRim,innerRadiusRim,xPositionRim,yPositionRim,zPositionRim){
   
  
    //create the wheelContainerPlaceholder to hold ferris wheel containers
    wheelContainerPlaceholder = new THREE.Object3D();
    wheelContainerPlaceholder.position.set(0, 0, 0);
    wheelContainer.add(wheelContainerPlaceholder);

   

    for(let w = 1; w<=numberOfFerrisWheels; w++){

    //create the ferris wheel container to hold wheels
        ferrisWheelContainer = new THREE.Object3D();
        ferrisWheelContainer.position.set(randomInt(-35,35), 0, randomInt(-35,35));
        wheelContainerPlaceholder.add(ferrisWheelContainer);
        ferrishWheelArr.push(ferrisWheelContainer);

        //create the cylinder for the wheel
        let geo = new THREE.CylinderGeometry( axleRadius, axleRadius, 8, 32 );
        let mat = new THREE.MeshLambertMaterial({ color: 0xbb0000 });
        axle = new THREE.Mesh(geo, mat);
        axle.position.set(0,0,4.5);
        axle.rotation.x=Math.PI*0.5;
        axle.castShadow = true;
        axle.receiveShadow = true;
        ferrisWheelContainer.add(axle);
        axleArray.push(axle);

        
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
        rimMesh = new THREE.Mesh(geo, mat);
        rimMesh.castShadow = true;
        rimMesh.receiveShadow = true;
        ferrisWheelContainer.add(rimMesh);
        rimMesh.position.set(xPositionRim,yPositionRim,zPositionRim+1);
        rimMeshArr.push(rimMesh);

        //Create and rotate the spokes
        let rotationMultiplier = 1;
        for(let y = 0; y<numberOfSpokes; y++){
            createSpokesAndCaskets(Math.PI*rotationMultiplier,xPositionRim,yPositionRim,zPositionRim+1);
            rotationMultiplier -= 2/numberOfSpokes;
            
        }
    }
    
}
  
//function that creates Spokes
function createSpokesAndCaskets(rotationAngle,xPositionSpoke,yPositionSpoke,zPositionSpoke){
    
  //create the spokeContainer to hold spokes's child containers
  spokeContainer = new THREE.Object3D();
  spokeContainer.position.set(0, 0, 0);
  ferrisWheelContainer.add(spokeContainer);

  //create the spokecontainerchild to hold caskets
  spokeContainerChild = new THREE.Object3D();
  spokeContainerChild.position.set(0,0,0);
  
  spokeContainer.add(spokeContainerChild);

    
    //Create spoke
    let geometry = new THREE.BoxGeometry( 1, spokeLength, 0.5, 32,32,32 );
    geometry.translate(0.5,5,0);
    let material = new THREE.MeshNormalMaterial();
    spoke = new THREE.Mesh( geometry, material );
    spoke.position.set(xPositionSpoke,yPositionSpoke,zPositionSpoke+0.5)
    spoke.rotation.z = rotationAngle;
    spoke.castShadow = true;
    spoke.receiveShadow = true;
    spokeContainerChild.add(spoke);
    spokeArr.push(spoke);
    
    //Create the spoke for the casket holder, the casketholder and the casket
    geometry = new THREE.BoxGeometry( 0.5, 5, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    casketSpoke = new THREE.Mesh( geometry, material );
    casketSpoke.position.set(0.5, yPositionSpoke+11.5,2.5)
    casketSpoke.rotation.x = Math.PI*0.5;
    casketSpoke.rotation.y = -rotationAngle;
    casketSpoke.castShadow = true;
    casketSpoke.receiveShadow = true;
    spoke.add(casketSpoke);
    
    geometry = new THREE.BoxGeometry( 0.5, 3, 0.5, 32,32,32 );
    material = new THREE.MeshNormalMaterial();
    casketHolderSpoke = new THREE.Mesh( geometry, material );
    casketHolderSpoke.position.set(0, 0,-1.5)
    casketHolderSpoke.rotation.x = Math.PI*0.5;
    casketHolderSpoke.castShadow = true;
    casketHolderSpoke.receiveShadow = true;
    casketSpoke.add(casketHolderSpoke);

    geometry = new THREE.SphereGeometry(1,32,32,0,Math.PI*2,0,2)
    material = new THREE.MeshLambertMaterial({color: 0xff0000});
    casket = new THREE.Mesh(geometry, material);
    casket.position.set(0,-1,0);
    casket.rotation.x = Math.PI;
    casket.castShadow = true;
    casket.receiveShadow = true;
    casketHolderSpoke.add(casket);

    casketArr.push(casketSpoke);
   
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max-min+1))+min;
}


function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.OuterRadiusRim = outerRadiusRim;
        this.InnerRadiusRim = innerRadiusRim;
        this.RimWidth = 1;
        this.AxleRadius = 1;
        this.SpokeLength = 1;
        this.NumberOfSpokes = numberOfSpokes;
        this.ToggleSceneRotation = false;
        this.ToggleWheelRotation = false;


    }
    let gui = new dat.GUI();

    gui.add(control, "OuterRadiusRim",5,15,1)
            .onChange((e) => {
                outerRadiusRim = e;
            });
    gui.add(control, "InnerRadiusRim", 1,15,1)
            .onChange((e) => {
                innerRadiusRim = e;
            });
    gui.add(control, "RimWidth",0.1,2,0.1)
            .onChange((e) => {
                wheelContainer.scale.x = e;
                wheelContainer.scale.y = e;
                wheelContainer.scale.z = e;
            });;
    gui.add(control, "AxleRadius",0.1,2,0.1)
            .onChange((e) => {
                axleArray.forEach(element => {
                    element.scale.x = e;
                    element.scale.y = e;
                    element.scale.z = e;
                });
               
            });
    gui.add(control, "SpokeLength",0.5,2,0.1)
            .onChange((e) => {
                spokeArr.forEach(element => {
                    element.scale.y = e;
                });;
            });
    gui.add(control, "NumberOfSpokes",1,20,1)
            .onChange((e) => {
                numberOfSpokes = e;
                //clean the arrays and remove the container to make new
                wheelContainer.remove(wheelContainerPlaceholder);
                casketArr = [];
                spokeArr = [];
                rimMeshArr = [];
                wheelAngle = 0;
                createWheel(wheelAmount,numberOfSpokes,outerRadiusRim,innerRadiusRim,xPosition,yPosition,zPosition);
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
     //Rotation of the wheel and caskets//
    if (control.ToggleWheelRotation) {
        ferrishWheelArr.forEach(element => {
            element.rotation.z += 0.02;  
        });
        
        casketArr.forEach(element => {
            element.rotation.y -=0.02;
        });
        
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
