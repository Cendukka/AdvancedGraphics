///<reference path="libs/three.js"/>
//Author: Samuli Lehtonen
//Date: January 17, 2020
//Filename: 02-experiment-with-dat-gui.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let directionalLight;
let axesHelper;
let control;
//Geometry
let sphere;


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
    //add it to the DOM
    document.body.appendChild(renderer.domElement);
    //create axes
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

}

//createCameraAndLights
function createCameraAndLights() {
    //create the camera
    camera = new THREE.PerspectiveCamera(
        45,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        10000                                         //far point
    );
    //set its position
    camera.position.set(-30, 40, 30);
    //point the camera
    camera.lookAt(scene.position);
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();
    //light
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    scene.add(directionalLight);
}

//createGeometry
function createGeometry() {

    //plane
    let mat = new THREE.MeshBasicMaterial({ color: 0x089000 });
    let geo = new THREE.PlaneGeometry(69, 20);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -0.5*Math.PI;
    scene.add(mesh);
    //sphere
    mat = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });
    geo = new THREE.SphereGeometry(3, 17, 17);
    sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(10, 5, 0);
    scene.add(sphere);
}
function createObject(shape){
    
    mat = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });
    geo = new THREE.{shape}Geometry(3, 17, 17);
    let newShape = new THREE.Mesh(geo, mat);
    sphere.position.set(10, 5, 0);
    scene.add(sphere);
}

function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.sphereHeight = 10;
        this.shapes = [];
        this.size = 1;
        this.color = '#000000';
        this.createObject = function(){createObject(control.shapes)};
        this.showVariables = function(){};
        //scaling
        /*this.sphereSizeX = 1;
        this.sphereSizeY = 1;
        this.sphereSizeZ = 1;*/
        
    }
    let gui = new dat.GUI();
    gui.add(control, 'sphereHeight', -5, 15);
    let shapeProperties = gui.addFolder('Shape Properties');
    shapeProperties.add(control, 'shapes', ['Cube', 'Sphere']);
    shapeProperties.add(control, 'size', -50.0, 50.0 );
    shapeProperties.addColor(control, 'color');
    gui.add(control, 'createObject');
    gui.add(control, 'showVariables');


    //scaling
    /*gui.add(control, 'sphereSizeX', 1, 20);
    gui.add(control, 'sphereSizeY', 1, 20);
    gui.add(control, 'sphereSizeZ', 1, 20);*/
}

function confSize(value){
    //console.log("yay");

    sphere.scale.x = value;
    sphere.scale.y = value;
    sphere.scale.z = value;


}

//render
function render() {
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    sphere.position.y = control.sphereHeight;
    confSize(control.size);
    sphere.color = control.color;
    //sphere.scale.x.y.z = confSize();
    //Scale
    /*sphere.scale.x = control.sphereSizeX;
    sphere.scale.y = control.sphereSizeY;
    sphere.scale.z = control.sphereSizeZ;*/
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

