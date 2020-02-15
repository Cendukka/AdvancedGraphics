///<reference path="../libs/three.js"/>
///<reference path="../libs/rectAreaLightUniformsLib.js"/>
//Author: Samuli Lehtonen
//Date: February 12, 2020
//Filename: assignment01.js


//declare recurrent variables
let scene;
let renderer;
let camera;
let controls;
let stats;
//lights
let directionalLight;

//lights' colors
let pointLightColor = 0x40404;



let sunRadius = 696;;
let sunWidthSeg = 20;
let sundHeightSeg = 32;
let sunColor = 0xFF7F00;
let sunXPosition = 0;
let sunYPosition = 0;
let sunZPosition = 0;
let sunXRotation = 0;
let sunYRotation = 0;
let sunZRotation = 0;
let sunEmissive = 0xF8CE3B;
let globalRotationSpeed = 0.01;


let axesHelper,
    control;
//Geometry
let sun, mercury, venus, earth, earthMoon, mars, jupiter,
    jupiterMoon1, jupiterMoon2, jupiterMoon3, jupiterMoon4, jupiterMoon5,
    saturnMoon1, saturnMoon2, saturnMoon3, 
    saturn, saturnRing, uranus, neptune, pluto,
    sunCon,mercuryCon, venusCon, earthCon, marsCon, jupiterCon, 
    saturnCon, uranusCon, neptuneCon, plutoCon;
// Array for planets
let planets = [];
let orbitLineArr = [];

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
        renderer.setClearColor(0x000000);

        renderer.shadowMap.enabled = true;
        //add it to the DOM
        document.body.appendChild(renderer.domElement);

        //create stats
        stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
}

//createCameraAndLights
function createCameraAndLights() {
        //create the camera
        camera = new THREE.PerspectiveCamera(
        90,                                         //camera angle
        window.innerWidth / window.innerHeight,     //shape of the output
        0.1,                                        //near point
        1000000                                         //far point
        );
        //set its position
        camera.position.set(-30, 3000, 30);
        //point the camera
        camera.lookAt(scene.position);
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.update();

        //lights

        //Create Point light
        pointLight = new THREE.PointLight(pointLightColor, 200);
        pointLight.position.set( 0, 2000, 10 );
        pointLight.castShadow = true;
        scene.add(pointLight);

}

//createGeometry{}
function createGeometry() {

    
    //Sun
    sun = createPlanet(sunRadius,sunWidthSeg,sundHeightSeg,sunColor, sunXPosition,sunYPosition,sunZPosition,sunEmissive);
    sunCon = createContainer();
    scene.add(sunCon);
    sunCon.add(sun);
    //Mercury
    mercury = createPlanet(4.8*2,20,32,0xC0C0C0, (sunXPosition+57.9*20),0,0);
    mercuryCon = createContainer();
    scene.add(mercuryCon);
    mercuryCon.add(mercury);
    planets.push(mercury);
    //Venus
    venus = createPlanet(12.1*2,20,32,0xebe939, (sunXPosition+108.1*20),0,0);
    venusCon = createContainer();
    scene.add(venusCon);
    venusCon.add(venus);
    planets.push(venus);
    //Earth
    earth = createPlanet(12.7*2,20,32,0x0000ff, (sunXPosition+149.6*20),0,0);
    earthCon = createContainer();
    scene.add(earthCon);
    earthCon.add(earth);
    planets.push(earth);
    //Earth moon
    earthMoon = createPlanet(4*2,20,32,0xC0C0C0, (earth.scale.x+10)*5,0,0);
    earth.add(earthMoon);
    
    //Mars
    mars = createPlanet(6.7*2,20,32,0xE27B58, (sunXPosition+227.9*20),0,0);
    marsCon = createContainer();
    scene.add(marsCon);
    marsCon.add(mars);
    planets.push(mars);
    //Jupiter
    jupiter = createPlanet(142.9*3,20,32,0xFF7F00, (sunXPosition+778.3*20),0,0);
    jupiterCon = createContainer();
    scene.add(jupiterCon);
    jupiterCon.add(jupiter);
    planets.push(jupiter);
    //Jupiter's moons
    jupiterMoon1 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x-50)*10,-200,-245);
    jupiter.add(jupiterMoon1);
    jupiterMoon2 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x-50)*10,-100,-50);
    jupiter.add(jupiterMoon2);
    jupiterMoon3 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,0,0);
    jupiter.add(jupiterMoon3);
    jupiterMoon4 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,200,50);
    jupiter.add(jupiterMoon4);
    jupiterMoon5 = createPlanet(8*2,20,32,0xC0C0C0, (jupiter.scale.x+50)*10,400,185);
    jupiter.add(jupiterMoon5);
    //Saturn
    saturn = createPlanet(120.5*3,20,32,0xc2bd60, (sunXPosition+1427*20),0,0);
    saturnRing = createRing(600,750,32,0xc2bd60);
    
    saturnCon = createContainer();
    scene.add(saturnCon);
    saturnCon.add(saturn);
    saturn.add(saturnRing);
    planets.push(saturn);
    //Saturn's moons
    saturnMoon1 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon1);
    saturnMoon2 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon2);
    saturnMoon3 = createPlanet(4*2,20,32,0xC0C0C0, (saturn.scale.x+10)*5,0,0);
    saturn.add(saturnMoon3);
    //Uranus
    uranus = createPlanet(51.1*2,20,32,0x000080, (sunXPosition+2870*20),0,0);
    uranusCon = createContainer();
    scene.add(uranusCon);
    uranusCon.add(uranus);
    planets.push(uranus);
    //Neptune
    neptune = createPlanet(49.5*2,20,32,0x000090, (sunXPosition+4496.9*20),0,0);
    neptuneCon = createContainer();
    scene.add(neptuneCon);
    neptuneCon.add(neptune);
    planets.push(neptune);
    //Pluto
    pluto = createPlanet(2.3*5,20,32,0xc89357, (sunXPosition+5906.4*20),0,0);
    plutoCon = createContainer();
    scene.add(plutoCon);
    plutoCon.add(pluto);
    planets.push(pluto);

}
function createPlanet(radius,widthSegments, heightSegments,color,xPosition, yPosition, zPosition,emissive){

    
        //create the planet
        let mat = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
        let geo = new THREE.SphereBufferGeometry(radius,widthSegments,heightSegments);
        let planet = new THREE.Mesh(geo, mat);
        planet.position.set(xPosition,yPosition,zPosition);
        
        let segments = 64;
        let lineMat = new THREE.LineBasicMaterial( { color: 0xffffff } );
        let lineGeo = new THREE.CircleGeometry( xPosition, segments );
        lineGeo.vertices.shift();

        let orbitLine = new THREE.LineLoop( lineGeo, lineMat );
        orbitLine.rotation.x = Math.PI * 0.5; 
        scene.add( orbitLine );
        orbitLineArr.push(orbitLine);
        

        return planet;
        
}

function createContainer(){
    let container = new THREE.Object3D();
    container.position.set(0, 0, 0);

    return container;
}

function createRing(ringInnerRadius, ringOuterRadius, ringThetaSegments, ringColor){
    //saturn's ring
    let ringGeo = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringThetaSegments);
    let ringMat = new THREE.MeshBasicMaterial({color: ringColor});
    let ringMesh = new THREE.Mesh(ringGeo, ringMat);
   
    ringMesh.material.side = THREE.DoubleSide;
    //ringMesh.rotation.y = Math.PI*0.5;
    ringMesh.rotation.x = Math.PI*0.5;

    return ringMesh;
}

function setupDatgui() {
    //the object that is used by dat.GUI
        control = new function () {
            this.planetRotation = false;
            this.planetScales = 1;
            this.lineBoolean = true;
            this.rotationSpeedGlobal = 0.01;
        
        }
        let gui = new dat.GUI();
        gui.add(control, "planetRotation");
        gui.add(control, "planetScales", 1, 10, 0.2)
                .onChange((e) => {scalePlanets(e);});
        gui.add(control, "lineBoolean")
                .onChange((e) => {showOrbitLines(e);});
        gui.add(control, "rotationSpeedGlobal",0.01,0.10,0.01)
                .onChange((e) => {globalRotationSpeed = e;})
    }

function scalePlanets(planetRadius){
    for(let i = 0; i<planets.length;i++){
        planets[i].scale.x = planetRadius;
        planets[i].scale.y = planetRadius;
        planets[i].scale.z = planetRadius;
    }
}
function showOrbitLines(visibleBool){
    for(let i = 0; i<orbitLineArr.length; i++){
        orbitLineArr[i].visible = visibleBool;
        console.log("here we are")
    }
}

function rotatePlanets(){
    sun.rotation.y += globalRotationSpeed;
    mercury.rotation.y += globalRotationSpeed*0.08;
    venus.rotation.y += globalRotationSpeed*0.01;
    earth.rotation.y += globalRotationSpeed;
    mars.rotation.y += globalRotationSpeed;
    jupiter.rotation.y += globalRotationSpeed*2.3;
    saturn.rotation.y += globalRotationSpeed*2.2;
    uranus.rotation.y += globalRotationSpeed*1.5;
    neptune.rotation.y += globalRotationSpeed*1.6;
    pluto.rotation.y += globalRotationSpeed*0.16;
    sunCon.rotation.y += globalRotationSpeed;
    mercuryCon.rotation.y += globalRotationSpeed*4;
    venusCon.rotation.y += globalRotationSpeed*3;
    earthCon.rotation.y += globalRotationSpeed;
    marsCon.rotation.y += globalRotationSpeed*0.5;
    jupiterCon.rotation.y += globalRotationSpeed*0.4;
    saturnCon.rotation.y += globalRotationSpeed*0.3;
    uranusCon.rotation.y += globalRotationSpeed*0.2;
    neptuneCon.rotation.y += globalRotationSpeed*0.1;
    plutoCon.rotation.y += globalRotationSpeed*0.08;
}

//render
function render() {
        stats.begin();
        stats.end();
        if(control.planetRotation == true){
            rotatePlanets();
        }
        if(control.lineBoolean == false){

        }
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

