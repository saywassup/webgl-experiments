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

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#FFF', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  const loader = new THREE.GLTFLoader();

  loader.load('../models/mclaren/scene.gltf', (gltf) => {
    scene.add(gltf.scene)
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
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
