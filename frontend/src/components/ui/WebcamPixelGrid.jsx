import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WebcamPixelGrid() {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, mesh, stream;
    let animationId;

    const init = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      scene = new THREE.Scene();

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera = new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0.1,
        10
      );
      camera.position.z = 1;

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(2, 2, 60, 40);

      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
        },
        vertexShader: `
          varying vec2 vUv;
          uniform sampler2D uTexture;

          void main() {
            vUv = uv;
            vec4 color = texture2D(uTexture, uv);
            float brightness = (color.r + color.g + color.b) / 3.0;
            vec3 newPosition = position;
            newPosition.z += brightness * 0.4;
            gl_Position = vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D uTexture;

          void main() {
            vec4 color = texture2D(uTexture, vUv);
            gl_FragColor = vec4(color.rgb * 0.85, 1.0);
          }
        `,
        wireframe: false,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
