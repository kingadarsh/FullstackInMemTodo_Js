const BaseApi="http://localhost:3000";

function CreateComponents(content){
    const div=document.createElement("div");
    const h1=document.createElement("h1");
    const DelButton=document.createElement("button");
    const UpdateButton=document.createElement("button");
    DelButton.innerHTML="Delete";
    UpdateButton.innerHTML="Update"
    DelButton.setAttribute("onclick",`DeleteTodo(${id})`);
    UpdateButton.setAttribute("onclick",`UpdateTodo(${id})`);

    h1.innerHTML=content;
    div.append(h1);
    div.append(UpdateButton);
    div.append(DelButton);
    return div;
}

function DisplayInfo(content){
    

}

async function SignUp(){
    const username=document.getElementById("SignUpUsername").value;
    const password=document.getElementById("SignUpPassword").value;

try{
    await axios.post(`${BaseApi}/signup`,{
        username:username,
        password:password
    });
    alert("You have been Signed Up successfully");
}
catch(err){
    alert("There was a Problem Signing you Un");
}

}

async function SignIn(){
    const username=document.getElementById("SignInUsername").value;
    const password=document.getElementById("SignInPassword").value;

try{
    const response = await axios.post(`${BaseApi}/signin`,{
        username:username,
        password:password
    });
   
    localStorage.setItem("token",response.data.token);
    alert("You have been Signed In successfully");

    
}
catch(err){
    alert("There was a Problem Signing you In");
}

}

async function AddTodo(){
    const content=document.getElementById("AddTodoContent").value.trim();
    if(content==""){
        alert("Enter some Value");
        return;
    }

    try {
        await axios.post(`${BaseApi}/todo`, {
            content: content
        }, {
            headers: {
                token: localStorage.getItem("token")
            }
        });

       
    } catch (error) {
        console.error("Error adding todo:", error);
       
    }

    DisplayInfo(content);


}


