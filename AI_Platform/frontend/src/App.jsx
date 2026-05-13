import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Leaf, Camera, UploadCloud, ChevronRight,
  Activity, ShieldCheck, Zap, Menu, X, CheckCircle2,
  AlertCircle, ArrowRight, ScanLine, Sprout
} from 'lucide-react';
import './index.css';

const cropsData = [
  { slug: 'apple', name: 'Apple', image: 'https://post.healthline.com/wp-content/uploads/2020/09/Do_Apples_Affect_Diabetes_and_Blood_Sugar_Levels-732x549-thumbnail-1-732x549.jpg', diseases: ['Apple scab', 'Black rot', 'Cedar apple rust', 'healthy'] },
  { slug: 'blueberry', name: 'Blueberry', image: 'https://www.supermarketperimeter.com/ext/resources/0430-blueberries.png?t=1588260305&width=1080', diseases: ['healthy'] },
  { slug: 'cherry', name: 'Cherry', image: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/health_benefits_of_cherries_slideshow/1800x1200_health_benefits_of_cherries_slideshow.jpg', diseases: ['Powdery mildew', 'healthy'] },
  { slug: 'corn', name: 'Corn', image: '/corn.jpg', diseases: ['Cercospora leaf spot', 'Common rust', 'Northern Leaf Blight', 'healthy'] },
  { slug: 'grape', name: 'Grape', image: 'https://i.ndtvimg.com/i/2015-09/grapes_625x350_61443376353.jpg', diseases: ['Black rot', 'Esca', 'Leaf blight', 'healthy'] },
  { slug: 'orange', name: 'Orange', image: '/orange.jpg', diseases: ['Haunglongbing'] },
  { slug: 'peach', name: 'Peach', image: 'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/articles/health_tools/the_health_benefits_of_peaches_slideshow/thinkstock_rf_peaches.jpg?resize=650px:*', diseases: ['Bacterial spot', 'healthy'] },
  { slug: 'pepper-bell', name: 'Pepper bell', image: '/pepper-bell.jpg', diseases: ['Bacterial spot', 'healthy'] },
  { slug: 'potato', name: 'Potato', image: 'https://m.economictimes.com/thumb/height-450,width-600,imgsize-111140,msid-72862126/potato-getty.jpg', diseases: ['Early blight', 'Late blight', 'healthy'] },
  { slug: 'raspberry', name: 'Raspberry', image: 'https://i0.wp.com/cdn-prod.medicalnewstoday.com/content/images/articles/326/326272/raspberries-with-ketones-in-a-bowl.jpg?w=1155&h=1541', diseases: ['healthy'] },
  { slug: 'soybean', name: 'Soybean', image: 'https://m.economictimes.com/thumb/msid-66988154,width-1200,height-900,resizemode-4,imgsize-211276/soyabean-agencies.jpg', diseases: ['healthy'] },
  { slug: 'squash', name: 'Squash', image: 'https://post.healthline.com/wp-content/uploads/2020/08/squash-fruit-or-vegetable-732x549-thumbnail-732x549.jpg', diseases: ['Powdery mildew'] },
  { slug: 'strawberry', name: 'Strawberry', image: 'https://images.indianexpress.com/2020/02/strawberry-1200.jpg', diseases: ['Leaf scorch', 'healthy'] },
  { slug: 'tomato', name: 'Tomato', image: 'https://images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg', diseases: ['Bacterial spot', 'Early blight', 'Late blight', 'Leaf Mold', 'Target Spot', 'Yellow Leaf Curl', 'healthy'] }
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const InteractiveButton = ({ children, className, onClick, ...props }) => {
  const btnRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.setProperty('--x', `${x}px`);
    btnRef.current.style.setProperty('--y', `${y}px`);
  };
  return (
    <motion.button ref={btnRef} onMouseMove={handleMouseMove} whileTap={{ scale: 0.98 }} onClick={onClick} className={`btn-premium ${className}`} {...props}>
      {children}
    </motion.button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel-light shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="bg-slate-900 p-2.5 rounded-xl transition-colors">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">PlantScope</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Overview</Link>
            <Link to="/index" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Diagnostic Engine</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.5-1.4 6.5-7a4.6 4.6 0 0 0-1.39-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.35-3.5 1.3a11.6 11.6 0 0 0-6.4 0C6.7 2.15 5.6 2.5 5.6 2.5a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 8.9c0 5.6 3.3 6.6 6.5 7a4.8 4.8 0 0 0-1 3.02V22" /><path d="M9 20c-5 1.5-5-2.5-7-3" /></svg>
            </a>
            <Link to="/index" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-slate-700">
              Launch App
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden shadow-xl">
            <div className="px-4 py-6 space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-lg font-bold text-slate-700 bg-slate-50 rounded-2xl">Overview</Link>
              <Link to="/index" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-lg font-bold text-white bg-slate-900 rounded-2xl">Launch Engine</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FloatingElement = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-15, 15, -15] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    className={`absolute ${className}`}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen bg-mesh-light pt-32 pb-20 overflow-hidden relative">
      <FloatingElement className="top-40 left-10 md:left-32 opacity-60" delay={0}>
        <div className="w-48 h-48 bg-emerald-200/50 rounded-full blur-[60px]"></div>
      </FloatingElement>
      <FloatingElement className="top-80 right-10 md:right-32 opacity-40" delay={1.5}>
        <div className="w-64 h-64 bg-slate-300/40 rounded-full blur-[80px]"></div>
      </FloatingElement>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero Section */}
        <motion.div style={{ opacity }} className="text-center max-w-5xl mx-auto mb-40 relative">

          <motion.div style={{ y: y2 }} className="hidden md:flex absolute -left-16 top-20 glass-card-dark px-5 py-4 rounded-3xl items-center gap-4 animate-float shadow-2xl border-slate-700">
            <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-500/30"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div>
            <div className="text-left"><p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Accuracy</p><p className="text-xl font-black text-white">98.4%</p></div>
          </motion.div>

          <motion.div style={{ y: y1 }} className="hidden md:flex absolute -right-12 bottom-10 glass-card-light px-5 py-4 rounded-3xl items-center gap-4 animate-float-delayed shadow-xl">
            <div className="bg-slate-900 p-3 rounded-full"><Zap className="w-6 h-6 text-emerald-400" /></div>
            <div className="text-left"><p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Inference</p><p className="text-xl font-black text-slate-900">&lt; 100ms</p></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest mb-10 shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Model Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-8"
          >
            Diagnose Crops. <br className="hidden md:block" />
            <span className="text-gradient">With AI Precision.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium"
          >
            The is a computer vision platform for agriculture. Upload a leaf, instantly detect 39 distinct diseases, and secure your yield with absolute certainty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-5"
          >
            <Link to="/index">
              <InteractiveButton className="w-full sm:w-auto bg-slate-900 text-white font-bold px-10 py-5 rounded-full text-lg shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 border border-slate-700">
                <ScanLine className="w-6 h-6 text-emerald-400" /> Start Engine
              </InteractiveButton>
            </Link>
            <a href="#crops" className="w-full sm:w-auto bg-white text-slate-800 font-bold px-10 py-5 rounded-full text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50">
              View Catalog
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Highlights - High Contrast Mix */}
        <div className="grid md:grid-cols-3 gap-8 mb-40">
          {[
            { icon: Zap, bgClass: 'glass-card-dark', iconBg: 'bg-emerald-500/20', textClass: 'text-white', descClass: 'text-slate-300', iconColor: 'text-emerald-400', title: 'Lightning Fast', desc: 'Asynchronous sub-second inference powered by a highly optimized PyTorch backend.' },
            { icon: Sprout, bgClass: 'glass-card-light', iconBg: 'bg-slate-100', textClass: 'text-slate-900', descClass: 'text-slate-600', iconColor: 'text-slate-900', title: 'Extensive Catalog', desc: 'Supports 14 crop species and meticulously identifies 39 unique physiological states.' },
            { icon: ShieldCheck, bgClass: 'glass-card-light', iconBg: 'bg-emerald-50', textClass: 'text-slate-900', descClass: 'text-slate-600', iconColor: 'text-emerald-600', title: 'Actionable Advice', desc: 'Detailed etiology and step-by-step treatment protocols for every single diagnosis.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`${feature.bgClass} p-10 rounded-[2.5rem]`}
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              <h3 className={`text-2xl font-black mb-3 ${feature.textClass}`}>{feature.title}</h3>
              <p className={`leading-relaxed font-medium ${feature.descClass}`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Crops Gallery - Light */}
        <div id="crops" className="mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Species Catalog</h2>
              <p className="text-slate-500 font-medium text-lg">A comprehensive database of supported crops.</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cropsData.map((crop, i) => (
              <Link key={crop.slug} to={`/crop/${crop.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.1 }}
                  className="glass-card-light overflow-hidden rounded-3xl group cursor-pointer"
                >
                  <div className="h-44 overflow-hidden relative p-2">
                    <img src={crop.image} alt={crop.name} className="w-full h-full object-cover rounded-[1.25rem] transform group-hover:scale-105 transition-transform duration-700 ease-out shadow-sm" />
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-emerald-600 transition-colors">{crop.name}</h3>
                    <div className="bg-slate-100 p-2.5 rounded-full group-hover:bg-emerald-50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const CropProfile = () => {
  const { slug } = useParams();
  const crop = cropsData.find(c => c.slug === slug);

  if (!crop) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-900">Crop not found</div>;

  return (
    <div className="min-h-screen bg-mesh-light pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/" className="text-slate-500 hover:text-slate-900 mb-8 inline-flex items-center font-bold transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200">
          <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-dark p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow behind image */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px]"></div>

          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.7, type: "spring" }}>
              <img src={crop.image} alt={crop.name} className="w-full rounded-3xl shadow-2xl border-4 border-slate-700/50 object-cover aspect-square" />
            </motion.div>
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
                Species Profile
              </div>
              <h1 className="text-5xl font-black text-white mb-6 tracking-tight">{crop.name}</h1>
              <p className="text-slate-300 mb-10 font-medium text-lg leading-relaxed">
                Our vision model is trained to recognize {crop.diseases.length} distinct classifications for this species with sub-millimeter precision.
              </p>

              <div className="space-y-5 mb-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Identifiable States</h3>
                <div className="flex flex-wrap gap-2.5">
                  {crop.diseases.map(d => (
                    <span key={d} className="px-4 py-2 bg-slate-800/80 border border-slate-700 shadow-sm rounded-xl text-sm font-bold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-default">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <Link to="/index">
                <InteractiveButton className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 text-lg">
                  Initiate Scan <ScanLine className="w-5 h-5" />
                </InteractiveButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AIEngine = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError("Please select an image file.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setIsCameraOpen(false); setError(null); setResult(null);
  };

  const startCamera = async () => {
    setIsCameraOpen(true); setPreviewUrl(''); setFile(null); setResult(null); setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Camera access denied or unavailable.'); setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      handleFile(new File([blob], "camera_capture.jpg", { type: 'image/jpeg' }));
      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
    }, 'image/jpeg');
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    const formData = new FormData(); formData.append('file', file);
    try {
      const response = await axios.post('/api/v1/predict', formData);
      if (response.data?.data) setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setFile(null); setPreviewUrl(''); setResult(null); setError(null);
  };

  return (
    <div className="min-h-screen bg-mesh-dark pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-800/80 mb-6 shadow-2xl border border-slate-700">
            <ScanLine className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Diagnostic Engine</h1>
          <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto">Upload telemetry for deep neural physiological analysis.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* Upload Dark Panel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5 space-y-6">
            <div className="glass-card-dark p-8 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-emerald-400" /> Input Payload
                </h2>
                {previewUrl && <button onClick={resetAll} className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Reset</button>}
              </div>

              {!previewUrl && !isCameraOpen && (
                <div
                  className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer relative overflow-hidden ${isDragging ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/50'}`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById('file-upload').click()}
                >
                  <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <motion.div whileHover={{ scale: 1.1 }} className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-700 shadow-xl">
                    <UploadCloud className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <p className="text-white font-black text-lg mb-2">Drop payload to scan</p>
                  <p className="text-slate-400 text-sm font-medium">JPEG, PNG • Max 10MB</p>
                </div>
              )}

              {isCameraOpen && (
                <div className="rounded-3xl overflow-hidden bg-black border border-slate-700 relative shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full aspect-[4/3] object-cover"></video>
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-3xl pointer-events-none"></div>
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={capturePhoto} className="bg-white text-slate-900 p-5 rounded-full shadow-2xl border border-white">
                      <Camera className="w-7 h-7" />
                    </motion.button>
                  </div>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
              )}

              {previewUrl && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-black">
                  <img src={previewUrl} alt="Preview" className="w-full aspect-[4/3] object-cover" />
                </motion.div>
              )}

              <div className="mt-6">
                {!isCameraOpen && !previewUrl && (
                  <button onClick={startCamera} className="w-full py-4 rounded-2xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors flex justify-center items-center gap-3 shadow-md bg-slate-900">
                    <Camera className="w-5 h-5" /> Initialize Camera
                  </button>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <InteractiveButton
                onClick={handleSubmit} disabled={!file || loading}
                className={`w-full mt-6 py-4.5 rounded-2xl font-black transition-all flex justify-center items-center gap-3 text-lg shadow-xl
                  ${!file || loading ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 border border-emerald-400'}`}
              >
                {loading ? 'Processing...' : 'Run Diagnostics'} <ArrowRight className="w-5 h-5" />
              </InteractiveButton>
            </div>
          </motion.div>

          {/* Results Dark Panel */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7">
            <div className="glass-card-dark p-8 md:p-12 rounded-[2.5rem] h-full flex flex-col justify-center min-h-[500px] relative overflow-hidden">

              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-emerald-400 font-black tracking-widest uppercase text-sm animate-pulse">Computing Inference...</p>
                  </motion.div>
                )}

                {!result && !loading && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-slate-500">
                    <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Activity className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="font-bold text-xl text-slate-400">Awaiting Telemetry.</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-700/50">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {result.disease_name.toLowerCase().includes('healthy') ? (
                            <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" /> Healthy Crop
                            </span>
                          ) : (
                            <span className="px-4 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> Pathogen Detected
                            </span>
                          )}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">{result.disease_name}</h2>
                      </div>

                      <div className="text-left md:text-right bg-slate-800 p-4 rounded-2xl border border-slate-700">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Confidence Interval</p>
                        <div className="text-4xl font-black text-white">{result.confidence.toFixed(1)}<span className="text-2xl text-emerald-400">%</span></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-bold text-slate-400 mb-3">
                        <span>Model Certainty</span>
                        <span className="text-white">{result.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5 shadow-inner">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[shimmer_1s_linear_infinite]"></div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <h4 className="text-sm font-black text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                          <Activity className="w-5 h-5 text-blue-400" /> Etiology
                        </h4>
                        <p className="text-slate-300 text-lg leading-relaxed font-medium">{result.description}</p>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-emerald-900/20 p-8 rounded-3xl border border-emerald-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <h4 className="text-sm font-black text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                          <ShieldCheck className="w-5 h-5" /> Remediation Protocol
                        </h4>
                        <p className="text-emerald-50 text-lg leading-relaxed font-bold">{result.possible_steps}</p>
                      </motion.div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-200 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<AIEngine />} />
            <Route path="/crop/:slug" element={<CropProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
