// ==================== QUESTIONS CONFIGURATION ====================
const questions = [
    { q: "👋 What's your full name?", key: "name", type: "text" },
    { q: "📧 What's your email address?", key: "email", type: "email" },
    { q: "📱 Please provide your 10-digit contact number", key: "contact", type: "tel" },
    { q: "💼 What's your current occupation?", key: "occupation", type: "text" },
    { q: "🏢 Which organization are you currently working with?", key: "organization", type: "text" },

    { q: "👔 Please select your preferred title", key: "title", type: "select", options: ["Mr", "Ms", "Mrs", "Dr", "Prof", "Others"] },
    { q: "✏️ Please specify your custom title", key: "other_title", type: "text", condition: (answers) => answers.title === "Others" },

    { q: "🎓 What's your highest educational qualification?", key: "qualification", type: "select", options: ["12th", "UG", "PG", "Doctorate", "Post Doctorate", "Others"] },
    { q: "📚 Please specify your specialization", key: "specialization", type: "text", condition: (answers) => ["UG","PG","Doctorate","Post Doctorate"].includes(answers.qualification) },
    { q: "📖 Please choose your stream", key: "stream", type: "select", options: ["Arts","Commerce","Medical","Non-Medical"], condition: (answers) => answers.qualification === "12th" },
    { q: "✏️ Please specify your course", key: "course", type: "text", condition: (answers) => answers.qualification === "Others" },

    { q: "📅 What year did you complete this qualification?", key: "passing_year", type: "number" },
    { q: "🎫 Please select your membership type", key: "membership_type", type: "select", options: ["A","B","C","D","E","F"] },

    { q: "📸 Please upload your profile picture", key: "profile_pic", type: "file", accept: "image/*" },
    { q: "🆔 Upload your Aadhaar card - Front side", key: "aadhaar_front", type: "file", accept: "image/*" },
    { q: "🆔 Upload your Aadhaar card - Back side", key: "aadhaar_back", type: "file", accept: "image/*" },

    { q: "🔒 Finally, create a secure password for your account", key: "password", type: "password" }
];

// ==================== STATE ====================
let currentIndex = 0;
let answers = {};

// ==================== INITIALIZATION ====================
window.onload = () => askQuestion();

// ==================== FUNCTIONS ====================
function askQuestion() {
    while (currentIndex < questions.length && questions[currentIndex].condition && !questions[currentIndex].condition(answers)) {
        currentIndex++;
    }

    if (currentIndex < questions.length) {
        const q = questions[currentIndex];
        showBotMsg(q.q);

        const inputSection = document.querySelector(".input-section");
        inputSection.innerHTML = "";

        if (q.type === "select") {
            const select = document.createElement("select");
            select.id = "userSelect";
            q.options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt;
                select.appendChild(option);
            });

            const btn = document.createElement("button");
            btn.textContent = "Submit";
            btn.onclick = () => {
                answers[q.key] = select.value;
                showUserMsg(select.value);
                currentIndex++;
                askQuestion();
            };

            inputSection.appendChild(select);
            inputSection.appendChild(btn);

        } else if (q.type === "file") {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.id = "userFile";
            if (q.accept) fileInput.accept = q.accept;

            const btn = document.createElement("button");
            btn.textContent = "Upload";
            btn.onclick = () => {
                const file = fileInput.files[0];
                if (file) {
                    answers[q.key] = file;
                    showUserMsg("Uploaded: " + file.name);
                    currentIndex++;
                    askQuestion();
                } else {
                    showBotMsg("Please select a file to upload.");
                }
            };

            inputSection.appendChild(fileInput);
            inputSection.appendChild(btn);

        } else {
            inputSection.innerHTML = `
                <input type="${q.type}" id="userInput" placeholder="Type your answer here..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">➤</button>
            `;
        }
    } else {
        document.getElementById("registerBtn").style.display = "block";
    }
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const val = input.value.trim();
    if (!val) return;

    const q = questions[currentIndex];
    answers[q.key] = val;

    showUserMsg(val);
    input.value = "";
    currentIndex++;
    askQuestion();
}

function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function showBotMsg(msg) {
    const chatbox = document.getElementById("chatbox");
    const div = document.createElement("div");
    div.className = "message bot";
    div.textContent = msg;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function showUserMsg(msg) {
    const chatbox = document.getElementById("chatbox");
    const div = document.createElement("div");
    div.className = "message user";
    div.textContent = msg;
    chatbox.appendChild(div);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// ==================== REGISTRATION SUBMIT ====================
function submitRegistration() {
    const formData = new FormData();
    Object.keys(answers).forEach(key => {
        if (answers[key] instanceof File) {
            formData.append(key, answers[key]);
        } else {
            formData.append(key, answers[key]);
        }
    });

    fetch("register.php", {
        method: "POST",
        body: formData
    }).then(res => res.json())
      .then(data => {
          if (data.success) {
              alert(data.message || "Registration successful! You can login now.");
              window.location.href = "login.html";
          } else {
              alert("Error: " + data.message);
          }
      })
      .catch(err => {
          alert("Unexpected error: " + err);
      });
}
