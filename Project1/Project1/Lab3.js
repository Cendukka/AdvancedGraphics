///<reference path="libs/three.js"/>
///<reference path="libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: January 24, 2020
//Filename: 02-experiment-with-dat-gui.js


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
let rectAreaLight;
let hemiSphereSkyLight;
let hemiSphereGroundLight;
//lights' colors
let directionalLightColor = 0x404040;
let ambientLightColor = 0x404040;
let pointLightColor = 0x404040;
let spotLightColor = 0x404040;
let rectAreaLightColor = 0x404040;
let hemiSphereSkyLightColor = "#0000ff";
let hemiSphereGroundLightColor = "#00ff00";


let axesHelper;
let control;
//Geometry
let sphere;
let box;
let plane;




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

        //lights

        //Directional light
        directionalLight = new THREE.DirectionalLight(directionalLightColor, 3.0);
        directionalLight.position.set(10,15,0);
        directionalLight.castShadow = true
        scene.add(directionalLight);

        //Ambient light
        ambientLight = new THREE.AmbientLight( ambientLightColor, 4.0 );
        scene.add(ambientLight);

        //Create Point light
        pointLight = new THREE.PointLight(pointLightColor, 4.0, 10000, 2);
        pointLight.position.set( 0, 12, 10 );
        pointLight.castShadow = true;
        ////scene.add(pointLight);

        //SpotLight
        spotLight = new THREE.SpotLight(spotLightColor, 5.0);
        spotLight.position.set( 2, 3, 0 );
        spotLight.castShadow = true;
        //scene.add(spotLight);

        //Rect area light
        rectAreaLight = new THREE.RectAreaLight( 0xffffff, 10.0, 10, 20 );
        rectAreaLight.position.set( 20, 10, 0 );
        rectAreaLight.rotation.set

        scene.add( rectAreaLight );



        //hemisphere light
        hemiSphereLight = new THREE.HemisphereLight(hemiSphereSkyLightColor,hemiSphereGroundLightColor, 1,4);
        hemiSphereLight.position.set(0,50,0);
        scene.add(hemiSphereLight);

}

//createGeometry
function createGeometry() {

        //plane
        let mat = new THREE.MeshStandardMaterial({ color: 0x404040 });
        let geo = new THREE.PlaneGeometry(70, 70);
        plane = new THREE.Mesh(geo, mat);
        plane.rotation.x = -0.5*Math.PI;
        plane.castShadow = true;
        plane.receiveShadow = true;
        scene.add(plane);

        //Box
        mat = new THREE.MeshStandardMaterial({ color: 0x1491ff });
        geo = new THREE.BoxBufferGeometry(5,1.5,3);
        box = new THREE.Mesh(geo, mat);
        box.position.set(0,10,0);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);

        //Sphere
        mat = new THREE.MeshPhongMaterial(
        {
        color: 0xffaa66, specular: 0x0000ff
        });
        geo = new THREE.SphereBufferGeometry(2, 17, 17);
        sphere = new THREE.Mesh(geo, mat);
        sphere.position.set(0, 3, -3);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        scene.add(sphere);
        //Add created lights and set them at the box
        box.add(pointLight);
        box.add(spotLight);        
        rectAreaLight.lookAt( sphere.position );

}



function setupDatgui() {
    //the object that is used by dat.GUI
        control = new function () {
        this.checkBoxAmbient = true;
        this.ambientIntensity = ambientLight.intensity; 
        this.ambientColor = '#ffffff';

        this.checkBoxSpot = true;
        this.spotIntensity = spotLight.intensity; 
        this.spotColor = '#27bea3';

        this.checkBoxPoint = true;
        this.pointIntensity = pointLight.intensity; 
        this.pointColor = '#c403f0';

        this.checkBoxDirectional = true;
        this.directionalIntensity = directionalLight.intensity; 
        this.directionalColor = '#00aa0f';

        this.checkBoxRectArea = true;
        this.rectAreaIntensity = rectAreaLight.intensity; 
        this.rectAreaColor = '#ff0000';

        this.checkBoxHemiSphere = true;
        this.hemisphereIntensity = hemiSphereLight.intensity; 
        this.hemiSphereSkyColor = '#0000ff';
        this.hemiSphereGroundColor = '#00ff00';
        
        }
        let gui = new dat.GUI();
        gui.add(control, "checkBoxAmbient")
                .onChange((e) =>{ambientLight.visible = e;});
        gui.addColor(control, 'ambientColor')
                .onChange(function() {ambientLight.color.set(control.ambientColor)});

        gui.add(control, "checkBoxSpot")
                .onChange((e) =>{spotLight.visible = e;});
        gui.addColor(control, 'spotColor')
                .onChange(function() {spotLight.color.set(control.spotColor)});

        gui.add(control, "checkBoxPoint")
                .onChange((e) =>{pointLight.visible = e;});
        gui.addColor(control, 'pointColor')
                .onChange(function() {pointLight.color.set(control.pointColor)});

        gui.add(control, "checkBoxDirectional")
                .onChange((e) =>{directionalLight.visible = e;});
        gui.addColor(control, 'directionalColor')
                .onChange(function() {directionalLight.color.set(control.directionalColor)});

        gui.add(control, "checkBoxRectArea")
                .onChange((e) =>{rectAreaLight.visible = e;});
        gui.addColor(control, 'rectAreaColor')
                .onChange(function() {rectAreaLight.color.set(control.rectAreaColor)});

        gui.add(control, "checkBoxHemiSphere")
                .onChange((e) =>{hemiSphereLight.visible = e;});
        gui.addColor(control, 'hemiSphereSkyColor')
                .onChange(function() {hemiSphereLight.color.set(control.hemiSphereSkyColor)});
        gui.addColor(control, 'hemiSphereGroundColor')
                .onChange(function() {hemiSphereLight.groundColor.set(control.hemiSphereGroundColor)});
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
        this.setupDatgui();
        this.render();
}

