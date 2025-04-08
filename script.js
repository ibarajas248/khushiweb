function openSidebar() {
    document.getElementById("sidebar").classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
}

// Cerrar sidebar si se hace clic fuera de él
document.addEventListener("click", function(event) {
    let sidebar = document.getElementById("sidebar");
    let sidebarBtn = document.querySelector(".sidebar-btn");

    if (!sidebar.contains(event.target) && !sidebarBtn.contains(event.target)) {
        sidebar.classList.remove("active");
    }
});
