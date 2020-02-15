//author: Samuli Lehtonen Feb 10 2020
//filename: 06-selecting-objects.js

let scene, camera, renderer;
let clock, orbitControll;
let objects = [];


function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function createCameraAndLights() {    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);    
    camera.position.set( -30, 40, 30 );
    camera.lookAt(scene.position);
    clock = new THREE.Clock();//needed for the orbitControll
    orbitControll = new THREE.OrbitControls( camera, renderer.domElement );

    // add subtle ambient lighting
    scene.add(new THREE.AmbientLight(0x353535));

    // add spotlight for the shadows
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10, 20, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);
}

function createGeometry() {
    scene.add(new THREE.AxesHelper(20));
    let mat = new THREE.MeshBasicMaterial({ color: 0xddddff });
    let geo = new THREE.PlaneBufferGeometry(60, 20);
    let plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);

    let numberOfCubes = 10;

    for(let i = 0; i < numberOfCubes; i++){
        geo = new THREE.BoxGeometry(2, 2, 2);
        mat = new THREE.MeshStandardMaterial({ color: Math.random()* 0xffffff });
        let box = new THREE.Mesh(geo, mat);
        let x = Math.floor((Math.random()-0.5 )* Math.floor(60));
        let y = Math.floor(Math.random() * Math.floor(1));
        let z = Math.floor((Math.random()-0.5 )* Math.floor(20));
        box.position.set(x,y,z);
        objects.push(box);
        scene.add(box);
    }
    
}
function mouseDownHandler(event){
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3();
    mouse.x = (event.clientX / window.innerWidth)*2-1;
    mouse.y = -(event.clientY / window.innerHeight)*2+1;
    mouse.z = 0;
    console.log(`x:${mouse.x} y:${mouse.y}`);

    raycaster.setFromCamera(mouse, camera);
    let intersections = raycaster.intersectObjects(objects);

    intersections.some(element => {
    scene.remove(element.object);
    
    });
}

function render() {
    requestAnimationFrame(render);
    orbitControll.update(clock.getDelta());
    renderer.render(scene, camera);
}

window.onload = function () {
    init();
    createCameraAndLights();
    createGeometry();
    window.addEventListener('mousedown', this.mouseDownHandler,false);    
    render();
}
