// khetscore-app/src/App.js
// import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle, CloudRain, Droplets, Bug, Sun, LogOut, Users, BarChart3, TrendingUp, Leaf, ArrowLeft, Eye, EyeOff, PlayCircle, Home, BookOpen, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';
import { loadGoogleApi, uploadToGoogleDrive } from './googleDriveService';

// Agricultural practices for Treatment 1 with their weights, seasons, and categories
const practices = [
  { id: 1, name: "Use pesticides/fungicides (only when needed, as per IPM advice)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 2, name: "Balanced fertilizer use (small, need-based doses instead of excess)", category: "Productivity", weight: 0.4, season: "During Season" },
  { id: 3, name: "IPM - Pheromone/sticky traps for pest control (low cost)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 4, name: "Apply organic manure (farmyard manure, cow dung, vermicompost, dhaincha green manure)", category: "Nutrition", weight: 0.07, season: "During Season" },
  { id: 5, name: "Regular soil and water testing (often free at KVKs)", category: "Nutrition", weight: 0.07, season: "Before Season" },
  { id: 6, name: "Proper bund and drainage maintenance using family/community labor", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 7, name: "Live fencing (bamboo, thorn bushes) to prevent animals from entering fields", category: "Damage protection", weight: 0.13, season: "Before Season" },
  { id: 8, name: "Use free govt. apps for prices and weather (Kisan Suvidha, mKisan)", category: "Damage protection", weight: 0.13, season: "During Season" },
  { id: 9, name: "Consult with KVK experts", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 10, name: "Lease small extra plots of land seasonally", category: "Farm Area", weight: 0.05, season: "Before Season" },
  { id: 11, name: "Convert fallow/waste land into cultivation (if available)", category: "Farm Area", weight: 0.05, season: "Before Season" },
  { id: 12, name: "Solar/diesel pumps (shared among farmer groups)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 13, name: "Simple drainage channels (community effort with small cost)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 14, name: "Buying improved/hybrid paddy seed", category: "Productivity", weight: 0.4, season: "Before Season" },
  { id: 15, name: "paddy transplanters, combine harvesters, tractors", category: "Productivity", weight: 0.4, season: "After Harvest" }
];

// Agricultural practices for Treatment 2 with their weights, seasons, and categories
const practicesTreatment2 = [
  { id: 1, name: "Use pesticides/fungicides (only when needed, as per IPM advice)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 2, name: "Balanced fertilizer use (small, need-based doses instead of excess)", category: "Productivity", weight: 0.4, season: "During Season" },
  { id: 3, name: "IPM - Pheromone/sticky traps for pest control (low cost)", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 4, name: "Apply organic manure (farmyard manure, cow dung, vermicompost, dhaincha green manure)", category: "Nutrition", weight: 0.07, season: "During Season" },
  { id: 5, name: "Regular soil and water testing (often free at KVKs)", category: "Nutrition", weight: 0.07, season: "Before Season" },
  { id: 6, name: "Proper bund and drainage maintenance using family/community labor", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 7, name: "Live fencing (bamboo, thorn bushes) to prevent animals from entering fields", category: "Damage protection", weight: 0.13, season: "Before Season" },
  { id: 8, name: "Use free govt. apps for prices and weather (Kisan Suvidha, mKisan)", category: "Damage protection", weight: 0.13, season: "During Season" },
  { id: 9, name: "Consult with KVK experts", category: "Crop health", weight: 0.2, season: "During Season" },
  { id: 10, name: "Lease small extra plots of land seasonally", category: "Farm Area", weight: 0.05, season: "Before Season" },
  { id: 11, name: "Convert fallow/waste land into cultivation (if available)", category: "Farm Area", weight: 0.05, season: "Before Season" },
  { id: 12, name: "Solar/diesel pumps (shared among farmer groups)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 13, name: "Simple drainage channels (community effort with small cost)", category: "Irrigation", weight: 0.15, season: "Before Season" },
  { id: 14, name: "Buying improved/hybrid paddy seed", category: "Productivity", weight: 0.4, season: "Before Season" },
  { id: 15, name: "paddy transplanters, combine harvesters, tractors", category: "Productivity", weight: 0.4, season: "After Harvest" },
  // Additional practices for Treatment 2
  { id: 16, name: "Set aside part of your harvest income for loan repayment first", category: "Repayment behavior", weight: 0.1, season: "After Harvest" },
  { id: 17, name: "Avoid taking multiple loans from different lenders at the same time", category: "Repayment behavior", weight: 0.1, season: "During Season" },
  { id: 18, name: "Repay small amounts regularly instead of one large payment", category: "Repayment behavior", weight: 0.1, season: "During Season" }
];

// Translation object for all text content
const translations = {
  english: {
    // Dashboard
    dashboard: "Dashboard",
    manageActivities: "Manage your agricultural simulation activities",
    totalSimulations: "Total Simulations",
    farmersTracked: "Farmers Tracked",
    startNewSimulation: "Start New Simulation",
    beginSimulation: "Begin Simulation",
    recentSimulations: "Recent Simulations",
    searchPlaceholder: "Search by farmer name or ID...",
    welcome: "Welcome",
    logout: "Logout",
    view: "View",
    export: "Export",
    delete: "Delete",
    scoreChange: "Score Change",
    backToSelection: "Back to Selection",
    treatment: "Treatment",
    
    // Farmer Lookup
    enterFarmerID: "Enter Farmer ID",
    farmerID: "Farmer ID",
    continue: "Continue",
    backToDashboard: "Back to Dashboard",
    viewAllFarmers: "View All Farmers",
    availableFarmers: "Available Farmers",
    farmerNotFound: "Farmer ID not found",
    farmerAlreadySimulated: "This farmer already has a completed simulation. Please select another farmer.",
    loadingFarmerData: "Loading farmer data...",
    allFarmers: "All Farmers",
    name: "Name",
    khetscore: "Khetscore",
    action: "Action",
    select: "Select",
    close: "Close",
    simulationCompleted: "Simulation completed for Farmer ID",
    
    // Season Intro
    season: "Season",
    rabiSeason: "Rabi Season",
    kharifSeason: "Kharif Season",
    farmer: "Farmer",
    khetscoreProgress: "Khetscore Progress Before Season",
    selectAgriPractices: "Select Agricultural Practices",
    initial: "Initial",
    
    // Practice Selection
    selectPractices: "Select Agricultural Practices",
    choosePractices: "Choose at least 1 practice and rate likelihood",
    selected: "Selected",
    weight: "Weight",
    howLikely: "How likely are you to do this practice?",
    pleaseSelectPractice: "Please select at least 1 practice",
    pleaseSelectLikelihood: "Please select likelihood for all chosen practices",
    
    // Weather Result
    results: "Results",
    weatherShock: "Weather Shock",
    noWeatherShock: "No Weather Shock",
    favorableConditions: "Favorable weather conditions this season",
    farmAffected: "Your farm was affected by",
    selectedPracticesLabel: "Selected Practices",
    continueSimulation: "Continue with Simulation",
    khetscoreComparison: "Khetscore Comparison",
    
    // Summary
    simulationComplete: "Simulation Complete!",
    initialKhetscore: "Initial Khetscore",
    start: "Start",
    final: "Final",
    seasonDetails: "Season Details",
    weather: "Weather",
    withWeather: "With Weather",
    noWeather: "No Weather",
    practicesSelected: "Practices Selected",
    scoreProgression: "Score Progression",
    exportCSV: "Export to CSV",
    saveReturn: "Save & Return to Dashboard",
    uploadToDrive: "Upload to Drive",
    noWeatherScore: "No Weather",
    
    // Common
    home: "Home",
    back: "Back",
    
    // Likelihood options
    definitelyWont: "Definitely won't do it",
    probablyWont: "Probably won't do it",
    probablyWill: "Probably will do it",
    definitelyWill: "Definitely will do it",

    //new additions
    comprehensionCheck: "Comprehension Check",
    comprehensionInstructions: "Please answer the following questions to proceed",
    questionLabel: "Question",
    selectAnswer: "Select an answer",
    pleaseAnswerAll: "Please answer all questions before continuing",
    videoTitle: "Watch Tutorial Video",
    answered: "Answered",
    information: "Information",
    watchVideo: "Watch Video",
    simulationInfo: "Simulation Information",
    continueToKhetscore: "Continue to KhetScore",
  },
  hindi: {
    // Dashboard
    dashboard: "ଡ୍ୟାଶବୋର୍ଡ",
    manageActivities: "ଆପଣଙ୍କର କୃଷି ସିମୁଲେସନ୍ କାର୍ଯ୍ୟକଳାପ ପରିଚାଳନା କରନ୍ତୁ",
    totalSimulations: "ମୋଟ ସିମୁଲେସନ୍",
    farmersTracked: "ଟ୍ରାକ୍ କରାଯାଇଥିବା କୃଷକମାନେ",
    startNewSimulation: "ନୂତନ ସିମୁଲେସନ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    beginSimulation: "ସିମୁଲେସନ୍ ଆରମ୍ଭ କରନ୍ତୁ",
    recentSimulations: "ସମ୍ପ୍ରତି ସିମୁଲେସନ୍",
    searchPlaceholder: "କୃଷକଙ୍କର ନାମ କିମ୍ବା ID ଦ୍ୱାରା ସନ୍ଧାନ କରନ୍ତୁ...",
    welcome: "ସ୍ୱାଗତ",
    logout: "ଲଗ୍ ଆଉଟ୍",
    view: "ଦେଖନ୍ତୁ",
    export: "ନିର୍ୟାତ",
    delete: "ମିଟାନ୍ତୁ",
    scoreChange: "ସ୍କୋର ପରିବର୍ତ୍ତନ",
    backToSelection: "ଚୟନକୁ ଫେରନ୍ତୁ",
    treatment: "ଚିକିତ୍ସା",
    
    // Farmer Lookup
    enterFarmerID: "କୃଷକ ID ଦାଖଲ କରନ୍ତୁ",
    farmerID: "କୃଷକ ID",
    continue: "ଚାଲୁ ରଖନ୍ତୁ",
    backToDashboard: "ଡ୍ୟାଶବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    viewAllFarmers: "ସମସ୍ତ କୃଷକମାନେ ଦେଖନ୍ତୁ",
    availableFarmers: "ଉପଲବ୍ଧ କୃଷକମାନେ",
    farmerNotFound: "କୃଷକ ID ମିଳିଲା ନାହିଁ",
    farmerAlreadySimulated: "ଏହି କୃଷକଙ୍କର ସିମୁଲେସନ ପୂର୍ବରୁ ସମାପ୍ତ ହୋଇଛି। ଦୟାକରି ଅନ୍ୟ କୃଷକ ID ପ୍ରବେଶ କରନ୍ତୁ",
    loadingFarmerData: "କୃଷକ ତଥ୍ୟ ଲୋଡ୍ ହେଉଛି...",
    allFarmers: "ସମସ୍ତ କୃଷକ",
    name: "ନାମ",
    khetscore: "ଖେତସ୍କୋର",
    action: "କାର୍ଯ୍ୟ",
    select: "ଚୁନନ୍ତୁ",
    close: "ବନ୍ଦ କରନ୍ତୁ",
    simulationCompleted: "କୃଷକ ID ପାଇଁ ସିମୁଲେସନ ସମାପ୍ତ ହୋଇଛି",
    
    // Season Intro
    season: "ଋତୁ",
    rabiSeason: "ରବି ଋତୁ ",
    kharifSeason: "ଖରିଫ ଋତୁ ",
    farmer: "କୃଷକ",
    khetscoreProgress: "ଏହି ଋତୁରେ ଚାଷ ଆରମ୍ଭ ଆଗରୁ ଖେତସ୍କୋର",
    selectAgriPractices: "କୃଷି ପ୍ରଥାମାନେ ଚୟନ କରନ୍ତୁ",
    initial: "ଆରମ୍ଭିକ",
    
    // Practice Selection
    selectPractices: "କୃଷି ପ୍ରଥାମାନେ ଚୟନ କରନ୍ତୁ",
    choosePractices: "କମ୍ ସେ କମ୍ 1 ପ୍ରଥା ଚୟନ କରନ୍ତୁ ଏବଂ ସମ୍ଭାବନା ଦର୍ଶାନ୍ତୁ",
    selected: "ଚୟନିତ",
    weight: "ଓଜନ",
    howLikely: "ଆପଣ ଏହି ପ୍ରଥା କେତେ ସମ୍ଭାବନା ସହିତ କରିବେ?",
    pleaseSelectPractice: "ଦୟାକରି କମ୍ ସେ କମ୍ 1 ପ୍ରଥା ଚୟନ କରନ୍ତୁ",
    pleaseSelectLikelihood: "ଦୟାକରି ସମସ୍ତ ଚୟନିତ ପ୍ରଥାମାନେ ପାଇଁ ସମ୍ଭାବନା ଚୟନ କରନ୍ତୁ",
    
    // Weather Result
    results: "ପରିଣାମ",
    weatherShock: "ମୌସମ ଝଟକା",
    noWeatherShock: "ଚାଷ କୁ କ୍ଷତି କଲା ଭଳି କିଛି ବି ବିପର୍ଯୟ ଏହି ଋତୁରେ ହୋଇନାହିଁ",
    favorableConditions: "ଏହି ଋତୁ ଟି ଚାଷ କାମ ପାଇଁ ଅନୁକୂଳ ଥିଲା",
    farmAffected: "ଆପଣଙ୍କର କ୍ଷେତ ପ୍ରଭାବିତ ହୋଇଛି",
    selectedPracticesLabel: "ଚୟନିତ ପ୍ରଥାମାନେ",
    continueSimulation: "ସିମୁଲେସନ୍ ଜାରି ରଖନ୍ତୁ",
    khetscoreComparison: "ଖେତସ୍କୋର ର ତୁଳନା",
    
    // Summary
    simulationComplete: "ସିମୁଲେସନ୍ ସମ୍ପୂର୍ଣ୍ଣ!",
    initialKhetscore: "ଆରମ୍ଭିକ ଖେତସ୍କୋର",
    start: "ଆରମ୍ଭ",
    final: "ଅନ୍ତିମ",
    seasonDetails: "ମୌସମ ବିବରଣୀ",
    weather: "ଋତୁ",
    withWeather: "ଋତୁ ସହିତ",
    noWeather: "ବିନା ଋତୁ",
    practicesSelected: "ଚୟନିତ ପ୍ରଥାମାନେ",
    scoreProgression: "ସ୍କୋର ପ୍ରଗତି",
    exportCSV: "CSV ରେ ନିର୍ୟାତ କରନ୍ତୁ",
    saveReturn: "ସଞ୍ଚୟ କରନ୍ତୁ ଏବଂ ଡ୍ୟାଶବୋର୍ଡକୁ ଫେରନ୍ତୁ",
    uploadToDrive: "ଡ୍ରାଇଭ୍‌କୁ ଅପଲୋଡ୍ କରନ୍ତୁ",
    noWeatherScore: "ବିନା କ୍ଷୟକ୍ଷତି ଖେତସ୍କୋର",
    
    // Common
    home: "ହୋମ୍",
    back: "ବ୍ୟାକ",

    // Likelihood options
    definitelyWont: "ନିଶ୍ଚିତ ଭାବରେ ଏହା କରିବ ନାହିଁ",
    probablyWont: "ଶାୟଦ ନ କରିବି",
    probablyWill: "ଶାୟଦ କରିବି",
    definitelyWill: "ନିଶ୍ଚିତ ଭାବରେ କରିବି",

    //new additions
    comprehensionCheck: "ବୁଝାମଣା ଯାଞ୍ଚ",
    comprehensionInstructions: "ଆଗକୁ ବଢ଼ିବା ପାଇଁ ଦୟାକରି ନିମ୍ନଲିଖିତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ",
    questionLabel: "ପ୍ରଶ୍ନ",
    selectAnswer: "ଏକ ଉତ୍ତର ଚୟନ କରନ୍ତୁ",
    pleaseAnswerAll: "ଜାରି ରଖିବା ପୂର୍ବରୁ ଦୟାକରି ସମସ୍ତ ପ୍ରଶ୍ନର ଉତ୍ତର ଦିଅନ୍ତୁ",
    videoTitle: "ଟ୍ୟୁଟୋରିଆଲ୍ ଭିଡିଓ ଦେଖନ୍ତୁ",
    answered: "ଉତ୍ତର ଦିଆଯାଇଛି",
    information: "ସୂଚନା",
    watchVideo: "ଭିଡିଓ ଦେଖନ୍ତୁ",
    simulationInfo: "ସିମୁଲେସନ୍ ସୂଚନା",
    continueToKhetscore: "KhetScore କୁ ଜାରି ରଖନ୍ତୁ",
  }
};

// Practices translations (Hindi)
const practicesHindi = [
  { id: 1, name: "କୀଟନାଶକ / କବକନାଶକ ବ୍ୟବହାର କରନ୍ତୁ (କେବଳ ଆବଶ୍ୟକ ହେଲେ, IPM ପରାମର୍ଶ ଅନୁସାରେ)", category: "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ", weight: 0.2, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 2, name: "ସନ୍ତୁଳିତ ସାର ବ୍ୟବହାର (ଅଧିକ ନୁହେଁ ବରଂ ଛୋଟ, ଆବଶ୍ୟକତା ଆଧାରିତ ମାତ୍ରା)", category: "ଉତ୍ପାଦନଶୀଳତା", weight: 0.4, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 3, name: "IPM ସମନ୍ୱିତ କୀଟପତଙ୍ଗ ପରିଚାଳନା - କୀଟପତଙ୍ଗ ନିୟନ୍ତ୍ରଣ ପାଇଁ ଫେରୋମୋନ/ଷ୍ଟିକି ଫାଶ", category: "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ", weight: 0.2, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 4, name: "ଜୈବିକ ସାର (କୃଷି ଖତ, ଗୋବର, ଭର୍ମି କମ୍ପୋଷ୍ଟ, ଧୈଞ୍ଚା ସବୁଜ ସାର) ପ୍ରୟୋଗ କରନ୍ତୁ।", category: "ଫସଲ କୁ ସାର ଯୋଗାଇବା", weight: 0.07, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 5, name: "ନିୟମିତ ମାଟି ଏବଂ ଜଳ ପରୀକ୍ଷା (ପ୍ରାୟତଃ KVK ରେ ମାଗଣା)", category: "ଫସଲ କୁ ସାର ଯୋଗାଇବା", weight: 0.07, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 6, name: "ପରିବାର/ସମ୍ପ୍ରଦାୟ ଶ୍ରମ ବ୍ୟବହାର କରି ଉପଯୁକ୍ତ ବନ୍ଧ ଏବଂ ଜଳ ନିଷ୍କାସନ ରକ୍ଷଣାବେକ୍ଷଣ", category: "ଜଳସେଚନ", weight: 0.15, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 7, name: "ପଶୁମାନଙ୍କୁ କ୍ଷେତରେ ପ୍ରବେଶ କରିବାକୁ ରୋକିବା ପାଇଁ ବାଡ଼ (ବାଉଁଶ, କଣ୍ଟା ବୁଦା)", category: "ଫସଲ କୁ କ୍ଷତି ରୁ ବଞ୍ଚାଇବା", weight: 0.13, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 8, name: "ଫସଲ ଦରଦାମ ଏବଂ ପାଣିପାଗ ପାଇଁ ମାଗଣା ସରକାରୀ ଆପ୍ ବ୍ୟବହାର କରନ୍ତୁ (କିଷାନ ସୁବିଧା, mKisan)", category: "ଫସଲ କୁ କ୍ଷତି ରୁ ବଞ୍ଚାଇବା", weight: 0.13, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 9, name: "KVK ବିଶେଷଜ୍ଞଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ", category: "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ", weight: 0.2, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 10, name: "ଋତୁ ଅନୁଯାୟୀ ଛୋଟ ଅତିରିକ୍ତ ଜମି ଲିଜ୍ ରେ ନିଅନ୍ତୁ", category: "ଚାଷରେ ନିରନ୍ତରତା", weight: 0.05, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 11, name: "ପତିତ ଜମିକୁ ଚାଷ ଜମି ରେ  ପରିଣତ କରନ୍ତୁ (ଯଦି ଉପଲବ୍ଧ ଥାଏ)", category: "ଚାଷରେ ନିରନ୍ତରତା", weight: 0.05, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 12, name: "ଅନ୍ୟ ଚାଷୀ ମାନଙ୍କ ସଂଗେ ମିଶିକି ସୋଲାର ପମ୍ପ କିମ୍ୱା ଡ଼ିସେଲ ପମ୍ପ ବ୍ୟବହାର କରନ୍ତୁ", category: "ଜଳସେଚନ", weight: 0.15, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 13, name: "ଜଳ ନିଷ୍କାସନ ଚ୍ୟାନେଲ (କମ୍ ଖର୍ଚ୍ଚରେ )", category: "ଜଳସେଚନ", weight: 0.15, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 14, name: "ଉନ୍ନତ କିସମର କିମ୍ବା ସଂକର ଜାତୀୟ  ଧାନ ବିହନ କିଣିବି", category: "ଉତ୍ପାଦନଶୀଳତା", weight: 0.4, season: "ଚାଷ କାମ ଆରମ୍ଭ ହେବା ଆଗରୁ" },
  { id: 15, name: "ଧାନ ପ୍ରତିରୋପଣ ଯନ୍ତ୍ର, କମ୍ବାଇନ୍ ହାର୍ଭେଷ୍ଟର, ଟ୍ରାକ୍ଟର", category: "ଉତ୍ପାଦନଶୀଳତା", weight: 0.4, season: "ଫସଲ ଅମଳ ହେବା ପରେ" }
];

const practicesTreatment2Hindi = [
  ...practicesHindi,
  { id: 16, name: "ଆପଣଙ୍କ ଫସଲ ଆୟର କିଛି ଅଂଶ ପ୍ରଥମେ ଋଣ ପରିଶୋଧ ପାଇଁ ରଖନ୍ତୁ।", category: "ଋଣ ପରିଶୋଧ କରିବାର ଅଭ୍ୟାସ", weight: 0.1, season: "ଫସଲ ଅମଳ ହେବା ପରେ" },
  { id: 17, name: "ଏକ ସମୟରେ ବିଭିନ୍ନ ଋଣଦାତାଙ୍କଠାରୁ ଏକାଧିକ ଋଣ ନେବାରୁ ଦୂରେଇ ରୁହନ୍ତୁ।", category: "ଋଣ ପରିଶୋଧ କରିବାର ଅଭ୍ୟାସ", weight: 0.1, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" },
  { id: 18, name: "ଗୋଟିଏ ବଡ଼ ଦେୟ ବଦଳରେ ନିୟମିତ ଭାବରେ ଅଳ୍ପ ପରିମାଣରେ ଋଣ ପରିଶୋଧ କରନ୍ତୁ", category: "ଋଣ ପରିଶୋଧ କରିବାର ଅଭ୍ୟାସ", weight: 0.1, season: "ଚାଷ କାମ ଚାଲିଥିବା ସମୟରେ" }
];

// Comprehension questions for Treatment 1
const comprehensionQuestionsTreatment1 = {
  english: [
    {
      id: 1,
      question: "Which component of Khetscore holds the highest importance in calculating your khetscore?",
      options: ["Productivity", "Crop health", "Irrigation", "Nutrition"]
    },
    {
      id: 2,
      question: "If the leaves of your plants turn yellow or insects attack them, what does that say about your crop health?",
      options: ["Crop health is good", "Crop health is poor", "Crop health stays the same"]
    },
    {
      id: 3,
      question: "What happens to your productivity score when you regularly grow crops on your land without leaving it empty?",
      options: ["The score goes up", "The score goes down", "The score stays the same"]
    },
    {
      id: 4,
      question: "Which of the following can reduce your harvest because it harms the crop?",
      options: ["Insects eating leaves", "Flooding, hail, or machines breaking plants", "Both a and b"]
    }
  ],
  hindi: [
    {
      id: 1,
      question: "କେତସ୍କୋରରେ କେଉଁ ଉପାଦାନ ଆପଣଙ୍କ କେତସ୍କୋର ଗଣନା କରିବାରେ ସର୍ବାଧିକ ଗୁରୁତ୍ୱ ବହନ କରେ?",
      options: ["ଉତ୍ପାଦନକତା", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ", "ଜଳସେଚନ", "ପୁଷ୍ଟିକର"]
    },
    {
      id: 2,
      question: "ଯଦି ଆପଣଙ୍କ ଗଛର ପତ୍ର ହଳଦିଆ ପଡ଼ିଯାଏ କିମ୍ବା କୀଟପତଙ୍ଗ ଆକ୍ରମଣ କରନ୍ତି, ତେବେ ଏହା ଆପଣଙ୍କ ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ବିଷୟରେ କ'ଣ କହେ?",
      options: ["ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଭଲ ଅଛି", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଖରାପ ଅଛି", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ସମାନ ରହିଥାଏ"]
    },
    {
      id: 3,
      question: "ଯେତେବେଳେ ଆପଣ ଆପଣଙ୍କ ଜମିରୁ ଖାଲି ନ ରଖି ନିୟମିତ ଭାବରେ ଫସଲ ଚାଷ କରନ୍ତି, ସେତେବେଳେ ଆପଣଙ୍କର ଉତ୍ପାଦନକତା ସ୍କୋରରେ କ'ଣ ହୁଏ?",
      options: ["ସ୍କୋର ବଢ଼ିଯାଏ", "ସ୍କୋର କମିଯାଏ", "ସ୍କୋର ସମାନ ରହିଥାଏ"]
    },
    {
      id: 4,
      question: "ନିମ୍ନଲିଖିତ ମଧ୍ୟରୁ କେଉଁଟି ଆପଣଙ୍କ ଫସଲକୁ ହାନି କରିବାରେ କାରଣ ଏହା ଫସଲକୁ କ୍ଷତି ପହଞ୍ଚାଏ?",
      options: ["ପତ୍ର ଖାଉଥିବା କୀଟପତଙ୍ଗ", "ବନ୍ୟା, ଶିଳାବୃଷ୍ଟି, କିମ୍ବା ମେସିନ ଗଛ ଭାଙ୍ଗିବା", "ଉଭୟ କ ଏବଂ ଖ"]
    }
  ]
};

// Comprehension questions for Treatment 2
const comprehensionQuestionsTreatment2 = {
  english: [
    {
      id: 1,
      question: "Which component of Khetscore holds the highest importance in calculating your Khetscore?",
      options: ["Productivity", "Crop health", "Irrigation", "Nutrition"]
    },
    {
      id: 2,
      question: "If the leaves of your plants turn yellow or insects attack them, what does that say about your crop health?",
      options: ["Crop health is good", "Crop health is poor", "Crop health stays the same"]
    },
    {
      id: 3,
      question: "What happens to your productivity score when you regularly grow crops on your land without leaving it empty?",
      options: ["The score goes up", "The score goes down", "The score stays the same"]
    },
    {
      id: 4,
      question: "Two farmers apply for a new loan. Both have the same KhetScore, but only one repaid earlier on time. Who is more likely to get the loan?",
      options: ["The farmer who repaid on time", "The farmer who repaid late", "Both are equally likely", "Don't know"]
    },
    {
      id: 5,
      question: "What happens to your productivity score when you regularly grow crops on your land without leaving it empty?",
      options: ["The score goes up", "The score goes down", "The score stays the same"]
    }
  ],
  hindi: [
    {
      id: 1,
      question: "କେତସ୍କୋରରେ କେଉଁ ଉପାଦାନ ଆପଣଙ୍କ କେତସ୍କୋର ଗଣନା କରିବାରେ ସର୍ବାଧିକ ଗୁରୁତ୍ୱ ବହନ କରେ?",
      options: ["ଉତ୍ପାଦନକତା", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ", "ଜଳସେଚନ", "ପୁଷ୍ଟିକର"]
    },
    {
      id: 2,
      question: "ଯଦି ଆପଣଙ୍କ ଗଛର ପତ୍ର ହଳଦିଆ ପଡ଼ିଯାଏ କିମ୍ବା କୀଟପତଙ୍ଗ ଆକ୍ରମଣ କରନ୍ତି, ତେବେ ଏହା ଆପଣଙ୍କ ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ବିଷୟରେ କ'ଣ କହେ?",
      options: ["ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଭଲ ଅଛି", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଖରାପ ଅଛି", "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ସମାନ ରହିଥାଏ"]
    },
    {
      id: 3,
      question: "ଯେତେବେଳେ ଆପଣ ଆପଣଙ୍କ ଜମିରୁ ଖାଲି ନ ରଖି ନିୟମିତ ଭାବରେ ଫସଲ ଚାଷ କରନ୍ତି, ଯେତେବେଳେ ଆପଣଙ୍କର ଉତ୍ପାଦନକତା ସ୍କୋରରେ କ'ଣ ହୁଏ?",
      options: ["ସ୍କୋର ବଢ଼ିଯାଏ", "ସ୍କୋର କମିଯାଏ", "ସ୍କୋର ସମାନ ରହିଥାଏ"]
    },
    {
      id: 4,
      question: "ଦୁଇଜଣ ଚାଷୀ ନୂତନ ଋଣ ପାଇଁ ଆବେଦନ କରନ୍ତି। ଦୁଇଜଣଙ୍କର କେତସ୍କୋର ସମାନ, କିନ୍ତୁ କେବଳ ଜଣେ ସମୟ ପୂର୍ବରୁ ପରିଶୋଧ କରିଛନ୍ତି। ଋଣକୁ ପ୍ରାପ୍ତ ହେବାକୁ ଅଧିକ ସମ୍ଭାବନା କାହାକୁ?",
      options: ["ଯେଉଁ ଚାଷୀ ସମୟରେ ପରିଶୋଧ କରିଛନ୍ତି", "ଯେଉଁ ଚାଷୀ ବିଳମ୍ବରେ ପରିଶୋଧ କରିଛନ୍ତି", "ଉଭୟ ସମାନ ସମ୍ଭାବନା ଅଛନ୍ତି", "ଜାଣିନାହାଁନ୍ତି"]
    },
    {
      id: 5,
      question: "ଯେତେବେଳେ ଆପଣ ଆପଣଙ୍କ ଜମିରୁ ଖାଲି ନ ରଖି ନିୟମିତ ଭାବରେ ଫସଲ ଚାଷ କରନ୍ତି, ଯେତେବେଳେ ଆପଣଙ୍କର ଉତ୍ପାଦନକତା ସ୍କୋରରେ କ'ଣ ହୁଏ?",
      options: ["ସ୍କୋର ବଢ଼ିଯାଏ", "ସ୍କୋର କମିଯାଏ", "ସ୍କୋର ସମାନ ରହିଥାଏ"]
    }
  ]
};

// Likelihood options with translations
const likelihoodOptionsWithTranslations = {
  english: [
    { id: 1, label: "Definitely won't do it", contributes: false },
    { id: 2, label: "Probably won't do it", contributes: false },
    { id: 3, label: "Probably will do it", contributes: true },
    { id: 4, label: "Definitely will do it", contributes: true }
  ],
  hindi: [
    { id: 1, label: "ନିଶ୍ଚିତ ଭାବରେ ଏହା କରିବ ନାହିଁ", contributes: false },
    { id: 2, label: "ହୁଏତ ଏହା କରିବ ନାହିଁ", contributes: false },
    { id: 3, label: "ବୋଧହୁଏ ଏହା କରିବି", contributes: true },
    { id: 4, label: "ନିଶ୍ଚିତ ଭାବରେ ଏହା କରିବି", contributes: true }
  ]
};

// Weather shocks with translations
const weatherShocksWithTranslations = {
  english: [
    { name: "Flood", icon: Droplets, impact: -0.10 },
    { name: "Heavy Rain", icon: CloudRain, impact: -0.10 },
    { name: "Pest and Disease", icon: Bug, impact: -0.05 }
  ],
  hindi: [
    { name: "ବନ୍ୟା", icon: Droplets, impact: -0.10 },
    { name: "ପ୍ରବଳ ବର୍ଷା", icon: CloudRain, impact: -0.10 },
    { name: "କୀଟପତଙ୍ଗ ଏବଂ ରୋଗ", icon: Bug, impact: -0.05 }
  ]
};

// Helper function to get translated text
const useTranslation = (language) => {
  const t = (key) => translations[language]?.[key] || translations.english[key] || key;
  return { t };
};

const TRANSLATION_MAPS = {
  likelihood: {
    // Hindi to English
    "ନିଶ୍ଚିତ ଭାବରେ ଏହା କରିବ ନାହିଁ": "Definitely won't do it",
    "ହୁଏତ ଏହା କରିବ ନାହିଁ": "Probably won't do it",
    "ବୋଧହୁଏ ଏହା କରିବି": "Probably will do it",
    "ନିଶ୍ଚିତ ଭାବରେ ଏହା କରିବି": "Definitely will do it",
  },
  
  weather: {
    // Hindi to English
    "ବନ୍ୟା": "Flood",
    "ପ୍ରବଳ ବର୍ଷା": "Heavy Rain",
    "କୀଟପତଙ୍ଗ ଏବଂ ରୋଗ": "Pest and Disease",
    "None": "None"
  },
  
  comprehension: {
    // Treatment 1 & 2 - Question 1
    "ଉତ୍ପାଦନକତା": "Productivity",
    "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ": "Crop health",
    "ଜଳସେଚନ": "Irrigation",
    "ପୁଷ୍ଟିକର": "Nutrition",
    
    // Treatment 1 & 2 - Question 2
    "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଭଲ ଅଛି": "Crop health is good",
    "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ଖରାପ ଅଛି": "Crop health is poor",
    "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ସମାନ ରହିଥାଏ": "Crop health stays the same",
    
    // Treatment 1 & 2 - Question 3 & 5
    "ସ୍କୋର ବଢ଼ିଯାଏ": "The score goes up",
    "ସ୍କୋର କମିଯାଏ": "The score goes down",
    "ସ୍କୋର ସମାନ ରହିଥାଏ": "The score stays the same",
    
    // Treatment 1 - Question 4
    "ପତ୍ର ଖାଉଥିବା କୀଟପତଙ୍ଗ": "Insects eating leaves",
    "ବନ୍ୟା, ଶିଳାବୃଷ୍ଟି, କିମ୍ବା ମେସିନ ଗଛ ଭାଙ୍ଗିବା": "Flooding, hail, or machines breaking plants",
    "ଉଭୟ କ ଏବଂ ଖ": "Both a and b",
    
    // Treatment 2 - Question 4
    "ଯେଉଁ ଚାଷୀ ସମୟରେ ପରିଶୋଧ କରିଛନ୍ତି": "The farmer who repaid on time",
    "ଯେଉଁ ଚାଷୀ ବିଳମ୍ବରେ ପରିଶୋଧ କରିଛନ୍ତି": "The farmer who repaid late",
    "ଉଭୟ ସମାନ ସମ୍ଭାବନା ଅଛନ୍ତି": "Both are equally likely",
    "ଜାଣିନାହାଁନ୍ତି": "Don't know",
  }
};

// Helper function to translate any text to English
const translateToEnglish = (text, category) => {
  if (!text) return text;
  
  // If already in English or not found in map, return as is
  return TRANSLATION_MAPS[category]?.[text] || text;
};

// Language Toggle Component
const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <button
      onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
    >
      <span className="text-sm">{language === 'english' ? '🇮🇳 ଓଡ଼ିଆ' : '🇬🇧 English'}</span>
    </button>
  );
}

// Upload Status Modal Component
const UploadStatusModal = ({ status, onClose, language }) => {
  if (!status) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          {status.success ? (
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-800">
            {status.success 
              ? (language === 'hindi' ? 'ସଫଳ' : 'Success!') 
              : (language === 'hindi' ? 'ଅସଫଳ' : 'Error')}
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">{status.message}</p>
            
        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {language === 'hindi' ? 'ବନ୍ଦ କରନ୍ତୁ' : 'Close'}
        </button>
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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
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
  const [noWeatherKhetscore, setNoWeatherKhetscore] = useState(null);
  const [isViewingExisting, setIsViewingExisting] = useState(false);
  const [currentPractices, setCurrentPractices] = useState(practices);
  const [authLoading, setAuthLoading] = useState(true);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
   // eslint-disable-next-line
  const [uploadingToDrive, setUploadingToDrive] = useState(false);
  const [driveUploadStatus, setDriveUploadStatus] = useState(null); // { success: boolean, message: string, link?: string }
  const [comprehensionAnswers, setComprehensionAnswers] = useState({});
  const [uploadedSimulationIds, setUploadedSimulationIds] = useState([]);

  // Inside App component, after state declarations
  const { t } = useTranslation(language);

  // Get practices based on language and treatment
  const getLocalizedPractices = () => {
    if (language === 'hindi') {
      return treatmentFilter === 'treat2' ? practicesTreatment2Hindi : practicesHindi;
    }
    return treatmentFilter === 'treat2' ? practicesTreatment2 : practices;
  };

  // Get likelihood options based on language
  const getLocalizedLikelihoodOptions = () => {
    return likelihoodOptionsWithTranslations[language] || likelihoodOptionsWithTranslations.english;
  };

  // Get weather shocks based on language
  const getLocalizedWeatherShocks = () => {
    return weatherShocksWithTranslations[language] || weatherShocksWithTranslations.english;
  };

  // Load Google API on mount
  useEffect(() => {
    loadGoogleApi()
      .then(() => {
        setGoogleApiLoaded(true);
        console.log('Google API loaded successfully');
      })
      .catch((err) => {
        console.error('Failed to load Google API:', err);
      });
  }, []);

  // Load farmer data from Supabase instead of CSV
  useEffect(() => {
    const loadFarmers = async () => {
      setCsvLoading(true);
      setCsvError('');

      const { data, error } = await supabase
        .from('farmers')
        .select('farmer_id, name, khetscore, treatment, sim_completed, completed_at');

      if (error) {
        console.error('Error loading farmers from Supabase:', error);
        setCsvError('Error loading farmer data');
        setCsvLoading(false);
        return;
      }

      // 🔴 CASE SENSITIVE MAPPING:
      // Supabase columns (farmer_id, name, khetscore, treatment)
      //  → CSV-style keys used everywhere in your app (farmerID, Name, Khetscore, treatment)
      const normalized = (data || []).map(row => ({
        farmerID: row.farmer_id,
        Name: row.name,
        Khetscore: row.khetscore,
        treatment: row.treatment,
        sim_completed: row.sim_completed ?? false,
        completed_at: row.completed_at || null,
      }));

      setFarmersData(normalized);
      setCsvLoading(false);
    };

    // Check for existing session in localStorage
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          
          // Verify user still exists in database
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            const userWithoutPassword = {
              id: data.id,
              username: data.username,
              full_name: data.full_name,
              organization: data.organization,
              created_at: data.created_at
            };
            setCurrentUser(userWithoutPassword);
            setIsLoggedIn(true);
            setAuthScreen('');
            await loadUserData(data.id);
          } else {
            // User no longer exists, clear localStorage
            localStorage.removeItem('currentUser');
          }
        }
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthLoading(false);
      }
    };

    checkAuth();
    loadFarmers();
  }, []);

  // Load user data
  const loadUserData = async (userId) => {
    try {
      // Load simulations from localStorage
      const savedSims = localStorage.getItem(`simulations_${userId}`);
      if (savedSims) {
        const parsed = JSON.parse(savedSims);

        // Ensure every simulation has an uploadedToDrive flag
        const normalized = parsed.map(sim => ({
          ...sim,
          uploadedToDrive: !!sim.uploadedToDrive,  // default false if missing
        }));

        setAllSimulations(normalized);
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
        uploadedToDrive: false,
        ...simulationData,
      };

      const updatedSims = [...allSimulations, newSim];
      setAllSimulations(updatedSims);
      localStorage.setItem(`simulations_${currentUser.id}`, JSON.stringify(updatedSims));
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
  };

  // Round score
  const roundScore = (score) => {
    return Math.round(parseFloat(score));
  };

  // Get filtered farmers based on treatment filter and completion status
  const getFilteredFarmers = () => {
    // Only farmers who have NOT completed simulation
    const available = farmersData.filter(farmer => !farmer.sim_completed);

    if (!treatmentFilter) return available;
    return available.filter(farmer => farmer.treatment === treatmentFilter);
  };


  // Handle delete simulation
  const handleDeleteSimulation = (simId) => {
    const updatedSims = allSimulations.filter(sim => sim.id !== simId);
    setAllSimulations(updatedSims);
    localStorage.setItem(`simulations_${currentUser.id}`, JSON.stringify(updatedSims));
    setShowDeleteConfirm(false);
    setSimulationToDelete(null);
  };

  // Confirm delete simulation
  const confirmDelete = (sim) => {
    setSimulationToDelete(sim);
    setShowDeleteConfirm(true);
  };

  // Confirm delete simulation & Save & return to dashboard
  const handleSaveAndReturn = async () => {
    // Only save if this is a new simulation, not viewing existing
    if (!isViewingExisting) {
      await saveSimulation({
        farmer: {
          name: currentFarmer.Name,
          id: currentFarmer.farmerID,
          initialKhetscore: currentFarmer.initialKhetscore,
          finalKhetscore: currentFarmer.currentKhetscore
        },
        seasons: seasonData,
        comprehensionAnswers: comprehensionAnswers,
        treatment: treatmentFilter
      });

      // 🔹 Mark farmer as completed in Supabase (using DB column name farmer_id)
      try {
        const nowIso = new Date().toISOString();

        const { error } = await supabase
          .from('farmers')
          .update({
            sim_completed: true,
            completed_at: nowIso,
          })
          .eq('farmer_id', currentFarmer.farmerID); // CASE SENSITIVE: DB column is farmer_id

        if (error) {
          console.error('Failed to mark farmer as completed in Supabase:', error);
        } else {
          // 🔹 Update local farmersData so UI hides this farmer immediately
          setFarmersData(prev =>
            prev.map(f =>
              f.farmerID === currentFarmer.farmerID
                ? { ...f, sim_completed: true, completed_at: nowIso }
                : f
            )
          );
        }
      } catch (err) {
        console.error('Unexpected error updating farmer as completed:', err);
      }
    }

    // Clear all simulation data (existing code)
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setPracticesWithLikelihood({});
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setNoWeatherKhetscore(null);
    setComprehensionAnswers({});
    setIsViewingExisting(false); // Reset flag
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
    // Clear ALL simulation data and reset to dashboard
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setPracticesWithLikelihood({});
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setNoWeatherKhetscore(null);
    setIsViewingExisting(false);
    setCurrentPractices(practices);
    setComprehensionAnswers({});
    setTreatmentFilter(null); // Reset treatment filter
    setScreen('dashboard');
    setError('');
  };

  // Handle logo click
  const handleLogoClick = () => {
    // Clear ALL simulation data and return to dashboard
    setCurrentFarmer(null);
    setCurrentSeason(1);
    setSelectedPractices([]);
    setPracticesWithLikelihood({});
    setWeatherShock(null);
    setSeasonData([]);
    setLikelihoodAnswers({});
    setSessionHistory({});
    setFarmerID('');
    setNoWeatherKhetscore(null);
    setIsViewingExisting(false);
    setCurrentPractices(practices);
    setComprehensionAnswers({});
    // Don't reset treatment filter when clicking logo, just go to dashboard
    setScreen('dashboard');
    setError('');
  };

  // Handle login with custom authentication (with password verification)
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    try {
      // Get user by username only (we'll verify password separately)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', loginForm.username)
        .single();
      
      if (error || !data) {
        setAuthError('Invalid username or password');
        setAuthLoading(false);
        return;
      }
      
      // Compare entered password with hashed password in database
      const isPasswordValid = await bcrypt.compare(loginForm.password, data.password);
      
      if (!isPasswordValid) {
        setAuthError('Invalid username or password');
        setAuthLoading(false);
        return;
      }
      
      // Login successful - remove password from user object
      const userWithoutPassword = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        organization: data.organization,
        created_at: data.created_at
      };

      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setAuthScreen(null);
      setScreen('selection');
      await loadUserData(data.id);
      setAuthLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Login failed. Please try again.');
      setAuthLoading(false);
    }
  };

  // Handle register with custom authentication (with password hashing)
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    
    if (!registerForm.username || !registerForm.password || !registerForm.name) {
      setAuthError('Please fill in all required fields');
      setAuthLoading(false);
      return;
    }

    // Password validation (optional but recommended)
    if (registerForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      setAuthLoading(false);
      return;
    }
    
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', registerForm.username)
        .single();

      if (existingUser) {
        setAuthError('Username already exists');
        setAuthLoading(false);
        return;
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(registerForm.password, 10);

      // Insert new user with hashed password
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: registerForm.username,
            password: hashedPassword,
            full_name: registerForm.name,
            organization: registerForm.organization || ''
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        setAuthError('Registration failed. Please try again.');
        setAuthLoading(false);
        return;
      }

      // Registration successful - auto login
      // Remove password from user object before storing in state
      const userWithoutPassword = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        organization: data.organization,
        created_at: data.created_at
      };

      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setAuthScreen(null);
      setScreen('selection');
      setAuthLoading(false);
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError('Registration failed. Please try again.');
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear local data
    if (currentUser) {
      localStorage.removeItem(`simulations_${currentUser.id}`);
    }
    
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthScreen('landing');
    setScreen('selection');
    setAllSimulations([]);
  };

  // Handle farmer lookup
  const handleFarmerLookup = () => {
    // Check if farmer already has completed simulation
    const existingSimulation = allSimulations.find(sim => sim.farmer.id === farmerID);
    if (existingSimulation) {
      setError('farmerAlreadySimulated');
      return;
    }

    const filteredFarmers = getFilteredFarmers();
    const farmer = filteredFarmers.find(f => f.farmerID === farmerID);
    if (farmer) {
      const initialScore = roundScore(farmer.Khetscore);
      setCurrentFarmer({
        ...farmer,
        currentKhetscore: initialScore,
        initialKhetscore: initialScore
      });
      setNoWeatherKhetscore(initialScore); // Initialize noWeatherKhetscore
      setError('');
      setCurrentSeason(1);
      setSeasonData([]);
      setSessionHistory({
        season1: { practices: [], weather: null, score: initialScore, noWeatherScore: initialScore, likelihood: {} },
        season2: { practices: [], weather: null, score: initialScore, noWeatherScore: initialScore, likelihood: {} },
        season3: { practices: [], weather: null, score: initialScore, noWeatherScore: initialScore, likelihood: {} }
      });
      setScreen(treatmentFilter === 'treat1' ? 'info-path1' : 'info-path2');
    } else {
      setError('simulationCompleted');
    }
  };

  // Handle weather continue
  const handleWeatherContinue = () => {
    // Get English weather shock name for storage
    let weatherShockEnglish = 'None';
    if (weatherShock) {
      // Find the matching English weather shock by impact value
      const englishShocks = weatherShocksWithTranslations.english;
      const matchingShock = englishShocks.find(s => s.impact === weatherShock.impact);
      weatherShockEnglish = matchingShock ? matchingShock.name : weatherShock.name;
    }

    const seasonRecord = {
      season: currentSeason,
      seasonType: currentSeason % 2 === 1 ? 'Rabi' : 'Kharif',
      practices: selectedPractices.map(id => currentPractices.find(p => p.id === id).name),
      practiceIds: selectedPractices,
      weatherShock: weatherShock ? weatherShock.name : 'None', // Current language name
      weatherShockEnglish: weatherShockEnglish,
      endScore: currentFarmer.currentKhetscore,
      noWeatherScore: noWeatherKhetscore,
      likelihood: { ...likelihoodAnswers }
    };
    
    setSeasonData(prev => [...prev, seasonRecord]);
    
    const seasonKey = `season${currentSeason}`;
    setSessionHistory(prev => ({
      ...prev,
      [seasonKey]: {
        ...prev[seasonKey],
        likelihood: { ...likelihoodAnswers },
        noWeatherScore: noWeatherKhetscore
      }
    }));
    
    if (currentSeason < 3) {
      setCurrentSeason(prev => prev + 1);
      setSelectedPractices([]);
      setWeatherShock(null);
      setPracticesWithLikelihood({});
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
  const handleLikelihoodSelection = (practiceId, likelihoodLabel) => {
    // Get the current localized likelihood options
    const localizedOptions = getLocalizedLikelihoodOptions();
    
    // Find the likelihood option from the localized options
    const likelihoodOption = localizedOptions.find(opt => opt.label === likelihoodLabel);
    
    // Safety check
    if (!likelihoodOption) {
      console.error('Likelihood option not found for label:', likelihoodLabel);
      return;
    }
    
    setPracticesWithLikelihood(prev => ({
      ...prev,
      [practiceId]: { 
        ...prev[practiceId], 
        likelihood: likelihoodLabel,
        likelihoodId: likelihoodOption.id
      }
    }));
  }

  // Build a normalized simulation object for export
  const buildSimulationSnapshot = (simulation) => {
    // If we were passed a full simulation (e.g. from history), use it directly
    if (simulation) return simulation;

    // Otherwise build from current state
    if (!currentFarmer || !seasonData) {
      console.error('No current simulation data available for CSV export.');
      return null;
    }

    return {
      farmer: {
        name: currentFarmer.Name,
        id: currentFarmer.farmerID,
        initialKhetscore: currentFarmer.initialKhetscore,
      },
      seasons: seasonData,
      comprehensionAnswers,
      treatment: treatmentFilter,
    };
  };

  // Build comprehension Q1–Q5 columns (always English)
  const buildComprehensionColumns = (sim) => {
    const treatment = sim.treatment || treatmentFilter;

    const questions =
      treatment === 'treat2'
        ? comprehensionQuestionsTreatment2.english
        : comprehensionQuestionsTreatment1.english;

    const cols = {};

    questions.forEach((q, index) => {
      const rawAnswer =
        (sim.comprehensionAnswers && sim.comprehensionAnswers[q.id]) ??
        comprehensionAnswers[q.id];

      cols[`ComprehensionQ${index + 1}`] =
        translateToEnglish(rawAnswer, 'comprehension') || 'Not answered';
    });

    // For treat1 we still keep Q5 as an empty column so structure is consistent
    if (treatment === 'treat1' && !cols.ComprehensionQ5) {
      cols.ComprehensionQ5 = '';
    }

    return cols;
  };

  // Build Season 1/2/3 columns (practices, likelihoods, weather, scores)
  const buildSeasonColumns = (sim, seasonIndex) => {
    const season = sim.seasons && sim.seasons[seasonIndex];

    if (!season) {
      return {
        practices: '',
        likelihood: '',
        weather: '',
        endScore: '',
        noWeatherScore: '',
      };
    }

    // Practices: IDs only (language-agnostic)
    const practices = season.practiceIds
      ? season.practiceIds.join('; ')
      : '';

    // Likelihood: include id + optionId + ENGLISH label
    const likelihood =
      season.practiceIds && season.likelihood
        ? season.practiceIds
            .map((id) => {
              const l = season.likelihood[id];
              if (!l) return '';

              const englishLabel = translateToEnglish(
                l.label,
                'likelihood'
              );
              const metaId = l.id ?? '';

              return `${id}_${metaId}_${englishLabel}`;
            })
            .filter(Boolean)
            .join('; ')
        : '';

    // Weather shock: always mapped to English
    const weather = translateToEnglish(
      season.weatherShockEnglish || season.weatherShock,
      'weather'
    );

    return {
      practices,
      likelihood,
      weather,
      endScore: season.endScore ?? '',
      noWeatherScore: season.noWeatherScore ?? season.endScore ?? '',
    };
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
    setIsViewingExisting(true); // Mark as viewing existing
    setScreen('summary');
  };

  // Handle upload to Google Drive (also ENGLISH-only)
  const handleUploadToDrive = async (simulation = null) => {
    const sim = buildSimulationSnapshot(simulation);

    if (!sim) return;

    // 1) Comprehension columns (always English)
    const comprehensionCols = buildComprehensionColumns(sim);

    // 2) Season-wise data
    const season1 = buildSeasonColumns(sim, 0);
    const season2 = buildSeasonColumns(sim, 1);
    const season3 = buildSeasonColumns(sim, 2);

    // 3) CSV row (same structure as handleExportCSV)
    const csvData = [
      {
        Name: sim.farmer.name,
        farmerID: sim.farmer.id,
        Treatment: sim.treatment || treatmentFilter,
        InitialKhetscore: sim.farmer.initialKhetscore,

        ...comprehensionCols,

        // Season 1
        Season1_Practices: season1.practices,
        Season1_Likelihood: season1.likelihood,
        Season1_WeatherShock: season1.weather,
        Season1_EndScore: season1.endScore,
        Season1_NoWeatherScore: season1.noWeatherScore,

        // Season 2
        Season2_Practices: season2.practices,
        Season2_Likelihood: season2.likelihood,
        Season2_WeatherShock: season2.weather,
        Season2_EndScore: season2.endScore,
        Season2_NoWeatherScore: season2.noWeatherScore,

        // Season 3
        Season3_Practices: season3.practices,
        Season3_Likelihood: season3.likelihood,
        Season3_WeatherShock: season3.weather,
        Season3_EndScore: season3.endScore,
        Season3_NoWeatherScore: season3.noWeatherScore,
      },
    ];

    const csvContent = Papa.unparse(csvData);
    const fileName = `farmer_${sim.farmer.id}_simulation_${new Date()
      .toISOString()
      .split('T')[0]}.csv`;

    // === existing Drive logic, unchanged ===
    if (!googleApiLoaded) {
      setDriveUploadStatus({
        success: false,
        message:
          language === 'hindi'
            ? 'Google API ଲୋଡ୍ ହୋଇନାହିଁ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।'
            : 'Google API not loaded. Please try again.',
      });
      return;
    }

    setUploadingToDrive(true);
    setDriveUploadStatus(null);

    try {
      const result = await uploadToGoogleDrive(csvContent, fileName);
      setDriveUploadStatus({
        success: true,
        message:
          language === 'hindi'
            ? 'CSV ଫାଇଲ୍ ସଫଳତାର ସହିତ Google Drive କୁ ଅପଲୋଡ୍ ହୋଇଛି।'
            : 'CSV file successfully uploaded to Google Drive.',
        link: result?.webViewLink,
      });

      // Mark this farmer’s simulation as uploaded (if you track that)
      if (sim?.farmer?.id) {
        setUploadedSimulationIds((prev) =>
          prev.includes(sim.farmer.id) ? prev : [...prev, sim.farmer.id]
        );
      }
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      setDriveUploadStatus({
        success: false,
        message:
          language === 'hindi'
            ? 'Google Drive କୁ ଅପଲୋଡ୍ କରିବାରେ ତ୍ରୁଟି ହେଲା।'
            : 'Error uploading to Google Drive.',
      });
    } finally {
      setUploadingToDrive(false);
    }
  };

  // Handle back button
  // eslint-disable-next-line no-unused-vars
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

  // Helper to build “with/without damage” season labels
  const getSeasonDamageLabel = (seasonIndex, { forceNoDamage = false } = {}) => {
    const seasonNumber = seasonIndex + 1;
    const isRabi = seasonNumber % 2 === 1;
    const isOdia = language === 'hindi';

    // Base season name
    const base = isRabi
      ? (isOdia ? 'ରବି' : 'Rabi')
      : (isOdia ? 'ଖରିଫ' : 'Kharif');

    // In English just show Rabi / Kharif
    if (!isOdia) return base;

    // Decide if this season actually had a weather shock
    let hasShock = false;

    if (!forceNoDamage) {
      if (seasonIndex === currentSeason - 1 && weatherShock) {
        // Current season: use the live weatherShock state
        const name =
          weatherShock.name ||
          weatherShock.weather ||
          weatherShock.label ||
          weatherShock.type;
        hasShock = !!name && name !== "None";
      } else if (seasonData[seasonIndex]) {
        // Previous seasons: look at stored data
        const s = seasonData[seasonIndex];
        const w =
          s.weatherShockEnglish ||
          s.weatherShock ||
          s.weather;
        hasShock = !!w && w !== "None";
      }
    }

    const suffix = hasShock ? " କ୍ଷୟକ୍ଷତି ସହିତ" : " କ୍ଷୟକ୍ଷତି ବିନା";
    return base + suffix;
  };

  // Comparison Bar Chart Component
  const ComparisonBarChart = ({ values, labels, title, noWeatherValues = null }) => {
    const maxScore = 100;
    const { t } = useTranslation(language);

    return (
      <div className="bg-gray-50 p-6 rounded-lg mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-6 text-center">{title}</h4>
        <div className="flex items-end justify-center gap-4 sm:gap-6 h-64">
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
                <div className="text-sm sm:text-base font-bold mb-2" style={{ color: barColor }}>
                  {value}
                </div>
                <div 
                  className="w-12 sm:w-16 rounded-t-lg transition-all duration-500"
                  style={{ 
                    height: `${heightPercentage * 1.8}px`,
                    backgroundColor: barColor,
                    minHeight: '30px'
                  }}
                />
                {/* Base line */}
                <div className="w-full mt-2">
                  <div className="w-12 sm:w-16 h-1 bg-gray-300 mx-auto"></div>
                </div>
                
                {/* Label */}
                <div className="text-xs text-gray-600 mt-4 text-center w-24 sm:w-32 font-medium">
                  {labels[idx]}
                </div>
              </div>
            );
          })}
          
          {/* Single NoWeather bar at the end */}
          {noWeatherValues && (
            <div className="flex flex-col items-center border-l-2 border-gray-300 pl-4 sm:pl-6 ml-4 sm:ml-6">
              <div className="text-sm sm:text-base font-bold mb-2 text-orange-600">
                {noWeatherValues[noWeatherValues.length - 1]}
              </div>
              <div 
                className="w-12 sm:w-16 rounded-t-lg transition-all duration-500"
                style={{ 
                  height: `${(noWeatherValues[noWeatherValues.length - 1] / maxScore) * 1.8 * 100}px`,
                  backgroundColor: '#f97316',
                  minHeight: '30px'
                }}
              />
              {/* Base line */}
              <div className="w-full mt-2">
                <div className="w-12 sm:w-16 h-1 bg-gray-300 mx-auto"></div>
              </div>
              
              {/* Label */}
              <div className="text-xs text-gray-600 mt-4 text-center w-24 sm:w-32 font-medium">
                {t('noWeatherScore')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Slideshow for Treatment 1 Info Page
  const InfoPath1 = ({ setScreen, setTreatmentFilter, setCurrentPractices, practices }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
      { image: '/T1_ENG.png', alt: 'Treatment 1 - Slide 1' },
      { image: '/T1_OD.png', alt: 'Treatment 1 - Slide 2' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full h-[calc(100vh-4rem)] max-w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white py-8 px-2 text-center flex items-center gap-3 justify-center">
            <div className="inline-block bg-white/20 p-1 rounded-full mb-1">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Treatment Group 1</h1>
            <p className="text-green-100 text-2xl">Information</p>
          </div>

          {/* Slideshow Container */}
          <div className="relative bg-gray-900 flex-1 min-h-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={slide.image} alt={slide.alt} className="w-full h-full object-contain" />
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
          <div className="px-14 py-6">
            <div className="px-12 pt-1 flex gap-4 mt-4">
              <button
                onClick={() => {
                  setScreen('selection');
                  setTreatmentFilter(null);
                  setCurrentPractices(practices); // Reset practices when going back
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-3 py-4 rounded-md text-sm sm:text-base hover:bg-gray-300 transition"
              >
                ← {t('backToSelection')}
              </button>
              <button
                onClick={() => setScreen('comprehension-check')}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm sm:text-base hover:bg-green-700 transition shadow"
              >
                {t('continue')} →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Slideshow for Treatment 2 Info Page
  const InfoPath2 = ({ setScreen, setTreatmentFilter, setCurrentPractices, practices }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
      
    // Replace these with your actual image URLs
    const slides = [
      {
        image: '/T2_ENG.png', // Put your images in public/images folder
        alt: 'Treatment 2 - Slide 1'
      },
      {
        image: '/T2_OD.png',
        alt: 'Treatment 2 - Slide 2'
      }
    ];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full h-[calc(100vh-4rem)] max-w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 text-center">
            <div className="inline-block bg-white/20 p-2 rounded-full mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Treatment Group 2</h1>
            <p className="text-green-100 text-lg">Information</p>
          </div>
          
          {/* Slideshow Container */}
          <div className="relative bg-gray-900 flex-1 min-h-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={slide.image} alt={slide.alt} className="w-full h-full object-contain" />
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
                setCurrentPractices(practices);
              }}
              className="fflex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm sm:text-base hover:bg-gray-300 transition"
            >
              ← {t('backToSelection')}
            </button>
            <button
              onClick={() => setScreen('comprehension-check')}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm sm:text-base hover:bg-green-700 transition shadow-lg"
            >
              {t('continue')} →
            </button>
          </div>
        </div>
      </div>
    );
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
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {authError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{authError}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Logging in...' : 'Login'}
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
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {authError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{authError}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Creating Account...' : 'Create Account'}
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

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm p-6 rounded-full mb-6">
            <Leaf className="w-20 h-20 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">Loading KhetScore...</h2>
        </div>
      </div>
    );
  }

  // If not logged in and not on auth screens, return null
  // (Auth screens are handled above with authScreen checks)
  if (!isLoggedIn && !authScreen) return null;

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-8">
          <button
            onClick={() => {
              setTreatmentFilter('treat1');
              setCurrentPractices(practices);
              setScreen('dashboard');
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
              setCurrentPractices(practicesTreatment2);
              setScreen('dashboard');
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

        <div className="w-full max-w-4xl">
          <button
            onClick={() => window.open('https://youtu.be/SgP4yScr-nw?si=ScsqIhSOsNLPwLo-', '_blank')}
            className="w-full bg-red-600 text-white p-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 flex items-center justify-center gap-4"
          >
            <PlayCircle className="w-8 h-8" />
            <div className="text-left">
              <h3 className="text-xl font-bold">Watch Tutorial Video</h3>
              <p className="text-sm text-red-100">Learn how to use KhetScore</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Leaf className="w-8 h-8 text-green-700" />
                <h1 className="text-2xl font-bold text-green-800">KhetScore</h1>
              </button>
              <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                <button
                  onClick={() => {
                    // Reset treatment filter and go back to selection
                    setTreatmentFilter(null);
                    setCurrentPractices(practices);
                    setScreen('selection');
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('backToSelection')}
                </button>
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm text-gray-600">{t('welcome')},</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{currentUser.full_name}</p>
                </div>
                <div className="hidden sm:block">
                  <LanguageToggle language={language} setLanguage={setLanguage} />
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{t('logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{t('dashboard')}</h2>
            <p className="text-gray-600">{t('manageActivities')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{t('totalSimulations')}</h3>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-green-700">
                {allSimulations.filter(sim => {
                  const farmer = farmersData.find(f => f.farmerID === sim.farmer.id);
                  return treatmentFilter && farmer ? farmer.treatment === treatmentFilter : true;
                }).length}
              </p>
              <p className="text-xs text-gray-500 mt-2">{t('treatment')}: {treatmentFilter}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{t('farmersTracked')}</h3>
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
              <p className="text-xs text-gray-500 mt-2">{t('treatment')}: {treatmentFilter}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('startNewSimulation')}</h3>
            <button
              onClick={() => {
                setFarmerID('');
                setScreen('farmer-lookup');
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              {t('beginSimulation')}
            </button>
          </div>

          {allSimulations.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('recentSimulations')}</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
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
                    <div key={sim.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                        <div>
                          <p className="font-semibold text-gray-800">{sim.farmer.name}</p>
                          <p className="text-sm text-gray-600">ID: {sim.farmer.id}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(sim.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{t('scoreChange')}</p>
                            <p className={`text-xl font-bold ${
                              sim.farmer.finalKhetscore >= sim.farmer.initialKhetscore
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {sim.farmer.initialKhetscore} → {sim.farmer.finalKhetscore}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewSummary(sim)}
                              className="flex items-center gap-1 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                              title="View Summary"
                            >
                              <Eye className="w-4 h-4" />
                              {t('view')}
                            </button>
                            <button
                              onClick={() => handleUploadToDrive(sim)}
                              disabled={
                                uploadingToDrive ||
                                !googleApiLoaded ||
                                uploadedSimulationIds.includes(sim.farmer.id)
                              }
                              className="flex items-center gap-1 bg-purple-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                              title="Upload to Google Drive"
                            >
                              <Upload className="w-4 h-4" />
                              {uploadingToDrive ? '...' : t('uploadToDrive')}
                            </button>                            
                            <button
                              onClick={() => confirmDelete(sim)}
                              className="flex items-center gap-1 bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                              title="Delete Simulation"
                            >
                              <AlertCircle className="w-4 h-4" />
                              {t('delete')}
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
        {/* Upload Status Modal */}
        <UploadStatusModal 
          status={driveUploadStatus} 
          onClose={() => setDriveUploadStatus(null)}
          language={language}
        />{/* Upload Status Modal */}
        <UploadStatusModal 
          status={driveUploadStatus} 
          onClose={() => setDriveUploadStatus(null)}
          language={language}
        />
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
                  onClick={handleLogoClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t('backToDashboard')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">{t('enterFarmerID')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('farmerID')}</label>
                <input
                  type="text"
                  value={farmerID}
                  onChange={(e) => {
                    setFarmerID(e.target.value);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={t('enterFarmerID')}
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span>{t(error)}</span>
                </div>
              )}
              
              <button
                onClick={handleFarmerLookup}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {t('continue')} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {csvLoading ? (
                <p className="text-sm text-gray-600">
                  <strong>{t('loadingFarmerData')}</strong>
                </p>
              ) : csvError ? (
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {csvError}
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>{t('availableFarmers')} ({treatmentFilter}):</strong> {getFilteredFarmers().length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('treatment')}: <span className="font-semibold">{treatmentFilter}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Info Page - Path 1 with Image Slideshow
  if (screen === 'info-path1') {
    return <InfoPath1 
      setScreen={setScreen} 
      setTreatmentFilter={setTreatmentFilter} 
      setCurrentPractices={setCurrentPractices} 
      practices={practices}
      language={language}
      t={t}
    />;
  }

  // Info Page - Path 2 with Image Slideshow
  if (screen === 'info-path2') {
    return <InfoPath2 
      setScreen={setScreen} 
      setTreatmentFilter={setTreatmentFilter} 
      setCurrentPractices={setCurrentPractices} 
      practices={practices}
      language={language}
      t={t}
    />;
  }

  // Comprehension Check Screen
  if (screen === 'comprehension-check') {
    const questions = treatmentFilter === 'treat2' 
      ? comprehensionQuestionsTreatment2[language]
      : comprehensionQuestionsTreatment1[language];
    
    const allQuestionsAnswered = questions.every(q => comprehensionAnswers[q.id]);
    
    const handleAnswerSelect = (questionId, answer) => {
      setComprehensionAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    };
    
    const handleContinueComprehension = () => {
      if (!allQuestionsAnswered) {
        setError(t('pleaseAnswerAll'));
        return;
      }
      setError('');
      setScreen('sim-InfoPage');
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
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
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                <BookOpen className="w-12 h-12 text-blue-700" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">{t('comprehensionCheck')}</h2>
              <p className="text-gray-600">{t('comprehensionInstructions')}</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-green-300 transition-colors">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {t('questionLabel')} {index + 1}: {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          comprehensionAnswers[question.id] === option
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={comprehensionAnswers[question.id] === option}
                          onChange={() => handleAnswerSelect(question.id, option)}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setScreen(treatmentFilter === 'treat1' ? 'info-path1' : 'info-path2');
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
              >
                ← {t('back')}
              </button>
              <button
                onClick={handleContinueComprehension}
                disabled={!allQuestionsAnswered}
                className={`flex-1 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                  allQuestionsAnswered 
                    ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('continue')} →
              </button>
            </div>
            {/* Add progress indicator */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {t('answered')}: {Object.keys(comprehensionAnswers).length} / {questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Info Page - Simulation
  if (screen === 'sim-InfoPage') {
    const simImage = {
      src: '/simulation_rules.png',
      alt: 'Simulation Info'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* card */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col">
          {/* Header */}
          <header className="bg-green-600 text-white py-6 px-3 text-center flex items-center gap-3 justify-center">
            <div className="inline-block bg-white/20 p-2 rounded-full">
              <BookOpen className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {t('simulationInfo')}
            </h1>
          </header>

          {/* Image / Content */}
          <main className="relative bg-gray-900 flex-1 min-h-0 flex items-center justify-center p-2 sm:p-4">
            <img
              src={simImage.src}
              alt={simImage.alt}
              className="w-full max-h-[70vh] object-contain bg-gray-900"
              onError={(e) => {
                e.currentTarget.alt = 'Image failed to load';
              }}
            />
          </main>

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 pt-0 mt-auto flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setScreen('comprehension-check');
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-3 py-4 rounded-md text-sm sm:text-base font-medium hover:bg-gray-300 transition"
            >
              ← {t('back')}
            </button>

            <button
              type="button"
              onClick={() => setScreen('season-intro')}
              className="flex-1 bg-green-600 text-white px-3 py-4 rounded-md text-sm sm:text-base font-medium hover:bg-green-700 transition shadow"
            >
              {t('continueToKhetscore')} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Season Introduction Screen
  if (screen === 'season-intro') {
    const seasonType = currentSeason % 2 === 1 ? (language === 'hindi' ? 'ରବି' : 'RABI') : (language === 'hindi' ? 'ଖରିଫ' : 'KHARIF');
    
    const getComparisonData = () => {
      const values = [currentFarmer.initialKhetscore];
      const labels = [t('initial')];
      
      if (currentSeason >= 2 && seasonData.length >= 1) {
        values.push(seasonData[0].endScore);
        labels.push(`${t('season')} 1 ${language === 'hindi' ? 'ରବି' : 'Rabi'}`);
      }
      
      if (currentSeason >= 3 && seasonData.length >= 2) {
        values.push(seasonData[1].endScore);
        labels.push(`${t('season')} 2 ${language === 'hindi' ? 'ଖରିଫ' : 'Kharif'}`);
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
              <div className="flex items-center gap-4">
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  {t('home')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                {t('season')} {currentSeason} - {seasonType} {language === 'hindi' ? 'ଋତୁ' : 'Season'}
              </h2>
              <p className="text-gray-600 mb-4">{t('farmer')}: {currentFarmer.Name}</p>
            </div>
            
            <ComparisonBarChart 
              values={comparisonData.values}
              labels={comparisonData.labels}
              title={t('khetscoreProgress')}
              language={language}
            />
            
            <button
              onClick={() => setScreen('practice-selection')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mt-8">
              {t('selectAgriPractices')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice Selection Screen with Integrated Likelihood
  if (screen === 'practice-selection') {
    const localizedPractices = getLocalizedPractices();
    const localizedLikelihoodOptions = getLocalizedLikelihoodOptions();
    
    // Group practices by category using localized practices
    const groupedPractices = localizedPractices.reduce((acc, practice) => {
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
        setError(t('pleaseSelectPractice'));
        return;
      }
      if (!allLikelihoodsSelected) {
        setError(t('pleaseSelectLikelihood'));
        return;
      }
      setError('');
      
      const practiceIds = Object.keys(practicesWithLikelihood).map(id => parseInt(id));
      setSelectedPractices(practiceIds);
      
      const likelihoodData = {};
      Object.entries(practicesWithLikelihood).forEach(([id, data]) => {
        likelihoodData[id] = {
          label: data.likelihood,
          id: data.likelihoodId
        };
      });
      setLikelihoodAnswers(likelihoodData);
      
      const practiceBonus = practiceIds.reduce((sum, id) => {
        const practice = localizedPractices.find(p => p.id === id);
        const likelihoodId = practicesWithLikelihood[id].likelihoodId;
        if (likelihoodId === 3 || likelihoodId === 4) {
          return sum + practice.weight;
        }
        return sum;
      }, 0);
      
      const localizedWeatherShocks = getLocalizedWeatherShocks();
      const hasShock = Math.random() < 0.5;
      const shock = hasShock ? localizedWeatherShocks[Math.floor(Math.random() * localizedWeatherShocks.length)] : null;
      setWeatherShock(shock);
      
      const shockImpact = shock ? shock.impact : 0;
      
      // Calculate Khetscore WITH weather impact
      const newScore = Math.max(0, Math.min(100, 
        currentFarmer.currentKhetscore + practiceBonus - Math.abs(shockImpact * currentFarmer.currentKhetscore)
      ));
      
      // Calculate noWeatherKhetscore WITHOUT weather impact
      // Use the last season's noWeatherKhetscore as base (or initial if first season)
      const currentNoWeatherBase = noWeatherKhetscore !== null ? noWeatherKhetscore : currentFarmer.initialKhetscore;
      const newNoWeatherScore = Math.max(0, Math.min(100, currentNoWeatherBase + practiceBonus));
      
      // Update both scores
      setCurrentFarmer(prev => ({ ...prev, currentKhetscore: roundScore(newScore) }));
      setNoWeatherKhetscore(roundScore(newNoWeatherScore)); // This persists across seasons
      
      const seasonKey = `season${currentSeason}`;
      setSessionHistory(prev => ({
        ...prev,
        [seasonKey]: {
          ...prev[seasonKey],
          practices: practiceIds,
          weather: shock,
          score: roundScore(newScore),
          noWeatherScore: roundScore(newNoWeatherScore)
        }
      }));
      
      console.log('Score Calculation:', {
        season: currentSeason,
        practiceBonus,
        weatherShock: shock ? shock.name : 'None',
        shockImpact,
        previousKhetscore: currentFarmer.currentKhetscore,
        newKhetscore: roundScore(newScore),
        previousNoWeatherScore: currentNoWeatherBase,
        newNoWeatherScore: roundScore(newNoWeatherScore)
      });
      
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
              <div className="flex items-center gap-4">
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  {t('home')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2">{t('selectPractices')}</h2>
              <p className="text-gray-600">{t('season')} {currentSeason} - {t('choosePractices')}</p>
              <div className="mt-2 inline-block bg-blue-100 px-4 py-2 rounded-lg">
                <span className="font-medium text-blue-800">{t('selected')}: {selectedCount}</span>
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
                                    {t('weight')}: {practice.weight}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </label>
                          
                          {isSelected && (
                            <div className="px-4 pb-4 border-t border-green-200 pt-3 mt-2 bg-white">
                              <p className="text-xs text-gray-600 mb-2 font-medium">
                                {t('howLikely')}
                              </p>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                {localizedLikelihoodOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    onClick={() => handleLikelihoodSelection(practice.id, option.label)}
                                    className={`p-2 border-2 rounded-lg text-xs transition-all ${
                                      selectedLikelihood === option.label
                                        ? 'border-green-600 bg-green-100 text-green-800 font-semibold'
                                        : 'border-gray-300 hover:border-green-400 text-gray-700'
                                    }`}
                                  >
                                    {option.label}
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
              {t('continue')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Weather Result Screen
  if (screen === 'weather-result') {
    const WeatherIcon = weatherShock ? weatherShock.icon : null;
    const seasonType = currentSeason % 2 === 1 ? (language === 'hindi' ? 'ରବି' : 'Rabi') : (language === 'hindi' ? 'ଖରିଫ' : 'Kharif');
    const localizedPractices = getLocalizedPractices();
    
    const seasonTypeOdiaGraph = getSeasonDamageLabel(currentSeason - 1, {language, seasonData, currentSeason, weatherShock,});

    const getWeatherShockDisplayName = () => {
      if (!weatherShock) return '';

      // For English UI, just use whatever is stored
      if (language !== 'hindi') return weatherShock.name;

      // For Odia UI, map English names → Odia; if already Odia, just return it
      const englishName = weatherShock.weatherShockEnglish || weatherShock.name;

      const shockMap = {
        'Flood': 'ବନ୍ୟା',
        'Heavy Rain': 'ପ୍ରବଳ ବର୍ଷା',
        'Pest and Disease': 'କୀଟପତଙ୍ଗ ଏବଂ ରୋଗ',
      };

      return shockMap[englishName] || englishName;
    };

    const getResultComparisonData = () => {
      const values = [currentFarmer.initialKhetscore];
      const labels = [t('initial')];

      for (let i = 0; i < currentSeason - 1; i++) {
        if (seasonData[i]) {
          values.push(seasonData[i].endScore);
          const sType = getSeasonDamageLabel(i, {language, seasonData, currentSeason, weatherShock,});
          labels.push(`${t('season')} ${i + 1} ${sType}`);
        }
      }

      // Current season
      values.push(currentFarmer.currentKhetscore);
      labels.push(`${t('season')} ${currentSeason} ${seasonTypeOdiaGraph}`);

      return { values, labels };
    };

    const getNoWeatherComparisonData = () => {
      const values = [currentFarmer.initialKhetscore];
      const labels = [t('initial')];

      // Previous seasons, but explicitly “without damage”
      for (let i = 0; i < currentSeason - 1; i++) {
        if (seasonData[i]) {
          values.push(seasonData[i].noWeatherScore);
          const sType = getSeasonDamageLabel(i, {language, seasonData, currentSeason, weatherShock, forceNoDamage: true,});
          labels.push(`${t('season')} ${i + 1} ${sType}`);
        }
      }

      // Current season, always “without damage” for the no-weather run
      values.push(noWeatherKhetscore);
      labels.push(
        `${t('season')} ${currentSeason} ${getSeasonDamageLabel(currentSeason - 1, {language, seasonData, currentSeason, weatherShock, forceNoDamage: true,})}`
      );

      return { values, labels };
    };
    
    const resultData = getResultComparisonData();
    const noWeatherData = getNoWeatherComparisonData();
    
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
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  {t('home')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-6">
                {t('season')} {currentSeason} {seasonType} {t('results')}
              </h2>
              
              {weatherShock ? (
                <div className="mb-8">
                  <div className="inline-block bg-red-100 p-6 rounded-full mb-4">
                    <WeatherIcon className="w-16 h-16 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">
                    {t('weatherShock')}: {getWeatherShockDisplayName()}
                  </h3>
                  <p className="text-gray-600">{t('farmAffected')}{' '} {language === 'hindi' ? getWeatherShockDisplayName() : (weatherShock.weatherShockEnglish || weatherShock.name).toLowerCase()}</p>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="inline-block bg-green-100 p-6 rounded-full mb-4">
                    <Sun className="w-16 h-16 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{t('noWeatherShock')}</h3>
                  <p className="text-gray-600">{t('favorableConditions')}</p>
                </div>
              )}
              
              <ComparisonBarChart 
                values={resultData.values}
                labels={resultData.labels}
                noWeatherValues={noWeatherData.values}
                title={`${t('season')} ${currentSeason} ${seasonType} - ${t('khetscoreComparison')}`}
                language={language}
              />
              
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 mt-6 max-h-64 overflow-y-auto">
                <p className="font-medium text-gray-700 mb-2">
                  {t('selectedPracticesLabel')} ({selectedPractices.length}):
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedPractices.map(id => (
                    <li key={id}>• {localizedPractices.find(p => p.id === id)?.name || 'Practice not found'}</li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={handleWeatherContinue}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {t('continueSimulation')} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Summary Screen with Vertical Bar Charts
  if (screen === 'summary') {

    const localizedPractices = getLocalizedPractices();

    const scores = [
      currentFarmer.initialKhetscore,
      seasonData[0]?.endScore || currentFarmer.initialKhetscore,
      seasonData[1]?.endScore || currentFarmer.initialKhetscore,
      seasonData[2]?.endScore || currentFarmer.initialKhetscore
    ];
    
    const noWeatherScores = [
      currentFarmer.initialKhetscore,
      seasonData[0]?.noWeatherScore || currentFarmer.initialKhetscore,
      seasonData[1]?.noWeatherScore || currentFarmer.initialKhetscore,
      seasonData[2]?.noWeatherScore || currentFarmer.initialKhetscore
    ];

    const getWeatherShockTranslation = (englishName) => {
      if (!englishName || englishName === 'None') {
        return language === 'hindi' ? 'କୌଣସି ମୌସମ ଝଟକା ନାହିଁ' : 'None';
      }
      
      const shockMap = {
        'Flood': language === 'hindi' ? 'ବନ୍ୟା' : 'Flood',
        'Heavy Rain': language === 'hindi' ? 'ପ୍ରବଳ ବର୍ଷା' : 'Heavy Rain',
        'Pest and Disease': language === 'hindi' ? 'କୀଟପତଙ୍ଗ ଏବଂ ରୋଗ' : 'Pest and Disease'
      };
      
      return shockMap[englishName] || englishName;
    };

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

    const VerticalBarChartCombined = ({ values, noWeatherValues, labels}) => {
      const maxScore = 100;

      return (
        <div className="relative">
          {/* Tighter gap between bars */}
          <div className="flex items-end justify-center gap-[1px] sm:gap-[2px] h-64">
            {values.map((value, idx) => {
              const prevValue = idx > 0 ? values[idx - 1] : value;
              const isStart = idx === 0;
              const isIncrease = value >= prevValue && !isStart;
              const isDecrease = value < prevValue && !isStart;

              let barColor = "#0d3385";
              if (isIncrease) barColor = "#2a9e1c";
              if (isDecrease) barColor = "#a61212";

              const heightPercentage = (value / maxScore) * 100;

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Value label */}
                  <div
                    className="text-xs sm:text-sm font-semibold mb-1"
                    style={{ color: barColor }}
                  >
                    {value}
                  </div>

                  {/* Main bar - slightly thinner */}
                  <div
                    className="w-8 sm:w-10 rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${heightPercentage * 2}px`,
                      backgroundColor: barColor,
                      minHeight: "20px",
                    }}
                  />

                  {/* Base line */}
                  <div className="w-full mt-1">
                    <div className="w-8 sm:w-10 h-1 bg-gray-300 mx-auto" />
                  </div>

                  {/* Season label - narrower width so bars can sit closer */}
                  <div className="text-[10px] sm:text-xs text-gray-700 mt-3 text-center w-16 sm:w-20 h-8 sm:h-10 flex items-start justify-center leading-tight">
                    <span>{labels[idx]}</span>
                  </div>
                </div>
              );
            })}

            {/* Single NoWeather bar at the end */}
            {noWeatherValues && (
              <div className="flex flex-col items-center justify-end border-l border-gray-300 pl-2 sm:pl-2 ml-0 sm:ml-1">
                {/* NoWeather value */}
                <div className="text-xs sm:text-sm font-semibold mb-1 text-orange-600">
                  {noWeatherValues[noWeatherValues.length - 1]}
                </div>

                {/* NoWeather bar - same width as others */}
                <div
                  className="w-8 sm:w-10 rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${
                      (noWeatherValues[noWeatherValues.length - 1] / maxScore) *
                      2 *
                      100
                    }px`,
                    backgroundColor: "#f97316",
                    minHeight: "20px",
                  }}
                />

                {/* Base line */}
                <div className="w-full mt-1">
                  <div className="w-8 sm:w-10 h-1 bg-gray-300 mx-auto" />
                </div>

                {/* Label */}
                <div className="text-[10px] sm:text-xs text-gray-700 mt-3 text-center w-16 sm:w-20 h-8 sm:h-10 flex items-start justify-center leading-tight">
                  <span>{t('noWeatherScore')}</span>
                </div>
              </div>
            )}
          </div>
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
                <LanguageToggle language={language} setLanguage={setLanguage} />
                <button
                  onClick={handleHomeClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Home className="w-5 h-5" />
                  {t('home')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-8xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-800 mb-2">{t('simulationComplete')}</h2>
              <p className="text-gray-600">{t('farmer')}: {currentFarmer.Name} (ID: {currentFarmer.farmerID})</p>
            </div>
            
            {/* Initial Khetscore Section */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('initialKhetscore')}</h3>
              <VerticalBarChart 
                values={[scores[0], scores[3]]}
                labels={[t('start'), t('final')]}
                showInitialOnly={false}
              />
            </div>

            {/* Season-wise Progress */}
            <div className="space-y-8">              
              {seasonData.map((season, idx) => {
                const seasonScores = scores.slice(0, idx + 2);
                const seasonNoWeatherScores = noWeatherScores.slice(0, idx + 2);
                const seasonLabels = [
                  t('start'),
                  ...Array.from({ length: idx + 1 }, (_, j) => getSeasonDamageLabel(j)),
                ];
                
                const sType = getSeasonDamageLabel(idx);
                
                return (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-green-800">
                              {t('season')} {season.season} - {sType}
                            </h3>
                            <p className="text-sm text-gray-600">{t('weather')}: {getWeatherShockTranslation(season.weatherShockEnglish || season.weatherShock)}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-green-100 px-4 py-2 rounded-lg">
                              <p className="text-xs text-gray-600">{t('withWeather')}</p>
                              <p className="text-lg font-bold text-green-700">{season.endScore}</p>
                            </div>
                            <div className="bg-blue-100 px-4 py-2 rounded-lg">
                              <p className="text-xs text-gray-600">{t('noWeather')}</p>
                              <p className="text-lg font-bold text-blue-700">{season.noWeatherScore}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {t('practicesSelected')} ({season.practiceIds?.length || season.practices.length}):
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto">
                            {season.practiceIds?.map((id, pIdx) => (
                              <li key={pIdx}>• {localizedPractices.find(p => p.id === id)?.name || season.practices[pIdx]}</li>
                            )) || season.practices.map((practice, pIdx) => (
                              <li key={pIdx}>• {practice}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                        <div className="w-full">
                          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
                            {t('scoreProgression')}
                          </h4>
                          <VerticalBarChartCombined 
                            values={seasonScores}
                            noWeatherValues={seasonNoWeatherScores}
                            labels={seasonLabels}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 mt-8">
              <button
                onClick={() => handleUploadToDrive()}
                disabled={
                  uploadingToDrive ||
                  !googleApiLoaded ||
                  (currentFarmer && uploadedSimulationIds.includes(currentFarmer.farmerID))
                }
                className="flex-1 min-w-[160px] bg-[#6c2484] text-white px-3 py-4 rounded-md text-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                {uploadingToDrive ? '...' : t('uploadToDrive')}
              </button>

              <button
                onClick={handleSaveAndReturn}
                className="flex-1 min-w-[160px] bg-green-600 text-white px-3 py-4 rounded-md text-lg font-medium hover:bg-green-700 transition shadow-sm"
              >
                {t('saveReturn')}
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