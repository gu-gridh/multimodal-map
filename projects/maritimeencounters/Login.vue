<template>
    <div class="about-container" v-bind:class="{ fullopacity: visibleLogin }"
        :style="{ display: displayAbout ? 'block' : 'none' }">
        <div class="flex-machine">
            <div class="red-content">
                <form @submit.prevent="handleLogin">
                    <div>
                        <label for="username">Username:</label>
                        <input id="username" v-model="username" type="text" required />
                    </div>
                    <div>
                        <label for="password">Password:</label>
                        <input id="password" v-model="password" type="password" required />
                    </div>
                    <button type="submit" class="p-1 px-2 category-button login-button">
                        Login
                    </button>
                </form>
                <button @click="$emit('close')">
                    <div class="p-1 px-2 category-button"
                        style="width:auto; padding:5px 15px; text-align: center; cursor: pointer;">Close</div>
                </button>
            </div>
        </div>
        <div class="about-logos-container">
            <div class="about-logo about-logo-bottom"></div>
            <div class="about-logo about-logo-bottom2"></div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "aboutview",
    props: {
        visibleLogin: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            displayAbout: this.visibleLogin,
            username: '',
            password: '',
        };
    },
    watch: {
        visibleLogin(newVal) {
            if (newVal) {
                this.displayAbout = true;
            } else {
                setTimeout(() => {
                    this.displayAbout = false;
                }, 1000);
            }
        },
    },
    methods: {
        async handleLogin() {
            try {
                const response = await fetch('xxxxxxx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('login failed:', errorData);
                    alert('Login failed.');
                    return;
                }

                const responseData = await response.json();
                console.log('login successful:', responseData);
                //successful login
                this.$emit('close');
            } catch (error) {
                console.error('error during login:', error.message);
                alert('An error occurred during login.');
            }
        },
    },
};
</script>

<style scoped>
.about-container {
    color: black;
    overflow-y: auto;
    background: linear-gradient(90deg, rgba(245, 235, 225, 1) 0%, rgba(245, 235, 225, 0.8) 100%) !important;
    padding-bottom: 40px !important;
}

.flex-machine {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.red-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 400px;
    max-width: 90%;
    margin-top: 10%;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

form label {
    font-size: 1.2em;
}

form input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
}

form button {
    width: 100%;
    padding: 10px;
    font-size: 1.2em;
    background: var(--theme-4);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

form button:hover {
    background: var(--theme-4);
}

.category-button {
    margin-top: 20px;
}

button .category-button {
    width: auto;
    padding: 5px 15px;
    text-align: center;
    cursor: pointer;
}

.fullopacity {
    backdrop-filter: blur(5px);
    background: linear-gradient(90deg, rgba(245, 235, 225, 1) 0%, rgba(245, 235, 225, 0.8) 100%) !important;
}

.login-button {
    width: 100px;
    padding: 8px; 
    font-size: 1em;
    background: var(--theme-4);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    transition: background 0.3s ease;
}
</style>