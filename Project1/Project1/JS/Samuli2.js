///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: March 02, 2020
//Filename: Samuli.js


//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
//lights
let directionalLight;
let ambientLight;
let pointLight;
let spotLight;
let hemiSphereLight;
//lights' colors
let directionalLightColor = 0x404040;
let ambientLightColor = 0x404040;
let spotLightColor = 0x404040;
let hemiSphereSkyLightColor = 0x0000ff;
let hemiSphereGroundLightColor = 0x00ff00;

//datGui
let sceneSpeed = 0.005;
let rotorSpeed = 0.005;
let rotorColor = 0x0060ff;
let bodyColor = 0xff0000;

//axes helper
let axesHelper;
let control;

//Geometry
let planeGeo, hoverBodyGeo, hoverRotorGeo, hoverAxleGeo;

//Material
let planeMat, hoverBodyMat,hoverRotorMat,hoverAxleMat;

//Mesh
let plane, hoverBody, rotorBlade, axle;

//Containers
let hoverContainer, rotorContainer, rotorBladeContainer;

//Rotor array
let rotorArr = [];

//hover variables
let rotorLenghtInt = 20;
let bodyLengthInt = 5;
let numberOfRotorsInt = 6;

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
        80,                                         //camera angle
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

        //lights

        //Directional light
        directionalLight = new THREE.DirectionalLight(directionalLightColor, 3.0);
        directionalLight.position.set(0,20,0);
        directionalLight.castShadow = true
        scene.add(directionalLight);

        //Ambient light
        ambientLight = new THREE.AmbientLight( ambientLightColor, 4.0 );
        //scene.add(ambientLight);

        //SpotLight
        spotLight = new THREE.SpotLight(spotLightColor, 5.0);
        spotLight.position.set( 0,60, 0 );
        spotLight.castShadow = true;
        scene.add(spotLight);

        //hemisshpere light
        hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor,hemiSphereGroundLightColor, 1,4);
        hemiSphereLight.position.set(0,50,0);
        scene.add(hemiSphereLight);
}

//createGeometry
function createGeometry() {

        //plane
        planeMat = new THREE.MeshStandardMaterial({ color: "rgb(200, 200, 200)" });
        planeGeo = new THREE.PlaneGeometry(70, 70);
        plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -0.5*Math.PI;
        plane.castShadow = true;
        plane.receiveShadow = true;
        scene.add(plane);

           //create axes
        axesHelper = new THREE.AxesHelper(20);
        scene.add(axesHelper);
        
}

function createMaterial(){

     //plane
     hoverBodyMat = new THREE.MeshStandardMaterial({ color: bodyColor });
     hoverAxleMat = new THREE.MeshStandardMaterial({ color: "rgb(255, 0, 0)" });
     hoverRotorMat = new THREE.MeshLambertMaterial({ color: "rgb(0, 50, 150)" });

     createHoverCraft(rotorLenghtInt,bodyLengthInt,numberOfRotorsInt,0.25);

}

function createHoverCraft(rotorLenght, bodyLength, numberOfRotors, rotorInclination){
    //Containers
    hoverContainer = new THREE.Object3D();
    hoverContainer.position.set(0,15,0);
    rotorContainer = new THREE.Object3D();
    rotorContainer.position.set(0,21,0);
    hoverContainer.add(rotorContainer);
    //body
    hoverBodyGeo = new THREE.SphereGeometry(5,32,32);
    hoverBody = new THREE.Mesh(hoverBodyGeo, hoverBodyMat);
    hoverBody.scale.z = bodyLength;
    hoverBody.castShadow = true;
    hoverBody.receiveShadow = true;
    hoverContainer.add(hoverBody);

    //axle

    hoverAxleGeo = new THREE.CylinderGeometry( 0.5, 0.5, 3, 32 );
    axle = new THREE.Mesh(hoverAxleGeo, hoverAxleMat);
    rotorContainer.add(axle);

    //rotors
    //Rotate the blades
    let multiplier = 1;
    for(let i = 0; i<numberOfRotors; i++){
        hoverRotorGeo = new THREE.BoxGeometry( 4, 0.2, rotorLenght, 32 );
        hoverRotorGeo.translate(0,5,10);
        rotorBlade = new THREE.Mesh( hoverRotorGeo, hoverRotorMat );
        rotorBlade.position.set(0,-5,0)
        rotorBlade.rotation.y = multiplier*Math.PI;
        rotorBlade.rotation.z = rotorInclination;
        rotorBlade.castShadow = true;
        rotorBlade.receiveShadow = true;
        rotorContainer.add( rotorBlade );

        rotorArr.push(rotorBlade);
        multiplier -= 2/numberOfRotors;
    }

    scene.add(hoverContainer);
    scene.add(rotorContainer);

}


function setupDatgui() {
    //the object that is used by dat.GUI
        control = new function () {
        this.SceneRotationSpeed = sceneSpeed;
        this.RotorRotationSpeed = rotorSpeed;
        this.EnableSpotlight = true;
        this.RotorColor = rotorColor;
        this.RotorVisibility = true;
        this.BodyColor = bodyColor;
        this.BodyVisibility = true;
        this.RotorLenght = rotorLenghtInt;
        this.NumberOfRotors = numberOfRotorsInt;
        this.BodyLength = bodyLengthInt;
        this.CreateObj = function(){
            hoverContainer.remove(hoverBody);
            rotorArr.forEach(element => {
                rotorContainer.remove(element);
            });
            rotorArr = [];
            createHoverCraft(rotorLenghtInt,bodyLengthInt,numberOfRotorsInt,0.25);
        };
        }
        let gui = new dat.GUI();
    
        gui.add(control, "SceneRotationSpeed", 0.0,0.01,0.001)
                        .onChange((e) => {
                            sceneSpeed = e;
                        });
        gui.add(control, "RotorRotationSpeed", 0.0,0.4,0.001)
                        .onChange((e) => {
                            rotorSpeed = e;
                        });
        gui.add(control, "EnableSpotlight")
                        .onChange((e) => {
                            spotLight.visible = e;
                        });

        gui.addColor(control, "RotorColor")
                        .onChange((e) => {
                            rotorColor = e;
                            rotorArr.forEach(element => {
                                element.material.color.set(rotorColor);
                            });
                        });
        gui.add(control, "RotorVisibility")
        .onChange((e) => {
            rotorArr.forEach(element => {
                element.material.visible = e;
            });
        });
        gui.addColor(control, "BodyColor")
                        .onChange((e) => {
                            bodyColor = e;
                            hoverBody.material.color.set(bodyColor);
                        });

        gui.add(control, "BodyVisibility")
        .onChange((e) => {
            hoverBody.material.visible = e;
        });
        //Hovercraft folder
       let hoverCraftFolder = gui.addFolder("Hovercraft");

       hoverCraftFolder.add(control, "RotorLenght", 18,24,1)
                        .onChange((e) => {
                            rotorLenghtInt = e;
                        });
       hoverCraftFolder.add(control, "NumberOfRotors", 4,10,1)
                        .onChange((e) => {
                            numberOfRotorsInt = e;
                        });
       hoverCraftFolder.add(control, "BodyLength", 4,15,2)
                        .onChange((e) => {
                            bodyLengthInt = e;
                        });
       hoverCraftFolder.add(control, "CreateObj");

}

//render
function render() {
        // render using requestAnimationFrame
        requestAnimationFrame(render);
        //rotate the rotor
        rotorContainer.rotation.y += rotorSpeed;
        //Rotate the screen
        scene.rotation.y += sceneSpeed;
        renderer.render(scene, camera);
}

//javascript function to drive your scene
window.onload = function () {
        this.init();
        this.createCameraAndLights();
        this.createGeometry();
        this.createMaterial();
        this.setupDatgui();
        this.render();
}

