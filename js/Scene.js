var renderer, scene, camera, controls, skybox;
var interactionObjects = [];
var spriteDictionary = {};
var highlighted = null;
var lastSelected = {line: null, object: null};
var flyTo = null, flyFrom = null;
var isFlying = false;
var visibleLabels = {};
var spriteGroups = {};
var currentTarget = null; //counter for current focused object
var dimension = "3";
///////////////////////////////////Chris's variables
var moveFoward = false;
var moveBackward = false;
var turnLeft = false;
var turnRight = false;
var turnUp = false;
var turnDown = false; //variables for moving and turning
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var rotationVector = new THREE.Vector3( 0, 0, 0 ); 
var tmpQuaternion = new THREE.Quaternion();
var clock = new THREE.Clock();//variables for turning direction and moving speed


////////////////////////////////////
init();
//initScene();
//animate();

function init() {
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'sound/BackgroundMusic.mp3', function( buffer ) {
    Music.setBuffer( buffer );
    Music.setLoop( false );
    Music.setVolume( 0.5 );
    Music.play();//backgroundmusic
  });
  var params = parseURL();
  dimension = params.dimension;
  var game = params.game;
  $.getJSON("gameinfo.json", function(result){
    spriteJSONPath = result[game][dimension];
    initScene();
    animate();
  });

}

function initScene() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH , HEIGHT );

  var container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  // scene.fog = new THREE.FogExp2( 0x000000, 0.0009 );
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, spaceScale*2.0);
  camera.position.x = 0.0;
  camera.position.y = 0.0;
  camera.position.z = spaceScale * - 0.8  ;

  if (dimension == "2"){
    camera.position.y = 30.0;
  }

  controls = new THREE.OrbitControls( camera, renderer.domElement);
  controls.enableKeys = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.maxDistance = spaceScale * 0.8;
  controls.update();

  addSkybox();
  addSprites();

  //Interactions
  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener( 'mousedown', onMouseDown, false );
  window.addEventListener( 'mouseup', onMouseUp, false );
  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'keydown', onKeydown, false );
  window.addEventListener( 'keyup', onKeyup, false );
  //////////////////////////////////////////////////chris's code
  window.addEventListener( 'keyup', myKeyUp, false );
  window.addEventListener( 'keydown', myKeyDown, false );
  ///////////////////////////////////////////////////////
}

//var last_updated_time = performance.now();
function animate() {
  TWEEN.update();
  requestAnimationFrame( animate );

  var now = performance.now();
  skybox.material.uniforms.time.value = now * 0.0005;
  // var delta = now - last_updated_time;
  // last_updated_time = now;
  if (!isFlying)
  {
    //controls.update();
  }
  ///////////////////////////////////////Chris's code
  var delta = (now - prevTime)/1000;
  velocity.z -= velocity.z * 10.0 * delta;
  direction.z = Number( moveFoward ) - Number (moveBackward);
  direction.normalize();
  if(moveFoward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  camera.translateZ( velocity.z * delta );//for moving forward and backward
  turning();
  ////////////////////////////////////////////////
  render();
  prevTime = now;
  camera.updateProjectionMatrix();
}
function render() {
  renderer.render( scene, camera );
}

//////////////////////////chris's new code
function turning(){
  var factor = clock.getDelta() * 0.25;
  tmpQuaternion.set( rotationVector.x * factor, rotationVector.y * factor, rotationVector.z * factor, 1).normalize();
  camera.quaternion.multiply( tmpQuaternion ); //for rotation vector
}
//////////////////////////////////////////////////
