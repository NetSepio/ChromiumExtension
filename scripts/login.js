document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginButton').addEventListener('click', gotoWalletPage, false);
    document.getElementById('registerButton').addEventListener('click', gotoWalletPage, false);
});

function gotoWalletPage() {
    window.location.href = "wallet.html";
}