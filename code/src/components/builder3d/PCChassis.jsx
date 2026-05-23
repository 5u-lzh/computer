import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Edges } from '@react-three/drei';
import { useBuild } from '../../context/BuildContext';
import { useRGBAnim } from './RGBEffect';
import { getPart } from '../../utils/compatibility';
import { calcTemperatures, tempToColor } from '../../utils/thermal';

/* ====================== 单零件泛光组件 ====================== */
function GlowBox({ position, size, color, emissiveIntensity = 0.8, visible = false, label = '' }) {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.material.emissiveIntensity = emissiveIntensity + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  if (!visible) return null;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
        <Edges color={color} threshold={15} />
      </mesh>

      {/* 悬浮标签 */}
      {hovered && label && (
        <Html distanceFactor={8} center>
          <div className="px-2 py-1 rounded text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(10,10,11,0.85)',
              border: `1px solid ${color}`,
              color: color,
              boxShadow: `0 0 10px ${color}40`,
            }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ====================== RGB 风扇 ====================== */
function RGBFan({ position, color, powered = false, intensity = 1 }) {
  const groupRef = useRef();
  const speed = powered ? 3 : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group position={position}>
      {/* 外框 */}
      <mesh>
        <torusGeometry args={[1.4, 0.12, 8, 24]} />
        <meshPhysicalMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} envMapIntensity={0.4} />
      </mesh>

      {/* 发光内圈 */}
      <mesh>
        <torusGeometry args={[1.1, 0.06, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={(powered ? 1.2 : 0.2) * intensity}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 扇叶 */}
      <group ref={groupRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI * 2) / 6]}>
            <boxGeometry args={[0.08, 1.0, 0.02]} />
            <meshPhysicalMaterial
              color={powered ? color : '#353436'}
              emissive={powered ? color : '#000000'}
              emissiveIntensity={(powered ? 0.6 : 0) * intensity}
              transparent
              opacity={(powered ? 0.7 : 0.3) * intensity}
              metalness={0.2}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* 中心盖 */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 12]} />
        <meshStandardMaterial color="#353436" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ====================== 内存 RGB 条 ====================== */
function RAMStick({ position, color, intensity = 1, part }) {
  if (!part) return null;
  // 高端条更高大，带更多RGB细节
  const isHighEnd = part.pf >= 85;
  const isMidRange = part.pf >= 75;
  const height = isHighEnd ? 2.0 : isMidRange ? 1.7 : 1.4;
  const rgbHeight = isHighEnd ? 0.6 : isMidRange ? 0.45 : 0.3;
  const rgbWidth = isHighEnd ? 0.25 : 0.22;
  const heatsinkColor = part.name.includes('芝奇') ? '#1a1a2e' :
    part.name.includes('海盗船') ? '#1a1a1a' : '#1a2a1e';

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.3, height, 0.1]} />
        <meshPhysicalMaterial color={heatsinkColor} metalness={0.7} roughness={0.3} envMapIntensity={0.4} />
      </mesh>
      {/* RGB 发光区域 */}
      <mesh position={[0, height / 2 - 0.15, 0]}>
        <boxGeometry args={[rgbWidth, rgbHeight, 0.08]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8 * intensity}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {/* 高端条额外顶部装饰 */}
      {isHighEnd && (
        <mesh position={[0, height / 2 + 0.02, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.08]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== 主板 ====================== */
function Motherboard3D({ color, intensity = 1, part }) {
  if (!part) return null;
  const isAmd = part.socket === 'AM5';
  const isHighEnd = part.pf >= 85;
  const pcbColor = isAmd ? '#0d0d18' : '#0d1a0d';
  const accentColor = isAmd ? '#ff6600' : '#0055ff';
  const size = isHighEnd ? [8.5, 0.15, 6.5] : [8, 0.15, 6];

  return (
    <group>
      {/* PCB */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={size} />
        <meshPhysicalMaterial color={pcbColor} metalness={0.5} roughness={0.6} envMapIntensity={0.3} />
      </mesh>
      {/* CPU 插槽底座 */}
      <mesh position={[0, -0.22, 0.8]}>
        <boxGeometry args={[1.6, 0.02, 1.6]} />
        <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* CPU 插槽针脚装饰 */}
      <mesh position={[0, -0.2, 0.8]}>
        <boxGeometry args={[1.2, 0.01, 1.2]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* 内存插槽 x2 */}
      <mesh position={[2.2, -0.22, 0.8]}>
        <boxGeometry args={[0.8, 0.03, 0.1]} />
        <meshPhysicalMaterial color="#353436" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[2.7, -0.22, 0.8]}>
        <boxGeometry args={[0.8, 0.03, 0.1]} />
        <meshPhysicalMaterial color="#353436" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* PCIe x16 插槽 */}
      <mesh position={[0, -0.22, -1.0]}>
        <boxGeometry args={[5, 0.02, 0.12]} />
        <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* 芯片组散热片 */}
      <mesh position={[0, -0.22, -1.8]}>
        <boxGeometry args={[0.6, 0.03, 0.6]} />
        <meshPhysicalMaterial color={accentColor} metalness={0.8} roughness={0.3} envMapIntensity={0.3} />
      </mesh>
      {/* M.2 插槽 */}
      <mesh position={[-2.5, -0.22, 1.5]}>
        <boxGeometry args={[0.5, 0.02, 0.2]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* 装饰线 */}
      {[-2.5, 0, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 0, -2]}>
          <boxGeometry args={[0.03, 0.01, 3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1 * intensity} opacity={0.3} transparent />
        </mesh>
      ))}
      {/* 高端板全盔甲覆盖 */}
      {isHighEnd && (
        <mesh position={[0, -0.22, 0.5]}>
          <boxGeometry args={[7, 0.01, 2]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} transparent opacity={0.3} envMapIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== CPU ====================== */
function CPU3D({ color, intensity = 1, part, temp }) {
  if (!part) return null;
  const isIntel = part.name.includes('Intel');
  const isAmd = part.name.includes('AMD');
  const tier = part.pf >= 90 ? 'high' : part.pf >= 80 ? 'mid' : 'low';
  const size = tier === 'high' ? 1.2 : tier === 'mid' ? 1.0 : 0.9;
  const ihsColor = isIntel ? '#c0c0c0' : '#c8a050';
  const smallMarkColor = isIntel ? '#a0a0a0' : '#b89040';

  // 温度色：高温时核心发光从 RGB → 橙红
  const glowColor = temp && temp > 60 ? tempToColor(temp, 100) : color;
  const glowIntensity = temp && temp > 60 ? 0.6 + (temp - 60) / 100 : 0.6;

  return (
    <group position={[0, 0.1, 0]}>
      {/* IHS */}
      <mesh>
        <boxGeometry args={[size, 0.08, size]} />
        <meshPhysicalMaterial color={ihsColor} metalness={1.0} roughness={0.05} envMapIntensity={1.0} />
      </mesh>
      {/* 核心发光 */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[size * 0.65, 0.04, size * 0.65]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={glowIntensity * intensity}
        />
      </mesh>
      {/* 温度指示边框（高温时亮起） */}
      {temp && temp > 70 && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[size + 0.06, 0.005, size + 0.06]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={Math.min((temp - 70) / 30, 0.6)} />
        </mesh>
      )}
      {/* Intel：顶部刻字条纹 / AMD：金色切角标记 */}
      {isIntel && (
        <mesh position={[-size * 0.3, 0.05, -size * 0.3]}>
          <boxGeometry args={[size * 0.15, 0.01, size * 0.15]} />
          <meshBasicMaterial color="#888" transparent opacity={0.3} />
        </mesh>
      )}
      {isAmd && (
        <mesh position={[size * 0.3, 0.05, size * 0.3]}>
          <boxGeometry args={[size * 0.08, 0.01, size * 0.08]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.4} />
        </mesh>
      )}
      {/* 顶盖边缘装饰（高端才有） */}
      {tier === 'high' && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[size + 0.04, 0.005, size + 0.04]} />
          <meshBasicMaterial color={ihsColor} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== 散热器 ====================== */
function Cooler3D({ color, powered, intensity = 1, part }) {
  const lcdRef = useRef();

  useFrame((state) => {
    if (lcdRef.current && powered) {
      lcdRef.current.material.emissiveIntensity = (0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3) * intensity;
    }
  });

  if (!part) return null;
  const isAio = part.spec.includes('水冷');
  const isHighEnd = part.pf >= 85;
  const isAirCooler = !isAio;

  if (isAirCooler) {
    // 风冷：双塔结构
    return (
      <group position={[0, 1.2, 0]}>
        {/* 底座 */}
        <mesh>
          <boxGeometry args={[1.4, 0.1, 1.0]} />
          <meshPhysicalMaterial color="#353436" metalness={0.9} roughness={0.2} envMapIntensity={0.5} />
        </mesh>
        {/* 双塔散热鳍片 */}
        {[-0.45, 0.45].map((xOff) => (
          <group key={xOff}>
            {[0, 1, 2, 3, 4, 5].map((j) => (
              <mesh key={j} position={[xOff, 0.2 + j * 0.12, 0]}>
                <boxGeometry args={[0.5, 0.02, 0.8]} />
                <meshPhysicalMaterial
                  color="#2a2a2e"
                  metalness={0.8}
                  roughness={0.3}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            ))}
          </group>
        ))}
        {/* 风扇 */}
        <mesh position={[0, 0.3, 0.5]}>
          <torusGeometry args={[0.5, 0.06, 6, 16]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.3, -0.5]}>
          <torusGeometry args={[0.5, 0.06, 6, 16]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    );
  }

  // 水冷：冷头 + 水管
  const pumpSize = isHighEnd ? 1.6 : 1.3;
  return (
    <group position={[0, 1.2, 0]}>
      {/* 冷头方块 */}
      <mesh>
        <boxGeometry args={[pumpSize, 0.3, pumpSize]} />
        <meshPhysicalMaterial color="#0a0a0b" metalness={0.9} roughness={0.1} envMapIntensity={0.5} clearcoat={0.3} />
      </mesh>
      {/* LCD 屏幕 */}
      <mesh ref={lcdRef} position={[0, 0.18, 0]}>
        <boxGeometry args={[pumpSize * 0.75, 0.05, pumpSize * 0.75]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={(powered ? 0.6 : 0.1) * intensity}
        />
      </mesh>
      {/* 水管 */}
      <mesh position={[-pumpSize * 0.3, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.3 * intensity} transparent opacity={0.6} metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[pumpSize * 0.3, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.3 * intensity} transparent opacity={0.6} metalness={0.3} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ====================== 显卡（真实几何细节） ====================== */
function GPU3D({ color, powered, intensity = 1, part, temp }) {
  const stripRef = useRef();
  const fanRef = useRef();

  useFrame((state) => {
    if (stripRef.current && powered) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      stripRef.current.material.emissiveIntensity = pulse * logoIntensity * intensity;
      if (temp && temp > 55) {
        stripRef.current.material.color.set(glowColor);
        stripRef.current.material.emissive.set(glowColor);
      }
    }
    if (fanRef.current && powered) {
      fanRef.current.rotation.z += 0.08;
    }
  });

  if (!part) return null;
  const isNvidia = part.name.includes('NVIDIA');
  const isAmd = part.name.includes('AMD');
  const isWhite = part.name.includes('RX 7900 XTX');
  const tier = part.pf >= 90 ? 'high' : part.pf >= 80 ? 'mid' : 'low';

  const len = tier === 'high' ? 5.4 : tier === 'mid' ? 4.8 : 4.0;
  const thick = tier === 'high' ? 0.45 : tier === 'mid' ? 0.35 : 0.25;
  const coolerColor = isWhite ? '#d0d0d8' : '#2a2a2a';
  const pcbColor = isNvidia ? '#0a0808' : '#080c10';
  const logoColor = isNvidia ? '#ff506e' : isWhite ? '#ffffff' : '#ff6600';
  const glowColor = temp && temp > 55 ? tempToColor(temp, 85) : logoColor;
  const logoIntensity = temp && temp > 55 ? 1.0 + (temp - 55) / 30 : 1.0;
  const finCount = tier === 'high' ? 32 : tier === 'mid' ? 24 : 16;

  return (
    <group position={[0, -1.8, 0]}>
      {/* ===== PCB 底板 ===== */}
      <mesh>
        <boxGeometry args={[len, 0.12, 0.8]} />
        <meshPhysicalMaterial color={pcbColor} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* PCB 金手指装饰 */}
      <mesh position={[len / 2 + 0.05, 0, 0]}>
        <boxGeometry args={[0.08, 0.06, 0.3]} />
        <meshBasicMaterial color="#c8a050" transparent opacity={0.6} />
      </mesh>
      {/* PCIe 供电接口 */}
      <mesh position={[-len / 2 + 0.1, 0.08, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.3]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* ===== VRAM 显存芯片 ===== */}
      {[-1.5, -0.5, 0.5, 1.5].map((xOff) => (
        <mesh key={xOff} position={[xOff, 0.08, 0.35]}>
          <boxGeometry args={[0.2, 0.04, 0.12]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>
      ))}
      {[-1.5, -0.5, 0.5, 1.5].map((xOff) => (
        <mesh key={`b-${xOff}`} position={[xOff, 0.08, -0.35]}>
          <boxGeometry args={[0.2, 0.04, 0.12]} />
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* ===== 散热鳍片阵列 ===== */}
      <group position={[0.2, 0.18, 0]}>
        {Array.from({ length: finCount }, (_, i) => (
          <mesh key={i} position={[i * 0.12 - (finCount * 0.12) / 2, 0, 0]}>
            <boxGeometry args={[0.01, thick - 0.05, 0.55]} />
            <meshPhysicalMaterial
              color={coolerColor}
              metalness={0.9}
              roughness={0.2}
              envMapIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* ===== 热管 ===== */}
      {coolerColor !== '#d0d0d8' && (
        <>
          <mesh position={[-0.3, 0.15, 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, thick, 6]} rotation={[Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial color="#c0a050" metalness={1.0} roughness={0.3} />
          </mesh>
          <mesh position={[-0.3, 0.15, -0.3]}>
            <cylinderGeometry args={[0.02, 0.02, thick, 6]} rotation={[Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial color="#c0a050" metalness={1.0} roughness={0.3} />
          </mesh>
        </>
      )}

      {/* ===== 风扇导流罩 ===== */}
      <mesh position={[-0.5, 0.25, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.7]} />
        <meshPhysicalMaterial color={coolerColor} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* ===== 风扇 ===== */}
      <group position={[-0.5, 0.28, 0]}>
        <mesh>
          <torusGeometry args={[0.5, 0.06, 8, 20]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} envMapIntensity={0.3} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.35, 0.03, 6, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={(powered ? 0.8 : 0.1) * intensity}
            transparent
            opacity={0.6}
          />
        </mesh>
        <group ref={fanRef}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 9]}>
              <boxGeometry args={[0.03, 0.4, 0.06]} />
              <meshPhysicalMaterial
                color={powered ? color : '#353436'}
                emissive={powered ? color : '#000000'}
                emissiveIntensity={(powered ? 0.4 : 0) * intensity}
                transparent
                opacity={(powered ? 0.6 : 0.2) * intensity}
              />
            </mesh>
          ))}
        </group>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 10]} />
          <meshPhysicalMaterial color="#353436" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ===== 背板 ===== */}
      <mesh position={[0.2, -0.08, 0.45]}>
        <boxGeometry args={[len - 0.6, 0.02, 0.01]} />
        <meshPhysicalMaterial color={pcbColor} metalness={0.8} roughness={0.3} envMapIntensity={0.3} />
      </mesh>

      {/* ===== 发光标志 ===== */}
      <mesh ref={stripRef} position={[0.5, 0.4 + thick / 2, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.25]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={(powered ? logoIntensity : 0.2) * intensity}
        />
      </mesh>

      {/* 霓虹灯带 */}
      <mesh position={[0.2, -0.15, 0.45]}>
        <boxGeometry args={[len - 0.8, 0.04, 0.04]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={(powered ? 1.2 : 0.1) * intensity}
        />
      </mesh>

      {/* 高温指示线 */}
      {temp && temp > 65 && (
        <mesh position={[0.2, 0.1, 0.45]}>
          <boxGeometry args={[len - 1.0, 0.02, 0.02]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={Math.min((temp - 65) / 20, 0.5)} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== 电源 ====================== */
function PSU3D({ color, intensity = 1, part }) {
  if (!part) return null;
  const isHighEnd = part.pf >= 90;
  const isMidRange = part.pf >= 80;
  const size = isHighEnd ? [2.8, 0.85, 2.0] : isMidRange ? [2.5, 0.8, 1.8] : [2.2, 0.75, 1.6];
  const bodyColor = part.name.includes('海韵') ? '#0a0a14' :
    part.name.includes('ROG') ? '#0d0c12' : '#121214';

  return (
    <group position={[3.5, -2.5, 1.5]}>
      <mesh>
        <boxGeometry args={size} />
        <meshPhysicalMaterial color={bodyColor} metalness={0.85} roughness={0.2} envMapIntensity={0.6} />
      </mesh>
      {/* 电源风扇 */}
      <mesh position={[0, size[1] / 2 + 0.01, 0]}>
        <torusGeometry args={[size[0] * 0.25, 0.04, 6, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12 * intensity} />
      </mesh>
      {/* 高端电源 OLED 屏幕 */}
      {isHighEnd && (
        <mesh position={[size[0] / 2 + 0.01, 0, 0]}>
          <planeGeometry args={[0.08, 0.08]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== 硬盘 ====================== */
function Storage3D({ color, intensity = 1, part }) {
  if (!part) return null;
  const isHighEnd = part.pf >= 85;
  const isMidRange = part.pf >= 80;
  const driveColor = part.name.includes('三星') ? '#0a1a2e' :
    part.name.includes('西数') ? '#1a1a1a' : '#0d1a0d';

  return (
    <group position={[4, 0, 0]}>
      {/* SSD 主体 */}
      <mesh>
        <boxGeometry args={[1.2, 0.4, 0.6]} />
        <meshPhysicalMaterial color={driveColor} metalness={0.8} roughness={0.2} envMapIntensity={0.5} />
      </mesh>
      {/* 散热片 */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[isHighEnd ? 1.0 : 0.8, 0.05, 0.4]} />
        <meshPhysicalMaterial color="#353436" metalness={1.0} roughness={0.1} envMapIntensity={0.6} />
      </mesh>
      {/* 高端 SSD 额外 RGB 装饰 */}
      {isHighEnd && (
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.6, 0.01, 0.1]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

/* ====================== 机箱框架 ====================== */
function CaseFrame({ color, powered, intensity = 1 }) {
  const w = 8, h = 5, d = 4;

  return (
    <group>
      {/* 机箱内部环境光 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w - 0.8, h - 0.6, d - 0.4]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={(powered ? 0.06 : 0.01) * intensity}
          side={2}
        />
      </mesh>
      {/* 玻璃面板 — meshPhysicalMaterial 真实玻璃感 */}
      <mesh position={[0, 0, d / 2 + 0.02]}>
        <planeGeometry args={[w - 0.5, h - 0.5]} />
        <meshPhysicalMaterial
          color={powered ? color : '#88aacc'}
          transparent
          opacity={0.18 * intensity}
          roughness={0.02}
          metalness={0}
          envMapIntensity={0.8}
          ior={1.5}
          side={2}
        />
      </mesh>

      {/* 玻璃面板 - 背面 */}
      <mesh position={[0, 0, -d / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w - 0.5, h - 0.5]} />
        <meshPhysicalMaterial
          color="#88aacc"
          transparent
          opacity={0.08 * intensity}
          roughness={0.02}
          metalness={0}
          envMapIntensity={0.5}
          ior={1.5}
          side={2}
        />
      </mesh>

      {/* 机箱骨架 */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshPhysicalMaterial
          color="#141418"
          metalness={0.7}
          roughness={0.5}
          transparent
          opacity={0.35 * intensity}
        />
      </mesh>

      {/* 发光边框 */}
      <Edges color={color} threshold={15}>
        <meshBasicMaterial transparent opacity={(powered ? 0.45 : 0.15) * intensity} />
      </Edges>

      {/* 底部 RGB 灯带 */}
      <mesh position={[0, -h / 2 + 0.05, d / 2 - 0.2]}>
        <boxGeometry args={[w - 1, 0.03, 0.05]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={(powered ? 3 : 0.3) * intensity}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* ===== 前面板 I/O ===== */}
      <group position={[0, -h / 2 + 0.8, d / 2 + 0.05]}>
        {/* I/O 面板底座 */}
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[0.6, 0.3, 0.06]} />
          <meshPhysicalMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* 电源按钮 */}
        <mesh position={[2.5, 0, 0.05]}>
          <circleGeometry args={[0.08, 12]} />
          <meshBasicMaterial color={powered ? color : '#555'} />
        </mesh>
        {/* USB 接口 */}
        {[-0.1, 0.1].map((yOff, i) => (
          <mesh key={i} position={[2.5, yOff, 0.04]}>
            <boxGeometry args={[0.06, 0.04, 0.02]} />
            <meshBasicMaterial color="#333" />
          </mesh>
        ))}
      </group>

      {/* ===== 机箱脚垫 ===== */}
      {[-3, 3].map((xOff) => (
        <mesh key={xOff} position={[xOff, -h / 2 - 0.05, 1.5]}>
          <boxGeometry args={[0.3, 0.05, 0.3]} />
          <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
      {[-3, 3].map((xOff) => (
        <mesh key={xOff} position={[xOff, -h / 2 - 0.05, -1.5]}>
          <boxGeometry args={[0.3, 0.05, 0.3]} />
          <meshPhysicalMaterial color="#222" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ====================== 主组件 ====================== */
export default function PCChassis({ powered }) {
  const { build } = useBuild();
  const { color, intensity } = useRGBAnim();

  const cpu = getPart('cpu', build.cpu);
  const gpu = getPart('gpu', build.gpu);
  const mem = getPart('memory', build.memory);
  const mb = getPart('motherboard', build.motherboard);
  const cooler = getPart('cooler', build.cooler);
  const psu = getPart('psu', build.psu);
  const storage = getPart('storage', build.storage);

  // 热力学计算
  const temps = calcTemperatures(build);
  const cpuTemp = powered ? temps.cpu.load : temps.cpu.idle;
  const gpuTemp = powered ? temps.gpu.load : temps.gpu.idle;
  const cpuGlowColor = powered && cpuTemp > 60 ? tempToColor(cpuTemp, 100) : color;
  const gpuGlowColor = powered && gpuTemp > 60 ? tempToColor(gpuTemp, 85) : color;

  // 水冷散热器（机箱顶部）
  const isWaterCooler = cooler?.spec?.includes('水冷');
  const w = 8, h = 5, d = 4;

  return (
    <group>
      <CaseFrame color={color} intensity={intensity} powered={powered} />

      {/* 水冷散热器（机箱顶部） */}
      {isWaterCooler && (
        <group position={[0, h / 2 + 0.05, 0]}>
          {/* 散热器外壳 */}
          <mesh>
            <boxGeometry args={[6.5, 0.08, 3.0]} />
            <meshPhysicalMaterial color="#141418" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* 散热鳍片 */}
          <group position={[0, 0.06, 0]}>
            {Array.from({ length: 20 }, (_, i) => (
              <mesh key={i} position={[i * 0.28 - 2.8, 0, 0]}>
                <boxGeometry args={[0.01, 0.04, 2.6]} />
                <meshPhysicalMaterial color="#2a2a2e" metalness={0.8} roughness={0.3} transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
          {/* 顶部风扇 x2 */}
          {[-1.5, 1.5].map((xOff) => (
            <group key={xOff} position={[xOff, 0.1, 0]}>
              <mesh>
                <torusGeometry args={[0.6, 0.05, 6, 18]} />
                <meshPhysicalMaterial color="#1a1a2e" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh>
                <torusGeometry args={[0.4, 0.02, 5, 12]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 主板 */}
      <Motherboard3D color={color} intensity={intensity} part={mb} />

      {/* CPU */}
      <CPU3D color={color} intensity={intensity} part={cpu} temp={powered ? cpuTemp : null} />

      {/* 水冷 */}
      <Cooler3D color={color} intensity={intensity} part={cooler} powered={powered} />

      {/* 内存 x2 */}
      <RAMStick position={[1.8, 0.35, 0.8]} color={color} intensity={intensity} part={mem} />
      <RAMStick position={[2.2, 0.35, 0.8]} color={color} intensity={intensity} part={mem} />

      {/* 显卡 */}
      <GPU3D color={color} intensity={intensity} part={gpu} powered={powered} temp={powered ? gpuTemp : null} />

      {/* 底部风扇 x3 */}
      <RGBFan position={[-2, -2.3, 0]} color={color} intensity={intensity} powered={powered} />
      <RGBFan position={[0, -2.3, 0]} color={color} intensity={intensity} powered={powered} />
      <RGBFan position={[2, -2.3, 0]} color={color} intensity={intensity} powered={powered} />

      {/* 电源 */}
      <PSU3D color={color} intensity={intensity} part={psu} />

      {/* 硬盘 */}
      <Storage3D color={color} intensity={intensity} part={storage} />
    </group>
  );
}

export { GlowBox, RGBFan, Motherboard3D, CPU3D, Cooler3D, GPU3D, PSU3D, RAMStick };
