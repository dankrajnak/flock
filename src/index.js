let size = {width: window.innerWidth, height: window.innerHeight}
let scene = new THREE.Scene();
scene.background = new THREE.Color('#F6E9D5');


let fog = new THREE.Fog();
fog.far = 100;
fog.color = new THREE.Color('#F6E9D5');
scene.fog = fog
//args: FOV, apsect ration, near and far clipping planes
let camera = new THREE.PerspectiveCamera(75, size.width/size.height, 0.1, 1000)

let renderer = new THREE.WebGLRenderer();
renderer.setSize(size.width, size.height);

//Add canvas to HTML body
document.body.appendChild(renderer.domElement);

//Let's draw a cube to see if this works.

let geometry = new THREE.SphereBufferGeometry(.5, 32, 32 );
let material = new THREE.MeshBasicMaterial( { color: 0x222 } );
let cube = new THREE.Mesh(geometry, material);
let otherCube = new THREE.Mesh(geometry, material);

const flock = new Flock();
let flockArray = [];
let shapeArray = [];
let numBirds = 300;
for(let i = 0; i<numBirds; i++){
  let newBird = new Bird(new THREE.Vector3(80*(Math.random()-.5), 80*(Math.random()-.5), 80*(Math.random()-.5)),
    new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5),
     flock);
  newBird.maxSpeed = newBird.maxSpeed*(1+Math.random())
  flock.addBird(newBird);
  flockArray.push(newBird);
  let newShape = new THREE.Mesh(geometry, material);
  scene.add(newShape);
  shapeArray.push(newShape);
}


let controls = new THREE.TrackballControls(camera);
camera.position.z = 50;
controls.noZoom=true;
controls.noPan=true;
controls.rotateSpeed = 2.0;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  controls.handleResize(); // for TrackballControls
}


let animate = ()=>{
  requestAnimationFrame(animate);
  for(let i = 0; i<flockArray.length; i++){
    flockArray[i].step();
    shapeArray[i].position.copy(flockArray[i].position);
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

setTimeout(()=>{
  for(let p of document.getElementsByTagName('p')){
    p.style.opacity = 0;
  };
}, 20*1000)
