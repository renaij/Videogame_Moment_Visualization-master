var lastClickedTime = null;

var input = document.getElementById("moment_id");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("moment_button").click();
  }
});

//////////////////////////////////////////////Chris's code

////////////////////////////////////////////////////////





function onMouseDown() {
  lastClickedTime = performance.now();
}
function onMouseUp() {
  if (!isFlying) {
    // if mouse up on top of the floating div, nothing happens
    if (event.clientX <= FLOATING_DIV_RIGHT && event.clientY <= FLOATING_DIV_BOTTOM) {
      return;
    }
    //if it's a drag, do nothing;
    if (performance.now() - lastClickedTime > 200)
    {
      return;
    }
    // update the mouse position
  	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;

    //var startingTime = performance.now();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( interactionObjects, true );
    //console.log('DEBUGGING: Ray Cast - ' + (performance.now() - startingTime)); startingTime = performance.now();
    resetMetaLabel();
    resetSprites();
    // console.log('DEBUGGING: Resets   - ' + (performance.now() - startingTime));
    // if there is one (or more) intersections
  	if ( intersects.length > 0 )
  	{
	///////////////////////////////////////////////////Chris's Code
	  var audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'sound/OnClick.mp3', function( buffer ) {
        soundOnClick.setBuffer( buffer );
        soundOnClick.setLoop( false );
        soundOnClick.setVolume( 0.5 );
        soundOnClick.play();//Sound for Clicking
	  });
	  ////////////////////////////////////////////////
      showNearbyLabels(intersects[0].object);
  	} else {
      controls.autoRotate = true;
      lastSelected.object = null;
      //console.log('Nothing got clicked');
    } //end of intersect.length > 0
  } // end of isFlying
}

function onMouseMove(event) {
  event.preventDefault();
  // update the mouse position
  mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( interactionObjects, true );
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
	  ////////////////////////////////////////////////////////////Chris's Code
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/OnSelect.mp3', function( buffer ) {
      soundOnSelect.setBuffer( buffer );
      soundOnSelect.setLoop( false );
      soundOnSelect.setVolume( 0.5 );
      soundOnSelect.play(); //sound for selecting
    });
	///////////////////////////////////////////////////
	console.log("wow");
    resetHightLight();
    highlighted = intersects[0].object;
    highlighted.material.color.setHex( 0x10ffff );
  } else {
    resetHightLight();
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function resetHightLight() {
  if (highlighted != null)
  {
    highlighted.material.color.setHex( 0xffffff );
  }
}
function resetSprites(){
  if (lastSelected.object != null)
  {
    for (var corpusname in spriteGroups)
    {
      resetSpritesInCorpus(corpusname);
    }
  }
}
function resetSpritesInCorpus(corpus){
  if (document.getElementById(corpus + "_check").checked){
    for (var i = 0; i < spriteGroups[corpus].children.length; i++)
    {
      spriteGroups[corpus].children[i].material.opacity = 1.0;
      spriteGroups[corpus].children[i].visible = true;
    }
  }
}
function resetMetaLabel(){
  for (var key in visibleLabels){
    makeInvisible(visibleLabels[key]);
  }
}
function resetLines(){
  if (lastSelected.line != null)
  {
    scene.remove(lastSelected.line) ;
    lastSelected.line = null;
  }
}

function onKeydown(event){
  // should check if selected item is part of some object
  if (lastSelected.object != null && (event.key == '.' || event.key == '>')){
    currentTarget += 1;
    if (spriteDictionary[currentTarget].labelSprite == null)
    {
      showLabel(spriteDictionary[currentTarget], true);
    } else {
      jump(spriteDictionary[currentTarget].labelSprite);
    }
	////////////////////////////////////////////////////////////Chris's Code
	var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sound/OnNext.mp3', function( buffer ) {
      soundOnNext.setBuffer( buffer );
      soundOnNext.setLoop( false );
      soundOnNext.setVolume( 0.5 );
      soundOnNext.play();
	});//sound for next page
	//////////////////////////////////////////////////////////////////////

  } else if (lastSelected.object!= null && (event.key == ',' || event.key == '<')){
    currentTarget -= 1;
    if (spriteDictionary[currentTarget].labelSprite == null)
    {
      showLabel(spriteDictionary[currentTarget], true);
    } else {
      jump(spriteDictionary[currentTarget].labelSprite);
    }
	////////////////////////////////////////////////////////////Chris's Code
	 var audioLoader = new THREE.AudioLoader();
      audioLoader.load( 'sound/OnNext.mp3', function( buffer ) {
        soundOnNext.setBuffer( buffer );
        soundOnNext.setLoop( false );
        soundOnNext.setVolume( 0.5 );
        soundOnNext.play();//sound for next page
	  });
	  ////////////////////////////////////////////////////////////Chris's Code
  }
}
function onKeyup(event){

}
function onChange(checkbox) {
  var box = checkbox.value;
  if (checkbox.checked)
  {
    for (var i = 0; i < spriteGroups[box].children.length; i++)
    {
      spriteGroups[box].children[i].material.opacity = 1.0;
    }
  }
  if (!checkbox.checked) {
    for (var i = 0; i < spriteGroups[box].children.length; i++)
    {
      spriteGroups[box].children[i].material.opacity = 0.05;
    }
  }
  enableSpritesInteractions();
}

function onMomentInput() {
  var inputMomentId = document.getElementById("moment_id");
  inputMomentId.blur();
  var inputMomentId = inputMomentId.value;
  resetMetaLabel();
  resetSprites();
  showNearbyLabels(spriteDictionary[Number(inputMomentId)].object);
  //url manipulation example
  var params = {};
  params['corpora'] = [];
  if (document.getElementById("human_check") != null){
    params['corpora'].push("human");
  }
  if (document.getElementById("algorithm_check") != null){
    params['corpora'].push("algorithm");
  }
  if (document.getElementById("expert_check") != null){
    params['corpora'].push("expert");
  }
  if (document.getElementById("attractmode_check") != null){
    params['corpora'].push("attractmode");
  }
  params['moment_id'] = inputMomentId;
  params['position'] = camera.position.toArray();
  var urlString = getUrlString(params);
  writeURL(urlString);
  var urlParam = parseURL();
}
//////////////////////////////////////////////Chris's code
function myKeyDown(event){
	event = event || window.event;
	switch(event.keyCode){
		case 87:
			moveFoward = true;
			break;
		case 83:
			moveBackward = true;
			break;
		case 65:
			turnLeft = 1;
			break;
 		case 68:
			turnRight = 1;
			break;
		case 82:
			turnUp = 1;
			break;
		case 70:
			turnDown = 1;
			break; 
	}
	updateRotation();
};

function myKeyUp (event){
  event = event || window.event;
		switch(event.keyCode){
		case 87:
			moveFoward = false;
			break;
		case 83: 
			moveBackward = false;
			break;
		case 65:
			turnLeft = 0;
			break;
 		case 68:
			turnRight = 0;
			break;
		case 82:
			turnUp = 0;
			break;
		case 70:
			turnDown = 0;
			break;
	}
	updateRotation();
};

function updateRotation(){
	rotationVector.x = ( - turnDown + turnUp );
	rotationVector.y = ( - turnRight + turnLeft );
	//update the rotation's direction
};
////////////////////////////////////////////////////

