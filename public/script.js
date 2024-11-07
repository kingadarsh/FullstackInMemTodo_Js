const BaseApi = "http://localhost:3000";

// Function to create a todo component dynamically
function CreateComponents(content, id) {
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    const DelButton = document.createElement("button");
    const UpdateButton = document.createElement("button");

    DelButton.innerHTML = "Delete";
    UpdateButton.innerHTML = "Update";
    
    // Set the onclick attribute to pass the specific todo id
    DelButton.setAttribute("onclick", `DeleteTodo(${id})`);
    UpdateButton.setAttribute("onclick", `UpdateTodo(${id})`);

    h1.innerHTML = content;
    div.append(h1, UpdateButton, DelButton);
    return div;
}

// Function to display all todos
async function DisplayInfo() {
    try {
        const response = await axios.get(`${BaseApi}/todo`, {
            headers: {
                token: localStorage.getItem("token")
            }
        });

        const todos = response.data.todos;
        const displayContentDiv = document.getElementById("DisplayContent");
        displayContentDiv.innerHTML = ""; // Clear previous content

        todos.forEach(todo => {
            const todoComponent = CreateComponents(todo.content, todo.id);
            displayContentDiv.appendChild(todoComponent);
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// SignUp function
async function SignUp() {
    const username = document.getElementById("SignUpUsername").value;
    const password = document.getElementById("SignUpPassword").value;

    try {
        await axios.post(`${BaseApi}/signup`, { username, password });
        alert("You have been signed up successfully");
    } catch (err) {
        alert("There was a problem signing you up");
    }
}

// SignIn function
async function SignIn() {
    const username = document.getElementById("SignInUsername").value;
    const password = document.getElementById("SignInPassword").value;

    try {
        const response = await axios.post(`${BaseApi}/signin`, { username, password });
        localStorage.setItem("token", response.data.token);
        alert("You have been signed in successfully");

        // Display todos after sign-in
        DisplayInfo();
    } catch (err) {
        alert("There was a problem signing you in");
    }
}

// AddTodo function
async function AddTodo() {
    const content = document.getElementById("AddTodoContent").value.trim();
    if (content === "") {
        alert("Enter some value");
        return;
    }

    try {
        await axios.post(`${BaseApi}/todo`, { content }, {
            headers: { token: localStorage.getItem("token") }
        });
        
        document.getElementById("AddTodoContent").value = ""; // Clear input
        DisplayInfo(); // Refresh the todo list
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

// DeleteTodo function
async function DeleteTodo(id) {
    try {
        await axios.delete(`${BaseApi}/todo/${id}`, {
            headers: { token: localStorage.getItem("token") }
        });
        
        DisplayInfo(); // Refresh the todo list
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

// UpdateTodo function (you may want to prompt for new content here)
async function UpdateTodo(id) {
    const newContent = prompt("Enter the updated content for the todo:");
    if (!newContent) return;

    try {
        await axios.put(`${BaseApi}/todo/${id}`, { content: newContent }, {
            headers: { token: localStorage.getItem("token") }
        });
        
        DisplayInfo(); // Refresh the todo list
    } catch (error) {
        console.error("Error updating todo:", error);
    }
}

// Logout function
function Logout() {
    localStorage.removeItem("token");
    alert("You have been logged out.");
    // Optionally, refresh or redirect to the sign-in section here
}
