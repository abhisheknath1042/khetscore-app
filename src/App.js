// khetscore-app/src/App.js
// import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Download, ChevronRight, AlertCircle, CloudRain, Droplets, Bug, Sun, LogOut, Users, BarChart3, TrendingUp, Leaf, ArrowLeft, Eye, PlayCircle, Home, BookOpen } from 'lucide-react';
import Papa from 'papaparse';

// Agricultural practices with their weights, seasons, and categories
const practices = [
  { id: 1, name: "Buy certified paddy seeds", category: "Productivity", weight: 0.4, season: "Before Season" },
  { id: 2, name: "Use pesticides/fungicides (only when needed, as per IPM advice)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 3, name: "Balanced fertilizer use (small, need-based doses instead of excess)", category: "Productivity", weight: 0.4, season: "During Season" },
  { id: 4, name: "Zinc sulfate for rice (common deficiency, low cost, high yield impact)", category: "Productivity", weight: 0.4, season: "Before Season" },
  { id: 5, name: "IPM - Pheromone/sticky traps for pest control (low cost)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 6, name: "IPM- neem sprays", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 7, name: "Apply organic manure (farmyard manure, cow dung, vermicompost, dhaincha green manure)", category: "Nutrition", weight: 0.07, season: "During Season" },
  { id: 8, name: "Regular soil and water testing (often free at KVKs)", category: "Nutrition", weight: 0.07, season: "Before Season" },
  { id: 9, name: "Proper bund and drainage maintenance using family/community labor", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 10, name: "Live fencing (bamboo, thorn bushes) to prevent animals from entering fields", category: "Damage protection", weight: 0.13, season: "Before Season" },
  { id: 11, name: "Use free govt. apps for prices and weather (Kisan Suvidha, mKisan)", category: "Damage protection", weight: 0.13, season: "During Season" },
  { id: 12, name: "Consult with KVK experts", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 13, name: "Mulching (paddy straw mulch)", category: "Crop health", weight: 0.2, season: "Before Season" },
  { id: 14, name: "Lease small extra plots of land seasonally", category: "farm area", weight: 0.05, season: "Before Season" },
  { id: 15, name: "Convert fallow/waste land into cultivation (if available)", category: "farm area", weight: 0.05, season: "Before Season" },
  { id: 16, name: "Tube well or small borewell", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 17, name: "field channels", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 18, name: "Rainwater harvesting tanks or ponds (low-cost models, often under MGNREGA or govt. subsidy)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 19, name: "Solar/diesel pumps (shared among farmer groups)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 20, name: "Simple drainage channels (community effort with small cost)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 21, name: "Crop insurance", category: "Damage protection", weight: 0.13, season: "Before Season" },
  { id: 22, name: "Buying improved/hybrid paddy seed", category: "Productivity", weight: 0.4, season: "Before Season" },
  { id: 23, name: "Solar-powered irrigation pumps", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 24, name: "paddy transplanters, combine harvesters, tractors", category: "Productivity", weight: 0.4, season: "After Harvest" }
];  

// Weather shocks with their impact on Khetscore
const weatherShocks = [
  { name: "Flood", icon: Droplets, impact: -0.10 },
  { name: "Heavy Rain", icon: CloudRain, impact: -0.10 },
  { name: "Pest and Disease", icon: Bug, impact: -0.05 }
];

// Translation object
// const translations = {
//   english: {
//     // Landing page
//     appName: "KhetScore",
//     tagline: "Agricultural Practices Simulation Platform",
//     description: "Empowering farmers through data-driven decision making.",
//     login: "Login",
//     getStarted: "Get Started",
//     register: "Register",
    
//     // Auth
//     welcomeBack: "Welcome Back",
//     loginToContinue: "Login to continue to KhetScore",
//     username: "Username",
//     password: "Password",
//     createAccount: "Create Account",
//     joinKhetScore: "Join KhetScore today",
//     fullName: "Full Name",
//     organization: "Organization (Optional)",
//     alreadyHaveAccount: "Already have an account? Login",
//     dontHaveAccount: "Don't have an account? Register",
//     backToHome: "← Back to Home",
    
//     // Dashboard
//     dashboard: "Dashboard",
//     manageActivities: "Manage your agricultural simulation activities",
//     totalSimulations: "Total Simulations",
//     farmersTracked: "Farmers Tracked",
//     startNewSimulation: "Start New Simulation",
//     beginSimulation: "Begin Simulation",
//     recentSimulations: "Recent Simulations",
//     searchPlaceholder: "Search by farmer name or ID...",
    
//     // Simulation
//     enterFarmerID: "Enter Farmer ID",
//     farmerID: "Farmer ID",
//     continue: "Continue",
//     viewAllFarmers: "View All Farmers",
//     availableFarmers: "Available Farmers",
//     selectPractices: "Select Agricultural Practices",
//     choosePractices: "Choose at least 7 practices",
//     selected: "Selected",
//     weatherShock: "Weather Shock",
//     noWeatherShock: "No Weather Shock",
//     favorableConditions: "Favorable weather conditions this season",
//     newKhetscore: "New Khetscore",
//     selectedPractices: "Selected Practices",
//     continueToAssessment: "Continue to Assessment",
    
//     // Seasons
//     season: "Season",
//     rabiSeason: "Rabi Season",
//     kharifSeason: "Kharif Season",
//     results: "Results",
    
//     // Others
//     home: "Home",
//     logout: "Logout",
//     welcome: "Welcome",
//     delete: "Delete",
//     view: "View",
//     export: "Export",
//     save: "Save & Return to Dashboard"
//   },
//   hindi: {
//     // Landing page
//     appName: "खेतस्कोर",
//     tagline: "कृषि पद्धति सिमुलेशन प्लेटफ़ॉर्म",
//     description: "डेटा-संचालित निर्णय लेने के माध्यम से किसानों को सशक्त बनाना।",
//     login: "लॉगिन",
//     getStarted: "शुरू करें",
//     register: "पंजीकरण करें",
    
//     // Auth
//     welcomeBack: "वापसी पर स्वागत है",
//     loginToContinue: "खेतस्कोर में जारी रखने के लिए लॉगिन करें",
//     username: "उपयोगकर्ता नाम",
//     password: "पासवर्ड",
//     createAccount: "खाता बनाएँ",
//     joinKhetScore: "आज ही खेतस्कोर से जुड़ें",
//     fullName: "पूरा नाम",
//     organization: "संगठन (वैकल्पिक)",
//     alreadyHaveAccount: "पहले से खाता है? लॉगिन करें",
//     dontHaveAccount: "खाता नहीं है? पंजीकरण करें",
//     backToHome: "← होम पर वापस जाएं",
    
//     // Dashboard
//     dashboard: "डैशबोर्ड",
//     manageActivities: "अपनी कृषि सिमुलेशन गतिविधियों का प्रबंधन करें",
//     totalSimulations: "कुल सिमुलेशन",
//     farmersTracked: "किसान ट्रैक किए गए",
//     startNewSimulation: "नया सिमुलेशन शुरू करें",
//     beginSimulation: "सिमुलेशन शुरू करें",
//     recentSimulations: "हाल के सिमुलेशन",
//     searchPlaceholder: "किसान के नाम या आईडी से खोजें...",
    
//     // Simulation
//     enterFarmerID: "किसान आईडी दर्ज करें",
//     farmerID: "किसान आईडी",
//     continue: "जारी रखें",
//     viewAllFarmers: "सभी किसान देखें",
//     availableFarmers: "उपलब्ध किसान",
//     selectPractices: "कृषि पद्धतियाँ चुनें",
//     choosePractices: "कम से कम 7 पद्धतियाँ चुनें",
//     selected: "चयनित",
//     weatherShock: "मौसम का झटका",
//     noWeatherShock: "कोई मौसम झटका नहीं",
//     favorableConditions: "इस मौसम में अनुकूल मौसम की स्थिति",
//     newKhetscore: "नया खेतस्कोर",
//     selectedPractices: "चयनित पद्धतियाँ",
//     continueToAssessment: "मूल्यांकन के लिए जारी रखें",
    
//     // Seasons
//     season: "मौसम",
//     rabiSeason: "रबी मौसम",
//     kharifSeason: "खरीफ मौसम",
//     results: "परिणाम",
    
//     // Others
//     home: "होम",
//     logout: "लॉगआउट",
//     welcome: "स्वागत है",
//     delete: "हटाएं",
//     view: "देखें",
//     export: "निर्यात करें",
//     save: "सहेजें और डैशबोर्ड पर वापस जाएं"
//   }
// };

// Language Toggle Component
const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <button
      onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
    >
      <span className="text-sm">{language === 'english' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
    </button>
  );
}

// Comparison Bar Chart Component
const ComparisonBarChart = ({ values, labels, title }) => {
  const maxScore = 100;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-6">
      <h4 className="text-lg font-semibold text-gray-700 mb-6 text-center">{title}</h4>
      <div className="flex items-end justify-center gap-6 h-64">
        {values.map((value, idx) => {
          const prevValue = idx > 0 ? values[idx - 1] : value;
          const isStart = idx === 0;
          const isIncrease = value >= prevValue && !isStart;
          const isDecrease = value < prevValue && !isStart;
          
          let barColor = '#0d3385'; // Start color (blue)
          if (isIncrease) barColor = '#2a9e1c'; // Increase (green)
          if (isDecrease) barColor = '#a61212'; // Decrease (red)
          
          const heightPercentage = (value / maxScore) * 100;
          
          return (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-lg font-bold mb-2" style={{ color: barColor }}>
                {value}
              </div>
              <div 
                className="w-20 rounded-t-lg transition-all duration-500 relative"
                style={{ 
                  height: `${heightPercentage * 1.8}px`,
                  backgroundColor: barColor,
                  minHeight: '30px'
                }}
              >
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <div className="w-20 h-1 bg-gray-300"></div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-10 text-center w-24 font-medium">
                {labels[idx]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Slideshow for Treatment 1 Info Page
const InfoPath1 = ({ setScreen, setTreatmentFilter }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: '/treat1-slide1.png', alt: 'Treatment 1 - Slide 1' },
    { image: '/treat1-slide2.png', alt: 'Treatment 1 - Slide 2' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 text-center">
          <div className="inline-block bg-white/20 p-2 rounded-full mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Treatment Group 1</h1>
          <p className="text-green-100 text-lg">Information</p>
        </div>

        {/* Slideshow Container */}
        <div className="relative bg-gray-900 h-96">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
          >
            →
          </button>
        </div>

        {/* Info and Buttons */}
        <div className="p-8">
          <div className="p-8 pt-0 flex gap-4 mt-12">
            <button
              onClick={() => {
                setScreen('selection');
                setTreatmentFilter(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
            >
              ← Back to Selection
            </button>
            <button
              onClick={() => setScreen('sim-InfoPage')}
              className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Simulation Information →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slideshow for Treatment 2 Info Page
const InfoPath2 = ({ setScreen, setTreatmentFilter }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
    
  // Replace these with your actual image URLs
  const slides = [
    {
      image: '/treat2-slide1.png', // Put your images in public/images folder
      alt: 'Treatment 2 - Slide 1'
    },
    {
      image: '/treat2-slide2.png',
      alt: 'Treatment 2 - Slide 2'
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(timer);
  }, [slides.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-3 text-center">
          <div className="inline-block bg-white/20 p-2 rounded-full mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Treatment Group 1</h1>
          <p className="text-green-100 text-lg">Information</p>
        </div>
        
        {/* Slideshow Container */}
        <div className="relative bg-gray-900 h-[30rem]">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition-all"
          >
            →
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="p-8 pt-0 flex gap-4 mt-12">
          <button
            onClick={() => {
              setScreen('selection');
              setTreatmentFilter(null);
            }}
            className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
          >
            ← Back to Selection
          </button>
          <button
            onClick={() => setScreen('sim-InfoPage')}
            className="flex-1 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Simulation Information →
          </button>
        </div>
      </div>
    </div>
  );
};


// Main App Component
const App = () => {
  const [language, setLanguage] = useState('english');                // 'english' or 'odia'
  const [authScreen, setAuthScreen] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', name: '', organization: '' });
  const [authError, setAuthError] = useState('');
  const [screen, setScreen] = useState('selection'); 
  const [treatmentFilter, setTreatmentFilter] = useState(null); 
  const [farmersData, setFarmersData] = useState([]);
  const [csvLoading, setCsvLoading] = useState(true);
  const [csvError, setCsvError] = useState('');
  const [currentFarmer, setCurrentFarmer] = useState(null);
  const [farmerID, setFarmerID] = useState('');
  const [currentSeason, setCurrentSeason] = useState(1);
  const [selectedPractices, setSelectedPractices] = useState([]);
  const [practicesWithLikelihood, setPracticesWithLikelihood] = useState({});
  const [weatherShock, setWeatherShock] = useState(null);
  const [seasonData, setSeasonData] = useState([]);
  const [likelihoodAnswers, setLikelihoodAnswers] = useState({});
  const [error, setError] = useState('');
  const [allSimulations, setAllSimulations] = useState([]);
  const [sessionHistory, setSessionHistory] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [simulationToDelete, setSimulationToDelete] = useState(null);
  const [showFarmerList, setShowFarmerList] = useState(false);

  // Load CSV data
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
      }
    };
    checkAuth();
  }, []);

  // Load user data
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

  // Save simulation
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

  // Round score
  const roundScore = (score) => {
    return Math.round(parseFloat(score));
  };

  // Get filtered farmers based on treatment filter
  const getFilteredFarmers = () => {
    if (!treatmentFilter) return farmersData;
    return farmersData.filter(farmer => farmer.treatment === treatmentFilter);
  };

  // Handle delete simulation
  const handleDeleteSimulation = (simId) => {
    const updatedSims = allSimulations.filter(sim => sim.id !== simId);
    setAllSimulations(updatedSims);
    localStorage.setItem(`simulations_${currentUser.username}`, JSON.stringify(updatedSims));
    setShowDeleteConfirm(false);
    setSimulationToDelete(null);
  };

  // Confirm delete simulation
  const confirmDelete = (sim) => {
    setSimulationToDelete(sim);
    setShowDeleteConfirm(true);
  };

  // Save and return to dashboard
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
    
    // Clear all simulation data
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setScreen('dashboard');
  };

  // Filter simulations based on search query
  const filteredSimulations = allSimulations.filter(sim => {
    const query = searchQuery.toLowerCase();

    // First filter by treatment
    const farmer = farmersData.find(f => f.farmerID === sim.farmer.id);
    if (treatmentFilter && farmer && farmer.treatment !== treatmentFilter) {
      return false;
    }

    return (
      sim.farmer.name.toLowerCase().includes(query) ||
      sim.farmer.id.toLowerCase().includes(query) ||
      new Date(sim.timestamp).toLocaleDateString().includes(query)
    );
  });

  // Handle home click
  const handleHomeClick = () => {
    // Clear all simulation data and return to dashboard
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setPracticesWithLikelihood({});
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setScreen('dashboard');
    setError('');
  };

  // Handle logo click
  const handleLogoClick = () => {
    // Clear all simulation data and return to dashboard
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setScreen('dashboard');
    setError('');
  };

  // Handle login
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
        setAuthScreen(null);
        setScreen('selection');
        await loadUserData(user.username);
      } else {
        setAuthError('Invalid username or password');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    }
  };

  // Handle register
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
      setAuthScreen('login');
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear draft on logout
    if (currentUser) {
      localStorage.removeItem(`draft_${currentUser.username}`);
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAuthScreen('landing');
    setScreen('selection');
    setAllSimulations([]);
  };

  // Handle farmer lookup
  const handleFarmerLookup = () => {
    // Check if farmer already has completed simulation
    const existingSimulation = allSimulations.find(sim => sim.farmer.id === farmerID);
    if (existingSimulation) {
      setError('This farmer already has a completed simulation. Please delete it from the dashboard before creating a new one.');
      return;
    }

    const filteredFarmers = getFilteredFarmers();
    const farmer = filteredFarmers.find(f => f.farmerID === farmerID);
    if (farmer) {
      setCurrentFarmer({
        ...farmer,
        currentKhetscore: roundScore(farmer.Khetscore),
        initialKhetscore: roundScore(farmer.Khetscore)
      });
      setError('');
      setCurrentSeason(1);
      setSeasonData([]);
      setSessionHistory({
        season1: { practices: [], weather: null, score: roundScore(farmer.Khetscore), likelihood: {} },
        season2: { practices: [], weather: null, score: roundScore(farmer.Khetscore), likelihood: {} },
        season3: { practices: [], weather: null, score: roundScore(farmer.Khetscore), likelihood: {} }
      });
      setScreen('season-intro');
    } else {
      setError('Farmer ID not found');
    }
  };

  // Handle farmer selection from list
  const handleSelectFarmer = (farmer) => {
    setFarmerID(farmer.farmerID);
  };

  // Handle weather continue
  const handleWeatherContinue = () => {
    // Skip directly to next season or summary since likelihood is already captured
    const seasonRecord = {
      season: currentSeason,
      seasonType: currentSeason % 2 === 1 ? 'Rabi' : 'Kharif',
      practices: selectedPractices.map(id => practices.find(p => p.id === id).name),
      weatherShock: weatherShock ? weatherShock.name : 'None',
      endScore: currentFarmer.currentKhetscore,
      likelihood: { ...likelihoodAnswers }
    };
    
    setSeasonData(prev => [...prev, seasonRecord]);
    
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
      setPracticesWithLikelihood({}); // Reset for next season
      setScreen('season-intro');
    } else {
      setScreen('summary');
    }
  };

  // Handle practice selection with likelihood
  const handlePracticeSelection = (practiceId) => {
    setPracticesWithLikelihood(prev => {
      const newState = { ...prev };
      if (newState[practiceId]) {
        // If already selected, remove it
        delete newState[practiceId];
      } else {
        // Add new selection without likelihood
        newState[practiceId] = { selected: true, likelihood: null };
      }
      return newState;
    });
  };

  // Handle likelihood selection for practice
  const handleLikelihoodSelection = (practiceId, likelihood) => {
    setPracticesWithLikelihood(prev => ({
      ...prev,
      [practiceId]: { ...prev[practiceId], likelihood }
    }));
  };

  // Handle export CSV
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

  // Handle view summary of previous simulation
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

  // Handle back button
  const handleBackButton = () => {
    if (screen === 'farmer-lookup') {
      handleHomeClick(); // Go to dashboard and clear data
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
                setAuthScreen('login');
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

  // Selection Screen (First Page)
  if (screen === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-white/10 backdrop-blur-sm p-8 rounded-full mb-6">
            <Leaf className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Welcome to KhetScore</h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Please select your category to continue
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <button
            onClick={() => {
              setTreatmentFilter('treat1');
              setScreen('info-path1');
            }}
            className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group"
          >
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Users className="w-10 h-10 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Treatment 1</h2>
            </div>
          </button>
          
          <button
            onClick={() => {
              setTreatmentFilter('treat2');
              setScreen('info-path2');
            }}
            className="bg-white p-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 group"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="w-10 h-10 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Treatment 2</h2>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Info Page - Path 1 with Image Slideshow
  if (screen === 'info-path1') {
    return <InfoPath1 setScreen={setScreen} setTreatmentFilter={setTreatmentFilter} />;
  }

  // Info Page - Path 2 with Image Slideshow
  if (screen === 'info-path2') {
    return <InfoPath2 setScreen={setScreen} setTreatmentFilter={setTreatmentFilter} />;
  }

  // Info Page - Simulation
  if (screen === 'sim-InfoPage') {
    const simImage = {
      src: '/simulation_rules.png', // place under public/
      alt: 'Simulation Info'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <header className="bg-green-600 text-white p-4 sm:p-6 text-center">
            <div className="inline-block bg-white/20 p-2 rounded-full mb-3">
              <BookOpen className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Simulation Information</h1>
          </header>

          {/* Image / Content */}
          <main className="relative bg-gray-900">
            <div className="h-[24rem] sm:h-[30rem]">
              <img
                src={simImage.src}
                alt={simImage.alt}
                className="w-full h-full object-contain bg-gray-900"
                onError={(e) => { e.currentTarget.alt = 'Image failed to load'; }}
              />
            </div>
          </main>

          {/* Action Buttons pinned to bottom within the card */}
          <div className="p-6 sm:p-8 pt-0 mt-auto flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => {
                setScreen('selection');
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
            >
              ← Back to Selection
            </button>

            <button
              type="button"
              onClick={() => setScreen('dashboard')}
              className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition shadow-lg hover:shadow-xl"
            >
              Continue to KhetScore →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
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
                <LanguageToggle language={language} setLanguage={setLanguage} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Total Simulations (filtered by treatment) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Total Simulations</h3>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-700">
                {allSimulations.filter(sim => {
                  const farmer = farmersData.find(f => f.farmerID === sim.farmer.id);
                  return treatmentFilter && farmer ? farmer.treatment === treatmentFilter : true;
                }).length}
              </p>
              <p className="text-xs text-gray-500 mt-2">Treatment: {treatmentFilter}</p>
            </div>

            {/* Farmers Tracked (filtered by treatment) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Farmers Tracked</h3>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-blue-700">
                {new Set(
                  allSimulations
                    .filter(sim => {
                      const farmer = farmersData.find(f => f.farmerID === sim.farmer.id);
                      return treatmentFilter && farmer ? farmer.treatment === treatmentFilter : true;
                    })
                    .map(s => s.farmer.id)
                ).size}
              </p>
              <p className="text-xs text-gray-500 mt-2">Treatment: {treatmentFilter}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Start New Simulation</h3>
            <button
              onClick={() => {
                setFarmerID(''); // Clear farmer ID
                setScreen('farmer-lookup');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Begin Simulation
            </button>
          </div>

          {allSimulations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Recent Simulations</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by farmer name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-64"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              {filteredSimulations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No simulations found matching your search.' : 'No simulations yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSimulations.slice(-10).reverse().map((sim) => (
                    <div key={sim.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{sim.farmer.name}</p>
                          <p className="text-sm text-gray-600">ID: {sim.farmer.id}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(sim.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
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
                              title="View Summary"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleExportCSV(sim)}
                              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              title="Export to CSV"
                            >
                              <Download className="w-4 h-4" />
                              Export
                            </button>
                            <button
                              onClick={() => confirmDelete(sim)}
                              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              title="Delete Simulation"
                            >
                              <AlertCircle className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && simulationToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-xl font-bold text-gray-800">Delete Simulation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the simulation for{' '}
                <strong>{simulationToDelete.farmer.name}</strong>?
              </p>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-6">
                <p className="text-sm text-red-800">
                  This action cannot be undone. All data for this simulation will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteSimulation(simulationToDelete.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSimulationToDelete(null);
                  }}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
                <LanguageToggle language={language} setLanguage={setLanguage} />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer ID</label>
                <input
                  type="text"
                  value={farmerID}
                  onChange={(e) => {
                    setFarmerID(e.target.value);
                    setError('');
                  }}
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

              <button
                onClick={() => setShowFarmerList(true)}
                disabled={csvLoading || getFilteredFarmers().length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Users className="w-5 h-5" />
                {csvLoading ? 'Loading...' : `View All Farmers (${getFilteredFarmers().length})`}
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
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Available Farmers ({treatmentFilter}):</strong> {getFilteredFarmers().length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Showing only farmers in treatment group: <span className="font-semibold">{treatmentFilter}</span>
                  </p>
                </div>
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
                {getFilteredFarmers().length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No farmer data available for this treatment group</p>
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
                      {getFilteredFarmers().map((farmer, idx) => (
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
    
    // Build comparison data based on current season
    const getComparisonData = () => {
      const values = [currentFarmer.initialKhetscore];
      const labels = ['Initial'];
      
      if (currentSeason >= 2 && seasonData.length >= 1) {
        values.push(seasonData[0].endScore);
        labels.push('Season 1 Rabi');
      }
      
      if (currentSeason >= 3 && seasonData.length >= 2) {
        values.push(seasonData[1].endScore);
        labels.push('Season 2 Kharif');
      }
      
      return { values, labels };
    };
    
    const comparisonData = getComparisonData();

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
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">Season {currentSeason} - {seasonType} Season</h2>
              <p className="text-gray-600 mb-4">Farmer: {currentFarmer.Name}</p>
            </div>
            
            <ComparisonBarChart 
              values={comparisonData.values}
              labels={comparisonData.labels}
              title="Khetscore Progress Before Season"
            />
            
            <button
              onClick={() => setScreen('practice-selection')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-8"
            >
              Select Agricultural Practices <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice Selection Screen with Integrated Likelihood
  if (screen === 'practice-selection') {
    // Group practices by category
    const groupedPractices = practices.reduce((acc, practice) => {
      if (!acc[practice.category]) acc[practice.category] = [];
      acc[practice.category].push(practice);
      return acc;
    }, {});

    const selectedCount = Object.keys(practicesWithLikelihood).length;
    const allLikelihoodsSelected = Object.values(practicesWithLikelihood).every(
      p => p.likelihood !== null
    );

    const handleContinue = () => {
      if (selectedCount < 1) {
        setError('Please select at least 1 practice');
        return;
      }
      if (!allLikelihoodsSelected) {
        setError('Please select likelihood for all chosen practices');
        return;
      }
      setError('');
      
      // Extract just the IDs for processing
      const practiceIds = Object.keys(practicesWithLikelihood).map(id => parseInt(id));
      setSelectedPractices(practiceIds);
      
      // Store likelihood answers
      const likelihoodData = {};
      Object.entries(practicesWithLikelihood).forEach(([id, data]) => {
        likelihoodData[id] = data.likelihood;
      });
      setLikelihoodAnswers(likelihoodData);
      
      // Calculate score and proceed
      const hasShock = Math.random() < 0.5;
      const shock = hasShock ? weatherShocks[Math.floor(Math.random() * weatherShocks.length)] : null;
      setWeatherShock(shock);
      
      const practiceBonus = practiceIds.reduce((sum, id) => {
        const practice = practices.find(p => p.id === id);
        return sum + practice.weight;
      }, 0);
      
      const shockImpact = shock ? shock.impact : 0;
      const newScore = Math.max(0, Math.min(100, currentFarmer.currentKhetscore + practiceBonus - Math.abs(shockImpact * currentFarmer.currentKhetscore)));
      
      setCurrentFarmer(prev => ({ ...prev, currentKhetscore: roundScore(newScore) }));
      
      const seasonKey = `season${currentSeason}`;
      setSessionHistory(prev => ({
        ...prev,
        [seasonKey]: {
          ...prev[seasonKey],
          practices: practiceIds,
          weather: shock,
          score: roundScore(newScore)
        }
      }));
      
      setScreen('weather-result');
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
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">Select Agricultural Practices</h2>
              <p className="text-gray-600">Season {currentSeason} - Choose at least 1 practice and rate likelihood</p>
              <div className="mt-2 inline-block bg-blue-100 px-4 py-2 rounded-lg">
                <span className="font-medium text-blue-800">Selected: {selectedCount}</span>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-8 max-h-[600px] overflow-y-auto mb-6 pr-2">
              {Object.entries(groupedPractices).map(([category, categoryPractices]) => (
                <div key={category} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="font-bold text-lg text-green-700 mb-4 bg-green-50 p-3 rounded-lg">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categoryPractices.map(practice => {
                      const isSelected = practicesWithLikelihood[practice.id]?.selected;
                      const selectedLikelihood = practicesWithLikelihood[practice.id]?.likelihood;
                      
                      return (
                        <div
                          key={practice.id}
                          className={`border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          {/* Practice Header with Checkbox */}
                          <label className="flex items-start gap-3 p-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={() => handlePracticeSelection(practice.id)}
                              className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <span className="text-sm text-gray-700 font-medium flex-1">
                                  {practice.name}
                                </span>
                                <div className="flex gap-3 text-xs">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                                    {practice.season}
                                  </span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold">
                                    Weight: {practice.weight}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </label>
                          
                          {/* Likelihood Options - Only show if practice is selected */}
                          {isSelected && (
                            <div className="px-4 pb-4 border-t border-green-200 pt-3 mt-2 bg-white">
                              <p className="text-xs text-gray-600 mb-2 font-medium">
                                How likely are you to do this practice?
                              </p>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {[
                                  "Definitely won't do it",
                                  "Probably won't do it",
                                  "Probably will do it",
                                  "Definitely will do it"
                                ].map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => handleLikelihoodSelection(practice.id, option)}
                                    className={`p-2 border-2 rounded-lg text-xs transition-all ${
                                      selectedLikelihood === option
                                        ? 'border-green-600 bg-green-100 text-green-800 font-semibold'
                                        : 'border-gray-300 hover:border-green-400 text-gray-700'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleContinue}
              disabled={selectedCount < 1 || !allLikelihoodsSelected}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
            
            {selectedCount > 0 && !allLikelihoodsSelected && (
              <p className="text-sm text-orange-600 text-center mt-2">
                Please select likelihood for all {selectedCount} chosen practices
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Weather Result Screen
  if (screen === 'weather-result') {
    const WeatherIcon = weatherShock ? weatherShock.icon : null;
    const seasonType = currentSeason % 2 === 1 ? 'Rabi' : 'Kharif';
    
    // Build comparison data including current season result
    const getResultComparisonData = () => {
      const values = [currentFarmer.initialKhetscore];
      const labels = ['Initial'];
      
      // Add previous seasons
      for (let i = 0; i < currentSeason - 1; i++) {
        if (seasonData[i]) {
          values.push(seasonData[i].endScore);
          labels.push(`Season ${i + 1} ${seasonData[i].seasonType}`);
        }
      }
      
      // Add current season
      values.push(currentFarmer.currentKhetscore);
      labels.push(`Season ${currentSeason} ${seasonType}`);
      
      return { values, labels };
    };
    
    const resultData = getResultComparisonData();
    
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
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Season {currentSeason} {seasonType} Results</h2>
              
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
              
              <ComparisonBarChart 
                values={resultData.values}
                labels={resultData.labels}
                title={`Season ${currentSeason} ${seasonType} - Khetscore Comparison`}
              />
              
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 mt-6 max-h-64 overflow-y-auto">
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
                Continue with Simulation <ChevronRight className="w-5 h-5" />
              </button>
            </div>
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
                  {value}
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
                const seasonLabels = ['Start', 'Rabi', 'Kharif', 'Rabi'].slice(0, idx + 2);
                
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