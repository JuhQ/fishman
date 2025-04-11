// Global variables
let scene, camera, renderer, controls;
let fishBunny, motorcycle, road, bubbleGum;
let isLoading = true;

// Initialize the scene
function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue background

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Add orbit controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 20;

  // Add lighting
  addLights();

  // Create 3D model components
  createRoad();
  createMotorcycle();
  createFishBunnyCharacter();

  // Add event listeners for controls
  document
    .getElementById("rotate-left")
    .addEventListener("click", () => rotateModel(-0.5));
  document
    .getElementById("rotate-right")
    .addEventListener("click", () => rotateModel(0.5));
  document.getElementById("zoom-in").addEventListener("click", zoomIn);
  document.getElementById("zoom-out").addEventListener("click", zoomOut);

  // Handle window resize
  window.addEventListener("resize", onWindowResize);

  // Hide loading indicator
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    isLoading = false;
  }, 2000);

  // Start animation loop
  animate();
}

function addLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional light (sunlight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);
}

function createRoad() {
  // Create the road
  const roadGeometry = new THREE.PlaneGeometry(20, 100);
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.8,
  });
  road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = -Math.PI / 2;
  road.position.y = -1;
  road.receiveShadow = true;
  scene.add(road);

  // Add grass on sides
  const grassGeometry = new THREE.PlaneGeometry(100, 100);
  const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x7cfc00,
    roughness: 0.9,
  });
  const grass = new THREE.Mesh(grassGeometry, grassMaterial);
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -1.05;
  grass.receiveShadow = true;
  scene.add(grass);
}

function createMotorcycle() {
  // Group for motorcycle parts
  motorcycle = new THREE.Group();

  // Motorcycle body
  const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.5,
    metalness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.z = Math.PI / 2;
  body.castShadow = true;
  motorcycle.add(body);

  // Front wheel
  const frontWheelGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.7,
  });
  const frontWheel = new THREE.Mesh(frontWheelGeometry, wheelMaterial);
  frontWheel.position.set(1.5, -0.8, 0);
  frontWheel.castShadow = true;
  motorcycle.add(frontWheel);

  // Back wheel
  const backWheel = new THREE.Mesh(frontWheelGeometry, wheelMaterial);
  backWheel.position.set(-1.5, -0.8, 0);
  backWheel.castShadow = true;
  motorcycle.add(backWheel);

  // Handlebars
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.8,
  });
  const handlebar = new THREE.Mesh(handleGeometry, handleMaterial);
  handlebar.position.set(1.3, 0.4, 0);
  handlebar.rotation.z = -Math.PI / 4;
  motorcycle.add(handlebar);

  // Seat
  const seatGeometry = new THREE.BoxGeometry(1, 0.2, 0.8);
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(-0.2, 0.5, 0);
  motorcycle.add(seat);

  // Position motorcycle
  motorcycle.position.y = 0;
  motorcycle.scale.set(0.8, 0.8, 0.8);
  scene.add(motorcycle);
}

function createFishBunnyCharacter() {
  fishBunny = new THREE.Group();

  // Fish head (base shape)
  const fishGeometry = new THREE.SphereGeometry(1, 32, 32);
  const fishMaterial = new THREE.MeshStandardMaterial({
    color: 0x39738f, // Blueish-green color for fish
    roughness: 0.5,
  });
  const fishHead = new THREE.Mesh(fishGeometry, fishMaterial);
  fishHead.scale.set(1, 0.8, 1.2);
  fishHead.castShadow = true;
  fishBunny.add(fishHead);

  // Fish scales texture effect
  const scalesGeometry = new THREE.SphereGeometry(1.01, 20, 20);
  const scalesMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c5d73,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const scales = new THREE.Mesh(scalesGeometry, scalesMaterial);
  scales.scale.set(1, 0.8, 1.2);
  fishBunny.add(scales);

  // Duck bill
  const billGeometry = new THREE.ConeGeometry(0.4, 0.8, 4);
  const billMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
  const bill = new THREE.Mesh(billGeometry, billMaterial);
  bill.position.set(0, -0.2, 1.1);
  bill.rotation.x = Math.PI / 2;
  bill.castShadow = true;
  fishBunny.add(bill);

  // Rabbit ears
  const earGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
  const earMaterial = new THREE.MeshStandardMaterial({ color: 0xffb6c1 }); // Pink color

  const leftEar = new THREE.Mesh(earGeometry, earMaterial);
  leftEar.position.set(-0.4, 1, 0);
  leftEar.rotation.x = -Math.PI / 12;
  leftEar.rotation.z = -Math.PI / 12;
  leftEar.castShadow = true;
  fishBunny.add(leftEar);

  const rightEar = new THREE.Mesh(earGeometry, earMaterial);
  rightEar.position.set(0.4, 1, 0);
  rightEar.rotation.x = -Math.PI / 12;
  rightEar.rotation.z = Math.PI / 12;
  rightEar.castShadow = true;
  fishBunny.add(rightEar);

  // Sunglasses
  const glassesGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.1);
  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 0.7,
    roughness: 0.2,
  });
  const glasses = new THREE.Mesh(glassesGeometry, glassesMaterial);
  glasses.position.set(0, 0.1, 0.9);
  fishBunny.add(glasses);

  // Bubble gum bubble
  const bubbleGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const bubbleMaterial = new THREE.MeshStandardMaterial({
    color: 0xff69b4, // Hot pink
    transparent: true,
    opacity: 0.7,
  });
  bubbleGum = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
  bubbleGum.position.set(0, -0.3, 1.5);
  fishBunny.add(bubbleGum);

  // Humanoid body (upper part - muscular torso)
  const torsoGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.5, 16);
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd39b }); // Beige/tan color
  const torso = new THREE.Mesh(torsoGeometry, skinMaterial);
  torso.position.set(0, -1.2, 0);
  torso.castShadow = true;
  fishBunny.add(torso);

  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1, 16);

  // Left arm
  const leftArm = new THREE.Mesh(armGeometry, skinMaterial);
  leftArm.position.set(-0.8, -1, 0.2);
  leftArm.rotation.z = Math.PI / 4;
  leftArm.rotation.x = -Math.PI / 8;
  leftArm.castShadow = true;
  fishBunny.add(leftArm);

  // Right arm
  const rightArm = new THREE.Mesh(armGeometry, skinMaterial);
  rightArm.position.set(0.8, -1, 0.2);
  rightArm.rotation.z = -Math.PI / 4;
  rightArm.rotation.x = -Math.PI / 8;
  rightArm.castShadow = true;
  fishBunny.add(rightArm);

  // Hands (furry)
  const handGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const furMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown fur

  const leftHand = new THREE.Mesh(handGeometry, furMaterial);
  leftHand.position.set(-1.2, -1.5, 0.3);
  leftHand.castShadow = true;
  fishBunny.add(leftHand);

  const rightHand = new THREE.Mesh(handGeometry, furMaterial);
  rightHand.position.set(1.2, -1.5, 0.3);
  rightHand.castShadow = true;
  fishBunny.add(rightHand);

  // Chicken legs
  const legGeometry = new THREE.CylinderGeometry(0.2, 0.1, 1.2, 16);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 }); // Yellow

  // Left leg
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.4, -2.5, 0);
  leftLeg.castShadow = true;
  fishBunny.add(leftLeg);

  // Right leg
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.4, -2.5, 0);
  rightLeg.castShadow = true;
  fishBunny.add(rightLeg);

  // Chicken feet
  const footGeometry = new THREE.ConeGeometry(0.3, 0.6, 3);
  const footMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });

  const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
  leftFoot.position.set(-0.4, -3.2, 0.2);
  leftFoot.rotation.x = Math.PI / 2;
  leftFoot.castShadow = true;
  fishBunny.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
  rightFoot.position.set(0.4, -3.2, 0.2);
  rightFoot.rotation.x = Math.PI / 2;
  rightFoot.castShadow = true;
  fishBunny.add(rightFoot);

  // Position character on motorcycle
  fishBunny.position.set(0, 2.2, 0);
  fishBunny.rotation.x = Math.PI / 12;
  scene.add(fishBunny);
}

function rotateModel(angle) {
  fishBunny.rotation.y += angle;
  motorcycle.rotation.y += angle;
}

function zoomIn() {
  if (camera.position.z > 5) {
    camera.position.z -= 1;
  }
}

function zoomOut() {
  if (camera.position.z < 15) {
    camera.position.z += 1;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Add subtle animations
  if (!isLoading) {
    // Motorcycle wheel rotation
    motorcycle.children[1].rotation.y += 0.05;
    motorcycle.children[2].rotation.y += 0.05;

    // Bubble gum pulsing
    const pulseFactor = Math.sin(Date.now() * 0.003) * 0.05 + 1;
    bubbleGum.scale.set(pulseFactor, pulseFactor, pulseFactor);
  }

  controls.update();
  renderer.render(scene, camera);
}

// Start the application when the window loads
window.addEventListener("load", init);
