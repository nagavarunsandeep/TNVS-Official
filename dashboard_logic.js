import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword, deleteUser } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyA3u_PaiNu_XdmGO4mNw3WXzE8CRJRxmik",
        authDomain: "tnvs-site.firebaseapp.com",
        projectId: "tnvs-site",
        storageBucket: "tnvs-site.firebasestorage.app",
        messagingSenderId: "278029964442",
        appId: "1:278029964442:web:f961a26ca0b20ea61b7b23",
        measurementId: "G-HZ3DZ31081"
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    const db = getFirestore(app);

    // Define admin users by their email.
    const ADMIN_EMAILS = ['nagavarunsandeep@gmail.com', 'youremail@example.com']; // This can be removed if not used elsewhere

    const sidebar = document.getElementById('sidebar');
    
    const headerUserName = document.getElementById('headerUserName');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerTitle = document.getElementById('headerTitle');
    
    // Content sections
    const dashboardContent = document.getElementById('dashboardContent');
    const profileContent = document.getElementById('profileContent');
    const automationContent = document.getElementById('automationContent');
    const aiHelperContent = document.getElementById('aiHelperContent');
    const gameContent = document.getElementById('gameContent');
    const settingsContent = document.getElementById('settingsContent');
    
    // Sidebar links
    const sidebarNav = document.getElementById('sidebarNav');
    const dashboardLink = document.getElementById('dashboardLink');
    const profileLink = document.getElementById('profileLink');
    const automationLink = document.getElementById('automationLink');
    const aiHelperLink = document.getElementById('aiHelperLink');
    const gameLink = document.getElementById('gameLink');
    const settingsLink = document.getElementById('settingsLink');

    // Profile detail elements
    const profilePicture = document.getElementById('profilePicture');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const photoUpload = document.getElementById('photoUpload');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const profileDetailName = document.getElementById('profileDetailName');
    const profileDetailEmail = document.getElementById('profileDetailEmail');
    const uploadSpinner = document.getElementById('uploadSpinner');
    const headerProfilePic = document.getElementById('headerProfilePic');

    // Edit Profile elements
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');

    // Header Dropdown elements
    const profileDropdownToggle = document.getElementById('profileDropdownToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const headerLogoutBtn = document.getElementById('headerLogoutBtn');

    // New Dashboard elements
    const welcomeMessage = document.getElementById('welcomeMessage');
    const quickEditProfile = document.getElementById('quickEditProfile');
    const quickAiHelper = document.getElementById('quickAiHelper');
    const quickAutomation = document.getElementById('quickAutomation');
    const quickGameZone = document.getElementById('quickGameZone');
    const locationInfo = document.getElementById('locationInfo');

    // To-Do List elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // AI Content Helper elements
    const generateAiContentBtn = document.getElementById('generateAiContentBtn');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiContentOutput = document.getElementById('aiContentOutput');
    const aiContentContainer = aiContentOutput.querySelector('div');
    let aiPromptSuggestionsContainer; // Will be created dynamically

    // Chatbot elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // System Info elements
    const osInfo = document.getElementById('osInfo');
    const memoryInfo = document.getElementById('memoryInfo');
    const processorInfo = document.getElementById('processorInfo');
    const browserInfo = document.getElementById('browserInfo');

    // Report Issue Modal elements
    const reportIssueModal = document.getElementById('reportIssueModal');
    const reportModalContent = reportIssueModal.querySelector('div');
    const closeReportModalBtn = document.getElementById('closeReportModalBtn');
    const cancelReportBtn = document.getElementById('cancelReportBtn');
    const reportIssueForm = document.getElementById('reportIssueForm');
    const reportFeatureName = document.getElementById('reportFeatureName');
    const issueDescription = document.getElementById('issueDescription');
    const submitReportBtn = document.getElementById('submitReportBtn');

    // Toast Notification elements
    const toastNotification = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    // Settings Page elements
    const changePasswordBtn = document.getElementById('changePasswordBtn');

    // Change Password Modal elements
    const changePasswordModal = document.getElementById('changePasswordModal');
    const passwordModalContent = changePasswordModal.querySelector('div');
    const closePasswordModalBtn = document.getElementById('closePasswordModalBtn');
    const cancelPasswordChangeBtn = document.getElementById('cancelPasswordChangeBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');

    // Delete Account Modal elements
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const deleteModalContent = deleteAccountModal.querySelector('div');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    function showSection(sectionToShow, activeLink) {
        // Hide all sections
        [dashboardContent, profileContent, automationContent, aiHelperContent, gameContent, settingsContent].forEach(sec => sec.classList.add('hidden'));
        // Deactivate all links
        sidebarNav.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    
        // Show the target section and activate the link
        sectionToShow.classList.remove('hidden');
        activeLink.classList.add('active');
    }
    
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(dashboardContent, dashboardLink);
        headerTitle.textContent = 'Dashboard Overview';
    });
    
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(profileContent, profileLink);
        headerTitle.textContent = 'User Profile';
    });
    
    automationLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(automationContent, automationLink);
        headerTitle.textContent = 'Windows Automation';
    });

    aiHelperLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(aiHelperContent, aiHelperLink);
        headerTitle.textContent = 'AI Content Helper';
    });

    gameLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(gameContent, gameLink);
        headerTitle.textContent = 'TNVS Game Zone';
    });

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(settingsContent, settingsLink);
        headerTitle.textContent = 'Settings';
    });

    quickEditProfile.addEventListener('click', () => {
        // Simulate clicking the profile link in the sidebar
        profileLink.click();
    });

    quickAiHelper.addEventListener('click', () => {
        aiHelperLink.click();
    });

    quickAutomation.addEventListener('click', () => {
        automationLink.click();
    });

    quickGameZone.addEventListener('click', () => {
        gameLink.click();
    });

    // --- WScript Integration Logic ---
    const runGreeterScriptBtn = document.getElementById('runGreeterScriptBtn');

    runGreeterScriptBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to use this feature.");
            return;
        }

        const userName = user.displayName || 'User';
        // VBScript content as a string. Using template literals for easy variable injection.
        const scriptContent = `
' This script was generated by the TNVS Dashboard.
Dim userName
userName = "${userName}"
MsgBox "Hello, " & userName & "!" & vbCrLf & "This is a message from your TNVS Dashboard.", 64, "TNVS Greeter"
`;

        // Create a Blob (Binary Large Object) from the script string
        const blob = new Blob([scriptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'greet_user.vbs'; // The file will be saved with this name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the object URL
    });

    // --- Sidebar Toggle Logic ---
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const showSidebarBtn = document.getElementById('showSidebarBtn');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('w-64');
        sidebar.classList.add('w-0');
        sidebar.classList.add('p-0');
        showSidebarBtn.classList.remove('hidden');
        toggleSidebarBtn.classList.add('hidden');
    });

    showSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('w-64');
        sidebar.classList.remove('w-0');
        sidebar.classList.remove('p-0');
        showSidebarBtn.classList.add('hidden');
        toggleSidebarBtn.classList.remove('hidden');
    });

    // --- Profile Photo Upload Logic ---
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        // Simple validation for file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (PNG, JPG).');
            return;
        }
        uploadProfilePhoto(file);
    });

    async function uploadProfilePhoto(file) {
        const user = auth.currentUser;
        if (!user) return;

        uploadSpinner.classList.remove('hidden');
        const filePath = `profile_pictures/${user.uid}/${file.name}`;
        const storageRef = ref(storage, filePath);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(snapshot.ref);

            await updateProfile(user, { photoURL });
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { photoURL }, { merge: true });

            profilePicture.src = photoURL;
            headerProfilePic.src = photoURL;
            alert('Profile photo updated successfully!');
        } catch (error) {
            console.error("Error uploading profile photo: ", error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            uploadSpinner.classList.add('hidden');
        }
    }
    
    async function populateEditForm() {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch the latest data from Firestore to ensure the form is up-to-date
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.exists() ? docSnap.data() : {};

        const currentName = userData.displayName || user.displayName || '';
        const currentEmail = user.email || '';

        editProfileFormContainer.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Your Profile</h3>
            <form id="profile-edit-form" class="space-y-6">
                <div>
                    <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" id="edit-name" value="${currentName}" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200">
                </div>
                <div>
                    <label for="edit-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" id="edit-email" value="${currentEmail}" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200">
                </div>
                <div>
                    <button type="button" id="cancelEditBtn" class="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                    <button type="submit" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">Save Changes</button>
                </div>
            </form>
        `;

        document.getElementById('cancelEditBtn').addEventListener('click', () => {
            editProfileFormContainer.classList.add('hidden');
            profileContent.classList.remove('hidden');
        });

        document.getElementById('profile-edit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProfileChanges();
        });
    }

    async function saveProfileChanges() {
        const user = auth.currentUser;
        if (!user) return;

        const newName = document.getElementById('edit-name').value;
        const newEmail = document.getElementById('edit-email').value;
        let changesMade = false;

        try {
            // Update display name if it has changed
            if (newName !== (user.displayName || '')) {
                await updateProfile(user, { displayName: newName });
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, { displayName: newName }, { merge: true });
                
                // Update UI
                profileName.textContent = newName;
                profileDetailName.textContent = newName;
                headerUserName.textContent = newName;
                changesMade = true;
            }

            // Update email if it has changed
            if (newEmail !== user.email) {
                // Note: Updating email in Firebase Auth is a sensitive operation
                // and might require re-authentication for security reasons.
                // This implementation attempts a direct update.
                await updateEmail(user, newEmail);
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, { email: newEmail }, { merge: true });

                profileEmail.textContent = newEmail;
                profileDetailEmail.textContent = newEmail;
                changesMade = true;
            }

            if (changesMade) {
                alert('Profile updated successfully!');
            }
            editProfileFormContainer.classList.add('hidden');
            profileContent.classList.remove('hidden');
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert('Failed to update profile. Please try again.');
        }
    }

    function updateWelcomeMessage(name) {
        const hour = new Date().getHours();
        let greeting = "Welcome";
        if (hour < 12) {
            greeting = "Good Morning";
        } else if (hour < 18) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }
        welcomeMessage.textContent = `${greeting}, ${name}!`;
    }

    function initializeFeatureEventListeners() {
        // This function will be called only after auth is confirmed.
        // It sets up listeners for features that might need user data.
        initializeReportIssueLogic();
    }

    // --- Toast Notification Logic ---
    let toastTimeout;
    function showToast(message, isError = false) {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toastNotification.classList.toggle('bg-red-600', isError);
        toastNotification.classList.toggle('bg-gray-800', !isError);
        toastNotification.classList.remove('hidden');
        setTimeout(() => toastNotification.classList.remove('translate-x-full'), 10);

        toastTimeout = setTimeout(() => {
            toastNotification.classList.add('hidden');
            toastNotification.classList.add('translate-x-full');
            setTimeout(() => toastNotification.classList.add('hidden'), 300);
        }, 4000);
    }

    function toggleButtonLoading(button, isLoading) {
        const buttonText = button.querySelector('.button-text');
        const spinner = button.querySelector('.spinner');

        button.disabled = isLoading;
        if (spinner) spinner.classList.toggle('hidden', !isLoading);
        if (buttonText) buttonText.classList.toggle('hidden', isLoading);
    }


    async function updateNetworkInfo() {
        const connectionTypeEl = document.getElementById('connectionType');
        const connectionSpeedEl = document.getElementById('connectionSpeed');
    
        // Update connection type (this is static and fine)
        if (navigator.connection) {
            const connection = navigator.connection;
            connectionTypeEl.textContent = connection.effectiveType.toUpperCase();
        } else {
            connectionTypeEl.textContent = 'Unknown';
        }
    
        // --- Real-time speed test ---
        try {
            const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg"; // A reasonably sized image
            const downloadSize = 587238; // Size of the image in bytes
            const startTime = (new Date()).getTime();
            
            // Use a cache-busting query parameter to ensure a fresh download
            const response = await fetch(imageAddr + "?n=" + Math.random());
            await response.blob(); // Ensure the image is fully downloaded
            
            const endTime = (new Date()).getTime();
            const duration = (endTime - startTime) / 1000; // seconds
            const bitsLoaded = downloadSize * 8;
            const speedBps = (bitsLoaded / duration).toFixed(2);
            const speedKbps = (speedBps / 1024).toFixed(2);
            const speedMbps = (speedKbps / 1024).toFixed(2);
    
            connectionSpeedEl.textContent = `${speedMbps} Mbps`;
        } catch (error) {
            console.error("Speed test error:", error);
            connectionSpeedEl.textContent = "N/A";
        }
    }

    async function updateIpAddress() {
        const ipAddressEl = document.getElementById('ipAddress');
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipAddressEl.textContent = data.ip;
        } catch (error) {
            console.error("Could not fetch IP address:", error);
            ipAddressEl.textContent = "Unavailable";
        }
    }


    function updateLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Use a free reverse geocoding API (Nominatim)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
                        const country = data.address.country || 'Unknown Country';
                        locationInfo.textContent = `${city}, ${country}`;
                    } else {
                        locationInfo.textContent = "Location not found";
                    }
                } catch (error) {
                    console.error("Error fetching location name:", error);
                    locationInfo.textContent = "Could not fetch name";
                }
            }, () => {
                locationInfo.textContent = "Permission denied";
            });
        } else {
            locationInfo.textContent = "Not supported";
        }
    }

    // --- System Information Logic ---
    function updateSystemInfo() {
        // OS Info
        const userAgent = window.navigator.userAgent;
        let os = "Unknown";
        if (userAgent.indexOf("Win") !== -1) os = "Windows";
        if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
        if (userAgent.indexOf("X11") !== -1) os = "UNIX";
        if (userAgent.indexOf("Linux") !== -1) os = "Linux";
        if (userAgent.indexOf("Android") !== -1) os = "Android";
        if (userAgent.indexOf("like Mac") !== -1) os = "iOS";
        
        // Try to get more detailed Windows version info if possible
        if (os === "Windows" && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            navigator.userAgentData.getHighEntropyValues(["platformVersion"])
            .then(ua => {
                if (ua.platformVersion) {
                    const majorVersion = parseInt(ua.platformVersion.split('.')[0]);
                    if (majorVersion >= 13) { // Windows 11 reports 13.0.0 or higher
                        osInfo.textContent = "Windows 11";
                    } else if (majorVersion > 0) { // Windows 10 reports 10.0.0
                        osInfo.textContent = `Windows 10`;
                    } else {
                        osInfo.textContent = "Windows";
                    }
                }
            }).catch(() => {
                osInfo.textContent = "Windows"; // Fallback
            });
        } else if (osInfo) {
            osInfo.textContent = os;
        }

        // Memory Info (Note: this is a non-standard API)
        if (navigator.deviceMemory) {
            memoryInfo.textContent = `${navigator.deviceMemory} GB RAM`;
        }

        // Processor Info
        const cores = navigator.hardwareConcurrency ? ` (${navigator.hardwareConcurrency} cores)` : '';
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            navigator.userAgentData.getHighEntropyValues(['architecture'])
            .then(ua => {
                if (ua.architecture) {
                    processorInfo.textContent = `${ua.architecture}${cores}`;
                } else {
                    processorInfo.textContent = `Unknown${cores}`;
                }
            }).catch(() => {
                processorInfo.textContent = `Not available${cores}`;
            });
        } else {
            // Fallback for browsers without userAgentData
            processorInfo.textContent = `Unknown${cores}`;
        }
        // Browser Info
        if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
            navigator.userAgentData.getHighEntropyValues(['fullVersionList'])
            .then(ua => {
                if (ua.fullVersionList && ua.fullVersionList.length) {
                    const brand = ua.fullVersionList.find(b => b.brand !== "Not A;Brand" && b.brand !== "Chromium");
                    if (brand) {
                        browserInfo.textContent = `${brand.brand} ${brand.version}`;
                    } else {
                        browserInfo.textContent = "Unknown";
                    }
                }
            }).catch(() => {
                browserInfo.textContent = "Not available";
            });
        } else {
            // Fallback for older browsers
            const userAgent = navigator.userAgent;
            let browser = userAgent.match(/(firefox|msie|trident|chrome|safari|opera)/i);
            browser = browser ? browser[0] : "Unknown";
            browserInfo.textContent = browser;
        }
    }

    function populateProfileData(user, displayName, photoURL) {
        // Populate profile page
        profilePicture.src = photoURL;
        profileName.textContent = displayName;
        profileEmail.textContent = user.email;
        profileDetailName.textContent = displayName;
        profileDetailEmail.textContent = user.email;

        // Get creation date from Auth user metadata
        if (user.metadata.creationTime) {
            const creationDate = new Date(user.metadata.creationTime);
            profileMemberSince.textContent = creationDate.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        }

        // Populate header profile pic
        headerProfilePic.src = photoURL;
    }

    function initializeDashboardWidgets() {
        updateSystemInfo();
        updateLocation();
        updateIpAddress(); // Fetch the IP address on load
        updateNetworkInfo(); // Initial call
        setInterval(updateNetworkInfo, 3000); // Update every 3 seconds for a real-time feel
    }
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = `<p class="text-gray-500 dark:text-gray-400 text-center">No tasks yet. Add one above!</p>`;
            return;
        }

        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `flex items-center justify-between p-3 rounded-lg transition ${task.completed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-700'}`;
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.className = `flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`;

            const taskActions = document.createElement('div');
            taskActions.className = 'flex items-center space-x-2';

            const completeButton = document.createElement('button');
            completeButton.className = 'text-green-500 hover:text-green-700';
            completeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
            completeButton.onclick = () => toggleTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'text-red-500 hover:text-red-700';
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
            deleteButton.onclick = () => deleteTask(index);

            taskActions.appendChild(completeButton);
            taskActions.appendChild(deleteButton);
            
            taskElement.appendChild(taskText);
            taskElement.appendChild(taskActions);

            taskList.appendChild(taskElement);
        });
    }

    function addTask(text) {
        if (text.trim() === '') return;
        tasks.unshift({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    // Initial render of tasks
    renderTasks();

    // --- AI Content Helper Logic ---
    const aiPromptSuggestions = [
        'Write an email to a client',
        'Write a thank you note',
        'Create a social media post',
        'List of ideas for a blog',
        'Draft a professional email',
        'Write a cover letter',
        'Write a blog post intro',
        'Create a product description',
        'Draft an event invitation email',
        'Write a customer service reply',
        'Outline a business proposal',
        'Generate slogan ideas',
        'Create a YouTube script idea',
        'Write a LinkedIn summary',
        'Draft a job description',
        'Write a press release',
        'Create a meeting agenda',
        'Write a follow-up email',
        'Write an apology email',
        'Write an email to my HOD',
    ];
    aiPromptSuggestions.push(
        'Write a LinkedIn post about an achievement',
        'Create a Twitter thread on productivity',
        'Generate an Instagram caption for a team photo',
        'Write a Facebook product announcement',
        'Write ad copy for a new product',
        'Explain a concept simply (ELI5)',
        'Write a short story about adventure',
        'Draft a birthday wish for a friend',
        'Summarize a long text for me',
        'Create a poll for social media',
        'Write a product review',
        'Brainstorm video ideas for YouTube'
    );

    function getAiContentResponse(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        if (lowerPrompt.includes('email') && lowerPrompt.includes('client')) {
            return `<p><strong>Subject: Project Update</strong></p>
                    <p>Dear Client,</p>
                    <p>I hope this email finds you well.</p>
                    <p>This is a quick update on the project status. We are currently on track with the timeline and have completed the initial design phase. We will share the mockups with you by the end of the week for your feedback.</p>
                    <p>Best regards,<br>The TNVS Team</p>`;
        }
        if (lowerPrompt.includes('thank you note')) {
            return `<p>Thank you so much for your support! We truly appreciate your contribution and look forward to our continued collaboration. Your generosity makes a significant difference.</p>`;
        }
        if (lowerPrompt.includes('social media post') || lowerPrompt.includes('tweet')) {
            return `<p>Exciting news! We're launching a new feature on the TNVS Dashboard. Stay tuned for more details and get ready for an enhanced experience! #TNVS #NewFeature #Tech</p>`;
        }
        if (lowerPrompt.includes('list of ideas')) {
            return `<ul>
                        <li>"5 Ways Automation Can Boost Your Productivity"</li>
                        <li>"The Future of AI in Web Dashboards"</li>
                        <li>"A Beginner's Guide to VBScript"</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('linkedin post')) {
            return `<p><strong>LinkedIn Post:</strong></p>
                    <p>Thrilled to share that we've just launched a new feature on the TNVS Dashboard! This has been a huge team effort, and I'm incredibly proud of what we've accomplished. A big thank you to everyone involved!</p>
                    <p>#Achievement #Teamwork #ProductLaunch #TNVS</p>`;
        }
        if (lowerPrompt.includes('twitter thread')) {
            return `<p><strong>Twitter Thread Idea (1/3):</strong></p>
                    <p>Want to boost your productivity? Here are 3 quick tips that have helped our team at TNVS:</p>
                    <p>1. Use the Pomodoro Technique: 25 minutes of focused work, followed by a 5-minute break. It's a game-changer for maintaining focus.</p>
                    <p>#Productivity #WorkHacks #Tips</p>`;
        }
        if (lowerPrompt.includes('instagram caption')) {
            return `<p><strong>Instagram Caption:</strong></p>
                    <p>Teamwork makes the dream work! ✨ So proud of this amazing group of people. We're working on some exciting things behind the scenes at TNVS. Stay tuned!</p>
                    <p>#Team #WorkCulture #TNVS #BehindTheScenes #Tech</p>`;
        }
        if (lowerPrompt.includes('facebook announcement')) {
            return `<p><strong>Facebook Announcement:</strong></p>
                    <p>🎉 BIG NEWS! We're excited to officially announce the launch of the new TNVS AI Helper! 🎉</p>
                    <p>Draft emails, generate blog ideas, and create content in seconds, right from your dashboard. It's designed to boost your productivity and streamline your workflow.</p>
                    <p>Check it out now and let us know what you think! 👉 [Link to Dashboard]</p>
                    <p>#NewProduct #LaunchDay #AI #ProductivityTools #TNVS</p>`;
        }
        if (lowerPrompt.includes('ad copy')) {
            return `<p><strong>Ad Copy for a New App:</strong></p>
                    <p><strong>Headline:</strong> Stop Wasting Time. Start Automating.</p>
                    <p><strong>Body:</strong> Introducing the new TNVS App, the all-in-one productivity tool that helps you reclaim your day. Draft emails, organize files, and generate content with a single click. Download now and transform your workflow!</p>
                    <p><strong>Call to Action:</strong> Get Started for Free</p>`;
        }
        if (lowerPrompt.includes('explain') && (lowerPrompt.includes('simply') || lowerPrompt.includes('eli5'))) {
            return `<p><strong>Explain "The Cloud" Like I'm 5:</strong></p>
                    <p>Imagine you have a giant, magical toy box in the sky that you can reach from anywhere. Instead of keeping all your toys (like photos and documents) in your room where you might run out of space, you put them in this sky toy box.</p>
                    <p>Whenever you want to play with a toy, you just ask the magic box, and it gives it to you, no matter where you are. That's what "the cloud" is—a giant, remote storage space for all your digital stuff!</p>`;
        }
        if (lowerPrompt.includes('short story')) {
            return `<p><strong>Short Story Idea:</strong></p>
                    <p>The old compass didn't point north. It pointed to whatever the holder's heart desired most. For Elara, it spun wildly, then settled on the jagged peaks of the Dragon's Tooth mountains. She had always yearned for adventure, but she never expected the compass to lead her to a hidden city, shimmering with technology far beyond her own time, nestled in the heart of the stone.</p>`;
        }
        if (lowerPrompt.includes('summarize')) {
            return `<p><strong>Summary of a Long Text:</strong></p>
                    <p>To get a summary, please paste the text you want to summarize here. The AI will then provide a condensed version highlighting the key points.</p>
                    <p><em>(Note: This is a template. The actual summarization would require a real AI model.)</em></p>`;
        }
        if (lowerPrompt.includes('poll')) {
            return `<p><strong>Social Media Poll Idea:</strong></p>
                    <p><strong>Question:</strong> What's your favorite productivity hack?</p>
                    <ul class="list-disc list-inside">
                        <li>Time Blocking</li>
                        <li>The Pomodoro Technique</li>
                        <li>Eating the Frog</li>
                        <li>Using an AI Assistant</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('product review')) {
            return `<p><strong>Product Review Template:</strong></p>
                    <p><strong>Title:</strong> A Game-Changer for Productivity!</p>
                    <p>I've been using [Product Name] for a few weeks now, and it has completely transformed my workflow. The interface is incredibly intuitive, and the features are powerful yet easy to use. My favorite part is [mention a specific feature].</p>
                    <p>I highly recommend it to anyone looking to [achieve a specific goal, e.g., save time, get more organized]. 5/5 stars!</p>`;
        }
        if (lowerPrompt.includes('brainstorm video ideas')) {
            return `<p><strong>YouTube Video Ideas for a Tech Channel:</strong></p>
                    <ul class="list-disc list-inside">
                        <li>"My Desk Setup 2024 (Productivity Tour)"</li>
                        <li>"5 AI Tools You're Not Using (But Should Be)"</li>
                        <li>"I Automated My Entire Day With Scripts - Here's What Happened"</li>
                        <li>"Building a Website From Scratch in 30 Minutes (Live Challenge)"</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('birthday wish')) {
            return `<p><strong>Birthday Wish for a Friend:</strong></p>
                    <p>Happy Birthday, [Friend's Name]! 🎉</p>
                    <p>Wishing you a day filled with laughter, joy, and everything that makes you happy. Thanks for being such an amazing friend. Here's to another fantastic year of adventures and great memories!</p>
                    <p>Cheers!</p>`;
        }
        if (lowerPrompt.includes('professional email')) {
            return `<p><strong>Subject: Regarding [Subject of Email]</strong></p>
                    <p>Dear [Recipient Name],</p>
                    <p>I hope this email finds you well.</p>
                    <p>I am writing to follow up on [mention the topic]. I would like to [state the purpose of the email, e.g., schedule a meeting, ask a question, provide an update].</p>
                    <p>Please let me know what time works best for you.</p>
                    <p>Thank you for your time and consideration.</p>
                    <p>Best regards,<br>[Your Name]</p>`;
        }
        if (lowerPrompt.includes('cover letter')) {
            return `<p><strong>Subject: Application for [Job Title] Position</strong></p>
                    <p>Dear [Hiring Manager Name],</p>
                    <p>I am writing to express my keen interest in the [Job Title] position I saw advertised on [Platform]. With my experience in [mention relevant skills], I am confident I would be a valuable asset to your team.</p>
                    <p>I have attached my resume for your review and look forward to the possibility of discussing this exciting opportunity with you further.</p>
                    <p>Sincerely,<br>[Your Name]</p>`;
        }
        if (lowerPrompt.includes('blog post intro')) {
            return `<p><strong>Title: Unlocking the Power of AI in Your Daily Workflow</strong></p>
                    <p>In a world where efficiency is key, Artificial Intelligence (AI) is no longer a futuristic concept but a practical tool that can revolutionize how we work. From automating mundane tasks to providing deep insights from data, AI is reshaping industries. In this post, we'll explore how you can integrate simple AI helpers into your daily workflow to save time, reduce errors, and focus on what truly matters. Let's dive in!</p>`;
        }
        if (lowerPrompt.includes('product description')) {
            return `<p><strong>Product: The TNVS AI Assistant</strong></p>
                    <p>Meet your new productivity partner: the TNVS AI Assistant. Seamlessly integrated into your dashboard, this powerful tool helps you draft emails, generate content ideas, and streamline your creative process. With its intuitive interface, you can get instant help without ever leaving your workspace. Boost your efficiency and unlock your creative potential with the TNVS AI Assistant today!</p>`;
        }

        if (lowerPrompt.includes('event invitation')) {
            return `<p><strong>Subject: You're Invited! [Event Name]</strong></p>
                    <p>Dear [Guest Name],</p>
                    <p>We're excited to invite you to [Event Name], where we will be [briefly describe the event's purpose, e.g., celebrating a milestone, launching a new product].</p>
                    <p><strong>Date:</strong> [Date]<br><strong>Time:</strong> [Time]<br><strong>Location:</strong> [Venue/Address or Virtual Link]</p>
                    <p>We would be delighted to have you join us for this special occasion. Please RSVP by [RSVP Date] so we can get a headcount.</p>
                    <p>Best regards,<br>The TNVS Team</p>`;
        }
        if (lowerPrompt.includes('customer service reply')) {
            return `<p><strong>Subject: Re: Regarding your recent inquiry</strong></p>
                    <p>Dear [Customer Name],</p>
                    <p>Thank you for reaching out to us. We are very sorry to hear about the issue you experienced with [mention the issue]. That is certainly not the standard of service we aim to provide.</p>
                    <p>We are looking into this immediately. To help us resolve this for you, could you please provide [ask for any necessary information, e.g., your order number]?</p>
                    <p>We appreciate your patience and understanding.</p>
                    <p>Sincerely,<br>[Your Name]<br>Customer Support</p>`;
        }
        if (lowerPrompt.includes('business proposal outline')) {
            return `<h4>Business Proposal: [Project Title]</h4>
                    <ol class="list-decimal list-inside space-y-2">
                        <li><strong>Executive Summary:</strong> A brief overview of the proposal.</li>
                        <li><strong>Problem Statement:</strong> Clearly define the problem your project will solve.</li>
                        <li><strong>Proposed Solution:</strong> Detail your solution and how it addresses the problem.</li>
                        <li><strong>Timeline & Deliverables:</strong> Outline the project schedule and key milestones.</li>
                        <li><strong>Budget:</strong> Provide a breakdown of the costs involved.</li>
                    </ol>`;
        }

        if (lowerPrompt.includes('slogan ideas')) {
            return `<p><strong>Marketing Slogans for a New Tech Product:</strong></p>
                    <ul class="list-disc list-inside">
                        <li>"Innovate Your World."</li>
                        <li>"The Future, Simplified."</li>
                        <li>"Efficiency at Your Fingertips."</li>
                        <li>"Powering Your Potential."</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('youtube script idea')) {
            return `<p><strong>Title: My Top 5 Favorite Automation Scripts!</strong></p>
                    <p><strong>(Intro)</strong> Hey everyone, and welcome back to the channel! Today, I'm going to share something that has saved me countless hours: my top 5 favorite automation scripts. Whether you're a developer, a student, or just someone who wants to be more efficient, these scripts are game-changers.</p>
                    <p><strong>(Script 1: File Organizer)</strong> First up, we have the file organizer...</p>`;
        }
        if (lowerPrompt.includes('linkedin summary')) {
            return `<p><strong>LinkedIn Profile Summary:</strong></p>
                    <p>Results-driven [Your Profession, e.g., Software Engineer] with over [X] years of experience in [Your Industry]. Passionate about [mention a passion, e.g., building scalable web applications and creating intuitive user experiences]. Proven ability to lead projects and collaborate effectively with cross-functional teams to deliver high-quality products.</p>`;
        }
        if (lowerPrompt.includes('job description')) {
            return `<p><strong>Job Title: [e.g., Frontend Developer]</strong></p>
                    <p><strong>Location:</strong> [e.g., Remote]</p>
                    <p><strong>About the Role:</strong> We are looking for a passionate [Job Title] to join our dynamic team. You will be responsible for [mention key responsibilities, e.g., developing and maintaining web applications].</p>
                    <p><strong>Requirements:</strong></p>
                    <ul class="list-disc list-inside">
                        <li>Proven experience as a [Job Title].</li>
                        <li>Proficiency in [mention skills, e.g., React, HTML, CSS].</li>
                        <li>Excellent problem-solving skills.</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('press release')) {
            return `<p><strong>FOR IMMEDIATE RELEASE</strong></p>
                    <p><strong>[Your Company] Announces Launch of Revolutionary New Product: [Product Name]</strong></p>
                    <p><strong>[City, State] – [Date]</strong> – [Your Company] today announced the launch of [Product Name], a groundbreaking solution designed to [solve a specific problem]. "[Quote about the product's benefit]," said [Your Name/CEO Name], CEO of [Your Company].</p>
                    <p>The product is available starting [Date] at [Website/Store].</p>
                    <p>###</p>`;
        }
        if (lowerPrompt.includes('meeting agenda')) {
            return `<p><strong>Meeting Agenda: [Meeting Title]</strong></p>
                    <p><strong>Date:</strong> [Date]</p>
                    <p><strong>Attendees:</strong> [List of Attendees]</p>
                    <ol class="list-decimal list-inside">
                        <li><strong>Review of Previous Action Items</strong> (5 mins)</li>
                        <li><strong>Project Milestone Updates</strong> (15 mins)</li>
                        <li><strong>Discussion on [Main Topic]</strong> (25 mins)</li>
                        <li><strong>Next Steps & Action Items</strong> (10 mins)</li>
                        <li><strong>Q&A</strong> (5 mins)</li>
                    </ol>`;
        }

        if (lowerPrompt.includes('follow-up email')) {
            return `<p><strong>Subject: Following Up on Our Conversation</strong></p>
                    <p>Dear [Recipient Name],</p>
                    <p>It was a pleasure speaking with you earlier today about [topic of conversation]. I wanted to quickly follow up and reiterate my interest.</p>
                    <p>I am very excited about the opportunity and look forward to hearing from you soon.</p>
                    <p>Best regards,<br>[Your Name]</p>`;
        }

        if (lowerPrompt.includes('apology email')) {
            return `<p><strong>Subject: Apology Regarding [Issue]</strong></p>
                    <p>Dear [Recipient Name],</p>
                    <p>Please accept our sincerest apologies for the recent issue regarding [briefly describe the issue]. We understand the frustration this has caused, and we are taking immediate steps to resolve it. We value your business and are committed to providing a better experience.</p>
                    <p>Sincerely,<br>The TNVS Team</p>`;
        }

        if (lowerPrompt.includes('email') && lowerPrompt.includes('hod')) {
            return `<p><strong>Subject: Regarding [Your Subject, e.g., Project Proposal, Leave Request]</strong></p>
                    <p>Dear [HOD's Name],</p>
                    <p>I hope this email finds you well.</p>
                    <p>I am writing to you today to discuss [briefly state the purpose of your email]. I would like to [provide more details or ask for a meeting].</p>
                    <p>I have attached [mention any attachments, e.g., a document with more details] for your reference.</p>
                    <p>Thank you for your time and consideration. I look forward to your guidance on this matter.</p>
                    <p>Best regards,<br>[Your Name]<br>[Your Designation/Roll Number]</p>`;
        }

        // General email prompt - should be checked after more specific ones
        if (lowerPrompt.includes('write an email') || lowerPrompt === 'email') {
            return `<p><strong>Subject: [A Clear and Concise Subject]</strong></p>
                    <p>Dear [Recipient's Name],</p>
                    <p>I hope this message finds you well.</p>
                    <p>[State the main purpose of your email here. Be clear and to the point.]</p>
                    <p>[Provide any necessary details, context, or background information here.]</p>
                    <p>Thank you for your time.</p>
                    <p>Sincerely,<br>[Your Name]</p>`;
        }

        return "I'm sorry, I can't generate content for that prompt yet. Try asking for 'ad copy', 'write a product review', 'create a poll', or 'professional email'.";
    }

    generateAiContentBtn.addEventListener('click', () => {
        const prompt = aiPromptInput.value.trim();
        if (!prompt) {
            alert("Please enter a prompt for the AI.");
            return;
        }

        aiContentOutput.classList.remove('hidden');
        aiContentContainer.innerHTML = '<p>Generating...</p>';
        generateAiContentBtn.disabled = true;
        
        // Simulate an API call to feel more responsive
        setTimeout(() => {
            const response = getAiContentResponse(prompt);
            aiContentContainer.innerHTML = response; // Use innerHTML to render line breaks
            generateAiContentBtn.disabled = false;
        }, 1000);
    });

    aiPromptInput.addEventListener('keydown', (e) => {
        // Trigger generate on Enter key, but allow Shift+Enter for new lines
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateAiContentBtn.click();
        }
    });

    function createPromptSuggestions() {
        aiPromptSuggestionsContainer = document.createElement('div');
        aiPromptSuggestionsContainer.id = 'aiPromptSuggestions';
        aiPromptSuggestionsContainer.className = 'absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg mt-1 hidden max-h-60 overflow-y-auto';
        // Ensure parent is positioned to contain the absolute suggestions box
        if (aiPromptInput.parentElement.style.position !== 'relative') {
            aiPromptInput.parentElement.style.position = 'relative';
        }
        aiPromptInput.parentElement.appendChild(aiPromptSuggestionsContainer);

        aiPromptInput.addEventListener('input', () => {
            const query = aiPromptInput.value.toLowerCase();
            if (!query) {
                aiPromptSuggestionsContainer.classList.add('hidden');
                return;
            }

            const filtered = aiPromptSuggestions.filter(p => p.toLowerCase().includes(query));
            aiPromptSuggestionsContainer.innerHTML = '';

            if (filtered.length > 0) {
                filtered.forEach(suggestion => {
                    const item = document.createElement('div');
                    item.textContent = suggestion;
                    item.className = 'p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700';
                    item.addEventListener('click', () => {
                        aiPromptInput.value = suggestion;
                        aiPromptSuggestionsContainer.classList.add('hidden');
                        aiPromptInput.focus();
                    });
                    aiPromptSuggestionsContainer.appendChild(item);
                });
                aiPromptSuggestionsContainer.classList.remove('hidden');
            } else {
                aiPromptSuggestionsContainer.classList.add('hidden');
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== aiPromptInput) {
                aiPromptSuggestionsContainer.classList.add('hidden');
            }
        });
    }

    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'auth.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
            alert('Failed to log out. Please try again.');
        });
    });

    profileLogoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'auth.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
            alert('Failed to log out. Please try again.');
        });
    });

    // --- Header Profile Dropdown Logic ---
    profileDropdownToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the document click listener from firing immediately
        profileDropdown.classList.toggle('hidden');
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!profileDropdown.classList.contains('hidden') && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
    });

    // Dropdown logout button
    headerLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutBtn.click(); // Trigger the main logout button's functionality
    });

    // Link to profile page from dropdown
    document.getElementById('dropdownProfileLink').addEventListener('click', (e) => {
        e.preventDefault();
        profileLink.click();
        profileDropdown.classList.add('hidden');
    });

    // --- Chatbot Toggle Logic ---
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.remove('hidden');
        // A small delay to allow the element to be visible before adding the transition class
        setTimeout(() => chatbotWindow.classList.add('active'), 10);
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        setTimeout(() => chatbotWindow.classList.add('hidden'), 300); // Wait for transition to finish
    });

    // Handle message submission
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = chatbotInput.value.trim();
        if (!userInput) return;

        addMessage(userInput, 'user');
        chatbotInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(userInput);
            addMessage(botResponse, 'bot');
        }, 1000);
    });

    // Function to add a message to the chat window
    function addMessage(text, sender) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        const messageBubbleHTML = `<div class="p-3 rounded-lg max-w-xs"><p>${text}</p></div>`;
        messageContainer.innerHTML = messageBubbleHTML;

        chatbotMessages.appendChild(messageContainer);

        // Scroll to the bottom
        messageContainer.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // Simple rule-based bot logic
    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        // --- General questions from TNVS Main Site ---
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! I'm the TNVS AI Assistant. I can help you with questions about the dashboard, your profile, or available features. What can I do for you?";
        }
        if (lowerInput.includes('services')) {
            return 'This dashboard provides access to Windows Automation tools, an AI Content Helper, and the TNVS Game Zone. For our full range of business services like web development, please visit our main website.';
        }

        // --- Dashboard-specific questions ---
        if (lowerInput.includes('dashboard') || lowerInput.includes('overview')) {
            return "You're on the main dashboard! It gives you a quick overview with widgets for time, location, and system info. You can also manage your tasks and use the quick action buttons to jump to other sections.";
        }
        if (lowerInput.includes('profile')) {
            return "You can view and manage your profile by clicking 'Profile' in the sidebar. There, you can update your name and profile picture.";
        }
        if (lowerInput.includes('change my photo') || lowerInput.includes('update picture')) {
            return "To change your profile picture, go to the 'Profile' page, hover over your current photo, and click the camera icon that appears to upload a new one.";
        }
        if (lowerInput.includes('settings')) {
            return "The 'Settings' page allows you to manage notification preferences, change your password, and delete your account. You can find it in the sidebar.";
        }
        if (lowerInput.includes('change password')) {
            return "You can change your password in the 'Settings' section. Click on 'Settings' in the sidebar, then find the 'Security' section and click the 'Change' button.";
        }
        if (lowerInput.includes('delete my account') || lowerInput.includes('delete account')) {
            return "You can delete your account from the 'Settings' page. Please be careful, as this action is permanent. You will be asked to enter your password to confirm the deletion.";
        }
        if (lowerInput.includes('automation')) {
            return "The 'Windows Automation' section contains tools to automate tasks on your computer. You can download a script to greet you, launch the Photo Virus file organizer, and more. What would you like to know?";
        }
        if (lowerInput.includes('photo virus')) {
            return "The 'Photo Virus' is a powerful tool that automatically sorts your files into organized folders. You can launch it from the 'Windows Automation' section.";
        }
        if (lowerInput.includes('scheduled tasks')) {
            return "The 'Scheduled Tasks' tool lets you run scripts or applications automatically at specific times. You can configure them in the 'Windows Automation' section.";
        }
        if (lowerInput.includes('data entry bot')) {
            return "The 'Data Entry Bot' helps automate repetitive data entry tasks, saving you time and reducing errors. You can find it in the 'Windows Automation' section.";
        }
        if (lowerInput.includes('logout') || lowerInput.includes('sign out')) {
            return "You can log out by clicking the 'Logout' button at the bottom of the sidebar, or by clicking your profile picture in the top-right corner and selecting 'Logout' from the dropdown.";
        }
        if (lowerInput.includes('system cleanup')) {
            return "The 'System Cleanup' tool helps you free up disk space by removing temporary files and cache. You can run it from the 'Windows Automation' section.";
        }
        if (lowerInput.includes('automated backup')) {
            return "The 'Automated Backup' tool lets you schedule regular backups of your important files to a secure location, protecting your data. Find it in the 'Windows Automation' section.";
        }
        if (lowerInput.includes('greeter script')) {
            return "The 'User Greeter Script' is a fun VBScript file you can download from the 'Windows Automation' page. When you run it, it shows a personalized welcome message with your name!";
        }
        if (lowerInput.includes('what can i ask the ai helper')) {
            return "You can ask the AI Helper to do many things! Try prompts like: 'write a professional email', 'create a blog post intro', 'give me YouTube script ideas', 'draft a product description', or 'write a job description'. Just type your request in the 'AI Helper' section!";
        }
        if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
            return "I can help with questions about your profile, automation tasks, or navigating the dashboard. For example, try asking 'How do I change my photo?', 'Tell me about the data entry bot', or 'How do I play games?'.";
        }
        if (lowerInput.includes('system info') || lowerInput.includes('widgets')) {
            return "The widgets on the dashboard show you real-time information about your system, including your OS, browser, IP address, and network speed. They are there to give you a quick snapshot of your current environment.";
        }
        if (lowerInput.includes('report an issue') || lowerInput.includes('report bug')) {
            return "You can report an issue with any feature by clicking the 'Report Issue' button located on that feature's card. This will open a form where you can describe the problem you're facing.";
        }
        if (lowerInput.includes('who made you') || lowerInput.includes('who created you')) {
            return "I was created by the team at TNVS Official to be your helpful guide for this TNVS Official Site. My purpose is to make your experience here as smooth as possible!";
        }
        if (lowerInput.includes('task') || lowerInput.includes('to-do')) {
            return "You can manage your to-do list in the 'My Tasks' section on the main dashboard. Just type in the input field to add a new task, and use the buttons to mark it as complete or delete it.";
        }
        if (lowerInput.includes('ai helper')) {
            return "The AI Helper can generate content for you! Go to the 'AI Helper' section in the sidebar, type a prompt like 'write a blog post intro about AI', and click 'Generate'.";
        }
        if (lowerInput.includes('sidebar') || lowerInput.includes('menu')) {
            return "You can collapse the sidebar by clicking the double-arrow button in the header. When it's collapsed, a similar button will appear to expand it again.";
        }
        if (lowerInput.includes('how are you')) {
            return "I'm a bot, but I'm doing great! Ready to help you with any questions about the TNVS dashboard.";
        }
        if (lowerInput.includes('youtube') || lowerInput.includes('channel')) {
            return 'You can find our official channel on the dashboard. There is a "Subscribe" button that will take you right there!';
        }
        if (lowerInput.includes('thank you') || lowerInput.includes('thanks')) {
            return "You're welcome! Is there anything else I can assist you with?";
        }
        if (lowerInput.includes('about tnvs') || lowerInput.includes('about')) {
            return 'TNVS Official is a technology company focused on delivering innovative solutions. This dashboard is your personal hub to manage your profile and access exclusive automation tools and games.';
        }
        if (lowerInput.includes('who are you')) {
            return "I am the TNVS AI Assistant, your personal guide for this TNVS Official Site. How can I help you today?";
        }
        if (lowerInput.includes('get started')) {
            return 'You are in the right place! This dashboard is the best place to start. Explore the sections on the left to see what you can do, or ask me a question like "What is the AI Helper?".';
        }
        if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
            return "Goodbye! Feel free to reach out if you need anything else.";
        }
        if (lowerInput.includes('game') || lowerInput.includes('how to play')) {
            return "The TNVS Game Zone features exciting games like Real Car Driving, Real Bike Driving, and Master Chess. You can access it by clicking 'TNVS Games' in the sidebar! Once there, just click 'Play Now' on any game card.";
        }
        if (lowerInput.includes('contact')) {
            return "Contact us 9959933166";
        }

        return "I'm sorry, I'm not sure how to answer that yet. I am still learning. You can try asking about your profile or automation tasks.";
    }

    // --- Report an Issue Logic ---
    function initializeReportIssueLogic() {
        const reportButtons = document.querySelectorAll('.report-issue-btn');
        let currentFeatureToReport = '';

        function openReportModal(featureName) {
            currentFeatureToReport = featureName;
            reportFeatureName.textContent = featureName;
            reportIssueModal.classList.remove('hidden');
            setTimeout(() => {
                reportModalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        }

        function closeReportModal() {
            reportModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                reportIssueModal.classList.add('hidden');
                reportIssueForm.reset();
            }, 300);
        }

        reportButtons.forEach(button => {
            button.addEventListener('click', () => {
                const feature = button.getAttribute('data-feature');
                openReportModal(feature);
            });
        });

        closeReportModalBtn.addEventListener('click', closeReportModal);
        cancelReportBtn.addEventListener('click', closeReportModal);

        reportIssueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const description = issueDescription.value.trim();
            if (!description) {
                showToast('Please describe the issue.', true);
                return;
            }

            const user = auth.currentUser;
            if (!user) {
                showToast('You must be logged in to report an issue.', true);
                return;
            }

            submitReportBtn.disabled = true;
            submitReportBtn.textContent = 'Submitting...';

            try {
                const issuesCollectionRef = collection(db, 'issues');
                await addDoc(issuesCollectionRef, {
                    feature: currentFeatureToReport,
                    description: description,
                    userId: user.uid,
                    userEmail: user.email,
                    reportedAt: serverTimestamp()
                });
                showToast('Thank you! Your issue has been reported successfully.');
                closeReportModal();
            } catch (error) {
                console.error("Error reporting issue:", error);
                showToast('Failed to submit your report. Please try again.', true);
            } finally {
                submitReportBtn.disabled = false;
                submitReportBtn.textContent = 'Submit Report';
            }
        });
    }

    // --- Settings Page Logic ---
    function initializeSettings() {
        // Password visibility toggles for change password modal
        const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
        const currentPasswordInput = document.getElementById('currentPassword');
        toggleCurrentPassword.addEventListener('click', () => {
            const type = currentPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            currentPasswordInput.setAttribute('type', type);
            toggleCurrentPassword.querySelectorAll('svg').forEach(icon => icon.classList.toggle('hidden'));
        });

        const toggleNewPassword = document.getElementById('toggleNewPassword');
        const newPasswordInput = document.getElementById('newPassword');
        toggleNewPassword.addEventListener('click', () => {
            const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            newPasswordInput.setAttribute('type', type);
            toggleNewPassword.querySelectorAll('svg').forEach(icon => icon.classList.toggle('hidden'));
        });

        // Change Password Modal
        changePasswordBtn.addEventListener('click', () => {
            changePasswordModal.classList.remove('hidden');
            setTimeout(() => {
                passwordModalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        });

        function closePasswordModal() {
            passwordModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                changePasswordModal.classList.add('hidden');
                changePasswordForm.reset();
            }, 300);
        }

        closePasswordModalBtn.addEventListener('click', closePasswordModal);
        cancelPasswordChangeBtn.addEventListener('click', closePasswordModal);

        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;

            if (!user || !currentPassword || !newPassword) {
                showToast('Please fill out all fields.', true);
                return;
            }

            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            try {
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                showToast('Password updated successfully!');
                closePasswordModal();
            } catch (error) {
                console.error("Password change error:", error);
                showToast('Failed to change password. Please check your current password.', true);
            }
        });

        // Password visibility toggle for delete account modal
        const toggleDeletePassword = document.getElementById('toggleDeletePassword');
        const deletePasswordInput = document.getElementById('deletePassword');
        toggleDeletePassword.addEventListener('click', () => {
            const type = deletePasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            deletePasswordInput.setAttribute('type', type);
            toggleDeletePassword.querySelectorAll('svg').forEach(icon => icon.classList.toggle('hidden'));
        });

        // Delete Account Modal
        deleteAccountBtn.addEventListener('click', () => {
            deleteAccountModal.classList.remove('hidden');
            setTimeout(() => {
                deleteModalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        });

        function closeDeleteModal() {
            deleteModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                deleteAccountModal.classList.add('hidden');
                deleteAccountForm.reset();
            }, 300);
        }

        closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);

        deleteAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            const password = document.getElementById('deletePassword').value;

            if (!user || !password) {
                showToast('Password is required to delete your account.', true);
                return;
            }

            toggleButtonLoading(confirmDeleteBtn, true);

            const credential = EmailAuthProvider.credential(user.email, password);

            try {
                // Re-authenticate for security
                await reauthenticateWithCredential(user, credential);

                // If re-authentication is successful, proceed with deletion
                const userId = user.uid;

                // 1. Delete profile picture from Storage (if it exists)
                const photoRef = ref(storage, `profile_pictures/${userId}`);
                await deleteObject(photoRef).catch(err => console.warn("Could not delete photo, it might not exist.", err));

                // 2. Delete user document from Firestore
                const userDocRef = doc(db, "users", userId);
                await deleteDoc(userDocRef);

                // 3. Delete the user from Firebase Authentication
                await deleteUser(user);

                // Redirect will be handled by onAuthStateChanged

            } catch (error) {
                console.error("Error deleting account:", error);
                toggleButtonLoading(confirmDeleteBtn, false);
                showToast('Incorrect password or error deleting account.', true);
            }
        });
    }


    // --- Main Authentication Flow ---
    onAuthStateChanged(auth, (user) => {

        if (user) {
            const displayName = user.displayName || 'User';
            updateWelcomeMessage(displayName);
            headerUserName.textContent = displayName;
            const photoURL = user.photoURL || `https://placehold.co/128x128/E0E7FF/4338CA?text=${displayName.charAt(0)}`;
    
            // Populate profile page and header
            populateProfileData(user, displayName, photoURL);
            
            // Initialize dashboard widgets and event listeners that depend on user auth
            initializeDashboardWidgets();
            initializeFeatureEventListeners();
            initializeSettings();
            createPromptSuggestions(); // Initialize the prompt suggestions feature
        } else {
            window.location.href = 'auth.html';
        }
    });
});
