///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: March 27 2020
//Filename: Samuli.js

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
const __shaderD = Shaders.ShaderD;

//materials
let planeMat, knotMat1,knotMat2, boxMat1, boxMat2
//geometries
let planeGeo, knotGeo1,knotGeo2, boxGeo1, boxGeo2;
//meshes
let plane, knot1, knot2, box1, box2;
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
    renderer.setClearColor(0x00ff00);
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
    spotLight.visible = true;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(ambientLightColor, 1.0);
    ambientLight.position.set(0, 45, 0);
    ambientLight.receiveShadow = true;
    ambientLight.castShadow = true;
    ambientLight.visible = true;
    scene.add(ambientLight);
};
function createGeometry(){
    //plane
    planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    planeGeo = new THREE.PlaneBufferGeometry(100, 100);
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    scene.add(plane);

    //box1
    boxMat1 = new THREE.ShaderMaterial(
        {
            
            vertexShader: __shaderA.vertexShader,
            fragmentShader: __shaderA.fragmentShader,
            transparent: true
        });
    boxGeo1 = new THREE.BoxBufferGeometry(10,10,10);
    box1 = new THREE.Mesh(boxGeo1, boxMat1);
    box1.position.set(20,20,-20);
    box1.receiveShadow = true;
    box1.castShadow = true;
    scene.add(box1);  

    //box2
    boxMat2 = new THREE.ShaderMaterial(
        {
            uniforms: __shaderD.uniforms,
            vertexShader: __shaderD.vertexShader,
            fragmentShader: __shaderD.fragmentShader,
            transparent: true
        });
    boxGeo2 = new THREE.BoxBufferGeometry(10,10,10);
    box2 = new THREE.Mesh(boxGeo2, boxMat2);
    box2.position.set(-20,20,20);
    box2.receiveShadow = true;
    box2.castShadow = true;
    scene.add(box2);

    //knot1
    knotMat1 = new THREE.ShaderMaterial(
        {
            vertexShader: __shaderB.vertexShader,
            fragmentShader: __shaderB.fragmentShader,
            transparent: true
        });
    knotGeo1 = new THREE.TorusKnotGeometry(8, 3, 100, 16)
    knot1 = new THREE.Mesh(knotGeo1, knotMat1);
    knot1.position.set(20,20,20);
    knot1.receiveShadow = true;
    knot1.castShadow = true;
    scene.add(knot1);

    //knot2
    knotMat2 = new THREE.ShaderMaterial(
        {
            uniforms: __shaderC.uniforms,
            vertexShader: __shaderC.vertexShader,
            fragmentShader: __shaderC.fragmentShader,
            transparent: true
        });
    knotGeo2 = new THREE.TorusKnotGeometry(8, 3, 100, 16);
    knot2 = new THREE.Mesh(knotGeo2, knotMat2);
    knot2.position.set(-20,20,-20);
    knot2.castShadow = true;
    scene.add(knot2);
};
function setupDatgui(){
 //the object that is used by dat.GUI
 control = new function () {
    this.ToggleSceneRotation = false;
    this.SpotLight = false;
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
    
    __shaderC.uniforms.time.value = clock.getElapsedTime();
    
    __shaderD.uniforms.time.value = clock.getElapsedTime();
     // render using requestAnimationFrame
     requestAnimationFrame(render);
     renderer.render(scene, camera);
};
