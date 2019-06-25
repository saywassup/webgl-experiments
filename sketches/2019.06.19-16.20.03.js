
const canvasSketch = require('canvas-sketch');

global.THREE = require('three');

require('three/examples/js/controls/OrbitControls');

const settings = {
  animate: true,
  context: 'webgl',
  attributes: { antialias: true }
};

let fraction = 0;
let lineLength;


const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#1E1B23', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(0, 0, -50);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  // points
	let points = ( new THREE.TorusKnotGeometry( 10, 3, 300, 300 ) ).vertices;

	// geometry
	let geometry = new THREE.BufferGeometry();

	// attributes
	numPoints = points.length;
	let positions = new Float32Array( numPoints * 3 );
	let colors = new Float32Array( numPoints * 3 );
	let lineDistances = new Float32Array( numPoints * 1 );

	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	geometry.addAttribute( 'lineDistance', new THREE.BufferAttribute( lineDistances, 1 ) );

	// populate
	let color = new THREE.Color();

	for ( let i = 0, index = 0, l = numPoints; i < l; i ++, index += 3 ) {

		positions[ index ] = points[ i ].x;
		positions[ index + 1 ] = points[ i ].y;
		positions[ index + 2 ] = points[ i ].z;

		color.setHSL(1,1,1);

		colors[ index ] = color.r;
		colors[ index + 1 ] = color.g;
		colors[ index + 2 ] = color.b;

		if ( i > 0 ) {
			lineDistances[ i ] = lineDistances[ i - 1 ] + points[ i - 1 ].distanceTo( points[ i ] );
		}

	}

	lineLength = lineDistances[ numPoints - 1 ];

	// material
	let material = new THREE.LineDashedMaterial( {
  	vertexColors: THREE.VertexColors,
  	dashSize: 1,
  	gapSize: 1e10
	});

	// line
	line = new THREE.Line( geometry, material );
	scene.add( line );


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
      
      if(fraction < 0.9999) {
        fraction = ( fraction + 0.001 ) % 1;
	      line.material.dashSize = fraction * lineLength;
      }

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
