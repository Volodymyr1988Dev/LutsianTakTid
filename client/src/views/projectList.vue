<script setup lang="ts">

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../stores/project.store'
import { useThemeStore } from '../stores/theme.store'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const auth = useAuthStore()
const projectStore = useProjectStore()
const theme = useThemeStore()

onMounted(() => {
  projectStore.load()
})

async function logout(){

  await auth.logout()

  router.push('/login')

}
function openProject(id:string){

  router.push(`/projects/${id}`)

}

</script>

<template>

<div class="projects">

<header class="header">

<h1>Projects</h1>

<div class="actions">

<button
class="theme-btn"
@click="theme.toggle()"
>
Theme
</button>

<button
class="logout-btn"
@click="logout"
>
Logout
</button>

</div>

</header>

<div class="grid">

<div
v-for="p in projectStore.projects"
:key="p.id"
class="project-card"
@click="openProject(p.id)"
>

<div class="title">

{{ p.city }} — {{ p.address }}

</div>

</div>

</div>

</div>

</template>

<style scoped>

.projects{

max-width:1200px;
margin:auto;
padding:40px 20px;

}

.header{

display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;

}

.theme-btn{

padding:8px 14px;
border-radius:10px;
border:none;
cursor:pointer;

}

.grid{

display:grid;

grid-template-columns:
repeat(auto-fill,minmax(260px,1fr));

gap:24px;

}

.project-card{

padding:22px;

border-radius:14px;

background:var(--card);

cursor:pointer;

box-shadow:0 8px 24px var(--shadow);

transition:.25s;

}

.project-card:hover{

transform:translateY(-5px);

}

.title{

font-size:16px;
font-weight:600;

white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;

}
.logout-btn{

padding:8px 14px;

border-radius:10px;

border:none;

cursor:pointer;

background:#ff4d4f;

color:white;

font-weight:600;

}

.logout-btn:hover{

opacity:.9;

}
.actions{

display:flex;
gap:10px;

}
</style>