//ON PAGE LOAD: Read URL parameters 
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

   
    if (params.get("registered") === "true") {
        const msg = document.getElementById("register-success");
        if (msg) msg.classList.remove("d-none");
    }

    //  If coming from Index.htm pricing button and select option from button
    const ticket = params.get("ticket");
    if (ticket) {
        // Switch to Book tab
        document.getElementById("book-tab").click();

        // Pre-select the matching option in the dropdown
        const select = document.getElementById("ticket");
        if (select) {
            for (let option of select.options) {
                if (option.value === ticket) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    // Run price calculator on load
    calculateTotal();
});


// Login
function loginUser(event) {
    event.preventDefault();

    const email    = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    clearError("email-error");
    clearError("password-error");

    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showError("email-error", "Email address is required.");
        valid = false;
    } else if (!emailRegex.test(email)) {
        showError("email-error", "Please enter a valid email address.");
        valid = false;
    }

    if (!password) {
        showError("password-error", "Password is required.");
        valid = false;
    } else if (password.length < 6) {
        showError("password-error", "Password must be at least 6 characters.");
        valid = false;
    }

    if (!valid) return;

    const btn = event.target.querySelector("button[type=submit]");
    btn.disabled  = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in…';

    setTimeout(() => {
        btn.disabled  = false;
        btn.innerHTML = "Sign In";
        showToast("✅ Login Successful! Welcome back.", "success");
        // Switch to Book Tickets tab after login
        document.getElementById("book-tab").click();
    }, 1000);
}


// Price cal
function calculateTotal() {
    const ticketEl   = document.getElementById("ticket");
    const adultsEl   = document.getElementById("adults");
    const childrenEl = document.getElementById("children");
    const totalEl    = document.getElementById("total");
    const summaryEl  = document.getElementById("price-summary");

    if (!ticketEl || !totalEl) return;

    const price      = parseInt(ticketEl.value) || 0;
    const childPrice = Math.round(price / 2);
    const adults     = Math.max(0, parseInt(adultsEl.value)   || 0);
    const children   = Math.max(0, parseInt(childrenEl.value) || 0);
    const subtotal   = (adults * price) + (children * childPrice);
    const tax        = Math.round(subtotal * 0.18);
    const total      = subtotal + tax;

    totalEl.innerText = total;

    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="d-flex justify-content-between small">
                <span class="text-muted">Adults (${adults} × ₹${price})</span>
                <span>₹${adults * price}</span>
            </div>
            <div class="d-flex justify-content-between small">
                <span class="text-muted">Children (${children} × ₹${childPrice})</span>
                <span>₹${children * childPrice}</span>
            </div>
            <hr class="my-1">
            <div class="d-flex justify-content-between small text-muted">
                <span>GST (18%)</span><span>₹${tax}</span>
            </div>
            <div class="d-flex justify-content-between fw-bold">
                <span>Total</span><span class="text-danger">₹${total}</span>
            </div>`;
    }
}


// 3. HANDLE BOOKING 
function handleBooking(event) {
    event.preventDefault();

    const dateEl     = document.getElementById("date");
    const ticketEl   = document.getElementById("ticket");
    const adultsEl   = document.getElementById("adults");
    const childrenEl = document.getElementById("children");
    const totalEl    = document.getElementById("total");

    clearError("date-error");

    if (!dateEl.value) {
        showError("date-error", "Please select a visit date.");
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (dateEl.value < today) {
        showError("date-error", "Visit date cannot be in the past.");
        return;
    }

    const bookingId = "AJ-" + Math.floor(100000 + Math.random() * 900000);

    const booking = {
        id      : bookingId,
        date    : dateEl.value,
        ticket  : ticketEl.options[ticketEl.selectedIndex].text,
        price   : ticketEl.value,
        adults  : adultsEl.value,
        children: childrenEl.value,
        total   : totalEl.innerText,
        status  : "Confirmed",
        bookedOn: new Date().toISOString()
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem("aj_bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("aj_bookings", JSON.stringify(bookings));

    showToast(`🎉 Booking Confirmed! ID: ${bookingId}`, "success");

    const confirmDiv = document.getElementById("booking-confirm");
    if (confirmDiv) {
        confirmDiv.innerHTML = `
            <div class="alert alert-success rounded-3 mt-3">
                <h6 class="fw-bold mb-2"> Booking Confirmed!</h6>
                <div class="small">
                    <div><strong>Booking ID:</strong> ${bookingId}</div>
                    <div><strong>Date:</strong> ${booking.date}</div>
                    <div><strong>Ticket:</strong> ${booking.ticket}</div>
                    <div><strong>Adults:</strong> ${booking.adults} &nbsp;
                         <strong>Children:</strong> ${booking.children}</div>
                    <div><strong>Total Paid:</strong> ₹${booking.total}</div>
                </div>
                <hr>
                <small class="text-muted">
                    Use Booking ID <strong>${bookingId}</strong> in the
                    <a href="#" onclick="document.getElementById('cancel-tab').click();return false;">
                    Cancel/Modify tab</a> to manage this booking.
                </small>
            </div>`;
    }
}


// 4. FIND BOOKING 
function findBooking(event) {
    if (event) event.preventDefault();

    const inputId   = document.getElementById("booking-id").value.trim().toUpperCase();
    const inputPhone= document.getElementById("phone").value.trim();
    const resultDiv = document.getElementById("booking-result");

    if (!inputId || !inputPhone) {
        showToast("⚠️ Please fill in both Booking ID and Phone.", "warning");
        return;
    }

    const bookings = JSON.parse(localStorage.getItem("aj_bookings")) || [];
    const found    = bookings.find(b => b.id === inputId);

    if (!found) {
        resultDiv.innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-x-circle me-2"></i>
                No booking found for <strong>${inputId}</strong>. Please check your Booking ID.
            </div>`;
        return;
    }

    const visitDate  = new Date(found.date);
    const diffHours  = (visitDate - new Date()) / (1000 * 60 * 60);
    const refundText = diffHours > 48 ? "Full Refund Eligible"
                     : diffHours > 24 ? "50% Refund Eligible"
                     :                  "No Refund (within 24 hrs)";
    const refundClass= diffHours > 48 ? "text-success"
                     : diffHours > 24 ? "text-warning"
                     :                  "text-danger";
    const isCancelled = found.status === "Cancelled";

    resultDiv.innerHTML = `
        <div class="card mt-3 border-0 shadow-sm rounded-4">
            <div class="card-body">
                <h6 class="fw-bold mb-3">
                    <i class="bi bi-ticket-perforated me-2 text-danger"></i>Booking Details
                </h6>
                <table class="table table-sm table-borderless mb-2 small">
                    <tr><td class="text-muted">Booking ID</td><td><strong>${found.id}</strong></td></tr>
                    <tr><td class="text-muted">Visit Date</td><td>${found.date}</td></tr>
                    <tr><td class="text-muted">Ticket</td><td>${found.ticket}</td></tr>
                    <tr><td class="text-muted">Adults</td><td>${found.adults}</td></tr>
                    <tr><td class="text-muted">Children</td><td>${found.children}</td></tr>
                    <tr><td class="text-muted">Total Paid</td><td>₹${found.total}</td></tr>
                    <tr>
                        <td class="text-muted">Status</td>
                        <td><span class="badge ${isCancelled ? 'bg-secondary' : 'bg-success'}">
                            ${found.status}</span></td>
                    </tr>
                    ${!isCancelled ? `
                    <tr>
                        <td class="text-muted">Refund</td>
                        <td class="${refundClass} fw-semibold">${refundText}</td>
                    </tr>` : ""}
                </table>
                ${!isCancelled ? `
                <button class="btn btn-danger w-100 mt-2"
                    onclick="cancelBooking('${found.id}')">
                    <i class="bi bi-x-circle me-2"></i>Cancel This Booking
                </button>` : `
                <p class="text-muted text-center small mt-2">This booking is already cancelled.</p>`}
            </div>
        </div>`;
}


//  5. CANCEL BOOKING 
function cancelBooking(id) {
    if (!confirm(`Cancel booking ${id}?\nThis cannot be undone.`)) return;

    const bookings = JSON.parse(localStorage.getItem("aj_bookings")) || [];
    const idx      = bookings.findIndex(b => b.id === id);
    if (idx === -1) { showToast("Booking not found.", "warning"); return; }

    bookings[idx].status = "Cancelled";
    localStorage.setItem("aj_bookings", JSON.stringify(bookings));

    showToast("❌ Booking cancelled. Refund in 5–7 business days.", "danger");

    const badge = document.querySelector("#booking-result .badge");
    const btn   = document.querySelector("#booking-result .btn-danger");
    if (badge) { badge.textContent = "Cancelled"; badge.className = "badge bg-secondary"; }
    if (btn)   btn.remove();
}


//6. HELPERS 
function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.remove("d-none"); }
}

function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ""; el.classList.add("d-none"); }
}

function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText =
            "position:fixed;top:75px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
        document.body.appendChild(container);
    }
    if (!document.getElementById("toast-kf")) {
        const s = document.createElement("style");
        s.id = "toast-kf";
        s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}`;
        document.head.appendChild(s);
    }
    const colors = { success:"#198754", danger:"#dc3545", warning:"#e6a817" };
    const toast  = document.createElement("div");
    toast.style.cssText = `
        background:${colors[type]||"#333"};
        color:${type==="warning"?"#000":"#fff"};
        padding:12px 18px;border-radius:10px;font-size:0.875rem;
        box-shadow:0 4px 18px rgba(0,0,0,0.15);
        animation:toastIn 0.3s ease;max-width:300px;`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.transition="opacity 0.4s"; toast.style.opacity="0"; }, 3000);
    setTimeout(() => toast.remove(), 3400);
}
