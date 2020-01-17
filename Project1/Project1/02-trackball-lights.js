//author: Narendra Pershad jan 14, 2020
//filename: 02-trackball-lights.js

let scene, camera, renderer;
let clock, trackballControl;

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
    clock = new THREE.Clock();//needed for the trackballControl
    trackballControl = new THREE.TrackballControls(camera, renderer.domElement);

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


    geom = new THREE.BoxGeometry(2, 2, 2);
    mat = new THREE.MeshStandardMaterial({ color: 0xaaffaa });
    let mesh = new THREE.Mesh(geom, mat);
    mesh.position.y = 1;
    scene.add(mesh);
}

function render() {
    requestAnimationFrame(render);
    trackballControl.update(clock.getDelta());
    renderer.render(scene, camera);
}

window.onload = function () {
    init();
    createCameraAndLights();
    createGeometry();    
    render();
}
