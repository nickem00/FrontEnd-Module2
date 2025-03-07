document.addEventListener("DOMContentLoaded", async function() {
    // === Elements ===
    const postsContainer = document.getElementById("posts-container")

    // Modal
    const userModal = document.getElementById("user-modal")
    const modalProfileImg = document.getElementById("profile-img")
    const modalName = document.getElementById("modal-name")
    const modalJobTitle = document.getElementById("modal-job-title")
    const modalUsername = document.getElementById("modal-username")
    const modalEmail = document.getElementById("modal-email")
    const modalAddress = document.getElementById("modal-address")
    const closeModal = document.querySelector(".close")

    // Infinite Scroll
    const sentinel = document.getElementById("sentinel");
    
    // ===================================================

    // === Fetching & Creating posts ===
    // Fetch users first
    let users;
    try {
        let usersResponse = await fetch("https://dummyjson.com/users?limit=208");
        let usersData = await usersResponse.json();
        users = usersData.users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});
    } catch (error) {
        console.log("Error while getting user data:", error)
    }

    let comments;
    try {
        let commentsResponse = await fetch("https://dummyjson.com/comments?limit=0");
        let commentsData = await commentsResponse.json()
        // Assuming commentsData is an array of comment objects fetched from dummyjson.com
        comments = commentsData.comments.reduce((acc, comment) => {
            acc[comment.id] = comment;
            return acc;
        }, {});
    } catch (error) {
        console.log("Error while fetching comments:", error);
    }

    //
    let currentPage = 1;
    loadPosts(currentPage);

    // Observer for "<div id="sentinel"></div>" in posts.html
    // Used for "infinite scrolling" effect
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            currentPage++;
            loadPosts(currentPage);
        }
    }, {
        rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(sentinel);

    // Modal user view
    try {
        postsContainer.addEventListener("click", function(event) {
            if (event.target.classList.contains("username")) {
                event.preventDefault();
                const userId = event.target.getAttribute("data-userid");
                const user = users[userId] || { username: "Unknown User", email: "N/A", address: { city: "N/A", state: "N/A" } };

                if (user.username === "Unknown User") {
                    alert("User information is not available for this post.")
                    return;
                }

                modalProfileImg.src = `${user.image  || 'https://www.gravatar.com/avatar/?d=mp'}`
                modalUsername.innerText = `@${user.username}`;
                modalName.innerText = `${user.firstName.concat(" ", user.lastName)}`;
                modalJobTitle.innerText = `${user.company.title}`
                modalEmail.innerText = user.email;
                modalAddress.innerText = `${user.address.city}, ${user.address.state}`;

                userModal.style.display = "flex";
            }
        })

        closeModal.addEventListener("click", function() {
            userModal.style.display = "none";
        })
    } catch (error) {
        console.log("Error while constructing modal user view", error)
    }

    // ======================================================

    // === Functions ===
    async function loadPosts(page) {
        try {
            const skip = (page - 1) * 3; // Load 3 posts at a time
            const response = await fetch(`https://dummyjson.com/posts?limit=3&skip=${skip}`);
            const postsData = await response.json();

            postsData.posts.forEach(post => {
                const postElement = document.createElement("article")
                postElement.classList.add("post", "fade-fall");
    
                let user = users[post.userId] || {username: "Unknown user", email: "N/A", address: { city: "N/A", state: "N/A" } };
    
                const postComments = Object.values(comments).filter(comment => comment.postId === post.id);
    
                postElement.innerHTML = `
                    <div class="post-author">
                        <img class="comment-profile-img" src="${user.image} alt="Profile image of post author.">
                        <a href="#" class="username" data-userid="${post.userId}">@${user.username}</a>
                    </div>
                    <h2>${post.title}</h2>
                    <p class="post-body">${post.body}</p>
                    <div class="tags-react-grid">
                        <p><strong>Tags:</strong> ${post.tags.map(tag => `#${tag}`).join(' ')}</p>
                        <div class="reactions">
                            <p><i class="fa-solid fa-thumbs-up" style="color: var(--accent-color);"></i> ${post.reactions.likes}</p>
                            <p><i class="fa-solid fa-thumbs-down"></i> ${post.reactions.dislikes}</p>
                        </div>
                    </div>
                    <p class="comments-title"><strong>Comments</strong></p>
                    <div class="comments-div">
                        ${postComments.length ?
                            postComments.map(comment => {
                                const commentUser = users[comment.user.id] || { username: "Unknown user" };
                                return `
                                    <div class="comment">
                                        <img class="comment-profile-img" src="${commentUser.image || 'https://www.gravatar.com/avatar/?d=mp'}" alt="Profile picture of comment author.">
                                        <div>
                                            <p class="username" data-userid="${comment.user.id}">${commentUser.username}</p>
                                            <p>${comment.body}</p>
                                        </div>
                                    </div>
                                `;
                            }).join('')
                            : `
                                <div class="comment-null">
                                    <p>No comments yet!</p>
                            </div>
                        `}
                    </div>
                `;
    
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.log("Error while fetching posts data:", error);
            
        }
    } 
})