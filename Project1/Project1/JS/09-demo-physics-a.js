Physijs.scripts.worker = '../libs/other/physijs/physijs_worker.js'; //file must be in 'libs/other/physijs/'
Physijs.scripts.ammo = './ammo.js';                              //file must be in 'libs/other/physijs/'



let orbitControls,
    speed = 0.01,
    toRotate = false;

let renderer, scene, camera;
let number = 100;

let result;
function init() {
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x004400);
    renderer.shadowMap.enabled = true;

	scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -50, 0));
    document.body.appendChild(renderer.domElement);

}

function setupCameraAndLight() {
	
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1.0, 1000);
    camera.position.set(-20, 10, 10);
    camera.lookAt(scene.position);

    scene.add(new THREE.AmbientLight(0x222222));

    let spotlight = new THREE.SpotLight(0xeeffff);
    spotlight.position.set(-20, 20, -10);
    scene.add(spotlight);


    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
            directionalLight.position.set( 0, 5, 5 );
            scene.add( directionalLight );

            var d = 5;
            directionalLight.castShadow = true;
            directionalLight.shadow.camera.left = - d;
            directionalLight.shadow.camera.right = d;
            directionalLight.shadow.camera.top = d;
            directionalLight.shadow.camera.bottom = - d;

            directionalLight.shadow.camera.near = 1;
            directionalLight.shadow.camera.far = 20;

            directionalLight.shadow.mapSize.x = 1024;
            directionalLight.shadow.mapSize.y = 1024;


    scene.add(new THREE.HemisphereLight( 0xaaaaff, 0x00ff00 ));
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

}

function createGeometry() {

    scene.add(new THREE.AxesHelper(100));
    var planeGeom = new THREE.BoxGeometry(20, 0.2, 30);
    let planeMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xff7777, transparent: true, opacity: 0.9
    }),
        0.3,       //friction
        0.7);      //restitution 

    let plane = new Physijs.BoxMesh(planeGeom, planeMat, 0);

    plane.receiveShadow = true;
    scene.add(plane);

    //bottom plane
    planeGeom = new THREE.BoxGeometry(40, 0.2, 60);
    planeMat = Physijs.createMaterial(new THREE.MeshStandardMaterial({
        color: 0xff77ff, transparent: true, opacity: 0.3
    }),
        0.8,       //friction
        0.2);      //restitution 
    plane = new Physijs.BoxMesh(planeGeom, planeMat, 0);
    plane.receiveShadow = true;
    plane.position.set(0, -3, 0);
    plane.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation,contact_normal ) {
    	console.log(`object ${other_object.name}`);
    	scene.remove(other_object);
	});
    scene.add(plane);

    scene.add(createPhysicsObject(1, 8, 4, .5, .5, 5));

}

function loadUrl(url){

    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function() {

        console.log(request.response);
        result = request.response;

    }
}

function createPhysicsObject(x, y, z, friction = 0.2, restitution = 0.9, mass = 10) {

    var blockGeom = new THREE.BoxGeometry(1, 1, 1);
    let mat = new THREE.MeshStandardMaterial({ color: 0x7777ff, transparent: true, opacity: 0.9 });
    let blockMat = Physijs.createMaterial(mat, friction, restitution);
    let block = new Physijs.BoxMesh(blockGeom, blockMat, mass);
    block.position.set(x, y, z);
    block.castShadow = true;
    block.receiveShadow = true;
    // block.__dirtyRotation = true;
    //scene.add(block);
    block.name = `${number++}`;
    return block;

}

function setupDatGui() {

    let controls = new function() {

        this.rotate = toRotate;
        this.addCube = function(){
        	scene.add(createPhysicsObject(1, 8, 4));
        };

    }

    let gui = new dat.GUI();
    gui.add(controls, 'rotate').onChange((e) => toRotate = e);
    gui.add(controls, 'addCube');

}

function render() {

    requestAnimationFrame(render);

    if (toRotate)
        scene.rotation.y += speed;//rotates the scene  
    renderer.render(scene, camera);
    scene.simulate(undefined, 1);

}

window.onload = () => {

    init();
    setupCameraAndLight();
    createGeometry();
    setupDatGui();
    render();

}
