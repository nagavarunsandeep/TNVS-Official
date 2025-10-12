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
    
    const headerUserName = document.getElementById('headerUserName');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerTitle = document.getElementById('headerTitle');
    
    // Content sections
    const dashboardContent = document.getElementById('dashboardContent');
    const profileContent = document.getElementById('profileContent');
    const automationContent = document.getElementById('automationContent');
    const aiHelperContent = document.getElementById('aiHelperContent');
    const settingsContent = document.getElementById('settingsContent');
    
    // Sidebar links
    const sidebarNav = document.getElementById('sidebarNav');
    const dashboardLink = document.getElementById('dashboardLink');
    const profileLink = document.getElementById('profileLink');
    const automationLink = document.getElementById('automationLink');
    const aiHelperLink = document.getElementById('aiHelperLink');
    
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
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileFormContainer = document.getElementById('editProfileForm');

    // New Dashboard elements
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileCompleteness = document.getElementById('profileCompleteness').querySelector('span');
    const quickEditProfile = document.getElementById('quickEditProfile');
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
    
    function showSection(sectionToShow, activeLink) {
        // Hide all sections
        [dashboardContent, profileContent, automationContent, aiHelperContent, settingsContent].forEach(sec => sec.classList.add('hidden'));
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

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(settingsContent, settingsLink);
        headerTitle.textContent = 'Settings';
    });

    quickEditProfile.addEventListener('click', () => {
        // Simulate clicking the profile link in the sidebar
        profileLink.click();
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
    
    // --- Edit Profile Logic ---
    editProfileBtn.addEventListener('click', () => {
        profileContent.classList.add('hidden');
        editProfileFormContainer.classList.remove('hidden');
        populateEditForm();
    });

    async function populateEditForm() {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch the latest data from Firestore to ensure the form is up-to-date
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        const userData = docSnap.exists() ? docSnap.data() : {};

        const currentName = userData.displayName || user.displayName || '';

        editProfileFormContainer.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Your Profile</h3>
            <form id="profile-edit-form" class="space-y-6">
                <div>
                    <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input type="text" id="edit-name" value="${currentName}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
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

        try {
            // Update Auth profile
            await updateProfile(user, { displayName: newName });

            // Update Firestore document
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { 
                displayName: newName, 
            }, { merge: true });

            // Update UI
            profileName.textContent = newName;
            profileDetailName.textContent = newName;
            headerUserName.textContent = newName;

            alert('Profile updated successfully!');
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

        return "I'm sorry, I can't generate content for that prompt yet. Please try asking for a 'professional email', a 'thank you note', or a 'social media post'.";
    }

    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'auth.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
            alert('Failed to log out. Please try again.');
        });
    });

    // --- Theme/Dark Mode Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const headerThemeToggle = document.getElementById('headerThemeToggle');
    const themeIconSun = document.getElementById('themeIconSun');
    const themeIconMoon = document.getElementById('themeIconMoon');
    const htmlEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            themeToggle.checked = true;
            themeIconSun.classList.add('hidden');
            themeIconMoon.classList.remove('hidden');
        } else {
            htmlEl.classList.remove('dark');
            themeToggle.checked = false;
            themeIconSun.classList.remove('hidden');
            themeIconMoon.classList.add('hidden');
        }
    }

    function toggleTheme() {
        const newTheme = htmlEl.classList.contains('dark') ? 'light' : 'dark';
        localStorage.theme = newTheme;
        applyTheme(newTheme);
    }

    // Set initial theme on page load
    const savedTheme = localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggle.addEventListener('change', toggleTheme);
    headerThemeToggle.addEventListener('click', toggleTheme);

    // Make sure to configure Tailwind to use the 'class' strategy for dark mode.
    // In your tailwind.config.js, you should have:
    // module.exports = {
    //   darkMode: 'class',
    //   // ... other settings
    // }


    // --- Chatbot Logic ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        // A small animation trick
        if (!chatbotWindow.classList.contains('hidden')) {
            setTimeout(() => {
                chatbotWindow.classList.add('active');
            }, 10);
        } else {
            chatbotWindow.classList.remove('active');
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
        chatbotWindow.classList.remove('active');
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

        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello there! How can I assist you with TNVS Official today?";
        }
        if (lowerInput.includes('dashboard')) {
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
        if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
            return "I can help with questions about your profile, automation tasks, or navigating the dashboard. For example, try asking 'How do I change my photo?' or 'Tell me about the data entry bot'.";
        }
        if (lowerInput.includes('youtube')) {
            return 'You can find our official channel on the dashboard. There is a "Subscribe" button that will take you right there!';
        }
        if (lowerInput.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        if (lowerInput.includes('what is this') || lowerInput.includes('about tnvs')) {
            return "This is the official dashboard for TNVS. Here you can manage your profile and access exclusive automation tools.";
        }
        if (lowerInput.includes('who are you')) {
            return "I am the TNVS AI Assistant, designed to help you use this dashboard. How can I assist you?";
        }
        if (lowerInput.includes('bye')) {
            return "Goodbye! Feel free to reach out if you need anything else.";
        }
        if (lowerInput.includes('contact')) {
            return "Contact us 9959933166";
        }

        return "I'm sorry, I'm not sure how to answer that yet. I am still learning. You can try asking about your profile or automation tasks.";
    }
});
