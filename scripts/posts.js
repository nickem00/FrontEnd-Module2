// Global variables
let users = {};
let comments = {};
let postsContainer;
let currentPage = 1;
let isLoading = false;


document.addEventListener("DOMContentLoaded", async function() {
    console.log("DOM loaded, fetching users and comments.");
    
    // === Elements ===
    // Posts Container
    postsContainer = document.getElementById("posts-container")

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
    // Fetch users and comments first to ensure correct loading
    const isDataLoaded = await fetchUsersAndComments();
    if (isDataLoaded) {
        console.log("Users and comment successfully loaded. Now fetching posts..")
        loadPosts(1);
    } else {
        console.log("Failed to load users/comments, skipping posts loading.");
    }
    

    // Observer for "<div id="sentinel"></div>" in posts.html
    // Used for "infinite scrolling" effect
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            observer.unobserve(sentinel)
            currentPage++;
            loadPosts(currentPage).then(() => {
                observer.observe(sentinel);
            })
        }
    }, {
        rootMargin: '0px 0px -100px 0px' // Load posts 100px before reaching the sentinel
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
});


// === Functions ===
/**
 * Fetches posts from the API an displays them using displayPosts()
 * @param {number} page - Page number for fetching next posts
 */
async function loadPosts(page) {
    if (isLoading) return;
    isLoading = true;

    try {
        let limit, skip;
        if (page === 1) {
            limit = 6;
            skip = 0;
        } else {
            limit = 3;
            skip = 6 + (page - 2) * 3;
        }
        console.log(`Loading posts for page: ${page}`)
        const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
        const postsData = await response.json();

        postsData.posts.forEach(post => {
            displayPosts(post);
        });

    } catch (error) {
        console.log("Error while fetching posts data:", error);
        displayError(`There was an error loading posts. Try refreshing the page.`)
    } finally {
        isLoading = false;
    }
}

/**
 * Displays an error message on the page
 * @param {string} message - The message to be shown
 */
function displayError(message) {
    const mainSection = document.querySelector("main");
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-notif")
    mainSection.innerHTML = "";

    errorDiv.innerHTML = `
        <p class="posts-error-msg">${message}</p>
    `;
    mainSection.appendChild(errorDiv);
}

/**
 * Fetches users and comments from the API.
 * If all goes well, it returns true, else false.
 * @returns {Promise<boolean>}
 */
async function fetchUsersAndComments() {
    try {
        // Fetch all users
        // Limit set to include all users.
        let usersResponse = await fetch("https://dummyjson.com/users?limit=208"); 
        let usersData = await usersResponse.json(); // Convert to json
        users = usersData.users.reduce((acc, user) => {
            acc[user.id] = user;  // Convert array of users to an object with user IDs as keys
            return acc;
        }, {});
    } catch (error) {
        console.log("Error while getting user data:", error)
        displayError(`There was an error fetching user data. Try refreshing the page.`)
        return false;
    }
    

    try {
        // Fetch all comments.
        let commentsResponse = await fetch("https://dummyjson.com/comments?limit=0");
        let commentsData = await commentsResponse.json()
        comments = commentsData.comments.reduce((acc, comment) => {
            acc[comment.id] = comment; // Convert array of comment to an object with comment IDs as keys
            return acc;
        }, {});
    } catch (error) {
        console.log("Error while fetching comments:", error);
        alert("Error while fetching comments. Try reloading the page.")
        return false;
    }

    return true;
}

/**
 * Creates an HTML-element for a post and adds it to the DOM
 * @param {object} post - The object with data for the post
 */
async function displayPosts(post) {
    const postElement = document.createElement("article")
    postElement.classList.add("post", "fade-fall");
    let user = users[post.userId] || {username: "Unknown user", email: "N/A", address: { city: "N/A", state: "N/A" } };

    // Filter comments tied to the current post
    const postComments = Object.values(comments).filter(comment => comment.postId === post.id);

    postElement.innerHTML = `
        <div class="post-author">
            <img class="comment-profile-img" src="${user.image}" alt="Profile image of post author.">
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
}