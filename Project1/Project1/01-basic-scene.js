///<reference path="libs/three.js"/>
//Author: Samuli Lehtonen
//Date: January 10, 2020
//Filename: 01-basic-scene.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let axesHelper;
//geometry variables
let sphereGeometry;
let sphereMaterial;
let sphere;
let squareGeometry;
let squareMaterial;
let square;
let ringGeometry;
let ringMaterial;
let ring;

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
    renderer.setClearColor(0x00FF00);
    //add it to the DOM
    document.body.appendChild(renderer.domElement);
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
}

//createGeometry
function createGeometry() {
    //create axes
    axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    //create sphere
    sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
    sphereMaterial = new THREE.MeshBasicMaterial ({ color: 0xff00ff });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(10, 10, 10);
    scene.add(sphere);
    //create square
    squareGeometry = new THREE.BoxGeometry(7, 7, 7);
    squareMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    square = new THREE.Mesh(squareGeometry, squareMaterial);
    square.position.set(-10, -10, -10);
    scene.add(square);
    //create ring
    ringGeometry = new THREE.RingGeometry(4, 5, 32);
    ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide });
    ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(-10, 10, -10);
    scene.add(ring);
}


//render
function render() {
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);

}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.render();
}

