function loadNavbar(){

    const navbar =`
    <nav class="navbar navbar-dark fixed-top" id="main-navbar">
        <div class="container-fluid px-4">

            <!-- Brand -->
            <a class="navbar-brand d-flex align-items-center gap-2" href="Index.htm">
                <div class="nav-logo-box">AJ</div>
                <span id="logo-text">AJ Park</span>
            </a>

            <!-- Desktop links (hidden on mobile) -->
            <div class="d-none d-lg-flex align-items-center gap-1" id="desktop-links">
                <a class="nav-pill active" href="Index.htm">Home</a>
                <a class="nav-pill" href="#pricing">Water Park</a>
                <a class="nav-pill" href="#pricing">Amusement Park</a>
                <a class="nav-pill" href="#pricing">Pricing</a>
                <a class="nav-pill" href="./OC.html">Contact</a>
                <a class="nav-pill" href="https://maps.app.goo.gl/BUDXy58p42X7SmG9A">Location</a>
            </div>

            <div class="d-flex align-items-center gap-3">
                <!-- Book Now CTA -->
                <a href="./booking.html" class="btn-book d-none d-lg-block">Book Now</a>

                <!-- Hamburger (mobile only) -->
                <button class="navbar-toggler custom-tog d-lg-none" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Offcanvas -->
    <div class="offcanvas offcanvas-end custom-canvas" tabindex="-1" id="mobileMenu">
        <div class="offcanvas-header">
            <div class="d-flex align-items-center gap-2">
                <div class="nav-logo-box">AJ</div>
                <span id="logo-text" style="font-size:20px">AJ Park</span>
            </div>
            <button type="button" class="canvas-close" data-bs-dismiss="offcanvas">✕</button>
        </div>
        <div class="offcanvas-body p-0">
            <div class="canvas-section-label">Navigate</div>
            <a class="canvas-item" href="Index.htm" data-bs-dismiss="offcanvas">
                Home <span class="canvas-arrow">›</span>
            </a>
            <a class="canvas-item" href="#pricing" data-bs-dismiss="offcanvas">
                Water Park <span class="canvas-arrow">›</span>
            </a>
            <a class="canvas-item" href="#pricing" data-bs-dismiss="offcanvas">
                Amusement Park <span class="canvas-arrow">›</span>
            </a>
            <a class="canvas-item" href="#pricing" data-bs-dismiss="offcanvas">
                Pricing <span class="canvas-arrow">›</span>
            </a>
            <a class="canvas-item" href="./OC.html" data-bs-dismiss="offcanvas">
                Contact Us <span class="canvas-arrow">›</span>
            </a>
            <div class="canvas-section-label">Tickets</div>
            <a class="canvas-item canvas-book" href="./booking.html">
                Book Tickets &nbsp;<span class="canvas-badge">HOT</span>
                <span class="canvas-arrow">›</span>
            </a>
        </div>
    </div>
    `
    document.getElementById("navbar").innerHTML=navbar;
        
}


