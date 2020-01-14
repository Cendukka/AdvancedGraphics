///<reference path="libs/three.js"/>
//Author: Samuli Lehtonen
//Date: January 10, 2020
//Filename: 01-basic-scene.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let directionalLight;
let axesHelper;
let control;
//Geometry
let sphere

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
        100                                         //far point
    );
    //set its position
    camera.position.set(-30, 40, 30);
    //point the camera
    camera.lookAt(scene.position);
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
    mat = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: true });
    geo = new THREE.SphereGeometry(7, 17, 17);
    sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(10, 5, 0);
    scene.add(sphere);
}

function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.sphereHeight = 0;
        this.sphereSize = 5;
    }
    let gui = new dat.GUI();
    gui.add(control, 'sphereHeight', -5, 15);
    gui.add(control, 'sphereSize', 1, 20);
}

//render
function render() {
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    sphere.position.y = control.sphereHeight;
    sphere.scale = control.sphereSize;
    renderer.render(scene, camera);

}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    setupDatgui();
    this.render();
}

