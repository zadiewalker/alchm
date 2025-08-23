// ALCHM IKIGAI Visual Map Component
// Interactive purpose mapping with React Flow and cultural theming

'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  useReactFlow,
  Panel,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  IKIGAIAIMap,
  VisualElement,
  ConnectionStrength,
  IKIGAICluster,
  AIInsight,
  CulturalAdaptation
} from '@/types/ikigai-schema';
import { CulturalContext } from '@/types/pathways-schema';

export interface IKIGAIMapProps {
  aiMap: IKIGAIAIMap;
  interactive: boolean;
  showInsights: boolean;
  culturalTheme: string;
  onElementClick?: (element: VisualElement) => void;
  onConnectionExplore?: (connection: ConnectionStrength) => void;
  animationEnabled: boolean;
  height?: string;
  width?: string;
  userId?: string;
}

// Custom Node Components
const ClusterNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`cluster-node ${selected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        ...data.style,
        minWidth: data.size?.width || 120,
        minHeight: data.size?.height || 120,
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered 
          ? '0 8px 24px rgba(0,0,0,0.3)' 
          : '0 4px 12px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => data.onElementClick?.(data.element)}
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      
      {/* Cultural pattern overlay */}
      <div 
        className="cultural-pattern"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: getCulturalPattern(data.culturalTheme),
          backgroundSize: 'cover',
          borderRadius: '50%'
        }}
      />
      
      {/* Main content */}
      <div className="cluster-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: 'bold',
          color: data.style.color,
          marginBottom: '4px'
        }}>
          {data.label}
        </h3>
        
        <div style={{
          fontSize: '11px',
          opacity: 0.9,
          color: data.style.color,
          lineHeight: 1.2
        }}>
          {data.cluster.elements.length} elements
        </div>
        
        {/* Coherence indicator */}
        <div 
          className="coherence-indicator"
          style={{
            marginTop: '8px',
            width: '40px',
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${data.cluster.coherenceScore * 100}%`,
              height: '100%',
              backgroundColor: data.style.color,
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        
        {isHovered && (
          <div
            className="cluster-tooltip"
            style={{
              position: 'absolute',
              top: '110%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            {data.cluster.description.substring(0, 60)}...
          </div>
        )}
      </div>
    </div>
  );
};

const ElementNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getElementIcon = (type: string) => {
    const icons = {
      passion: '❤️',
      skill: '⚡',
      value: '🌟',
      opportunity: '🚀'
    };
    return icons[type as keyof typeof icons] || '◯';
  };
  
  const getElementColor = (type: string) => {
    const colors = {
      passion: '#e74c3c',
      skill: '#3498db',
      value: '#2ecc71',
      opportunity: '#f39c12'
    };
    return colors[type as keyof typeof colors] || '#95a5a6';
  };
  
  return (
    <div
      className={`element-node ${data.type} ${selected ? 'selected' : ''}`}
      style={{
        backgroundColor: getElementColor(data.type),
        color: 'white',
        border: '2px solid rgba(255,255,255,0.8)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isHovered 
          ? '0 4px 16px rgba(0,0,0,0.3)' 
          : '0 2px 8px rgba(0,0,0,0.2)',
        minWidth: '80px',
        textAlign: 'center',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => data.onElementClick?.(data.element)}
    >
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>{getElementIcon(data.type)}</span>
        <span>{data.label}</span>
      </div>
      
      {isHovered && (
        <div
          className="element-tooltip"
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          Click to explore
        </div>
      )}
    </div>
  );
};

const InsightNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div
      className={`insight-node ${selected ? 'selected' : ''}`}
      style={{
        backgroundColor: 'rgba(155, 89, 182, 0.9)',
        color: 'white',
        border: '2px solid rgba(255,255,255,0.6)',
        borderRadius: '12px',
        padding: '12px',
        fontSize: '11px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        maxWidth: isExpanded ? '300px' : '180px',
        minHeight: '60px',
        boxShadow: '0 4px 12px rgba(155, 89, 182, 0.3)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      
      <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}>
        💡 {data.insight.title}
      </div>
      
      <div style={{ 
        opacity: 0.9, 
        lineHeight: 1.3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: isExpanded ? 'none' : 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {data.insight.description}
      </div>
      
      {!isExpanded && (
        <div style={{ 
          marginTop: '4px', 
          fontSize: '10px', 
          opacity: 0.7 
        }}>
          Click to expand...
        </div>
      )}
    </div>
  );
};

// Helper function to get cultural patterns
function getCulturalPattern(culturalTheme: string): string {
  const patterns: Record<string, string> = {
    'east_asian': 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="white"/%3E%3C/svg%3E")',
    'latin_american': 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="10" cy="10" r="8" fill="none" stroke="white" stroke-width="2"/%3E%3C/svg%3E")',
    'african': 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0L20 0L20 20L0 20Z" fill="none" stroke="white" stroke-width="1"/%3E%3C/svg%3E")',
    'indigenous': 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M10 2L18 10L10 18L2 10Z" fill="white"/%3E%3C/svg%3E")',
    'universal': ''
  };
  
  return patterns[culturalTheme] || patterns.universal;
}

// Main IKIGAI Map Component
const IKIGAIMapInner: React.FC<IKIGAIMapProps> = ({
  aiMap,
  interactive,
  showInsights,
  culturalTheme,
  onElementClick,
  onConnectionExplore,
  animationEnabled,
  height = '600px',
  width = '100%'
}) => {
  const { fitView, getViewport } = useReactFlow();
  
  // Convert IKIGAI AI Map to React Flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Add cluster nodes
    aiMap.clusters.forEach((cluster, index) => {
      const angle = (2 * Math.PI * index) / aiMap.clusters.length;
      const radius = 250;
      const centerX = 400;
      const centerY = 300;
      
      nodes.push({
        id: cluster.id,
        type: 'cluster',
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        },
        data: {
          cluster,
          label: cluster.name,
          style: {
            backgroundColor: getClusterColor(cluster, culturalTheme),
            color: '#ffffff',
            borderColor: darkenColor(getClusterColor(cluster, culturalTheme), 0.2),
            borderWidth: 2
          },
          size: {
            width: 120 + (cluster.developmentPotential * 40),
            height: 120 + (cluster.developmentPotential * 40)
          },
          culturalTheme,
          onElementClick,
          element: {
            id: cluster.id,
            type: 'cluster',
            data: cluster
          }
        },
        draggable: interactive
      });
    });
    
    // Add insight nodes if enabled
    if (showInsights) {
      aiMap.insights.slice(0, 4).forEach((insight, index) => {
        nodes.push({
          id: `insight_${insight.id}`,
          type: 'insight',
          position: {
            x: 100 + (index * 200),
            y: 100
          },
          data: {
            insight,
            label: insight.title,
            onElementClick
          },
          draggable: interactive
        });
      });
    }
    
    // Add connection edges
    aiMap.connectionStrengths
      .filter(conn => conn.strength > 0.6)
      .forEach(connection => {
        edges.push({
          id: `edge_${connection.fromId}_${connection.toId}`,
          source: connection.fromId,
          target: connection.toId,
          type: 'smoothstep',
          style: {
            stroke: getConnectionColor(connection.strength),
            strokeWidth: Math.max(2, connection.strength * 6),
            opacity: 0.7
          },
          data: {
            connection,
            onConnectionExplore
          },
          animated: animationEnabled && connection.strength > 0.8
        });
      });
    
    return { nodes, edges };
  }, [aiMap, showInsights, culturalTheme, interactive, animationEnabled, onElementClick, onConnectionExplore]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Custom node types
  const nodeTypes = useMemo(() => ({
    cluster: ClusterNode,
    element: ElementNode,
    insight: InsightNode
  }), []);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Auto-fit view on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.1 });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fitView]);
  
  // Cultural theme styles
  const getCulturalBackgroundStyle = (theme: string) => {
    const styles: Record<string, any> = {
      'east_asian': {
        background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f1419 100%)'
      },
      'latin_american': {
        background: 'radial-gradient(circle, #2d1b69 0%, #11100b 50%, #0a0a0a 100%)'
      },
      'african': {
        background: 'radial-gradient(circle, #3c1810 0%, #1a0f0a 50%, #0a0505 100%)'
      },
      'indigenous': {
        background: 'radial-gradient(circle, #1a4d3a 0%, #0f2118 50%, #050a07 100%)'
      },
      'universal': {
        background: 'radial-gradient(circle, #1a1a1a 0%, #111111 50%, #000000 100%)'
      }
    };
    
    return styles[theme] || styles.universal;
  };
  
  return (
    <div 
      style={{ 
        height, 
        width, 
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        ...getCulturalBackgroundStyle(culturalTheme)
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color={culturalTheme === 'universal' ? '#333' : '#444'} 
          gap={20} 
          size={1}
        />
        
        <Controls 
          position="top-right"
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        />
        
        <MiniMap 
          position="bottom-right"
          style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
          nodeColor={(node) => {
            if (node.type === 'cluster') return node.data.style.backgroundColor;
            if (node.type === 'insight') return '#9b59b6';
            return '#95a5a6';
          }}
        />
        
        <Panel position="top-left">
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            🎯 Your IKIGAI Life Purpose Map
          </div>
        </Panel>
        
        <Panel position="bottom-left">
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '12px'
          }}>
            <div>🔴 Clusters: {aiMap.clusters.length}</div>
            <div>🔗 Connections: {aiMap.connectionStrengths.length}</div>
            {showInsights && <div>💡 Insights: {aiMap.insights.length}</div>}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrapper component with ReactFlowProvider
export const IKIGAIMap: React.FC<IKIGAIMapProps> = (props) => {
  return (
    <ReactFlowProvider>
      <IKIGAIMapInner {...props} />
    </ReactFlowProvider>
  );
};

// Helper functions
function getClusterColor(cluster: IKIGAICluster, culturalTheme: string): string {
  const baseColors = {
    'passion': '#e74c3c',
    'skill': '#3498db',
    'value': '#2ecc71',
    'opportunity': '#f39c12',
    'intersection': '#9b59b6'
  };
  
  const baseColor = baseColors[cluster.type] || '#95a5a6';
  
  // Apply cultural color adaptations
  return adaptColorForCulture(baseColor, culturalTheme);
}

function adaptColorForCulture(baseColor: string, culturalTheme: string): string {
  const culturalAdaptations: Record<string, Record<string, string>> = {
    'east_asian': {
      '#e74c3c': '#d73527', // Deeper red
      '#3498db': '#2980b9', // Deeper blue
      '#2ecc71': '#27ae60', // Deeper green
      '#f39c12': '#e67e22', // Deeper orange
      '#9b59b6': '#8e44ad'  // Deeper purple
    },
    'latin_american': {
      '#e74c3c': '#ff6b35', // Warm red-orange
      '#3498db': '#4ecdc4', // Turquoise
      '#2ecc71': '#45b7d1', // Bright blue-green
      '#f39c12': '#f39c12', // Keep orange
      '#9b59b6': '#e74c3c'  // Warm red
    },
    'african': {
      '#e74c3c': '#d35400', // Earth orange
      '#3498db': '#2c3e50', // Deep blue-gray
      '#2ecc71': '#f39c12', // Warm orange
      '#f39c12': '#e67e22', // Deeper orange
      '#9b59b6': '#8e44ad'  // Keep purple
    },
    'indigenous': {
      '#e74c3c': '#c0392b', // Earth red
      '#3498db': '#2980b9', // Deep blue
      '#2ecc71': '#27ae60', // Forest green
      '#f39c12': '#d68910', // Earth yellow
      '#9b59b6': '#7d3c98'  // Earth purple
    }
  };
  
  const adaptations = culturalAdaptations[culturalTheme];
  return adaptations?.[baseColor] || baseColor;
}

function getConnectionColor(strength: number): string {
  if (strength > 0.8) return '#27ae60'; // Strong - green
  if (strength > 0.6) return '#f39c12'; // Medium - orange
  return '#95a5a6'; // Weak - gray
}

function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  
  const r = Math.max(0, (num >> 16) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 0x00FF) * (1 - amount));
  const b = Math.max(0, (num & 0x0000FF) * (1 - amount));
  
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

export default IKIGAIMap;