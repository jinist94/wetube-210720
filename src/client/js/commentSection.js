const { default: fetch } = require("node-fetch");
const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".delBtn");


const deleteComentElement = (element) =>{
    element.remove();
}
const addComment = (text, id) =>{
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    const span = document.createElement("span");
    const delBtn = document.createElement("span");
    span.innerText = text;
    delBtn.innerText = "❌"
    icon.className = "fas fa-comment";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(delBtn);
    videoComments.prepend(newComment);

}

const handleSubmit = async (event) => {
    const textarea = form.querySelector("textarea");
    event.preventDefault();
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === ""){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({text}),
    });
    const {newCommentId} = await response.json();
    console.log(json);
    if(response.status === 201){
        textarea.value = "";
        addComment(text, newCommentId);
    }


};

const handleDelete = async (event) =>{
    const commentList = event.target.parentNode;
    const commentId = commentList.dataset.id
    const videoId = videoContainer.dataset.id;
    const response = await fetch(`/api/videos/${commentId}/delete`, {
        method: "DELETE",
    });
    if(response.status === 200){
        deleteComentElement(commentList);
    }
}

if(form){
    form.addEventListener("submit", handleSubmit);
}

for (let i = 0; i< delBtn.length; i++) {
    delBtn[i].addEventListener("click", handleDelete);
}

console.log(delBtn);