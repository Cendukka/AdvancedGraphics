///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: February 21, 2020
//Filename: Samuli.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let stats;
//lights
let ambientLight;
//lights' colors
let ambientLightColor = 0x404040;
//visual helpers
let control;
let axesHelper;
let gridHelper;

//Geometry and variable values
let plane;
let gridSize = 10;
let gridDimension = 10;
let gridStartLocationX = gridDimension/2-0.5;
let gridStartLocationZ = gridDimension/2-0.5;
let cubeTexture = new THREE.TextureLoader().load( "../assets/textures/square.png" );
//arrays for planes
let planeArr = [];



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
    renderer.setClearColor(0x808080);

    renderer.shadowMap.enabled = true;
    //add it to the DOM
    document.body.appendChild(renderer.domElement);

    //create stats
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

//createCameraAndLightsa
function createCameraAndLights() {
    //create the camera
    camera = new THREE.PerspectiveCamera(
        20,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        100                                         //far point
    );
    //set its position
    camera.position.set(15, 40, 50);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    //Axis helper
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    //lights

    //Directional light
    ambientLight = new THREE.AmbientLight(ambientLightColor, 3.0);
    ambientLight.position.set(0, 50, 0);
    ambientLight.visible = true;
    
    scene.add(ambientLight);
    
}

//createGeometry
function createGeometry() {
    //create gridhelper and add it in the scene
    gridHelper = new THREE.GridHelper(10,10, 0xff0000,0x0000ff);
    scene.add(gridHelper);

    /**
     * Create invisible planes in the area of the grid helper
     * First For-loop: loops the amount of the grid dimension and 
     **    points to the x position of grid
     * Second For-loop: loops the amount of the grid dimension and 
     **     points to the z position of grid
     **
     */
    for(let a = 0; a<gridDimension; a++){
        for(let b = 0; b<gridDimension; b++){
            //invisible planes
            let mat = new THREE.MeshLambertMaterial({ color: 0xffffff, visible: false });
            let geo = new THREE.PlaneGeometry(1, 1);
            plane = new THREE.Mesh(geo, mat);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = gridStartLocationX-a;
            plane.position.z = gridStartLocationZ-b;
            scene.add(plane);
            //push the planes in the array for future handling
            planeArr.push(plane);
        }
    }  
}
//function to handle mouse click
function mouseDownHandler(event){
    //setup raycast and mouse position
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth)*2-1;
    mouse.y = -(event.clientY / window.innerHeight)*2+1;
    mouse.z = 0;
    raycaster.setFromCamera(mouse, camera);
// get intersections and loop through them
    let intersections = raycaster.intersectObjects(planeArr);
    intersections.some(element => {
        //create the cube
        createTheCube(element);
    
    });
}

function createTheCube(clickedElement){
    //Get the position of the clicked element's object (plane)
    let elementX = clickedElement.object.position.x;
    let elementZ = clickedElement.object.position.z;
    let elementY = clickedElement.object.position.y+0.5;
    //create and box and add it in the scene on the location of the clicked object(plane)
    let geo = new THREE.BoxGeometry(1,1,1);
    let mat = new THREE.MeshLambertMaterial({map: cubeTexture});
    let boxMesh = new THREE.Mesh(geo,mat);
    boxMesh.position.x = elementX;
    boxMesh.position.y = elementY;
    boxMesh.position.z = elementZ;
    scene.add(boxMesh);

    //relocate the object clicked(plane)
    clickedElement.object.position.y += 1;
}

//render
function render() {
    stats.begin();
    stats.end();
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    window.addEventListener('click', this.mouseDownHandler,false);
    this.render();
}
