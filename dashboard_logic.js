import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyA3u_PaiNu_XdmGO4mNw3WXzE8CRJRxmik",
        authDomain: "tnvs-site.firebaseapp.com",
        projectId: "tnvs-site",
        storageBucket: "tnvs-site.appspot.com",
        messagingSenderId: "278029964442",
        appId: "1:278029964442:web:f961a26ca0b20ea61b7b23",
        measurementId: "G-HZ3DZ31081"
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    const db = getFirestore(app);
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerTitle = document.getElementById('headerTitle');
    
    // Content sections
    const dashboardContent = document.getElementById('dashboardContent');
    const profileContent = document.getElementById('profileContent');
    const automationContent = document.getElementById('automationContent');
    const settingsContent = document.getElementById('settingsContent');
    
    // Sidebar links
    const sidebarNav = document.getElementById('sidebarNav');
    const dashboardLink = document.getElementById('dashboardLink');
    const profileLink = document.getElementById('profileLink');
    const automationLink = document.getElementById('automationLink');
    
    const settingsLink = document.getElementById('settingsLink');
    // Profile detail elements
    const profilePicture = document.getElementById('profilePicture');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileDetailName = document.getElementById('profileDetailName');
    const profileDetailEmail = document.getElementById('profileDetailEmail');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const photoUpload = document.getElementById('photoUpload');
    const uploadSpinner = document.getElementById('uploadSpinner');
    const headerProfilePic = document.getElementById('headerProfilePic');
    
    function showSection(sectionToShow, activeLink) {
        // Hide all sections
        [dashboardContent, profileContent, automationContent,settingsContent].forEach(sec => sec.classList.add('hidden'));
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
    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(settingsContent, settingsLink);
        headerTitle.textContent = 'Settings';
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
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName || 'User';
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
    
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'auth.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
            alert('Failed to log out. Please try again.');
        });
    });

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

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('p-3', 'rounded-lg', 'max-w-xs');
        messageBubble.innerHTML = `<p>${text}</p>`;

        chatbotMessages.appendChild(messageContainer);
        messageContainer.appendChild(messageBubble); // The bubble is the direct child for styling

        // Scroll to the bottom
        messageBubble.scrollIntoView({ behavior: "smooth", block: "end" });
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
        if (lowerInput.includes('file organizer')) {
            return "The File Organizer is a tool to automatically sort your files into folders based on rules you define. You can launch it from the 'Windows Automation' section.";
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