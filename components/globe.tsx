import React, { FC, useRef, useEffect, useState } from "react";
import * as THREE from "three";

export const ThreeScene: FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    isDown: false,
    spinSpeed: { x: 0, y: 0 },
  });
  const sphere = useRef<THREE.Mesh | null>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, 500 / 500, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff);
      renderer.setSize(500, 500);
      renderer.setPixelRatio(window.devicePixelRatio);

      containerRef.current.appendChild(renderer.domElement);
      camera.position.z = 2;

      const geometry = new THREE.SphereGeometry();
      const mapImg = new THREE.TextureLoader().load("./uvMap.jpg");
      const material = new THREE.MeshBasicMaterial({ map: mapImg });
      sphere.current = new THREE.Mesh(geometry, material);
      scene.add(sphere.current);
      sphere.current.rotation.y = 23.5 * (Math.PI / 180);
      sphere.current.rotation.x = 23.5 * (Math.PI / 180);

      const onDocumentMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        mouse.current.isDown = true;
        mouse.current.startX = event.clientX;
        mouse.current.startY = event.clientY;
      };

      const onDocumentMouseMove = (event: MouseEvent) => {
        if (mouse.current.isDown && sphere.current) {
          const deltaX = event.clientX - mouse.current.startX;
          const deltaY = event.clientY - mouse.current.startY;

          mouse.current.spinSpeed.x = deltaX * 0.01;
          mouse.current.spinSpeed.y = deltaY * 0.01;

          sphere.current.rotation.y += mouse.current.spinSpeed.x;
          sphere.current.rotation.x += mouse.current.spinSpeed.y;

          mouse.current.startX = event.clientX;
          mouse.current.startY = event.clientY;
        }
      };

      const onDocumentMouseUp = () => {
        mouse.current.isDown = false;
      };

      document.addEventListener("mousedown", onDocumentMouseDown, false);
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      document.addEventListener("mouseup", onDocumentMouseUp, false);

      const renderScene = () => {
        if (!mouse.current.isDown && sphere.current) {
          sphere.current.rotation.y += mouse.current.spinSpeed.x;
          sphere.current.rotation.x += mouse.current.spinSpeed.y;
          const minSpinSpeed = 0.005;

          if (Math.abs(mouse.current.spinSpeed.x) > minSpinSpeed) {
            mouse.current.spinSpeed.x *= 0.97;
          } else {
            mouse.current.spinSpeed.x =
              Math.sign(mouse.current.spinSpeed.x) * minSpinSpeed;
          }

          if (Math.abs(mouse.current.spinSpeed.y) > minSpinSpeed) {
            mouse.current.spinSpeed.y *= 0.97;
          } else {
            mouse.current.spinSpeed.y =
              Math.sign(mouse.current.spinSpeed.y) * minSpinSpeed;
          }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      renderScene();

      return () => {
        containerRef.current?.removeChild(renderer.domElement);
        document.removeEventListener("mousedown", onDocumentMouseDown);
        document.removeEventListener("mousemove", onDocumentMouseMove);
        document.removeEventListener("mouseup", onDocumentMouseUp);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={isDragging ? "cursor-grabbing" : "cursor-grab"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};

export default ThreeScene;
