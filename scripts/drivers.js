var recipientId
var chatContainer = document.getElementById('chat-container');
var chatName = document.getElementById('chatName');
var recipientRole

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('addDriverForm');
    const tableBody = document.querySelector('#driversTable tbody');

    let drivers = [];

    async function fetchDrivers() {
        try {
            const response = await fetch('/admin/drivers');
            if (response.ok) {
                let result = await response.json();
                drivers = result.drivers;
                renderDrivers();
            } else {
                console.error('Failed to fetch drivers.');
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    }

    
    function renderDrivers() {
       tableBody.innerHTML = '';
        drivers.forEach((driver, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${driver.firstName}</td>
                <td>${driver.lastName}</td>
                <td>${driver.username}</td>
                <td class="actions">
                    <button class="delete" onclick="deleteDriver('${driver._id}')">Delete</button>
                </td>
                <td class="actions">
                    <button class="chat" onclick="chatDriver('${driver.username}', '${driver.firstName}', '${driver.lastName}')">Chat</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const username = document.getElementById('username').value;

        if (firstName && lastName && username) {
            try {
                const response = await fetch('/admin/drivers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firstName, lastName, username }),
                });

                if (response.ok) {
                    const result = await response.json();
                    drivers.push(result.driver);
                    renderDrivers();
                    form.reset();
                } else {
                    console.error('Failed to add driver.');
                }
            } catch (error) {
                console.error('Error adding driver:', error);
            }
        }
    });



    window.deleteDriver = async (id) => {
        try {
            const response = await fetch(`/admin/drivers/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                drivers = drivers.filter((driver) => driver._id !== id);
                renderDrivers();
            } else {
                console.error('Failed to delete driver.');
            }
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };

    await fetchDrivers();
});

function logout() {
    alert('Logging out...');
}

async function chatDriver(id,fname,lname) {
    recipientId = id;
    chatContainer.style.display = "Block"
    chatName.innerHTML = fname +" "+ lname;
    recipientRole = "driver"
}
