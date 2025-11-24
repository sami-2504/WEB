// Corrected path based on your file structure (scene.gltf is in the root directory)
        // If your repo is named 'WEB', the path should be '/WEB/scene.gltf'
        // Since the image shows scene.gltf in the root, let's try the absolute path from root:
        const MODEL_PATH = 'scene.gltf'; 
        const AUTO_SPIN_SPEED = 0.5; // How fast the main Y-axis spin is
        
        // --- 1. SCENE SETUP ---
        // ... (rest of Scene Setup remains the same) ...

        // ... (rest of Lighting remains the same) ...

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
            // Progress Callback: Added check for total size to fix Infinity% error
            (xhr) => { 
                if (xhr.total > 0) {
                    console.log((xhr.loaded / xhr.total * 100).toFixed(0) + '% loaded');
                } else {
                    console.log("Loading model...");
                }
            },
            (error) => {
                console.warn("Could not load local model. Using fallback Cube.", error);
                createFallbackCube();
            }
        );
        
        // ... (rest of createFallbackCube remains the same) ...

        // ... (rest of Scroll Tracking remains the same) ...

        // ... (rest of Animation Loop remains the same) ...

        // ... (rest of animate function remains the same) ...
        
        // --- 6. NAVIGATION SCROLL FIX (REPLACING OLD CODE) ---
        // This fixes the offset issue and works reliably on GitHub Pages by waiting for the DOM.
        document.addEventListener("DOMContentLoaded", function() {
            
            const navLinks = document.querySelectorAll('nav a');
            
            // Console check to verify links are found
            console.log(`Found ${navLinks.length} navigation links.`);

            navLinks.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault(); // STOP the default anchor jump
                    
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Calculate offset to center the element
                        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    } else {
                        console.warn(`Target element #${targetId} not found!`);
                    }
                });
            });
        });
        
        animate(); // Ensure animate is called outside the DOMContentLoaded event if it wasn't already.
