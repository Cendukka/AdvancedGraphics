///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: March 06 2020
//Filename: Samuli3.js

//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let axesHelper;
//lights
let spotLight, hemisphereLight, directionalLight;
//lights' colors
let directionalLightColor = 0x404040;
let spotLightColor = 0x404040;
let hemisphereLightSkyColor = 0x0000ff;
let hemisphereLightGroundColor = 0x00ff00;

let control;
//textures
let cubeTexture,alpha, normal, shiny;
//Skybox
let skyboxLoader;

//Materials
let planeMat, mat_transparent, mat_textured, mat_reflective;
//Geometry
let planeGeo, transparentSphereGeo, shinySphereGeo,reflectiveCubeGeo,glassCubeGeo;
//Meshes
let plane,transparentSphere,shinySphere,reflectiveCube,glassCube;

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
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    //lights

    //Directional light
    spotLight = new THREE.SpotLight(spotLightColor, 4.0);
    spotLight.position.set(0, 45, 0);
    spotLight.receiveShadow = true;
    spotLight.castShadow = true;
    spotLight.visible = false;
    scene.add(spotLight);

    //Directional light
    directionalLight = new THREE.DirectionalLight(directionalLightColor, 1.0);
    directionalLight.position.set(0, 45, 0);
    directionalLight.receiveShadow = true;
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    //Hemissphere light
    hemisphereLight = new THREE.HemisphereLight(hemisphereLightSkyColor, hemisphereLightGroundColor, 1);
    hemisphereLight.position.set(0,100,0);
    scene.add(hemisphereLight);
}

function loadTextures(){
    alpha = new THREE.TextureLoader().load( '../assets/textures/alpha/transparency.png' );
    normal = new THREE.TextureLoader().load( '../assets/textures/Engraved_Metal_003_NORM.jpg' );
    shiny = new THREE.TextureLoader().load( '../assets/textures/Engraved_Metal_003_ROUGH.jpg' );
}

function createSkybox(){
    skyboxLoader = new THREE.CubeTextureLoader().setPath( '../assets/textures/cubemap/park2/' );
    //Skybox's images
    let urls = [
        'posx.jpg', //left
        'negx.jpg', //right
        'posy.jpg', //top
        'negy.jpg', //bottom
        'posz.jpg', //back
        'negz.jpg' //front
    ];
    //Glass cube's images
    let urls2= [
        'negx.jpg',
        'posx.jpg',
        'negy.jpg',
        'posy.jpg',
        'negz.jpg',
        'posz.jpg'
    ];
    cubeTexture = skyboxLoader.load(urls);
    cubeTexture2 = skyboxLoader.load(urls2);

    scene.background = cubeTexture;
}

//createGeometry
function createGeometry() {
    //plane
    planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    planeGeo = new THREE.PlaneGeometry(100, 100);
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);
    //Transparent sphere
    mat_transparent = new THREE.MeshStandardMaterial({ alphaMap: alpha, alphaTest: 0.5});
    transparentSphereGeo = new THREE.SphereGeometry(10,32,32);
    transparentSphere = new THREE.Mesh(transparentSphereGeo, mat_transparent);
    transparentSphere.position.set(25,15,-20);
    transparentSphere.castShadow = true;
    scene.add(transparentSphere);
    //Shiny sphere
    mat_textured = new THREE.MeshPhongMaterial({ envMap: cubeTexture, normalMap: normal});
    mat_textured.shininessMap = shiny;
    shinySphereGeo = new THREE.SphereBufferGeometry(10,32,32);
    shinySphere = new THREE.Mesh(shinySphereGeo, mat_textured);
    shinySphere.position.set(0,15,-20);
    shinySphere.castShadow = true;
    scene.add(shinySphere);
    //reflective cube
    mat_reflective = new THREE.MeshStandardMaterial({ envMap: cubeTexture, metalness: 1, roughness: 0});
    reflectiveCubeGeo = new THREE.CubeGeometry(10,10,10);
    reflectiveCube = new THREE.Mesh(reflectiveCubeGeo, mat_reflective);
    reflectiveCube.position.set(-25,15,-20);
    reflectiveCube.castShadow = true;
    scene.add(reflectiveCube);

    //glassCube
    mat_reflective = new THREE.MeshPhongMaterial({ envMap: cubeTexture2, refractionRatio: 0.95, reflectivity: 0.8 });
    mat_reflective.mapping = THREE.CubeRefractionMapping;
    glassCubeGeo = new THREE.BoxBufferGeometry(10,10,10);
    glassCube = new THREE.Mesh(glassCubeGeo, mat_reflective);
    glassCube.position.set(0,15,20);
    glassCube.castShadow = true;
    scene.add(glassCube);
}


function setupDatgui() {
    //the object that is used by dat.GUI
    control = new function () {
        this.ToggleSceneRotation = false;
        this.SpotLight = false;
        this.DirectionalLight = true;
        this.HemisphereLight = true;

    }
    let gui = new dat.GUI();
    gui.add(control, "ToggleSceneRotation");
    gui.add(control, "SpotLight").onChange((e) => {
        spotLight.visible = e;
    })
    gui.add(control, "DirectionalLight").onChange((e) => {
        directionalLight.visible = e;
    })
}

//render
function render() {
    controls.update();
   //Rotation of the scene//
    if (control.ToggleSceneRotation) {
        scene.rotation.y = sceneAngle += 0.02;
    }
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.loadTextures();
    this.createSkybox();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}
