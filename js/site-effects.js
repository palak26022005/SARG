(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initSectionCubes() {
        if (prefersReducedMotion || !window.THREE) {
            return;
        }

        const sectionTargets = document.querySelectorAll('.hero, .page-header, .section, .cta-section, .footer');
        const scenes = [];

        sectionTargets.forEach((section, index) => {
            if (section.querySelector('.sarg-section-cube')) {
                return;
            }

            const mount = document.createElement('div');
            mount.className = 'sarg-section-cube';
            section.prepend(mount);

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            mount.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
            camera.position.z = 9;

            const cubeGroup = new THREE.Group();
            scene.add(cubeGroup);

            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(3.2, 3.2, 3.2),
                new THREE.MeshBasicMaterial({
                    color: index % 2 === 0 ? 0xffffff : 0x9fd0ff,
                    wireframe: true,
                    transparent: true,
                    opacity: section.classList.contains('section-dark') ? 0.22 : 0.14
                })
            );

            const innerCube = new THREE.Mesh(
                new THREE.BoxGeometry(1.8, 1.8, 1.8),
                new THREE.MeshBasicMaterial({
                    color: 0x6ef3b2,
                    wireframe: true,
                    transparent: true,
                    opacity: section.classList.contains('section-dark') ? 0.14 : 0.1
                })
            );

            cubeGroup.add(cube);
            cubeGroup.add(innerCube);

            const ambientOffsetX = index % 2 === 0 ? 2.8 : -2.8;
            const ambientOffsetY = index % 3 === 0 ? 1.1 : -1.1;

            function setSize() {
                const rect = section.getBoundingClientRect();
                const width = Math.max(rect.width, 320);
                const height = Math.max(rect.height, 220);

                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                cubeGroup.position.x = ambientOffsetX;
                cubeGroup.position.y = ambientOffsetY;
            }

            setSize();

            scenes.push({
                section,
                renderer,
                scene,
                camera,
                cube,
                innerCube,
                cubeGroup,
                speed: 0.0007 + index * 0.00003
            });
        });

        function resizeAll() {
            scenes.forEach(({ section, renderer, camera, cubeGroup }, index) => {
                const rect = section.getBoundingClientRect();
                const width = Math.max(rect.width, 320);
                const height = Math.max(rect.height, 220);

                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                cubeGroup.position.x = index % 2 === 0 ? 2.8 : -2.8;
                cubeGroup.position.y = index % 3 === 0 ? 1.1 : -1.1;
            });
        }

        function animate(time) {
            scenes.forEach(({ renderer, scene, camera, cube, innerCube, cubeGroup, speed, section }, index) => {
                const scrollFactor = window.scrollY * 0.00012;
                cube.rotation.x += speed;
                cube.rotation.y += speed * 1.35;
                innerCube.rotation.x -= speed * 1.1;
                innerCube.rotation.z += speed * 1.5;
                cubeGroup.rotation.z = Math.sin(time * 0.00035 + index) * 0.12;
                cubeGroup.position.y = (index % 3 === 0 ? 1.1 : -1.1) + Math.sin(time * 0.00045 + index) * 0.18 + scrollFactor;

                const rect = section.getBoundingClientRect();
                const isVisible = rect.bottom > -120 && rect.top < window.innerHeight + 120;

                if (isVisible) {
                    renderer.render(scene, camera);
                }
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeAll);
        requestAnimationFrame(animate);
    }

    function initNavbarState() {
        const navbar = document.getElementById('navbar');
        if (!navbar || !document.body.classList.contains('home-page')) {
            return;
        }

        const updateNavbar = () => {
            const isScrolled = window.scrollY > 48;
            navbar.classList.toggle('sarg-nav-scrolled', isScrolled);
            navbar.classList.toggle('scrolled', isScrolled);
        };

        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    function initGsapMotion() {
        if (!window.gsap || !window.ScrollTrigger) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const revealSelectors = [
            '.page-header-content > *',
            '.hero-content > *',
            '.hero-visual',
            '.section-header',
            '.about-intro-content',
            '.about-intro-image',
            '.research-intro-content',
            '.research-intro-image',
            '.programs-intro-content',
            '.programs-intro-image',
            '.membership-intro-content',
            '.membership-intro-image',
            '.contact-form-info',
            '.contact-form-container',
            '.benefits-content',
            '.benefits-visual',
            '.cta-content',
            '.footer-grid > *',
            '.footer-bottom',
            '.testimonial-card',
            '.wwd-card',
            '.vm-card',
            '.value-card',
            '.affiliation-card',
            '.research-focus-card',
            '.workshop-card',
            '.emphasis-card',
            '.collaboration-item',
            '.training-program-item',
            '.testing-feature',
            '.internship-card',
            '.academic-card',
            '.flagship-card',
            '.duration-card',
            '.partnership-card',
            '.service-item',
            '.plan-card',
            '.category-card',
            '.program-card',
            '.custom-project-card',
            '.faq-item',
            '.faq-card',
            '.contact-info-card',
            '.inquiry-card',
            '.social-card',
            '.contact-detail-item',
            '.applicant-card'
        ].join(', ');

        const revealElements = gsap.utils.toArray(revealSelectors);

        revealElements.forEach((element, index) => {
            element.classList.add('sarg-gsap-ready');

            gsap.to(element, {
                opacity: 1,
                y: 0,
                clearProps: 'transform',
                duration: 0.9,
                delay: index % 4 === 0 ? 0 : (index % 4) * 0.05,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%'
                }
            });
        });

        gsap.utils.toArray('.hero-bg img, .hero-video-bg video, .page-header-bg img').forEach((media) => {
            gsap.fromTo(media, {
                scale: 1.08,
                y: -20
            }, {
                scale: 1,
                y: 28,
                ease: 'none',
                scrollTrigger: {
                    trigger: media.closest('.hero, .page-header'),
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        gsap.utils.toArray('.floating-card, .floating-badge, .experience-badge, .research-stats-badge').forEach((card, index) => {
            gsap.to(card, {
                y: index % 2 === 0 ? -12 : 12,
                duration: 2.8 + index * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    }

    function initFallbackReveal() {
        if (window.gsap || prefersReducedMotion) {
            return;
        }

        document.querySelectorAll('.section-header, .cta-content, .research-focus-card, .wwd-card, .internship-card, .plan-card').forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('sarg-has-effects');
        initSectionCubes();
        initNavbarState();
        initGsapMotion();
        initFallbackReveal();
    });
})();
