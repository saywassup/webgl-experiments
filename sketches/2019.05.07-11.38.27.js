const canvasSketch = require('canvas-sketch');

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/GLTFLoader');

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const setModel = () => {
  object.updateMatrixWorld();
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  object.position.x += (object.position.x - center.x);
  object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);

  this.scene.add(object);
}

const cubeMap = [
  '../models/environment/posx.png',
  '../models/environment/negx.png',
  '../models/environment/posy.png',
  '../models/environment/negy.png',
  '../models/environment/posz.png',
  '../models/environment/negz.png'
];

// Setup a camera
let camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);

const envMap = new THREE.CubeTextureLoader().load(cubeMap);
envMap.format = THREE.RGBFormat;

const createEnvironmentMap = (node) => {
  if (!node.isMesh) return;
      
  const materials = Array.isArray(node.material)
    ? node.material
    : [node.material];
      
  materials.forEach((material) => {
    if (material.isMeshStandardMaterial || material.isGLTFSpecularGlossinessMaterial) {
          material.envMap = envMap;
          material.needsUpdate = true;
      }
    });
};

const selectCamera = (node) => {
  if (node.isCamera) return;
  
  node.traverse(item => {
    if(item.name === "Camera_Orientation") {
      console.log('New camera HERE -> ', item);
      camera = item;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  })
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  const loader = new THREE.GLTFLoader();

  loader.load('../models/mclaren/mclaren.glb', (gltf) => {
    
    const car = gltf.scene;

    // car.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(car);
    const center = box.getCenter(new THREE.Vector3());

    car.position.x += (car.position.x - center.x);
    car.position.y += (car.position.y - center.y);
    car.position.z += (car.position.z - center.z);
    
    scene.add(car);

    car.traverse(node => {
      selectCamera(node, camera);
      createEnvironmentMap(node);
    });
  },
  null,
  err => console.log(err))

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#ffffff', 0.5));

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 1, 0 );

  const hemisHelper = new THREE.HemisphereLightHelper( hemiLight, 5, 'blue');

  scene.add(hemisHelper);
  scene.add(hemiLight);

  let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

  directionalLight.position.set(1, 5.1 , 1);

  let directLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5, 'red' );

  scene.add(directionalLight) 
  scene.add(directLightHelper) 


  scene.add(new THREE.GridHelper(50, 50, '#000'))

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time }) {
      // mesh.rotation.y = time * (10 * Math.PI / 180);
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
