import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile, updateEmail } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
    const profileCompleteness = document.getElementById('profileCompleteness').querySelector('span');
    const quickEditProfile = document.getElementById('quickEditProfile');
    const quickAiHelper = document.getElementById('quickAiHelper');
    const quickAutomation = document.getElementById('quickAutomation');
    const quickGameZone = document.getElementById('quickGameZone');
    const automationTaskCount = document.getElementById('automationTaskCount');

    // To-Do List elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // AI Content Helper elements
    const generateAiContentBtn = document.getElementById('generateAiContentBtn');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiContentOutput = document.getElementById('aiContentOutput');
    const aiContentContainer = aiContentOutput.querySelector('div');

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

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName || 'User';
            headerUserName.textContent = displayName;
            welcomeMessage.textContent = `Welcome, ${displayName}!`;
            const photoURL = user.photoURL || `https://placehold.co/128x128/E0E7FF/4338CA?text=${displayName.charAt(0)}`;
    
            // Populate profile page
            profilePicture.src = photoURL;
            profileName.textContent = displayName;
            profileEmail.textContent = user.email;
            profileDetailName.textContent = displayName;
            profileDetailEmail.textContent = user.email;
    
            // Get creation date from Auth user metadata (this is more reliable)
            if (user.metadata.creationTime) {
                const creationDate = new Date(user.metadata.creationTime);
                profileMemberSince.textContent = creationDate.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
            }

            // Populate header profile pic
            headerProfilePic.src = photoURL;
        } else {
            window.location.href = 'auth.html';
        }
    });

    // Count automation tasks and update the dashboard card
    updateAutomationTaskCount();
    
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

    function calculateProfileCompleteness(user, userData) {
        let score = 0;
        const totalPoints = 2;

        // Point for having a non-default display name
        if (userData.displayName && userData.displayName !== 'User') score++;
        // Point for having a custom profile picture (not a placeholder)
        if (userData.photoURL && !userData.photoURL.includes('placehold.co')) score++;

        const percentage = Math.round((score / totalPoints) * 100);
        profileCompleteness.textContent = `${percentage}%`;
    }

    function updateAutomationTaskCount() {
        const tasks = automationContent.querySelectorAll('.interactive-card');
        const count = tasks.length;
        automationTaskCount.textContent = `${count} Available`;
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
    // --- To-Do List (My Tasks) Logic ---
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
    updateSystemInfo();

    // --- AI Content Helper Logic ---
    generateAiContentBtn.addEventListener('click', () => {
        const prompt = aiPromptInput.value.trim();
        if (!prompt) {
            alert("Please enter a prompt for the AI.");
            return;
        }

        aiContentOutput.classList.remove('hidden');
        aiContentContainer.innerHTML = '<p>Generating...</p>';
        generateAiContentBtn.disabled = true;

        // Simulate an API call to an AI model
        setTimeout(() => {
            const response = getAiContentResponse(prompt);
            aiContentContainer.innerHTML = response; // Use innerHTML to render line breaks
            generateAiContentBtn.disabled = false;
        }, 1500);
    });

    aiPromptInput.addEventListener('keydown', (e) => {
        // Trigger generate on Enter key, but allow Shift+Enter for new lines
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateAiContentBtn.click();
        }
    });

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
        if (lowerPrompt.includes('slogan ideas')) {
            return `<p><strong>Marketing Slogans for a New Tech Product:</strong></p>
                    <ul class="list-disc list-inside">
                        <li>"Innovate Your World."</li>
                        <li>"The Future, Simplified."</li>
                        <li>"Efficiency at Your Fingertips."</li>
                        <li>"Powering Your Potential."</li>
                    </ul>`;
        }
        if (lowerPrompt.includes('blog post intro')) {
            return `<p><strong>Title: Unlocking the Power of AI in Your Daily Workflow</strong></p>
                    <p>In a world where efficiency is key, Artificial Intelligence (AI) is no longer a futuristic concept but a practical tool that can revolutionize how we work. From automating mundane tasks to providing deep insights from data, AI is reshaping industries. In this post, we'll explore how you can integrate simple AI helpers into your daily workflow to save time, reduce errors, and focus on what truly matters. Let's dive in!</p>`;
        }
        if (lowerPrompt.includes('youtube script idea')) {
            return `<p><strong>Title: My Top 5 Favorite Automation Scripts!</strong></p>
                    <p><strong>(Intro)</strong> Hey everyone, and welcome back to the channel! Today, I'm going to share something that has saved me countless hours: my top 5 favorite automation scripts. Whether you're a developer, a student, or just someone who wants to be more efficient, these scripts are game-changers.</p>
                    <p><strong>(Script 1: File Organizer)</strong> First up, we have the file organizer...</p>`;
        }
        if (lowerPrompt.includes('product description')) {
            return `<p><strong>Product: The TNVS AI Assistant</strong></p>
                    <p>Meet your new productivity partner: the TNVS AI Assistant. Seamlessly integrated into your dashboard, this powerful tool helps you draft emails, generate content ideas, and streamline your creative process. With its intuitive interface, you can get instant help without ever leaving your workspace. Boost your efficiency and unlock your creative potential with the TNVS AI Assistant today!</p>`;
        }
        if (lowerPrompt.includes('apology email')) {
            return `<p><strong>Subject: Apology Regarding [Issue]</strong></p>
                    <p>Dear [Recipient Name],</p>
                    <p>Please accept our sincerest apologies for the recent issue regarding [briefly describe the issue]. We understand the frustration this has caused, and we are taking immediate steps to resolve it. We value your business and are committed to providing a better experience.</p>
                    <p>Sincerely,<br>The TNVS Team</p>`;
        }
        if (lowerPrompt.includes('meeting agenda')) {
            return `<p><strong>Meeting Agenda: [Meeting Title]</strong></p>
                    <p><strong>Date:</strong> [Date]</p>
                    <p><strong>Attendees:</strong> [List of Attendees]</p>
                    <ol class="list-decimal list-inside"><li><strong>Review of Previous Action Items</strong> (5 mins)</li><li><strong>Project Milestone Updates</strong> (15 mins)</li><li><strong>Discussion on [Main Topic]</strong> (25 mins)</li><li><strong>Next Steps & Action Items</strong> (10 mins)</li><li><strong>Q&A</strong> (5 mins)</li></ol>`;
        }
        if (lowerPrompt.includes('press release')) {
            return `<p><strong>FOR IMMEDIATE RELEASE</strong></p>
                    <p><strong>[Your Company] Announces Launch of Revolutionary New Product: [Product Name]</strong></p>
                    <p><strong>[City, State] – [Date]</strong> – [Your Company] today announced the launch of [Product Name], a groundbreaking solution designed to [solve a specific problem]. "[Quote about the product's benefit]," said [Your Name/CEO Name], CEO of [Your Company].</p>
                    <p>The product is available starting [Date] at [Website/Store].</p>
                    <p>###</p>`;
        }

        return "I'm sorry, I can't generate content for that prompt yet. Try asking for a 'professional email', 'cover letter', 'slogan ideas', or 'press release'.";
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
            return "Hello there! How can I assist you with TNVS Official today?";
        }
        if (lowerInput.includes('services')) {
            return 'We offer various services including web development, app development, and digital marketing. The dashboard also provides access to Windows Automation tools.';
        }

        // --- Dashboard-specific questions ---
        if (lowerInput.includes('dashboard') || lowerInput.includes('overview')) {
            return "The main dashboard gives you an overview and quick access to our YouTube channel. You can navigate to other sections using the sidebar on the left.";
        }
        if (lowerInput.includes('profile')) {
            return "You can view and manage your profile by clicking on the 'Profile' link in the sidebar. You can update your photo there.";
        }
        if (lowerInput.includes('change my photo') || lowerInput.includes('update picture')) {
            return "To change your profile picture, go to the 'Profile' page, hover over your current photo, and click the camera icon to upload a new one.";
        }
        if (lowerInput.includes('settings')) {
            return "The 'Settings' page is where you'll be able to configure your account preferences. This section is currently under construction.";
        }
        if (lowerInput.includes('analytics')) {
            return "The 'Analytics' page will provide insights and data about your activities. This feature is coming soon!";
        }
        if (lowerInput.includes('automation')) {
            return "The 'Windows Automation' section allows you to manage tasks like File Organizer and Scheduled Tasks. What would you like to know more about?";
        }
        if (lowerInput.includes('photo virus')) {
            return "The Photo Virus is a tool to automatically sort your files into folders based on rules you define. You can launch it from the 'Windows Automation' section.";
        }
        if (lowerInput.includes('scheduled tasks')) {
            return "Scheduled Tasks let you run scripts or applications automatically at specific times or intervals. You can configure them in the 'Windows Automation' section.";
        }
        if (lowerInput.includes('data entry bot')) {
            return "The Data Entry Bot helps automate repetitive data entry tasks, saving you time. You can find it under 'Windows Automation'.";
        }
        if (lowerInput.includes('logout') || lowerInput.includes('sign out')) {
            return "To log out, simply click the 'Logout' button at the bottom of the sidebar.";
        }
        if (lowerInput.includes('system cleanup')) {
            return "The System Cleanup tool helps you free up disk space by removing temporary files and cache. You can run it from the 'Windows Automation' section.";
        }
        if (lowerInput.includes('automated backup')) {
            return "The Automated Backup tool lets you schedule regular backups of your important files to a secure location, protecting your data. Find it in the 'Windows Automation' section.";
        }
        if (lowerInput.includes('greeter script')) {
            return "The User Greeter Script is a fun VBScript file you can download from the 'Windows Automation' page. When you run it, it shows a personalized welcome message with your name!";
        }
        if (lowerInput.includes('what can i ask the ai helper')) {
            return "You can ask the AI Helper to 'write a professional email', 'create a blog post intro', 'give youtube script ideas', or even 'draft a product description'. Just type your request in the AI Helper section!";
        }
        if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
            return "I can help with questions about your profile, automation tasks, or navigating the dashboard. For example, try asking 'How do I change my photo?' or 'Tell me about the data entry bot'.";
        }
        if (lowerInput.includes('task') || lowerInput.includes('to-do')) {
            return "You can manage your tasks in the 'My Tasks' section on the main dashboard. Just type in the input field to add a new task, or use the buttons to mark them as complete or delete them.";
        }
        if (lowerInput.includes('ai helper')) {
            return "The AI Helper can generate content for you! Go to the 'AI Helper' section, type a prompt like 'write a blog post intro', and click 'Generate'.";
        }
        if (lowerInput.includes('sidebar') || lowerInput.includes('menu')) {
            return "You can collapse the sidebar by clicking the arrow button at the bottom. When it's collapsed, a similar button will appear at the top of the main content area to expand it again.";
        }
        if (lowerInput.includes('profile completeness') || lowerInput.includes('profile status')) {
            return "The profile completeness score on your dashboard increases when you add a display name and a custom profile picture. A complete profile helps personalize your experience!";
        }
        if (lowerInput.includes('how are you')) {
            return "I'm a bot, but I'm doing great! Ready to help you with any questions about the dashboard.";
        }
        if (lowerInput.includes('youtube') || lowerInput.includes('channel')) {
            return 'You can find our official channel on the dashboard. There is a "Subscribe" button that will take you right there!';
        }
        if (lowerInput.includes('thank you') || lowerInput.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        if (lowerInput.includes('about tnvs') || lowerInput.includes('about')) {
            return 'TNVS is a technology company focused on delivering innovative solutions. This dashboard is where you can manage your profile and access exclusive automation tools.';
        }
        if (lowerInput.includes('who are you')) {
            return "I am the TNVS AI Assistant, designed to help you use this dashboard. How can I assist you?";
        }
        if (lowerInput.includes('get started')) {
            return 'You are already here! This dashboard is the best place to start. Explore the sections on the left to see what you can do.';
        }
        if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
            return "Goodbye! Feel free to reach out if you need anything else.";
        }
        if (lowerInput.includes('game') || lowerInput.includes('how to play')) {
            return "The TNVS Game Zone features exciting games like Cyberpunk Racer. You can access it by clicking 'TNVS Game' in the sidebar!";
        }
        if (lowerInput.includes('contact')) {
            return "Contact us 9959933166";
        }

        return "I'm sorry, I'm not sure how to answer that yet. I am still learning. You can try asking about your profile or automation tasks.";
    }
});
