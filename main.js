<reference path="libs/three.min.js" />
//Author: Narendra Pershad
//Date: January 8, 2020
//Filename: lab-01-using-three-js.js

//declare recurrent global variables

//function definitions
function init() {
}

function createCameraAndLights() {
}

function createGeometry() {
}

function render() {
    // render using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

//javascript function to drive your scene
window.onload = () => {
    init();
    createCameraAndLights();
    createGeometry();
    render();
}
