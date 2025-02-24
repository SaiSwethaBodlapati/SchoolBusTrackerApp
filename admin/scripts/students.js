var recipientId
var chatContainer = document.getElementById('chat-container');
var chatName = document.getElementById('chatName');
var recipientRole

document.addEventListener('DOMContentLoaded', async () => {

    const tableBody = document.querySelector('#studentsTable tbody');

    let students = [];

    async function fetchStudents() {
        try {
            const response = await fetch('/admin/students');
            if (response.ok) {
                let result = await response.json();
                students = result.students;
                renderStudents();
            } else {
                console.error('Failed to fetch students.');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    
    function renderStudents() {
       tableBody.innerHTML = '';
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.username}</td>
                <td>${student.class}</td>
                <td>${student.addressLine1}, ${student.addressLine2}, ${student.city}</td>
                <td class="actions">
                    <button class="chat" onclick="chatStudent('${student.username}', '${student.firstName}', '${student.lastName}')">Chat</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }


    await fetchStudents();
});

function logout() {
    alert('Logging out...');
}

async function chatStudent(id,fname,lname) {
    recipientId = id;
    chatContainer.style.display = "Block"
    chatName.innerHTML = fname +" "+ lname;
    recipientRole = "student"
}
