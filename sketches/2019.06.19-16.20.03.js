//Learn resources
//http://jsfiddle.net/w67tzfhx/
//https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically/31411794#31411794
//https://threejs.org/docs/#api/en/core/BufferGeometry
//https://threejs.org/docs/#api/en/core/BufferAttribute
//http://wtf.tw/ref/shiffman.pdf
//https://stackoverflow.com/questions/42229799/how-to-smoothly-animate-drawing-of-a-line/42236893#42236893

const canvasSketch = require('canvas-sketch');

global.THREE = require('three');

require('three/examples/js/controls/OrbitControls');

const settings = {
  animate: true,
  context: 'webgl',
  attributes: { antialias: false }
};

const Walker = () => ({
  x: window.visualViewport.width / 2,
  y: window.visualViewport.height / 2,
  z: 0
});

const walkerMethods = {
  display() {
    // criar uma linha

    // criar um ponto
    this.x;
    this.y;
  },
  step() {
    const choice = 0;
  }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#fff', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  var material = new THREE.LineBasicMaterial({
    color: 0x000000
  });
  
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3( 10, 0, 0 ),
    new THREE.Vector3( 0, 10, 5 ),
    new THREE.Vector3( 0, -15, -15 )
  );
  
  var line = new THREE.Line( geometry, material );
  scene.add( line );

  geometry.vertices.push(
    new THREE.Vector3( -10, -0.5, -25 )
  );

  geometry.vertices.push(
    new THREE.Vector3( 0, -10, -5 )
  );

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#59314f'));

  // Add some light
  const light = new THREE.PointLight('#45caf7', 1, 15.5);
  light.position.set(2, 2, -4).multiplyScalar(1.5);
  scene.add(light);

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
