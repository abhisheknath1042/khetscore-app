import React, { useState, useEffect } from 'react';
import { Download, ChevronRight, AlertCircle, CloudRain, Droplets, Bug, Sun, LogOut, Users, BarChart3, TrendingUp, Leaf, ArrowLeft, Eye, PlayCircle, Home } from 'lucide-react';
import Papa from 'papaparse';

const practices = [
  { id: 1, name: "Buy certified paddy seeds", weight: 0.4 },
  { id: 2, name: "Use pesticides/fungicides (only when needed, as per IPM advice)", weight: 0.2 },
  { id: 3, name: "Balanced fertilizer use (small, need-based doses instead of excess)", weight: 0.4 },
  { id: 4, name: "Zinc sulfate for rice (common deficiency, low cost, high yield impact)", weight: 0.4 },
  { id: 5, name: "IPM - Pheromone/sticky traps for pest control (low cost)", weight: 0.2 },
  { id: 6, name: "IPM- neem sprays", weight: 0.2 },
  { id: 7, name: "Apply organic manure (farmyard manure, cow dung, vermicompost, dhaincha green manure)", weight: 0.07 },
  { id: 8, name: "Regular soil and water testing (often free at KVKs)", weight: 0.07 },
  { id: 9, name: "Proper bund and drainage maintenance using family/community labor", weight: 0.15 },
  { id: 10, name: "Live fencing (bamboo, thorn bushes) to prevent animals from entering fields", weight: 0.13 },
  { id: 11, name: "Use free govt. apps for prices and weather (Kisan Suvidha, mKisan)", weight: 0.13 },
  { id: 12, name: "Consult with KVK experts", weight: 0.2 },
  { id: 13, name: "Mulching (paddy straw mulch)", weight: 0.2 },
  { id: 14, name: "Lease small extra plots of land seasonally", weight: 0.05 },
  { id: 15, name: "Convert fallow/waste land into cultivation (if available)", weight: 0.05 },
  { id: 16, name: "Tube well or small borewell", weight: 0.15 },
  { id: 17, name: "field channels", weight: 0.15 },
  { id: 18, name: "Rainwater harvesting tanks or ponds (low-cost models, often under MGNREGA or govt. subsidy)", weight: 0.15 },
  { id: 19, name: "Solar/diesel pumps (shared among farmer groups)", weight: 0.15 },
  { id: 20, name: "Simple drainage channels (community effort with small cost)", weight: 0.15 },
  { id: 21, name: "Crop insurance", weight: 0.13 },
  { id: 22, name: "Buying improved/hybrid paddy seed", weight: 0.4 },
  { id: 23, name: "Solar-powered irrigation pumps", weight: 0.15 },
  { id: 24, name: "paddy transplanters, combine harvesters, tractors", weight: 0.4 }
];

const weatherShocks = [
  { name: "Drought", icon: Sun, impact: -0.15 },
  { name: "Flood", icon: Droplets, impact: -0.20 },
  { name: "Heavy Rain", icon: CloudRain, impact: -0.10 },
  { name: "Pest and Disease", icon: Bug, impact: -0.12 }
];

const App = () => {
  const [authScreen, setAuthScreen] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', name: '', organization: '' });
  const [authError, setAuthError] = useState('');

  const [screen, setScreen] = useState('dashboard');
  const [farmersData, setFarmersData] = useState([]);
  const [csvLoading, setCsvLoading] = useState(true);
  const [csvError, setCsvError] = useState('');
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [farmerID, setFarmerID] = useState('');
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [showFarmerList, setShowFarmerList] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [selectedPractices, setSelectedPractices] = useState([]);
  const [weatherShock, setWeatherShock] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [likelihoodAnswers, setLikelihoodAnswers] = useState({});
  const [error, setError] = useState('');
  const [allSimulations, setAllSimulations] = useState([]);
  const [sessionHistory, setSessionHistory] = useState({});
  const [draftSimulation, setDraftSimulation] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);

  useEffect(() => {
    // Load CSV data from public folder
    setCsvLoading(true);
    fetch('/farmerdata_prefill.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('CSV file not found');
        }
        return response.text();
      })
      .then(csvText => {
        console.log('CSV Text loaded:', csvText); // Debug log
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Parsed data:', results.data); // Debug log
            if (results.data && results.data.length > 0) {
              setFarmersData(results.data);
              setCsvLoading(false);
              setCsvError('');
            } else {
              setCsvError('No data found in CSV file');
              setCsvLoading(false);
            }
          },
          error: (error) => {
            console.error('Parse error:', error);
            setCsvError('Error parsing CSV file');
            setCsvLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error loading CSV file:', error);
        setCsvError('Failed to load farmer data. Please ensure farmerdata_prefill.csv is in the public folder.');
        setCsvLoading(false);
      });

    const checkAuth = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setAuthScreen('');
        await loadUserData(user.username);
        // Clear any existing drafts on app launch
        localStorage.removeItem(`draft_${user.username}`);
      }
    };
    checkAuth();
  }, []);

  const loadUserData = async (username) => {
    try {
      const savedSims = localStorage.getItem(`simulations_${username}`);
      if (savedSims) {
        setAllSimulations(JSON.parse(savedSims));
      }
      // Don't load draft on app relaunch - start fresh
      setDraftSimulation(null);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveSimulation = async (simulationData) => {
    try {
      const newSim = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...simulationData
      };
      const updatedSims = [...allSimulations, newSim];
      setAllSimulations(updatedSims);
      localStorage.setItem(`simulations_${currentUser.username}`, JSON.stringify(updatedSims));
      // Clear draft after saving complete simulation
      localStorage.removeItem(`draft_${currentUser.username}`);
      setDraftSimulation(null);
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
  };

  const saveDraft = () => {
    try {
      const draft = {
        farmer: currentFarmer,
        currentSeason,
        selectedPractices,
        weatherShock,
        seasonData,
        likelihoodAnswers,
        sessionHistory,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`draft_${currentUser.username}`, JSON.stringify(draft));
      setDraftSimulation(draft);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const loadDraft = () => {
    if (draftSimulation) {
      setCurrentFarmer(draftSimulation.farmer);
      setCurrentSeason(draftSimulation.currentSeason);
      setSelectedPractices(draftSimulation.selectedPractices);
      setWeatherShock(draftSimulation.weatherShock);
      setSeasonData(draftSimulation.seasonData);
      setLikelihoodAnswers(draftSimulation.likelihoodAnswers);
      setSessionHistory(draftSimulation.sessionHistory);
      setShowDraftModal(false);
      
      // Navigate to appropriate screen
      if (draftSimulation.seasonData.length === 3) {
        setScreen('summary');
      } else if (Object.keys(draftSimulation.likelihoodAnswers).length > 0) {
        setScreen('likelihood');
      } else if (draftSimulation.weatherShock !== null) {
        setScreen('weather-result');
      } else if (draftSimulation.selectedPractices.length > 0) {
        setScreen('practice-selection');
      } else {
        setScreen('season-intro');
      }
    }
  };

  const discardDraft = () => {
    if (currentUser) {
      localStorage.removeItem(`draft_${currentUser.username}`);
    }
    setDraftSimulation(null);
    setShowDraftModal(false);
  };

  const handleBeginSimulation = () => {
    if (draftSimulation) {
      setShowDraftModal(true);
    } else {
      setScreen('farmer-lookup');
    }
  };

  const handleStartNewFromModal = () => {
    discardDraft();
    setScreen('farmer-lookup');
  };

  const handleHomeClick = () => {
    // Save draft if in middle of simulation
    if (currentFarmer && screen !== 'dashboard' && screen !== 'farmer-lookup') {
      saveDraft();
    }
    setScreen('dashboard');
  };

  const handleLogoClick = () => {
    // Save draft if in middle of simulation
    if (currentFarmer && screen !== 'dashboard' && screen !== 'farmer-lookup') {
      saveDraft();
    }
    setScreen('dashboard');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
      
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setAuthScreen('');
        await loadUserData(user.username);
      } else {
        setAuthError('Invalid username or password');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!registerForm.username || !registerForm.password || !registerForm.name) {
      setAuthError('Please fill in all required fields');
      return;
    }
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find(u => u.username === registerForm.username)) {
        setAuthError('Username already exists');
        return;
      }
      
      const newUser = {
        username: registerForm.username,
        password: registerForm.password,
        name: registerForm.name,
        organization: registerForm.organization,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setAuthScreen('');
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear draft on logout
    if (currentUser) {
      localStorage.removeItem(`draft_${currentUser.username}`);
    }
    setDraftSimulation(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAuthScreen('landing');
    setScreen('dashboard');
    setAllSimulations([]);
  };

  const handleFarmerLookup = () => {
    const farmer = farmersData.find(f => f.farmerID === farmerID);
    if (farmer) {
      setCurrentFarmer({
        ...farmer,
        currentKhetscore: parseFloat(farmer.Khetscore),
        initialKhetscore: parseFloat(farmer.Khetscore)
      });
      setError('');
      setCurrentSeason(1);
      setSeasonData([]);
      setShowDropdown(false);
      setSessionHistory({
        season1: { practices: [], weather: null, score: parseFloat(farmer.Khetscore), likelihood: {} },
        season2: { practices: [], weather: null, score: parseFloat(farmer.Khetscore), likelihood: {} },
        season3: { practices: [], weather: null, score: parseFloat(farmer.Khetscore), likelihood: {} }
      });
      setScreen('season-intro');
    } else {
      setError('Farmer ID not found');
    }
  };

  const handleFarmerIDChange = (value) => {
    setFarmerID(value);
    setError('');
    
    if (value.trim() === '') {
      setFilteredFarmers([]);
      setShowDropdown(false);
    } else {
      const filtered = farmersData.filter(farmer => 
        farmer.farmerID.toLowerCase().includes(value.toLowerCase()) ||
        farmer.Name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFarmers(filtered);
      setShowDropdown(filtered.length > 0);
    }
  };

  const handleSelectFarmer = (farmer) => {
    setFarmerID(farmer.farmerID);
    setShowDropdown(false);
    setFilteredFarmers([]);
  };

  const handlePracticeToggle = (practiceId) => {
    setSelectedPractices(prev => 
      prev.includes(practiceId) 
        ? prev.filter(id => id !== practiceId)
        : [...prev, practiceId]
    );
  };

  const handlePracticeSubmit = () => {
    if (selectedPractices.length < 7) {
      setError('Please select at least 7 practices');
      return;
    }
    setError('');
    
    const hasShock = Math.random() < 0.5;
    const shock = hasShock ? weatherShocks[Math.floor(Math.random() * weatherShocks.length)] : null;
    setWeatherShock(shock);
    
    const practiceBonus = selectedPractices.reduce((sum, id) => {
      const practice = practices.find(p => p.id === id);
      return sum + practice.weight;
    }, 0);
    
    const shockImpact = shock ? shock.impact : 0;
    const newScore = Math.max(0, Math.min(100, currentFarmer.currentKhetscore + practiceBonus - Math.abs(shockImpact * currentFarmer.currentKhetscore)));
    
    setCurrentFarmer(prev => ({ ...prev, currentKhetscore: parseFloat(newScore.toFixed(2)) }));
    
    // Update session history
    const seasonKey = `season${currentSeason}`;
    setSessionHistory(prev => ({
      ...prev,
      [seasonKey]: {
        ...prev[seasonKey],
        practices: selectedPractices,
        weather: shock,
        score: parseFloat(newScore.toFixed(2))
      }
    }));
    
    setScreen('weather-result');
  };

  const handleWeatherContinue = () => {
    setScreen('likelihood');
    setLikelihoodAnswers({});
  };

  const handleLikelihoodChange = (practiceId, value) => {
    setLikelihoodAnswers(prev => ({ ...prev, [practiceId]: value }));
  };

  const handleLikelihoodSubmit = () => {
    const seasonRecord = {
      season: currentSeason,
      seasonType: currentSeason % 2 === 1 ? 'Rabi' : 'Kharif',
      practices: selectedPractices.map(id => practices.find(p => p.id === id).name),
      weatherShock: weatherShock ? weatherShock.name : 'None',
      endScore: currentFarmer.currentKhetscore,
      likelihood: { ...likelihoodAnswers }
    };
    
    setSeasonData(prev => [...prev, seasonRecord]);
    
    // Update session history
    const seasonKey = `season${currentSeason}`;
    setSessionHistory(prev => ({
      ...prev,
      [seasonKey]: {
        ...prev[seasonKey],
        likelihood: { ...likelihoodAnswers }
      }
    }));
    
    if (currentSeason < 3) {
      setCurrentSeason(prev => prev + 1);
      setSelectedPractices([]);
      setWeatherShock(null);
      setScreen('season-intro');
    } else {
      setScreen('summary');
    }
  };

  const handleExportCSV = (simulation = null) => {
    const sim = simulation || {
      farmer: {
        name: currentFarmer.Name,
        id: currentFarmer.farmerID,
        initialKhetscore: currentFarmer.initialKhetscore
      },
      seasons: seasonData
    };

    const csvData = [{
      Name: sim.farmer.name,
      farmerID: sim.farmer.id,
      InitialKhetscore: sim.farmer.initialKhetscore,
      Season1_Practices: sim.seasons[0].practices.join('; '),
      Season1_WeatherShock: sim.seasons[0].weatherShock,
      Season1_EndScore: sim.seasons[0].endScore,
      Season2_Practices: sim.seasons[1].practices.join('; '),
      Season2_WeatherShock: sim.seasons[1].weatherShock,
      Season2_EndScore: sim.seasons[1].endScore,
      Season3_Practices: sim.seasons[2].practices.join('; '),
      Season3_WeatherShock: sim.seasons[2].weatherShock,
      Season3_EndScore: sim.seasons[2].endScore
    }];
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmer_${sim.farmer.id}_simulation_${Date.now()}.csv`;
    a.click();
  };

  const handleViewSummary = (simulation) => {
    // Set up the state to view a previous simulation
    const farmer = farmersData.find(f => f.farmerID === simulation.farmer.id);
    setCurrentFarmer({
      ...farmer,
      currentKhetscore: simulation.farmer.finalKhetscore,
      initialKhetscore: simulation.farmer.initialKhetscore
    });
    setSeasonData(simulation.seasons);
    setScreen('summary');
  };

  const handleSaveAndReturn = async () => {
    await saveSimulation({
      farmer: {
        name: currentFarmer.Name,
        id: currentFarmer.farmerID,
        initialKhetscore: currentFarmer.initialKhetscore,
        finalKhetscore: currentFarmer.currentKhetscore
      },
      seasons: seasonData
    });
    
    setScreen('dashboard');
    setCurrentFarmer(null);
    setSeasonData([]);
    setSelectedPractices([]);
    setCurrentSeason(1);
  };

  const handleBackButton = () => {
    if (screen === 'farmer-lookup') {
      setScreen('dashboard');
    } else if (screen === 'season-intro') {
      if (currentSeason === 1) {
        setScreen('farmer-lookup');
      } else {
        // Go back to previous season's likelihood
        setCurrentSeason(prev => prev - 1);
        const prevSeasonKey = `season${currentSeason - 1}`;
        setSelectedPractices(sessionHistory[prevSeasonKey].practices);
        setLikelihoodAnswers(sessionHistory[prevSeasonKey].likelihood);
        setScreen('likelihood');
      }
    } else if (screen === 'practice-selection') {
      setScreen('season-intro');
    } else if (screen === 'weather-result') {
      setScreen('practice-selection');
    } else if (screen === 'likelihood') {
      setScreen('weather-result');
    } else if (screen === 'summary') {
      // Go back to last season likelihood
      const lastSeasonKey = `season3`;
      setSelectedPractices(sessionHistory[lastSeasonKey].practices);
      setLikelihoodAnswers(sessionHistory[lastSeasonKey].likelihood);
      setScreen('likelihood');
    }
  };

  // Landing Page
  if (authScreen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-600">
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm p-6 rounded-full mb-6">
              <Leaf className="w-20 h-20 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">KhetScore</h1>
            <p className="text-xl text-green-50 mb-2">Agricultural Practices Simulation Platform</p>
            <p className="text-green-100 max-w-2xl mx-auto">
              Empowering farmers through data-driven decision making. Simulate seasonal agricultural practices, 
              track outcomes, and optimize farm management strategies.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setAuthScreen('login')}
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </button>
            <button
              onClick={() => setAuthScreen('register')}
              className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-800 transition-all shadow-lg hover:shadow-xl border-2 border-white/20"
            >
              Get Started
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
              <BarChart3 className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-green-50 text-sm">Monitor Khetscore changes across multiple seasons</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Data-Driven Insights</h3>
              <p className="text-green-50 text-sm">Make informed decisions based on practice outcomes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-white">
              <Users className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Multi-Farmer Support</h3>
              <p className="text-green-50 text-sm">Manage simulations for multiple farmers</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Page
  if (authScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <Leaf className="w-12 h-12 text-green-700" />
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to continue to KhetScore</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            {authError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{authError}</span>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthScreen('register');
                setAuthError('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Don't have an account? Register
            </button>
            <button
              onClick={() => {
                setAuthScreen('landing');
                setAuthError('');
              }}
              className="block w-full mt-4 text-gray-600 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Register Page
  if (authScreen === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <Leaf className="w-12 h-12 text-green-700" />
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join KhetScore today</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Choose a username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization (Optional)</label>
              <input
                type="text"
                value={registerForm.organization}
                onChange={(e) => setRegisterForm({ ...registerForm, organization: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your organization"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>
            
            {authError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{authError}</span>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setAuthScreen('login');
                setAuthError('');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Already have an account? Login
            </button>
            <button
              onClick={() => {
                setAuthScreen('landing');
                setAuthError('');
              }}
              className="block w-full mt-4 text-gray-600 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard (after login)
  if (!isLoggedIn) return null;

  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome,</p>
                  <p className="font-semibold text-gray-800">{currentUser.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Manage your agricultural simulation activities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total Simulations</h3>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-700">{allSimulations.length}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Farmers Tracked</h3>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-700">
                {new Set(allSimulations.map(s => s.farmer.id)).size}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Avg Score Change</h3>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-purple-700">
                {allSimulations.length > 0
                  ? `+${(allSimulations.reduce((sum, s) => sum + (s.farmer.finalKhetscore - s.farmer.initialKhetscore), 0) / allSimulations.length).toFixed(1)}`
                  : '0'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Start New Simulation</h3>
            <button
              onClick={handleBeginSimulation}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Begin Simulation
            </button>
          </div>

          {draftSimulation && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Draft in Progress</h3>
                  <p className="text-sm text-gray-600">
                    You have an incomplete simulation that needs to be completed or deleted before starting a new one.
                  </p>
                </div>
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Farmer</p>
                    <p className="font-semibold text-gray-800">{draftSimulation.farmer.Name}</p>
                    <p className="text-sm text-gray-600">ID: {draftSimulation.farmer.farmerID}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Progress</p>
                    <p className="font-semibold text-gray-800">Season {draftSimulation.currentSeason} of 3</p>
                    <p className="text-sm text-gray-600">
                      {draftSimulation.currentSeason === 1 ? 'Rabi' : draftSimulation.currentSeason === 2 ? 'Kharif' : 'Rabi'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Current Khetscore</p>
                    <p className="font-semibold text-green-700">{draftSimulation.farmer.currentKhetscore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Last Saved</p>
                    <p className="text-sm text-gray-600">
                      {new Date(draftSimulation.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={loadDraft}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Continue Draft
                </button>
                <button
                  onClick={discardDraft}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Delete Draft
                </button>
              </div>
            </div>
          )}

          {allSimulations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Simulations</h3>
              <div className="space-y-3">
                {allSimulations.slice(-5).reverse().map((sim) => (
                  <div key={sim.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{sim.farmer.name}</p>
                        <p className="text-sm text-gray-600">ID: {sim.farmer.id}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(sim.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Score Change</p>
                          <p className={`text-xl font-bold ${
                            sim.farmer.finalKhetscore >= sim.farmer.initialKhetscore
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {sim.farmer.initialKhetscore} → {sim.farmer.finalKhetscore}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewSummary(sim)}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleExportCSV(sim)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Farmer Lookup Screen
  if (screen === 'farmer-lookup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Enter Farmer ID</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer ID or Name</label>
                <input
                  type="text"
                  value={farmerID}
                  onChange={(e) => handleFarmerIDChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter Farmer ID or search by name"
                />
                
                {/* Dropdown for filtered farmers */}
                {showDropdown && filteredFarmers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredFarmers.map((farmer) => (
                      <button
                        key={farmer.farmerID}
                        onClick={() => handleSelectFarmer(farmer)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{farmer.Name}</p>
                            <p className="text-sm text-gray-600">ID: {farmer.farmerID}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Khetscore</p>
                            <p className="font-bold text-green-700">{farmer.Khetscore}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                onClick={handleFarmerLookup}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowFarmerList(true)}
                disabled={csvLoading || farmersData.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Users className="w-5 h-5" />
                {csvLoading ? 'Loading...' : `View All Farmers (${farmersData.length})`}
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {csvLoading ? (
                <p className="text-sm text-gray-600">
                  <strong>Loading farmer data...</strong>
                </p>
              ) : csvError ? (
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {csvError}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  <strong>Available Farmers:</strong> {farmersData.length}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Farmer List Modal */}
        {showFarmerList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-green-800">All Farmers</h3>
                  <button
                    onClick={() => setShowFarmerList(false)}
                    className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {farmersData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No farmer data available</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Farmer ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Khetscore</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Treatment</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmersData.map((farmer, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{farmer.farmerID || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{farmer.Name || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-700">{farmer.Khetscore || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{farmer.treatment || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => {
                                handleSelectFarmer(farmer);
                                setShowFarmerList(false);
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFarmerList(false)}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Season Introduction Screen
  if (screen === 'season-intro') {
    const seasonType = currentSeason % 2 === 1 ? 'RABI' : 'KHARIF';
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleBackButton}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Season {currentSeason} - {seasonType} Season</h2>
              <p className="text-gray-600">Farmer: {currentFarmer.Name}</p>
              <div className="mt-4 inline-block bg-green-100 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600">Current Khetscore</p>
                <p className="text-3xl font-bold text-green-700">{currentFarmer.currentKhetscore}</p>
              </div>
            </div>
            
            <button
              onClick={() => setScreen('practice-selection')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Select Agricultural Practices <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice Selection Screen
  if (screen === 'practice-selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Leaf className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleBackButton}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Select Agricultural Practices</h2>
              <p className="text-gray-600">Season {currentSeason} - Choose at least 7 practices</p>
              <div className="mt-2 inline-block bg-blue-100 px-4 py-2 rounded-lg">
                <span className="font-medium text-blue-800">Selected: {selectedPractices.length}</span>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2 max-h-96 overflow-y-auto mb-6 pr-2">
              {practices.map(practice => (
                <label
                  key={practice.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPractices.includes(practice.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPractices.includes(practice.id)}
                    onChange={() => handlePracticeToggle(practice.id)}
                    className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{practice.name}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={handlePracticeSubmit}
              disabled={selectedPractices.length < 7}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Weather Result Screen
  if (screen === 'weather-result') {
    const WeatherIcon = weatherShock ? weatherShock.icon : null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Leaf className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleBackButton}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Season {currentSeason} Results</h2>
              
              {weatherShock ? (
                <div className="mb-8">
                  <div className="inline-block bg-red-100 p-6 rounded-full mb-4">
                    <WeatherIcon className="w-16 h-16 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">Weather Shock: {weatherShock.name}</h3>
                  <p className="text-gray-600">Your farm was affected by {weatherShock.name.toLowerCase()}</p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="inline-block bg-green-100 p-6 rounded-full mb-4">
                    <Sun className="w-16 h-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">No Weather Shock</h3>
                  <p className="text-gray-600">Favorable weather conditions this season</p>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">New Khetscore</p>
                <p className="text-4xl font-bold text-green-700">{currentFarmer.currentKhetscore}</p>
              </div>
              
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 max-h-64 overflow-y-auto">
                <p className="font-medium text-gray-700 mb-2">Selected Practices ({selectedPractices.length}):</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedPractices.map(id => (
                    <li key={id}>• {practices.find(p => p.id === id).name}</li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={handleWeatherContinue}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue to Assessment <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Likelihood Assessment Screen
  if (screen === 'likelihood') {
    const allAnswered = selectedPractices.every(id => likelihoodAnswers[id]);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Leaf className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleBackButton}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-hidden flex flex-col max-w-6xl mx-auto w-full p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Practice Likelihood Assessment</h2>
              <p className="text-gray-600">
                Thinking about your current agricultural activities, how likely are you to actually do the practices you chose?
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {selectedPractices.map(practiceId => {
                const practice = practices.find(p => p.id === practiceId);
                return (
                  <div key={practiceId} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <p className="text-sm font-medium text-gray-700 mb-2">{practice.name}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {['Definitely won\'t do it', 'Probably won\'t do it', 'Probably will do it', 'Definitely will do it'].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all text-xs ${
                            likelihoodAnswers[practiceId] === option
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`practice-${practiceId}`}
                            value={option}
                            checked={likelihoodAnswers[practiceId] === option}
                            onChange={() => handleLikelihoodChange(practiceId, option)}
                            className="sr-only"
                          />
                          <span className="text-center">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={handleLikelihoodSubmit}
              disabled={!allAnswered}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {currentSeason < 3 ? 'Continue to Next Season' : 'View Summary'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Screen with Vertical Bar Charts
  if (screen === 'summary') {
    const scores = [
      currentFarmer.initialKhetscore,
      seasonData[0]?.endScore || currentFarmer.initialKhetscore,
      seasonData[1]?.endScore || currentFarmer.initialKhetscore,
      seasonData[2]?.endScore || currentFarmer.initialKhetscore
    ];

    const VerticalBarChart = ({ values, labels, showInitialOnly = false }) => {
      const maxScore = 100;
      const displayValues = showInitialOnly ? [values[0]] : values;
      const displayLabels = showInitialOnly ? [labels[0]] : labels;
      
      return (
        <div className="flex items-end justify-center gap-4 h-64">
          {displayValues.map((value, idx) => {
            const prevValue = idx > 0 ? displayValues[idx - 1] : value;
            const isStart = idx === 0;
            const isIncrease = value >= prevValue && !isStart;
            const isDecrease = value < prevValue && !isStart;
            
            let barColor = '#0d3385'; // Start color (blue)
            if (isIncrease) barColor = '#2a9e1c'; // Increase (green)
            if (isDecrease) barColor = '#a61212'; // Decrease (red)
            
            const heightPercentage = (value / maxScore) * 100;
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="text-sm font-semibold mb-2" style={{ color: barColor }}>
                  {value.toFixed(1)}
                </div>
                <div 
                  className="w-16 rounded-t-lg transition-all duration-500 relative"
                  style={{ 
                    height: `${heightPercentage * 2}px`,
                    backgroundColor: barColor,
                    minHeight: '20px'
                  }}
                >
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <div className="w-16 h-1 bg-gray-300"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-8 text-center w-20">
                  {displayLabels[idx]}
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Leaf className="w-5 h-5" />
                  Home
                </button>
                <button
                  onClick={handleBackButton}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Simulation Complete!</h2>
              <p className="text-gray-600">Farmer: {currentFarmer.Name} (ID: {currentFarmer.farmerID})</p>
            </div>
            
            {/* Initial Khetscore Section */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Initial Khetscore</h3>
              <VerticalBarChart 
                values={[scores[0]]}
                labels={['Start']}
                showInitialOnly={true}
              />
            </div>

            {/* Season-wise Progress */}
            <div className="space-y-8">
              {seasonData.map((season, idx) => {
                const seasonScores = scores.slice(0, idx + 2);
                const seasonLabels = ['Start'];
                for (let i = 1; i <= idx + 1; i++) {
                  seasonLabels.push(`After S${i}`);
                }
                
                return (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Season Details */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-green-800">
                              Season {season.season} - {season.seasonType}
                            </h3>
                            <p className="text-sm text-gray-600">Weather: {season.weatherShock}</p>
                          </div>
                          <div className="bg-green-100 px-4 py-2 rounded-lg">
                            <p className="text-sm text-gray-600">End Score</p>
                            <p className="text-xl font-bold text-green-700">{season.endScore}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Practices Selected ({season.practices.length}):
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto">
                            {season.practices.map((practice, pIdx) => (
                              <li key={pIdx}>• {practice}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Right: Vertical Bar Chart */}
                      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                            Score Progression
                          </h4>
                          <VerticalBarChart 
                            values={seasonScores}
                            labels={seasonLabels}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => handleExportCSV()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Export to CSV
              </button>
              <button
                onClick={handleSaveAndReturn}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Save & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;