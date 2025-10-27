import React, { useState, useEffect } from 'react';
import { Upload, Download, ChevronRight, AlertCircle, CloudRain, Droplets, Bug, Sun, LogOut, Users, BarChart3, TrendingUp, Leaf } from 'lucide-react';
import Papa from 'papaparse';

const practices = [
  { id: 1, name: "Buy certified paddy seeds", category: "Productivity", weight: 0.4 },
  { id: 2, name: "Use pesticides/fungicides (only when needed, as per IPM advice)", category: "Crop health", weight: 0.2 },
  { id: 3, name: "Balanced fertilizer use (small, need-based doses instead of excess)", category: "Productivity", weight: 0.4 },
  { id: 4, name: "Zinc sulfate for rice (common deficiency, low cost, high yield impact)", category: "Productivity", weight: 0.4 },
  { id: 5, name: "IPM - Pheromone/sticky traps for pest control (low cost)", category: "Crop health", weight: 0.2 },
  { id: 6, name: "IPM- neem sprays", category: "Crop health", weight: 0.2 },
  { id: 7, name: "Apply organic manure (farmyard manure, cow dung, vermicompost, dhaincha green manure)", category: "Nutrition", weight: 0.07 },
  { id: 8, name: "Regular soil and water testing (often free at KVKs)", category: "Nutrition", weight: 0.07 },
  { id: 9, name: "Proper bund and drainage maintenance using family/community labor", category: "Irrigation", weight: 0.15 },
  { id: 10, name: "Live fencing (bamboo, thorn bushes) to prevent animals from entering fields", category: "Damage protection", weight: 0.13 },
  { id: 11, name: "Use free govt. apps for prices and weather (Kisan Suvidha, mKisan)", category: "Damage protection", weight: 0.13 },
  { id: 12, name: "Consult with KVK experts", category: "Crop health", weight: 0.2 },
  { id: 13, name: "Mulching (paddy straw mulch)", category: "Crop health", weight: 0.2 },
  { id: 14, name: "Lease small extra plots of land seasonally", category: "farm area", weight: 0.05 },
  { id: 15, name: "Convert fallow/waste land into cultivation (if available)", category: "farm area", weight: 0.05 },
  { id: 16, name: "Tube well or small borewell", category: "Irrigation", weight: 0.15 },
  { id: 17, name: "field channels", category: "Irrigation", weight: 0.15 },
  { id: 18, name: "Rainwater harvesting tanks or ponds (low-cost models, often under MGNREGA or govt. subsidy)", category: "Irrigation", weight: 0.15 },
  { id: 19, name: "Solar/diesel pumps (shared among farmer groups)", category: "Irrigation", weight: 0.15 },
  { id: 20, name: "Simple drainage channels (community effort with small cost)", category: "Irrigation", weight: 0.15 },
  { id: 21, name: "Crop insurance", category: "Damage protection", weight: 0.13 },
  { id: 22, name: "Buying improved/hybrid paddy seed", category: "Productivity", weight: 0.4 },
  { id: 23, name: "Solar-powered irrigation pumps", category: "Irrigation", weight: 0.15 },
  { id: 24, name: "paddy transplanters, combine harvesters, tractors", category: "Productivity", weight: 0.4 }
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
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [farmerID, setFarmerID] = useState('');
  const [currentSeason, setCurrentSeason] = useState(1);
  const [selectedPractices, setSelectedPractices] = useState([]);
  const [weatherShock, setWeatherShock] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [likelihoodAnswers, setLikelihoodAnswers] = useState({});
  const [error, setError] = useState('');
  const [allSimulations, setAllSimulations] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
        setAuthScreen('');
        await loadUserData(JSON.parse(savedUser).username);
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
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
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
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAuthScreen('landing');
    setScreen('dashboard');
    setAllSimulations([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setFarmersData(results.data);
          setScreen('farmer-lookup');
        }
      });
    }
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
      setScreen('season-intro');
    } else {
      setError('Farmer ID not found');
    }
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
    
    if (currentSeason < 3) {
      setCurrentSeason(prev => prev + 1);
      setSelectedPractices([]);
      setWeatherShock(null);
      setScreen('season-intro');
    } else {
      setScreen('summary');
    }
  };

  const handleExportCSV = () => {
    const csvData = [{
      Name: currentFarmer.Name,
      farmerID: currentFarmer.farmerID,
      InitialKhetscore: currentFarmer.initialKhetscore,
      Season1_Practices: seasonData[0].practices.join('; '),
      Season1_WeatherShock: seasonData[0].weatherShock,
      Season1_EndScore: seasonData[0].endScore,
      Season2_Practices: seasonData[1].practices.join('; '),
      Season2_WeatherShock: seasonData[1].weatherShock,
      Season2_EndScore: seasonData[1].endScore,
      Season3_Practices: seasonData[2].practices.join('; '),
      Season3_WeatherShock: seasonData[2].weatherShock,
      Season3_EndScore: seasonData[2].endScore
    }];
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmer_${currentFarmer.farmerID}_simulation_${Date.now()}.csv`;
    a.click();
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

  const handleReset = () => {
    setScreen('upload');
    setFarmersData([]);
    setCurrentFarmer(null);
    setFarmerID('');
    setCurrentSeason(1);
    setSelectedPractices([]);
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setError('');
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
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </div>
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
              onClick={() => setScreen('upload')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Farmer Data & Begin
            </button>
          </div>

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

  // Upload Screen
  if (screen === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </div>
              <button
                onClick={() => setScreen('dashboard')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Upload Farmer Data</h2>
              <p className="text-gray-600">Upload a CSV file containing farmer information</p>
            </div>
            
            <div className="border-2 border-dashed border-green-300 rounded-lg p-12 text-center hover:border-green-500 transition-colors">
              <Upload className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <label className="cursor-pointer">
                <span className="text-lg text-gray-700 font-medium">Click to upload CSV file</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
              <p className="text-sm text-gray-500 mt-2">CSV should contain: Name, farmerID, Khetscore</p>
            </div>
          </div>
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
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </div>
              <button
                onClick={() => setScreen('upload')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Enter Farmer ID</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer ID</label>
                <input
                  type="text"
                  value={farmerID}
                  onChange={(e) => setFarmerID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter Farmer ID"
                />
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
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Loaded farmers:</strong> {farmersData.length}
              </p>
            </div>
          </div>
        </div>
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
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
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
    const groupedPractices = practices.reduce((acc, practice) => {
      if (!acc[practice.category]) acc[practice.category] = [];
      acc[practice.category].push(practice);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
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
            
            <div className="space-y-6 max-h-96 overflow-y-auto mb-6 pr-2">
              {Object.entries(groupedPractices).map(([category, categoryPractices]) => (
                <div key={category}>
                  <h3 className="font-semibold text-green-700 mb-3 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {categoryPractices.map(practice => (
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
                </div>
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
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
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
              
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-gray-700 mb-2">Selected Practices ({selectedPractices.length}):</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedPractices.slice(0, 3).map(id => (
                    <li key={id}>• {practices.find(p => p.id === id).name}</li>
                  ))}
                  {selectedPractices.length > 3 && (
                    <li className="text-gray-500 italic">... and {selectedPractices.length - 3} more</li>
                  )}
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Practice Likelihood Assessment</h2>
              <p className="text-gray-600">
                Thinking about your current agricultural activities, how likely are you to actually do the practices you chose?
              </p>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
              {selectedPractices.map(practiceId => {
                const practice = practices.find(p => p.id === practiceId);
                return (
                  <div key={practiceId} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">{practice.name}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Definitely won\'t do it', 'Probably won\'t do it', 'Probably will do it', 'Definitely will do it'].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all text-xs ${
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

  // Summary Screen
  if (screen === 'summary') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Simulation Complete!</h2>
              <p className="text-gray-600">Farmer: {currentFarmer.Name} (ID: {currentFarmer.farmerID})</p>
            </div>
            
            <div className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Initial Khetscore</p>
              <p className="text-2xl font-bold text-gray-700 mb-4">{currentFarmer.initialKhetscore}</p>
              <div className="flex items-center justify-center gap-4">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-1 mt-4">Final Khetscore</p>
              <p className="text-3xl font-bold text-green-700">{currentFarmer.currentKhetscore}</p>
            </div>
            
            <div className="space-y-6 mb-8">
              {seasonData.map((season, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Season {season.season} - {season.seasonType}</h3>
                      <p className="text-sm text-gray-600">Weather: {season.weatherShock}</p>
                    </div>
                    <div className="bg-green-100 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-600">End Score</p>
                      <p className="text-xl font-bold text-green-700">{season.endScore}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Practices Selected ({season.practices.length}):</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {season.practices.map((practice, pIdx) => (
                        <li key={pIdx}>• {practice}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleExportCSV}
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
            
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Start New Simulation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default App;