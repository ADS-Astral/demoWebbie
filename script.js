var scene, camera, renderer, controls, colors, activeModel
const MODEL_PATH = 'model/TapBasin.glb'

const MODELS = [
  { name: 'TapBasin1', path: 'model/TapBasin.glb' },
  { name: 'TapBasin2', path: 'model/TapCounter.glb'},
  { name: 'TapBasin3', path: 'model/TapProgressive.glb' }
];
const partsToChange = ["flatTapHandle1", "TapBase31", "TapBase21", "tapBase1"];

colors = [{ name: 'Black', color: '131417' },
{ name: 'Gold', color: 'ffd700' },
{ name: 'Platinum', color: 'e5e4e2' }]



addColorPallete()
main()
animate()


document.querySelector("#models").addEventListener("click", (e)=>{
  var model;
  model = e.target.id
  if(!model){
    model = e.target.parentElement.id
  }

  MODELS.forEach(mod=>{
    if(model === mod.name){
      removeAllObjects()
    addLight()
      addModel(mod.path, mod.name)
    }
  })
})


document.getElementById("loadModel1Button").addEventListener("click", function() {
  loadModel('TapBasin1');
});

document.getElementById("loadModel2Button").addEventListener("click", function() {
  loadModel('TapBasin2');
});

document.getElementById("loadModel3Button").addEventListener("click", function() {
  loadModel('TapBasin3');
});

document.querySelectorAll(".todo-wrap").forEach(el => {
  el.addEventListener("click", (e) => {
    let color = e.target.id || e.target.parentElement.id;
    if(color) createMaterial(color);
  });
});




function addColorPallete(){
    colors.forEach((color, index)=>{
        const li = document.createElement("li")
        li.classList.add("todo-wrap")
        li.style.background = `#${color.color}`
        li.id = color.color
        li.innerHTML = `
            <div class="todo-content">
                ${color.name}
            </div>
        `
        document.querySelector(".colors-list").appendChild(li)
    })
}

function loadModel(modelName) {
  const modelInfo = MODELS.find(mod => mod.name === modelName);
  if (modelInfo) {
    removeAllObjects();
    addLight();
    addFloor()
    addModel(modelInfo.path,modelName);
  }
}

function addModels(){
  MODELS.forEach(model=>{
    const div = document.createElement("div")
    div.id = model.name
    div.classList.add("model")
    div.innerHTML = `
    <img src="${model.image}">
    `
    document.querySelector("#models .row").appendChild(div)
  })
}

function main(){
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf1f1f1)
    scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, -5)
    camera.rotation.set(100, 0, 0)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
    renderer.domElement.style.position = 'absolute'; // Position it absolutely...
    renderer.domElement.style.left = '18px';
    renderer.domElement.style.zIndex = '-1';

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // For softer shadows
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild( renderer.domElement );
   
    
    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2; // 30
    // Set max and min distance for zoom
    controls.maxDistance = 10;
    controls.minDistance = 3;

    addLight()
    addFloor()
    addModel(MODEL_PATH)

    // addModelDebug()

}

function createMaterial(color) {
    const mat = new THREE.MeshStandardMaterial({
      color: parseInt('0x' + color),
      metalness: 1.0, // Fully metallic
      roughness: 0.5 // Adjust for desired smoothness (0 = smooth, 1 = rough)
    });
    changeMaterial(activeModel, mat);
}

function changeMaterial(parent, mat) {
  parent.traverse(o => {
      // Check if this object's name is in the list of parts to change
      if (partsToChange.includes(o.parent.name)) {
          o.material = mat;
      }
  });
}

function addFloor(){
    // Floor
        var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
        var floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 0 });


        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        floor.position.y = -1;
        scene.add(floor);
}

function addLight(){
  var spotLight = new THREE.SpotLight(0xffffff, 15, 100, 0.6, 1.5, 0.6); //colour, intensity, distance, angle, penumbra, decay
  spotLight.position.set(0, 5, -2);
  spotLight.target.position.set(0, 0, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
}

function addModel(modelPath, modelName) {
  var loader = new THREE.GLTFLoader();
  loader.load(modelPath, function(gltf){
    // If there's an active model, remove it
    if (activeModel) scene.remove(activeModel);

    var loadedModel = gltf.scene;
    activeModel = loadedModel; // Update the reference to the active model
    console.log("GLTF/GLB Loaded Model:", gltf);

    // Apply materials and other customizations as before
    loadedModel.traverse(o => {
        if(o.isMesh){
            o.castShadow = true;
            o.receiveShadow = true;
            
            // Define materials
            const gemMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000, // Example green color for jewels
                transparent: true,
                opacity: 0.5,
                refractionRatio: 1.725,
                emissive: 0xff0000 // Making it glow a bit could be nice for jewels
            });
            // Define materials
            const gem2Material = new THREE.MeshStandardMaterial({
              color: 0x0000ff, // Example green color for jewels
              transparent: true,
              opacity: 0.5,
              refractionRatio: 1.725,
              emissive: 0x0000ff // Making it glow a bit could be nice for jewels
          });
            
            const metalMaterial = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa, // Example metallic color
                metalness: 1.0,
                roughness: 0.5
            });

            const handleMaterial = new THREE.MeshStandardMaterial({
                color: 0xaaaaaa, // Example color for the handle
                metalness: 1.0,
                roughness: 0.4
            });
            
            // Apply materials based on name
            switch(o.parent.name) {
              case 'Jewel1':
                  o.material = gemMaterial;
                    break;
                case 'Jewel2':
                  o.material = gem2Material;
                    break;
                case 'Jewel3':
                    o.material = gemMaterial;
                    break;
                case 'TapBase21':
                    o.material = metalMaterial;
                    break;
                    case 'TapBase31':
                      o.material = metalMaterial;
                      break;
                case 'flatTapHandle1':
                    o.material = handleMaterial;
                    break;
            }
        }
    });
    
    scene.add(loadedModel);
    adjustModelPositionAndScale(loadedModel, modelName); // Adjust position and scale as needed
  });
}

function adjustModelPositionAndScale(model, modelName) {
  // Adjust position and scale if needed, for example:
  // Check model name and adjust position and scale accordingly
  if (modelName === 'TapBasin1') {
    // If the model is TapBasin1, adjust the y position to 1
    model.position.set(0, 0.1, 0);
    model.scale.set(10, 10, 10);
} 
if (modelName === 'TapBasin3') {
  // If the model is TapBasin1, adjust the y position to 1
  model.position.set(0, -0.4, 0);
  model.rotation.set(0,-3,1.5708)
  model.scale.set(10, 10, 10);
}
else {
    // For any other model, use a default position
    model.position.set(0, 0, 0);
    model.scale.set(10, 10, 10);
}
  
}

function removeAllObjects(){
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
}
}

function animate(){
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update()
}


function addModelDebug(){
    var g = new THREE.CubeGeometry(1,1,1)
    var m = new THREE.MeshBasicMaterial({Color: 0x000000})
    var cube = new THREE.Mesh(g,m)
    scene.add(cube)
    camera.position.z = 5;
}
