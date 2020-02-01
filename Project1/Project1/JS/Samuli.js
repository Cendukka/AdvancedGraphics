///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: January 31, 2020
//Filename: Samuli.js


//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let stats;
//lights
let directionalLight;
let ambientLight;
let pointLight;
let spotLight;
//lights' colors
let directionalLightColor = 0x404040;
let ambientLightColor = 0x404040;
let pointLightColor = 0x404040;
let spotLightColor = 0x404040;
let dodecahedronGeometryColor = 0x1491ff


let axesHelper;
let control;

//Geometry
let plane;
let dodecahedronGeometry;

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


        //create stats
        stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
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
        directionalLight.position.set(5,10,0);
        directionalLight.castShadow = true
        let directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
        directionalLight.add(directionalLightHelper)
        directionalLight.visible = false;
        scene.add(directionalLight);

        //Ambient light
        ambientLight = new THREE.AmbientLight( ambientLightColor, 4.0 );
        ambientLight.visible = false;
        scene.add(ambientLight);

        //Create Point light
        pointLight = new THREE.PointLight(pointLightColor, 4.0, 10000, 2);
        pointLight.position.set( 0, 12, 10 );
        pointLight.castShadow = true;
        let pointLightHelper = new THREE.PointLightHelper( pointLight );
        pointLight.add(pointLightHelper)
        scene.add(pointLight);

        //SpotLight
        spotLight = new THREE.SpotLight(spotLightColor, 5.0);
        spotLight.position.set( 0,15, 0 );
        spotLight.castShadow = true;
        spotLight.visible = false;
        let spotLightHelper = new THREE.SpotLightHelper( spotLight );
        spotLight.add(spotLightHelper)
        scene.add(spotLight);

        

}

//createGeometry
function createGeometry() {

        //plane
        let mat = new THREE.MeshStandardMaterial({ color: "rgb(255, 0, 0)" });
        let geo = new THREE.PlaneGeometry(70, 70);
        plane = new THREE.Mesh(geo, mat);
        plane.rotation.x = -0.5*Math.PI;
        plane.castShadow = true;
        plane.receiveShadow = true;
        scene.add(plane);

        //DodecahedronGeometry
        mat = new THREE.MeshToonMaterial({color:dodecahedronGeometryColor});
        geo = new THREE.DodecahedronGeometry(5);
        dodecahedronGeometry = new THREE.Mesh(geo, mat);
        dodecahedronGeometry.position.set(0,5,0);
        dodecahedronGeometry.castShadow = true;
        dodecahedronGeometry.receiveShadow = true;
        
        scene.add(dodecahedronGeometry);

        //dodecahedronGeometry.add(pointLight);
        //dodecahedronGeometry.add(spotLight);
        
}

function rotateMaterials() {
        dodecahedronGeometry.rotation.y += 0.05;

    }

function setupDatgui() {
    //the object that is used by dat.GUI
        control = new function () {
        this.checkBoxAmbient = false;
        this.ambientIntensity = ambientLight.intensity; 

        this.checkBoxSpot = false;
        this.spotIntensity = spotLight.intensity;

        this.checkBoxPoint = false;
        this.pointIntensity = pointLight.intensity; 

        this.checkBoxDirectional = false;
        this.directionalIntensity = directionalLight.intensity; 
      
        this.materialEmmission = {r:0, g:1, b:0};
        this.materialColor = '#1491ff';
        this.materialScale = 1;
        this.materialSkinning = false;
        this.materialShininess = 30;
        this.materialVisible = true;
        this.materialTransparent = false;
        this.materialOpacity = 0.5;
        this.materialWireframe = false;
        this.materialWireframeLinewidth = 1;
        
        }
        let gui = new dat.GUI();
        console.log(dodecahedronGeometry);
        gui.add(control, "checkBoxAmbient")
                .onChange((e) =>{ambientLight.visible = e;});

        gui.add(control, "checkBoxSpot")
                .onChange((e) =>{spotLight.visible = e;});

        gui.add(control, "checkBoxPoint")
                .onChange((e) =>{pointLight.visible = e;});
        let f1 = gui.addFolder('Directional Light');
        f1.add(control, "checkBoxDirectional")
        .onChange((e) =>{directionalLight.visible = e;});

        let f2 = gui.addFolder('Material Properties');
        f2.addColor(control, "materialColor")
                .onChange((c) => {dodecahedronGeometry.material.color.set(c);});
        f2.add(control, "materialScale",0.1,2.0,0.1)
                .onChange(() =>{scaleTheMaterial(dodecahedronGeometry, control.materialScale)});
        f2.addColor(control, "materialEmmission")
                .onChange((e) => {dodecahedronGeometry.material.emissive = (e)});
        f2.add(control, "materialSkinning")
                .onChange((e) =>{dodecahedronGeometry.material.skinning = e;});
        f2.add(control, "materialShininess",0,50,1)
                .onChange((e) =>{dodecahedronGeometry.material.shininess = e;});
        f2.add(control, "materialVisible")
                .onChange((e) =>{dodecahedronGeometry.material.visible = e;});
        f2.add(control, "materialTransparent")
                .onChange((t) => {dodecahedronGeometry.material.transparent = t;});
        f2.add(control, "materialOpacity", 0.1,1.0,0.1)
                .onChange((o) => {dodecahedronGeometry.material.opacity = o;});
        f2.add(control, "materialWireframe")
                .onChange((w) => {dodecahedronGeometry.material.wireframe = w;});
        f2.add(control, "materialWireframeLinewidth", 0.1,5,0.1)
                .onChange((w) => {dodecahedronGeometry.material.wireframeLinewidth = w});

}
//Scaling function to scale the material based on dat.gui
function scaleTheMaterial(material,value){
        material.scale.x = value;
        material.scale.y = value;
        material.scale.z = value;
}

//render
function render() {
        stats.begin();
        stats.end();
        rotateMaterials();
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

