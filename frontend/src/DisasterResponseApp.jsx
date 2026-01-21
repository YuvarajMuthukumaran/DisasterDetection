import React, { useState, useRef } from 'react';
import { 
  Upload, Camera, AlertTriangle, Shield, MapPin, Clock, Phone, Users, Activity,
  CheckCircle, XCircle, Loader, Zap, Eye, Brain
} from 'lucide-react';

// Component to hold all the CSS styles
const AppStyles = () => (
  <style>{`
    /* 1. FONT IMPORT */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* 2. CSS VARIABLES (THEMING) */
    :root {
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      
      --radius: 0.75rem;
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);

      /* Light Theme */
      --color-background: #f8fafc; /* gray-50 */
      --color-foreground: #020817; /* gray-950 */
      --color-card: #ffffff;
      --color-card-foreground: #020817;
      --color-muted: #f1f5f9; /* gray-100 */
      --color-muted-foreground: #64748b; /* gray-500 */
      --color-border: #e2e8f0; /* gray-200 */
      --color-input: #e2e8f0;

      --color-primary: #2563eb;
      --color-primary-foreground: #f8fafc;
      --color-danger: #dc2626;
      --color-danger-foreground: #f8fafc;
      --color-success: #16a34a;
      --color-success-foreground: #f8fafc;
      
      --color-accent-red: #fef2f2;
      --color-accent-red-fg: #b91c1c;
      --color-accent-yellow: #fefce8;
      --color-accent-yellow-fg: #a16207;
      --color-accent-green: #f0fdf4;
      --color-accent-green-fg: #15803d;
      --color-accent-blue: #eff6ff;
      --color-accent-blue-fg: #1d4ed8;
      --color-accent-orange: #fff7ed;
      --color-accent-orange-fg: #c2410c;
      --color-accent-purple: #faf5ff;
      --color-accent-purple-fg: #7e22ce;
    }

    /* Dark Theme */
    [data-theme='dark'] {
      --color-background: #020817;
      --color-foreground: #f8fafc;
      --color-card: #0f172a; /* slate-900 */
      --color-card-foreground: #f8fafc;
      --color-muted: #1e293b; /* slate-800 */
      --color-muted-foreground: #94a3b8; /* slate-400 */
      --color-border: #334155; /* slate-700 */
      --color-input: #334155;
      
      --color-primary: #3b82f6; /* blue-500 */
      --color-primary-foreground: #f8fafc;
      --color-danger: #ef4444; /* red-500 */
      --color-danger-foreground: #f8fafc;
      --color-success: #22c55e; /* green-500 */
      --color-success-foreground: #f8fafc;

      --color-accent-red: #2f1313;
      --color-accent-red-fg: #fca5a5;
      --color-accent-yellow: #322509;
      --color-accent-yellow-fg: #fde047;
      --color-accent-green: #0f2418;
      --color-accent-green-fg: #86efac;
      --color-accent-blue: #17213a;
      --color-accent-blue-fg: #93c5fd;
      --color-accent-orange: #351a0a;
      --color-accent-orange-fg: #fdba74;
      --color-accent-purple: #281b3b;
      --color-accent-purple-fg: #d8b4fe;
    }

    /* 3. GLOBAL & UTILITY STYLES */
    body {
      margin: 0;
      font-family: var(--font-sans);
      background-color: var(--color-background);
      color: var(--color-foreground);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .app-container {
      min-height: 100vh;
      background-image: radial-gradient(circle at top left, var(--color-accent-blue), transparent 30%),
                        radial-gradient(circle at bottom right, var(--color-accent-red), transparent 30%);
    }

    .hidden { display: none; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }

    .icon-xs { width: 1rem; height: 1rem; }
    .icon-sm { width: 1.25rem; height: 1.25rem; }
    .icon-md { width: 1.5rem; height: 1.5rem; }
    .icon-lg { width: 4rem; height: 4rem; }

    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }

    /* 4. LAYOUT & COMPONENTS */
    /* Header */
    .header {
      background-color: color-mix(in srgb, var(--color-card) 70%, transparent);
      backdrop-filter: blur(8px);
      box-shadow: var(--shadow-md);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .header-content {
      max-width: 80rem; margin: 0 auto; padding: 1rem 1.5rem;
      display: flex; align-items: center; justify-content: space-between;
    }
    .header-title-group { display: flex; align-items: center; gap: 1rem; }
    .header-icon-wrapper {
      background-color: var(--color-danger); color: var(--color-danger-foreground);
      padding: 0.75rem; border-radius: 9999px; display: grid; place-items: center;
    }
    .header-icon { width: 2rem; height: 2rem; }
    .header-title {
      font-size: 1.5rem; font-weight: 700; color: var(--color-card-foreground); margin: 0;
    }
    .header-subtitle { color: var(--color-muted-foreground); margin-top: 0.25rem; font-size: 0.875rem; }
    .header-actions { display: flex; align-items: center; gap: 1rem; }

    /* System Health Badge */
    .system-health-badge {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.875rem;
    }
    .health-healthy { background-color: var(--color-accent-green); color: var(--color-accent-green-fg); }
    .health-error { background-color: var(--color-accent-red); color: var(--color-accent-red-fg); }
    .health-checking { background-color: var(--color-accent-yellow); color: var(--color-accent-yellow-fg); }

    /* Main Content */
    .main-content { max-width: 80rem; margin: 0 auto; padding: 2rem 1.5rem; }
    .main-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
    @media (min-width: 1024px) {
      .main-grid { grid-template-columns: repeat(3, 1fr); }
      .left-panel { grid-column: span 2 / span 2; }
    }

    /* Cards */
    .card {
      background-color: var(--color-card); color: var(--color-card-foreground);
      border-radius: var(--radius); box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
      overflow: hidden; transition: all 0.2s ease-in-out;
    }
    .results-card {
      background-color: var(--color-card); padding: 1.5rem;
      border-radius: var(--radius); box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
    }
    .placeholder-card {
      background-color: var(--color-muted); border: 1px dashed var(--color-border);
      border-radius: var(--radius); padding: 2rem; text-align: center;
    }
    .error-card {
      background-color: var(--color-accent-red); border: 1px solid var(--color-danger);
      color: var(--color-accent-red-fg); border-radius: var(--radius); padding: 1.5rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .error-card-title { font-size: 1.125rem; font-weight: 600; margin: 0; }
    .error-card-message { margin-top: 0.25rem; opacity: 0.9; }

    /* Tabs */
    .tab-nav-container { border-bottom: 1px solid var(--color-border); }
    .tab-nav { display: flex; gap: 2rem; padding: 0 1.5rem; }
    .tab-button {
      padding: 1rem 0.25rem; border-bottom: 2px solid transparent;
      font-weight: 500; font-size: 0.875rem; background: none; border-top: none;
      border-left: none; border-right: none; cursor: pointer; color: var(--color-muted-foreground);
      display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease;
    }
    .tab-button:hover { color: var(--color-foreground); border-color: var(--color-border); }
    .tab-button.active { border-color: var(--color-primary); color: var(--color-primary); }
    .tab-content { padding: 1.5rem; }

    /* Upload Area */
    .upload-area {
      border: 2px dashed var(--color-border); border-radius: var(--radius);
      padding: 2rem; text-align: center; transition: all 0.2s ease;
      cursor: pointer; background-color: var(--color-muted);
    }
    .upload-area:hover {
      border-color: var(--color-primary); background-color: var(--color-accent-blue);
    }
    .image-preview {
      max-width: 100%; max-height: 24rem; margin: 0 auto;
      border-radius: calc(var(--radius) - 4px); box-shadow: var(--shadow-md);
    }
    .upload-area-icon {
      width: 3rem; height: 3rem; color: var(--color-muted-foreground);
      margin-bottom: 1rem;
    }
    .upload-area-text {
      font-size: 1.125rem; font-weight: 600; color: var(--color-foreground); margin: 0;
    }
    .upload-area-subtext {
      color: var(--color-muted-foreground); margin-top: 0.5rem; font-size: 0.875rem;
    }

    /* Camera View */
    .camera-viewfinder {
      position: relative; background-color: #000; border-radius: var(--radius);
      overflow: hidden; border: 1px solid var(--color-border);
    }
    .camera-video { width: 100%; height: auto; display: block; }
    .camera-overlay {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      background-color: rgba(0,0,0,0.6);
    }
    .camera-overlay-content { text-align: center; color: white; }

    /* Buttons */
    .button {
      padding: 0.6rem 1rem; border-radius: 0.5rem; font-weight: 500;
      transition: all 0.2s ease-in-out; border: none; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .button:active:not(:disabled) { transform: translateY(-1px); }
    .button:disabled { background-color: var(--color-muted); color: var(--color-muted-foreground); cursor: not-allowed; }
    
    .btn-primary { background-color: var(--color-primary); color: var(--color-primary-foreground); }
    .btn-success { background-color: var(--color-success); color: var(--color-success-foreground); }
    .btn-danger { background-color: var(--color-danger); color: var(--color-danger-foreground); }
    
    .btn-secondary {
        background-color: var(--color-muted);
        color: var(--color-muted-foreground);
        border: 1px solid var(--color-border);
    }
    .btn-secondary:hover:not(:disabled) {
        background-color: var(--color-border);
        color: var(--color-foreground);
    }
    
    .btn-ghost { background: transparent; color: var(--color-muted-foreground); }
    .btn-ghost:hover { background: var(--color-muted); color: var(--color-foreground); }


    .analysis-buttons-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-top: 1.5rem;}
    @media (min-width: 640px) { .analysis-buttons-grid { grid-template-columns: repeat(3, 1fr); } }

    /* Results Panel */
    .results-card-header {
      display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
      padding-bottom: 1rem; border-bottom: 1px solid var(--color-border);
    }
    .results-card-title { font-size: 1.25rem; font-weight: 600; margin: 0; }
    .info-row { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; }
    .info-label { font-weight: 500; color: var(--color-muted-foreground); }
    .info-value { font-weight: 600; color: var(--color-foreground); }

    /* Badges */
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.875rem; }
    .badge-red { background-color: var(--color-accent-red); color: var(--color-accent-red-fg); }
    .severity-high { background-color: var(--color-accent-red); color: var(--color-accent-red-fg); }
    .severity-medium { background-color: var(--color-accent-yellow); color: var(--color-accent-yellow-fg); }
    .severity-low { background-color: var(--color-accent-green); color: var(--color-accent-green-fg); }

    .priority-badge { border: 1px solid; }
    .priority-immediate { background-color: var(--color-accent-red); color: var(--color-accent-red-fg); border-color: color-mix(in srgb, var(--color-accent-red-fg) 25%, transparent); }
    .priority-urgent { background-color: var(--color-accent-orange); color: var(--color-accent-orange-fg); border-color: color-mix(in srgb, var(--color-accent-orange-fg) 25%, transparent); }
    .priority-standard { background-color: var(--color-accent-blue); color: var(--color-accent-blue-fg); border-color: color-mix(in srgb, var(--color-accent-blue-fg) 25%, transparent); }

    /* Object List */
    .object-list-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.75rem; background-color: var(--color-muted); border-radius: 0.5rem;
    }
    .object-list { max-height: 12rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; }
    .object-confidence { font-size: 0.875rem; color: var(--color-muted-foreground); }
    
    /* Emergency Response Details */
    .response-details { display: flex; flex-direction: column; gap: 1rem; }
    .response-subtitle { font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .response-list { list-style-type: none; padding: 0; margin: 0 0 0 0.5rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; }
    .response-list-item { display: flex; align-items: flex-start; gap: 0.75rem; color: var(--color-muted-foreground); }
    .bullet { margin-top: 0.2rem; line-height: 1; flex-shrink: 0; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 50;
    }
    .modal-content {
      background: var(--color-card); padding: 2rem; border-radius: var(--radius);
      box-shadow: var(--shadow-lg); position: relative; max-width: 500px;
      width: 90%; border: 1px solid var(--color-border);
    }
    .modal-close-button {
      position: absolute; top: 0.75rem; right: 0.75rem; background: transparent;
      border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-muted-foreground);
    }
    .modal-content h2 { margin-top: 0; color: var(--color-foreground); }
    .modal-content p { color: var(--color-muted-foreground); }
  `}</style>
);

const DisasterResponseApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [systemHealth, setSystemHealth] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  // Check system health on component mount
  React.useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
      setSystemHealth({ status: 'error', error: 'Backend not available' });
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysisResult(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStream(stream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      // NOTE: In a real app, replace alert() with a custom modal or notification component.
      alert('Camera access failed. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setAnalysisResult(null);
        stopCamera();
        setActiveTab('upload');
      }, 'image/jpeg', 0.8);
    }
  };

  const analyzeImage = async (analysisType = 'analyze') => {
    if (!selectedFile) {
      // NOTE: In a real app, replace alert() with a custom modal or notification component.
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/${analysisType}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        error: 'Analysis failed. Please check if the backend server is running.',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-default';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'immediate': return 'priority-immediate';
      case 'urgent': return 'priority-urgent';
      case 'standard': return 'priority-standard';
      default: return 'priority-default';
    }
  };
  
  return (
    <>
      <AppStyles />
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="header-title-group">
              <div className="header-icon-wrapper">
                <Shield className="header-icon" />
              </div>
              <div>
                <h1 className="header-title">
                  AI Disaster Response System
                </h1>
                <p className="header-subtitle">
                  Real-time disaster detection and emergency response
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="header-actions">
              <div className="system-health-container">
                {systemHealth ? (
                  <div className={`system-health-badge ${
                    systemHealth.status === 'healthy' 
                      ? 'health-healthy' 
                      : 'health-error'
                  }`}>
                    {systemHealth.status === 'healthy' ? (
                      <CheckCircle className="icon-sm" />
                    ) : (
                      <XCircle className="icon-sm" />
                    )}
                    <span className="font-medium">
                      {systemHealth.status === 'healthy' ? 'System Online' : 'System Offline'}
                    </span>
                  </div>
                ) : (
                  <div className="system-health-badge health-checking">
                    <Loader className="icon-sm animate-spin" />
                    <span>Checking...</span>
                  </div>
                )}
              </div>
              <button onClick={() => setIsAboutModalOpen(true)} className="button about-button">
                About Dev
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="main-grid">
            {/* Left Panel - Image Upload & Analysis */}
            <div className="left-panel">
              <div className="card">
                {/* Tab Navigation */}
                <div className="tab-nav-container">
                  <nav className="tab-nav">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
                    >
                      <Upload className="icon-sm" />
                      Upload Image
                    </button>
                    <button
                      onClick={() => setActiveTab('camera')}
                      className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
                    >
                      <Camera className="icon-sm" />
                      Camera Capture
                    </button>
                  </nav>
                </div>

                <div className="tab-content">
                  {activeTab === 'upload' ? (
                    /* Upload Tab */
                    <div>
                      <div 
                        className="upload-area"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        {previewUrl ? (
                          <div className="image-preview-container">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="image-preview"
                            />
                            <p className="upload-area-subtext">
                              Click to select a different image
                            </p>
                          </div>
                        ) : (
                          <div className="upload-area-placeholder">
                            <Upload className="upload-area-icon" />
                            <div>
                              <p className="upload-area-text">
                                Upload Disaster Image
                              </p>
                              <p className="upload-area-subtext">
                                Click here or drag and drop an image to analyze
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Camera Tab */
                    <div className="camera-tab-container">
                      <div className="camera-viewfinder">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="camera-video"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {!cameraActive && (
                          <div className="camera-overlay">
                            <div className="camera-overlay-content">
                              <Camera className="camera-overlay-icon" />
                              <p className="camera-overlay-text">Camera Not Active</p>
                              <p className="camera-overlay-subtext">Click start camera to begin</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="camera-controls">
                        {!cameraActive ? (
                          <button
                            onClick={startCamera}
                            className="button btn-primary"
                          >
                            <Camera className="icon-sm" />
                            <span>Start Camera</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={capturePhoto}
                              className="button btn-success"
                            >
                              <Camera className="icon-sm" />
                              <span>Capture Photo</span>
                            </button>
                            <button
                              onClick={stopCamera}
                              className="button btn-danger"
                            >
                              Stop Camera
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Analysis Buttons */}
                  {selectedFile && (
                    <div className="analysis-buttons-container">
                      <div className="analysis-buttons-grid">
                        <button
                          onClick={() => analyzeImage('analyze')}
                          disabled={loading}
                          className="button btn-danger"
                        >
                          {loading ? <Loader className="icon-sm animate-spin" /> : <Zap className="icon-sm" />}
                          <span>Full Analysis</span>
                        </button>
                        
                        <button
                          onClick={() => analyzeImage('classify')}
                          disabled={loading}
                          className="button btn-primary"
                        >
                          <Brain className="icon-sm" />
                          <span>Classify Only</span>
                        </button>
                        
                        <button
                          onClick={() => analyzeImage('detect')}
                          disabled={loading}
                          className="button btn-success"
                        >
                          <Eye className="icon-sm" />
                          <span>Detect Objects</span>
                        </button>
                      </div>
                      
                      {loading && (
                        <div className="loading-indicator">
                          <div className="loading-indicator-content">
                            <Loader className="icon-md animate-spin" />
                            <span className="font-medium">Analyzing image...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="right-panel">
              {analysisResult ? (
                analysisResult.error ? (
                  <div className="error-card">
                    <div className="error-card-content">
                      <XCircle className="error-card-icon" />
                      <div>
                        <h3 className="error-card-title">Analysis Failed</h3>
                        <p className="error-card-message">{analysisResult.error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="results-container">
                    {/* Disaster Classification */}
                    {analysisResult.disaster_classification && (
                      <div className="results-card">
                        <div className="results-card-header">
                          <AlertTriangle className="icon-md text-red-600" />
                          <h3 className="results-card-title">Disaster Classification</h3>
                        </div>
                        
                        <div className="results-card-body">
                          <div className="info-row">
                            <span className="info-label">Type:</span>
                            <span className="badge badge-red">
                              {analysisResult.disaster_classification.predicted_class}
                            </span>
                          </div>
                          
                          <div className="info-row">
                            <span className="info-label">Confidence:</span>
                            <span className="info-value">
                              {(analysisResult.disaster_classification.confidence * 100).toFixed(1)}%
                            </span>
                          </div>

                          {analysisResult.severity_assessment && (
                            <div className="info-row">
                              <span className="info-label">Severity:</span>
                              <span className={`badge ${getSeverityClass(analysisResult.severity_assessment.level)}`}>
                                {analysisResult.severity_assessment.level}
                              </span>
                            </div>
                          )}

                          {analysisResult.severity_assessment && (
                            <div className="info-row">
                              <span className="info-label">Priority:</span>
                               <span className={`badge priority-badge ${getPriorityClass(analysisResult.severity_assessment.priority)}`}>
                                {analysisResult.severity_assessment.priority}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Object Detection Results */}
                    {analysisResult.object_detection?.detected_objects && (
                      <div className="results-card">
                        <div className="results-card-header">
                          <Eye className="icon-md text-blue-600" />
                          <h3 className="results-card-title">Objects Detected</h3>
                        </div>
                        
                        {analysisResult.object_detection.detected_objects.length > 0 ? (
                          <div className="object-list">
                            {analysisResult.object_detection.detected_objects.map((obj, index) => (
                              <div key={index} className="object-list-item">
                                <span className="font-medium">{obj.class}</span>
                                <span className="object-confidence">
                                  {(obj.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-results-text">No objects detected</p>
                        )}
                      </div>
                    )}

                    {/* Emergency Response */}
                    {analysisResult.emergency_response && (
                      <div className="results-card">
                        <div className="results-card-header">
                          <Shield className="icon-md text-green-600" />
                          <h3 className="results-card-title">Emergency Response</h3>
                        </div>
                        
                        <div className="results-card-body response-details">
                          {analysisResult.emergency_response.immediate_actions && (
                            <div>
                              <h4 className="response-subtitle text-red-600">
                                <Clock className="icon-xs" />
                                Immediate Actions
                              </h4>
                              <ul className="response-list">
                                {analysisResult.emergency_response.immediate_actions.map((action, index) => (
                                  <li key={index} className="response-list-item">
                                    <span className="bullet text-red-500">•</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysisResult.emergency_response.evacuation_zones && (
                            <div>
                              <h4 className="response-subtitle text-orange-600">
                                <MapPin className="icon-xs" />
                                Evacuation Zones
                              </h4>
                              <ul className="response-list">
                                {analysisResult.emergency_response.evacuation_zones.map((zone, index) => (
                                  <li key={index} className="response-list-item">
                                     <span className="bullet text-orange-500">•</span>
                                    <span>{zone}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                           {analysisResult.emergency_response.emergency_contacts && (
                            <div>
                              <h4 className="response-subtitle text-blue-600">
                                <Phone className="icon-xs" />
                                Emergency Contacts
                              </h4>
                              <ul className="response-list">
                                {analysisResult.emergency_response.emergency_contacts.map((contact, index) => (
                                  <li key={index} className="response-list-item">
                                     <span className="bullet text-blue-500">•</span>
                                    <span>{contact}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysisResult.emergency_response.resources_needed && (
                            <div>
                              <h4 className="response-subtitle text-purple-600">
                                <Users className="icon-xs" />
                                Resources Needed
                              </h4>
                              <ul className="response-list">
                                {analysisResult.emergency_response.resources_needed.map((resource, index) => (
                                  <li key={index} className="response-list-item">
                                     <span className="bullet text-purple-500">•</span>
                                    <span>{resource}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {analysisResult.severity_assessment?.risk_factors && (
                      <div className="results-card">
                         <div className="results-card-header">
                          <Activity className="icon-md text-yellow-600" />
                          <h3 className="results-card-title">Risk Factors</h3>
                        </div>
                        <ul className="response-list">
                          {analysisResult.severity_assessment.risk_factors.map((risk, index) => (
                            <li key={index} className="response-list-item">
                              <span className="bullet text-yellow-500">⚠</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="placeholder-card">
                  <Activity className="placeholder-icon" />
                  <h3 className="placeholder-title">Ready for Analysis</h3>
                  <p className="placeholder-text">
                    Upload an image or capture from camera to begin disaster analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* About Dev Modal */}
        {isAboutModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAboutModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setIsAboutModalOpen(false)} className="modal-close-button">
                &times;
              </button>
              <h2>About the Developer</h2>
              <p>
                <h2>Dev1:</h2>
                <p>     Name : Yuvaraj M</p>
                <p>     Roll No : 312322104312</p>
                <p>     College :- St.Joseph's College of Engineering</p>
              </p>
              <p>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DisasterResponseApp;

