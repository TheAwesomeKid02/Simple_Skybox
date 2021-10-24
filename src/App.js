import React, { useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
import {
  CubeCamera,
  CubeTextureLoader,
  LinearMipMapLinearFilter,
  RGBFormat,
  WebGLCubeRenderTarget
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./styles.css";

extend({ OrbitControls });

const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
      enableZoom={true}
    />
  );
};

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  const texture = loader.load([
    "/negx.jpg",
    "/posx.jpg",
    "/posy.jpg",
    "/negy.jpg",
    "/negz.jpg",
    "/posz.jpg"
  ]);
  scene.background = texture;
  return null;
}

function Sphere() {
  const { scene, gl } = useThree();
  const cubeRenderTarget = new WebGLCubeRenderTarget(1024, {
    format: RGBFormat,
    generateMipmaps: true,
    minFilter: LinearMipMapLinearFilter
  });
  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  cubeCamera.position.set(0, 0, 0);
  scene.add(cubeCamera);

  useFrame(() => cubeCamera.update(gl, scene));

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        envMap={cubeCamera.renderTarget.texture}
        color="white"
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <Sphere />
      <SkyBox />
      <CameraControls />
    </Canvas>
  );
}
