import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        500 / 500,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff);
      renderer.setSize(500, 500);
      renderer.setPixelRatio(window.devicePixelRatio);

      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 2;

      const geometry = new THREE.SphereGeometry();
      const mapImg = new THREE.TextureLoader().load("./uvMap.jpg")
      const material = new THREE.MeshBasicMaterial({ map: mapImg });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphere.rotation.y = 23.5 * (Math.PI / 180);
      sphere.rotation.x = 23.5 * (Math.PI / 180);

      const renderScene = () => {
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      renderScene();
      return () => {
        containerRef.current?.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
