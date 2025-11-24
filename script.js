

        const MODEL_PATH = 'scene.gltf'; 
        const AUTO_SPIN_SPEED = 0.5; // How fast the main Y-axis spin is

        // --- 1. SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f0f0f); 
        scene.fog = new THREE.FogExp2(0x0f0f0f, 0.02);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2.3;
        renderer.shadowMap.enabled = true;

        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // --- 2. LIGHTING ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(10, 10, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        const rimLight = new THREE.PointLight(0x6366f1, 2); 
        rimLight.position.set(-5, 5, -5);
        scene.add(rimLight);

        // --- 3. MODEL LOADING ---
        let activeModel = null;
        let mixer = null; 

        const loader = new THREE.GLTFLoader();

        loader.load(
            MODEL_PATH, 
            (gltf) => {
                console.log("Model loaded successfully!");
                activeModel = gltf.scene;

                const box = new THREE.Box3().setFromObject(activeModel);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                activeModel.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3 / maxDim;
                activeModel.scale.set(scale, scale, scale);

                scene.add(activeModel);

                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(activeModel);
                    mixer.clipAction(gltf.animations[0]).play();
                }
            },
            (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
            (error) => {
                console.warn("Could not load local model. Using fallback Cube.", error);
                createFallbackCube();
            }
        );

        function createFallbackCube() {
            const geo = new THREE.BoxGeometry(2, 2, 2);
            const mat = new THREE.MeshStandardMaterial({ color: 0x6366f1, wireframe: true });
            activeModel = new THREE.Mesh(geo, mat);
            scene.add(activeModel);
        }

        // --- 4. SCROLL TRACKING ---
        let currentScrollPercent = 0;

        function onScroll() {
            const scrollY = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            // Update the global variable, don't set rotation directly here
            currentScrollPercent = scrollY / docHeight;
        }

        window.addEventListener('scroll', onScroll);

        // --- 5. ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            if (mixer) mixer.update(delta);

            if (activeModel) {
                // Y-axis: Scroll interaction (1 full spin) + Auto Spin (main spin)
                activeModel.rotation.y = (currentScrollPercent * Math.PI * 2) + (elapsedTime * AUTO_SPIN_SPEED);
                
                // X-axis: Scroll interaction (tilt) + Slow X-axis Auto Spin (adds diagonal feel)
                activeModel.rotation.x = (currentScrollPercent * 0.5) + (elapsedTime * (AUTO_SPIN_SPEED / 3));

                // Z-axis: Auto Spin only (adds the subtle rolling effect to highlight 3D)
                activeModel.rotation.z = elapsedTime * (AUTO_SPIN_SPEED / 5);
            }

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });


        animate();
