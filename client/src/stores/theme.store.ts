import { defineStore } from "pinia"
import { ref } from "vue"

export const useThemeStore = defineStore("theme", () => {

const theme = ref(localStorage.getItem("theme") || "standard")

function applyTheme(t:string){

theme.value = t

if(t === "dark"){
document.documentElement.setAttribute("data-theme","dark")
}else{
document.documentElement.removeAttribute("data-theme")
}

localStorage.setItem("theme",t)

}

function toggle(){

applyTheme(theme.value === "dark" ? "standard" : "dark")

}

applyTheme(theme.value)

return {theme,toggle}

})