///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: April 02 2020
//Filename: Samuli5.js

//declare variables
let scene, renderer, camera, controls, axesHelper;
//lights
let spotLight, ambientLight;
//lights' colors
let spotLightColor = 0x404040, ambientLightColor = 0x404040;
//datGui
let control;
//Scene rotation angle
let sceneAngle = 0;
//Shader variables
const clock = new THREE.Clock();
const __shaderA = Shaders.ShaderA;
const __shaderB = Shaders.ShaderB;
const __shaderC = Shaders.ShaderC;

//materials
let planeMat, knotMat, sphereMat
//geometries
let planeGeo, knotGeo1, sphereGeo;
//meshes
let plane, knot, sphere;
//javascript function to drive your scene
window.onload = function () {
    this.init();
    this.createCameraAndLights();
    this.createGeometry();
    this.setupDatgui();
    this.render();
}

function init(){
    //create the scene
    scene = new THREE.Scene();

    //create the renderer
    renderer = new THREE.WebGLRenderer();
    //set its size
    renderer.setSize(window.innerWidth, window.innerHeight);
    //set the color
    renderer.setClearColor(0x008800);
    renderer.shadowMap.enabled = true;
    //add it to the DOM
    document.body.appendChild(renderer.domElement);
};
function createCameraAndLights(){
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
    spotLight = new THREE.SpotLight(spotLightColor, 1.0);
    spotLight.position.set(0, 45, 0);
    spotLight.receiveShadow = true;
    spotLight.castShadow = true;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(ambientLightColor, 1.0);
    ambientLight.position.set(0, 45, 0);
    ambientLight.receiveShadow = true;
    ambientLight.castShadow = true;
    scene.add(ambientLight);
};
function createGeometry(){
      //Sphere
      sphereMat = new THREE.ShaderMaterial(
        {
            uniforms: __shaderA.uniforms,
            vertexShader: __shaderA.vertexShader,
            fragmentShader: __shaderA.fragmentShader,
            transparent: true
        });
        sphereGeo = new THREE.SphereBufferGeometry(10,32,32);
        sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(-20,20,20);
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        scene.add(sphere);
    //plane
    planeMat = new THREE.ShaderMaterial(
        {
            uniforms: __shaderB.uniforms,
            vertexShader: __shaderB.vertexShader,
            fragmentShader: __shaderB.fragmentShader,
            transparent: true
        });
    planeGeo = new THREE.PlaneBufferGeometry(100, 100, 256,256);
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);


    //knot
    knotMat = new THREE.ShaderMaterial(
    {
        uniforms: __shaderC.uniforms,
        vertexShader: __shaderC.vertexShader,
        fragmentShader: __shaderC.fragmentShader,
        transparent: true
    });
    knotGeo1 = new THREE.TorusKnotGeometry(8, 3, 100, 16)
    knot = new THREE.Mesh(knotGeo1, knotMat);
    knot.position.set(20,20,20);
    knot.receiveShadow = true;
    knot.castShadow = true;
    scene.add(knot);

  
    //loading textures
    __shaderA.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/noise-perlin.jpg');
    __shaderB.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/noise-perlin.jpg');
    __shaderC.uniforms.textureA.value = new THREE.TextureLoader().load('../assets/textures/noise-perlin.jpg');
};
function setupDatgui(){
 //the object that is used by dat.GUI
 control = new function () {
    this.ToggleSceneRotation = false;
    this.SpotLight = true;
    this.AmbientLight = true;

}
let gui = new dat.GUI();
gui.add(control, "ToggleSceneRotation");
gui.add(control, "SpotLight").onChange((e) => {
    spotLight.visible = e;
})
gui.add(control, "AmbientLight").onChange((e) => {
    ambientLight.visible = e;
})
};
function render(){
    controls.update();
    //Rotation of the scene//
     if (control.ToggleSceneRotation) {
         scene.rotation.y = sceneAngle += 0.02;
     }
     //Pass the clock's time to shader uniform
     __shaderA.uniforms.time.value = clock.getElapsedTime();
     __shaderB.uniforms.time.value = clock.getElapsedTime();
    __shaderC.uniforms.time.value = clock.getElapsedTime();
     // render using requestAnimationFrame
     requestAnimationFrame(render);
     renderer.render(scene, camera);
};
